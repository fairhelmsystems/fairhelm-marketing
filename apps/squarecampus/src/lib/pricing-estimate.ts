import {
  type AddOns,
  type DataEventsApiPricing,
  type ExpectedUsage,
  legacyAicPacks,
  calculateAicPurchase,
  assertStudentCount,
  isPlanId,
  pricingPolicy,
  publicDataEventsApiPricing,
  recommendPlan,
} from "@fairhelm/squarecampus-content/pricing";
import type { PlanId } from "@/content/commercial";

export type StudioInputs = {
  students: string;
  smsSegments: string;
  recipientEmails: string;
  whatsappMessages: string;
  apiPeakRequests: string;
  apiPeakWindowSeconds: string;
  customService: boolean;
  prepaidAicCredits: string;
} & AddOns;
export type StudioState = { inputs: StudioInputs; plan: PlanId };

export const initialStudioState: StudioState = {
  plan: "starter",
  inputs: {
    students: "1200",
    smsSegments: "",
    recipientEmails: "",
    whatsappMessages: "",
    apiPeakRequests: "",
    apiPeakWindowSeconds: "",
    sso: false,
    dataEventsApi: false,
    whiteLabel: false,
    brandingAlreadyPurchased: false,
    customService: false,
    prepaidAicCredits: "0",
  },
};

export function quantitySliderMaximum(
  value: number | null,
  initialMaximum = 10000,
  maximum = pricingPolicy.validation.maxMonthlyQuantity
) {
  if (value === null) return initialMaximum;
  if (!Number.isFinite(value) || value < 0 || value > maximum)
    throw new RangeError("Quantity is outside the supported slider range.");
  if (value <= initialMaximum) return initialMaximum;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.min(maximum, Math.ceil(value / magnitude) * magnitude);
}

export function enrolmentSliderMaximum(students: number | null) {
  if (students !== null) assertStudentCount(students);
  return quantitySliderMaximum(students, 10000, pricingPolicy.validation.maxStudents);
}

function parseWholeNumber(raw: string, maximum: number, minimum = 0): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const value = Number(raw);
  return Number.isSafeInteger(value) && value >= minimum && value <= maximum ? value : null;
}

export function parseStudioInputs(inputs: StudioInputs) {
  const errors: Partial<
    Record<
      | "students"
      | "smsSegments"
      | "recipientEmails"
      | "whatsappMessages"
      | "apiPeakRequests"
      | "apiPeakWindowSeconds"
      | "prepaidAicCredits",
      string
    >
  > = {};
  const students = parseWholeNumber(
    inputs.students,
    pricingPolicy.validation.maxStudents,
    pricingPolicy.validation.minStudents
  );
  if (students === null)
    errors.students = `Enter a whole student count from ${pricingPolicy.validation.minStudents.toLocaleString("en-IN")} to ${pricingPolicy.validation.maxStudents.toLocaleString("en-IN")}, using digits only.`;
  const channels = { smsSegments: 0, recipientEmails: 0, whatsappMessages: 0 };
  for (const key of ["smsSegments", "recipientEmails", "whatsappMessages"] as const) {
    if (inputs[key] === "") continue;
    const value = parseWholeNumber(inputs[key], pricingPolicy.validation.maxMonthlyQuantity);
    if (value === null)
      errors[key] = "Enter a whole number from 0 to 1,00,00,00,000, using digits only.";
    else channels[key] = value;
  }
  const usage: ExpectedUsage = {};
  const selectedAicCredits =
    inputs.prepaidAicCredits === ""
      ? 0
      : parseWholeNumber(inputs.prepaidAicCredits, Number.MAX_SAFE_INTEGER);
  if (selectedAicCredits === null) {
    errors.prepaidAicCredits = "Enter a whole, non-negative prepaid AIC quantity.";
  } else {
    try {
      calculateAicPurchase(selectedAicCredits);
    } catch (error) {
      errors.prepaidAicCredits =
        error instanceof RangeError
          ? error.message
          : "The prepaid quantity could not be calculated.";
    }
  }
  if (
    inputs.dataEventsApi &&
    (inputs.apiPeakRequests !== "" || inputs.apiPeakWindowSeconds !== "")
  ) {
    const requests = parseWholeNumber(inputs.apiPeakRequests, Number.MAX_SAFE_INTEGER);
    const windowSeconds = parseWholeNumber(inputs.apiPeakWindowSeconds, Number.MAX_SAFE_INTEGER, 1);
    if (requests === null) errors.apiPeakRequests = "Enter a whole peak request count.";
    if (windowSeconds === null)
      errors.apiPeakWindowSeconds = "Enter the rolling window in whole seconds.";
    if (requests !== null && windowSeconds !== null) usage.apiPeak = { requests, windowSeconds };
  }
  if (
    inputs.smsSegments !== "" ||
    inputs.recipientEmails !== "" ||
    inputs.whatsappMessages !== ""
  ) {
    usage.communication = {
      smsRecipientSegments: channels.smsSegments,
      recipientEmails: channels.recipientEmails,
      whatsappRecipientMessages: { unpriced_category_and_destination: channels.whatsappMessages },
    };
  }
  return {
    students,
    usage,
    selectedAicCredits,
    errors,
    valid: students !== null && Object.keys(errors).length === 0,
  };
}

