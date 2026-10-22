/**
 * The everyday school workflows, stated once (audit SC-006, SC-008, SC-011,
 * SC-042).
 *
 * Rendered as cards on the homepage (straight after the hero) and at the top
 * of /platform/, each linking to the solution page that answers the same task
 * in depth. The wording restates what those solution pages already say; it
 * adds no capability. Availability is qualified beside every rendering by
 * AvailabilityNote (content/commercial.ts › availability).
 */
export type Workflow = {
  id: string;
  title: string;
  /** What the school team does. */
  task: string;
  /** What they get at the end of it. */
  result: string;
  href: string;
  /** Descriptive anchor text for the solution page. */
  linkLabel: string;
};

export const workflows: readonly Workflow[] = [
  {
    id: "admissions",
    title: "Admission to enrolment",
    task: "Enquiries, applications, documents and offers move through stages, with an owner at each step.",
    result:
      "An accepted offer becomes the student record that attendance, fees and communication use.",
    href: "/school-admission-management-software/",
    linkLabel: "Admission management",
  },
  {
    id: "attendance",
    title: "Attendance to follow-up",
    task: "Teachers mark class or period attendance; absences and patterns are flagged for follow-up.",
    result: "Guardians are informed, and each exception has an owner until it is resolved.",
    href: "/school-attendance-management-system/",
    linkLabel: "Attendance management",
  },
  {
    id: "fees",
    title: "Fees to reconciliation",
    task: "Fee plans, concessions and reminders follow the institution's rules; payments from every channel post to one ledger.",
    result:
      "Receipts and reconciliation sit on the same record, with approvals and refunds on the audit trail.",
    href: "/fee-management-software-for-schools/",
    linkLabel: "Fee management",
  },
  {
    id: "exams",
    title: "Exams to results",
    task: "Datesheet, marks entry and moderation run as handovers between named roles.",
    result: "Report cards come from the marks entered, and every change is recorded.",
    href: "/school-exam-management-software/",
    linkLabel: "Exam and results management",
  },
  {
    id: "communication",
    title: "Notice to acknowledgement",
    task: "Circulars, reminders and notices are addressed from the student record, in the family's language where supported.",
    result:
      "Delivery and acknowledgement are recorded against the student; replies reach a named owner.",
    href: "/parent-communication-app-for-schools/",
    linkLabel: "Parent communication",
  },
  {
    id: "multi-campus",
    title: "Campus to leadership view",
    task: "Policy is set once at trust level and carried out by each campus, with local variation where allowed.",
    result: "Leadership sees every campus from the records the campuses run on.",
    href: "/multi-campus-school-management-software/",
    linkLabel: "Multi-campus management",
  },
];
