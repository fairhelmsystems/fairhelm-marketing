/**
 * Canonical commercial, identity and programme facts.
 *
 * One module that every commercial surface derives from — the pricing UI,
 * FAQs, structured data, /llms.txt and the regression tests in tests/ — so a
 * commercial statement is written once and cannot drift between pages.
 *
 * RULES OF THIS FILE
 * - Public rates derive from pricing-policy.json, approved in the owner's
 *   2026-11-09 Pricing Studio brief. Unresolved usage tariffs stay unresolved.
 * - No capability is described as available unless the platform implements
 *   it or it is explicitly approved for launch. Identity wording is checked
 *   against the platform's authentication implementation before it changes;
 *   see docs/marketing-claims-register.md.
 * - Programme facts (positions, discount) are deliberate commercial policy.
 *   Change them only against a product decision, and update the tests.
 */

import { company } from "./company";
import pricingPolicy from "./pricing-policy.json";

const money = (paise: number) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 2,
}).format(paise / 100);

const SITE = "https://squarecampus.com";

export const mobileAppPublishing =
  `Standard and white-label mobile apps are published through publisher accounts owned by ${company.legalNameDisplay}.`;

export type PlanId = "starter" | "pro" | "enterprise";

export const aicCommercial = {
  purchases: `Choose any whole prepaid quantity from ${pricingPolicy.aic.minimumPurchaseCredits.toLocaleString("en-IN")} AIC for ${money(pricingPolicy.aic.minimumPurchaseCredits * pricingPolicy.aic.volumeBands[0].unitPricePaise)}, plus GST. Each purchase uses graduated rates, from ${money(pricingPolicy.aic.volumeBands[0].unitPricePaise)}/AIC for the first 5,000 to ${money(pricingPolicy.aic.volumeBands[5].unitPricePaise)}/AIC above 2,50,000. Only credits inside a band receive its rate. Every plan uses the same purchase rates.`,
  wallet: "Included AIC expires at each monthly cycle boundary. Unused purchased AIC carries forward. Included credits are used first. All authorized staff share the institution's balance. Purchased-AIC validity and cancellation terms are on your order form.",
  operations: `One accepted analytical objective receives a scoped, versioned quote before execution. Routine operations use approximately ${pricingPolicy.aic.routineOperationMilliAic.minimum / 1000}–${pricingPolicy.aic.routineOperationMilliAic.maximum / 1000} AIC and supported complex operations use at most ${pricingPolicy.aic.maximumOperationMilliAic / 1000} AIC. Charts, tables, the summary and first render belong to that operation. Exact workflow tariffs are confirmed before execution. Access denial, platform failure and reopening an existing result have no AIC charge.`,
} as const;

const futureFeatureInclusion =
  "Future generally available standard SquareCampus features, including PTM when released, are included in every plan's licence. Feature launches carry no extra feature fee, compulsory upgrade or feature-based licence repricing.";

/** Packaging policy, not a claim that every planned module has shipped. */
export const corePlatform = {
  accessLabel: "Every core feature, every plan",
  promise: "No module or feature is gated behind a plan.",
  futureFeatures: futureFeatureInclusion,
  included:
    "Every generally available core SquareCampus module is accessible on every plan. Choose your included capacity, AI allowance and service depth. Entra SSO is optional on every plan and included in the Enterprise price. White-label apps start with Growth and are included in Enterprise. Metered usage and optional services are charged separately.",
  availability:
    "Available modules, workflows and deployment scope are confirmed before activation. A plan entitlement does not imply that an unreleased capability is available.",
  multiCampus:
    "Starter, Growth and Enterprise support multi-campus operations, institutional governance and role-aware workflows. Aggregate enrolled students within the same billed institutional subscription; aggregation across unrelated subscriptions or legal entities requires an agreed policy.",
  differentiation:
    "Plans share the same generally available core modules, analytics, workflows and governance. Included AEGIS AI Credits, communication credits and migration services differ. Standard implementation and support are included in every plan. Additional quantities and custom service commitments require a written scope; no unpublished capacity limits are implied.",
} as const;

const apiAnnualPrices = pricingPolicy.addOns.annualDataEventsApiPaise;
const apiWindows = pricingPolicy.dataEventsApi.slidingWindows;
const apiPricingSummary =
  `Starter ${money(apiAnnualPrices.starter)}/year at ${apiWindows.starter.requests.toLocaleString("en-IN")} RPM, ` +
  `Growth ${money(apiAnnualPrices.pro)}/year at ${apiWindows.pro.requests.toLocaleString("en-IN")} RPM, ` +
  `and Enterprise ${money(apiAnnualPrices.enterprise)}/year at ${apiWindows.enterprise.requests.toLocaleString("en-IN")} RPM.`;

/** Owner-approved annual fees, throughput and activation readiness, 9 November 2026. */
const optionalServicesNotice = "Optional services cost extra.";

