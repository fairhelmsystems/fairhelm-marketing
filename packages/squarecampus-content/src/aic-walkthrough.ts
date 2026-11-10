import { aicWalkthroughFixture } from "./aic-walkthrough-fixture";
export { aicWalkthroughFixture, aicScenarioSummaries } from "./aic-walkthrough-fixture";
import { formatInr } from "./format-inr";
export { formatInr } from "./format-inr";

export const aicScenarios = aicWalkthroughFixture.scenarios;
export type AicScenario = (typeof aicScenarios)[number];
export type AicScenarioId = AicScenario["id"];
export type AicStage = (typeof aicWalkthroughFixture.stageOrder)[number];
export const aicStages: { id: AicStage; label: string; caption: string }[] = [
  { id: "understand", label: "Request", caption: "One question becomes a bounded objective." },
  {
    id: "access",
    label: "Access",
    caption: "Check the role, campuses and fields before reading records.",
  },
  {
    id: "knowledge",
    label: "School policies",
    caption: "Resolve the definitions and effective rules for this question.",
  },
  {
    id: "approval",
    label: "Scope and quote",
    caption: "Confirm the scope and AIC quote before execution.",
  },
  {
    id: "records",
    label: "Permitted records",
    caption: "Read only the records within the approved scope.",
  },
  {
    id: "analyse",
    label: "Analysis",
    caption: "Calculate comparable figures and validate the evidence.",
  },
  {
    id: "format",
    label: "Table and chart",
    caption: "The same analysed data becomes the table, chart and summary.",
  },
  {
    id: "deliver",
    label: "Complete answer",
    caption: "Deliver the validated answer. Settle the approved charge once.",
  },
];

export type ScenarioResult = {
  columns: string[];
  rows: {
    id: string;
    cells: string[];
    finding: "match" | "outside" | "incomplete";
    metrics?: { attendancePercent: number; thresholdPercent: number; declinePoints: number | null };
  }[];
  matchedIds: string[];
  incompleteIds: string[];
  summary: string;
  bars: { label: string; value: number; display: string }[];
  totalPaise?: number;
  footer?: string[];
};

const percent = (attended: number, eligible: number) =>
  `${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format((attended * 100) / eligible)}%`;

export function calculateScenario(scenario: AicScenario): ScenarioResult {
  if (scenario.id === "attendance-check") {
    const matched = scenario.students.filter(
      (student) =>
        student.attendedSessions * 100 < scenario.policy.thresholdPercent * student.eligibleSessions
    );
    return {
      columns: ["Student", "Attendance"],
      rows: matched.map((student) => ({
        id: student.id,
        cells: [student.label, percent(student.attendedSessions, student.eligibleSessions)],
        finding: "match",
      })),
      matchedIds: matched.map((student) => student.id),
      incompleteIds: [],
      summary: `${matched.length} sample students are below the selected ${scenario.policy.thresholdPercent}% threshold.`,
      bars: matched.map((student) => ({
        label: student.label,
        value: student.attendedSessions / student.eligibleSessions,
        display: percent(student.attendedSessions, student.eligibleSessions),
      })),
    };
  }
  if (scenario.id === "fee-reconciliation") {
    const campuses = scenario.campuses.map((campus) => ({
      ...campus,
      outstandingPaise:
        campus.eligibleChargesPaise -
        campus.approvedConcessionsPaise -
        campus.allocatedReceiptsPaise,
    }));
    const totalPaise = campuses.reduce((sum, campus) => sum + campus.outstandingPaise, 0);
    const largest = campuses.reduce((previous, campus) =>
      campus.outstandingPaise > previous.outstandingPaise ? campus : previous
    );
    return {
      columns: [
        "Campus",
        "Eligible charges",
        "Approved concessions",
        "Allocated receipts",
        "Outstanding",
      ],
      rows: campuses.map((campus) => ({
        id: campus.id,
        finding: "match",
        cells: [
          campus.label,
          formatInr(campus.eligibleChargesPaise),
          formatInr(campus.approvedConcessionsPaise),
          formatInr(campus.allocatedReceiptsPaise),
          formatInr(campus.outstandingPaise),
        ],
      })),
      matchedIds: campuses.map((campus) => campus.id),
      incompleteIds: [],
      totalPaise,
      summary: `The sample outstanding balance is ${formatInr(totalPaise)}. ${largest.label} has the largest share at ${formatInr(largest.outstandingPaise)}.`,
      footer: [
        "Total",
        ...(
          [
            "eligibleChargesPaise",
            "approvedConcessionsPaise",
            "allocatedReceiptsPaise",
            "outstandingPaise",
          ] as const
        ).map((key) => formatInr(campuses.reduce((sum, campus) => sum + campus[key], 0))),
      ],
      bars: campuses.map((campus) => ({
        label: campus.label,
        value: campus.outstandingPaise,
        display: formatInr(campus.outstandingPaise),
      })),
    };
  }
  const rows = scenario.cohorts.map((cohort) => {
    const eligible = cohort.scheduledSessions - cohort.excludedSessions;
    const threshold = scenario.policy.campusAttendanceThresholdPercent[cohort.campusId];
    const below = cohort.attendedSessions * 100 < threshold * eligible;
    const decline =
      cohort.previousAverageMarks === null
        ? null
        : cohort.previousAverageMarks - cohort.currentAverageMarks;
    const matches =
      below && decline !== null && decline >= scenario.policy.minimumMarksDeclinePoints;
    const finding = decline === null ? "incomplete" : matches ? "match" : "outside";
    const explanation =
      decline === null
        ? "Previous-term marks missing"
        : matches
          ? "Matches both conditions"
          : cohort.attendedSessions * 100 === threshold * eligible
            ? "Exact attendance threshold, excluded"
            : "Attendance condition not met";
    return {
      id: cohort.id,
      finding,
      metrics: {
        attendancePercent: (cohort.attendedSessions * 100) / eligible,
        thresholdPercent: threshold,
        declinePoints: decline,
      },
      cells: [
        cohort.label,
        percent(cohort.attendedSessions, eligible),
        `${threshold}%`,
        decline === null ? "Unavailable" : `−${decline} points`,
        explanation,
      ],
    } as ScenarioResult["rows"][number];
  });
  return {
    columns: ["Cohort", "Attendance", "Required", "Marks change", "Finding"],
    rows,
    matchedIds: rows.filter((row) => row.finding === "match").map((row) => row.id),
    incompleteIds: rows.filter((row) => row.finding === "incomplete").map((row) => row.id),
    summary:
      "Two sample cohorts match both conditions. One additional cohort needs previous-term marks before it can be compared.",
    bars: [],
  };
}
