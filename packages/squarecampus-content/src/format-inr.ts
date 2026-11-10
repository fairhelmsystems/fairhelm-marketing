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
