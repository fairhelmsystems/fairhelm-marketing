/**
 * Guards for retention copy, shared by tests/retention.test.ts and
 * scripts/check-build.ts (which applies them to the rendered page).
 *
 * The public retention surfaces may state a period only when it comes from a
 * reviewed schedule entry. Everything else — pointers, explanations, FAQ
 * answers — must be free of durations, deadlines, storage amounts and money.
 */

const NUMBER_WORDS =
  "one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|eighteen|twenty|thirty|forty|sixty|ninety";

/** A duration or deadline: "30 days", "six years", "seven tax years", "18-month". */
export const DURATION = new RegExp(
  `\\b(\\d+|${NUMBER_WORDS})[\\s-]+(tax[\\s-]+)?(hours?|days?|weeks?|months?|years?)\\b`,
  "i"
);

/** Phrasings that set a deadline without a unit next to the number. */
export const DEADLINE =
  /\b(within|no later than|by the end of|end of (january|february|march|april|may|june|july|august|september|october|november|december))\b/i;

/** Storage allowances. */
export const STORAGE_AMOUNT = /\b\d+(\.\d+)?\s?(KB|MB|GB|TB|PB)\b/;

/** Money, penalties and rupee figures of any kind. */
export const MONEY = /₹|\bRs\.?\s?\d|\bINR\b|\bcrore\b|\blakh\b|\brupees?\b|\bpenalt(y|ies)\b/i;

/** Claims this page must never make. */
export const OVERCLAIMS: ReadonlyArray<RegExp> = [
  /\bfully compliant\b|\bpure compliance\b|\bguarantee(s|d)? compliance\b/i,
  /\bcounsel[- ]approved\b|\breviewed by counsel\b|\bunder legal review\b/i,
  /\bcertificate of (erasure|deletion)\b/i,
  /\b(instant|immediate|automatic) (deletion|erasure)\b/i,
  /\bself-service (legal[- ]hold|preservation) (control|feature) (is|are) available\b/i,
];

export function retentionCopyProblems(text: string, label: string): string[] {
  const problems: string[] = [];
  for (const [pattern, reason] of [
    [DURATION, "a duration"],
    [DEADLINE, "a deadline"],
    [STORAGE_AMOUNT, "a storage amount"],
    [MONEY, "a money or penalty reference"],
  ] as const) {
    const hit = text.match(pattern);
    if (hit) problems.push(`${label}: contains ${reason} ("${hit[0]}")`);
  }
  for (const pattern of OVERCLAIMS) {
    const hit = text.match(pattern);
    if (hit) problems.push(`${label}: overclaims ("${hit[0]}")`);
  }
  return problems;
}

/** Every string inside a nested content object. */
export function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) for (const item of value) collectStrings(item, out);
  else if (value && typeof value === "object")
    for (const item of Object.values(value)) collectStrings(item, out);
  return out;
}
