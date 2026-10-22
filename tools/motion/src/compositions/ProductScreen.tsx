import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { draw, rise } from "../kit";
import { FONT, THEMES, type ThemeName } from "../theme";

/**
 * ProductScreen — rendered product UI for the laptop mockups.
 *
 * These replace AI-generated dashboard images, for two reasons beyond looks.
 *
 * 1. CLAIMS. `scripts/check-claims.sh` scans `src/` and `public/llms.txt`. It
 *    cannot scan a picture, so an image can assert what the copy is forbidden
 *    to. The security screenshot this family started with carried "AES-256",
 *    "TLS 1.2+", "MFA enforced", "Healthy" across five control domains, "0 open
 *    critical incidents" and a "99.6% success rate" — live operational status
 *    nobody has audited. Rendered in code the content is reviewable and the
 *    claims check sees it. `ai-image-prompts.txt` already required product UI
 *    to be code-rendered.
 *
 * 2. DENSITY. The images these replace stacked a dozen panels, several charts,
 *    a donut and a map into one frame. Each of these shows one list, in large
 *    type, with air — which is what survives being shrunk into a bezel.
 *
 * Content rule: state **mechanism**, never posture. "Owner assigned", "Reason
 * recorded", "Reconciled" are things the system does. "Healthy", "99.6%", "0
 * incidents" are assertions about a running deployment and do not belong in a
 * picture the claims check cannot read.
 *
 * Every figure is fictional. The device frames carry `SyntheticDataNote` in the
 * same component, which is the site's own rule.
 *
 * Rendered at 1600×1000 — the 8:5 cutout of the MacBook frame in
 * `src/components/site/mockups.tsx`, so they fill it with no letterbox.
 */

export type ScreenVariant = "audit" | "operations" | "parallel-run" | "surfaces";
export type ProductScreenProps = { theme: ThemeName; variant: ScreenVariant };

export const productScreenDuration = 264;
export const PRODUCT_SCREEN = { width: 1600, height: 1000 } as const;

type Row = {
  lead: string;
  title: string;
  meta: string;
  note: string;
  tone: "brand" | "amber" | "teal" | "muted";
};

type Screen = {
  rail: readonly string[];
  active: string;
  eyebrow: string;
  heading: string;
  scope: string;
  rows: readonly Row[];
  footer: readonly string[];
  account: { initials: string; name: string; role: string };
};

