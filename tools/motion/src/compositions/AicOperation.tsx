import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import {
  aicScenarios,
  aicScenarioSummaries,
  aicStages,
  calculateScenario,
  formatInr,
  type AicScenario,
  type AicScenarioId,
  type ScenarioResult,
} from "@fairhelm/squarecampus-content/aic-walkthrough";

import {
  CANVAS,
  FONT,
  THEMES,
  type MotionTheme,
  type ThemeName,
} from "../theme";

export function aicOperationSegments(scenario: AicScenario) {
  let startFrame = 0;
  return aicStages.map((stage, index) => {
    const durationInFrames = Math.max(
      24,
      Math.round(
        ((scenario.stageDurationsMs[index] ?? 1800) * CANVAS.fps) / 1000,
      ),
    );
    const segment = { id: stage.id, startFrame, durationInFrames };
    startFrame += durationInFrames;
    return segment;
  });
}

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const progress = (p: number, start = 0, end = 0.7) =>
  interpolate(p, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
const entrance = (p: number, delay = 0) => ({
  opacity: progress(p, delay, delay + 0.35),
  transform: `translateY(${(1 - progress(p, delay, delay + 0.5)) * 22}px)`,
});
const campusNames = {
  north: "North",
  central: "Central",
  south: "South",
} as const;
const headings = [
  "",
  "Check access before reading records",
  "Apply this institution’s rules",
  "Approve one complete operation",
  "Read only the permitted records",
  "Find the comparable figures",
  "One dataset. Three views.",
  "One completed answer. One charge.",
];

type SceneProps = {
  scenario: AicScenario;
  result: ScenarioResult;
  theme: MotionTheme;
  p: number;
};

function Text({
  x,
  y,
  children,
  size = 38,
  color,
  weight = 400,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  color: string;
  weight?: number;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={size}
      fontWeight={weight}
      textAnchor={anchor}
    >
      {children}
    </text>
  );
}

function Rule({ y, theme }: { y: number; theme: MotionTheme }) {
  return <path d={`M48 ${y}H912`} stroke={theme.line} />;
}

function Request({ scenario, theme: t, p }: SceneProps) {
  const scope =
    scenario.id === "attendance-check"
      ? ["North Campus", "Class 8", "One term"]
      : scenario.id === "fee-reconciliation"
        ? ["Three campuses", "Overdue fees", "One as-of date"]
        : ["Three campuses", "Classes 9–10", "Two terms"];
  return (
    <g>
      <g style={entrance(p)}>
        <Text x={48} y={200} size={38} color={t.muted}>
          {scenario.role}
        </Text>
        <Text x={48} y={275} size={52} color={t.text} weight={500}>
          One question.
        </Text>
        <Text x={48} y={338} size={52} color={t.text} weight={500}>
          A bounded analytical objective.
        </Text>
      </g>
      <path
        d="M68 396V450H870"
        stroke={t.brandLine}
        strokeWidth={2}
        fill="none"
        strokeDasharray="860"
        strokeDashoffset={860 * (1 - progress(p, 0.1, 0.5))}
      />
      {scope.map((label, index) => (
        <g key={label} style={entrance(p, 0.12 + index * 0.08)}>
          <circle cx={68 + index * 296} cy={450} r={8} fill={t.brand} />
          <Text x={48 + index * 296} y={515} size={38} color={t.text}>
            {label}
          </Text>
        </g>
      ))}
      <Text x={48} y={610} size={38} color={t.muted}>
        Scope and definitions travel with the question.
      </Text>
    </g>
  );
}

function Access({ scenario, theme: t, p }: SceneProps) {
  return (
    <g>
      <g style={entrance(p)}>
        <rect
          x={48}
          y={194}
          width={300}
          height={300}
          rx={16}
          fill={t.brandSoft}
          stroke={t.brandLine}
        />
        <Text x={78} y={254} size={38} color={t.text} weight={500}>
          Role scope
        </Text>
        <Text x={78} y={318} size={38} color={t.muted}>
          Same tenant
        </Text>
        <Text x={78} y={368} size={38} color={t.muted}>
          Campus access
        </Text>
        <Text x={78} y={418} size={38} color={t.muted}>
          Minimum fields
        </Text>
      </g>
      {(["north", "central", "south"] as const).map((campus, index) => {
        const allowed = (
          scenario.scope.campusIds as readonly string[]
        ).includes(campus);
        const y = 218 + index * 118;
        return (
          <g key={campus} style={entrance(p, 0.1 + index * 0.08)}>
            <path
              d={`M348 344H392V${y + 35}H440`}
              stroke={allowed ? t.teal : t.lineStrong}
              strokeWidth={2}
              fill="none"
              strokeDasharray="300"
              strokeDashoffset={
                300 * (1 - progress(p, 0.12 + index * 0.05, 0.6))
              }
            />
            <rect
              x={440}
              y={y}
              width={472}
              height={76}
              rx={12}
              fill={allowed ? t.panel : t.panelAlt}
              stroke={allowed ? t.teal : t.lineStrong}
            />
            <Text x={464} y={y + 47} size={38} color={t.text}>
              {campusNames[campus]}
            </Text>
            <Text
              x={890}
              y={y + 47}
              size={38}
              anchor="end"
              color={allowed ? t.teal : t.muted}
            >
              {allowed ? "Permitted" : "Excluded"}
            </Text>
          </g>
        );
      })}
      <Text x={48} y={604} size={38} color={t.muted}>
        Out-of-scope records are excluded.
      </Text>
    </g>
  );
}

function Policies({ scenario, theme: t, p }: SceneProps) {
  const rules =
    scenario.id === "attendance-check"
      ? [
          [`${scenario.policy.thresholdPercent}%`, "Compare strictly below"],
          [
            String(scenario.students[0].eligibleSessions),
            "Sessions after exclusions",
          ],
          [
            `= ${scenario.policy.thresholdPercent}%`,
            "Exact threshold is excluded",
          ],
        ]
      : scenario.id === "fee-reconciliation"
        ? [
            ["> 30 days", "Overdue charges only"],
            ["Approved", "Deduct approved concessions"],
            ["Allocated", "Deduct allocated receipts"],
          ]
        : [
            [
              `North ${scenario.policy.campusAttendanceThresholdPercent.north}%`,
              "Campus attendance minimum",
            ],
            [
              `Central ${scenario.policy.campusAttendanceThresholdPercent.central}%`,
              "Use each campus’s own rule",
            ],
            [
              `South ${scenario.policy.campusAttendanceThresholdPercent.south}%`,
              `Marks decline ≥ ${scenario.policy.minimumMarksDeclinePoints} points`,
            ],
          ];
  return (
    <g>
      {rules.map(([value, label], index) => (
        <g key={value} style={entrance(p, index * 0.08)}>
          <Text
            x={48}
            y={224 + index * 130}
            size={44}
            color={t.brandInk}
            weight={500}
          >
            {value}
          </Text>
          <Text x={348} y={218 + index * 130} size={38} color={t.text}>
            {label}
          </Text>
          <path d={`M48 ${254 + index * 130}H912`} stroke={t.line} />
        </g>
      ))}
      <Text x={48} y={622} size={38} color={t.muted}>
        Resolve the rule before comparing the numbers.
      </Text>
    </g>
  );
}

function Approval({ scenario, theme: t, p }: SceneProps) {
  return (
    <g>
      <g style={entrance(p)}>
        <Text x={48} y={208} size={38} color={t.muted}>
          {scenario.scope.campusIds.length === 1
            ? "One permitted campus"
            : "Three permitted campuses"}
        </Text>
        <Text x={48} y={284} size={56} color={t.text} weight={500}>
          One objective.
        </Text>
        <Text x={48} y={352} size={56} color={t.text} weight={500}>
          One quoted AIC charge.
        </Text>
        <Text x={48} y={416} size={38} color={t.muted}>
          Table, chart, summary and first render.
        </Text>
      </g>
      <path d="M48 506H912" stroke={t.lineStrong} strokeWidth={2} />
      <g style={entrance(p, 0.12)}>
        <rect
          x={385}
          y={462}
          width={190}
          height={88}
          rx={44}
          fill={t.brandSoft}
          stroke={t.brandLine}
        />
        <Text
          x={480}
          y={516}
          size={38}
          color={t.brandInk}
          anchor="middle"
          weight={500}
        >
          Approval
        </Text>
      </g>
      <Text x={48} y={615} size={38} color={t.text}>
        Records are read after the quote is approved.
      </Text>
    </g>
  );
}

function Attendance({
  scenario,
  result,
  theme: t,
  p,
  analysing,
}: SceneProps & { analysing: boolean }) {
  if (scenario.id !== "attendance-check") return null;
  const barX = 306;
  return (
    <g>
      <Text x={48} y={180} size={38} color={t.muted}>
        Student
      </Text>
      <Text x={barX} y={180} size={38} color={t.muted}>
        {analysing ? "Attendance" : "Attended / eligible sessions"}
      </Text>
      {scenario.students.map((student, index) => {
        const percent =
          (student.attendedSessions * 100) / student.eligibleSessions;
        const matches = percent < scenario.policy.thresholdPercent;
        const y = 234 + index * 84;
        return (
          <g
            key={student.id}
            style={analysing ? undefined : entrance(p, index * 0.06)}
          >
            <Text x={48} y={y + 17} size={38} color={t.text}>
              {student.label}
            </Text>
            {analysing ? (
              <g>
                <g transform={`translate(${barX} ${y - 15})`}>
                  <rect
                    width={percent * 5.5}
                    height={42}
                    rx={7}
                    fill={matches ? t.brand : t.lineStrong}
                    transform={`scale(${progress(p, 0.08 + index * 0.05, 0.8)} 1)`}
                  />
                </g>
                <Text
                  x={barX + (906 - barX) * progress(p, 0, 0.8)}
                  y={y + 17}
                  size={38}
                  color={matches ? t.text : t.muted}
                  anchor="end"
                >
                  {percent}%
                </Text>
              </g>
            ) : (
              <Text
                x={barX}
                y={y + 17}
                size={42}
                color={t.brandInk}
                weight={500}
              >
                {student.attendedSessions} / {student.eligibleSessions}
              </Text>
            )}
            <path d={`M48 ${y + 40}H912`} stroke={t.line} />
          </g>
        );
      })}
      {analysing && (
        <g opacity={progress(p, 0.25, 0.7)}>
          <path
            d={`M${barX + scenario.policy.thresholdPercent * 5.5} 202V532`}
            stroke={t.teal}
            strokeWidth={2}
            strokeDasharray="7 7"
          />
          <Text x={48} y={607} size={38} color={t.teal}>
            {result.matchedIds.length} qualify. Exactly{" "}
            {scenario.policy.thresholdPercent}% stays outside the result.
          </Text>
        </g>
      )}
    </g>
  );
}

function Fees({
  scenario,
  result,
  theme: t,
  p,
  analysing,
}: SceneProps & { analysing: boolean }) {
  if (scenario.id !== "fee-reconciliation") return null;
  return (
    <g>
      {scenario.campuses.map((campus, index) => {
        const row = result.rows[index];
        const x = 48 + index * 296;
        return (
          <g
            key={campus.id}
            style={analysing ? undefined : entrance(p, index * 0.08)}
          >
            <Text x={x} y={198} size={38} color={t.text} weight={500}>
              {campusNames[campus.id]}
            </Text>
            <Text x={x} y={252} size={38} color={t.muted}>
              {formatInr(campus.eligibleChargesPaise)}
            </Text>
            <Text x={x} y={299} size={38} color={t.muted}>
              − {formatInr(campus.approvedConcessionsPaise)}
            </Text>
            <Text x={x} y={346} size={38} color={t.muted}>
              − {formatInr(campus.allocatedReceiptsPaise)}
            </Text>
            <path d={`M${x} 374H${x + 250}`} stroke={t.lineStrong} />
            {analysing && (
              <g style={entrance(p, 0.25 + index * 0.07)}>
                <Text x={x} y={433} size={42} color={t.brandInk} weight={500}>
                  {row.cells[4]}
                </Text>
                <g transform={`translate(${x} 462)`}>
                  <rect
                    width={
                      (250 * result.bars[index].value) / result.bars[0].value
                    }
                    height={18}
                    rx={5}
                    fill={t.brand}
                    transform={`scale(${progress(p, 0.3, 0.9)} 1)`}
                  />
                </g>
              </g>
            )}
          </g>
        );
      })}
      <Rule y={520} theme={t} />
      <Text x={48} y={566} size={38} color={t.muted}>
        Pending concession {formatInr(scenario.pendingConcessionsPaise)} is
        excluded.
      </Text>
      <Text x={48} y={618} size={38} color={analysing ? t.teal : t.muted}>
        {analysing
          ? `Outstanding total ${formatInr(result.totalPaise ?? 0)}`
          : "Charges − concessions − receipts"}
      </Text>
    </g>
  );
}

function PolicyReview({
  scenario,
  result,
  theme: t,
  p,
  analysing,
}: SceneProps & { analysing: boolean }) {
  if (scenario.id !== "policy-aware-review") return null;
  if (!analysing)
    return (
      <g>
        {result.rows.map((row, index) => (
          <g key={row.id} style={entrance(p, index * 0.04)}>
            <Text x={48} y={207 + index * 76} size={38} color={t.text}>
              {row.cells[0]}
            </Text>
            <Text x={350} y={207 + index * 76} size={38} color={t.brandInk}>
              {row.cells[1]} attendance
            </Text>
            <Text
              x={912}
              y={207 + index * 76}
              size={38}
              color={t.muted}
              anchor="end"
            >
              {row.cells[3]}
            </Text>
            <path d={`M48 ${229 + index * 76}H912`} stroke={t.line} />
          </g>
        ))}
        <Text x={48} y={623} size={38} color={t.muted}>
          Comparable terms and the correct campus rule.
        </Text>
      </g>
    );
  const zeroX = 160 + (600 * 12) / 16;
  const thresholdY = 550 - (330 * 10) / 18;
  return (
    <g>
      <rect
        x={160}
        y={220}
        width={zeroX - 160}
        height={thresholdY - 220}
        fill={t.tealSoft}
      />
      <path
        d="M160 220V550H790"
        stroke={t.lineStrong}
        strokeWidth={2}
        fill="none"
      />
      <path
        d={`M${zeroX} 220V550M160 ${thresholdY}H790`}
        stroke={t.teal}
        strokeWidth={2}
        strokeDasharray="6 7"
      />
      <Text x={160} y={190} size={38} color={t.muted}>
        Marks decline in points
      </Text>
      <Text x={160} y={637} size={38} color={t.muted}>
        Attendance margin, percentage points
      </Text>
      <Text x={148} y={thresholdY + 9} size={38} color={t.muted} anchor="end">
        10
      </Text>
      <Text x={zeroX} y={582} size={38} color={t.muted} anchor="middle">
        0
      </Text>
      {result.rows
        .filter((row) => row.metrics && row.metrics.declinePoints !== null)
        .map((row, index) => {
          const metrics = row.metrics!;
          const x =
            160 +
            ((metrics.attendancePercent - metrics.thresholdPercent + 12) / 16) *
              600;
          const y = 550 - ((metrics.declinePoints ?? 0) / 18) * 330;
          const matches = row.finding === "match";
          const lowerLabel = row.id === "south-9a";
          const q = progress(p, index * 0.07, 0.7);
          return (
            <g
              key={row.id}
              opacity={q}
              transform={`translate(${x} ${550 + (y - 550) * q})`}
            >
              <circle r={matches ? 11 : 8} fill={matches ? t.teal : t.muted} />
              {lowerLabel && (
                <path
                  d="M0 13V38L-10 44"
                  fill="none"
                  stroke={t.teal}
                  strokeWidth={2}
                />
              )}
              <Text
                x={
                  matches
                    ? -10
                    : metrics.attendancePercent === metrics.thresholdPercent
                      ? -18
                      : 18
                }
                y={
                  lowerLabel
                    ? 78
                    : matches ||
                        metrics.attendancePercent === metrics.thresholdPercent
                      ? -20
                      : 30
                }
                size={38}
                color={t.text}
                anchor={
                  matches ||
                  metrics.attendancePercent === metrics.thresholdPercent
                    ? "end"
                    : "start"
                }
              >
                {row.cells[0]}
              </Text>
            </g>
          );
        })}
      <Text x={48} y={692} size={38} color={t.muted}>
        South 10B needs previous-term marks.
      </Text>
    </g>
  );
}

function Answer({
  scenario,
  result,
  theme: t,
  p,
  delivered,
}: SceneProps & { delivered: boolean }) {
  const rows =
    scenario.id === "policy-aware-review"
      ? result.rows.filter((row) => row.finding === "match")
      : result.rows;
  const values = rows.map((row) =>
    scenario.id === "fee-reconciliation"
      ? row.cells[4]
      : scenario.id === "policy-aware-review"
        ? `${row.cells[1]} / ${row.cells[2]}`
        : row.cells[1],
  );
  const maximum = Math.max(...result.bars.map((bar) => bar.value), 1);
  return (
    <g>
      <Text x={48} y={181} size={38} color={t.muted}>
        Table
      </Text>
      <Text x={570} y={181} size={38} color={t.muted}>
        {scenario.id === "policy-aware-review" ? "Attendance / rule" : "Chart"}
      </Text>
      {rows.map((row, index) => {
        const y = 245 + index * 81;
        const bar = result.bars[index];
        const size = bar
          ? (bar.value / maximum) * 300
          : ((row.metrics?.attendancePercent ?? 0) / 100) * 300;
        return (
          <g key={row.id} style={entrance(p, index * 0.08)}>
            <Text x={48} y={y} size={38} color={t.text}>
              {row.cells[0]}
            </Text>
            <Text x={492} y={y} size={38} color={t.brandInk} anchor="end">
              {values[index]}
            </Text>
            <path d={`M48 ${y + 24}H510`} stroke={t.line} />
            <g transform={`translate(570 ${y - 28})`}>
              <rect
                width={size}
                height={32}
                rx={6}
                fill={t.brand}
                transform={`scale(${progress(p, 0.15 + index * 0.05, 0.75)} 1)`}
              />
              {row.metrics && (
                <path
                  d={`M${row.metrics.thresholdPercent * 3} -7V39`}
                  stroke={t.teal}
                  strokeWidth={3}
                />
              )}
            </g>
          </g>
        );
      })}
      {scenario.id === "policy-aware-review" && (
        <g opacity={progress(p, 0.2, 0.7)}>
          <Text x={48} y={432} size={38} color={t.muted}>
            South 10B
          </Text>
          <Text x={912} y={432} size={38} color={t.muted} anchor="end">
            Previous-term marks needed
          </Text>
        </g>
      )}
      <g style={entrance(p, 0.22)}>
        <Rule y={510} theme={t} />
        <Text x={48} y={557} size={38} color={t.text} weight={500}>
          {scenario.id === "attendance-check"
            ? `${result.matchedIds.length} students below the selected threshold`
            : scenario.id === "fee-reconciliation"
              ? `${formatInr(result.totalPaise ?? 0)} outstanding across three campuses`
              : `${result.matchedIds.length} cohorts match both conditions`}
        </Text>
        <Text x={48} y={604} size={38} color={t.muted}>
          {scenario.id === "policy-aware-review"
            ? "Missing marks stay visible. People decide."
            : "The same analysed records produce every view."}
        </Text>
      </g>
      {delivered && (
        <g opacity={progress(p, 0.25, 0.8)}>
          <path d="M48 647H912" stroke={t.teal} />
          <Text x={48} y={690} size={38} color={t.teal}>
            One operation. Its accepted quote settles once.
          </Text>
        </g>
      )}
    </g>
  );
}

export const AicOperation: React.FC<{
  theme: ThemeName;
  scenarioId: AicScenarioId;
}> = ({ theme, scenarioId }) => {
  const t = THEMES[theme];
  const frame = useCurrentFrame();
  const scenario =
    aicScenarios.find((item) => item.id === scenarioId) ?? aicScenarios[0];
  const result = calculateScenario(scenario);
  const segments = aicOperationSegments(scenario);
  const index = Math.max(
    0,
    segments.findIndex(
      (segment) => frame < segment.startFrame + segment.durationInFrames,
    ),
  );
  const segment = segments[index];
  const p =
    (frame - segment.startFrame) / Math.max(1, segment.durationInFrames - 1);
  const props = { scenario, result, theme: t, p };
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 960 720"
      style={{ fontFamily: FONT.body }}
    >
      <rect width={960} height={720} fill={t.bg} />
      <Text x={48} y={43} size={38} color={t.muted}>
        {scenario.label} — authored sample
      </Text>
      <Text x={48} y={101} size={40} color={t.text} weight={500}>
        {index === 0 ? aicScenarioSummaries[scenario.id] : headings[index]}
      </Text>
      <Rule y={130} theme={t} />
      {index === 0 && <Request {...props} />}
      {index === 1 && <Access {...props} />}
      {index === 2 && <Policies {...props} />}
      {index === 3 && <Approval {...props} />}
      {(index === 4 || index === 5) && (
        <>
          <Attendance {...props} analysing={index === 5} />
          <Fees {...props} analysing={index === 5} />
          <PolicyReview {...props} analysing={index === 5} />
        </>
      )}
      {(index === 6 || index === 7) && (
        <Answer {...props} delivered={index === 7} />
      )}
    </svg>
  );
};
