import type { PlanId } from "./commercial";
import policy from "./pricing-policy.json";
import { calculateAicPurchase, forecastAic } from "./aic-packs";

export {
  aicVolumeBands,
  legacyAicPacks,
  aicCatalogueVersion,
  maxAicPurchaseCredits,
  calculateAicPurchase,
  forecastAic,
  recommendAicPurchase,
} from "./aic-packs";

export const pricingPolicy = policy;
export const planIds: readonly PlanId[] = ["starter", "pro", "enterprise"];

export function isPlanId(value: unknown): value is PlanId {
  return value === "starter" || value === "pro" || value === "enterprise";
}

export function assertPricingVersion(version: string) {
  if (version !== pricingPolicy.version) throw new RangeError("Unsupported pricing version.");
}

export function assertQuantity(
  value: number,
  maximum = pricingPolicy.validation.maxMonthlyQuantity
) {
  if (!Number.isSafeInteger(value) || value < 0 || value > maximum) {
    throw new RangeError(`Enter a whole number between 0 and ${maximum}.`);
  }
}

export function assertStudentCount(students: number) {
  assertQuantity(students, pricingPolicy.validation.maxStudents);
  if (students < pricingPolicy.validation.minStudents)
    throw new RangeError(
      `The minimum enrolment is ${pricingPolicy.validation.minStudents} students.`
    );
}

function safeMoney(paise: number) {
  if (!Number.isSafeInteger(paise) || paise < 0)
    throw new RangeError("Amount exceeds safe precision.");
  return paise;
}

// Validate the published policy at the owning boundary, before any quote is possible.
let previousCeiling = 0;
for (const [index, slab] of pricingPolicy.studentSlabs.entries()) {
  if (slab.upTo === null && index !== pricingPolicy.studentSlabs.length - 1) {
    throw new RangeError("Only the final student slab may be open-ended.");
  }
  if (slab.upTo !== null && (!Number.isSafeInteger(slab.upTo) || slab.upTo <= previousCeiling)) {
    throw new RangeError("Student slab ceilings must increase.");
  }
  for (const plan of planIds) {
    if (safeMoney(slab.ratesPaise[plan]) === 0)
      throw new RangeError("A student rate must be positive.");
  }
  previousCeiling = slab.upTo ?? previousCeiling;
}
if (pricingPolicy.studentSlabs.at(-1)?.upTo !== null) throw new RangeError("Missing final slab.");
for (const plan of planIds) safeMoney(pricingPolicy.addOns.entraSsoAnnualPaise[plan]);
safeMoney(pricingPolicy.addOns.whiteLabelAndroidAndIosOncePaise);
safeMoney(pricingPolicy.communication.purchasedCreditPaise);

export function calculateLicence(plan: PlanId, students: number) {
  assertStudentCount(students);
  if (!isPlanId(plan)) throw new RangeError("Choose a supported plan.");
  let lowerBound = 0;
  const slabs = pricingPolicy.studentSlabs.map((slab) => {
    const count = Math.max(0, Math.min(students, slab.upTo ?? students) - lowerBound);
    const row = {
      from: lowerBound + 1,
      to: slab.upTo,
      students: count,
      ratePaise: slab.ratesPaise[plan],
      totalPaise: safeMoney(count * slab.ratesPaise[plan]),
    };
    lowerBound = slab.upTo ?? students;
    return row;
  });
  return {
    slabs,
    annualLicencePaise: safeMoney(slabs.reduce((total, slab) => total + slab.totalPaise, 0)),
  };
}

export type AddOns = {
  sso: boolean;
  dataEventsApi?: boolean;
  whiteLabel: boolean;
  brandingAlreadyPurchased: boolean;
};
export const noAddOns: AddOns = { sso: false, whiteLabel: false, brandingAlreadyPurchased: false };

export function unavailableAddOns(plan: PlanId, addOns: AddOns) {
  const unavailable: Array<"sso" | "whiteLabel"> = [];
  if (addOns.sso && !pricingPolicy.addOns.entraSsoEligiblePlans.includes(plan))
    unavailable.push("sso");
  if (addOns.whiteLabel && !pricingPolicy.addOns.whiteLabelEligiblePlans.includes(plan))
    unavailable.push("whiteLabel");
  return unavailable;
}

