import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import fixtures from "@fairhelm/squarecampus-content/pricing-fixtures.json";
import {
  calculateFixedEstimate,
  noAddOns,
  planIds,
  pricingPolicy,
  publicDataEventsApiPricing,
  publicUsagePricing,
  recommendPlan,
  taxPaise,
  type DataEventsApiPricing,
} from "@fairhelm/squarecampus-content/pricing";
import { dataEventsApi, planComparisonRows } from "../src/content/commercial";
import PricingPage from "../src/app/(company)/pricing/page";
import {
  decodeEstimate,
  encodeEstimate,
  enrolmentSliderMaximum,
  estimateEnquiryMessage,
  getStudioEstimate,
  initialStudioState,
  quantitySliderMaximum,
  studioReducer,
} from "../src/lib/pricing-estimate";
import { assert, suite, test } from "./harness";

suite("Data & Events API pricing and throughput contract");

test("quantity slider domains support optional, decimal and large exact values", () => {
  assert.equal(quantitySliderMaximum(null), 10000);
  assert.equal(quantitySliderMaximum(0), 10000);
  assert.equal(quantitySliderMaximum(123.456), 10000);
  assert.equal(quantitySliderMaximum(10000.001), 20000);
  assert.equal(quantitySliderMaximum(105000), 200000);
  assert.equal(quantitySliderMaximum(1000000000), 1000000000);
  assert.equal(quantitySliderMaximum(7500, 4000, Number.MAX_SAFE_INTEGER), 8000);
  assert.equal(
    quantitySliderMaximum(Number.MAX_SAFE_INTEGER, 4000, Number.MAX_SAFE_INTEGER),
    Number.MAX_SAFE_INTEGER
  );
  for (const value of [-1, NaN, Infinity, 1000000001])
    assert.throws(() => quantitySliderMaximum(value));
});

test("optional forecasts distinguish a blank field from an explicit zero", () => {
  const blank = getStudioEstimate(initialStudioState);
  assert.equal(blank.usage.monthlyMilliAic, undefined);
  assert.equal(blank.usage.communication, undefined);
  assert.equal(blank.usage.apiPeak, undefined);
  const zero = getStudioEstimate({
    ...initialStudioState,
    inputs: {
      ...initialStudioState.inputs,
      monthlyAic: "0",
      smsSegments: "0",
      dataEventsApi: true,
      apiPeakRequests: "0",
      apiPeakWindowSeconds: "60",
    },
  });
  assert.equal(zero.usage.monthlyMilliAic, 0);
  assert.equal(zero.usage.communication?.smsRecipientSegments, 0);
  assert.equal(zero.usage.apiPeak?.requests, 0);
});

test("large valid enrolment gets an accurate expanded slider domain", () => {
  for (const [students, maximum] of [
    [100, 10000],
    [10000, 10000],
    [10001, 20000],
    [105000, 200000],
    [5000000, 5000000],
  ]) {
    assert.equal(enrolmentSliderMaximum(students), maximum);
  }
  assert.equal(enrolmentSliderMaximum(null), 10000);
  assert.throws(() => enrolmentSliderMaximum(Infinity));
  assert.throws(() => enrolmentSliderMaximum(5000001));
});

// These golden prices and limits are synthetic and never imported by public UI.
const synthetic = fixtures.syntheticDataEventsApi;
const api: DataEventsApiPricing = synthetic;
const selectedApi = { ...noAddOns, dataEventsApi: true };
const unconfiguredApi: DataEventsApiPricing = {
  annualDataEventsApiPaise: { starter: null, pro: null, enterprise: null },
  slidingWindows: { starter: null, pro: null, enterprise: null },
};

test("the public API policy keeps price, limits and release state explicit", () => {
  assert.equal(pricingPolicy.version, "2026-11-09.8");
  assert.deepEqual(publicDataEventsApiPricing.annualDataEventsApiPaise, {
    starter: 250000,
    pro: 500000,
    enterprise: 1000000,
  });
  assert.equal(pricingPolicy.dataEventsApi.releaseStatus, "available");
  assert.equal(pricingPolicy.dataEventsApi.automaticOverageCharges, false);
  assert.equal(pricingPolicy.dataEventsApi.rateLimitAlgorithm, "sliding_window");
  assert.equal(pricingPolicy.dataEventsApi.rateLimitScope, "billed_institution");
  assert.deepEqual(pricingPolicy.dataEventsApi.eligiblePlans, planIds);
  assert.deepEqual(publicDataEventsApiPricing.slidingWindows, {
    starter: { requests: 250, windowSeconds: 60 },
    pro: { requests: 500, windowSeconds: 60 },
    enterprise: { requests: 2000, windowSeconds: 60 },
  });
  assert.equal(pricingPolicy.dataEventsApi.streamAndQueryLimits, null);
  assert.equal(pricingPolicy.dataEventsApi.replayRetention, null);
});

