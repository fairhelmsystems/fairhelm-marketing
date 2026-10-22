/**
 * Pain-to-remedy content model.
 *
 * The marketing site sells remedies to institutional pain, not a module
 * inventory. Every entry follows the same structure so the pattern stays
 * consistent wherever it is rendered:
 *
 *   operational pain → hidden cost → remedy → accountable owner → pilot measure
 *
 * RULE OF THIS FILE: `measure` describes what a pilot would measure, never a
 * result SquareCampus has achieved. No percentages, savings or outcomes.
 */

export type OperationalPain = {
  id: string;
  /** The recurring cycle this pain belongs to. */
  area: string;
  pain: string;
  hiddenCost: string;
  remedy: string;
  owner: string;
  measure: string;
};

export const operationalPains: readonly OperationalPain[] = [
  {
    id: "fee-reconciliation",
    area: "Fee reconciliation",
    pain: "Collection records, bank statements and spreadsheets each hold part of the picture.",
    hiddenCost:
      "Finance spends the first week of every cycle rebuilding a number that should already exist.",
    remedy:
      "One governed fee cycle carrying reconciliation state, ownership and escalation on the same record.",
    owner: "Finance lead, with escalation to the trust office",
    measure: "Time from collection close to a reconciled, signed-off position.",
  },
  {
    id: "attendance-drift",
    area: "Attendance drift",
    pain: "Patterns are noticed once they have already become a term-level problem.",
    hiddenCost:
      "Intervention happens after the point where it would have changed the outcome for the student.",
    remedy:
      "Threshold-based detection, routed ownership and follow-up recorded against the student record.",
    owner: "Class teacher, escalating to the head of section",
    measure: "Days between a threshold breach and a recorded follow-up.",
  },
  {
    id: "report-cycle",
    area: "Report-cycle delay",
    pain: "Compilation, correction, approval and publication collapse into the same fortnight.",
    hiddenCost: "Senior staff are pulled into chasing rather than reviewing, every single cycle.",
    remedy: "Explicit stages, named owners, deadlines and exceptions that block publication.",
    owner: "Examination officer, with principal approval",
    measure: "Elapsed days across the full result cycle, and the number of blocked stages.",
  },
  {
    id: "parent-escalation",
    area: "Parent escalation",
    pain: "Commitments live inside calls, messages and individual staff memory.",
    hiddenCost:
      "The institution cannot answer what was promised, by whom, or whether it was ever closed.",
    remedy: "Acknowledgement, ownership, response expectation, closure and institutional history.",
    owner: "Front office, escalating to the campus head",
    measure: "Proportion of raised concerns with a recorded owner and a recorded closure.",
  },
  {
    id: "multi-campus-visibility",
    area: "Multi-campus visibility",
    pain: "Leadership waits for reporting packs that are stitched together by hand.",
    hiddenCost:
      "Every review starts by arguing about whose numbers are correct instead of what to do.",
    remedy: "Current campus state, shared definitions and a governed roll-up to the trust view.",
    owner: "Trust operations, with campus heads accountable locally",
    measure: "Time from request to a trusted cross-campus position.",
  },
  {
    id: "institutional-dependence",
    area: "Dependence on individuals",
    pain: "Processes survive because particular people remember how they work.",
    hiddenCost: "A resignation, a transfer or a long absence quietly becomes an operational risk.",
    remedy: "Workflow memory, recorded ownership, escalation paths and documented continuity.",
    owner: "Process owner, defined in the institution's role model",
    measure: "Proportion of recurring cycles with a defined owner and a documented path.",
  },
  {
    id: "decision-latency",
    area: "Decision latency",
    pain: "Leaders spend their time assembling context before they can decide anything.",
    hiddenCost:
      "The institution reacts at the speed of its reporting, not the speed of its problems.",
    remedy: "Governed operational context with an explicit next-action layer behind it.",
    owner: "Principal or trustee, depending on the decision",
    measure: "Time from a signal appearing to a decision being recorded.",
  },
] as const;

/** The pains surfaced on the homepage. The rest live on the platform page. */
export const homepagePainIds = [
  "fee-reconciliation",
  "attendance-drift",
  "report-cycle",
  "decision-latency",
] as const;

export const CANONICAL_PROMISE =
  "SquareCampus helps school leadership know what requires attention today, who owns it, and what happens next.";

export const CANONICAL_CATEGORY =
  "SquareCampus is a School Operating System and institutional decision layer for schools and educational trusts.";

export const RECORD_VS_DECISION =
  "A system of record stores what happened. A decision layer shows what requires attention, why it matters, who owns it, and what happens next.";