export type ApiPeakRequirement = { requests: number; windowSeconds: number };
export type DataEventsApiPricing = {
  annualDataEventsApiPaise: Readonly<Record<PlanId, number | null>>;
  slidingWindows: Readonly<Record<PlanId, ApiPeakRequirement | null>>;
};
export const publicDataEventsApiPricing: DataEventsApiPricing = {
  annualDataEventsApiPaise: pricingPolicy.addOns.annualDataEventsApiPaise,
  slidingWindows: pricingPolicy.dataEventsApi.slidingWindows,
};

function assertApiWindow(window: ApiPeakRequirement) {
  assertQuantity(window.requests, Number.MAX_SAFE_INTEGER);
  assertQuantity(window.windowSeconds, Number.MAX_SAFE_INTEGER);
  if (window.windowSeconds === 0) throw new RangeError("An API window must have a duration.");
}

function assertDataEventsApiPricing(api: DataEventsApiPricing) {
  for (const plan of planIds) {
    const fee = api.annualDataEventsApiPaise[plan];
    if (fee !== null && safeMoney(fee) === 0)
      throw new RangeError("A configured annual API fee must be positive.");
    const limit = api.slidingWindows[plan];
    if (limit !== null) {
      assertApiWindow(limit);
      if (limit.requests === 0) throw new RangeError("A configured API limit must be positive.");
    }
  }
}
assertDataEventsApiPricing(publicDataEventsApiPricing);

export type ApiCapacityAssessment =
  | { status: "not_requested" | "not_assessed" }
  | { status: "unassessed"; reason: "unconfigured_limit" | "different_window" }
  | { status: "fits" | "insufficient"; limit: ApiPeakRequirement };

export function assessApiCapacity(
  plan: PlanId,
  selected: boolean,
  peak: ApiPeakRequirement | undefined,
  api: DataEventsApiPricing = publicDataEventsApiPricing
): ApiCapacityAssessment {
  if (!selected) return { status: "not_requested" };
  if (!peak) return { status: "not_assessed" };
  assertApiWindow(peak);
  const limit = api.slidingWindows[plan];
  if (limit === null) return { status: "unassessed", reason: "unconfigured_limit" };
  // A peak in one rolling window cannot establish a peak in another by averaging.
  if (limit.windowSeconds !== peak.windowSeconds)
    return { status: "unassessed", reason: "different_window" };
  return { status: peak.requests <= limit.requests ? "fits" : "insufficient", limit };
}

export type TaxPolicy = { basisPoints: number; rounding: "half_up_per_line" };

function configuredEstimateTax(): TaxPolicy | null {
  const { basisPoints, rounding } = pricingPolicy.tax;
  if (basisPoints === null || rounding === null) return null;
  assertQuantity(basisPoints, 10000);
  if (rounding !== "half_up_per_line") throw new RangeError("Unsupported tax rounding policy.");
  return { basisPoints, rounding };
}

export const publicEstimateTax = configuredEstimateTax();

export function taxPaise(amountPaise: number, tax: TaxPolicy) {
  safeMoney(amountPaise);
  assertQuantity(tax.basisPoints, 10000);
  if (tax.rounding !== "half_up_per_line") throw new RangeError("Unsupported tax rounding policy.");
  return safeMoney(
    Number((BigInt(amountPaise) * BigInt(tax.basisPoints) + BigInt(5000)) / BigInt(10000))
  );
}

