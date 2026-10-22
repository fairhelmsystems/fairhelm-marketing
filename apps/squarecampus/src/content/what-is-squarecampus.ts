/**
 * Canonical entity definition for /what-is-squarecampus.
 *
 * This is the page search engines and language models should resolve "what is
 * SquareCampus" against, so the wording here is deliberate and should not be
 * casually reworded. The ERP answer is intentionally nuanced: it neither
 * denies the record-and-workflow capabilities nor lets the product be reduced
 * to an ERP.
 */

import { multiCampusContrast, product } from "./commercial";

export const CANONICAL_DEFINITION =
  "SquareCampus is a School Operating System and institutional decision layer for schools, educational trusts and multi-campus groups in India. It includes the operational systems of record institutions expect, but its primary purpose is to connect recurring school cycles to ownership, exception handling, auditability and leadership decisions.";

/**
 * The four layers the platform is organised around.
 *
 * The order matters: outcome first, capabilities second. The capability list
 * is evidence that the backbone is complete — it is not the pitch.
 */
export const systemLayers = [
  {
    id: "record",
    name: "System of Record",
    outcome: "One shared school record.",
    body: "Students, staff, fees, attendance, assessments and documents live on one model, so a question has one answer rather than one answer per tool.",
    capabilities: [
      "Student, staff and guardian records",
      "Admissions and enrolment",
      "Timetable, attendance and assessment",
      "Fees, concessions and receipts",
      "Documents and institutional history",
    ],
  },
  {
    id: "workflow",
    name: "System of Workflow",
    outcome: "Work moves with an owner.",
    body: "Admissions, collections, results, approvals and parent concerns run as workflows with stages, owners and deadlines — not as tasks held in someone's memory.",
    capabilities: [
      "Stages, owners and deadlines per cycle",
      "Exception routing and escalation",
      "Approvals and overrides",
      "Parent and staff communication",
      "Transport, hostel and campus operations",
    ],
  },
  {
    id: "governance",
    name: "System of Governance",
    outcome: "Every exception is accountable.",
    body: "Policy, approval chains, role boundaries and audit history are institutional configuration, so exceptions escalate to a named desk and leave a trail.",
    capabilities: [
      "Role-based access and campus scope",
      "Trust and campus hierarchy",
      "Approval and governance chains",
      "Audit history and advanced audit exports",
      "Institutional identity: SquareCampus-managed sign-in, separately quoted Microsoft Entra ID single sign-on across plans, identity governance under Enterprise",
    ],
  },
  {
    id: "intelligence",
    name: "System of Intelligence",
    outcome: "Leadership sees what requires attention.",
    body: "AEGIS reads the governed operational context and returns permission-scoped, source-grounded answers about what changed, why it matters and who owns the response.",
    capabilities: [
      "Operational analytics and command views",
      "Threshold detection across cycles",
      "Permission-scoped, source-grounded answers",
      "Auditable question and answer history",
    ],
  },
] as const;

/**
 * Dashboard vs decision layer. Used to explain AEGIS without positioning it
 * as a chatbot.
 */
export const dashboardVsDecisionLayer = {
  dashboard: ["Attendance decreased", "Fees remain pending", "Reports are overdue"],
  decisionLayer: [
    "Which campus crossed the threshold",
    "When the deviation started",
    "Which workflow is blocked",
    "Who owns the response",
    "What evidence supports the conclusion",
    "What leadership should review next",
  ],
} as const;

export const AEGIS_DEFINITION =
  "AEGIS is the governed intelligence layer inside SquareCampus. It produces permission-scoped, source-grounded and auditable operational answers from institutional context.";

/** The same definition in plain language, for first-time readers (audit SC-015). */
export const AEGIS_PLAIN_DEFINITION =
  "AEGIS is the AI assistant inside SquareCampus. School leaders ask questions in plain language and get answers from their own school records, limited to what their role can already see. It suggests follow-ups; it does not change anything.";

/** V1 boundaries. These are constraints, not roadmap promises. */
export const aegisBoundaries = [
  "Read-only — AEGIS answers questions, it does not act on the institution's behalf",
  "RBAC-scoped — a person only ever sees what their role already permits",
  "Source-grounded — every answer points back to the records it came from",
  "Auditable — questions and answers are recorded like any other institutional action",
  "Human-controlled — decisions remain with the people accountable for them",
] as const;

