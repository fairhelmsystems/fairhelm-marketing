import React from "react";
import { useCurrentFrame } from "remotion";
import { Connector, draw, Header, Label, Meta, Panel, rise, Stage } from "../kit";
import { FONT, THEMES, type ThemeName, type as typeScale } from "../theme";

/**
 * GovernedQuestionPath
 *
 * One sentence: a leadership question is answered only from the records the
 * asker's tenant and role actually permit, and the answer itself becomes an
 * audit event.
 *
 * The point of this composition is the exclusion. A generic assistant
 * animation shows text appearing; this one shows records being *refused*
 * before the answer is composed. If the refused rows are ever dropped, the
 * composition stops making its argument.
 *
 * Layout note: every block below the header is flexed, so the composition
 * fills 1280×720 exactly rather than relying on measured pixel heights that
 * drift the moment a label changes length.
 *
 * There is no title card. The last frame is the finished diagram — question,
 * scope gate, permitted and refused records, bounded answer and audit entry,
 * all present at once. That frame is also the poster.
 */

export type GovernedQuestionPathProps = { theme: ThemeName };

export const governedQuestionPathDuration = 264;

const RECORDS = [
  { label: "Fee ledger · Campus A", scope: "in" },
  { label: "Concession approvals", scope: "in" },
  { label: "Staff payroll", scope: "out" },
  { label: "Counselling notes", scope: "out" },
] as const;

export const GovernedQuestionPath: React.FC<GovernedQuestionPathProps> = ({ theme }) => {
  const t = THEMES[theme];
  const frame = useCurrentFrame();

  return (
    <Stage theme={t}>
      <Header
        theme={t}
        compact
        eyebrow="Governed intelligence"
        title="Scope decides what the answer may see."
        frame={frame}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, minHeight: 0 }}>
        {/* 1 — the question, and who is allowed to ask it */}
        <Panel theme={t} state="active" style={{ padding: "16px 22px", ...rise(frame, 18) }}>
          <Meta theme={t}>Asked by Finance Head · Trust tenant</Meta>
          <Label theme={t} size={40} tone="brand">
            “Which campuses are behind on fee follow-up?”
          </Label>
        </Panel>

        {/* 2 + 3 — the scope gate, and the records it permits or refuses */}
        <div style={{ flex: 1, display: "flex", gap: 16, minHeight: 0 }}>
          <Panel theme={t} style={{ width: 340, padding: "14px 22px", ...rise(frame, 54) }}>
            <Label theme={t} size={36}>
              Scope applied
            </Label>
            <Meta theme={t}>Tenant boundary</Meta>
            <Meta theme={t}>Role permissions</Meta>
          </Panel>

          <div style={{ position: "relative", width: 48, flexShrink: 0 }}>
            <Connector
              theme={t}
              progress={draw(frame, 74, 14)}
              strong
              style={{ left: 0, right: 0, top: "50%" }}
            />
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
            {RECORDS.map((record, i) => {
              const settled = frame >= 96 + i * 11;
              const isIn = record.scope === "in";
              return (
                <Panel
                  key={record.label}
                  theme={t}
                  state={!settled ? "resting" : isIn ? "settled" : "excluded"}
                  style={{
                    flex: 1,
                    minHeight: 0,
                    padding: "0 20px",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    ...rise(frame, 88 + i * 7, 10),
                  }}
                >
                  <Label theme={t} size={34} tone={settled && isIn ? "teal" : "muted"}>
                    {record.label}
                  </Label>
                  <div
                    style={{
                      fontFamily: FONT.mono,
                      fontSize: typeScale.meta,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: settled ? (isIn ? t.teal : t.dim) : t.faint,
                      opacity: draw(frame, 96 + i * 11, 8),
                      whiteSpace: "nowrap",
                    }}
                  >
                    {isIn ? "In scope" : "Refused"}
                  </div>
                </Panel>
              );
            })}
          </div>
        </div>

        {/* 4 + 5 — the answer, bounded by what survived, and its audit entry */}
        <Panel
          theme={t}
          state="settled"
          style={{ padding: "14px 22px", gap: 6, flexShrink: 0, ...rise(frame, 168) }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 18, flexWrap: "wrap" }}>
            <Label theme={t} tone="teal">
              2 campuses need action
            </Label>
            <div style={{ fontFamily: FONT.body, fontSize: typeScale.body, color: t.muted }}>
              Composed only from in-scope records
            </div>
          </div>
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: typeScale.meta,
              letterSpacing: "0.06em",
              color: t.dim,
              opacity: draw(frame, 208, 12),
            }}
          >
            Audit · query, asker and in-scope set recorded
          </div>
        </Panel>
      </div>

    </Stage>
  );
};
