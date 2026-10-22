import { blogHref } from "@fairhelm/config/urls";
/**
 * Search-intent pages.
 *
 * One page per query cluster a school buyer actually types. Each lives at a
 * flat keyword slug (`/fee-management-software-for-schools/`) and is rendered
 * by `src/app/(company)/[intent]/page.tsx`. `scripts/check-content.ts` reads
 * this same array, so a page cannot ship without its definition block, at
 * least four workflows, four FAQs, and resolvable related links.
 *
 * Writing rules (the claims gate enforces the hard ones):
 * - The `definition` is a direct 40–70 word answer to "what is X". It is the
 *   part search engines lift into a snippet, so it must stand alone.
 * - Vendor-neutral where the query is neutral: the `evaluation` list is what
 *   any buyer should check of any vendor, including us.
 * - No customer counts, rankings, fixed timelines, or certifications. Security
 *   language stays at "designed to"; see docs/marketing-claims-register.md.
 * - Every page links out to the platform, the category page, one comparison
 *   and one post, so the graph is dense in both directions.
 */

import { multiCampusContrast, product } from "./commercial";

export type IntentPage = {
  slug: string;
  /** The primary query the page targets; appears in the kicker. */
  keyword: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lede: string;
  audience: readonly string[];
  definition: { title: string; body: string };
  workflows: readonly { title: string; body: string }[];
  indiaSpecifics: readonly string[];
  evaluation: readonly string[];
  faqs: readonly { question: string; answer: string }[];
  related: readonly { href: string; label: string; note: string }[];
  /**
   * Optional worked example and stated limits (audit SC-036): original,
   * page-specific evidence of how the workflow is designed to run, and what
   * is configured, scoped or outside it. Restates the design; adds no
   * capability, customer or result.
   */
  example?: {
    title: string;
    steps: readonly string[];
  };
  limits?: readonly string[];
  /**
   * Optional two-column fact table for pages whose buyer question is a
   * distinction ("governance" versus "support"). Rendered as a real table.
   */
  contrast?: {
    eyebrow: string;
    title: string;
    body: string;
    columns: readonly [string, string];
    rows: ReadonlyArray<{ dimension: string; left: string; right: string }>;
  };
};

