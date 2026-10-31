/** Only the intake's explicit disabled response permits a tokenless submit. */
export function isHumanCheckDisabled(body: unknown): boolean {
  return typeof body === "object" && body !== null &&
    "error" in body && body.error === "human check unavailable";
}
