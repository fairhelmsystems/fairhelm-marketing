/**
 * Trusted enquiry labels and copy for the shared form. Demo and founding
 * diagnosis keep their dedicated forms. Proposal and selected-pilot enquiries
 * use the Contact page; legacy launch-intent links redirect there.
 */

export type FormIntent = "demo" | "founding-partner" | "proposal" | "launch-pilot";

/** The founding-partner query value honoured by the legacy redirect. */
export const FOUNDING_PARTNER_INTENT = "founding-partner";

/** Where each journey's form lives. */
export const FORM_ANCHORS = {
  foundingPartner: "request-diagnosis",
  proposal: "request-proposal",
} as const;

export const FOUNDING_PARTNER_FORM_HREF = `/launch-partners/#${FORM_ANCHORS.foundingPartner}`;

/**
 * Enquiry type stored with each submission. The first two values are what
 * the intake has always received; "Proposal request" is new with the pricing
 * form. `source` keeps its historical shape (`demo-form`,
 * `demo-form:founding-partner`) so existing CRM routing is unchanged.
 */
export const enquiryTypes: Record<FormIntent, string> = {
  demo: "Guided platform demo",
  "founding-partner": "Founding Institutional Partnership",
  proposal: "Proposal request",
  "launch-pilot": "Selected Institutional Launch Pilot",
};

export const sourceTags: Record<FormIntent, string> = {
  demo: "demo-form",
  "founding-partner": `demo-form:${FOUNDING_PARTNER_INTENT}`,
  proposal: "demo-form:proposal",
  "launch-pilot": "demo-form:launch-pilot",
};

/** Copy for the form itself, per journey. */
export const formCopy: Record<
  FormIntent,
  {
    eyebrow: string;
    heading: string;
    body: string;
    submitLabel: string;
    emailSubmitLabel: string;
    idleNote: string;
    successNote: string;
  }
> = {
  demo: {
    eyebrow: "Book a demo",
    heading: "Tell us what to cover.",
    body: "Name the areas that matter most — admissions, attendance, fees, exams, parent communication or reporting — and the session is planned around them.",
    submitLabel: "Book a demo",
    emailSubmitLabel: "Book a demo via email",
    idleNote:
      "We reply with a proposed session plan and the people worth bringing into the conversation.",
    successNote:
      "We reply within one business day with a proposed session plan and the people worth bringing into the conversation.",
  },
  "founding-partner": {
    eyebrow: "Request a diagnosis",
    heading: "Describe the bottleneck, not the wishlist.",
    body: "Tell us where visibility arrives late, ownership becomes unclear, or staff rebuild the same truth by hand. The more precise the bottleneck, the more useful the first conversation.",
    submitLabel: "Request a partnership diagnosis",
    emailSubmitLabel: "Request a partnership diagnosis via email",
    idleNote:
      "We reply with a written view of whether this belongs in a founding pilot, and what a bounded scope would look like.",
    successNote:
      "We reply within one business day with a written view of whether this belongs in a founding pilot, and what a bounded scope would look like.",
  },
  "launch-pilot": {
    eyebrow: "Launch-pilot enquiry",
    heading: "Tell us about your institution.",
    body: "Share your institution, campus structure and operational priorities. We will review fit and agree scope before any pilot is activated.",
    submitLabel: "Request launch-pilot review",
    emailSubmitLabel: "Request launch-pilot review via email",
    idleNote:
      "We reply to review eligibility and agree a bounded scope. Submitting does not activate a pilot.",
    successNote:
      "Your enquiry is received for eligibility and scope review; it does not activate a pilot.",
  },
  proposal: {
    eyebrow: "Request a proposal",
    heading: "Start the proposal with the basics.",
    body: "Student volume, campuses and the workflows in scope are enough to begin. Figures follow a short institutional discovery, in a written proposal.",
    submitLabel: "Request a proposal",
    emailSubmitLabel: "Request a proposal via email",
    idleNote:
      "We reply to arrange discovery; the written proposal follows once the inputs are agreed.",
    successNote:
      "We reply within one business day to arrange discovery; the written proposal follows once the inputs are agreed.",
  },
};

/** Page copy for /demo/ (the standard demo journey only). */
export const demoPage = {
  eyebrow: "Book a demo",
  heading: "See SquareCampus with your school’s workflows.",
  lead: "A guided session built around the workflows you choose and how your institution runs them today. You leave knowing where SquareCampus would fit and what a first rollout would involve.",
  points: [
    "For schools, school groups and trusts in India.",
    "Useful for principals, trustees, administrators, finance and IT.",
    "Covers rollout and how SquareCampus would sit beside what you already run.",
  ],
  expectations: {
    eyebrow: "What the session covers",
    heading: "Your workflows, your questions, your next step",
    body: "The session is planned around the workflows and systems you describe in the form.",
  },
  close: {
    eyebrow: "After the session",
    heading: "A clear next step.",
    body: "Your team should know where SquareCampus would sit against the systems you already run, what a first rollout would involve, and what a proposal would need from you.",
    points: [
      "Where SquareCampus would sit beside the systems you already run.",
      "What a first rollout would involve around your academic calendar.",
      "What a proposal needs: enrolment, campuses and the workflows in scope.",
    ],
  },
  foundingPartnerNote:
    "Considering the Founding Institutional Partner programme? It has its own diagnosis request.",
} as const;

/** Page copy for the founding-partner form section on /launch-partners/. */
export const foundingPartnerForm = {
  eyebrow: "Founding institutional partner",
  heading: "Bring one operational bottleneck. We will map the governed path around it.",
  lead: "This is not a product walkthrough. It is a diagnosis: we look at one workflow that currently loses time, ownership or money, and establish whether it belongs in a Founding Institutional Partner pilot.",
  points: [
    "SquareCampus may sit above or alongside your existing ERP, LMS, payment, identity and communication systems during the pilot.",
    "One bounded workflow or one campus, a written baseline, and one agreed success measure.",
    "Founding pilots are paid, scoped commercial engagements, agreed in writing before implementation begins.",
  ],
} as const;

/**
 * Legacy links: /demo/?intent=founding-partner used to switch this page's
 * copy. It now forwards to the founding-partner form before first paint.
 * Only allowlisted founding and launch-pilot values redirect; the query string is never
 * rendered or echoed back.
 */
export const legacyIntentRedirectScript = `
(() => {
  try {
    if (new URLSearchParams(window.location.search).get("intent") === "${FOUNDING_PARTNER_INTENT}") {
      window.location.replace("${FOUNDING_PARTNER_FORM_HREF}");
    } else if (new URLSearchParams(window.location.search).get("intent") === "launch-pilot") {
      window.location.replace("/contact/");
    }
  } catch (error) {}
})();
`;

/** Trusted enquiry labels; arbitrary URL or form strings are never echoed. */
export const demoIntentKeys: readonly FormIntent[] = [
  "demo",
  "founding-partner",
  "proposal",
  "launch-pilot",
];
export function resolveDemoIntent(value: string | null): FormIntent {
  return demoIntentKeys.find((key) => key === value) ?? "demo";
}
export function demoIntentForEnquiry(value: string): FormIntent {
  return demoIntentKeys.find((key) => enquiryTypes[key] === value) ?? "demo";
}