export function calculateFixedEstimate(
  plan: PlanId,
  students: number,
  addOns: AddOns = noAddOns,
  version = pricingPolicy.version,
  tax: TaxPolicy | null = null,
  api: DataEventsApiPricing = publicDataEventsApiPricing,
  selectedAicCredits = 0
) {
  assertPricingVersion(version);
  assertDataEventsApiPricing(api);
  const licence = calculateLicence(plan, students);
  const unavailable = unavailableAddOns(plan, addOns);
  const annualSsoPaise = addOns.sso ? pricingPolicy.addOns.entraSsoAnnualPaise[plan] : 0;
  const annualDataEventsApiPaise = addOns.dataEventsApi ? api.annualDataEventsApiPaise[plan] : 0;
  const missingPriceComponents =
    annualDataEventsApiPaise === null
      ? [{ component: "data_events_api" as const, billingPeriod: "annual" as const }]
      : [];
  const newBrandingPaise =
    addOns.whiteLabel &&
    !addOns.brandingAlreadyPurchased &&
    !pricingPolicy.addOns.whiteLabelIncludedPlans.includes(plan)
      ? pricingPolicy.addOns.whiteLabelAndroidAndIosOncePaise
      : 0;
  const recurringFixedPaise = safeMoney(
    licence.annualLicencePaise + annualSsoPaise + (annualDataEventsApiPaise ?? 0)
  );
  const firstYearFixedPaise = safeMoney(recurringFixedPaise + newBrandingPaise);
  const prepaidAic = calculateAicPurchase(selectedAicCredits);
  const purchaseYearWithPrepaidPaise = safeMoney(firstYearFixedPaise + prepaidAic.totalPaise);
  // Displayed tax lines reconcile to the same sum. No tax configuration means unknown tax.
  const recurringTaxPaise =
    tax === null || annualDataEventsApiPaise === null || unavailable.length > 0
      ? null
      : taxPaise(licence.annualLicencePaise, tax) +
        taxPaise(annualSsoPaise, tax) +
        taxPaise(annualDataEventsApiPaise, tax);
  const firstYearTaxPaise =
    recurringTaxPaise === null || tax === null
      ? null
      : recurringTaxPaise + taxPaise(newBrandingPaise, tax) + taxPaise(prepaidAic.totalPaise, tax);
  return {
    ...licence,
    plan,
    students,
    pricingVersion: version,
    annualSsoPaise,
    annualDataEventsApiPaise,
    unavailableAddOns: unavailable,
    eligible: unavailable.length === 0,
    missingPriceComponents,
    complete: missingPriceComponents.length === 0 && unavailable.length === 0,
    newBrandingPaise,
    recurringFixedPaise,
    firstYearFixedPaise,
    prepaidAic,
    purchaseYearWithPrepaidPaise,
    renewalFixedPaise: recurringFixedPaise,
    recurringTaxPaise,
    firstYearTaxPaise,
    renewalIncludingTaxPaise:
      recurringTaxPaise === null ? null : safeMoney(recurringFixedPaise + recurringTaxPaise),
    firstYearIncludingTaxPaise:
      firstYearTaxPaise === null
        ? null
        : safeMoney(purchaseYearWithPrepaidPaise + firstYearTaxPaise),
    monthlyCommunicationCredits:
      students * pricingPolicy.communication.monthlyCreditsPerStudent[plan],
    monthlyIncludedMilliAic: pricingPolicy.plans[plan].monthlyIncludedMilliAic,
  };
}

export type CommunicationMonth = {
  smsRecipientSegments: number;
  recipientEmails: number;
  whatsappRecipientMessages: Readonly<Record<string, number>>;
};

export function communicationDemandSubcredits(
  month: CommunicationMonth,
  whatsappWeights: Readonly<Record<string, number>> = pricingPolicy.communication
    .whatsappWeightsSubcredits
): number | null {
  assertQuantity(month.smsRecipientSegments);
  assertQuantity(month.recipientEmails);
  let total =
    month.smsRecipientSegments * pricingPolicy.communication.smsRecipientSegmentSubcredits +
    month.recipientEmails * pricingPolicy.communication.recipientEmailSubcredits;
  let missingTariff = false;
  for (const [category, messages] of Object.entries(month.whatsappRecipientMessages)) {
    assertQuantity(messages);
    if (messages === 0) continue;
    const weight = Object.hasOwn(whatsappWeights, category) ? whatsappWeights[category] : undefined;
    if (weight === undefined) {
      missingTariff = true;
      continue;
    }
    assertQuantity(weight);
    if (weight === 0) throw new RangeError("A WhatsApp tariff must be positive.");
    total = safeMoney(total + messages * weight);
  }
  return missingTariff ? null : safeMoney(total);
}

