import {
  aicVolumeBands,
  aicCatalogueVersion,
  maxAicPurchaseCredits,
  calculateAicPurchase,
  recommendAicPurchase,
  calculateFixedEstimate,
  forecastAic,
  noAddOns,
  planIds,
  pricingPolicy,
  recommendPlan,
} from "@fairhelm/squarecampus-content/pricing";
import { calculateOperationAic } from "@fairhelm/squarecampus-content/aic-cost";
import {
  decodeEstimate,
  encodeEstimate,
  getStudioEstimate,
  initialStudioState,
  parseStudioInputs,
} from "../src/lib/pricing-estimate";
import { assert, suite, test } from "./harness";

suite("graduated prepaid AIC pricing");

test("graduated AIC uses the approved six rates and preserves the minimum purchase", () => {
  assert.equal(aicCatalogueVersion, "2026-11-09.v4");
  assert.equal(pricingPolicy.aic.minimumPurchaseCredits, 1000);
  assert.deepEqual(
    aicVolumeBands.map((band) => [band.upTo, band.unitPricePaise]),
    [
      [5000, 500],
      [10000, 400],
      [50000, 300],
      [100000, 200],
      [250000, 150],
      [null, 100],
    ]
  );
  for (const [credits, paise] of [
    [0, 0],
    [1000, 500000],
    [5000, 2500000],
    [5001, 2500400],
    [10000, 4500000],
    [10001, 4500300],
    [50000, 16500000],
    [50001, 16500200],
    [100000, 26500000],
    [100001, 26500150],
    [250000, 49000000],
    [250001, 49000100],
  ]) {
    const result = calculateAicPurchase(credits);
    assert.equal(result.totalPaise, paise);
    assert.equal(result.totalMilliAic, credits * 1000);
    assert.equal(
      result.lines.reduce((sum, line) => sum + line.credits, 0),
      credits
    );
    assert.equal(
      result.lines.reduce((sum, line) => sum + line.totalPaise, 0),
      paise
    );
  }
  assert.equal(pricingPolicy.aic.purchasedBalanceCarriesForward, true);
  assert.equal(pricingPolicy.aic.purchasedExpiryPolicy, null);
});

test("every additional AIC increases the price by its marginal band rate without price cliffs", () => {
  let previous = calculateAicPurchase(1000).totalPaise;
  for (let credits = 1001; credits <= 300000; credits++) {
    const rate =
      credits <= 5000
        ? 500
        : credits <= 10000
          ? 400
          : credits <= 50000
            ? 300
            : credits <= 100000
              ? 200
              : credits <= 250000
                ? 150
                : 100;
    const current = calculateAicPurchase(credits).totalPaise;
    assert.equal(current - previous, rate);
    previous = current;
  }
});

test("aggregate grant headroom rejects extreme purchases before rendering and preserves the safe boundary", () => {
  const state = {
    ...initialStudioState,
    inputs: { ...initialStudioState.inputs, monthlyAic: "0", prepaidAicCredits: "9007199254740" },
  };
  assert.equal(parseStudioInputs(state.inputs).valid, false);
  assert.doesNotThrow(() => getStudioEstimate(state));
  assert.equal(getStudioEstimate(state).selected, null);
  const safe = {
    ...state,
    inputs: { ...state.inputs, prepaidAicCredits: String(maxAicPurchaseCredits) },
  };
  assert.equal(parseStudioInputs(safe.inputs).valid, true);
  assert.ok(getStudioEstimate(safe).selected);
  assert.throws(() =>
    forecastAic({
      monthlyDemandMilliAic: [0],
      monthlyIncludedMilliAic: 250000,
      openingPurchasedMilliAic: Number.MAX_SAFE_INTEGER,
    })
  );
});

test("forecast purchases cover exact whole quantities and round fractional demand upward", () => {
  for (const [milli, credits, excess] of [
    [0, 0, 0],
    [1, 1000, 999999],
    [1000001, 1001, 999],
    [6000000, 6000, 0],
  ]) {
    const quote = recommendAicPurchase(milli);
    assert.equal(quote.credits, credits);
    assert.equal(quote.excessMilliAic, excess);
  }
  assert.equal(recommendAicPurchase(12000000000000).credits, 12000000000);
});