test("API unselected preserves all original monetary amounts", () => {
  for (const plan of planIds) {
    const before = calculateFixedEstimate(plan, 1200);
    const after = calculateFixedEstimate(plan, 1200, noAddOns, pricingPolicy.version, null, api);
    assert.deepEqual(after, before);
    assert.equal(after.complete, true);
    assert.deepEqual(after.missingPriceComponents, []);
  }
});

test("approved plan fees recur annually and branding remains a one-time purchase", () => {
  for (const [plan, apiFee, purchaseYear, renewal] of [
    ["pro", 500000, 29550000, 27050000],
    ["enterprise", 1000000, 43500000, 41000000],
  ] as const) {
    const quote = calculateFixedEstimate(plan, 1200, {
      ...selectedApi,
      sso: true,
      whiteLabel: true,
    });
    assert.equal(quote.annualDataEventsApiPaise, apiFee);
    assert.equal(quote.firstYearFixedPaise, purchaseYear);
    assert.equal(quote.renewalFixedPaise, renewal);
    assert.equal(quote.complete, true);
    const owned = calculateFixedEstimate(plan, 1200, {
      ...selectedApi,
      sso: true,
      whiteLabel: true,
      brandingAlreadyPurchased: true,
    });
    assert.equal(owned.firstYearFixedPaise, renewal);
    assert.equal(owned.newBrandingPaise, 0);
  }
});

test("SSO is eligible on every plan while white-label apps require Growth", () => {
  assert.deepEqual(pricingPolicy.addOns.entraSsoEligiblePlans, ["starter", "pro", "enterprise"]);
  assert.deepEqual(pricingPolicy.addOns.whiteLabelEligiblePlans, ["pro", "enterprise"]);
  for (const selected of [
    { whiteLabel: true },
    { whiteLabel: true, brandingAlreadyPurchased: true },
    { sso: true, whiteLabel: true },
  ]) {
    const addOns = { ...noAddOns, ...selected };
    const result = recommendPlan(1200, addOns);
    assert.equal(result.plan, "pro");
    assert.equal(result.candidates[0].fixed.eligible, false);
    assert.equal(result.candidates[0].fixed.complete, false);
    assert.equal(result.candidates[0].firstYearExpectedPaise, null);
    assert.equal(result.candidates[1].fixed.eligible, true);
    const state = { ...initialStudioState, inputs: { ...initialStudioState.inputs, ...selected } };
    assert.equal(getStudioEstimate(state).selected?.plan, "pro");
  }
  assert.equal(
    recommendPlan(1200, { ...noAddOns, brandingAlreadyPurchased: true }).plan,
    "starter"
  );
  const starterApi = calculateFixedEstimate("starter", 1200, selectedApi);
  assert.equal(starterApi.eligible, true);
  assert.equal(starterApi.firstYearFixedPaise, 20750000);
});

test("API throughput is evaluated within the plans supporting the selected add-ons", () => {
  const addOns = { ...selectedApi, sso: true };
  for (const [requests, plan] of [
    [250, "starter"],
    [500, "pro"],
    [501, "enterprise"],
    [2001, null],
  ] as const) {
    assert.equal(
      recommendPlan(1200, addOns, { apiPeak: { requests, windowSeconds: 60 } }).plan,
      plan
    );
  }
  const result = recommendPlan(
    1200,
    addOns,
    { apiPeak: { requests: 250, windowSeconds: 60 } },
    false,
    publicUsagePricing,
    {
      ...publicDataEventsApiPricing,
      slidingWindows: { ...publicDataEventsApiPricing.slidingWindows, starter: null },
    }
  );
  assert.equal(result.plan, "pro");
  assert.equal(result.status, "incomplete_api_capacity");
});