export function projectCommunication(
  students: number,
  months: readonly CommunicationMonth[],
  whatsappWeights: Readonly<Record<string, number>> = pricingPolicy.communication
    .whatsappWeightsSubcredits,
  openingPurchasedSubcredits = 0,
  plan: PlanId = "starter"
) {
  assertStudentCount(students);
  assertQuantity(openingPurchasedSubcredits, Number.MAX_SAFE_INTEGER);
  if (!isPlanId(plan)) throw new RangeError("Choose a supported plan.");
  let purchasedBalance = openingPurchasedSubcredits;
  const includedSubcredits =
    students *
    pricingPolicy.communication.monthlyCreditsPerStudent[plan] *
    pricingPolicy.communication.subcreditsPerCredit;
  const rows = months.map((month) => {
    const demand = communicationDemandSubcredits(month, whatsappWeights);
    if (demand === null) return null;
    const afterIncluded = Math.max(0, demand - includedSubcredits);
    const shortfall = Math.max(0, afterIncluded - purchasedBalance);
    const purchasedCredits = Math.ceil(shortfall / pricingPolicy.communication.subcreditsPerCredit);
    purchasedBalance =
      purchasedBalance +
      purchasedCredits * pricingPolicy.communication.subcreditsPerCredit -
      afterIncluded;
    return {
      demandSubcredits: demand,
      purchasedCredits,
      closingPurchasedSubcredits: purchasedBalance,
      topUpPaise: safeMoney(purchasedCredits * pricingPolicy.communication.purchasedCreditPaise),
    };
  });
  if (rows.some((row) => row === null))
    return { status: "incomplete" as const, totalPaise: null, months: [] };
  return {
    status: "complete" as const,
    totalPaise: safeMoney(rows.reduce((sum, row) => sum + (row?.topUpPaise ?? 0), 0)),
    months: rows,
  };
}

export type UsagePricing = {
  aicAllowancesApproved: boolean;
  aicIncludedRollover: boolean | null;
  aicPurchasedRollover: boolean | null;
  whatsappWeightsSubcredits: Readonly<Record<string, number>>;
};
export const publicUsagePricing: UsagePricing = {
  aicAllowancesApproved: pricingPolicy.aic.allowancesApproved,
  aicIncludedRollover: pricingPolicy.aic.includedRollover,
  aicPurchasedRollover: pricingPolicy.aic.purchasedBalanceCarriesForward,
  whatsappWeightsSubcredits: pricingPolicy.communication.whatsappWeightsSubcredits,
};

export type ExpectedUsage = {
  monthlyMilliAic?: number;
  openingPurchasedMilliAic?: number;
  communication?: CommunicationMonth;
  apiPeak?: ApiPeakRequirement;
};

export function projectAic(
  plan: PlanId,
  monthlyDemandMilliAic: number,
  tariffs: UsagePricing = publicUsagePricing,
  selectedCredits = 0,
  openingPurchasedMilliAic = 0
) {
  assertQuantity(monthlyDemandMilliAic, pricingPolicy.validation.maxMonthlyQuantity * 1000);
  assertQuantity(openingPurchasedMilliAic, Number.MAX_SAFE_INTEGER);
  const included = pricingPolicy.plans[plan].monthlyIncludedMilliAic;
  const extraMonthlyMilliAic = Math.max(0, monthlyDemandMilliAic - included);
  if (
    monthlyDemandMilliAic > 0 &&
    (tariffs.aicIncludedRollover !== false || tariffs.aicPurchasedRollover !== true)
  )
    return {
      annualPaise: null,
      annualTaxPaise: null,
      annualIncludingTaxPaise: null,
      extraMonthlyMilliAic,
      forecast: null,
    };
  const forecast = forecastAic({
    monthlyDemandMilliAic: Array.from({ length: 12 }, () => monthlyDemandMilliAic),
    monthlyIncludedMilliAic: included,
    openingPurchasedMilliAic,
    selectedCredits,
  });
  const annualTaxPaise =
    publicEstimateTax === null ? null : taxPaise(forecast.suggested.totalPaise, publicEstimateTax);
  return {
    annualPaise: forecast.additionalPurchasePaise,
    annualTaxPaise,
    annualIncludingTaxPaise:
      annualTaxPaise === null ? null : safeMoney(forecast.additionalPurchasePaise + annualTaxPaise),
    extraMonthlyMilliAic,
    forecast,
  };
}

