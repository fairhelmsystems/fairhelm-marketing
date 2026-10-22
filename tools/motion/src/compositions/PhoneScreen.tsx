import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { draw, rise } from "../kit";
import { FONT, THEMES, type ThemeName } from "../theme";

/**
 * PhoneScreen — rendered mobile UI for the iPhone mockups.
 *
 * Same reasoning as ProductScreen: an AI-generated screenshot asserts things
 * the claims check cannot read, and product UI is required to be code-rendered
 * (`ai-image-prompts.txt`).
 *
 * Rendered at 780×1688 — twice the `aspect-[390/844]` cutout of `PhoneFrame` in
 * `src/components/site/mockups.tsx`, and both dimensions are even, which H.264
 * requires.
 *
 * The phone is where a school actually meets the product: a teacher marking a
 * register, a guardian receiving a fee reminder. Type is set large because the
 * frame renders at roughly 272px on the page — a real app's 15px label would be
 * invisible there, so these screens deliberately show fewer rows, bigger.
 *
 * Figures are fictional; `SyntheticDataNote` sits in the same component on the
 * site. Content states mechanism, never posture.
 */

export type PhoneVariant = "attendance" | "fees";
export type PhoneScreenProps = { theme: ThemeName; variant: PhoneVariant };

export const phoneScreenDuration = 240;
export const PHONE_SCREEN = { width: 780, height: 1688 } as const;

type PhoneRow = { title: string; meta: string; note?: string; tone: "brand" | "amber" | "teal" };

type Phone = {
  app: string;
  title: string;
  subtitle: string;
  rows: readonly PhoneRow[];
  action: string;
  footnote: string;
};

const PHONES: Record<PhoneVariant, Phone> = {
  attendance: {
    app: "Teacher",
    title: "Section 8B",
    subtitle: "Morning register · today",
    rows: [
      { title: "Aarav Menon", meta: "Present", tone: "teal" },
      { title: "Diya Rao", meta: "Present", tone: "teal" },
      { title: "Kabir Shah", meta: "Absent · third this week", note: "Exception", tone: "amber" },
      { title: "Ishita Nair", meta: "Present", tone: "teal" },
      { title: "Rehan Qureshi", meta: "Late · reason recorded", tone: "brand" },
      { title: "Ananya Bose", meta: "Present", tone: "teal" },
      { title: "Yusuf Ali", meta: "Present", tone: "teal" },
    ],
    action: "Submit register",
    footnote: "The exception routes to a named owner",
  },
  fees: {
    app: "Guardian",
    title: "Term fee",
    subtitle: "Grade 8 · North Campus",
    rows: [
      { title: "Tuition", meta: "Due this term", tone: "brand" },
      { title: "Transport", meta: "Route 4 · due this term", tone: "brand" },
      { title: "Concession applied", meta: "Approved by the school", note: "On record", tone: "teal" },
      { title: "Previous term", meta: "Receipt available", note: "Paid", tone: "teal" },
      { title: "Examination fee", meta: "Not applicable this term", tone: "teal" },
      { title: "Payment history", meta: "Every receipt on one record", tone: "brand" },
    ],
    action: "Pay securely",
    footnote: "Receipt lands on the same record",
  },
};

export const PhoneScreen: React.FC<PhoneScreenProps> = ({ theme, variant }) => {
  const t = THEMES[theme];
  const frame = useCurrentFrame();
  const p = PHONES[variant];

  return (
    <AbsoluteFill style={{ backgroundColor: t.bg, fontFamily: FONT.body, padding: "0 44px" }}>
      {/* Status strip — no invented battery or signal figures, just the time */}
      <div
        style={{
          paddingTop: 54,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: FONT.mono,
          fontSize: 30,
          color: t.dim,
        }}
      >
        <span>9:41</span>
        <span style={{ letterSpacing: "0.2em" }}>{p.app.toUpperCase()}</span>
      </div>

      <div style={{ ...rise(frame, 0), paddingTop: 56 }}>
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: 62,
            letterSpacing: "-0.03em",
            color: t.text,
            lineHeight: 1.1,
          }}
        >
          {p.title}
        </div>
        <div style={{ fontSize: 32, color: t.muted, marginTop: 12 }}>{p.subtitle}</div>
      </div>

      <div style={{ marginTop: 46, flex: 1 }}>
        {p.rows.map((row, i) => {
          const start = 20 + i * 26;
          const accent =
            row.tone === "amber" ? t.amber : row.tone === "teal" ? t.teal : t.brand;
          return (
            <div
              key={row.title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "28px 0",
                borderBottom: `1.5px solid ${t.line}`,
                ...rise(frame, start, 12),
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  backgroundColor: accent,
                  flexShrink: 0,
                  opacity: draw(frame, start + 6, 10),
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: FONT.display,
                    fontSize: 38,
                    letterSpacing: "-0.02em",
                    color: t.text,
                  }}
                >
                  {row.title}
                </div>
                <div style={{ fontSize: 28, color: t.muted, marginTop: 6 }}>{row.meta}</div>
              </div>
              {row.note ? (
                <div
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: 22,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: accent,
                    border: `1.5px solid ${accent}`,
                    borderRadius: 999,
                    padding: "8px 16px",
                    whiteSpace: "nowrap",
                    opacity: draw(frame, start + 12, 10),
                  }}
                >
                  {row.note}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div style={{ paddingBottom: 64, ...rise(frame, 150) }}>
        <div
          style={{
            backgroundColor: t.brand,
            color: theme === "light" ? "#FFFFFF" : "#08111E",
            borderRadius: 999,
            textAlign: "center",
            fontFamily: FONT.display,
            fontSize: 36,
            padding: "30px 0",
          }}
        >
          {p.action}
        </div>
        <div
          style={{
            textAlign: "center",
            fontSize: 26,
            color: t.dim,
            marginTop: 22,
            opacity: draw(frame, 168, 14),
          }}
        >
          {p.footnote}
        </div>
      </div>
    </AbsoluteFill>
  );
};
