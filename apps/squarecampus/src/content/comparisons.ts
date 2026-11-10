import { corePlatform } from "./commercial";

/**
 * Competitor comparison content.
 *
 * Accuracy rules for this file (read before editing):
 * - The SquareCampus column states our own product facts.
 * - Competitor cells contain ONLY publicly verifiable facts (sourced from each
 *   vendor's public materials, as of the date below). Never invent pricing,
 *   uptime, or missing-feature claims — India residency and mobile apps are
 *   table stakes every major vendor meets, so they are not framed as our edge.
 * - Every page renders the disclaimer + competitor link so readers can verify.
 * - No Review/AggregateRating schema (we have no first-party review data).
 */

export const COMPARISON_AS_OF = "July 2026";

export type ComparisonRow = {
  dimension: string;
  squarecampus: string;
  competitor: string;
};

export type Comparison = {
  slug: string;
  competitor: string;
  competitorShort: string;
  competitorUrl: string;
  verifiedAt?: string;
  sources?: readonly { title: string; url: string }[];
  metaTitle: string;
  metaDescription: string;
  intentLabel: string;
  lede: string;
  // Honest acknowledgement of what the competitor is genuinely good at.
  competitorStrengths: string[];
  rows: ComparisonRow[];
  differentiators: { title: string; body: string }[];
  theyFitWhen: string[];
  weFitWhen: string[];
  faqs: { question: string; answer: string }[];
};

const sharedDifferentiators = [
  {
    title: "Follow one institutional record",
    body: "Every SquareCampus module reads and writes the same institutional record. An admission confirmed flows into academics, fees, and communication automatically — no connectors to maintain between separate products.",
  },
  {
    title: "Ask AEGIS within your controls",
    body: "AEGIS answers operational questions inside the same RBAC scopes and audit trails as the rest of the platform. Leadership asks; the system answers from live records, and every query is logged.",
  },
  {
    title: "Infrastructure questions answered in writing",
    body: "We name our cloud and region (Microsoft Azure in India) on the infrastructure page and answer infrastructure questionnaires in writing during evaluation. Ask any vendor for the same detail and compare the answers.",
  },
  {
    title: "A published licensing model",
    body: `Calculate the annual licence from published INR rates and progressive student slabs. Standard apps, implementation and support are included. ${corePlatform.futureFeatures} Additional usage and optional services have separate charges.`,
  },
] as const;