export const dataEventsApi = {
  name: "Data & Events API",
  principle: "One School OS. Open by design.",
  pricing: apiPricingSummary,
  overview:
    `Optional annual add-on, available on every plan. ${apiPricingSummary} RPM counts requests in a rolling ${apiWindows.starter.windowSeconds}-second window. Plans share supported resources and events. Exports and first-party apps are independent. Throttling incurs no API overage. SSO is optional.`,
  optionalServicesNotice,
  qualification:
    `${optionalServicesNotice} Data & Events API starts at ${money(apiAnnualPrices.starter)}/year on every plan. Optional Entra SSO is included in Enterprise and chargeable on Starter and Growth. White-label apps start with Growth.`,
  summary:
    "Export your records without an additional export fee. Connect external systems through the Data & Events API, with an annual institutional fee based on your plan and the same supported resources and events across Starter, Growth and Enterprise.",
  catalogue:
    "The service covers supported read-only resources, event-history queries and WebSocket live subscriptions. Resource, campus and field permissions govern access on every plan.",
  exports:
    "Authorized self-service exports of supported datasets and retained audit records are included on every plan. They require no external API add-on, export-unlock fee, AIC or communication-credit debit. Permissions, retention and bounded export jobs apply.",
  nativeWorkflows:
    "Native workflows, standard apps, eligible white-label Android and iOS apps, internal services and callbacks needed for native payments or messaging operate independently of the external API add-on and its throughput allowance. Normal security, messaging and AI rules apply.",
  throughput:
    `${apiPricingSummary} RPM means external API requests per minute in a sliding ${apiWindows.starter.windowSeconds}-second window. Limits apply across the billed institution's external clients. Throttling creates no API overage charge or automatic upgrade. Stream bounds and replay retention are confirmed during onboarding.`,
  identity:
    "API integration credentials use their own governed authorization. Entra SSO is optional on every plan and is not a prerequisite for external API access.",
  availability:
    "Available for activation with authorized integration credentials. Prices exclude GST. Integration scope, stream bounds, replay retention and mid-term billing terms are confirmed during onboarding.",
} as const;

export const securityBaseline =
  "Tenant isolation, secure authentication, role-based authorisation, protection of institutional records, essential security logging and privacy safeguards are baseline requirements in every plan. Advanced identity governance and expanded audit controls are separately scoped; fundamental security is not a premium feature.";

export const dataPortability =
  "The institution owns its institutional data in every plan. Authorized self-service exports of supported datasets and retained audit records are included independently of the external API add-on. Export scope, available formats, access arrangements and assistance are confirmed for the deployment; retention and deletion follow the agreement, the DPA and applicable obligations. Export formats and timing are established before commitment.";

export const launchPilot = {
  name: "Selected Institutional Launch Pilot",
  days: 90,
  href: "/pricing/#pilot",
  enquiryHref: "/contact/",
  summary:
    "Eligible, approved launch institutions may join a 90-day complimentary pilot. The platform subscription, standard onboarding and reasonable operational support are included for the agreed pilot scope.",
  eligibility:
    "Participation requires institutional approval and an agreed scope; submitting an enquiry does not activate a pilot. This is a selected launch programme, not an unrestricted global free trial.",
  geography:
    "Initial launch outreach focuses on Kotdwara and surrounding areas. Enquiries are reviewed individually; this outreach focus is not a published geographic eligibility restriction.",
  boundaries:
    "Messaging, AI, storage, integrations and external-service consumption have defined boundaries agreed before activation. Custom development, bespoke integrations and unrestricted engineering support are not included. Any separately chargeable work or consumption must be agreed in writing.",
  pricing:
    "Subscription pricing is communicated before pilot activation, with a commercial review before the 90-day pilot expires. At completion, the institution chooses to subscribe or discontinue.",
  scope:
    "Modules, workflows, deployment coverage, institutional counterparts and documented success criteria are agreed before activation.",
  separation:
    "The complimentary launch pilot is separate from the standard paid subscription and from the Founding Institutional Partner programme. Launch-pilot participation does not confer founding status or its negotiated privileges.",
} as const;

