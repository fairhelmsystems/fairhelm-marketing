import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Connector,
  draw,
  Header,
  Label,
  Meta,
  Panel,
  rise,
  Stage,
  StatusChip,
  StepNumber,
  window_,
} from "../kit";
import { FONT, type MotionTheme, THEMES, type ThemeName, type as typeScale } from "../theme";

/**
 * EvidenceLedRollout
 *
 * One sentence: institutional change moves from diagnosis to a written
 * baseline, then runs in parallel with the current system, and only expands
 * once the agreed measure has been met.
 *
 * Two variants share every primitive but argue different things, so the two
 * pages that use them do not end up saying the same thing:
 *  - `rollout`  — the six-stage implementation sequence on /rollout/.
 *  - `founding` — the four-stage Founding Partner pilot on /launch-partners/.
 *
 * The founding variant must not imply that conversion is guaranteed: the
 * decision gate shows Convert, Extend and Stop with equal weight, and the
 * closing line is about evidence, not about signing.
 *
 * There is no title card. The last frame is the finished diagram with every
 * stage complete — that frame is also the poster, so it has to carry the
 * whole idea with no motion at all.
 */

export type RolloutVariant = "rollout" | "founding";

export type EvidenceLedRolloutProps = {
  theme: ThemeName;
  variant: RolloutVariant;
};

type Step = { n: string; title: string };

const STEPS: Record<RolloutVariant, Step[]> = {
  founding: [
    { n: "01", title: "Diagnose" },
    { n: "02", title: "Baseline" },
    { n: "03", title: "Run the pilot" },
    { n: "04", title: "Decide" },
  ],
  rollout: [
    { n: "01", title: "Blueprint" },
    { n: "02", title: "Migration" },
    { n: "03", title: "Training" },
    { n: "04", title: "Parallel run" },
    { n: "05", title: "Go-live" },
    { n: "06", title: "Adoption" },
  ],
};

const COPY: Record<RolloutVariant, { eyebrow: string; title: string }> = {
  // These titles must not repeat the DOM heading the figure sits under.
  // The founding variant previously read "Start with evidence. Expand when it
  // is earned." directly beneath an <h2> saying almost exactly that, and the
  // rollout variant repeated its page's <h1>. Both now say something the
  // surrounding copy does not.
  founding: {
    eyebrow: "Founding institutional partner",
    title: "One bottleneck. One baseline. One decision.",
  },
  rollout: {
    eyebrow: "Rollout model",
    title: "Sequenced around the calendar you actually run.",
  },
};

/** Beat windows in frames. The final beat never fades: it is the poster. */
const HOLD = 100000;
const BEATS: Record<RolloutVariant, { start: number; end: number }[]> = {
  founding: [
    { start: 16, end: 78 },
    { start: 74, end: 136 },
    { start: 132, end: 208 },
    { start: 204, end: HOLD },
  ],
  rollout: [
    { start: 16, end: 66 },
    { start: 62, end: 112 },
    { start: 108, end: 158 },
    { start: 154, end: 212 },
    { start: 208, end: 258 },
    { start: 254, end: HOLD },
  ],
};

export const rolloutDuration = (variant: RolloutVariant) => (variant === "founding" ? 276 : 324);