const SCREENS: Record<ScreenVariant, Screen> = {
  audit: {
    rail: ["Overview", "People", "Fees", "Academics", "Audit"],
    active: "Audit",
    eyebrow: "Audit timeline",
    heading: "Every action, and who owned it.",
    scope: "Trust · all campuses",
    account: { initials: "AP", name: "Anita Pillai", role: "Trust Admin" },
    rows: [
      {
        lead: "10:24",
        title: "Fee concession approved",
        meta: "Priya Sharma · School Admin · North Campus · Grade 8",
        note: "Reason recorded",
        tone: "brand",
      },
      {
        lead: "10:18",
        title: "Attendance corrected after cut-off",
        meta: "Vikram Singh · Campus Director · South Campus · Section 6B",
        note: "Override · reason required",
        tone: "amber",
      },
      {
        lead: "10:06",
        title: "Fee report exported",
        meta: "Anita Pillai · Finance Lead · All campuses",
        note: "Export logged",
        tone: "brand",
      },
      {
        lead: "09:58",
        title: "Requested payroll access",
        meta: "Rakesh Verma · Teacher · Outside role scope",
        note: "Refused",
        tone: "muted",
      },
      {
        lead: "09:41",
        title: "Fee reminder circular published",
        meta: "Neha Kapoor · Communications · West Campus · Guardians",
        note: "Delivery recorded",
        tone: "brand",
      },
    ],
    footer: ["Append-only", "Role-scoped", "Exportable"],
  },

  operations: {
    rail: ["Today", "Admissions", "Fees", "Academics", "Campuses"],
    active: "Today",
    eyebrow: "Requires attention",
    heading: "What needs a decision today.",
    scope: "Trust · four campuses",
    account: { initials: "RM", name: "Rohit Mehta", role: "Group Ops" },
    rows: [
      {
        lead: "Fees",
        title: "Follow-up drifting past the reminder window",
        meta: "South Campus · Grade 9 · owner: Finance Lead",
        note: "Owner assigned",
        tone: "amber",
      },
      {
        lead: "Admissions",
        title: "Applications waiting on document verification",
        meta: "North Campus · owner: Registrar",
        note: "In progress",
        tone: "brand",
      },
      {
        lead: "Academics",
        title: "Attendance below the policy threshold",
        meta: "West Campus · Section 7A · owner: Class Teacher",
        note: "Escalated",
        tone: "amber",
      },
      {
        lead: "Approvals",
        title: "Concession request awaiting trust sign-off",
        meta: "Central Campus · raised by School Admin",
        note: "Awaiting approval",
        tone: "brand",
      },
      {
        lead: "Comms",
        title: "Examination circular scheduled",
        meta: "All campuses · guardians · English and Hindi",
        note: "Queued",
        tone: "teal",
      },
    ],
    footer: ["One record", "One owner", "One timeline"],
  },

  "parallel-run": {
    rail: ["Blueprint", "Migration", "Training", "Parallel run", "Go-live"],
    active: "Parallel run",
    eyebrow: "Parallel validation",
    heading: "Both systems, until the numbers agree.",
    scope: "North Campus · pilot in progress",
    account: { initials: "SI", name: "Sneha Iyer", role: "Implementation Lead" },
    rows: [
      {
        lead: "Fees",
        title: "Collection register",
        meta: "Existing system and SquareCampus compared daily",
        note: "Reconciled",
        tone: "teal",
      },
      {
        lead: "Attendance",
        title: "Daily register by section",
        meta: "Compared against the register the campus already keeps",
        note: "Reconciled",
        tone: "teal",
      },
      {
        lead: "Admissions",
        title: "Enquiry to enrolment pipeline",
        meta: "Two entries differ · under review with the registrar",
        note: "Investigating",
        tone: "amber",
      },
      {
        lead: "Comms",
        title: "Guardian circular delivery",
        meta: "Sent from both systems during the validation window",
        note: "Reconciled",
        tone: "teal",
      },
      {
        lead: "Baseline",
        title: "The agreed success measure",
        meta: "Written down before implementation began",
        note: "Tracking",
        tone: "brand",
      },
    ],
    footer: ["No rip-and-replace", "Compared daily", "Decided on evidence"],
  },

  surfaces: {
    rail: ["Record", "Guardians", "Teachers", "Finance", "Trust"],
    active: "Record",
    eyebrow: "One institutional record",
    heading: "Every surface acting on the same student.",
    scope: "Grade 8 · North Campus",
    account: { initials: "MJ", name: "Meera Joshi", role: "Registrar" },
    rows: [
      {
        lead: "Guardian",
        title: "Fee reminder acknowledged",
        meta: "Mobile app · receipt available to download",
        note: "Delivered",
        tone: "brand",
      },
      {
        lead: "Teacher",
        title: "Attendance marked for Section 8B",
        meta: "Mobile app · exception raised for one student",
        note: "Synced",
        tone: "brand",
      },
      {
        lead: "Finance",
        title: "Concession applied to the fee plan",
        meta: "Console · approval chain complete",
        note: "Reason recorded",
        tone: "teal",
      },
      {
        lead: "Transport",
        title: "Route change effective from Monday",
        meta: "Guardians on the route notified automatically",
        note: "Notified",
        tone: "brand",
      },
      {
        lead: "Trust",
        title: "Cross-campus view updated",
        meta: "No export, and no reconciliation step",
        note: "Already current",
        tone: "teal",
      },
    ],
    footer: ["No exports", "No re-keying", "One truth"],
  },
};