/** Stable public product facts, for machine-readable contexts and listings. */
export const product = {
  name: "SquareCampus",
  category: "Enterprise School Operating System",
  /**
   * The one canonical short description. Every machine-readable context —
   * SoftwareApplication JSON-LD, the llms.txt summary, listing copy — uses
   * this sentence verbatim; natural page copy may paraphrase it.
   */
  shortDescription:
    "SquareCampus is an Enterprise School Operating System (School OS) for schools, educational trusts, multi-campus school groups and higher-education institutions in India, connecting school operations with institutional governance, workflow accountability and operational visibility.",
  audiences: [
    "Standalone schools with governance, identity or audit requirements",
    "Educational trusts and multi-campus school groups",
    "Church-run and society-run school chains",
    "Private universities and multi-school higher-education groups, as a governed operating layer over the systems they already run",
  ],
  geography:
    "India-first. The platform is hosted on Microsoft Azure in India. Private deployment on AWS or in a private cloud is a separately scoped service.",
  /**
   * Product identity and its relationship to the categories buyers search for.
   * Search-intent pages explain school management systems and ERP alternatives
   * while identifying SquareCampus by the same Enterprise School OS category.
   * This category describes the product. Plan entitlements remain defined by
   * corePlatform and planHierarchy.
   */
  categoryDescriptor: "The Enterprise School OS for Indian schools and trusts",
  /**
   * The positioning line for the home H1 and machine-readable surfaces.
   * `positioningSupport` grounds the
   * operating model in product capabilities and documented deployment scope.
   */
  positioning: "Enterprise School OS. Minus enterprise pain.",
  positioningSupport:
    "Minus the enterprise pain means standard implementation and support included in every plan, rollout sequenced around the academic calendar and critical workflows validated in parallel. Institutional governance connects policies, roles, approvals, exceptions and audit history on one record. Governance and deployment scope are agreed in writing.",
  categoryRelationship:
    "SquareCampus is an Enterprise School Operating System (School OS). It covers the admissions, attendance, fees, exams and parent communication people seek in a school management system, with connected workflows, named owners, approvals, audit history and institution-wide oversight.",
  /**
   * The canonical "not an ERP" answer. Search engines and answer engines
   * meet "school ERP" as the category buyers type; this sentence is the one
   * disambiguation every surface (schema `disambiguatingDescription`, the
   * ERP FAQs, llms.txt) repeats verbatim, so no page can say "yes, it is an ERP".
   */
  notAnErp:
    "SquareCampus is an Enterprise School Operating System (School OS), not an ERP. Its operating model connects school records, workflows, ownership, exceptions, approvals, audit history and leadership oversight. It can replace an existing school ERP or run alongside one while the move is validated.",
  distinction:
    "A system of record stores what happened. SquareCampus also carries the workflows, ownership, exceptions, approvals and audit history that turn records into accountable operations, and shows leadership what requires attention, who owns it and what happens next.",
  competesOn: [
    "Operational governance",
    "Workflow ownership",
    "Exception management",
    "Institutional visibility",
    "Accountability",
    "Auditability",
    "Multi-campus command",
    "Interoperability",
    "Institutional control",
    "Long-term operational quality",
  ],
  evidenceNote:
    "SquareCampus publishes no customer counts, rankings, uptime figures, measured outcomes, testimonials or named institutional customers. Statements on the site describe what the product is designed to do, not results that have been measured in production.",
  operator: {
    legalName: company.legalNameDisplay,
    cin: company.cin,
    locality: "Bangalore, Karnataka, India",
  },
  urls: {
    site: `${SITE}/`,
    app: "https://app.squarecampus.com",
    pricing: `${SITE}/pricing/`,
    contact: `${SITE}/contact/`,
    demo: `${SITE}/demo/`,
    security: `${SITE}/security/`,
    privacy: `${SITE}/privacy-policy/`,
    terms: `${SITE}/terms-of-service/`,
    dpa: `${SITE}/data-processing-addendum/`,
    logo: `${SITE}/brand/squarecampus.png`,
    llms: `${SITE}/llms.txt`,
  },
} as const;

/**
 * Availability, stated once.
 *
 * The site describes how SquareCampus is designed to work. Which modules,
 * apps, languages and integrations an institution receives, and when, is a
 * matter for the proposal — never for a page. Every surface that lists
 * capabilities carries this note (see components/site/availability-note.tsx)
 * rather than implying that everything described is switched on for everyone.
 * Deployment state is deliberately not described here or anywhere public.
 */
export const availability = {
  note: "Generally available features are eligible on every plan. Your written proposal confirms deployment readiness, rollout timing and separately scoped services; unavailable or preview functionality requires explicit confirmation.",
  short: "Your written proposal confirms deployment readiness, rollout timing, languages and integration scope.",
  languages:
    "Designed to reach each family in its own language; your proposal confirms which languages.",
} as const;

/** Status vocabulary for deployment options and integrations. */
export type OfferStatus = "Default" | "Scoped service" | "Not offered today";

/**
 * Deployment options, with an explicit status each. Every page that mentions
 * where SquareCampus runs derives from this list, so an option cannot be
 * "available" on one page and "coming soon" on another.
 */
export const deploymentOptions = [
  {
    id: "managed",
    title: "Managed cloud",
    status: "Default" as OfferStatus,
    body: "SquareCampus on our Microsoft Azure infrastructure in India, operated and maintained by us. Every plan starts here.",
  },
  {
    id: "private",
    title: "Private deployment",
    status: "Scoped service" as OfferStatus,
    body: "A dedicated SquareCampus environment on AWS or in a private cloud is a separately scoped service. Responsibilities, eligibility and charges are agreed in writing.",
  },
  {
    id: "byoc",
    title: "Your own cloud account (BYOC)",
    status: "Not offered today" as OfferStatus,
    body: "Running SquareCampus inside the institution's own cloud account is not offered today. If your governance requires it, raise it during scoping.",
  },
] as const;

/** One sentence for surfaces that name deployment without the full list. */
export const deploymentSummary =
  "Managed cloud on Microsoft Azure in India by default; private deployment on AWS or in a private cloud as a separately scoped service.";

/**
 * Integration scope. SquareCampus publishes no catalogue of pre-built
 * connectors, so no page may imply that a named tool connects automatically.
 */