export function getStudioEstimate(
  state: StudioState,
  api: DataEventsApiPricing = publicDataEventsApiPricing
) {
  const parsed = parseStudioInputs(state.inputs);
  if (!parsed.valid || parsed.students === null || parsed.selectedAicCredits === null)
    return { ...parsed, recommendation: null, selected: null };
  const recommendation = recommendPlan(
    parsed.students,
    state.inputs,
    parsed.usage,
    state.inputs.customService,
    undefined,
    api,
    parsed.selectedAicCredits
  );
  const selected =
    recommendation.candidates.find((candidate) => candidate.plan === state.plan) ?? null;
  return { ...parsed, recommendation, selected };
}

export type StudioAction =
  | { type: "inputs"; values: Partial<StudioInputs> }
  | { type: "plan"; plan: PlanId }
  | { type: "restore"; state: StudioState };

export function studioReducer(state: StudioState, action: StudioAction): StudioState {
  switch (action.type) {
    case "inputs":
      return { ...state, inputs: { ...state.inputs, ...action.values } };
    case "plan":
      return { ...state, plan: action.plan };
    case "restore":
      return action.state;
  }
}

const inputKeys = [
  "students",
  "prepaidAicCredits",
  "smsSegments",
  "recipientEmails",
  "whatsappMessages",
  "apiPeakRequests",
  "apiPeakWindowSeconds",
] as const;
const flagKeys = [
  "sso",
  "dataEventsApi",
  "whiteLabel",
  "brandingAlreadyPurchased",
  "customService",
] as const;

export function encodeEstimate(state: StudioState) {
  const estimate = getStudioEstimate(state);
  if (!estimate.selected) throw new RangeError("Correct the estimate inputs before sharing.");
  if (!estimate.selected.fixed.eligible)
    throw new RangeError("Choose a plan supporting your selected add-ons before sharing.");
  const params = new URLSearchParams({
    pricing: "1",
    v: pricingPolicy.version,
    plan: estimate.selected.plan,
  });
  for (const key of inputKeys) {
    if (
      (key === "apiPeakRequests" || key === "apiPeakWindowSeconds") &&
      !state.inputs.dataEventsApi
    )
      continue;
    if (state.inputs[key] !== "") params.set(key, state.inputs[key]);
  }
  for (const key of flagKeys) params.set(key, state.inputs[key] ? "1" : "0");
  return params;
}

export function decodeEstimate(
  params: URLSearchParams
):
  | { status: "absent"; state: null }
  | { status: "valid" | "recovered" | "stale"; state: StudioState } {
  const packKeys = legacyAicPacks.map((pack) => `pack_${pack.id}`);
  const knownKeys = ["plan", "auto", "monthlyAic", ...inputKeys, ...flagKeys, ...packKeys];
  if (!params.has("pricing") && !knownKeys.some((key) => params.has(key)))
    return { status: "absent", state: null };

  let recovered = params.get("pricing") !== "1";
  // Preserve unambiguous fields. Conflicting copies cannot choose a price or entitlement.
  const read = (key: string) => {
    const values = params.getAll(key);
    if (values.length > 1) recovered = true;
    if (new Set(values).size > 1) return null;
    return values[0] ?? null;
  };
  const stale = read("v") !== pricingPolicy.version;
  const rawPlan = read("plan");
  const plan = isPlanId(rawPlan) ? rawPlan : initialStudioState.plan;
  if (rawPlan !== null && !isPlanId(rawPlan)) recovered = true;
  const auto = read("auto");
  if (auto !== null && auto !== "0" && auto !== "1") recovered = true;
  if (auto === "1") recovered = true;
  const inputs = { ...initialStudioState.inputs };
  for (const key of inputKeys) {
    const value = read(key);
    if (value !== null) inputs[key] = value;
  }
  for (const key of flagKeys) {
    const value = read(key);
    if (value !== null && value !== "0" && value !== "1") recovered = true;
    inputs[key] = value === "1";
  }
  for (const key of params.keys())
    if (key.startsWith("pack_") && !packKeys.includes(key)) recovered = true;
  let legacyCredits = 0;
  let hasLegacySelection = false;
  for (const pack of legacyAicPacks) {
    const raw = read(`pack_${pack.id}`);
    if (raw === null) continue;
    hasLegacySelection = true;
    recovered = true;
    const quantity = parseWholeNumber(raw, Number.MAX_SAFE_INTEGER);
    const combined = quantity === null ? NaN : legacyCredits + quantity * pack.credits;
    if (!Number.isSafeInteger(combined) || combined < 0) continue;
    legacyCredits = combined;
  }
  if (hasLegacySelection) {
    if (params.has("prepaidAicCredits") && Number(inputs.prepaidAicCredits) !== legacyCredits) {
      inputs.prepaidAicCredits = initialStudioState.inputs.prepaidAicCredits;
    } else {
      inputs.prepaidAicCredits = String(legacyCredits);
    }
  }
  // These controls were removed. Legacy links keep their plan and published service fee.
  if (inputs.apiPeakRequests !== "" || inputs.apiPeakWindowSeconds !== "" || inputs.customService)
    recovered = true;
  inputs.apiPeakRequests = "";
  inputs.apiPeakWindowSeconds = "";
  inputs.customService = false;
  // AIC purchases no longer assume a monthly burn rate or a forecast horizon.
  if (read("monthlyAic") !== null) recovered = true;
  const parsed = parseStudioInputs(inputs);
  for (const key of inputKeys) {
    if (!parsed.errors[key]) continue;
    recovered = true;
    inputs[key] = initialStudioState.inputs[key];
  }
  if (parsed.errors.apiPeakRequests || parsed.errors.apiPeakWindowSeconds) {
    inputs.apiPeakRequests = "";
    inputs.apiPeakWindowSeconds = "";
  }
  const state = { plan, inputs };
  try {
    getStudioEstimate(state);
  } catch (error) {
    if (!(error instanceof RangeError)) throw error;
    // A valid purchase may still exceed safe aggregate arithmetic with the subscription.
    state.inputs.prepaidAicCredits = "0";
    recovered = true;
  }
  return { status: stale ? "stale" : recovered ? "recovered" : "valid", state };
}

