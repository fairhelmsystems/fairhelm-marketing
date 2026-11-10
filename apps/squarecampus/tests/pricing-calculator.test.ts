import fixtures from "@fairhelm/squarecampus-content/pricing-fixtures.json";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import PricingPage from "../src/app/(company)/pricing/page";
import { GET as getPublicPricingPolicy } from "../src/app/pricing-policy.json/route";
import {
  calculateFixedEstimate,
  calculateLicence,
  communicationDemandSubcredits,
  noAddOns,
  planIds,
  pricingPolicy,
  projectAic,
  projectCommunication,
  recommendPlan,
  taxPaise,
} from "@fairhelm/squarecampus-content/pricing";
import {
  calculateOperationAic,
  calculateProviderCost,
  type ModelCostCall,
} from "@fairhelm/squarecampus-content/aic-cost";
import {
  decodeEstimate,
  encodeEstimate,
  estimateEnquiryMessage,
  formatInr,
  formatInrRatio,
  getStudioEstimate,
  initialStudioState,
  parseStudioInputs,
  studioReducer,
} from "../src/lib/pricing-estimate";
import { assert, suite, test } from "./harness";

suite("Pricing Studio financial and interaction contract");

test("the public policy response and frontend use identical canonical values", async () => {
  assert.deepEqual(await getPublicPricingPolicy().json(), pricingPolicy);
});

test("pricing HTML serves real rates, equal feature access and a single accessible control tree", () => {
  const html = renderToStaticMarkup(createElement(PricingPage));
  assert.match(html, /Your school\./);
  assert.match(html, /No module or feature is gated behind a plan/);
  assert.doesNotMatch(html, /Automatically recommend a plan/);
  for (const amount of ["₹2,05,000", "₹2,63,000", "₹4,00,000"]) assert.ok(html.includes(amount));
  assert.doesNotMatch(html, /The published student rates/);
  assert.equal(html.split('id="live-estimate"').length - 1, 1);
  assert.equal(html.split('id="pricing-students"').length - 1, 1);
  assert.match(html, /staff, parents and students/);
  assert.doesNotMatch(html.replace(/<[^>]*>/g, " "), /\bPro\b/);
  assert.doesNotMatch(html, /<form\b/);
  assert.match(html, /pricing-policy\.json/);
  assert.match(html, /<noscript>/);
});

test("the canonical golden fixtures use the current policy version and exact integer paise", () => {
  assert.equal(fixtures.pricingVersion, pricingPolicy.version);
  for (const fixture of fixtures.annualLicence) {
    for (const plan of planIds)
      assert.equal(calculateLicence(plan, fixture.students).annualLicencePaise, fixture[plan]);
  }
});

test("only the marginal student changes price at the two slab boundaries", () => {
  for (const plan of planIds) {
    for (const [boundary, slab] of [
      [1000, 1],
      [5000, 2],
    ] as const) {
      assert.equal(
        calculateLicence(plan, boundary + 1).annualLicencePaise -
          calculateLicence(plan, boundary).annualLicencePaise,
        pricingPolicy.studentSlabs[slab].ratesPaise[plan]
      );
    }
  }
});

test("licences are monotonic and slab totals reconcile through the supported technical maximum", () => {
  for (const plan of planIds) {
    let previous = 0;
    for (const students of [
      100,
      999,
      1000,
      1001,
      1200,
      4999,
      5000,
      5001,
      10000,
      10001,
      pricingPolicy.validation.maxStudents,
    ]) {
      const quote = calculateLicence(plan, students);
      assert.ok(quote.annualLicencePaise > previous);
      assert.equal(
        quote.annualLicencePaise,
        quote.slabs.reduce((sum, row) => sum + row.totalPaise, 0)
      );
      assert.equal(
        quote.slabs.reduce((sum, row) => sum + row.students, 0),
        students
      );
      assert.ok(Number.isSafeInteger(quote.annualLicencePaise));
      previous = quote.annualLicencePaise;
    }
  }
});