export type RecommendationStatus =
  | "lowest_subscription"
  | "estimated_lowest_total"
  | "conditional_usage_forecast"
  | "incomplete_usage_pricing"
  | "incomplete_api_pricing"
  | "incomplete_api_capacity"
  | "unmet_api_capacity"
  | "custom_service_quote_required";

export function recommendPlan(
  students: number,
  addOns: AddOns = noAddOns,
  usage: ExpectedUsage = {},
  customServiceRequired = false,
  tariffs: UsagePricing = publicUsagePricing,
  api: DataEventsApiPricing = publicDataEventsApiPricing,
  selectedAicCredits = 0
) {
  assertDataEventsApiPricing(api);
  const candidates = planIds.map((plan) => {
    const communication =
      usage.communication === undefined
        ? null
        : projectCommunication(
            students,
            Array.from({ length: 12 }, () => usage.communication as CommunicationMonth),
            tariffs.whatsappWeightsSubcredits,
            0,
            plan
          );
    const fixed = calculateFixedEstimate(
      plan,
      students,
      addOns,
      pricingPolicy.version,
      publicEstimateTax,
      api,
      selectedAicCredits
    );
    const apiCapacity = assessApiCapacity(plan, Boolean(addOns.dataEventsApi), usage.apiPeak, api);
    const aic =
      usage.monthlyMilliAic === undefined
        ? null
        : projectAic(
            plan,
            usage.monthlyMilliAic,
            tariffs,
            selectedAicCredits,
            usage.openingPurchasedMilliAic
          );
    const incomplete =
      (communication !== null && communication.totalPaise === null) ||
      (aic !== null && aic.annualPaise === null);
    const additionalUsagePaise = incomplete
      ? null
      : safeMoney((communication?.totalPaise ?? 0) + (aic?.annualPaise ?? 0));
    return {
      plan,
      fixed,
      communication,
      aic,
      additionalUsagePaise,
      apiCapacity,
      knownExpectedPaise: safeMoney(
        fixed.purchaseYearWithPrepaidPaise + (additionalUsagePaise ?? 0)
      ),
      firstYearExpectedPaise:
        additionalUsagePaise === null || !fixed.complete
          ? null
          : safeMoney(fixed.purchaseYearWithPrepaidPaise + additionalUsagePaise),
    };
  });
  const eligibleCandidates = candidates.filter((candidate) => candidate.fixed.eligible);
  const capacityRequired = Boolean(addOns.dataEventsApi && usage.apiPeak);
  const capacityUnassessed = eligibleCandidates.some(
    (candidate) => candidate.apiCapacity.status === "unassessed"
  );
  const suitable = capacityRequired
    ? eligibleCandidates.filter((candidate) => candidate.apiCapacity.status === "fits")
    : eligibleCandidates;
  const incompleteUsage = suitable.some((candidate) => candidate.additionalUsagePaise === null);
  const incompleteApiPricing = suitable.some((candidate) => !candidate.fixed.complete);
  // Missing tariffs permit only a fixed-subscription comparison, never a zero-priced overage.
  // Stable input order is the final tie-break after comparable total and fixed commitment.
  const ranked = [...suitable].sort((a, b) => {
    const totalA = incompleteUsage ? a.fixed.purchaseYearWithPrepaidPaise : a.knownExpectedPaise;
    const totalB = incompleteUsage ? b.fixed.purchaseYearWithPrepaidPaise : b.knownExpectedPaise;
    return totalA - totalB || a.fixed.recurringFixedPaise - b.fixed.recurringFixedPaise;
  });
  let status: RecommendationStatus = "lowest_subscription";
  if (usage.monthlyMilliAic !== undefined || usage.communication !== undefined)
    status = "estimated_lowest_total";
  if (usage.monthlyMilliAic !== undefined) status = "conditional_usage_forecast";
  if (incompleteUsage) status = "incomplete_usage_pricing";
  if (customServiceRequired) status = "custom_service_quote_required";
  if (incompleteApiPricing) status = "incomplete_api_pricing";
  if (capacityRequired && capacityUnassessed) status = "incomplete_api_capacity";
  if (capacityRequired && suitable.length === 0 && !capacityUnassessed)
    status = "unmet_api_capacity";
  return { plan: incompleteApiPricing ? null : (ranked[0]?.plan ?? null), status, candidates };
}