test("manual incompatible selections remain editable but cannot create a shareable quote", () => {
  const manual = {
    ...initialStudioState,
    autoRecommend: false,
    inputs: {
      ...initialStudioState.inputs,
      sso: true,
      whiteLabel: true,
      brandingAlreadyPurchased: true,
    },
  };
  const selected = getStudioEstimate(manual).selected;
  assert.equal(selected?.plan, "starter");
  assert.deepEqual(selected?.fixed.unavailableAddOns, ["whiteLabel"]);
  assert.equal(selected?.fixed.newBrandingPaise, 0);
  assert.throws(() => encodeEstimate(manual), /supporting your selected add-ons/);
  assert.equal(estimateEnquiryMessage(manual), null);
  const quote = calculateFixedEstimate("starter", 1200, manual.inputs, pricingPolicy.version, {
    basisPoints: 1800,
    rounding: "half_up_per_line",
  });
  assert.equal(quote.firstYearIncludingTaxPaise, null);
  const compatible = studioReducer(manual, { type: "plan", plan: "pro" });
  assert.equal(getStudioEstimate(compatible).selected?.fixed.eligible, true);
  assert.equal(getStudioEstimate(compatible).selected?.fixed.newBrandingPaise, 0);
  assert.equal(decodeEstimate(encodeEstimate(compatible)).status, "valid");
});

test("approved sliding-minute boundaries select the lowest-priced suitable plan", () => {
  for (const [requests, expected] of [
    [0, "starter"],
    [250, "starter"],
    [251, "pro"],
    [500, "pro"],
    [501, "enterprise"],
    [2000, "enterprise"],
    [2001, null],
  ] as const) {
    const result = recommendPlan(1200, selectedApi, {
      apiPeak: { requests, windowSeconds: 60 },
    });
    assert.equal(result.plan, expected);
    if (expected === null) assert.equal(result.status, "unmet_api_capacity");
  }
});

test("plan-specific API fees participate in graduated AIC total-cost recommendations", () => {
  const result = recommendPlan(100, selectedApi, { monthlyMilliAic: 100000 });
  assert.equal(result.plan, "starter");
  assert.equal(result.status, "conditional_usage_forecast");
  assert.equal(result.candidates[0].firstYearExpectedPaise, 2600000);
  assert.equal(result.candidates[1].firstYearExpectedPaise, 2750000);
});

test("an unknown plan fee cannot appear as a cheaper total-cost recommendation", () => {
  const result = recommendPlan(1200, selectedApi, {}, false, publicUsagePricing, {
    ...publicDataEventsApiPricing,
    annualDataEventsApiPaise: {
      ...publicDataEventsApiPricing.annualDataEventsApiPaise,
      starter: null,
    },
  });
  assert.equal(result.plan, null);
  assert.equal(result.status, "incomplete_api_pricing");
  assert.equal(result.candidates[0].firstYearExpectedPaise, null);
  assert.equal(result.candidates[1].fixed.complete, true);
});

test("a selected configured annual API fee is applied once to purchase and renewal", () => {
  const addOns = { ...selectedApi, sso: true, whiteLabel: true };
  const result = calculateFixedEstimate(
    "enterprise",
    1200,
    addOns,
    pricingPolicy.version,
    null,
    api
  );
  assert.equal(result.annualDataEventsApiPaise, synthetic.annualDataEventsApiPaise.enterprise);
  assert.equal(
    result.firstYearFixedPaise,
    synthetic.enterprise1200WithNewBrandingAndSso.purchaseYearKnownPaise
  );
  assert.equal(
    result.renewalFixedPaise,
    synthetic.enterprise1200WithNewBrandingAndSso.comparableRenewalKnownPaise
  );
  assert.equal(result.firstYearFixedPaise - result.renewalFixedPaise, 2500000);
  assert.equal(result.complete, true);
});

test("an unknown selected API price returns known subtotals and a structured missing component", () => {
  const quote = calculateFixedEstimate(
    "enterprise",
    1200,
    {
      ...selectedApi,
      sso: true,
      whiteLabel: true,
    },
    pricingPolicy.version,
    null,
    unconfiguredApi
  );
  assert.equal(quote.firstYearFixedPaise, 42500000);
  assert.equal(quote.renewalFixedPaise, 40000000);
  assert.equal(quote.annualDataEventsApiPaise, null);
  assert.equal(quote.complete, false);
  assert.deepEqual(quote.missingPriceComponents, [
    { component: "data_events_api", billingPeriod: "annual" },
  ]);
  const recommendation = recommendPlan(
    1200,
    selectedApi,
    {},
    false,
    publicUsagePricing,
    unconfiguredApi
  );
  assert.equal(recommendation.status, "incomplete_api_pricing");
  assert.equal(recommendation.plan, null);
  for (const candidate of recommendation.candidates)
    assert.equal(candidate.firstYearExpectedPaise, null);
});