export const integrationScope = {
  summary:
    "Standard implementation includes institution-owned Razorpay fee-payment setup. Growth and Enterprise also include Tally-ready accounting export setup. Other system connections are assessed individually. External data access is available through the optional annual Data & Events API on every plan. Bespoke connectors and engineering are scoped separately, with direction, frequency and responsibilities confirmed before any build.",
  prerequisites: [
    "The other system must offer a documented API or a data export the institution is licensed to use.",
    "Vendor access, vendor-side charges and the vendor's own limits remain the institution's.",
    "Sync direction, frequency, error handling and ownership of each record are agreed per integration.",
  ],
  groups: [
    {
      label: "Sign-in",
      status: "Optional SSO on every plan",
      detail:
        "SquareCampus-managed credentials in every plan. Optional Microsoft Entra ID single sign-on on every plan, subject to technical onboarding. Enterprise includes integration and maintenance in its licence; Starter and Growth pay the annual add-on fee. The institution supplies its own Entra tenant and Microsoft licences.",
    },
    {
      label: "Razorpay, SMS and WhatsApp",
      status: "Account and channel onboarding",
      detail:
        "Razorpay fee-payment setup is included in standard implementation on every plan, using the institution’s own account and bank settlement. Gateway charges follow its Razorpay agreement. SMS and WhatsApp use the separate communication wallet; additional usage is prepaid.",
    },
    {
      label: "Tally exports and other external systems",
      status: "Scoped service",
      detail:
        "Growth and Enterprise include Tally-ready export setup and a validated sample import during onboarding. Continuous accounting sync, biometric devices, LMS and government-portal connections require separate technical and commercial scope.",
    },
    {
      label: dataEventsApi.name,
      status: "Optional annual add-on on every plan",
      detail: `${dataEventsApi.catalogue} ${dataEventsApi.throughput} ${dataEventsApi.availability}`,
    },
  ],
} as const;

/** Stable identifiers are retained. Growth is the public name of the existing pro plan. */
export const planHierarchy = [
  {
    id: "starter",
    name: "Starter",
    summary:
      "Every generally available feature, multi-campus operations, implementation and support, with the lowest annual subscription.",
    suitedFor:
      "Institutions starting with the lowest fixed commitment and choosing additional usage as needed.",
  },
  {
    id: "pro",
    name: pricingPolicy.plans.pro.name,
    summary:
      `Every generally available feature, with included migration, Tally-ready export setup and a tenant-wide monthly pool of ${pricingPolicy.plans.pro.monthlyIncludedMilliAic / 1000} AEGIS AI Credits.`,
    suitedFor:
      "Institutions comparing included migration and AI consumption against their expected use.",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    summary:
      `Every generally available feature, including institutional governance, with white-label apps, Entra SSO and Tally-ready export setup included, optional custom dashboards and a tenant-wide monthly pool of ${pricingPolicy.plans.enterprise.monthlyIncludedMilliAic / 1000} AEGIS AI Credits.`,
    suitedFor:
      "AI-led institutions wanting the largest AI pool, with white-label apps and Entra SSO included.",
  },
] as const;

/**
 * Pricing availability, stated once.
 *
 * The owner-approved 2026-11-09 schedule replaces proposal-only numerical pricing.
 * Custom services and incomplete usage tariffs remain separate.
 * Every page that touches pricing says exactly this, in these terms.
 */
export const pricingAvailability = {
  short:
    "Annual INR subscription rates and progressive student slabs are public on the pricing page. Calculate the standard managed-cloud subscription without a sales call; additional usage and custom services are separate.",
  model:
    "One annual institutional licence with a minimum of 100 enrolled students, calculated on progressive student-volume bands for Starter, Growth or Enterprise. Only students inside each slab receive that slab's rate. Optional services and specialised deployment are separate lines.",
  volume:
    "Billable enrolment is the active enrolled students agreed in the order form. The per-student rate falls as enrolment moves up through the volume bands; growth is reconciled through an agreed true-up, and reductions are normally considered at renewal.",
  included: `${corePlatform.included} Standard SquareCampus apps for staff, parents and students have no additional app licence fee. Staff accounts have no separate per-staff licence charge. Implementation and support are included. Monthly shared communication credits per enrolled student are ${pricingPolicy.communication.monthlyCreditsPerStudent.starter} on Starter, ${pricingPolicy.communication.monthlyCreditsPerStudent.pro} on Growth and ${pricingPolicy.communication.monthlyCreditsPerStudent.enterprise} on Enterprise. Growth and Enterprise also include best-effort data migration and Tally-ready accounting export setup.`,
  scopedSeparately:
    "Migration on Starter, custom integrations and engineering, fixed-format documents made for one institution, private-cloud deployment, a custom SLA and usage beyond the allowance are quoted as their own lines, not folded into the licence.",
  positioning:
    "SquareCampus is priced for institutions that want governance, workflow ownership, exception management, visibility and auditability. To one that needs only the cheapest attendance, fees and report-card product it will look expensive — and that reading is correct.",
  taxes:
    `Published base prices exclude GST. The calculator separately shows estimated domestic GST at ${pricingPolicy.tax.basisPoints / 100}% and tax-inclusive totals. Final tax treatment and the CGST/SGST or IGST split follow the billing details on the order form and tax invoice.`,
} as const;

/**
 * What the licence absorbs, so the price does not grow after signature.
 *
 * Owner-confirmed 2026-09-30: migration is included in Growth and Enterprise on a
 * best-effort basis (quoted on Starter); Enterprise includes implementation and
 * support, with only a custom SLA quoted; every plan carries a monthly usage
 * allowance with prepaid top-ups; payments run on the institution's own gateway
 * account. Nothing here promises a complete migration.
 *
 * Owner-confirmed 2026-09-30, second pass: reporting is self-serve in every
 * plan (the data table in the product UI library: filters, grouping, totals,
 * charts, saved views, CSV/Excel/PDF export; saved views still need their
 * backend endpoint, so it is described as design). Enterprise identity
 * governance is part of the Enterprise licence, established in discovery.
 * Third pass: there is no premium or paid implementation tier on any plan;
 * the rollout is the same for everyone and designed to need little training.
 * (Campus visits are currently free, but that is deliberately not published.)
 */