/**
 * What the site means by its own vocabulary. Rendered as a glossary on
 * /what-is-squarecampus and emitted as DefinedTerm structured data, so a
 * term like "School OS" has factual content behind it rather than acting as
 * a synonym for ERP.
 */
export const glossary = [
  {
    term: "School Operating System (School OS)",
    definition:
      "The connected backbone an institution runs on. It holds the records a school expects, and it also carries the workflows, ownership, approvals, exceptions and audit history that turn those records into accountable day-to-day operations. The distinction from an ERP is factual: every cycle has stages, an owner and a deadline; every exception is routed to a named desk; every override is recorded with a reason.",
  },
  {
    term: "Governance",
    definition:
      "Policy, approval chains, role boundaries and audit history held as institutional configuration rather than as habits. A concession limit, a refund approval or a campus-level deviation from trust policy is defined once, enforced on every record, and visible to the people accountable for it.",
  },
  {
    term: "Exception ownership",
    definition:
      "When a record leaves its expected state (collections behind plan, attendance under a threshold, an approval overdue) the deviation becomes an exception with a named owner, a position and a due date, rather than a line in a report that someone may notice.",
  },
  {
    term: "Accountability",
    definition:
      "Every approval, override and closure is attributed to a role and a person, recorded with the reason, and kept on an append-only timeline. Leadership can see not only what happened but who decided it and on what basis.",
  },
  {
    term: "Institutional visibility",
    definition:
      "Leadership sees the current position of the institution from the records the campuses run on, without a department preparing a report first: what requires attention, why it matters, who owns it and what happens next.",
  },
  {
    term: "Multi-campus governance",
    definition:
      "More than supporting several campuses. Trust, school and campus are one hierarchy; policy is set once and executed locally; scope is a property of the role; exceptions and board views cross campuses without consolidation.",
  },
] as const;

export { multiCampusContrast };

export const entityFaqs = [
  {
    question: "Is SquareCampus an ERP?",
    answer: `Yes, in the sense buyers usually mean. ${product.categoryRelationship} "School OS" describes how it is built: school cycles, ownership, exceptions, governance and leadership visibility share one institutional model.`,
  },
  {
    question: "What is a School Operating System?",
    answer:
      "A School Operating System is the connected operating backbone an institution runs on. It holds the records a school expects, but it also carries the workflows, ownership, approvals, exceptions and audit history that turn those records into accountable day-to-day operations.",
  },
  {
    question: "What is an institutional decision layer?",
    answer:
      "A system of record stores what happened. A decision layer shows what requires attention, why it matters, who owns it, and what happens next. SquareCampus is built to do both, so leadership does not have to assemble context before acting.",
  },
  {
    question: "Who is SquareCampus built for?",
    answer:
      "Indian schools, educational trusts, church-run school groups and multi-campus institutions, and higher-education institutions as a governed layer over the systems they already run. It suits institutions that care about operational control, accountable ownership and leadership visibility — whether they run one campus or many. It is not designed for an institution that needs only basic attendance, fees and report cards at the lowest possible price.",
  },
  {
    question: "Is AEGIS a chatbot?",
    answer:
      "No. AEGIS is the governed intelligence layer inside SquareCampus. It produces permission-scoped, source-grounded and auditable operational answers from institutional context. It is read-only, constrained by the asker's existing role permissions, and does not take autonomous decisions.",
  },
  {
    question: "Can SquareCampus replace our existing school ERP?",
    answer:
      "Institutions commonly move to SquareCampus from a school ERP, a set of disconnected tools, or a mix of both. Migration scope, sequencing and how long the existing system runs alongside are agreed during discovery rather than assumed.",
  },
  {
    question: "What does SquareCampus mean by governance, exception ownership and accountability?",
    answer:
      "Governance is policy, approval chains, role boundaries and audit history held as institutional configuration. Exception ownership means a deviation from the expected state becomes a routed item with a named owner, a position and a due date. Accountability means every approval, override and closure is attributed to a person and a role, recorded with the reason, on an append-only timeline.",
  },
  {
    question: "How does multi-campus governance differ from supporting multiple campuses?",
    answer:
      "Supporting multiple campuses means the software can hold several campuses' records. Multi-campus governance means trust, school and campus are one hierarchy: policy is set once and executed locally with deviations recorded as exceptions, access scope is a property of the role, and exceptions and board views cross campuses from the same records without consolidation.",
  },
] as const;