test("configured tax reconciles API, SSO and one-time branding as separate lines", () => {
  const tax = { basisPoints: 1800, rounding: "half_up_per_line" as const };
  const quote = calculateFixedEstimate(
    "enterprise",
    1200,
    { ...selectedApi, sso: true, whiteLabel: true },
    pricingPolicy.version,
    tax,
    api
  );
  const recurringTax = [
    quote.annualLicencePaise,
    quote.annualSsoPaise,
    synthetic.annualDataEventsApiPaise.enterprise,
  ].reduce((total, amount) => total + taxPaise(amount, tax), 0);
  assert.equal(quote.recurringTaxPaise, recurringTax);
  assert.equal(quote.firstYearTaxPaise, recurringTax + taxPaise(2500000, tax));
  const unknown = calculateFixedEstimate(
    "starter",
    100,
    selectedApi,
    pricingPolicy.version,
    tax,
    unconfiguredApi
  );
  assert.equal(unknown.recurringTaxPaise, null);
  assert.equal(unknown.firstYearIncludingTaxPaise, null);
});

test("existing branding survives every plan change and ordinary renewal", () => {
  for (const plan of planIds) {
    const owned = calculateFixedEstimate(
      plan,
      1200,
      {
        ...selectedApi,
        whiteLabel: true,
        brandingAlreadyPurchased: true,
      },
      pricingPolicy.version,
      null,
      api
    );
    assert.equal(owned.newBrandingPaise, 0);
    assert.equal(owned.firstYearFixedPaise, owned.renewalFixedPaise);
    assert.equal(owned.annualDataEventsApiPaise, synthetic.annualDataEventsApiPaise[plan]);
    const laterFirstPurchase = calculateFixedEstimate(
      plan,
      1200,
      {
        ...selectedApi,
        whiteLabel: true,
        brandingAlreadyPurchased: false,
      },
      pricingPolicy.version,
      null,
      api
    );
    assert.equal(laterFirstPurchase.firstYearFixedPaise - owned.firstYearFixedPaise, 2500000);
  }
});

test("API selection alone does not force a higher plan", () => {
  const unselected = recommendPlan(1200);
  for (const config of [api, publicDataEventsApiPricing]) {
    assert.equal(
      recommendPlan(1200, selectedApi, {}, false, publicUsagePricing, config).plan,
      unselected.plan
    );
  }
});

test("only a declared peak within an approved matching window affects suitability", () => {
  for (const [requests, expected] of [
    [5, "starter"],
    [15, "pro"],
    [25, "enterprise"],
  ] as const) {
    const result = recommendPlan(
      1200,
      selectedApi,
      { apiPeak: { requests, windowSeconds: 60 } },
      false,
      publicUsagePricing,
      api
    );
    assert.equal(result.plan, expected);
    assert.equal(
      result.candidates.find((candidate) => candidate.plan === expected)?.apiCapacity.status,
      "fits"
    );
  }
  const result = recommendPlan(
    1200,
    noAddOns,
    { apiPeak: { requests: 999, windowSeconds: 60 } },
    false,
    publicUsagePricing,
    api
  );
  assert.equal(result.plan, "starter");
});

test("no fitting plan produces an unmet-capacity result", () => {
  const result = recommendPlan(
    1200,
    selectedApi,
    { apiPeak: { requests: 31, windowSeconds: 60 } },
    false,
    publicUsagePricing,
    api
  );
  assert.equal(result.plan, null);
  assert.equal(result.status, "unmet_api_capacity");
  assert.ok(
    result.candidates.every((candidate) => candidate.apiCapacity.status === "insufficient")
  );
});

test("missing limits and mismatched windows never become unlimited or average-rate fit", () => {
  for (const config of [unconfiguredApi, api, publicDataEventsApiPricing]) {
    const result = recommendPlan(
      1200,
      selectedApi,
      { apiPeak: { requests: 1, windowSeconds: 30 } },
      false,
      publicUsagePricing,
      config
    );
    assert.equal(result.plan, null);
    assert.equal(result.status, "incomplete_api_capacity");
    assert.ok(
      result.candidates.every((candidate) => candidate.apiCapacity.status === "unassessed")
    );
  }
});

test("a known-suitable plan is distinguished from plans with unknown capacity", () => {
  const result = recommendPlan(
    1200,
    selectedApi,
    { apiPeak: { requests: 15, windowSeconds: 60 } },
    false,
    publicUsagePricing,
    { ...api, slidingWindows: { ...api.slidingWindows, starter: null } }
  );
  assert.equal(result.plan, "pro");
  assert.equal(result.status, "incomplete_api_capacity");
});