export const communicationAllowance = `Monthly shared communication credits per enrolled student are ${pricingPolicy.communication.monthlyCreditsPerStudent.starter} on Starter, ${pricingPolicy.communication.monthlyCreditsPerStudent.pro} on Growth and ${pricingPolicy.communication.monthlyCreditsPerStudent.enterprise} on Enterprise.`;

export const commercialScope = {
  migration: "Data migration is included in Growth and Enterprise, and quoted on Starter.",
  migrationLimit:
    "We move everything your current system can export in usable form. If it lacks data SquareCampus needs, or is too fragmented to reconcile, we show you what cannot move before go-live instead of guessing.",
  migrationShort:
    "Everything your current system can export in usable form. Anything that cannot move is shown before go-live.",
  tallyExport:
    "Growth and Enterprise include Tally-ready accounting export setup and finance handoff. Ledger and voucher mapping, the target Tally version and a sample import are agreed during onboarding. Standard self-service exports remain available on every plan. File exports require no external API add-on.",
  indianFeeOperations:
    "Term-wise fee plans, instalments, sibling and staff concessions, transport slabs, late fees, partial payments and GST-aware receipts for taxable components share one fee ledger. Concessions and refunds retain their approval trail. Applicable tax treatment follows the institution’s billing configuration.",
  reporting:
    "Reporting is self-serve in every plan: staff filter, group, total and chart their tables, save views for the team and export to Excel, CSV or PDF. A fixed-format document made only for your institution, such as your own report-card layout, is quoted; a format many schools need becomes a standard report at no charge.",
  implementation:
    "Implementation and support are included in every plan, and every institution gets the same rollout: there is no paid fast track. SquareCampus is designed to need little or no training. Only a custom SLA, such as 24×7 cover or guaranteed response times, is quoted.",
  allowance:
    `${communicationAllowance} Included communication credits reset monthly without rollover; purchased credits cost ${money(pricingPolicy.communication.purchasedCreditPaise)} each and carry forward. AEGIS AI Credits are a separate wallet with tenant-wide monthly allowances. Usage tariffs and storage scope are confirmed before activation; paid automatic overage requires administrator opt-in and a spend cap.`,
  paymentGateway:
    "Online fee payments use the institution’s own Razorpay account, with setup included in standard implementation on every plan. Settlement goes to the institution’s bank account. Razorpay fees, account approval and payment terms belong to the institution’s Razorpay agreement. SquareCampus records payments and supports fee reconciliation. The institution retains control of its funds.",
  renewal:
    `Rates are fixed for the agreed term. Rates for the next term are sent to you in writing at least ${pricingPolicy.renewal.minimumNoticeDays} days before the renewal date and confirmed on a renewal order form, so you see the renewal price before you commit. Enrolment growth is reconciled through the agreed true-up; reductions are normally considered at renewal.`,
  noSurprises:
    "Everything optional is priced in the proposal before you sign, and usage beyond the allowance is prepaid, so the proposal you sign is the bill you get.",
} as const;

/**
 * Identity and access, by plan.
 *
 * Implementation status at the time of writing (see the claims register):
 * the platform validates Microsoft Entra ID sign-in; Google Workspace, SAML,
 * SCIM and multi-directory federation are not implemented, so none of them
 * is described here as available. Enterprise identity governance is worded
 * as requirements that are scoped, not as shipped features.
 */
