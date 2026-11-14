import {
  calculatePrepaidLicence,
  calculateProposedAnnualGrowthAdjustment,
  pricingPolicy,
} from "@fairhelm/squarecampus-content/pricing";
import { decodeEstimate, encodeEstimate, initialStudioState } from "../src/lib/pricing-estimate";
import { assert, suite, test } from "./harness";

suite("prepaid commitments and proposed enrolment adjustment");
test("approved discount matrix and full upfront payment", () => {
  assert.equal(pricingPolicy.prepaidCommitment.payment, "full_term_upfront");
  assert.deepEqual(
    Object.values(pricingPolicy.prepaidCommitment.discountPercent).map((row) => [
      row.starter,
      row.pro,
      row.enterprise,
    ]),
    [
      [0, 0, 0],
      [10, 10, 10],
      [15, 15, 15],
      [25, 25, 25],
      [30, 30, 35],
    ]
  );
});
test("Growth five year example and licence GST", () => {
  const q = calculatePrepaidLicence("pro", 1000, 5, {
    basisPoints: 1800,
    rounding: "half_up_per_line",
  });
  assert.equal(q.standardMonthlyPaise, 1875000);
  assert.equal(q.discountedMonthlyPaise, 1312500);
  assert.equal(q.monthlySavingsPaise, 562500);
  assert.equal(q.prepaidPaise, 78750000);
  assert.equal(q.totalSavingsPaise, 33750000);
  assert.equal(q.gstPaise, 14175000);
  assert.equal(q.invoiceTotalPaise, 92925000);
});
test("Enterprise five year example rounds monthly equivalents to paise", () => {
  const q = calculatePrepaidLicence("enterprise", 1000, 5);
  assert.equal(q.standardMonthlyPaise, 2916667);
  assert.equal(q.discountedMonthlyPaise, 1895833);
  assert.equal(q.monthlySavingsPaise, 1020833);
  assert.equal(q.prepaidPaise, 113750000);
  assert.equal(q.totalSavingsPaise, 61250000);
});
test("proposed annual growth uses the original baseline and progressive slabs", () => {
  assert.equal(calculateProposedAnnualGrowthAdjustment("pro", 1000, 1200, 5), 2660000);
  for (const count of [0, 900, 1000])
    assert.equal(calculateProposedAnnualGrowthAdjustment("pro", 1000, count, 5), 0);
  assert.equal(calculateProposedAnnualGrowthAdjustment("pro", 5000, 5001, 5), 10500);
  assert.throws(() => calculateProposedAnnualGrowthAdjustment("pro", 1000, -1, 5), RangeError);
});
test("term survives shared estimate and invalid terms are recovered", () => {
  const state = {
    ...initialStudioState,
    plan: "pro" as const,
    inputs: { ...initialStudioState.inputs, students: "1000", termYears: "5" },
  };
  const params = encodeEstimate(state);
  assert.equal(decodeEstimate(params).state?.inputs.termYears, "5");
  params.set("termYears", "6");
  assert.equal(decodeEstimate(params).state?.inputs.termYears, "1");
  assert.throws(() => calculatePrepaidLicence("pro", 0, 5), RangeError);
});