test("invalid enrolment never produces a zero or silently rounded quote", () => {
  for (const students of [
    0,
    1,
    99,
    -1,
    1.2,
    NaN,
    Infinity,
    Number.MAX_SAFE_INTEGER,
    pricingPolicy.validation.maxStudents + 1,
  ]) {
    assert.throws(() => calculateLicence("starter", students), RangeError);
  }
  for (const students of ["", "0", "1", "99", "-1", "1.2", "1e3", "1,200", "10000001"]) {
    const state = { ...initialStudioState, inputs: { ...initialStudioState.inputs, students } };
    assert.equal(getStudioEstimate(state).selected, null);
    assert.ok(parseStudioInputs(state.inputs).errors.students);
  }
});

test("the slider range is independent of the typed enrolment bound", () => {
  const state = {
    ...initialStudioState,
    inputs: { ...initialStudioState.inputs, students: "10001" },
  };
  assert.equal(getStudioEstimate(state).selected?.fixed.students, 10001);
});

test("the owner-approved maximum accepts 50 lakh and rejects the next student", () => {
  assert.equal(pricingPolicy.validation.maxStudents, 5000000);
  for (const plan of planIds) {
    assert.ok(calculateLicence(plan, 5000000).annualLicencePaise > 0);
    assert.throws(() => calculateLicence(plan, 5000001), RangeError);
  }
  const state = {
    ...initialStudioState,
    inputs: { ...initialStudioState.inputs, students: "5000001" },
  };
  assert.match(parseStudioInputs(state.inputs).errors.students ?? "", /50,00,000/);
  assert.equal(getStudioEstimate(state).selected, null);
  const params = new URLSearchParams(
    `pricing=1&v=${pricingPolicy.version}&plan=starter&auto=1&students=5000001`
  );
  assert.equal(decodeEstimate(params).status, "recovered");
  assert.equal(decodeEstimate(params).state?.inputs.students, initialStudioState.inputs.students);
});

test("Enterprise at 1200 with SSO and new combined app branding matches the brief", () => {
  const quote = calculateFixedEstimate("enterprise", 1200, {
    sso: true,
    whiteLabel: true,
    brandingAlreadyPurchased: false,
  });
  assert.equal(
    quote.firstYearFixedPaise,
    fixtures.enterpriseWithNewBrandingAndSso.firstYearFixedPaise
  );
  assert.equal(quote.renewalFixedPaise, fixtures.enterpriseWithNewBrandingAndSso.renewalFixedPaise);
  assert.equal(quote.monthlyCommunicationCredits, 10800);
  assert.equal(quote.newBrandingPaise, 2500000);
  assert.equal(quote.annualSsoPaise, 0);
  assert.equal(quote.firstYearTaxPaise, null);
  assert.equal(quote.firstYearIncludingTaxPaise, null);
});

test("previously purchased branding is never purchased twice or added to renewal", () => {
  const addOns = { sso: true, whiteLabel: true, brandingAlreadyPurchased: true };
  for (const plan of planIds) {
    const quote = calculateFixedEstimate(plan, 1200, addOns);
    assert.equal(quote.newBrandingPaise, 0);
    assert.equal(quote.firstYearFixedPaise, quote.renewalFixedPaise);
  }
});

test("an explicitly configured test tax policy reconciles per line without display rounding", () => {
  // Synthetic tax configuration tests the boundary; no GST rate is published by the estimator.
  const tax = { basisPoints: 1800, rounding: "half_up_per_line" as const };
  assert.equal(taxPaise(25, tax), 5);
  const quote = calculateFixedEstimate(
    "enterprise",
    1200,
    { sso: true, whiteLabel: true, brandingAlreadyPurchased: false },
    pricingPolicy.version,
    tax
  );
  const taxLines = [quote.annualLicencePaise, quote.annualSsoPaise, quote.newBrandingPaise].map(
    (line) => taxPaise(line, tax)
  );
  assert.equal(
    quote.firstYearTaxPaise,
    taxLines.reduce((a, b) => a + b, 0)
  );
  assert.equal(
    quote.firstYearIncludingTaxPaise,
    quote.firstYearFixedPaise + (quote.firstYearTaxPaise ?? 0)
  );
  assert.throws(() => taxPaise(-1, tax));
});

