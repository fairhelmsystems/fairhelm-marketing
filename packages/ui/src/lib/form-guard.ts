/**
 * Client-side bot signals for the marketing forms.
 *
 * These only raise the cost of the laziest automation: a script that POSTs to
 * the intake endpoint directly never runs this code. Enforcement belongs to the
 * intake function (rate limit, human check); this layer keeps drive-by form
 * fillers from ever reaching it.
 */

/** A person cannot read, fill and submit a form faster than this. */
export const MIN_FILL_MS = 3000;

export type SubmissionVerdict = "ok" | "automated" | "too-fast";

/**
 * `automated`: the honeypot was filled; drop the submission quietly so the bot
 * learns nothing. `too-fast`: ambiguous (autofill, a paste) so the caller shows
 * a retry prompt instead of discarding what a real visitor typed.
 */
export function judgeSubmission({
  honeypot,
  openedAt,
  now,
}: {
  honeypot: string;
  openedAt: number;
  now: number;
}): SubmissionVerdict {
  if (honeypot.trim() !== "") {
    return "automated";
  }
  return now - openedAt < MIN_FILL_MS ? "too-fast" : "ok";
}
