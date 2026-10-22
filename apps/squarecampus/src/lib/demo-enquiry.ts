import { demoIntentForEnquiry, FOUNDING_PARTNER_INTENT } from "@/content/demo-intents";

export const foundingPartnerFields = [
  ["bottleneck", "Operational bottleneck"],
  ["pilotUnit", "Intended pilot unit"],
  ["executiveSponsor", "Executive sponsor"],
  ["timeSensitivity", "Time sensitivity"],
  ["successMeasure", "Success measure"],
] as const;

/** Keep the existing intake schema and remove fields belonging to other journeys. */
export function buildEnquiryPayload<T extends { enquiryType: string; website: string }>(state: T) {
  const { website: _honeypot, ...payload } = state;
  if (demoIntentForEnquiry(state.enquiryType) !== FOUNDING_PARTNER_INTENT) {
    for (const [key] of foundingPartnerFields) {
      delete (payload as Record<string, unknown>)[key];
    }
  }
  return payload;
}

export function enquirySource(enquiryType: string) {
  const intent = demoIntentForEnquiry(enquiryType);
  return intent === "demo" ? "demo-form" : `demo-form:${intent}`;
}
