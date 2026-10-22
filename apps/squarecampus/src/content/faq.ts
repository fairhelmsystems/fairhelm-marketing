import {
  corePlatform,
  dataPortability,
  foundingProgramme,
  identity,
  integrationScope,
  launchPilot,
  pricingAvailability,
  securityBaseline,
} from "./commercial";
import { retentionReuse } from "./retention";

export type FaqCategoryId = "getting-started" | "features" | "security" | "pricing";

export type FaqItem = {
  question: string;
  answer: string;
  category: FaqCategoryId;
};

export const faqCategories: Array<{ id: FaqCategoryId | "all"; name: string }> = [
  { id: "all", name: "All questions" },
  { id: "getting-started", name: "Getting started" },
  { id: "features", name: "Features & modules" },
  { id: "security", name: "Security & data" },
  { id: "pricing", name: "Pricing & support" },
];

export const faqs: FaqItem[] = [
  // Getting started
  {
    question: "What does SquareCampus actually replace?",
    answer:
      "SquareCampus connects institutional operations on one governed system of record. Available workflows and the rollout scope are agreed with the institution; existing systems can remain authoritative during a bounded deployment.",
    category: "getting-started",
  },
  {
    question: "Who is SquareCampus for?",
    answer:
      "Schools, educational trusts, multi-campus school groups and, as a governed operating layer over the systems they already run, higher-education institutions in India. It suits institutions that want operational governance, accountable ownership and leadership visibility, whether they run one campus or many. It is not designed for an institution that needs only basic attendance, fees and report cards at the lowest possible licence price.",
    category: "getting-started",
  },
  {
    question: "How fast can we go live?",
    answer:
      "We provide migration support, role-based training, and a dedicated success partner to configure your policies and timelines. Rollout is sequenced around your academic calendar, and the timeline is agreed during scoping based on your data complexity.",
    category: "getting-started",
  },
  {
    question: "How do we get started?",
    answer:
      "Book a guided demo. We map your workflows, share a rollout plan, and align on timelines and commercial terms. After discovery you receive a written proposal with the licence, any optional lines such as custom integrations, the training schedule and go-live milestones.",
    category: "getting-started",
  },
  {
    question: "What data can be migrated from our existing systems?",
    answer:
      "We support migration of student records, fee history, attendance data, academic records, staff information, and communication history. Our team works with you to map your existing data structure to SquareCampus and validates the migration with a parallel run before go-live. Migration is included in Pro and Enterprise. If your current system lacks data SquareCampus needs, or it is too fragmented to reconcile, we show you what cannot move before go-live.",
    category: "getting-started",
  },

  // Features & modules
  {
    question: "What modules are included in SquareCampus?",
    answer: `${corePlatform.included} ${corePlatform.availability}`,
    category: "features",
  },
  {
    question: "Will it integrate with our existing systems?",
    answer: `Where they offer a documented API, usually yes — as scoped work. ${integrationScope.summary}`,
    category: "features",
  },
  {
    question: "Can we build our own frontend or mobile apps on SquareCampus?",
    answer:
      "Development API access and supported interfaces are assessed during discovery. Authorisation, compliance review, commercial eligibility and delivery scope are agreed before development; a complete API surface for every workflow is not assumed.",
    category: "features",
  },
  {
    question: "Do you have mobile apps?",
    answer:
      "Standard SquareCampus parent and staff mobile-app access is included in every plan at no additional charge. Supported app workflows, devices, languages and delivery readiness are confirmed before activation. White-labelled apps are a separately quoted enhancement, with founding-partner treatment governed by its own agreement.",
    category: "features",
  },
  {
    question: "Can we customize workflows and forms?",
    answer:
      "Available workflow and form configuration is reviewed during scoping against the institution's policies. Supported options, extended branding and any bespoke engineering are distinguished in the proposal before activation.",
    category: "features",
  },
  {
    question: "How does the multi-campus feature work?",
    answer: `${corePlatform.multiCampus} ${corePlatform.differentiation}`,
    category: "features",
  },
  {
    question: "How often is the product updated?",
    answer:
      "Updates ship continuously, covering new capabilities, performance improvements, and security patches. Releases are planned to avoid disrupting school hours, and admins are notified of significant updates through in-app announcements.",
    category: "features",
  },

  // Security & data
  {
    question: "How secure is our data?",
    answer: `${securityBaseline} Security documentation and implementation details are shared during the security review process.`,
    category: "security",
  },
  {
    question: "Where is our data stored?",
    answer:
      "The platform is designed with an India-first hosting posture, keeping institutional data in an Indian cloud region. Hosting details and backup design are documented and shared during security review.",
    category: "security",
  },
  {
    question: "What compliance standards do you follow?",
    answer: retentionReuse.faqCompliance,
    category: "security",
  },
  {
    question: "Can we control who sees what data?",
    answer: identity.principle,
    category: "security",
  },
  {
    question: "What happens to our data if we leave?",
    answer: `${dataPortability} ${retentionReuse.faqExit}`,
    category: "security",
  },
  {
    question: "Can an institution use normal SquareCampus credentials?",
    answer: `${identity.baseline.body} Single sign-on is optional.`,
    category: "security",
  },
  {
    question: "Does Pro support institutional single sign-on?",
    answer: `${identity.sso.body} The institution chooses the sign-in mode: ${identity.modes.join("; ")}.`,
    category: "security",
  },
  {
    question: "Does SquareCampus access our Outlook or Microsoft 365 data?",
    answer:
      "No. Standard Microsoft Entra ID sign-in is used to authenticate identity. Access to email, files, Teams, SharePoint or other Microsoft Graph data is not required for sign-in.",
    category: "security",
  },
  {
    question: "Does single sign-on automatically create and remove users?",
    answer:
      "No. Single sign-on authenticates users. Automated provisioning, deprovisioning and joiner-mover-leaver lifecycle controls are identity governance requirements scoped under Enterprise rather than part of SSO.",
    category: "security",
  },
  {
    question: "What identity governance does Enterprise add?",
    answer: `${identity.enterprise.body} ${identity.principle}`,
    category: "security",
  },

  {
    question: "Can Starter request Microsoft Entra single sign-on separately?",
    answer: identity.sso.body,
    category: "security",
  },
  {
    question: "Where is the complimentary launch pilot focused?",
    answer: `${launchPilot.geography} ${launchPilot.scope}`,
    category: "getting-started",
  },
  {
    question: "Can we buy an enhancement without changing our entire plan?",
    answer:
      "Where availability and eligibility are confirmed, an enhancement can be quoted separately. Included entitlements, additional consumption, professional services and any eligibility conditions are distinguished in the proposal. Contact sales to assess your requirement.",
    category: "pricing",
  },
  // Pricing & support
  {
    question: "Is pricing public?",
    answer: `${pricingAvailability.short} ${pricingAvailability.model}`,
    category: "pricing",
  },
  {
    question: "What is included, and what is scoped separately?",
    answer: `${pricingAvailability.included} ${pricingAvailability.scopedSeparately} There is no hidden module wall inside the licence, and every separately scoped line appears in the proposal before you sign.`,
    category: "pricing",
  },
  {
    question: "What happens as enrolment grows?",
    answer: pricingAvailability.volume,
    category: "pricing",
  },
  {
    question: "Is SquareCampus appropriate if we only need attendance and fees?",
    answer: `Usually not. ${pricingAvailability.positioning}`,
    category: "pricing",
  },
  {
    question: "How many Founding Institutional Partner positions exist?",
    answer: `${foundingProgramme.positionsStatement} ${foundingProgramme.nature} Under the executed agreement a Founding Partner receives defined roadmap influence, a protected ${foundingProgramme.enterpriseDiscountPercent}% discount on Enterprise commercial terms, white-labelled mobile apps without the standard white-label charge, and any other privileges explicitly agreed.`,
    category: "pricing",
  },
  {
    question: "Is the mobile app charged separately?",
    answer:
      "No. The SquareCampus parent and staff mobile apps are included in every plan at no additional charge. A white-labelled Android and iOS build, published under your institution's own branding and store listings, carries a single charge that covers the entire agreed term, whether that is one year or many. Founding Institutional Partners receive the white-labelled build without the standard white-label charge.",
    category: "pricing",
  },
  {
    question: "What about support after launch?",
    answer:
      "You get a named success partner, live chat/email support during business hours, and proactive health checks. We help with new session rollovers, audits, policy tweaks, and any questions that arise. Implementation and support are included in every plan; only a custom SLA, such as 24×7 cover, is quoted.",
    category: "pricing",
  },
  {
    question: "How is value measured?",
    answer:
      "SquareCampus publishes no measured outcomes. A pilot is designed to measure one agreed metric against a written baseline: for example, days between an attendance threshold breach and a recorded follow-up, or the time from collection close to a reconciled position. The value case is specific to the institution and is judged on that evidence, not on a vendor's percentage.",
    category: "pricing",
  },
  {
    question: "Is there a trial or pilot option?",
    answer: `${launchPilot.summary} ${launchPilot.eligibility} ${launchPilot.boundaries} ${launchPilot.pricing} ${launchPilot.separation}`,
    category: "pricing",
  },
];