export const intentPages: IntentPage[] = [
  {
    slug: "school-erp-software",
    keyword: "School ERP software",
    metaTitle: "School ERP Software for Indian Schools",
    metaDescription:
      "School ERP software that connects admissions, fees, attendance, exams and communication on one governed record. Built for Indian schools and school groups.",
    h1: "School ERP software that behaves like one system, not seven.",
    lede: "Most school ERP software is a set of modules sold together. SquareCampus is built the other way round: one institutional record, one workflow engine, one audit trail, and the modules a school expects sitting on top of it.",
    audience: ["Principals", "Trust administrators", "IT coordinators", "Finance officers"],
    definition: {
      title: "What is school ERP software?",
      body: "School ERP software is the system a school uses to run its recurring operations: admissions, student records, attendance, fees, examinations, timetables, transport and parent communication. The term comes from enterprise resource planning. In practice the useful question is not which modules exist but whether they share one record, so a change in one place is reflected everywhere else without re-entry.",
    },
    workflows: [
      {
        title: "Admissions to enrolment",
        body: "An enquiry becomes an application, a verified document set, a fee plan and a section allocation, with each hand-off owned by a named person and visible to the parent.",
      },
      {
        title: "Attendance to fees and alerts",
        body: "Daily attendance feeds fee rules, transport billing and guardian alerts. Exceptions carry a reason and an approver rather than a note in a register.",
      },
      {
        title: "Exams to results and promotion",
        body: "Schedules, marks entry, moderation, publication and promotion run as one sequence with a record of who changed what and when.",
      },
      {
        title: "Approvals with an audit trail",
        body: "Leave, concessions, refunds, purchases and gate passes move through role-scoped approvals, so the trail exists before an auditor asks for it.",
      },
      {
        title: "Communication tied to context",
        body: "Messages to parents and staff attach to the class, term, fee state or incident they concern, with delivery status and escalation paths.",
      },
      {
        title: "Leadership view",
        body: "Trustees and principals see what requires attention across campuses today, with an owner against each item, instead of a monthly report pack.",
      },
    ],
    indiaSpecifics: [
      "Fee structures with term plans, sibling and staff concessions, transport slabs, late fees and GST-aware receipts.",
      "CBSE, ICSE and state-board grading templates and report formats.",
      "Parent and student apps designed for the family's preferred language; available languages confirmed in the proposal.",
      "Multi-campus and trust-level structures as a first-class model, not a customisation.",
      "Parent communication over the app, with other channels such as SMS or WhatsApp scoped per institution and acknowledgements recorded.",
      "Hosted on Microsoft Azure in India, with hosting details given in writing during evaluation.",
    ],
    evaluation: [
      "Does a change in admissions, attendance or fees appear everywhere else without re-entry?",
      "Can you see who approved an exception and why, months later, without asking the vendor?",
      "Is pricing one institutional licence on student-volume bands with modules and the standard mobile apps included, or per-module with add-ons?",
      "What does the rollout involve: migration, parallel run, role-based training, and a rollback plan?",
      "Will the vendor answer an infrastructure and security questionnaire in writing?",
      "What happens to your data when you leave, in what format, and by when?",
    ],
    example: {
      title: "A confirmed admission, followed through",
      steps: [
        "The admissions desk accepts an offer; the student record is created once.",
        "The class section, fee plan and guardian contacts are set on that same record.",
        "Attendance, fees and parent communication all start from it — nothing is re-typed.",
        "Each hand-off has an owner, and each change is recorded with who made it.",
      ],
    },
    limits: [
      "Modules, apps and languages for your rollout are confirmed in writing in your proposal.",
      "Board-specific report formats and fee rules are set up as configuration during implementation.",
      "Integrations with tools you keep are scoped work with stated prerequisites; nothing connects automatically.",
      "Data migration is included from Pro (quoted on Starter) and validated in a parallel run before the old system is retired.",
    ],
    faqs: [
      {
        question: "Is SquareCampus a school ERP?",
        answer: product.categoryRelationship,
      },
      {
        question: "Can school ERP software run alongside the tools we already use?",
        answer:
          "Yes. A bounded deployment can run next to an existing ERP, LMS, payment portal or identity provider, governing the workflow that crosses them. Consolidation is a later choice, never a precondition.",
      },
      {
        question: "How is pricing structured?",
        answer:
          "One annual institutional licence calculated on student-volume bands, with the platform's modules and the standard parent and staff mobile apps included. The model is published on the pricing page; figures are issued in a written proposal after discovery, implementation and support are included, and custom integrations are scoped as their own lines.",
      },
      {
        question: "What does implementation involve?",
        answer:
          "A guided rollout sequenced around the academic calendar: institution blueprint, data migration, a parallel run on anything finance or academic teams must trust, role-based training, then go-live.",
      },
      {
        question: "How does the platform handle security and data access?",
        answer:
          "Access is role-based and scoped by campus, department and workflow step; actions are logged with user and timestamp; data is designed to be encrypted in transit and at rest. Documentation is shared on request.",
      },
    ],
    related: [
      { href: "/platform/", label: "Platform", note: "The four layers every module sits on" },
      {
        href: "/school-management-system/",
        label: "School management system",
        note: "The category page, modules as workflows",
      },
      {
        href: "/compare/squarecampus-vs-fedena/",
        label: "SquareCampus vs Fedena",
        note: "Managed School OS against an open-source ERP",
      },
      {
        href: blogHref("/how-to-choose-school-management-system/"),
        label: "How to choose a school management system",
        note: "A vendor-neutral buyer's checklist",
      },
      { href: "/pricing/", label: "Pricing", note: "The licensing model; figures by proposal" },
    ],
  },
  {
    slug: "fee-management-software-for-schools",
    keyword: "Fee management software for schools",
    metaTitle: "Fee Management Software for Schools in India",
    metaDescription:
      "Fee management software for Indian schools: term plans, concessions, transport slabs, GST receipts, reminders and reconciliation on one governed ledger.",
    h1: "Fee management that closes the month without a spreadsheet.",
    lede: "Fee collection in an Indian school is not one number. It is term plans, concessions, transport slabs, late fees, partial payments and a reconciliation that someone does by hand every month. SquareCampus keeps all of it on one ledger with an owner against every exception.",
    audience: ["Finance officers", "Bursars", "Trust accountants", "Principals"],
    definition: {
      title: "What is fee management software?",
      body: "Fee management software is the part of a school system that defines fee structures, raises dues per student, records payments across channels, applies concessions and late fees, issues receipts and reconciles collections against the bank. Done well, it is a ledger the whole school shares rather than a collection module that finance reconciles against everything else.",
    },
    workflows: [
      {
        title: "Fee plans per student",
        body: "Term plans, optional components, sibling and staff concessions and transport slabs resolve into one due amount per student, with the rule that produced it visible.",
      },
      {
        title: "Collection across channels",
        body: "Online payments, counter cash, cheques and bank transfers post to the same ledger and issue receipts from one sequence.",
      },
      {
        title: "Reminders with an acknowledgement",
        body: "Dues reminders go to parents in context, and the record shows what was sent, when, and whether it was seen.",
      },
      {
        title: "Concessions and refunds as approvals",
        body: "Every concession, waiver and refund runs through a role-scoped approval with a reason, so the finance trail is complete before an audit.",
      },
      {
        title: "Reconciliation and audit exports",
        body: "Collections reconcile against settlements and bank statements, with exports in the formats auditors and trust boards ask for.",
      },
    ],
    indiaSpecifics: [
      "GST-aware receipts for taxable components such as transport and hostel.",
      "Partial payments and instalment plans without losing the original due.",
      "Late-fee rules that respect board holidays and school-specific grace periods.",
      "Trust-level visibility across campuses with campus-level execution.",
      "Follow-up on overdue fees as a workflow with an owner, not a printed list.",
    ],
    evaluation: [
      "Can one student carry a term plan, a concession and a transport slab without a manual override?",
      "Do online, counter and bank payments land on the same ledger and the same receipt sequence?",
      "Is every concession and refund approved by a named role with a recorded reason?",
      "How long does month-end reconciliation take, and who does it?",
      "Can the trust board see collections across campuses without a prepared report?",
    ],
    example: {
      title: "A sibling concession above the desk's limit",
      steps: [
        "The accounts desk applies a sibling concession larger than its approval limit.",
        "The request routes to the approver the institution named for that limit, with the reason attached.",
        "Once approved, the fee plan, the next invoice and the receipt reflect it; if refused, nothing changes.",
        "The approval, the approver and the reason stay on the student's fee record for audit.",
      ],
    },
    limits: [
      "Fee heads, instalments, concessions and late-fee rules are configured from your current structure during implementation.",
      "Payments run through your institution's own gateway account; SquareCampus never handles the money, and gateway fees are between you and the gateway.",
      "Connections to accounting software are scoped integration work, assessed per package; there is no pre-built connector.",
      "Historical dues and receipts are migrated from Pro and validated in a parallel run; anything the old records cannot support is flagged before go-live.",
    ],
    faqs: [
      {
        question: "Does the fee module support Indian fee structures?",
        answer:
          "Yes. Term plans, concessions, transport slabs, late fees, partial payments and GST-aware receipts are part of the fee model rather than customisations.",
      },
      {
        question: "Which payment methods are supported?",
        answer:
          "Online payments through a payment gateway, counter cash, cheques and bank transfers post to one ledger. Gateway options are confirmed during scoping.",
      },
      {
        question: "How is follow-up on overdue fees handled?",
        answer:
          "Outstanding dues become a follow-up workflow with reminders in context, an owner, and a record of every contact, so leadership sees the state without chasing the office.",
      },
      {
        question: "Can finance keep its existing accounting software?",
        answer:
          "Yes. Collections and receipts export in accounting-friendly formats, and a bounded deployment can run alongside the existing finance stack.",
      },
    ],
    related: [
      {
        href: blogHref("/school-fee-reconciliation/"),
        label: "School fee reconciliation",
        note: "Why the month-end takes so long, and what fixes it",
      },
      {
        href: "/school-management-system/",
        label: "School management system",
        note: "Fees inside the wider operating loop",
      },
      {
        href: "/compare/squarecampus-vs-entab-campuscare/",
        label: "SquareCampus vs Entab CampusCare",
        note: "An honest comparison for finance-led evaluations",
      },
      {
        href: "/rollout/",
        label: "Rollout",
        note: "Parallel run on the fee ledger before go-live",
      },
      { href: "/pricing/", label: "Pricing", note: "Student-volume bands, modules included" },
    ],
  },
  {
    slug: "school-attendance-management-system",
    keyword: "School attendance management system",
    metaTitle: "School Attendance Management System",
    metaDescription:
      "Attendance management for Indian schools that turns daily marks into early warnings, parent alerts, fee rules and a record every exception is owned in.",
    h1: "Attendance that raises a hand before term end.",
    lede: "Attendance is the earliest signal a school has about a student, a section or a teacher. Most systems store it. SquareCampus acts on it: an absence pattern becomes an exception with an owner, a guardian alert, and a line in the leadership view the same day.",
    audience: ["Principals", "Class teachers", "Academic coordinators", "Parents"],
    definition: {
      title: "What is a school attendance management system?",
      body: "A school attendance management system records daily and period-wise presence for students and staff, notifies guardians, produces the registers and percentages that boards require, and flags patterns that need follow-up. The difference between a register and a system is what happens after the mark: whether an exception is assigned to someone and tracked to resolution.",
    },
    workflows: [
      {
        title: "Quick marking",
        body: "Class and period attendance from the teacher app or a device at the gate, with late arrivals and early departures captured with a reason.",
      },
      {
        title: "Guardian alerts in context",
        body: "Absence and late notifications reach parents through the app with the date, period and a way to respond, and the response is recorded.",
      },
      {
        title: "Early-warning exceptions",
        body: "Consecutive absences, falling percentages and section-wide dips surface as exceptions with a named owner rather than a figure in a month-end report.",
      },
      {
        title: "Attendance to fees and transport",
        body: "Attendance feeds transport billing and fee rules where the school configures it, so the office is not reconciling two registers.",
      },
      {
        title: "Registers and board formats",
        body: "Class registers, percentage reports and board-specific formats are produced from the same record, ready for inspection.",
      },
    ],
    indiaSpecifics: [
      "Board-required attendance percentages and registers in the expected layouts.",
      "Staff attendance and substitution recorded against the timetable.",
      "Transport attendance per route and stop, reconciled with the classroom mark.",
      "Alerts to guardians on the channels Indian parents actually read.",
      "Multi-campus dashboards for trusts that need one view across schools.",
    ],
    evaluation: [
      "Does an absence pattern become a task for someone, or only a number on a report?",
      "Can a teacher mark a class in under a minute from a phone?",
      "Are guardian alerts recorded with delivery and acknowledgement?",
      "Do transport and classroom attendance reconcile automatically?",
      "Can the principal see today's attendance across campuses without asking?",
    ],
    faqs: [
      {
        question: "How is attendance marked?",
        answer:
          "From the teacher app, a shared classroom device, or an integrated gate device, per class or per period, with late and early-leave reasons captured in place.",
      },
      {
        question: "Are parents notified automatically?",
        answer:
          "Yes. Absence and late notifications go to guardians through the parent app with context, and the acknowledgement is recorded against the student.",
      },
      {
        question: "What counts as an attendance exception?",
        answer:
          "Rules the school sets: consecutive absences, a percentage falling below a threshold, or a section-wide dip. Each becomes an exception with an owner and a resolution trail.",
      },
      {
        question: "Does it support staff attendance and substitutions?",
        answer:
          "Yes. Staff attendance is recorded against the timetable, and substitutions are assigned and logged so cover is visible to the coordinator.",
      },
    ],
    related: [
      {
        href: blogHref("/attendance-early-warning-system/"),
        label: "Attendance as an early-warning system",
        note: "The patterns worth acting on, and when",
      },
      { href: "/ecosystem/", label: "Ecosystem", note: "Teacher, parent and student surfaces" },
      {
        href: "/school-management-system/",
        label: "School management system",
        note: "Attendance inside the operating loop",
      },
      {
        href: "/aegis/",
        label: "AEGIS",
        note: "Ask which sections need attention today, in plain language",
      },
      {
        href: "/compare/squarecampus-vs-teachmint/",
        label: "SquareCampus vs Teachmint",
        note: "Operations-first against classroom-first",
      },
    ],
  },
  {
    slug: "school-admission-management-software",
    keyword: "School admission management software",
    metaTitle: "School Admission Management Software",
    metaDescription:
      "Admission management software for Indian schools: enquiry to enrolment with document verification, fee plans, section allocation and a status parents can see.",
    h1: "Admissions with a status every parent can see.",
    lede: "An admissions season is hundreds of applications moving through verification, interaction, offer, fee and allocation, with parents phoning the office to ask where theirs is. SquareCampus runs the sequence with an owner on every step and a status the parent sees without calling.",
    audience: ["Admissions coordinators", "Front office", "Principals", "Parents"],
    definition: {
      title: "What is school admission management software?",
      body: "School admission management software runs the enquiry-to-enrolment sequence: capturing enquiries, issuing application forms, collecting and verifying documents, scheduling interactions, issuing offers, collecting admission fees and allocating sections. Its job is to make every application's status visible to the office and the parent, and to turn a confirmed admission into a student record without re-entry.",
    },
    workflows: [
      {
        title: "Enquiry capture",
        body: "Enquiries from the website, walk-ins and calls land in one queue with source, class sought and a follow-up owner.",
      },
      {
        title: "Application and documents",
        body: "Parents complete forms and upload documents online; the office verifies against a checklist, and gaps go back to the parent as a request, not a phone call.",
      },
      {
        title: "Interaction and offer",
        body: "Interaction slots, outcomes and offers are recorded in sequence, with offer letters issued from the record.",
      },
      {
        title: "Admission fee to enrolment",
        body: "A paid admission fee confirms the seat, creates the student record, attaches the fee plan and allocates a section in one step.",
      },
      {
        title: "Leadership view of the season",
        body: "Applications by stage, class and campus are visible daily, with stalled applications surfaced as exceptions.",
      },
    ],
    indiaSpecifics: [
      "Class-wise seat matrices with sibling and staff-ward priorities.",
      "Document checklists that match board and state requirements.",
      "Admission, registration and caution-deposit fees handled as distinct components.",
      "Transfer-certificate and previous-school records captured at enrolment.",
      "Multi-campus seasons run centrally with campus-level execution.",
    ],
    evaluation: [
      "Can a parent see their application's stage without calling the office?",
      "Does a confirmed admission create the student, the fee plan and the section allocation together?",
      "Are document gaps requested from the parent in the system, with a record?",
      "Can leadership see stalled applications today, by class and campus?",
      "What happens to the enquiry list after the season, and who owns it?",
    ],
    faqs: [
      {
        question: "Can parents apply online?",
        answer:
          "Yes. Parents complete the application and upload documents from the app or the web, and see the stage their application is at throughout.",
      },
      {
        question: "How are seats and priorities handled?",
        answer:
          "Class-wise seat matrices with the priorities the school defines, such as siblings and staff wards, applied consistently and visibly.",
      },
      {
        question: "What happens once an admission is confirmed?",
        answer:
          "The student record, fee plan and section allocation are created from the application in one step, so nothing is typed twice.",
      },
      {
        question: "Can we run admissions for several campuses centrally?",
        answer:
          "Yes. A trust can run one season across campuses with central visibility and campus-level execution.",
      },
    ],
    related: [
      {
        href: blogHref("/admissions-to-enrolment-gap/"),
        label: "The admissions-to-enrolment gap",
        note: "Where applications stall, and the fix",
      },
      {
        href: "/school-management-system/",
        label: "School management system",
        note: "Admissions as the first step of the loop",
      },
      {
        href: "/fee-management-software-for-schools/",
        label: "Fee management",
        note: "The fee plan the admission creates",
      },
      { href: "/rollout/", label: "Rollout", note: "Going live before the next season" },
      { href: "/faq/", label: "FAQ", note: "Common evaluation questions answered" },
    ],
  },
  {
    slug: "multi-campus-school-management-software",
    keyword: "Multi-campus school management software",
    metaTitle: "Multi-Campus School Management Software for Trusts",
    metaDescription:
      "Multi-campus school management software for trusts and school groups: policy at the trust level, execution at each campus, one governed view across all of them.",
    h1: "One trust, many campuses, one governed view.",
    lede: "School groups swing between two failures: a head office that becomes the bottleneck for every decision, and campuses that drift into their own processes. SquareCampus is modelled on trust, school and campus from the start, so policy is set once and executed locally.",
    audience: ["Trustees", "Group CEOs and directors", "Head-office finance", "Campus principals"],
    definition: {
      title: "What is multi-campus school management software?",
      body: "Multi-campus school management software runs several schools or campuses on one system with a shared institutional model. The trust or head office sets policy, fee structures, academic calendars and approval limits; each campus executes within them; and leadership sees attendance, collections, admissions and exceptions across all campuses in one view without consolidating reports.",
    },
    workflows: [
      {
        title: "Policy at the trust level",
        body: "Fee structures, concession rules, approval limits and academic calendars are defined once and inherited by campuses, with local variations recorded as exceptions.",
      },
      {
        title: "Execution at the campus",
        body: "Each campus runs its own admissions, attendance, fees and communication inside the trust's rules, with its own owners and its own audit trail.",
      },
      {
        title: "Roles scoped by campus",
        body: "A campus principal sees their campus; a trust finance officer sees collections everywhere; a trustee sees exceptions across the group. Scope is a property of the role.",
      },
      {
        title: "Cross-campus exceptions",
        body: "Collections behind plan, attendance dips and stalled approvals surface as exceptions with an owner, whichever campus they belong to.",
      },
      {
        title: "Board reporting from the record",
        body: "Monthly trust-board views come from the same data the campuses run on, so there is nothing to reconcile before the meeting.",
      },
    ],
    indiaSpecifics: [
      "Trust, society and company structures with campuses under different boards.",
      "Campus-specific fee schedules within a trust-level policy.",
      "Consolidated collections and outstanding across campuses for the trust accountant.",
      "Staff transfers between campuses with history intact.",
      "Central communication to all parents with campus-level sending.",
    ],
    evaluation: [
      "Is the trust-campus hierarchy part of the data model, or a workaround with separate instances?",
      "Can head office set a fee policy once and see where campuses deviate?",
      "Are roles scoped by campus, so a principal never sees another school's data?",
      "Can the board see today's state across campuses without a prepared pack?",
      "How does adding a campus work: configuration or a new implementation?",
    ],
    contrast: {
      eyebrow: "Governance versus support",
      title: "Multi-campus governance is not the same as supporting multiple campuses.",
      body: "Most school software can hold several campuses' records. The buyer question is whether policy, scope, exceptions and board reporting cross campuses without consolidation. This is the difference, dimension by dimension.",
      columns: ["Supports multiple campuses", "Multi-campus governance"],
      rows: multiCampusContrast.map((row) => ({
        dimension: row.dimension,
        left: row.supports,
        right: row.governs,
      })),
    },
    faqs: [
      {
        question: "Does each campus need its own instance?",
        answer:
          "No. Trust, school and campus are one model. Campuses share the trust's policies and run their own operations inside them.",
      },
      {
        question: "Can campuses have different fee structures?",
        answer:
          "Yes. Campus-specific schedules sit within trust-level policy, and any deviation is visible to head office as a recorded exception.",
      },
      {
        question: "How is access separated between campuses?",
        answer:
          "Roles carry a scope. A campus role sees its campus; trust roles see across campuses. The scope applies to every screen, report and AEGIS answer.",
      },
      {
        question: "Can we add a campus later?",
        answer:
          "Yes. A new campus is configured under the trust and inherits its policies, with its own rollout sequence for migration and training.",
      },
    ],
    related: [
      {
        href: blogHref("/multi-campus-school-governance/"),
        label: "Centralised control vs campus autonomy",
        note: "The governance model that resolves it",
      },
      {
        href: blogHref("/trust-board-monthly-reporting/"),
        label: "Trust-board monthly reporting",
        note: "From report packs to a live view",
      },
      {
        href: "/launch-partners/",
        label: "Founding Institutional Partners",
        note: "The programme for school groups",
      },
      { href: "/aegis/", label: "AEGIS", note: "Cross-campus questions, answered in scope" },
      {
        href: "/school-management-system/",
        label: "School management system",
        note: "The category page",
      },
    ],
  },
  {
    slug: "school-management-software-for-cbse-schools",
    keyword: "School management software for CBSE schools",
    metaTitle: "School Management Software for CBSE Schools",
    metaDescription:
      "School management software for CBSE schools: grading templates, attendance registers, report formats and the records CBSE affiliation and inspections expect.",
    h1: "Built around the CBSE calendar, not adapted to it.",
    lede: "A CBSE school runs on the board's rhythm: registration, internal assessment, term reports, board exam records and the documentation an affiliation inspection asks for. SquareCampus carries those formats and cycles as configuration, so the office is not maintaining them in spreadsheets on the side. ICSE and state-board schools run on the same platform with their own configuration.",
    audience: [
      "CBSE school principals",
      "Examination in-charges",
      "Academic coordinators",
      "Administrators",
    ],
    definition: {
      title: "What should CBSE school management software include?",
      body: "School management software for CBSE schools should carry the board's grading and assessment structure, produce term reports in the expected formats, keep attendance registers and student records the way affiliation and inspection require, and handle the board's registration and examination cycles as part of the academic year rather than as separate spreadsheets.",
    },
    workflows: [
      {
        title: "Assessment structure as configuration",
        body: "Internal assessment components, weightages and grading scales are configured per class and session, and the report card follows from them.",
      },
      {
        title: "Term reports and report cards",
        body: "Marks entry, moderation and publication produce report cards in the school's CBSE-aligned format, with a record of every change.",
      },
      {
        title: "Registration and examination records",
        body: "Student data required for board registration is kept complete from admission, so the annual export is a check rather than a scramble.",
      },
      {
        title: "Attendance registers for inspection",
        body: "Registers and percentages are produced from the daily record in the layouts inspections expect.",
      },
      {
        title: "Timetable and substitution",
        body: "Period allocation, teacher load and substitutions run against the academic calendar, with cover visible to the coordinator.",
      },
    ],
    indiaSpecifics: [
      "Grading scales and assessment components aligned to current CBSE guidance, maintained as configuration.",
      "Report card formats per class group, from primary to senior secondary.",
      "Student master data kept complete for board registration from the day of admission.",
      "Documentation trails that help an affiliation or inspection visit.",
      "Fee, transport and communication running on the same record as academics.",
    ],
    evaluation: [
      "Are assessment components and grading scales configuration, or a custom build per session?",
      "Can report cards be produced without exporting marks to a spreadsheet?",
      "Is student master data complete enough for board registration without a data drive?",
      "Do attendance registers come out in the layout an inspection expects?",
      "Does academics share a record with fees and communication, or sit in its own module?",
    ],
    faqs: [
      {
        question: "Does SquareCampus support CBSE grading and report cards?",
        answer:
          "Yes. Assessment components, weightages and grading scales are configured per class and session, and report cards are produced from them in the school's CBSE-aligned format.",
      },
      {
        question: "Can we run other boards at the same trust?",
        answer:
          "Yes. Campuses under different boards run on one trust with board-specific academic configuration per campus.",
      },
      {
        question: "How is board registration data handled?",
        answer:
          "Student master data required for registration is captured at admission and kept complete, so the annual export is a verification step.",
      },
      {
        question: "Will teachers need to learn a new grading workflow?",
        answer:
          "Marks entry follows the school's existing assessment structure. Role-based training during rollout covers the examination workflow end to end.",
      },
    ],
    related: [
      {
        href: blogHref("/board-specific-school-software/"),
        label: "Board-specific school software",
        note: "What differs between CBSE, ICSE and state boards",
      },
      {
        href: blogHref("/exam-and-result-operations/"),
        label: "Exam and result operations",
        note: "From schedule to publication without drift",
      },
      {
        href: "/school-exam-management-software/",
        label: "Exam management",
        note: "The examination workflow in detail",
      },
      {
        href: "/school-management-system/",
        label: "School management system",
        note: "The category page",
      },
      {
        href: "/school-management-software-for-icse-schools/",
        label: "For ICSE schools",
        note: "The same platform, configured for CISCE",
      },
      {
        href: "/school-management-software-for-state-board-schools/",
        label: "For state-board schools",
        note: "State formats, languages and calendars",
      },
      { href: "/rollout/", label: "Rollout", note: "Sequenced around the academic calendar" },
    ],
  },
  {
    slug: "school-exam-management-software",
    keyword: "School exam management software",
    metaTitle: "School Exam Management Software",
    metaDescription:
      "Exam management software for Indian schools: schedules, marks entry, moderation, report cards, results publication and promotion on one auditable record.",
    h1: "From exam schedule to results without a single re-typed mark.",
    lede: "Examinations are the most audited thing a school does and usually the most spreadsheet-driven. SquareCampus runs the cycle as one sequence, schedule, marks, moderation, publication and promotion, with every change attributed and every result traceable to its entry.",
    audience: ["Examination in-charges", "Subject teachers", "Academic coordinators", "Principals"],
    definition: {
      title: "What is school exam management software?",
      body: "School exam management software schedules examinations, allocates rooms and invigilators, captures marks per subject and component, applies grading and moderation rules, produces report cards and result sheets, publishes results to parents, and rolls students into the next class. Its value is an unbroken record from the mark entered to the result published, so any question later has an answer.",
    },
    workflows: [
      {
        title: "Schedule and allocation",
        body: "Exam dates, rooms, seating and invigilation are planned against the timetable, with clashes surfaced before they reach a notice board.",
      },
      {
        title: "Marks entry by role",
        body: "Subject teachers enter marks for their allocation only; entries are timestamped and attributable, and late or missing entries surface as exceptions.",
      },
      {
        title: "Grading and moderation",
        body: "Weightages, grading scales and moderation rules apply consistently, with every override recorded with a reason and an approver.",
      },
      {
        title: "Report cards and publication",
        body: "Report cards are produced in the school's format and published to parents through the app, with re-issues tracked.",
      },
      {
        title: "Promotion and the next session",
        body: "Promotion decisions roll students into the next class and carry their record forward, so the new session starts clean.",
      },
    ],
    indiaSpecifics: [
      "Board-aligned assessment structures for CBSE, ICSE and state boards.",
      "Report card formats per class group, including remarks and co-scholastic areas.",
      "Result sheets and toppers lists in the layouts schools publish.",
      "Re-evaluation and re-test handling as recorded workflows.",
      "Multi-campus examination calendars with campus-level execution.",
    ],
    evaluation: [
      "Can a teacher enter marks only for their own allocation, with each entry attributed?",
      "Are overrides and moderation recorded with a reason and an approver?",
      "Can report cards be produced without exporting to a spreadsheet?",
      "How are re-tests and re-evaluations handled and traced?",
      "Does promotion carry the full record into the next session?",
    ],
    faqs: [
      {
        question: "Can teachers enter marks from their phones?",
        answer:
          "Yes. Marks entry is available from the teacher app for the teacher's own allocation, with entries timestamped and attributable.",
      },
      {
        question: "How are report card formats handled?",
        answer:
          "Formats are configured per class group and board, including remarks and co-scholastic areas, and produced directly from the marks record.",
      },
      {
        question: "What if a result needs to be corrected after publication?",
        answer:
          "Corrections run as a recorded workflow with a reason and an approver, and the re-issued report card is tracked against the original.",
      },
      {
        question: "Does it handle promotion to the next class?",
        answer:
          "Yes. Promotion decisions roll students into the next session with their record intact, including pending dues and documents.",
      },
    ],
    related: [
      {
        href: blogHref("/exam-and-result-operations/"),
        label: "Exam and result operations",
        note: "The failure points in a typical exam cycle",
      },
      {
        href: "/school-management-software-for-cbse-schools/",
        label: "For CBSE schools",
        note: "Board-aligned configuration",
      },
      {
        href: "/school-management-system/",
        label: "School management system",
        note: "Exams inside the operating loop",
      },
      { href: "/ecosystem/", label: "Ecosystem", note: "Teacher and parent surfaces" },
      {
        href: "/what-is-squarecampus/",
        label: "What is SquareCampus?",
        note: "The canonical definition",
      },
    ],
  },
  {
    slug: "parent-communication-app-for-schools",
    keyword: "Parent communication app for schools",
    metaTitle: "Parent Communication App for Schools in India",
    metaDescription:
      "A parent communication app that ties every message to context: attendance, fees, results and circulars, with delivery and acknowledgement recorded.",
    h1: "Parent communication with a record, not a broadcast.",
    lede: "Schools do not lack ways to message parents. They lack a record of what was sent, to whom, about what, and whether it was seen. SquareCampus attaches every message to the student, class, fee state or incident it concerns, and keeps the acknowledgement.",
    audience: ["Principals", "Class teachers", "Front office", "Parents"],
    definition: {
      title: "What is a parent communication app for schools?",
      body: "A parent communication app is the channel through which a school sends circulars, attendance and fee notifications, results, event notices and individual messages to guardians, and through which parents respond, acknowledge and pay. The difference between a messaging tool and a communication system is context and record: each message belongs to something, and the school can see delivery and acknowledgement.",
    },
    workflows: [
      {
        title: "Notifications in context",
        body: "Absence, dues, results and incident notifications carry the student, date and detail they concern, and link to the action a parent can take.",
      },
      {
        title: "Circulars with acknowledgement",
        body: "Circulars go to the right classes and campuses, and the school sees who has read and acknowledged them.",
      },
      {
        title: "Two-way, role-aware messaging",
        body: "Parents reach the class teacher or office through the app; messages route to the right role and are recorded against the student.",
      },
      {
        title: "Consent and permissions",
        body: "Trip consents, medical updates and photo permissions are collected as recorded responses, not paper slips.",
      },
      {
        title: "Escalation paths",
        body: "Unanswered or unresolved messages escalate to the coordinator or principal on rules the school sets.",
      },
    ],
    indiaSpecifics: [
      "Notifications on the app with fallbacks on channels Indian parents actually read.",
      "Apps, circulars and notifications designed for each family's preferred language; available languages confirmed in the proposal.",
      "Fee reminders that link to payment and record the acknowledgement.",
      "Multi-campus sending with trust-level oversight.",
      "Communication logs that help when a dispute or inspection asks what was communicated.",
    ],
    evaluation: [
      "Is every message attached to a student, class or event, or is it a broadcast list?",
      "Can the school see delivery and acknowledgement per parent?",
      "Do parents have a way to respond that reaches the right role?",
      "Are consents and permissions recorded as responses?",
      "Is communication on the same record as attendance, fees and results?",
    ],
    faqs: [
      {
        question: "Is the parent app included?",
        answer:
          "Yes. Parent and student apps are part of the licence, not a per-user add-on. App availability is confirmed during scoping.",
      },
      {
        question: "Can parents reply to messages?",
        answer:
          "Yes. Replies route to the right role, such as the class teacher or the office, and are recorded against the student.",
      },
      {
        question: "How do circular acknowledgements work?",
        answer:
          "A circular can require acknowledgement. The school sees who has read and acknowledged it, and follows up the rest as a task.",
      },
      {
        question: "Can communication be sent in more than one language?",
        answer:
          "Yes, that is the design: the parent and student apps, circulars and notifications are built so each family can use the language it is comfortable in, while the institution keeps one record. The languages available to your institution are confirmed in your proposal.",
      },
    ],
    related: [
      {
        href: blogHref("/parent-communication-schools/"),
        label: "Parent communication in schools",
        note: "Why broadcasts fail and what replaces them",
      },
      { href: "/ecosystem/", label: "Ecosystem", note: "The parent and student apps" },
      {
        href: "/school-attendance-management-system/",
        label: "Attendance",
        note: "The alerts parents receive most",
      },
      {
        href: "/fee-management-software-for-schools/",
        label: "Fee management",
        note: "Reminders that link to payment",
      },
      { href: "/contact/", label: "Contact", note: "Speak to the team" },
    ],
  },
  {
    slug: "school-management-software-for-icse-schools",
    keyword: "School management software for ICSE schools",
    metaTitle: "School Management Software for ICSE Schools",
    metaDescription:
      "School management software for ICSE and ISC schools: CISCE-aligned assessment, internal marks, report cards, registers and the records affiliation expects.",
    h1: "Configured for CISCE, from internal assessment to ISC.",
    lede: "ICSE and ISC schools carry a heavier internal-assessment load than most boards, with project work, practicals and continuous evaluation feeding the final record. SquareCampus holds the CISCE structure as configuration, so marks, moderation and report cards follow the board's shape without a spreadsheet beside them.",
    audience: [
      "ICSE school principals",
      "Examination in-charges",
      "Academic coordinators",
      "Administrators",
    ],
    definition: {
      title: "What should ICSE school management software include?",
      body: "School management software for ICSE schools should carry the CISCE assessment structure for ICSE and ISC, including internal assessment components, project and practical marks, and grading scales; produce report cards in the school's format; keep attendance registers and student records the way affiliation requires; and treat the board's registration and examination cycles as part of the academic year rather than as separate spreadsheets.",
    },
    workflows: [
      {
        title: "Internal assessment as configuration",
        body: "Components, weightages and grading scales for ICSE and ISC are configured per class and session; project and practical marks sit alongside written papers in one record.",
      },
      {
        title: "Marks, moderation and report cards",
        body: "Subject teachers enter marks for their allocation, moderation rules apply consistently, and report cards are produced in the school's CISCE-aligned format with every change attributed.",
      },
      {
        title: "Registration and examination records",
        body: "Student data required for board registration is kept complete from admission, so the annual export is a verification step.",
      },
      {
        title: "Attendance registers for affiliation",
        body: "Registers and percentages are produced from the daily record in the layouts an affiliation visit expects.",
      },
      {
        title: "Timetable, practicals and substitution",
        body: "Period allocation, laboratory sessions and substitutions run against the academic calendar, with cover visible to the coordinator.",
      },
    ],
    indiaSpecifics: [
      "ICSE and ISC assessment structures maintained as configuration, not a build per session.",
      "Report card formats per class group, including internal assessment and co-scholastic areas.",
      "Student master data kept complete for CISCE registration from the day of admission.",
      "Parent and student apps designed for the family's preferred language; available languages confirmed in the proposal.",
      "Fees, transport and communication on the same record as academics.",
    ],
    evaluation: [
      "Can internal assessment, project and practical marks live in the same record as written papers?",
      "Are ICSE and ISC grading scales configuration, or a custom build per session?",
      "Can report cards be produced without exporting marks to a spreadsheet?",
      "Is student master data complete enough for board registration without a data drive?",
      "Does academics share a record with fees and communication, or sit in its own module?",
    ],
    faqs: [
      {
        question: "Does SquareCampus support ICSE and ISC assessment?",
        answer:
          "Yes. Internal assessment components, project and practical marks, weightages and grading scales for ICSE and ISC are configured per class and session, and report cards are produced from them.",
      },
      {
        question: "Can a trust run ICSE and CBSE campuses on one system?",
        answer:
          "Yes. Campuses under different boards run on one trust with board-specific academic configuration per campus, and one view for leadership.",
      },
      {
        question: "How are report card formats handled?",
        answer:
          "Formats are configured per class group in the school's CISCE-aligned layout, including internal assessment and co-scholastic areas, and produced directly from the marks record.",
      },
      {
        question: "Will teachers need to learn a new grading workflow?",
        answer:
          "Marks entry follows the school's existing assessment structure. Role-based training during rollout covers the examination workflow end to end.",
      },
    ],
    related: [
      {
        href: blogHref("/board-specific-school-software/"),
        label: "Board-specific school software",
        note: "What differs between CBSE, ICSE and state boards",
      },
      {
        href: "/school-exam-management-software/",
        label: "Exam management",
        note: "The examination workflow in detail",
      },
      {
        href: "/school-management-software-for-cbse-schools/",
        label: "For CBSE schools",
        note: "The same platform, configured for CBSE",
      },
      {
        href: "/school-management-software-for-state-board-schools/",
        label: "For state-board schools",
        note: "State formats, languages and calendars",
      },
      {
        href: "/school-management-system/",
        label: "School management system",
        note: "The category page",
      },
    ],
  },
  {
    slug: "school-management-software-for-state-board-schools",
    keyword: "School management software for state board schools",
    metaTitle: "School Management Software for State Board Schools",
    metaDescription:
      "School management software for state-board schools in India: state formats and calendars, parents reached in their language, fees and registers on one record.",
    h1: "Your state's formats, your families' languages, one record.",
    lede: "State-board schools serve the widest range of families in India, and the office pays for it in translated circulars, hand-filled state registers and fee structures that follow local rules. SquareCampus is designed to carry state formats and calendars as configuration and to reach parents in the languages they read, while the institution keeps one governed record underneath.",
    audience: ["State-board school principals", "Administrators", "Class teachers", "Parents"],
    definition: {
      title: "What should state board school management software include?",
      body: "School management software for state-board schools should carry the state's assessment scheme, report formats, registers and academic calendar as configuration; communicate with parents in the languages they read; handle local fee rules, concessions and government scheme records; and keep attendance and student records in the shape district and board inspections expect, all on one record shared with fees and communication.",
    },
    workflows: [
      {
        title: "State assessment and report formats",
        body: "Grading schemes, report layouts and promotion rules for the state board are configured per class and session, and report cards follow from the marks record.",
      },
      {
        title: "Registers for inspection",
        body: "Attendance, admission and fee registers come out of the daily record in the layouts district and board inspections expect.",
      },
      {
        title: "Parent communication in families' languages",
        body: "Circulars, dues reminders, results and notices reach families in the language they read, with delivery and acknowledgement recorded against the student.",
      },
      {
        title: "Fees under local rules",
        body: "Fee structures, concessions and scheme-linked waivers follow the state's rules, with receipts and reconciliation on one ledger.",
      },
      {
        title: "Leadership view",
        body: "Principals and management see attendance, collections and exceptions across sections and campuses with an owner against each item.",
      },
    ],
    indiaSpecifics: [
      "State-board assessment schemes, report formats and calendars as configuration.",
      "Apps, circulars and notifications designed for each family's preferred language; available languages confirmed in the proposal.",
      "Scheme and concession records kept against the student for audits and claims.",
      "Registers in the layouts district inspections ask for.",
      "Trusts running state-board, CBSE and ICSE campuses on one system.",
    ],
    evaluation: [
      "Are the state's report formats and registers configuration, or a custom build?",
      "Can parents receive every notice in the language they read, with acknowledgement recorded?",
      "Do fee rules, concessions and scheme records live on the same ledger as collections?",
      "Can registers for inspection be produced from the daily record without re-typing?",
      "Does the vendor support the state boards you run, and say so in writing?",
    ],
    faqs: [
      {
        question: "Which state boards does SquareCampus support?",
        answer:
          "State-board assessment schemes, report formats and calendars are configuration. The boards an institution runs are confirmed during scoping and set up during rollout.",
      },
      {
        question: "Which languages are available for parents?",
        answer:
          "The parent and student apps, circulars and notifications are designed so each family can choose its language while the institution keeps one record. The languages available to your institution are confirmed in your proposal.",
      },
      {
        question: "Can we run a state-board school and a CBSE school under one trust?",
        answer:
          "Yes. Campuses under different boards run on one trust with board-specific configuration per campus and one leadership view.",
      },
      {
        question: "How are government scheme records handled?",
        answer:
          "Scheme eligibility, concessions and waivers are recorded against the student and reflected on the fee ledger, so claims and audits draw from one record.",
      },
    ],
    related: [
      {
        href: "/parent-communication-app-for-schools/",
        label: "Parent communication",
        note: "Messages in the family's language, with a record",
      },
      {
        href: "/fee-management-software-for-schools/",
        label: "Fee management",
        note: "Concessions and scheme rules on one ledger",
      },
      {
        href: "/school-management-software-for-cbse-schools/",
        label: "For CBSE schools",
        note: "The same platform, configured for CBSE",
      },
      {
        href: "/school-management-software-for-icse-schools/",
        label: "For ICSE schools",
        note: "The same platform, configured for CISCE",
      },
      {
        href: blogHref("/board-specific-school-software/"),
        label: "Board-specific school software",
        note: "What differs between the boards",
      },
    ],
  },
];

export const intentPageBySlug = (slug: string) => intentPages.find((page) => page.slug === slug);