export const identity = {
  principle:
    "The identity provider establishes who a person is. SquareCampus decides what that person may do: institution membership, campus scope, roles, workflow privileges, record access and operational permissions are governed inside SquareCampus and are never derived from an email address or domain alone.",
  baseline: {
    name: "Secure sign-in and authorisation",
    body: "Secure authentication and role-based access are baseline requirements in every plan. SquareCampus-managed sign-in is included in the baseline plan scope; supported sign-in methods and deployment readiness are confirmed before activation. Additional verification for privileged roles is established during technical onboarding.",
  },
  sso: {
    name: "Institutional single sign-on",
    body: `Every plan offers optional single sign-on with Microsoft Entra ID. Integration and maintenance cost ${money(pricingPolicy.addOns.entraSsoAnnualPaise.starter)}/year on Starter and Growth. Enterprise includes it, activated or not. Supply your Entra tenant and Microsoft licences. Your MFA, Conditional Access and user assignments apply at sign-in. SquareCampus governs authorisation. Technical onboarding applies.`,
  },
  enterprise: {
    name: "Identity governance",
    body: "Generally available identity governance is eligible on every plan. Multi-directory configurations, directory-group to role mappings, SSO enforcement, lifecycle automation and identity audit requirements are assessed against implemented capabilities during technical onboarding. Unavailable or preview functionality is excluded from the generally available feature promise; bespoke configuration and engineering require a separate scope.",
  },
  /** The institution chooses the mode; SSO is never mandatory because it exists. */
  modes: [
    "SquareCampus-managed credentials, subject to deployment readiness",
    "Credentials alongside institutional single sign-on, where supported by the agreed configuration",
    "Institution-enforced single sign-on, where the institution's policy requires it and the configuration supports it",
  ],
  notes: [
    "Single sign-on is optional. An institution is not required to adopt it, and is not required to move between Google Workspace and Microsoft to use SquareCampus.",
    "Standard sign-in authenticates identity only. It does not require access to email, files, Teams, SharePoint or other Microsoft 365 data.",
    "Single sign-on authenticates users; automated provisioning and deprovisioning require separately validated lifecycle support. Availability is confirmed during technical onboarding.",
    "Where institution-enforced single sign-on is configured, SquareCampus credentials are designed not to act as an ordinary alternative route around the institution's identity policy.",
  ],
  byPlan: [
    {
      capability: "Secure authentication and role-based authorisation",
      starter: "Baseline in every deployment",
      pro: "Baseline in every deployment",
      enterprise: "Baseline in every deployment",
    },
    {
      capability: "Microsoft Entra ID single sign-on for the institution's own tenant",
      starter: `Optional, ${money(pricingPolicy.addOns.entraSsoAnnualPaise.starter)}/year, technical onboarding required`,
      pro: `Optional, ${money(pricingPolicy.addOns.entraSsoAnnualPaise.pro)}/year, technical onboarding required`,
      enterprise: "Optional, included in the annual licence, technical onboarding required",
    },
    {
      capability: "Sign-in mode chosen by the institution (credentials, both, or enforced SSO)",
      starter: "Supported modes agreed during onboarding",
      pro: "Supported modes agreed during onboarding",
      enterprise: "Supported modes agreed during onboarding",
    },
    {
      capability: "Multi-campus and multi-directory identity governance",
      starter: "Scoped against implemented capabilities on every plan",
      pro: "Scoped against implemented capabilities on every plan",
      enterprise: "Scoped against implemented capabilities on every plan",
    },
    {
      capability: "Directory-group to role mappings, lifecycle controls, identity audit",
      starter: "Scoped against implemented capabilities on every plan",
      pro: "Scoped against implemented capabilities on every plan",
      enterprise: "Scoped against implemented capabilities on every plan",
    },
    {
      capability: "Authorisation: membership, campus scope, roles, records, workflows",
      starter: "Governed in SquareCampus",
      pro: "Governed in SquareCampus",
      enterprise: "Governed in SquareCampus",
    },
  ],
} as const;

/**
 * Founding Institutional Partner programme facts.
 *
 * Two positions, ever. Nothing here may use securities, equity, debt,
 * ownership or board language, state a duration for the price protection, or
 * call the discount "lifetime": those belong in the executed agreement, not
 * on a public page. See docs/marketing-claims-register.md.
 */
export const foundingProgramme = {
  name: "Founding Institutional Partner programme",
  href: "/launch-partners",
  positions: 2,
  positionLabels: ["One school or eligible school institution", "One university"],
  positionsStatement:
    "There are exactly two Founding Institutional Partner positions, ever: one school or eligible school institution, and one university. Once both positions are allocated, the programme closes permanently.",
  nature:
    "A Founding Institutional Partner is not an ordinary customer. The position involves a strategic capital commitment under a separately executed agreement, material participation in product validation, and structured roadmap input.",
  enterpriseDiscountPercent: 40,
  entitlements: [
    {
      title: "Defined roadmap influence",
      body: "Structured, written consideration of the partner's operating requirements in roadmap planning, as defined in the executed agreement.",
    },
    {
      title: "Protected 40% Enterprise discount",
      body: "A protected 40% discount on Enterprise commercial terms, as set out in the executed agreement.",
    },
    {
      title: "White-labelled mobile apps",
      body: "The SquareCampus parent and staff apps published under the institution's own branding and store listings, without the standard white-label charge.",
    },
    {
      title: "Other agreed founding privileges",
      body: "Any further privileges are those explicitly agreed in the executed agreement, and no others.",
    },
  ],
  boundaries: [
    "Roadmap influence is not a veto, ownership of the roadmap, product or architectural control, ownership of intellectual property, or an entitlement to unlimited custom development.",
    "SquareCampus retains final product, architecture, security and engineering authority unless a signed agreement explicitly states otherwise.",
    "Founding status does not create exclusivity or territory rights.",
    "Entitlements are governed by the executed agreement. This page describes the programme; it is not an offer.",
  ],
  closure:
    "Once both positions are allocated, the Founding Institutional Partner programme closes permanently.",
  pilot: {
    window: "60–90 days",
    paidNote:
      "Founding pilots are paid, scoped commercial engagements. Scope, success measures, fees and conversion terms are agreed in writing before implementation begins.",
    close: "Convert, extend or stop",
  },
} as const;

export const commercialProgrammes = [
  {
    name: "Standard Commercial Subscription",
    body: "The normal paid SquareCampus subscription, with plan entitlements, consumption allowances and separately quoted requirements agreed in the proposal and order form.",
    href: "/pricing/#plans",
    cta: "Compare plans",
  },
  {
    name: launchPilot.name,
    body: `${launchPilot.summary} ${launchPilot.eligibility}`,
    href: launchPilot.href,
    cta: "Review the launch pilot",
  },
  {
    name: foundingProgramme.name,
    body: `${foundingProgramme.nature} Its paid, scoped founding engagements and negotiated privileges are separate from the complimentary launch pilot.`,
    href: "/launch-partners/",
    cta: "Review founding partnerships",
  },
] as const;

