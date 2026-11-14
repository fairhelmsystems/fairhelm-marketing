import {
  calculatePrepaidLicence,
  calculateTermReference,
  calculateFixedEstimate,
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

test("term reference applies prepaid licence and counts annual and one-time add-ons correctly", () => {
  const tax = { basisPoints: 1800, rounding: "half_up_per_line" as const };
  const fixed = calculateFixedEstimate(
    "pro",
    1000,
    { sso: true, whiteLabel: true, brandingAlreadyPurchased: false },
    pricingPolicy.version,
    tax
  );
  const one = calculateTermReference(fixed, 1, tax);
  const five = calculateTermReference(fixed, 5, tax);
  assert.equal(one.subtotalPaise, 25250000);
  assert.equal(five.subtotalPaise, 82500000);
  assert.equal(five.monthlyPaise, 1375000);
  assert.equal(five.standardMonthlyPaise, 1937500);
  assert.equal(five.monthlySavingsPaise, 562500);
  assert.equal(five.studentMonthlyPaise, 1375);
  assert.equal(five.standardStudentMonthlyPaise, 1938);
  assert.equal(five.taxPaise, 14850000);
  assert.equal(five.includingTaxPaise, 97350000);
});

test("6,720 pricing combinations match an independent paise oracle", () => {
  const rateCards = {
    starter: { rates: [17500, 15000, 11000], sso: 250000, api: 250000, fiveYear: 30 },
    pro: { rates: [22500, 19000, 15000], sso: 250000, api: 500000, fiveYear: 30 },
    enterprise: { rates: [35000, 25000, 20000], sso: 0, api: 1000000, fiveYear: 35 },
  } as const;
  const plans = ["starter", "pro", "enterprise"] as const;
  const taxes = [null, 0, 1800] as const;
  const aicPurchases = [
    { credits: 0, paise: BigInt(0) },
    { credits: 5001, paise: BigInt(2500400) },
  ];
  const round = (amount: bigint, divisor: bigint) => (amount + divisor / BigInt(2)) / divisor;
  let cases = 0;

  for (const plan of plans) {
    const card = rateCards[plan];
    const brandingOptions = plan === "starter" ? ["none"] : ["none", "new", "existing"];
    const discounts = [0, 10, 15, 25, card.fiveYear];

    for (const students of [100, 999, 1000, 1001, 4999, 5000, 5001, 5000000]) {
      const slabCounts = [
        Math.min(1000, students),
        Math.max(0, Math.min(students - 1000, 4000)),
        Math.max(0, students - 5000),
      ];
      const annual = slabCounts.reduce(
        (total, count, index) => total + BigInt(count) * BigInt(card.rates[index]),
        BigInt(0)
      );

      for (const [index, discount] of discounts.entries()) {
        const years = index + 1;
        const y = BigInt(years);
        const months = BigInt(12) * y;
        const studentMonths = months * BigInt(students);
        const standardLicence = annual * y;
        const licence = round(standardLicence * BigInt(100 - discount), BigInt(100));

        const prepaid = calculatePrepaidLicence(plan, students, years);
        const studentYearMonths = BigInt(12 * students);
        assert.equal(prepaid.standardMonthlyPaise, Number(round(annual, BigInt(12))));
        assert.equal(prepaid.discountedMonthlyPaise, Number(round(licence, months)));
        assert.equal(prepaid.monthlySavingsPaise, Number(round(standardLicence - licence, months)));
        assert.equal(prepaid.standardStudentMonthlyPaise, Number(round(annual, studentYearMonths)));
        assert.equal(prepaid.discountedStudentMonthlyPaise, Number(round(licence, studentMonths)));

        for (const sso of [false, true]) {
          for (const dataEventsApi of [false, true]) {
            for (const branding of brandingOptions) {
              for (const aic of aicPurchases) {
                for (const basisPoints of taxes) {
                  const tax =
                    basisPoints === null
                      ? null
                      : {
                          basisPoints,
                          rounding: "half_up_per_line" as const,
                        };
                  const gst = (line: bigint) =>
                    round(line * BigInt(basisPoints ?? 0), BigInt(10000));
                  const annualSso = sso ? BigInt(card.sso) : BigInt(0);
                  const annualApi = dataEventsApi ? BigInt(card.api) : BigInt(0);
                  const brandingFee =
                    plan === "pro" && branding === "new" ? BigInt(2500000) : BigInt(0);
                  const extras = (annualSso + annualApi) * y + brandingFee + aic.paise;
                  const standardSubtotal = standardLicence + extras;
                  const subtotal = licence + extras;
                  const savings = standardLicence - licence;
                  const totalTax =
                    gst(licence) +
                    (gst(annualSso) + gst(annualApi)) * y +
                    gst(brandingFee) +
                    gst(aic.paise);
                  const addOns = {
                    sso,
                    dataEventsApi,
                    whiteLabel: branding !== "none",
                    brandingAlreadyPurchased: branding === "existing",
                  };
                  const fixed = calculateFixedEstimate(
                    plan,
                    students,
                    addOns,
                    pricingPolicy.version,
                    tax,
                    undefined,
                    aic.credits
                  );
                  const context = JSON.stringify({
                    plan,
                    students,
                    years,
                    basisPoints,
                    addOns,
                    aic: aic.credits,
                  });

                  assert.equal(fixed.annualLicencePaise, Number(annual), context);
                  assert.deepEqual(
                    fixed.slabs.map((slab) => slab.students),
                    slabCounts,
                    context
                  );
                  assert.deepEqual(
                    calculateTermReference(fixed, years, tax),
                    {
                      subtotalPaise: Number(subtotal),
                      standardSubtotalPaise: Number(standardSubtotal),
                      monthlyPaise: Number(round(subtotal, months)),
                      standardMonthlyPaise: Number(round(standardSubtotal, months)),
                      monthlySavingsPaise: Number(round(savings, months)),
                      studentMonthlyPaise: Number(round(subtotal, studentMonths)),
                      standardStudentMonthlyPaise: Number(round(standardSubtotal, studentMonths)),
                      totalSavingsPaise: Number(savings),
                      taxPaise: tax ? Number(totalTax) : null,
                      includingTaxPaise: tax ? Number(subtotal + totalTax) : null,
                      complete: true,
                    },
                    context
                  );
                  cases++;
                }
              }
            }
          }
        }
      }
    }
  }
  assert.equal(cases, 6720);
});

test("unsupported and unpriced services suppress a complete invoice estimate", () => {
  const tax = { basisPoints: 1800, rounding: "half_up_per_line" as const };
  const incompatible = calculateFixedEstimate("starter", 1000, {
    sso: true,
    whiteLabel: true,
    brandingAlreadyPurchased: false,
  });
  const missingPrice = calculateFixedEstimate(
    "enterprise",
    5001,
    { sso: true, whiteLabel: false, dataEventsApi: true, brandingAlreadyPurchased: false },
    pricingPolicy.version,
    tax,
    {
      annualDataEventsApiPaise: {
        ...pricingPolicy.addOns.annualDataEventsApiPaise,
        enterprise: null,
      },
      slidingWindows: pricingPolicy.dataEventsApi.slidingWindows,
    }
  );

  for (const fixed of [incompatible, missingPrice]) {
    const term = calculateTermReference(fixed, 5, tax);
    assert.equal(term.complete, false);
    assert.equal(term.taxPaise, null);
    assert.equal(term.includingTaxPaise, null);
  }
  for (const count of [0, 99, 100.5, 5000001, NaN]) {
    assert.throws(() => calculatePrepaidLicence("pro", count, 5), RangeError);
  }
});