test("invalid and unsafe quantities cannot become free or silently rounded purchases", () => {
  for (const credits of [-1, 1, 999, 1000.5, NaN, Infinity, Number.MAX_SAFE_INTEGER])
    assert.throws(() => calculateAicPurchase(credits));
  for (const milli of [-1, 0.5, Infinity]) assert.throws(() => recommendAicPurchase(milli));
  for (const value of ["999", "-1", "1000.1", "oops"])
    assert.equal(
      parseStudioInputs({ ...initialStudioState.inputs, prepaidAicCredits: value }).valid,
      false
    );
});

test("monthly included grants expire while paid balances carry and are consumed second", () => {
  const forecast = forecastAic({
    monthlyDemandMilliAic: [100000, 200000],
    monthlyIncludedMilliAic: 150000,
    openingPurchasedMilliAic: 900000,
  });
  assert.equal(forecast.months[0].expiredIncludedMilliAic, 50000);
  assert.equal(forecast.months[0].closingPurchasedMilliAic, 900000);
  assert.equal(forecast.months[1].purchasedUsedMilliAic, 50000);
  assert.equal(forecast.closingPurchasedMilliAic, 850000);
  const reset = forecastAic({
    monthlyDemandMilliAic: [0],
    monthlyIncludedMilliAic: 150000,
    openingPurchasedMilliAic: 900000,
  });
  assert.equal(reset.months[0].expiredIncludedMilliAic, 150000);
  assert.equal(reset.closingPurchasedMilliAic, 900000);
  const acrossReset = forecastAic({
    monthlyDemandMilliAic: [110000, 0],
    monthlyIncludedMilliAic: 150000,
    openingPurchasedMilliAic: 900000,
  });
  assert.equal(acrossReset.months[0].expiredIncludedMilliAic, 40000);
  assert.equal(acrossReset.months[1].availableAtStartMilliAic, 1050000);
});

test("the 400-AIC forecast compares actual graduated costs and keeps the cost-only winner", () => {
  const result = recommendPlan(1000, noAddOns, { monthlyMilliAic: 400000 });
  assert.deepEqual(
    result.candidates.map((candidate) => candidate.aic?.annualPaise),
    [2400000, 1500000, 900000]
  );
  assert.deepEqual(
    result.candidates.map((candidate) => candidate.firstYearExpectedPaise),
    [19900000, 24000000, 35900000]
  );
  assert.equal(result.plan, "starter");
  assert.equal(result.status, "conditional_usage_forecast");
});

test("custom prepaid purchases count once, fund demand, and do not repeat at renewal", () => {
  const fixed = calculateFixedEstimate(
    "enterprise",
    1200,
    { ...noAddOns, sso: true, whiteLabel: true },
    pricingPolicy.version,
    null,
    undefined,
    10000
  );
  assert.equal(fixed.firstYearFixedPaise, 42500000);
  assert.equal(fixed.purchaseYearWithPrepaidPaise, 47000000);
  assert.equal(fixed.renewalFixedPaise, 40000000);
  const forecast = recommendPlan(
    1200,
    noAddOns,
    { monthlyMilliAic: 400000 },
    false,
    undefined,
    undefined,
    10000
  ).candidates[2].aic?.forecast;
  assert.equal(forecast?.additionalPurchasePaise, 0);
  assert.equal(forecast?.totalPurchasePaise, 4500000);
  assert.equal(forecast?.closingPurchasedMilliAic, 8200000);
});