test("stale versions are rejected and all visible monetary formatting uses Indian grouping", () => {
  assert.throws(() => calculateFixedEstimate("starter", 1200, noAddOns, "old"), /version/);
  assert.equal(formatInr(42750000), "₹4,27,500");
  assert.equal(formatInr(25), "₹0.25");
  assert.equal(formatInrRatio(20500000, 1200), "₹170.83");
});

const month = (recipientEmails: number) => ({
  smsRecipientSegments: 0,
  recipientEmails,
  whatsappRecipientMessages: {},
});

test("communication recipient emails use exact subcredits and share the student grant", () => {
  assert.equal(communicationDemandSubcredits(month(1)), 1);
  assert.equal(communicationDemandSubcredits(month(3)), 3);
  assert.equal(projectCommunication(1000, [month(9000)]).totalPaise, 0);
  assert.equal(projectCommunication(1000, [month(9001)]).totalPaise, 25);
});

test("mixed communication uses approved category weights and recipient SMS segments", () => {
  // The one-credit WhatsApp category is a synthetic test tariff, not a public category offer.
  assert.equal(
    communicationDemandSubcredits(
      {
        smsRecipientSegments: 100,
        recipientEmails: 900,
        whatsappRecipientMessages: { test_category: 100 },
      },
      { test_category: 3 }
    ),
    1500
  );
  assert.equal(communicationDemandSubcredits({ ...month(0), smsRecipientSegments: 200 }), 600);
  assert.equal(
    communicationDemandSubcredits({ ...month(0), whatsappRecipientMessages: { unknown: 1 } }),
    null
  );
  assert.equal(
    projectCommunication(1000, [{ ...month(0), whatsappRecipientMessages: { unknown: 1 } }])
      .totalPaise,
    null
  );
});

test("monthly grants expire while leftover purchased subcredits survive subsequent months", () => {
  const quote = projectCommunication(100, [month(901), month(901), month(901)]);
  assert.equal(quote.totalPaise, 25);
  assert.deepEqual(
    quote.months.map((row) => row?.closingPurchasedSubcredits),
    [2, 1, 0]
  );
  assert.equal(projectCommunication(100, [month(0), month(903)]).totalPaise, 25);
  assert.equal(projectCommunication(100, [month(902)], {}, 2).totalPaise, 0);
});

test("no entered workload gets the lowest subscription without a best-fit claim", () => {
  for (const students of [100, 1200, pricingPolicy.validation.maxStudents]) {
    const result = recommendPlan(students);
    assert.equal(result.plan, "starter");
    assert.equal(result.status, "lowest_subscription");
    assert.deepEqual(recommendPlan(students), result);
  }
});

test("AIC forecasts use working flat pools while unknown communication tariffs stay incomplete", () => {
  assert.equal(pricingPolicy.aic.staffMultiplierEnabled, false);
  assert.equal(pricingPolicy.plans.pro.monthlyIncludedMilliAic, 1500000);
  assert.equal(pricingPolicy.plans.enterprise.monthlyIncludedMilliAic, 2500000);
  assert.equal(projectAic("pro", 200000).annualPaise, 0);
  assert.equal(projectAic("enterprise", 0).annualPaise, 0);
  assert.equal(
    recommendPlan(1200, noAddOns, { monthlyMilliAic: 1000 }).status,
    "conditional_usage_forecast"
  );
  assert.equal(
    recommendPlan(1200, noAddOns, {
      communication: { ...month(0), whatsappRecipientMessages: { unknown: 10 } },
    }).status,
    "incomplete_usage_pricing"
  );
});

test("graduated AIC economics produce honest winners and preserve the lower-commitment tie break", () => {
  for (const [demand, winner] of [
    [0, "starter"],
    [100000, "pro"],
    [400000, "pro"],
  ] as const) {
    const result = recommendPlan(100, noAddOns, { monthlyMilliAic: demand });
    assert.equal(result.plan, winner);
    assert.equal(result.status, "conditional_usage_forecast");
  }
  const tie = recommendPlan(100, noAddOns, { monthlyMilliAic: 1000 });
  assert.equal(tie.candidates[0].firstYearExpectedPaise, tie.candidates[1].firstYearExpectedPaise);
  assert.equal(tie.plan, "starter");
});

