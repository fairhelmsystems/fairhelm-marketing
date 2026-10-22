/**
 * SquareCampus motion tokens.
 *
 * These are the site's own values, converted from the oklch() definitions in
 * `src/app/globals.css` — not approximations, and deliberately NOT the
 * homepage hero SVG's palette, which is a cooler and more saturated system.
 * An earlier version of this file mirrored the hero and the result read as a
 * foreign rectangle pasted onto the page: cool lilac ground against the site's
 * warm off-white, 2px saturated borders against the site's hairlines, and
 * green used as a filled panel where the site only ever uses it as a thin
 * status accent.
 *
 * Ground rules, taken from the CSS rather than invented here:
 *  - The composition sits inside `.surface-panel`, so its ground is `--surface`,
 *    not `--background`. It should have no visible seam against its frame.
 *  - Borders are hairlines (`--line`, `--line-strong`), never heavy strokes.
 *  - Green (`--state-ok`) and amber (`--state-attention`) appear as a thin
 *    border and as text, over the barely-there `*-soft` tint. Never as a fill
 *    that carries the eye.
 *  - Mono is for uppercase micro-labels only (`.eyebrow`, step numbers, chips).
 *    Sentence text is always the body sans.
 *
 * Every composition renders twice — once per theme. Only one file is ever
 * fetched by a visitor: the delivery component picks the variant that matches
 * `document.documentElement.dataset.theme` before it attaches a source.
 */

import { FONT } from "./fonts";

export { FONT };

export type ThemeName = "light" | "dark";

export type MotionTheme = {
  bg: string;
  panel: string;
  panelAlt: string;
  line: string;
  lineStrong: string;
  text: string;
  muted: string;
  dim: string;
  faint: string;
  brand: string;
  brandSoft: string;
  brandLine: string;
  teal: string;
  tealSoft: string;
  amber: string;
  amberSoft: string;
  violet: string;
  gridOpacity: number;
  shadow: string;
};

export const THEMES: Record<ThemeName, MotionTheme> = {
  light: {
    bg: "#FEFDFC", // --surface over --background: the panel interior, no seam
    panel: "#FFFFFF",
    panelAlt: "#F7F6F3", // --surface-muted
    line: "#E7E7E7", // --line
    lineStrong: "#D8D9DA", // --line-strong
    text: "#161E26", // --foreground
    muted: "#4D5661", // --muted-foreground
    dim: "#6B747E",
    faint: "#AEB3B8",
    brand: "#4485BE", // --brand
    brandSoft: "#EFF4F9",
    brandLine: "#B9D0E4",
    teal: "#318267", // --state-ok
    tealSoft: "#EDF4F1", // --state-ok-soft, lightened toward the panel
    amber: "#A26E22", // --state-attention
    amberSoft: "#F7F1E6", // --state-attention-soft
    violet: "#5F45C0",
    gridOpacity: 0.035,
    shadow: "0 18px 44px rgba(8,15,30,0.06)", // --shadow-2
  },
  dark: {
    bg: "#070B13", // --surface in dark
    panel: "#0B111C",
    panelAlt: "#0A0B0D",
    line: "#1B1D22", // --line
    lineStrong: "#282B30", // --line-strong
    text: "#F5F3F0", // --foreground
    muted: "#B5BBC3", // --muted-foreground
    dim: "#8A929C",
    faint: "#4A5058",
    brand: "#6CA1D0", // --brand
    brandSoft: "#0E1520",
    brandLine: "#2E4560",
    teal: "#7DC2A7", // --state-ok
    tealSoft: "#0C1817",
    amber: "#E6B374", // --state-attention
    amberSoft: "#1B160E",
    violet: "#8B6BE8",
    gridOpacity: 0.045,
    shadow: "0 18px 44px rgba(0,0,0,0.4)",
  },
};

/**
 * Canvas geometry. 1280×720 renders down to roughly 340 px on a phone, a
 * 3.8× reduction — which is the single hardest constraint on these
 * compositions. Anything a viewer must actually read is set at
 * `type.label` (44px → ~11.7px at 340px) or larger. Nothing below
 * `type.meta` is allowed to carry meaning on its own.
 */
export const CANVAS = {
  width: 1280,
  height: 720,
  fps: 24,
  padding: 56,
} as const;

export const type = {
  eyebrow: 26,
  title: 62,
  label: 44,
  body: 34,
  meta: 28,
} as const;


/** Uppercase mono micro-label, the site's `.eyebrow` treatment. */
export const eyebrowStyle = (t: MotionTheme) =>
  ({
    fontFamily: FONT.mono,
    fontSize: type.eyebrow,
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: t.dim,
  }) as const;
