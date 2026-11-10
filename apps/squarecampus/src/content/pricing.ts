/** Pricing copy derives from the shared commercial facts and versioned public rate card.
 * No feature eligibility differs by plan. Unapproved quantities remain unspecified.
 */

import {
  commercialScope,
  aicCommercial,
  corePlatform,
  dataEventsApi,
  dataPortability,
  foundingProgramme,
  identity,
  launchPilot,
  mobileAppPublishing,
  type PlanId,
  pricingAvailability,
  planHierarchy,
  securityBaseline,
} from "./commercial";
import { pricingPolicy } from "@fairhelm/squarecampus-content/pricing";
import { company } from "./company";

const aicPerMonth = (plan: PlanId) =>
  (pricingPolicy.plans[plan].monthlyIncludedMilliAic / 1000).toLocaleString("en-IN");
const creditsPerStudent = pricingPolicy.communication.monthlyCreditsPerStudent;
const apiRpm = pricingPolicy.dataEventsApi.slidingWindows;

export type { PlanId } from "./commercial";

export type Plan = {
  id: PlanId;
  name: string;
  capabilities: readonly string[];
  suitedFor: string;
  cta: { label: string; href: string };
};

const commonCapabilities = [
  "Every generally available SquareCampus module and feature",
  "Multi-campus operations, governance and role-scoped workflows",
  "Analytics, self-serve reporting and supported data exports",
  "Standard apps for staff, parents and students",
  "AEGIS access with separately accounted AI consumption",
  "Standard implementation and support",
] as const;

export const plans: readonly Plan[] = planHierarchy.map((plan) => ({
  id: plan.id,
  name: plan.name,
  suitedFor: plan.suitedFor,
  capabilities: commonCapabilities,
  cta: { label: `Discuss ${plan.name}`, href: "/demo/" },
}));

export const enterpriseForSmallerInstitutions = {
  heading: "Enterprise control is not reserved for large institutions.",
  body: "Enterprise School OS describes SquareCampus's operating model. Every plan is eligible for the same generally available governance, workflows, analytics and multi-campus capabilities. Choose a plan by included allowances and services, at any enrolment.",
  compact: "Institutional governance for a single school.",
  triggers: [
    "Connected policies, roles and approvals",
    "Named ownership of exceptions",
    "Institution-wide leadership visibility",
    "Role-scoped records and audit history",
  ],
  counterNote:
    "Campus count, institutional identity and governance requirements do not force an upgrade. Unavailable or preview functionality and bespoke engineering require a confirmed scope.",
} as const;

export const SCOPE_NOTE = `${corePlatform.multiCampus} ${corePlatform.availability}`;

/**
 * What the licence already covers, drawn from `pricingAvailability.included`
 * and `commercialScope`. Shown before the optional lines so the split is
 * visible at a glance; `plans` marks an inclusion that is not in every plan.
 * Capabilities here are described as designed; the band carries the
 * availability line, and the proposal confirms what an institution gets.
 */
export const licenceIncludes: ReadonlyArray<{
  id: "platform" | "apps" | "reports" | "support" | "allowance" | "migration" | "tally" | "payments";
  title: string;
  detail: string;
  plans?: string;
}> = [
  {
    id: "platform",
    title: "Every generally available feature",
    detail: corePlatform.promise,
  },
  {
    id: "apps",
    title: "Staff, parent and student apps",
    detail: "The standard SquareCampus apps, at no extra charge.",
  },
  {
    id: "reports",
    title: "Your own reports",
    detail:
      "Filter, group, total and chart your tables, save views and export to Excel, CSV or PDF.",
  },
  {
    id: "support",
    title: "Implementation and support",
    detail: "In every plan, with no paid fast track. Designed to need little or no training.",
  },
  {
    id: "allowance",
    title: "Monthly usage allowance",
    detail: commercialScope.allowance,
  },
  {
    id: "tally",
    title: "Tally-ready export setup",
    detail: commercialScope.tallyExport,
    plans: "Growth and Enterprise",
  },
  {
    id: "payments",
    title: "Your Razorpay account",
    detail: commercialScope.paymentGateway,
  },
  {
    id: "migration",
    title: "Data migration",
    detail: commercialScope.migrationShort,
    plans: "Growth and Enterprise",
  },
];