test("custom services preserve the plan eligibility imposed by selected add-ons", () => {
  const result = recommendPlan(
    100000,
    { sso: true, whiteLabel: true, brandingAlreadyPurchased: false },
    {},
    true
  );
  assert.equal(result.plan, "pro");
  assert.equal(result.status, "custom_service_quote_required");
});

test("monthly communication grants and top-ups follow the selected plan multiplier", () => {
  for (const [plan, multiplier] of [
    ["starter", 3],
    ["pro", 6],
    ["enterprise", 9],
  ] as const) {
    const fixed = calculateFixedEstimate(plan, 1000);
    assert.equal(fixed.monthlyCommunicationCredits, 1000 * multiplier);
    const included = {
      smsRecipientSegments: 1000 * multiplier,
      recipientEmails: 0,
      whatsappRecipientMessages: {},
    };
    assert.equal(projectCommunication(1000, [included], {}, 0, plan).totalPaise, 0);
    assert.equal(
      projectCommunication(
        1000,
        [{ ...included, smsRecipientSegments: included.smsRecipientSegments + 1 }],
        {},
        0,
        plan
      ).totalPaise,
      25
    );
    const candidate = recommendPlan(1000, noAddOns, { communication: included }).candidates.find(
      (candidate) => candidate.plan === plan
    );
    assert.equal(candidate?.communication?.totalPaise, 0);
  }
});

test("plan selection is manual and survives every input edit", () => {
  for (const plan of planIds) {
    let state = studioReducer(initialStudioState, { type: "plan", plan });
    assert.equal(state.inputs, initialStudioState.inputs);
    state = studioReducer(state, {
      type: "inputs",
      values: { students: "10001", sso: true },
    });
    assert.equal(getStudioEstimate(state).selected?.plan, plan);
    assert.equal(state.inputs.students, "10001");
    assert.equal(state.inputs.sso, true);
    assert.equal(encodeEstimate(state).has("auto"), false);
  }
});

test("legacy auto and burn-rate links retain their recorded plan without adding forecast costs", () => {
  const restored = decodeEstimate(
    new URLSearchParams(
      `pricing=1&v=${pricingPolicy.version}&plan=enterprise&auto=1&students=1200&monthlyAic=123.456`
    )
  );
  assert.equal(restored.status, "recovered");
  assert.equal(restored.state?.plan, "enterprise");
  assert.ok(restored.state);
  assert.equal(getStudioEstimate(restored.state).selected?.plan, "enterprise");
  assert.equal(encodeEstimate(restored.state).has("monthlyAic"), false);
  assert.equal(getStudioEstimate(restored.state).selected?.aic, null);
});

test("share links round-trip preferences and recover independent valid fields", () => {
  const state = studioReducer(initialStudioState, { type: "plan", plan: "enterprise" });
  const encoded = encodeEstimate(state);
  const decoded = decodeEstimate(encoded);
  assert.equal(decoded.status, "valid");
  assert.deepEqual(decoded.state, state);
  encoded.set("v", "old");
  assert.equal(decodeEstimate(encoded).status, "stale");
  encoded.set("v", pricingPolicy.version);
  encoded.append("students", "1");
  assert.equal(decodeEstimate(encoded).status, "recovered");
  assert.equal(decodeEstimate(encoded).state?.plan, "enterprise");
  assert.equal(
    decodeEstimate(
      new URLSearchParams(`pricing=1&v=${pricingPolicy.version}&plan=admin&auto=1&students=100`)
    ).status,
    "recovered"
  );
  const tampered = encodeEstimate(state);
  tampered.set("firstYearTotal", "0");
  tampered.set("staff", "9999");
  tampered.set("school", "private");
  assert.deepEqual(decodeEstimate(tampered).state, state);
  assert.doesNotMatch(encodeEstimate(state).toString(), /school|staff|total/i);
});