test("manual override exposes a capacity warning and auto reevaluates the same inputs", () => {
  let state = studioReducer(initialStudioState, {
    type: "inputs",
    values: {
      dataEventsApi: true,
      apiPeakRequests: "25",
      apiPeakWindowSeconds: "60",
    },
  });
  state = studioReducer(state, { type: "plan", plan: "starter" });
  const manual = getStudioEstimate(state, api);
  assert.equal(manual.selected?.plan, "starter");
  assert.equal(manual.selected?.apiCapacity.status, "insufficient");
  state = studioReducer(state, { type: "auto", checked: true });
  assert.equal(getStudioEstimate(state, api).selected?.plan, "enterprise");
  state = studioReducer(state, { type: "inputs", values: { apiPeakRequests: "99" } });
  assert.equal(getStudioEstimate(state, api).recommendation?.plan, null);
  assert.equal(getStudioEstimate(state, api).recommendation?.status, "unmet_api_capacity");
});

test("common API fees preserve pack-aware AIC rankings and unknown wallet rules", () => {
  for (const monthlyMilliAic of [0, 100000, 200000]) {
    const baseline = recommendPlan(100, noAddOns, { monthlyMilliAic });
    assert.equal(
      recommendPlan(100, selectedApi, { monthlyMilliAic }, false, publicUsagePricing, api).plan,
      baseline.plan
    );
  }
  const incomplete = recommendPlan(
    1200,
    selectedApi,
    { monthlyMilliAic: 1000 },
    false,
    { ...publicUsagePricing, aicIncludedRollover: null },
    api
  );
  assert.equal(incomplete.status, "incomplete_usage_pricing");
  assert.ok(incomplete.candidates.every((candidate) => candidate.aic?.annualPaise === null));
});

test("sharing and the editable enquiry retain the selected API fee", () => {
  const state = {
    ...initialStudioState,
    inputs: { ...initialStudioState.inputs, dataEventsApi: true },
  };
  const params = encodeEstimate(state);
  assert.equal(params.get("dataEventsApi"), "1");
  assert.deepEqual(decodeEstimate(params), { status: "valid", state });
  assert.equal(
    decodeEstimate(
      new URLSearchParams(`pricing=1&v=2026-11-09.1&plan=starter&auto=1&students=1200`)
    ).status,
    "stale"
  );
  assert.match(estimateEnquiryMessage(state) ?? "", /Data & Events API annual fee ₹2,500/);
  assert.match(estimateEnquiryMessage(state) ?? "", /Purchase-year fixed subtotal ₹2,07,500/);
});

test("public copy preserves exports and first-party independence with equal catalogue access", () => {
  assert.equal(pricingPolicy.dataEventsApi.authorizedSelfServiceExportsIncluded, true);
  assert.equal(pricingPolicy.dataEventsApi.nativeClientsRequireApiAddOn, false);
  assert.match(dataEventsApi.identity, /not a prerequisite/);
  assert.match(dataEventsApi.throughput, /no API overage charge/);
  for (const label of [
    "Supported API resources and events",
    "Authorized data and audit exports",
    "Native workflows and first-party apps",
  ]) {
    const row = planComparisonRows.find((candidate) => candidate.label === label);
    assert.ok(row);
    assert.equal(row.starter, row.pro);
    assert.equal(row.pro, row.enterprise);
  }
  const html = renderToStaticMarkup(createElement(PricingPage));
  assert.match(html, /One School OS\. Open by design\./);
  assert.match(html, /Data &amp; Events API/);
  assert.match(html, /₹2,500\/year/);
  assert.match(html, /₹5,000\/year/);
  assert.match(html, /₹10,000\/year/);
  assert.match(html, /250 TPM/);
  assert.match(html, /500 TPM/);
  assert.match(html, /2,000 TPM/);
  assert.doesNotMatch(html, /Annual price pending|Planned optional|price unconfigured/);
  assert.doesNotMatch(html, /₹12,345|capacity packs|free API baseline|per.request charge/i);
  assert.doesNotMatch(html, /id="pricing-api-peak"/);
});

test("invalid API prices, windows and peaks fail validation", () => {
  for (const fee of [0, -1, NaN, Infinity, 1.5]) {
    assert.throws(() =>
      calculateFixedEstimate("starter", 100, selectedApi, pricingPolicy.version, null, {
        ...api,
        annualDataEventsApiPaise: { ...api.annualDataEventsApiPaise, starter: fee },
      })
    );
  }
  for (const peak of [
    { requests: -1, windowSeconds: 60 },
    { requests: 1, windowSeconds: 0 },
  ]) {
    assert.throws(() =>
      recommendPlan(100, selectedApi, { apiPeak: peak }, false, publicUsagePricing, api)
    );
  }
});