export const ProductScreen: React.FC<ProductScreenProps> = ({ theme, variant }) => {
  const t = THEMES[theme];
  const frame = useCurrentFrame();
  const s = SCREENS[variant];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: t.bg,
        fontFamily: FONT.body,
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* Rail — enough to read as product, not a navigation to squint at */}
      <div
        style={{
          width: 236,
          borderRight: `1.5px solid ${t.line}`,
          padding: "38px 0",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: 30,
            letterSpacing: "-0.02em",
            color: t.text,
            padding: "0 30px 26px",
          }}
        >
          SquareCampus
        </div>
        {s.rail.map((item) => {
          const active = item === s.active;
          return (
            <div
              key={item}
              style={{
                fontSize: 24,
                color: active ? t.brand : t.muted,
                padding: "13px 30px",
                borderLeft: `3px solid ${active ? t.brand : "transparent"}`,
                backgroundColor: active ? t.brandSoft : "transparent",
              }}
            >
              {item}
            </div>
          );
        })}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "0 30px",
            opacity: draw(frame, 150, 14),
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 999,
              border: `1.5px solid ${t.line}`,
              backgroundColor: t.panelAlt,
              color: t.muted,
              fontFamily: FONT.mono,
              fontSize: 17,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {s.account.initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 20, color: t.text }}>{s.account.name}</div>
            <div style={{ fontSize: 18, color: t.dim }}>{s.account.role}</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div
          style={{
            padding: "38px 44px 26px",
            borderBottom: `1.5px solid ${t.line}`,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 24,
            ...rise(frame, 0),
          }}
        >
          <div>
            <div
              style={{
                fontFamily: FONT.mono,
                fontSize: 20,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: t.dim,
              }}
            >
              {s.eyebrow}
            </div>
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 42,
                letterSpacing: "-0.03em",
                color: t.text,
                marginTop: 10,
              }}
            >
              {s.heading}
            </div>
          </div>
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: 20,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: t.dim,
              border: `1.5px solid ${t.line}`,
              borderRadius: 999,
              padding: "9px 20px",
              whiteSpace: "nowrap",
            }}
          >
            {s.scope}
          </div>
        </div>

        <div style={{ flex: 1, padding: "10px 44px", minHeight: 0 }}>
          {s.rows.map((row, i) => {
            const start = 22 + i * 34;
            const accent =
              row.tone === "brand"
                ? t.brand
                : row.tone === "amber"
                  ? t.amber
                  : row.tone === "teal"
                    ? t.teal
                    : t.dim;
            return (
              <div
                key={row.title}
                style={{
                  display: "flex",
                  gap: 28,
                  alignItems: "flex-start",
                  padding: "30px 0",
                  borderBottom: `1.5px solid ${t.line}`,
                  ...rise(frame, start, 14),
                }}
              >
                <div
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: 22,
                    color: t.dim,
                    width: 150,
                    flexShrink: 0,
                    paddingTop: 8,
                  }}
                >
                  {row.lead}
                </div>
                <div
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: 999,
                    backgroundColor: accent,
                    marginTop: 14,
                    flexShrink: 0,
                    opacity: draw(frame, start + 6, 10),
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: FONT.display,
                      fontSize: 34,
                      letterSpacing: "-0.02em",
                      color: t.text,
                      lineHeight: 1.2,
                    }}
                  >
                    {row.title}
                  </div>
                  <div style={{ fontSize: 24, color: t.muted, marginTop: 8 }}>{row.meta}</div>
                </div>
                <div
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: 20,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: accent,
                    border: `1.5px solid ${accent}`,
                    borderRadius: 999,
                    padding: "8px 18px",
                    whiteSpace: "nowrap",
                    marginTop: 6,
                    opacity: draw(frame, start + 10, 10),
                  }}
                >
                  {row.note}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mechanism, not metrics. Nothing here is a posture claim. */}
        <div
          style={{
            padding: "22px 44px 34px",
            display: "flex",
            gap: 34,
            fontFamily: FONT.mono,
            fontSize: 20,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: t.dim,
            opacity: draw(frame, 172, 16),
          }}
        >
          {s.footer.map((f) => (
            <span key={f}>{f}</span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