test("malformed links retain usable selections without accepting invalid money or quantities", () => {
  const params = new URLSearchParams(
    `pricing=1&v=${pricingPolicy.version}&plan=enterprise&auto=0&students=2400&sso=1&monthlyAic=400&smsSegments=oops&pack_aic_1000=2&pack_aic_10000=bad&firstYearTotal=0`
  );
  const result = decodeEstimate(params);
  assert.equal(result.status, "recovered");
  assert.equal(result.state?.plan, "enterprise");
  assert.equal(result.state?.inputs.students, "2400");
  assert.equal(result.state?.inputs.smsSegments, "");
  assert.equal(result.state?.inputs.sso, true);
  assert.equal(result.state?.inputs.prepaidAicCredits, "2000");
  assert.ok(result.state && getStudioEstimate(result.state).selected?.fixed.annualLicencePaise);
  params.set("v", "2026-11-09.1");
  assert.equal(decodeEstimate(params).status, "stale");
  assert.equal(decodeEstimate(params).state?.inputs.students, "2400");
  params.append("students", "3000");
  assert.equal(decodeEstimate(params).state?.inputs.students, initialStudioState.inputs.students);
  params.delete("pricing");
  params.set("monthlyAic", "%broken");
  assert.doesNotThrow(() => decodeEstimate(params));
});

test("the existing enquiry flow receives a recomputed, editable estimate summary", () => {
  const message = estimateEnquiryMessage(
    studioReducer(initialStudioState, { type: "plan", plan: "enterprise" })
  );
  assert.match(message ?? "", /Enterprise for 1200 enrolled students/);
  assert.match(message ?? "", /Base subtotals exclude GST/);
  assert.match(message ?? "", /Additional usage and custom services are separate/);
  assert.match(message ?? "", /https:\/\/squarecampus.com\/pricing\//);
});

const costInput = {
  calls: [] as ModelCostCall[],
  otherCosts: [] as { id: string; currency: "INR" | "USD"; amount: string }[],
  usdInr: { version: "synthetic-fx", rate: "80" },
};

test("internal cost accounting subtracts cached tokens once and keeps INR costs in INR", () => {
  const call: ModelCostCall = {
    id: "call-1",
    currency: "INR",
    rateCardVersion: "synthetic",
    inputTokensIncludingCache: 1000000,
    cachedInputTokens: 500000,
    outputTokens: 0,
    uncachedInputPerMillion: "1",
    cachedInputPerMillion: "0.5",
    outputPerMillion: "2",
    outcome: "successful_execution",
  };
  const inr = calculateProviderCost({ ...costInput, calls: [call] }).internalCostInr;
  assert.equal(BigInt(inr.numerator) * BigInt(4), BigInt(inr.denominator) * BigInt(3));
  const usd = calculateProviderCost({
    ...costInput,
    calls: [{ ...call, currency: "USD" }],
  }).internalCostInr;
  assert.equal(BigInt(usd.numerator), BigInt(usd.denominator) * BigInt(60));
  assert.throws(() => calculateProviderCost({ ...costInput, calls: [call, call] }), /Duplicate/);
  assert.throws(() =>
    calculateProviderCost({ ...costInput, calls: [{ ...call, cachedInputTokens: 1000001 }] })
  );
});

test("customer charges come from accepted quotes independently of internal spend", () => {
  const acceptedQuote = {
    quoteId: "operation-1",
    tariffVersion: "test-only",
    scopeFingerprint: "scope",
    chargeMilliAic: 3000,
  };
  assert.equal(
    calculateOperationAic({ authorised: true, outcome: "completed", acceptedQuote }).debitMilliAic,
    3000
  );
  assert.equal(
    calculateOperationAic({ authorised: false, outcome: "completed", acceptedQuote }).debitMilliAic,
    0
  );
  assert.equal(
    calculateOperationAic({ authorised: true, outcome: "platform_failure", acceptedQuote })
      .debitMilliAic,
    0
  );
  assert.equal(
    calculateOperationAic({ authorised: true, outcome: "completed", acceptedQuote: null })
      .debitMilliAic,
    null
  );
});
