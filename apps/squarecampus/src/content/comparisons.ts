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
    title: "One unified institutional data model, not stitched modules",
    body: "Every SquareCampus module reads and writes the same institutional record. An admission confirmed flows into academics, fees, and communication automatically — no connectors to maintain between separate products.",
  },
  {
    title: "AEGIS — governed intelligence, not a bolt-on chatbot",
    body: "AEGIS answers operational questions inside the same RBAC scopes and audit trails as the rest of the platform. Leadership asks; the system answers from live records, and every query is logged.",
  },
  {
    title: "Infrastructure questions answered in writing",
    body: "We name our cloud and region (Microsoft Azure in India) on the infrastructure page and answer infrastructure questionnaires in writing during evaluation. Ask any vendor for the same detail and compare the answers.",
  },
  {
    title: "A published licensing model",
    body: "Like most vendors, we issue figures after scoping — but the model is published up front: one annual institutional licence on student-volume bands with the platform's modules and the standard parent and staff apps included, no per-module upsells and no hidden 'parent app' fees. Implementation and support are included; custom integrations are scoped as their own lines.",
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
          "Model published: annual licence on student-volume bands, modules and standard apps included; figures by written proposal after discovery.",
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
          "Managed cloud (Microsoft Azure, India) by default; Enterprise private deployment on AWS, a private cloud or on premises as a scoped service.",
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
    metaTitle: "SquareCampus vs Fedena — School Management Software Comparison",
    metaDescription:
      "SquareCampus vs Fedena: managed School OS versus open-source, plugin-based ERP. Architecture, AI, deployment and pricing compared honestly for schools.",
    intentLabel: "Fedena alternative",
    lede: "Fedena is a widely used, plugin-extensible school ERP with an open-source core. The real choice between Fedena and SquareCampus is about who runs the system — you, or us. Here's the honest comparison.",
    competitorStrengths: [
      "An open-source core (Apache 2.0) you can self-host and modify.",
      "A large global install base and a wide catalogue of modules and plugins.",
      "A free starting point, with Fedena Pro for paid features and support.",
    ],
    rows: [
      {
        dimension: "Architecture",
        squarecampus:
          "One unified institutional data model — modules are one system, not separately configured plugins.",
        competitor:
          "Modular, plugin-extensible core; capabilities added via plugins and integrations.",
      },
      {
        dimension: "Intelligence layer",
        squarecampus:
          "AEGIS — governed, role-scoped answers and exception detection with audit trails.",
        competitor: "Reporting dashboards and configurable dashlets.",
      },
      {
        dimension: "Who runs it",
        squarecampus: "Fully managed by us (or your cloud with our playbooks).",
        competitor:
          "Self-hosted (open-source) means your team owns hosting, security, and upgrades.",
      },
      {
        dimension: "Pricing",
        squarecampus:
          "Model published: annual licence on student-volume bands, modules and standard apps included; figures by proposal.",
        competitor: "Free open-source core; Fedena Pro is paid / plan-based.",
      },
      {
        dimension: "Deployment",
        squarecampus:
          "Managed cloud (Microsoft Azure, India) by default; Enterprise private deployment on AWS, a private cloud or on premises as a scoped service.",
        competitor: "Cloud or self-hosted.",
      },
      {
        dimension: "Infrastructure transparency",
        squarecampus: "Region and residency posture published — because we run it.",
        competitor: "Depends on your own hosting when self-hosted.",
      },
    ],
    differentiators: [...sharedDifferentiators],
    theyFitWhen: [
      "You have in-house IT and want open-source control or full self-hosting.",
      "You want a free starting point and are comfortable owning maintenance and security.",
      "You need to fork and customize the source code for a very specific workflow.",
    ],
    weFitWhen: [
      "You want the operating system run for you, with security and upgrades handled.",
      "You want a governed AI layer and one connected model instead of assembling plugins.",
      "You want predictable pricing and a fast, guided go-live rather than a self-managed build.",
    ],
    faqs: [
      {
        question: "Is SquareCampus a good Fedena alternative?",
        answer:
          "If you want a fully managed School OS rather than a self-hosted, plugin-based system, SquareCampus is a strong Fedena alternative. You get one unified institutional data model, the AEGIS intelligence layer, managed infrastructure, and included mobile apps — without owning hosting, security, and upgrades yourself.",
      },
      {
        question: "Does SquareCampus offer self-hosting like Fedena's open source?",
        answer:
          "No. SquareCampus is delivered as a managed platform on our Microsoft Azure infrastructure in India. Institutions that need their own boundary can scope an Enterprise private deployment on AWS, in a private cloud or on premises. Running it in the institution's own cloud account (BYOC) is not offered today, and there is no open-source self-hosting.",
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
          "Model published: annual licence on student-volume bands, modules and standard apps included; figures by written proposal after discovery.",
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
          "Managed cloud (Microsoft Azure, India) by default; Enterprise private deployment on AWS, a private cloud or on premises as a scoped service.",
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