/** No candidate capability becomes a generally available SKU by appearing here. */
export const optionalEnhancements = [
  {
    name: "Institutional identity",
    treatment: "Available separately",
    body: identity.sso.body,
  },
  {
    name: "White-labelled mobile apps",
    treatment: "Combined one-time branding and setup",
    body: `White-label Android and iOS branding costs ${money(pricingPolicy.addOns.whiteLabelAndroidAndIosOncePaise)} once, combined, on Growth, and included in Enterprise. ${mobileAppPublishing} App-store fees and maintenance scope require confirmation before purchase. Subscription-backed functions require an active subscription. Founding-partner treatment follows its separate agreement.`,
  },
  {
    name: "Messaging and consumption",
    treatment: "Allowances and usage charges",
    body: commercialScope.allowance,
  },
  {
    name: "Bespoke configuration and additional AI usage",
    treatment: "Contact sales to assess requirements",
    body: `Generally available analytics and governance have the same plan eligibility. Bespoke configuration, provisioning and federation require a written scope. ${aicCommercial.purchases} Prepaid AIC is activated through your order form.`,
  },
  {
    name: "Custom integrations and migration",
    treatment: "Custom-quoted professional services",
    body: "Data migration is included in Growth and Enterprise and quoted on Starter, on a best-effort basis against usable source exports. Custom integrations and engineering are quoted as project work. Consumption beyond agreed allowances is prepaid.",
  },
  {
    name: "Enhanced support and deployment",
    treatment: "Contact sales for a scoped proposal",
    body: "Enhanced support, contractual SLA options and specialised deployment requirements are assessed separately. Response commitments, service levels and eligibility exist only where agreed in the contract.",
  },
] as const;

/** Buyer qualification. The purpose is fit, not self-deprecation. */
export const fit = {
  bestFor: [
    "Institutions where leadership wants to know what requires attention today, who owns it and whether it was closed",
    "Trusts and groups balancing central policy with campus-level accountability",
    "Institutions that need auditability, approval chains and role-scoped access as institutional configuration rather than as favours from a vendor",
    "Institutions that expect their systems to interoperate rather than to be replaced wholesale",
  ],
  notRightFitIf: [
    "The requirement is limited to basic attendance, fee collection and report cards",
    "The lowest possible licence price is the dominant selection criterion",
    "The institution does not need workflow ownership, exception management, governance or cross-campus visibility",
    "Leadership wants a tool for one office rather than an operating system for the institution",
  ],
} as const;

/** What Enterprise adds beyond ordinary ERP modules, dimension by dimension. */
export const enterpriseBeyondModules = [
  {
    dimension: "Institutional structure",
    modules: "Several schools run as separate instances or branches",
    enterprise:
      "Advanced trust-school-campus governance requirements: inherited policy and recorded local exceptions, subject to scoping",
  },
  {
    dimension: "Command",
    modules: "Consolidated reports prepared from each branch",
    enterprise:
      "Trust-level command-view requirements, scoped against available reporting capabilities",
  },
  {
    dimension: "Governance",
    modules: "Approval steps inside individual modules",
    enterprise:
      "Advanced approval and exception-ownership requirements across workflows and campuses, scoped during discovery",
  },
  {
    dimension: "Identity",
    modules: "User accounts per instance",
    enterprise:
      "Identity governance: multi-directory requirements, group-to-role mappings, SSO enforcement policy and lifecycle controls, scoped during discovery",
  },
  {
    dimension: "Auditability",
    modules: "Change logs per module",
    enterprise:
      "Advanced policy controls and audit-export requirements; institution-owned data and supported portability apply to every plan",
  },
  {
    dimension: "Intelligence",
    modules: "Reports and dashboards",
    enterprise:
      "Governed AEGIS access requirements and allowances, confirmed against available capabilities",
  },
  {
    dimension: "Deployment and integration",
    modules: "Vendor cloud, standard connectors",
    enterprise:
      "Managed cloud, private-cloud eligibility, enterprise integrations and implementation governance",
  },
] as const;

/**
 * Multi-campus governance versus merely supporting several campuses. Used on
 * the multi-campus page and in the definition glossary.
 */
export const multiCampusContrast = [
  {
    dimension: "Structure",
    supports: "Each campus is a separate instance or a branch code on the same records",
    governs: "Trust, school and campus are one hierarchy in the institutional model",
  },
  {
    dimension: "Policy",
    supports: "Head office circulates a policy; each campus configures its own version",
    governs:
      "Policy is set once at the trust level and inherited; local variation is recorded as an exception with a reason",
  },
  {
    dimension: "Access",
    supports: "Campus users are separated by login",
    governs:
      "Scope is a property of the role: a principal sees one campus, a trust officer sees across campuses, on every screen, report and AEGIS answer",
  },
  {
    dimension: "Exceptions",
    supports: "Each campus escalates by phone or email",
    governs:
      "Collections behind plan, attendance drift and stalled approvals surface as owned exceptions, whichever campus they belong to",
  },
  {
    dimension: "Reporting",
    supports: "Campus reports are consolidated before the board meeting",
    governs:
      "Board views come from the records the campuses run on, with nothing to reconcile first",
  },
] as const;