/** The persistent rail: where we are in the sequence, visible throughout. */
const Rail: React.FC<{ theme: MotionTheme; steps: Step[]; active: number; frame: number }> = ({
  theme,
  steps,
  active,
  frame,
}) => {
  const perRow = steps.length > 4 ? 3 : steps.length;
  const rows = steps.length > 4 ? [steps.slice(0, 3), steps.slice(3)] : [steps];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
      {rows.map((row, rowIndex) => (
        <div key={row[0].n} style={{ display: "flex", gap: 16 }}>
          {row.map((step, i) => {
            const index = rowIndex * perRow + i;
            const isActive = index === active;
            const isDone = index < active;
            return (
              <Panel
                key={step.n}
                theme={theme}
                state={isActive ? "active" : isDone ? "settled" : "resting"}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  gap: 2,
                  opacity: draw(frame, 10 + index * 3, 10),
                }}
              >
                <StepNumber theme={theme} n={step.n} active={isActive || isDone} />
                <Label theme={theme} size={34}>
                  {step.title}
                </Label>
              </Panel>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const StageBox: React.FC<{ children: React.ReactNode; opacity: number }> = ({
  children,
  opacity,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      opacity,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 16,
    }}
  >
    {children}
  </div>
);

/** Beat 1 — a trust with three campuses; exactly one exception is chosen. */
const DiagnoseStage: React.FC<{ theme: MotionTheme; frame: number; from: number }> = ({
  theme,
  frame,
  from,
}) => (
  <>
    <StatusChip theme={theme} tone="amber" style={rise(frame, from + 24)}>
      One bottleneck selected
    </StatusChip>
    <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
      <Panel theme={theme} style={{ width: 260, padding: "14px 20px", ...rise(frame, from) }}>
        <Label theme={theme} size={38}>
          Trust
        </Label>
        <Meta theme={theme}>Policy set once</Meta>
      </Panel>
      <div style={{ position: "relative", width: 56, flexShrink: 0 }}>
        <Connector
          theme={theme}
          progress={draw(frame, from + 8, 12)}
          style={{ left: 0, right: 0, top: "50%" }}
        />
      </div>
      <div style={{ display: "flex", flex: 1, gap: 14, minWidth: 0 }}>
        {["Campus A", "Campus B", "Campus C"].map((name, i) => (
          <Panel
            key={name}
            theme={theme}
            state={i === 1 ? "attention" : "resting"}
            style={{ flex: 1, padding: "14px 18px", ...rise(frame, from + 12 + i * 4) }}
          >
            <Label theme={theme} size={34} tone={i === 1 ? "amber" : "text"}>
              {name}
            </Label>
            <Meta theme={theme}>{i === 1 ? "Fee follow-up drifting" : "Within policy"}</Meta>
          </Panel>
        ))}
      </div>
    </div>
  </>
);

/** Beat 2 — the three things written down before any deployment. */
const BaselineStage: React.FC<{ theme: MotionTheme; frame: number; from: number }> = ({
  theme,
  frame,
  from,
}) => (
  <>
    <StatusChip theme={theme} tone="brand" style={rise(frame, from)}>
      Baseline written
    </StatusChip>
    <div style={{ display: "flex", gap: 16 }}>
      {[
        { t: "Current state", m: "Observed, not estimated" },
        { t: "Accountable owner", m: "A named person" },
        { t: "Success measure", m: "One agreed number" },
      ].map((item, i) => (
        <Panel
          key={item.t}
          theme={theme}
          state="active"
          style={{ flex: 1, padding: "14px 20px", ...rise(frame, from + 10 + i * 8) }}
        >
          <Label theme={theme} size={36}>
            {item.t}
          </Label>
          <Meta theme={theme}>{item.m}</Meta>
        </Panel>
      ))}
    </div>
  </>
);

/** Beat 3 — two lanes run at once, then reconcile. Never a rip-and-replace. */
const PilotStage: React.FC<{ theme: MotionTheme; frame: number; from: number }> = ({
  theme,
  frame,
  from,
}) => {
  const progress = draw(frame, from + 12, 40);
  return (
    <>
      <StatusChip theme={theme} tone="brand" style={rise(frame, from)}>
        60–90 day pilot
      </StatusChip>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
          {[
            { t: "Current system", m: "Keeps running" },
            { t: "SquareCampus", m: "Runs the same workflow" },
          ].map((lane, i) => (
            <Panel
              key={lane.t}
              theme={theme}
              state={i === 1 ? "active" : "resting"}
              style={{
                position: "relative",
                padding: "12px 20px",
                ...rise(frame, from + 6 + i * 6),
              }}
            >
              <Label theme={theme} size={36} tone={i === 1 ? "brand" : "muted"}>
                {lane.t}
              </Label>
              <Meta theme={theme}>{lane.m}</Meta>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  height: 4,
                  width: `${progress * 100}%`,
                  backgroundColor: i === 1 ? theme.brand : theme.lineStrong,
                }}
              />
            </Panel>
          ))}
        </div>
        <div style={{ position: "relative", width: 56, height: 4, flexShrink: 0 }}>
          <Connector
            theme={theme}
            progress={draw(frame, from + 40, 14)}
            strong
            style={{ left: 0, right: 0, top: 0 }}
          />
        </div>
        <Panel
          theme={theme}
          state="settled"
          style={{ width: 300, padding: "14px 20px", ...rise(frame, from + 44) }}
        >
          <Label theme={theme} size={36} tone="teal">
            One validated state
          </Label>
          <Meta theme={theme}>Numbers reconciled</Meta>
        </Panel>
      </div>
    </>
  );
};

/** Beat 4 — three outcomes, weighted equally. Conversion is not promised. */
const EvidenceStage: React.FC<{ theme: MotionTheme; frame: number; from: number }> = ({
  theme,
  frame,
  from,
}) => (
  <>
    <StatusChip theme={theme} tone="teal" style={rise(frame, from)}>
      Decided against the agreed measure
    </StatusChip>
    <div style={{ display: "flex", gap: 16 }}>
      {[
        { t: "Convert", m: "The measure was met" },
        { t: "Extend", m: "More evidence needed" },
        { t: "Stop", m: "It did not hold up" },
      ].map((outcome, i) => (
        <Panel
          key={outcome.t}
          theme={theme}
          state="settled"
          style={{ flex: 1, padding: "14px 20px", ...rise(frame, from + 10 + i * 7) }}
        >
          <Label theme={theme} size={38} tone="teal">
            {outcome.t}
          </Label>
          <Meta theme={theme}>{outcome.m}</Meta>
        </Panel>
      ))}
    </div>
    <div
      style={{
        fontFamily: FONT.body,
        fontSize: typeScale.body,
        color: theme.muted,
        ...rise(frame, from + 34),
      }}
    >
      Expansion follows the evidence, not the calendar.
    </div>
  </>
);

/** Rollout variant: one plain statement per stage. Calm, not busy. */
const ROLLOUT_STAGE_COPY = [
  { chip: "Mapped", t: "The institution as it actually runs", m: "Campus structure, approvals, cycles" },
  { chip: "Structured", t: "Active data moved with ownership", m: "Not an ad hoc import" },
  { chip: "Role-based", t: "Teams train on their own workflow", m: "Finance, academics, admissions, front desk" },
  { chip: "In parallel", t: "Both systems run until the numbers agree", m: "Confidence before dependence" },
  { chip: "Staged", t: "Go-live under guardrails", m: "Named escalation, monitored" },
  { chip: "Followed through", t: "Adoption measured after handover", m: "Where institutions usually regress" },
] as const;

const RolloutStage: React.FC<{
  theme: MotionTheme;
  frame: number;
  from: number;
  index: number;
}> = ({ theme, frame, from, index }) => {
  const item = ROLLOUT_STAGE_COPY[index];
  return (
    <>
      <StatusChip theme={theme} tone={index === 5 ? "teal" : "brand"} style={rise(frame, from)}>
        {item.chip}
      </StatusChip>
      <div style={{ ...rise(frame, from + 8) }}>
        <Label theme={theme} size={48}>
          {item.t}
        </Label>
        <Meta theme={theme}>{item.m}</Meta>
      </div>
    </>
  );
};

export const EvidenceLedRollout: React.FC<EvidenceLedRolloutProps> = ({ theme, variant }) => {
  const t = THEMES[theme];
  const frame = useCurrentFrame();
  const steps = STEPS[variant];
  const beats = BEATS[variant];
  const copy = COPY[variant];

  let active = 0;
  beats.forEach((b, i) => {
    if (frame >= b.start) {
      active = i;
    }
  });

  const stageFor = (index: number) => {
    const from = beats[index].start;
    if (variant === "rollout") {
      return <RolloutStage theme={t} frame={frame} from={from} index={index} />;
    }
    if (index === 0) return <DiagnoseStage theme={t} frame={frame} from={from} />;
    if (index === 1) return <BaselineStage theme={t} frame={frame} from={from} />;
    if (index === 2) return <PilotStage theme={t} frame={frame} from={from} />;
    return <EvidenceStage theme={t} frame={frame} from={from} />;
  };

  return (
    <Stage theme={t}>
      <Header theme={t} compact eyebrow={copy.eyebrow} title={copy.title} frame={frame} />

      <div style={{ flex: 1, position: "relative", minHeight: 0, marginBottom: 18 }}>
        {beats.map((beat, index) => (
          <StageBox key={beat.start} opacity={window_(frame, beat.start, beat.end, 7)}>
            {stageFor(index)}
          </StageBox>
        ))}
      </div>

      <Rail theme={t} steps={steps} active={active} frame={frame} />
    </Stage>
  );
};