test("GST is charged on the graduated purchase once and Enterprise SSO stays optional at the same price", () => {
  const state = {
    ...initialStudioState,
    autoRecommend: false,
    plan: "enterprise" as const,
    inputs: {
      ...initialStudioState.inputs,
      sso: true,
      whiteLabel: true,
      prepaidAicCredits: "10000",
    },
  };
  const quote = getStudioEstimate(state).selected?.fixed;
  assert.equal(quote?.purchaseYearWithPrepaidPaise, 47000000);
  assert.equal(quote?.firstYearTaxPaise, 8460000);
  assert.equal(quote?.firstYearIncludingTaxPaise, 55460000);
  assert.equal(quote?.renewalIncludingTaxPaise, 47200000);
  const withoutSso = getStudioEstimate({ ...state, inputs: { ...state.inputs, sso: false } })
    .selected?.fixed;
  assert.equal(withoutSso?.purchaseYearWithPrepaidPaise, quote?.purchaseYearWithPrepaidPaise);
  assert.equal(withoutSso?.renewalIncludingTaxPaise, quote?.renewalIncludingTaxPaise);
  for (const plan of planIds) {
    const plain = calculateFixedEstimate(plan, 1200);
    const sso = calculateFixedEstimate(plan, 1200, { ...noAddOns, sso: true });
    assert.equal(sso.annualSsoPaise, plan === "enterprise" ? 0 : 250000);
    assert.equal(sso.firstYearFixedPaise - plain.firstYearFixedPaise, sso.annualSsoPaise);
    assert.equal(sso.eligible, true);
  }
});

test("custom quantities share safely and legacy pack links migrate to current volume pricing", () => {
  const state = {
    ...initialStudioState,
    inputs: { ...initialStudioState.inputs, prepaidAicCredits: "12345" },
  };
  const encoded = encodeEstimate(state);
  assert.equal(encoded.get("prepaidAicCredits"), "12345");
  assert.ok(!encoded.toString().includes("pack_"));
  assert.deepEqual(decodeEstimate(encoded).state, state);
  encoded.append("prepaidAicCredits", "0");
  assert.equal(decodeEstimate(encoded).status, "recovered");
  assert.equal(decodeEstimate(encoded).state?.inputs.prepaidAicCredits, "0");
  const old = new URLSearchParams(
    "pricing=1&v=2026-11-09.7&plan=enterprise&auto=0&students=1200&pack_aic_10000=2"
  );
  const restored = decodeEstimate(old);
  assert.equal(restored.status, "stale");
  assert.equal(restored.state?.inputs.prepaidAicCredits, "20000");
  assert.equal(
    restored.state && getStudioEstimate(restored.state).selected?.fixed.prepaidAic.totalPaise,
    7500000
  );
  old.set("prepaidAicCredits", "1000");
  assert.equal(decodeEstimate(old).state?.inputs.prepaidAicCredits, "0");
});

test("quoted operations have one plan-independent charge with no provider-cost conversion", () => {
  const acceptedQuote = {
    quoteId: "accepted-test-quote",
    tariffVersion: "synthetic-operation-v1",
    scopeFingerprint: "test-scope",
    chargeMilliAic: 3000,
  };
  for (const _plan of planIds)
    for (const _band of aicVolumeBands)
      assert.equal(
        calculateOperationAic({ acceptedQuote, authorised: true, outcome: "completed" })
          .debitMilliAic,
        3000
      );
  for (const outcome of ["platform_failure", "denied", "reopened", "unapproved_partial"] as const)
    assert.equal(
      calculateOperationAic({ acceptedQuote, authorised: true, outcome }).debitMilliAic,
      0
    );
  assert.equal(
    calculateOperationAic({ acceptedQuote: null, authorised: true, outcome: "completed" })
      .debitMilliAic,
    null
  );
  for (const amount of [0, -1, 10001, 0.5, NaN, Infinity])
    assert.throws(() =>
      calculateOperationAic({
        acceptedQuote: { ...acceptedQuote, chargeMilliAic: amount },
        authorised: true,
        outcome: "completed",
      })
    );
  assert.equal(
    calculateOperationAic({
      acceptedQuote: { ...acceptedQuote, chargeMilliAic: 10000 },
      authorised: true,
      outcome: "completed",
    }).debitMilliAic,
    10000
  );
});