type MatrixRow = {
  label: string;
  starter: string;
  pro: string;
  enterprise: string;
};

function sharedRow(label: string, value: string): MatrixRow {
  return { label, starter: value, pro: value, enterprise: value };
}

export const planComparisonRows: readonly MatrixRow[] = [
  {
    label: "Authorized data and audit exports",
    starter: "Included, independently of the external API add-on",
    pro: "Included, independently of the external API add-on",
    enterprise: "Included, independently of the external API add-on",
  },
  {
    label: "Data & Events API",
    starter: `${money(apiAnnualPrices.starter)}/year, optional`,
    pro: `${money(apiAnnualPrices.pro)}/year, optional`,
    enterprise: `${money(apiAnnualPrices.enterprise)}/year, optional`,
  },
  {
    label: "Supported API resources and events",
    starter: "Same supported catalogue, subject to authorization and release",
    pro: "Same supported catalogue, subject to authorization and release",
    enterprise: "Same supported catalogue, subject to authorization and release",
  },
  {
    label: "External API sliding-window throughput",
    starter: `${apiWindows.starter.requests.toLocaleString("en-IN")} requests per rolling ${apiWindows.starter.windowSeconds}-second window`,
    pro: `${apiWindows.pro.requests.toLocaleString("en-IN")} requests per rolling ${apiWindows.pro.windowSeconds}-second window`,
    enterprise: `${apiWindows.enterprise.requests.toLocaleString("en-IN")} requests per rolling ${apiWindows.enterprise.windowSeconds}-second window`,
  },
  {
    label: "Native workflows and first-party apps",
    starter: "Standard and white-label apps require no external API add-on",
    pro: "Standard and white-label apps require no external API add-on",
    enterprise: "Standard and white-label apps require no external API add-on",
  },
  sharedRow("Operational scope", "Every generally available module and feature"),
  sharedRow("Institutional structure", "Multi-campus operations and institutional governance"),
  sharedRow("Analytics and workflows", "Same generally available analytics, reports and workflow capabilities"),
  {
    label: "Sign-in and identity",
    starter: `Optional Entra SSO ${money(pricingPolicy.addOns.entraSsoAnnualPaise.starter)}/year. Bring your own Microsoft licences.`,
    pro: `Optional Entra SSO ${money(pricingPolicy.addOns.entraSsoAnnualPaise.pro)}/year. Bring your own Microsoft licences.`,
    enterprise: "Optional Entra SSO included in the licence. Enterprise costs the same with or without activation. Bring your own Microsoft licences.",
  },
  {
    label: "White-label Android and iOS apps",
    starter: "Available from Growth",
    pro: `${money(pricingPolicy.addOns.whiteLabelAndroidAndIosOncePaise)} once, combined`,
    enterprise: "Included in the licence",
  },
  sharedRow("Mobile apps", "Standard apps for staff, parents and students; no additional app licence fee"),
  sharedRow("Staff accounts", "No separate per-staff licence charge; role permissions apply"),
  sharedRow("Baseline security", securityBaseline),
  sharedRow("Institution-owned data and supported exports", "Documented for every deployment"),
  {
    label: "SMS, WhatsApp and email allowances",
    starter: `${pricingPolicy.communication.monthlyCreditsPerStudent.starter} shared credits per enrolled student each month`,
    pro: `${pricingPolicy.communication.monthlyCreditsPerStudent.pro} shared credits per enrolled student each month`,
    enterprise: `${pricingPolicy.communication.monthlyCreditsPerStudent.enterprise} shared credits per enrolled student each month`,
  },
  {
    label: "Included AEGIS AI Credits each month",
    starter: `None included. Prepaid AIC starts at ${pricingPolicy.aic.minimumPurchaseCredits.toLocaleString("en-IN")} AIC.`,
    pro: `${pricingPolicy.plans.pro.monthlyIncludedMilliAic / 1000} AIC in a shared monthly tenant pool`,
    enterprise: `${pricingPolicy.plans.enterprise.monthlyIncludedMilliAic / 1000} AIC in a shared monthly tenant pool`,
  },
  {
    label: "Custom AEGIS dashboards",
    starter: "Not offered",
    pro: "Not offered",
    enterprise: "Optional. Scoped and quoted before any work starts.",
  },
  { label: "Best-effort data migration", starter: "Separately scoped and quoted", pro: "Included against usable source exports", enterprise: "Included against usable source exports" },
  {
    label: "Tally-ready accounting export setup",
    starter: "Standard self-service exports included",
    pro: "Included. Ledger and voucher mapping plus a sample import at onboarding",
    enterprise: "Included. Ledger and voucher mapping plus a sample import at onboarding",
  },
  sharedRow("Indian fee operations", "Term plans, instalments, concessions, partial payments and GST-aware receipts for taxable components"),
  sharedRow("Razorpay fee payments", "Use your own Razorpay account. Setup included. Direct bank settlement and gateway charges under your agreement"),
  sharedRow("Implementation and support", "Standard implementation and support included; custom SLA separately quoted"),
  sharedRow("Standard deployment", "Managed cloud on Microsoft Azure in India"),
];
