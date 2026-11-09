/** Pure quoting and internal-cost references. Ledger settlement belongs to the backend.
 * Provider spend never determines the customer debit.
 */
import policy from "./pricing-policy.json";
type Fraction = { numerator: bigint; denominator: bigint };

function decimal(value: string): Fraction {
  if (!/^\d{1,24}(\.\d{1,18})?$/.test(value))
    throw new RangeError("Expected a non-negative exact decimal.");
  const [whole, fraction = ""] = value.split(".");
  return {
    numerator: BigInt(whole + fraction),
    denominator: BigInt(10) ** BigInt(fraction.length),
  };
}
function add(a: Fraction, b: Fraction): Fraction {
  return {
    numerator: a.numerator * b.denominator + b.numerator * a.denominator,
    denominator: a.denominator * b.denominator,
  };
}
function multiply(a: Fraction, b: Fraction): Fraction {
  return { numerator: a.numerator * b.numerator, denominator: a.denominator * b.denominator };
}
const zero: Fraction = { numerator: BigInt(0), denominator: BigInt(1) };

export type AcceptedOperationQuote = {
  quoteId: string;
  tariffVersion: string;
  scopeFingerprint: string;
  chargeMilliAic: number;
};

export function calculateOperationAic(input: {
  authorised: boolean;
  outcome: "completed" | "platform_failure" | "denied" | "reopened" | "unapproved_partial";
  acceptedQuote: AcceptedOperationQuote | null;
}) {
  if (
    typeof input.authorised !== "boolean" ||
    !["completed", "platform_failure", "denied", "reopened", "unapproved_partial"].includes(
      input.outcome
    )
  )
    throw new RangeError("Unsupported operation outcome.");
  if (!input.authorised || input.outcome !== "completed")
    return { status: "not_chargeable" as const, debitMilliAic: 0 };
  const quote = input.acceptedQuote;
  if (quote === null) return { status: "unconfigured" as const, debitMilliAic: null };
  if (
    ![quote.quoteId, quote.tariffVersion, quote.scopeFingerprint].every(
      (value) => typeof value === "string" && value.trim()
    )
  )
    throw new RangeError(
      "An accepted operation quote requires identity, scope and tariff version."
    );
  if (
    !Number.isSafeInteger(quote.chargeMilliAic) ||
    quote.chargeMilliAic <= 0 ||
    quote.chargeMilliAic > policy.aic.maximumOperationMilliAic
  )
    throw new RangeError("An operation quote must respect the supported AIC cap.");
  return {
    status: "quoted" as const,
    debitMilliAic: quote.chargeMilliAic,
    quoteId: quote.quoteId,
    tariffVersion: quote.tariffVersion,
    scopeFingerprint: quote.scopeFingerprint,
  };
}

export type ModelCostCall = {
  id: string;
  currency: "INR" | "USD";
  rateCardVersion: string;
  inputTokensIncludingCache: number;
  cachedInputTokens: number;
  outputTokens: number;
  uncachedInputPerMillion: string;
  cachedInputPerMillion: string;
  outputPerMillion: string;
  outcome: "successful_execution" | "failed_attempt" | "internal_retry";
};

export function calculateProviderCost(input: {
  calls: readonly ModelCostCall[];
  otherCosts: readonly {
    id: string;
    currency: "INR" | "USD";
    amount: string;
  }[];
  usdInr: { version: string; rate: string };
}) {
  if (!input.usdInr.version) throw new RangeError("The exchange-rate policy requires a version.");
  const fx = decimal(input.usdInr.rate);
  if (fx.numerator === BigInt(0)) throw new RangeError("The exchange rate must be positive.");
  const ids = new Set<string>();
  let internalCost = zero;
  const record = (id: string, currency: "INR" | "USD", cost: Fraction) => {
    if (!id || ids.has(id)) throw new RangeError("Duplicate or missing provider cost identifier.");
    ids.add(id);
    const inr = currency === "USD" ? multiply(cost, fx) : cost;
    internalCost = add(internalCost, inr);
  };
  for (const call of input.calls) {
    if (!call.rateCardVersion) throw new RangeError("Model prices require a rate-card version.");
    for (const tokens of [
      call.inputTokensIncludingCache,
      call.cachedInputTokens,
      call.outputTokens,
    ]) {
      if (!Number.isSafeInteger(tokens) || tokens < 0)
        throw new RangeError("Invalid provider token count.");
    }
    if (call.cachedInputTokens > call.inputTokensIncludingCache)
      throw new RangeError("Cached tokens exceed input tokens.");
    const tokenCost = (tokens: number, rate: string) =>
      multiply({ numerator: BigInt(tokens), denominator: BigInt(1000000) }, decimal(rate));
    const cost = add(
      add(
        tokenCost(
          call.inputTokensIncludingCache - call.cachedInputTokens,
          call.uncachedInputPerMillion
        ),
        tokenCost(call.cachedInputTokens, call.cachedInputPerMillion)
      ),
      tokenCost(call.outputTokens, call.outputPerMillion)
    );
    record(call.id, call.currency, cost);
  }
  for (const cost of input.otherCosts) record(cost.id, cost.currency, decimal(cost.amount));
  const serialise = (value: Fraction) => ({
    numerator: String(value.numerator),
    denominator: String(value.denominator),
  });
  return {
    internalCostInr: serialise(internalCost),
    fxVersion: input.usdInr.version,
  };
}