export const comparisons: Comparison[] = [
  {
    slug: "squarecampus-vs-entab-campuscare",
    competitor: "Entab CampusCare",
    competitorShort: "Entab",
    competitorUrl: "https://www.entab.in/",
    metaTitle: "SquareCampus vs Entab CampusCare — School ERP Comparison",
    metaDescription:
      "SquareCampus vs Entab CampusCare for Indian schools: architecture, AI, pricing transparency, deployment, and where each fits. An honest alternative guide.",
    intentLabel: "Entab CampusCare alternative",
    lede: "Entab's CampusCare is one of India's most established school ERPs, in use across thousands of schools. If you're evaluating it against SquareCampus, here's the honest breakdown — including where Entab may be the better call.",
    competitorStrengths: [
      "A long track record and a large installed base across Indian schools.",
      "A broad, mature module suite — admissions, biometric attendance, exams, fees, and transport with GPS.",
      "Established parent, teacher, and management apps that schools already know.",
    ],
    rows: [
      {
        dimension: "Architecture",
        squarecampus:
          "One unified institutional data model — every module reads and writes the same record.",
        competitor:
          "Established cloud ERP with a suite of modules for admissions, attendance, exams, fees, and transport.",
      },
      {
        dimension: "Intelligence layer",
        squarecampus:
          "AEGIS — governed, role-scoped answers and exception detection with audit trails.",
        competitor: "Reporting and analytics dashboards.",
      },
      {
        dimension: "Pricing",
        squarecampus:
          "Public annual INR rates and progressive student slabs, with a live calculator. Every generally available feature and standard staff, parent and student apps are included. Additional usage and optional services are separate.",
        competitor: "Not publicly listed; quote on request.",
      },
      {
        dimension: "Infrastructure transparency",
        squarecampus:
          "Region and residency posture published; documentation shared in writing during evaluation.",
        competitor: "Available on request.",
      },
      {
        dimension: "Deployment",
        squarecampus:
          "Managed cloud (Microsoft Azure, India) by default; Enterprise private deployment on AWS or a private cloud as a scoped service.",
        competitor: "Cloud (SaaS).",
      },
      {
        dimension: "Data residency",
        squarecampus: "India — Microsoft Azure regions in India; documentation on request.",
        competitor: "India-based (per vendor).",
      },
    ],
    differentiators: [...sharedDifferentiators],
    theyFitWhen: [
      "You want a long-established vendor with a very large installed base.",
      "Your evaluation team is comfortable with quote-only, non-public pricing.",
      "Your current processes are already built around CampusCare's specific workflows.",
    ],
    weFitWhen: [
      "You want one connected system instead of a suite of modules to keep in sync.",
      "You want a governed AI layer (AEGIS) and an infrastructure posture answered in writing.",
      "You want a published licensing model with the standard mobile apps included, separately scoped lines stated up front, and a guided go-live.",
    ],
    faqs: [
      {
        question: "Is SquareCampus a good Entab CampusCare alternative?",
        answer:
          "SquareCampus is a modern School OS built on one unified institutional data model with a governed intelligence layer (AEGIS), a published infrastructure posture, and a published licensing model on student-volume bands. Schools evaluating CampusCare often shortlist SquareCampus when they want a single connected system and an infrastructure posture they can question in writing. We support guided migration from existing school ERPs.",
      },
      {
        question: "Can we migrate from Entab CampusCare to SquareCampus?",
        answer:
          "Yes. We provide guided migration of student records, fee history, attendance, academic records, and staff data, with a parallel run before go-live. Anything the old system cannot supply is flagged before go-live, not discovered after.",
      },
    ],
  },
  {
    slug: "squarecampus-vs-fedena",
    competitor: "Fedena",
    competitorShort: "Fedena",
    competitorUrl: "https://fedena.com/",
    verifiedAt: "10 November 2026",
    sources: [
      { title: "Fedena prices", url: "https://fedena.com/pricing-and-plans" },
      { title: "Fedena features", url: "https://fedena.com/feature-tour" },
      { title: "Fedena FAQ", url: "https://fedena.com/faq" },
      { title: "Fedena multi-school", url: "https://fedena.com/multi_school" },
    ],
    metaTitle: "SquareCampus vs Fedena | Plans, AI and School Operations",
    metaDescription:
      "Compare Fedena’s fixed annual packages with SquareCampus’s Enterprise School OS, published student-volume pricing, shared feature access and governed AEGIS intelligence.",
    intentLabel: "Fedena alternative",
    lede: "Fedena offers hosted school management software with fixed annual packages and an extensive module catalogue. SquareCampus brings records, workflow ownership, institutional governance and AEGIS into one Enterprise School OS. Compare the operating experience and the full commercial scope alongside the licence price.",
    competitorStrengths: [
      "Published annual packages with unlimited students and courses advertised on its feature tour.",
      "Hosting, updates, training and support included. Its FAQ also lists implementation as included.",
      "An established school-management catalogue, mobile-app packages and a multi-school offering.",
    ],
    rows: [
      {
        dimension: "Licence model",
        squarecampus:
          "Annual licence calculated from progressive student-volume slabs. Published INR rates and a live calculator show your total before GST.",
        competitor:
          "India web-only annual packages list Standard ₹50,000, Premium ₹75,000 and Ultimate ₹1,00,000, plus GST. Unlimited students and courses are advertised. Confirm campus and subscription scope.",
      },
      {
        dimension: "Standard feature access",
        squarecampus:
          "Every generally available standard feature is eligible on Starter, Growth and Enterprise. Future standard features are included without feature fees or compulsory upgrades.",
        competitor:
          "Module bundles vary by package. The published comparison places audit among Ultimate features.",
      },
      {
        dimension: "Institutional operations",
        squarecampus:
          "Connected records, named workflow owners, exceptions, approvals and audit history. Multi-campus governance is eligible on every plan.",
        competitor:
          "Publishes role-based access, workflows, reporting and a multi-school offering. Confirm the applicable package and campus scope.",
      },
      {
        dimension: "Intelligence and analysis",
        squarecampus:
          "AEGIS is designed for role-scoped questions against institutional records, with sources, an audit trail and an AIC quote before analysis. People decide and act.",
        competitor:
          "Advertises reports, dashboards and analytics. The reviewed product and pricing pages do not specify an AI analyst or its usage terms. Ask for a demonstrated workflow.",
      },
      {
        dimension: "Mobile apps",
        squarecampus:
          "Standard staff, parent and student apps included on every plan. White-label Android and iOS setup is included in Enterprise and ₹25,000 once on Growth.",
        competitor:
          "India web-plus-mobile annual packages list ₹90,000, ₹1,15,000 and ₹1,40,000, plus GST. Confirm branding and publishing scope.",
      },
      {
        dimension: "Implementation and hosting",
        squarecampus:
          "Standard implementation and support included. Managed cloud on Microsoft Azure in India. Private deployment is a separately scoped service.",
        competitor:
          "Hosted packages include hosting, updates, training and support. Implementation is included according to the FAQ.",
      },
      {
        dimension: "Usage and complete cost",
        squarecampus:
          "Monthly AIC and communication allowances are published by plan. Additional quantities are prepaid. Optional API access and scoped services are separate.",
        competitor:
          "Compare messaging, integration, branding and multi-campus requirements in a matched quote. The headline annual fee alone does not establish those allowances.",
      },
    ],
    differentiators: [...sharedDifferentiators],
    theyFitWhen: [
      "A fixed annual package with advertised unlimited students fits your enrolment and required module bundle.",
      "Your teams prefer Fedena’s demonstrated workflows and mobile experience.",
      "Its written campus, integration and consumption terms fit the institution’s needs.",
    ],
    weFitWhen: [
      "You want to evaluate records, ownership, approvals and leadership oversight as one operating experience.",
      "You want to inspect a role-scoped AEGIS answer, its sources and the quote before execution.",
      "You value shared standard-feature access, including future additions, with published allowances and optional charges.",
    ],
    faqs: [
      {
        question: "Why the price difference?",
        answer:
          "Fedena’s published fixed packages can be attractive at higher enrolment. SquareCampus publishes a student-volume licence with every generally available standard feature eligible on every plan. Compare a real workflow from record to owner, approval and AEGIS insight, then match campus scope, apps, usage, migration and optional services in writing. The operating fit and complete cost should guide the decision.",
      },
      {
        question: "Does Fedena offer AI?",
        answer:
          "Fedena’s reviewed feature-tour and pricing pages advertise reporting and analytics without specifying an AI analyst comparable to AEGIS. This describes those public pages as reviewed on 10 November 2026. Ask Fedena to demonstrate any current AI capability, including its permissions, sources, action boundaries and usage charges.",
      },
      {
        question: "Future features?",
        answer: corePlatform.futureFeatures,
      },
      {
        question: "Moving from Fedena?",
        answer:
          "Migration is included in Growth and Enterprise. Confirm source exports, record mapping, reconciliation and parallel validation before go-live. Bespoke integrations and exceptional service requirements are scoped separately.",
      },
    ],
  },
  {
    slug: "squarecampus-vs-teachmint",
    competitor: "Teachmint",
    competitorShort: "Teachmint",
    competitorUrl: "https://www.teachmint.com/",
    metaTitle: "SquareCampus vs Teachmint — School Platform Comparison",
    metaDescription:
      "SquareCampus vs Teachmint: a governed School OS versus an LMS-and-content-first platform. Architecture, AI and operations compared honestly for Indian schools.",
    intentLabel: "Teachmint alternative",
    lede: "Teachmint built its name on teaching and content, then added ERP through acquisition. SquareCampus starts from operations. If your priority is running the institution — not just the classroom — here's the honest comparison.",
    competitorStrengths: [
      "Strong teaching, LMS, and content tooling, including a large question bank.",
      "A mobile-first experience and wide language coverage.",
      "A large global user base across schools and countries.",
    ],
    rows: [
      {
        dimension: "Starting point",
        squarecampus:
          "Operations first — a School OS for admissions, fees, attendance, and compliance.",
        competitor:
          "Teaching and content first — an integrated platform combining LMS, content, and ERP.",
      },
      {
        dimension: "Architecture",
        squarecampus: "One unified institutional data model built for operations.",
        competitor:
          "Integrated platform; ERP capabilities strengthened via the MyClassCampus acquisition.",
      },
      {
        dimension: "Intelligence layer",
        squarecampus: "AEGIS — governed, role-scoped operational answers with audit trails.",
        competitor: "Analytics and reporting across teaching and administration.",
      },
      {
        dimension: "Pricing",
        squarecampus:
          "Public annual INR rates and progressive student slabs, with a live calculator. Every generally available feature and standard staff, parent and student apps are included. Additional usage and optional services are separate.",
        competitor: "Quote-based.",
      },
      {
        dimension: "Infrastructure transparency",
        squarecampus:
          "Region and residency posture published; documentation shared in writing during evaluation.",
        competitor: "Available on request.",
      },
      {
        dimension: "Deployment",
        squarecampus:
          "Managed cloud (Microsoft Azure, India) by default; Enterprise private deployment on AWS or a private cloud as a scoped service.",
        competitor: "Cloud (SaaS).",
      },
    ],
    differentiators: [...sharedDifferentiators],
    theyFitWhen: [
      "Your top priority is classroom teaching, LMS, and ready-made content.",
      "You want a mobile-first learning experience more than admissions, fees and multi-campus administration.",
      "You're primarily digitizing teaching rather than back-office operations.",
    ],
    weFitWhen: [
      "Your priority is running the institution: admissions, fees, attendance, compliance, multi-campus.",
      "You want a governed operational AI layer and one connected operating model.",
      "You want an infrastructure posture answered in writing and predictable, all-inclusive pricing, with operations built as the core.",
    ],
    faqs: [
      {
        question: "Is SquareCampus a good Teachmint alternative?",
        answer:
          "For institutions that want admissions, fees, attendance, compliance and multi-campus control on one record, SquareCampus is a strong Teachmint alternative because operations are the core of the product, not an addition. Teachmint remains a strong choice when teaching, LMS, and content are the primary need.",
      },
      {
        question: "Does SquareCampus handle teaching and academics too?",
        answer:
          "Yes. SquareCampus covers attendance, timetables, grading, assessments, and academic records as part of the connected operating model. Where a school also needs a dedicated LMS, SquareCampus can integrate with it over APIs.",
      },
    ],
  },
];

export function comparisonBySlug(slug: string) {
  return comparisons.find((c) => c.slug === slug);
}
