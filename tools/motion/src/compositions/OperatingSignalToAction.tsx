import React from "react";
import { useCurrentFrame } from "remotion";
import { draw, Header, Label, Panel, rise, Stage, StatusChip, StepNumber } from "../kit";
import { FONT, THEMES, type ThemeName, type as typeScale } from "../theme";

/**
 * OperatingSignalToAction
 *
 * One sentence: a routine record becomes an exception, the exception acquires
 * an accountable owner, the owner acts, and the action is committed to an
 * audit timeline that outlives the people involved.
 *
 * Laid out as five full-width rows rather than five columns. Five columns on a
 * 1280px canvas leaves roughly 158px of text width per stage, which forces the
 * labels below the size at which they survive being rendered 340px wide on a
 * phone. Rows keep every label at 40px.
 *
 * Tier 2 in the motion priority matrix: the still ships, the video does not,
 * until tier 1 has cleared its performance and human-review gates.
 */

export type OperatingSignalToActionProps = { theme: ThemeName };

export const operatingSignalDuration = 252;

const STAGES = [
  { n: "01", t: "Record", m: "Attendance marked in the ordinary way" },
  { n: "02", t: "Exception", m: "Below the policy threshold" },
  { n: "03", t: "Owner", m: "Routed to a named desk, not a queue" },
  { n: "04", t: "Action", m: "Approved with a recorded reason" },
  { n: "05", t: "Audit", m: "Committed to the append-only timeline" },
] as const;

export const OperatingSignalToAction: React.FC<OperatingSignalToActionProps> = ({ theme }) => {
  const t = THEMES[theme];
  const frame = useCurrentFrame();
  const stageStart = (i: number) => 20 + i * 32;

  return (
    <Stage theme={t}>
      <Header
        theme={t}
        compact
        eyebrow="From signal to action"
        title="A signal becomes an owned, auditable action."
        frame={frame}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
        {STAGES.map((stage, i) => {
          const start = stageStart(i);
          const reached = frame >= start;
          const state =
            i === 1
              ? reached
                ? "attention"
                : "resting"
              : i === 4 && reached
                ? "settled"
                : reached
                  ? "active"
                  : "resting";
          return (
            <Panel
              key={stage.n}
              theme={t}
              state={state}
              style={{
                flex: 1,
                minHeight: 0,
                padding: "0 22px",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 22,
                ...rise(frame, start - 6, 12),
              }}
            >
              <StepNumber theme={t} n={stage.n} active={reached} />
              <div style={{ width: 240, flexShrink: 0 }}>
                <Label theme={t} size={40} tone={i === 1 ? "amber" : i === 4 ? "teal" : "text"}>
                  {stage.t}
                </Label>
              </div>
              <div
                style={{
                  fontFamily: FONT.mono,
                  fontSize: typeScale.meta,
                  letterSpacing: "0.04em",
                  color: t.dim,
                  opacity: draw(frame, start + 6, 10),
                }}
              >
                {stage.m}
              </div>
            </Panel>
          );
        })}
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 18, alignItems: "center", flexShrink: 0 }}>
        <StatusChip theme={t} tone="teal" style={rise(frame, 184)}>
          Append-only
        </StatusChip>
        <div
          style={{
            fontFamily: FONT.body,
            fontSize: typeScale.body,
            color: t.muted,
            opacity: draw(frame, 196, 14),
          }}
        >
          Who acted, what changed, when, and in which campus.
        </div>
      </div>
    </Stage>
  );
};
