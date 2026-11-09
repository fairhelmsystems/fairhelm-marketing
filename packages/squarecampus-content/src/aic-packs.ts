import policy from "./pricing-policy.json";

export const aicVolumeBands = policy.aic.volumeBands;
export const aicCatalogueVersion = policy.aic.catalogueVersion;
// Every candidate forecast must represent a purchased balance plus its monthly grant exactly.
const largestMonthlyGrant = Math.max(
  ...Object.values(policy.plans).map((plan) => plan.monthlyIncludedMilliAic)
);
export const maxAicPurchaseCredits = Math.floor(
  (Number.MAX_SAFE_INTEGER - largestMonthlyGrant) / 1000
);

/** Only for restoring links issued before custom-volume purchases replaced packs. */
export const legacyAicPacks = [1000, 5000, 10000, 50000, 100000, 250000].map((credits) => ({
  id: `aic_${credits}`,
  credits,
}));

function safeInteger(value: number) {
  if (!Number.isSafeInteger(value) || value < 0)
    throw new RangeError("Enter a non-negative safe whole quantity.");
  return value;
}

export function calculateAicPurchase(credits = 0) {
  safeInteger(credits);
  if (credits > maxAicPurchaseCredits)
    throw new RangeError(
      `Enter at most ${maxAicPurchaseCredits.toLocaleString("en-IN")} prepaid AIC for this estimator.`
    );
  if (credits > 0 && credits < policy.aic.minimumPurchaseCredits)
    throw new RangeError(
      `The minimum prepaid purchase is ${policy.aic.minimumPurchaseCredits} AIC.`
    );
  const lines: Array<{
    from: number;
    to: number;
    credits: number;
    unitPricePaise: number;
    totalPaise: number;
  }> = [];
  let previousLimit = 0;
  let totalPaise = 0;
  for (const band of aicVolumeBands) {
    const end = Math.min(credits, band.upTo ?? credits);
    const quantity = Math.max(0, end - previousLimit);
    if (quantity > 0) {
      const linePaise = safeInteger(quantity * band.unitPricePaise);
      lines.push({
        from: previousLimit + 1,
        to: end,
        credits: quantity,
        unitPricePaise: band.unitPricePaise,
        totalPaise: linePaise,
      });
      totalPaise = safeInteger(totalPaise + linePaise);
    }
    previousLimit = end;
  }
  return {
    catalogueVersion: aicCatalogueVersion,
    credits,
    lines,
    totalMilliAic: safeInteger(credits * 1000),
    totalPaise,
  };
}

export function recommendAicPurchase(requiredMilliAic: number) {
  safeInteger(requiredMilliAic);
  const credits =
    requiredMilliAic === 0
      ? 0
      : Math.max(
          policy.aic.minimumPurchaseCredits,
          Number((BigInt(requiredMilliAic) + BigInt(999)) / BigInt(1000))
        );
  const purchase = calculateAicPurchase(credits);
  return { ...purchase, excessMilliAic: purchase.totalMilliAic - requiredMilliAic };
}

export function forecastAic(input: {
  monthlyDemandMilliAic: readonly number[];
  monthlyIncludedMilliAic: number;
  openingPurchasedMilliAic?: number;
  selectedCredits?: number;
}) {
  safeInteger(input.monthlyIncludedMilliAic);
  const opening = safeInteger(input.openingPurchasedMilliAic ?? 0);
  for (const demand of input.monthlyDemandMilliAic) safeInteger(demand);
  const selected = calculateAicPurchase(input.selectedCredits);
  safeInteger(opening + selected.totalMilliAic + input.monthlyIncludedMilliAic);
  const purchasedNeed = input.monthlyDemandMilliAic.reduce(
    (sum, demand) => safeInteger(sum + Math.max(0, demand - input.monthlyIncludedMilliAic)),
    0
  );
  const additionalNeed = Math.max(0, purchasedNeed - safeInteger(opening + selected.totalMilliAic));
  const suggested = recommendAicPurchase(additionalNeed);
  let purchasedBalance = safeInteger(opening + selected.totalMilliAic + suggested.totalMilliAic);
  const months = input.monthlyDemandMilliAic.map((demand, index) => {
    const availableAtStartMilliAic = safeInteger(input.monthlyIncludedMilliAic + purchasedBalance);
    const includedUsedMilliAic = Math.min(demand, input.monthlyIncludedMilliAic);
    const purchasedUsedMilliAic = demand - includedUsedMilliAic;
    purchasedBalance = safeInteger(purchasedBalance - purchasedUsedMilliAic);
    return {
      month: index + 1,
      demandMilliAic: demand,
      availableAtStartMilliAic,
      includedUsedMilliAic,
      expiredIncludedMilliAic: input.monthlyIncludedMilliAic - includedUsedMilliAic,
      purchasedUsedMilliAic,
      closingPurchasedMilliAic: purchasedBalance,
    };
  });
  return {
    status: "conditional" as const,
    selected,
    suggested,
    additionalPurchasePaise: suggested.totalPaise,
    totalPurchasePaise: safeInteger(selected.totalPaise + suggested.totalPaise),
    openingPurchasedMilliAic: opening,
    closingPurchasedMilliAic: purchasedBalance,
    months,
  };
}