export function formatInr(paise: number) {
  if (!Number.isSafeInteger(paise) || paise < 0)
    throw new RangeError("Expected non-negative integer paise.");
  const whole = BigInt(paise) / BigInt(100);
  const fraction = paise % 100;
  const rupees = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(whole);
  return fraction === 0 ? rupees : `${rupees}.${String(fraction).padStart(2, "0")}`;
}

/** Rounded displays are explanatory only. Never use them to reconstruct a quote. */
export function formatInrRatio(paise: number, divisor: number) {
  return formatInr(
    Number((BigInt(paise) * BigInt(2) + BigInt(divisor)) / (BigInt(divisor) * BigInt(2)))
  );
}

export function formatAic(milliAic: number) {
  const whole = new Intl.NumberFormat("en-IN").format(Math.floor(milliAic / 1000));
  const fraction = String(milliAic % 1000)
    .padStart(3, "0")
    .replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole;
}

export function estimateEnquiryMessage(state: StudioState) {
  const selected = getStudioEstimate(state).selected;
  if (!selected?.fixed.eligible) return null;
  return [
    `Please review my SquareCampus pricing estimate (${pricingPolicy.version}).`,
    `${pricingPolicy.plans[selected.plan].name} for ${selected.fixed.students} enrolled students.`,
    `Annual licence ${formatInr(selected.fixed.annualLicencePaise)}.`,
    `Entra SSO ${state.inputs.sso ? "selected" : "not selected"}. White-label apps ${state.inputs.whiteLabel ? (state.inputs.brandingAlreadyPurchased ? "previously purchased" : "new setup selected") : "not selected"}.`,
    ...(state.inputs.dataEventsApi
      ? [
          selected.fixed.annualDataEventsApiPaise === null
            ? "Data & Events API interest recorded. The annual API fee is unconfigured and excluded from these known subtotals. Release scope and throughput require confirmation."
            : `Data & Events API annual fee ${formatInr(selected.fixed.annualDataEventsApiPaise)}.`,
        ]
      : []),
    `${selected.fixed.complete ? "Purchase-year fixed subtotal" : "Known purchase-year subtotal"} ${formatInr(selected.fixed.firstYearFixedPaise)}. Comparable renewal subtotal ${formatInr(selected.fixed.renewalFixedPaise)}.`,
    ...(selected.fixed.prepaidAic.credits > 0
      ? [
          `Selected prepaid AIC ${selected.fixed.prepaidAic.credits.toLocaleString("en-IN")} credits for ${formatInr(selected.fixed.prepaidAic.totalPaise)} once, using graduated volume bands. Purchase-year amount including these credits ${formatInr(selected.fixed.purchaseYearWithPrepaidPaise)}. Renewal does not buy them again.`,
        ]
      : []),
    ...(state.inputs.dataEventsApi && selected.apiCapacity.status !== "fits"
      ? [
          `API throughput assessment: ${selected.apiCapacity.status}. Confirm capacity before commitment.`,
        ]
      : []),
    ...(selected.fixed.firstYearIncludingTaxPaise !== null &&
    selected.fixed.renewalIncludingTaxPaise !== null
      ? [
          `Domestic purchase-year estimate including GST ${formatInr(selected.fixed.firstYearIncludingTaxPaise)}. Comparable renewal including estimated GST ${formatInr(selected.fixed.renewalIncludingTaxPaise)}. Final tax treatment follows verified billing details.`,
        ]
      : []),
    "Base subtotals exclude GST. Additional usage and custom services are separate. Please verify current policy and scope before issuing commercial terms.",
    `Estimate link: https://squarecampus.com/pricing/?${encodeEstimate(state)}`,
  ].join("\n");
}