/**
 * The combined one-time branding charge is separate from the active subscription.
 * Fairhelm owns publisher accounts. Store fees and maintenance need confirmation.
 */
export const WHITE_LABEL_NOTE = `White-label Android and iOS branding is included in Enterprise. On Growth it costs ₹25,000 once, combined, in the year first purchased. A valid existing branding entitlement is not charged again on ordinary renewal or a plan change. Native branded apps require no external API add-on. ${mobileAppPublishing} Store fees and maintenance scope must be confirmed before purchase. Subscription-backed functions require an active subscription. Founding Institutional Partner treatment follows the executed agreement.`;

/**
 * Procurement FAQ. This array is the single source for both the rendered
 * accordion and the FAQPage JSON-LD, so the visible text and the structured
 * data cannot drift apart.
 */
export const pricingFaqs = [
  { question: "Is Tally export setup included?", answer: commercialScope.tallyExport },
  { question: "Who receives fee payments?", answer: commercialScope.paymentGateway },
  { question: "Which Indian fee rules are supported?", answer: commercialScope.indianFeeOperations },
  {
    question: "Will new standard features increase my price?",
    answer: corePlatform.futureFeatures,
  },
  { question: "Are data and audit exports included?", answer: dataEventsApi.exports },
  {
    question: "How is the Data & Events API priced?",
    answer: `${dataEventsApi.pricing} ${dataEventsApi.availability}`,
  },
  {
    question: "Do API resources or events differ by plan?",
    answer: `No. ${dataEventsApi.catalogue} Only the request limit differs: ${apiRpm.starter.requests.toLocaleString("en-IN")}, ${apiRpm.pro.requests.toLocaleString("en-IN")} and ${apiRpm.enterprise.requests.toLocaleString("en-IN")} requests per minute on Starter, Growth and Enterprise.`,
  },
  {
    question: "Do API rate limits create overage charges?",
    answer:
      "No. Requests above your limit are throttled, with no overage charge and no automatic upgrade. Limits are counted in a sliding 60-second window across the institution's external clients. Stream bounds and replay retention are confirmed during onboarding.",
  },
  {
    question: "Do native or white-label apps need the API add-on?",
    answer: dataEventsApi.nativeWorkflows,
  },
  { question: "Does API access require paid Entra SSO?", answer: dataEventsApi.identity },
  { question: "Is app branding charged again at renewal?", answer: WHITE_LABEL_NOTE },
  {
    question: "Is pricing public?",
    answer: pricingAvailability.short,
  },
  {
    question: "What does Enterprise add beyond ordinary ERP modules?",
    answer: `Nothing is locked behind Enterprise: every plan has the same generally available features, including governance, analytics and multi-campus operations. Enterprise adds a larger included AIC pool (${aicPerMonth("enterprise")} against ${aicPerMonth("pro")} AIC a month on Growth), more shared communication credits (${creditsPerStudent.enterprise} against ${creditsPerStudent.pro} per student a month), white-label Android and iOS apps and Entra SSO included in the licence, the option of custom AEGIS dashboards scoped and quoted for your institution, and a higher Data & Events API limit (${apiRpm.enterprise.requests.toLocaleString("en-IN")} against ${apiRpm.pro.requests.toLocaleString("en-IN")} requests per minute). Migration is included in Growth too. Custom services remain separately scoped. ${dataPortability}`,
  },
  {
    question: "Is SquareCampus appropriate if we only need attendance and fees?",
    answer: `Usually not. ${pricingAvailability.positioning}`,
  },
  {
    question: "Can we keep our existing ERP during the pilot?",
    answer:
      "Yes. A pilot covers one campus or one workflow bundle, and your ERP keeps running and stays authoritative. Replacing anything is a later decision, taken on evidence.",
  },
  {
    question: "Is migration included?",
    answer: `${commercialScope.migration} ${commercialScope.migrationLimit}`,
  },
  {
    question: "Do custom reports cost extra?",
    answer: commercialScope.reporting,
  },
  {
    question: "What does implementation cost?",
    answer: `Nothing extra. ${commercialScope.implementation}`,
  },
  {
    question: "Can the price grow after we sign?",
    answer: `Not by surprise. ${commercialScope.noSurprises} ${commercialScope.renewal}`,
  },
  {
    question: "Can SquareCampus run in our own cloud account?",
    answer:
      "Not today. SquareCampus runs as managed cloud on Microsoft Azure in India. If your governance requires something different, raise it during scoping and we will tell you plainly whether we can support it.",
  },
  {
    question: "Which sign-in options does each plan have?",
    answer: `${identity.baseline.body} ${identity.sso.body} ${identity.enterprise.body}`,
  },
  {
    question: "Does SquareCampus access our Outlook or Microsoft 365 data?",
    answer:
      "No. Entra ID sign-in authenticates identity only; no access to email, files, Teams or SharePoint is needed.",
  },
  {
    question: "Does single sign-on automatically create and remove users?",
    answer:
      "Single sign-on authenticates identity. Automated provisioning and lifecycle controls require separately validated support; available functionality and configuration are confirmed during technical onboarding.",
  },
  {
    question: "Is GST included?",
    answer: `${pricingAvailability.taxes} Applicable Indian taxes are shown on the order form and on tax invoices issued by ${company.legalNameDisplay} under GSTIN ${company.gstin}.`,
  },
  {
    question: "How is AEGIS usage handled?",
    answer: `${aicCommercial.purchases} ${aicCommercial.wallet}`,
  },
  { question: "How much AIC does one analytical answer use?", answer: aicCommercial.operations },
  {
    question: "Does purchased AIC repeat at renewal?",
    answer:
      "Prepaid AIC is a separate purchase in the quantity you choose, priced using graduated volume bands. It enters the purchase-year estimate once. Renewal does not automatically buy credits again.",
  },
  {
    question: "Can a trust contract cover multiple campuses?",
    answer:
      "Yes. A trust-level agreement can cover agreed campuses within the same billed subscription. Specialised configuration and services are scoped separately.",
  },
  {
    question: "How many Founding Institutional Partner positions exist?",
    answer: `${foundingProgramme.positionsStatement} ${foundingProgramme.nature}`,
  },
  {
    question: "Do all plans include the core platform and multi-campus operations?",
    answer: `Yes. ${corePlatform.promise} Plans differ only in included allowances and services, and campuses in the same billed institutional subscription count together for enrolment. ${corePlatform.availability}`,
  },
  {
    question: "Can Starter request Microsoft Entra single sign-on separately?",
    answer: identity.sso.body,
  },
  {
    question: "Are security and data portability restricted to Enterprise?",
    answer: `${securityBaseline} ${dataPortability}`,
  },
  {
    question: "Is there a trial or pilot option?",
    answer: `${launchPilot.summary} ${launchPilot.eligibility} ${launchPilot.boundaries} ${launchPilot.pricing} ${launchPilot.separation}`,
  },
  {
    question: "Where is the launch pilot available?",
    answer: launchPilot.geography,
  },
  {
    question: "Can we buy one enhancement without changing our whole plan?",
    answer: `Optional services follow their plan eligibility and technical readiness. Data & Events API is available on every plan. Entra SSO is optional on every plan and included in Enterprise. White-label apps are included in Enterprise and a ₹25,000 one-time charge on Growth. ${identity.sso.body} Other enhancements, consumption and professional services are assessed and quoted separately; their availability is not implied by appearing in a scoping discussion.`,
  },
] as const;
