import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { CANVAS, eyebrowStyle, FONT, type MotionTheme, type as typeScale } from "./theme";

/**
 * Shared primitives for every SquareCampus composition.
 *
 * The motion vocabulary is deliberately small: opacity, translate, line-draw
 * and status transition. No particles, no 3D, no spin, no confetti. A viewer
 * should be able to describe what happened in one sentence — if a primitive
 * cannot serve that, it does not belong here.
 */

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

/** Fade + short rise. The only entrance in the system. */
export const rise = (frame: number, start: number, distance = 16) => ({
  opacity: interpolate(frame, [start, start + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  }),
  translate: interpolate(frame, [start, start + 14], [`0px ${distance}px`, "0px 0px"], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  }),
});

/** 0 → 1 progress over a window, eased. Used for line-draw and fills. */
export const draw = (frame: number, start: number, duration = 16) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

/** Holds at 1 between `start` and `end`, fades in and out at the edges. */
export const window_ = (frame: number, start: number, end: number, fade = 8) =>
  interpolate(frame, [start, start + fade, end - fade, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

/** Page ground: flat surface plus the site's faint institutional grid. */
export const Stage: React.FC<{ theme: MotionTheme; children: React.ReactNode }> = ({
  theme,
  children,
}) => (
  <AbsoluteFill style={{ backgroundColor: theme.bg, fontFamily: FONT.body }}>
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${theme.text} 1px, transparent 1px), linear-gradient(90deg, ${theme.text} 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
        opacity: theme.gridOpacity,
      }}
    />
    <AbsoluteFill style={{ padding: CANVAS.padding }}>{children}</AbsoluteFill>
  </AbsoluteFill>
);

/** Composition header: what this diagram is, in the site's own voice. */
export const Header: React.FC<{
  theme: MotionTheme;
  eyebrow: string;
  title: string;
  frame: number;
  /** Steps the title down when a composition needs the vertical room. */
  compact?: boolean;
}> = ({ theme, eyebrow, title, frame, compact = false }) => (
  <div style={{ ...rise(frame, 0), marginBottom: compact ? 20 : 30, flexShrink: 0 }}>
    <div style={eyebrowStyle(theme)}>{eyebrow}</div>
    <div
      style={{
        fontFamily: FONT.display,
        fontSize: compact ? 48 : typeScale.title,
        lineHeight: 1.08,
        letterSpacing: "-0.035em",
        color: theme.text,
        marginTop: compact ? 10 : 14,
      }}
    >
      {title}
    </div>
  </div>
);

/** A resting institutional surface. `state` is reinforcement, never meaning. */
export const Panel: React.FC<{
  theme: MotionTheme;
  state?: "resting" | "active" | "settled" | "attention" | "excluded";
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ theme, state = "resting", style, children }) => {
  // State is carried by a thin border and by the label colour, exactly as the
  // site does it. A saturated fill would make the diagram read green or blue
  // when the page around it reads warm off-white.
  const border =
    state === "active"
      ? theme.brandLine
      : state === "settled"
        ? theme.teal
        : state === "attention"
          ? theme.amber
          : theme.line;
  // Fills stay at panel level. "Settled" in particular gets NO tint: three
  // mint-filled boxes made the whole composition read green while the page
  // around it reads warm off-white. Green survives as a border and as the
  // label colour, which is all the site ever gives it.
  const fill =
    state === "active"
      ? theme.brandSoft
      : state === "attention"
        ? theme.amberSoft
        : theme.panel;

  return (
    <div
      style={{
        // 26px ≈ the site's --radius-panel (1.6rem); 1.5px reads as the site's
        // hairline border once the 1280px canvas is scaled down in the page.
        borderRadius: 26,
        border: `1.5px solid ${border}`,
        backgroundColor: fill,
        opacity: state === "excluded" ? 0.34 : 1,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minWidth: 0,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** The one label a viewer must be able to read at 340px wide. */
export const Label: React.FC<{
  theme: MotionTheme;
  children: React.ReactNode;
  tone?: "text" | "muted" | "brand" | "teal" | "amber";
  size?: number;
}> = ({ theme, children, tone = "text", size = typeScale.label }) => (
  <div
    style={{
      fontFamily: FONT.display,
      fontSize: size,
      lineHeight: 1.14,
      letterSpacing: "-0.02em",
      color:
        tone === "muted"
          ? theme.muted
          : tone === "brand"
            ? theme.brand
            : tone === "teal"
              ? theme.teal
              : tone === "amber"
                ? theme.amber
                : theme.text,
    }}
  >
    {children}
  </div>
);

/** Secondary line. Never the only place an idea appears. */
export const Meta: React.FC<{ theme: MotionTheme; children: React.ReactNode }> = ({
  theme,
  children,
}) => (
  <div
    style={{
      // Sans, not mono: the site reserves mono for uppercase micro-labels.
      // Mono at this size wrapping across lines was the loudest "not our
      // design system" signal in the first render.
      fontFamily: FONT.body,
      fontSize: typeScale.meta,
      lineHeight: 1.45,
      color: theme.muted,
      marginTop: 6,
    }}
  >
    {children}
  </div>
);

/** Step index, the site's numbered-structure language. */
export const StepNumber: React.FC<{ theme: MotionTheme; n: string; active: boolean }> = ({
  theme,
  n,
  active,
}) => (
  <div
    style={{
      fontFamily: FONT.mono,
      fontSize: typeScale.meta,
      letterSpacing: "0.2em",
      color: active ? theme.brand : theme.faint,
    }}
  >
    {n}
  </div>
);

/**
 * Connector between two panels, drawn rather than faded in.
 * `progress` 0 → 1 draws left-to-right (or top-to-bottom for vertical).
 */
export const Connector: React.FC<{
  theme: MotionTheme;
  progress: number;
  vertical?: boolean;
  strong?: boolean;
  style?: React.CSSProperties;
}> = ({ theme, progress, vertical = false, strong = false, style }) => (
  <div style={{ position: "absolute", overflow: "hidden", ...style }}>
    <div
      style={{
        backgroundColor: strong ? theme.brand : theme.lineStrong,
        width: vertical ? 3 : `${progress * 100}%`,
        height: vertical ? `${progress * 100}%` : 3,
        borderRadius: 2,
      }}
    />
  </div>
);

/** Status word. The colour repeats what the word already says. */
export const StatusChip: React.FC<{
  theme: MotionTheme;
  children: React.ReactNode;
  tone: "brand" | "teal" | "amber" | "muted";
  style?: React.CSSProperties;
}> = ({ theme, children, tone, style }) => {
  const colour =
    tone === "brand"
      ? theme.brand
      : tone === "teal"
        ? theme.teal
        : tone === "amber"
          ? theme.amber
          : theme.muted;
  const soft =
    tone === "brand"
      ? theme.brandSoft
      : tone === "teal"
        ? theme.tealSoft
        : tone === "amber"
          ? theme.amberSoft
          : theme.panelAlt;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        alignSelf: "flex-start",
        borderRadius: 999,
        border: `1.5px solid ${colour}`,
        backgroundColor: soft,
        color: colour,
        fontFamily: FONT.mono,
        fontSize: typeScale.meta,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        padding: "8px 18px",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export { EASE };
