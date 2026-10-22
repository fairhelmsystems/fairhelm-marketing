import { type CSSProperties, useId } from "react";

/**
 * A neon line-drawing of the cited document, standing in for a link-preview
 * screenshot: a browser frame carrying the official host, a document with a
 * seal that draws itself in, text lines that settle, the relevant passage
 * highlighted, and a sheen that passes across.
 *
 * Pure SVG + CSS (keyframes in globals.css, `cite-*`): nothing is fetched,
 * nothing depends on the remote page, and reduced motion shows the finished
 * drawing. It is decorative — the card's text carries the information — so
 * the whole graphic is hidden from assistive technology.
 */
export function SourceThumbnail({ host, seed }: { host: string; seed: string }) {
  const uid = useId().replace(/:/g, "");
  const id = (name: string) => `${uid}-${name}`;

  // Vary the page a little per source, deterministically, so two citations
  // never look like the same document.
  const hash = [...seed].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7);
  const widths = [0, 1, 2, 3, 4].map((i) => 150 + ((hash >> (i * 3)) % 7) * 12);
  const highlighted = 1 + (hash % 3);

  const glowVars = {
    "--cite-glow-soft": `url(#${id("glow-soft")})`,
    "--cite-glow-strong": `url(#${id("glow-strong")})`,
  } as CSSProperties;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 320 132"
      className="block h-auto w-full"
      style={glowVars}
    >
      <defs>
        <filter id={id("glow-soft")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={id("glow-strong")} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={id("neon")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--cite-neon)" }} />
          <stop offset="100%" style={{ stopColor: "var(--cite-neon-2)" }} />
        </linearGradient>
        <linearGradient id={id("sheen")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="50%" stopColor="white" stopOpacity="0.22" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id={id("frame")}>
          <rect width="320" height="132" rx="12" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id("frame")})`}>
        <rect width="320" height="132" className="fill-[color:var(--surface-sunken)]" />

        {/* Browser chrome with the official host. */}
        <rect width="320" height="22" className="fill-[color:var(--surface-muted)]" />
        {[12, 21, 30].map((cx) => (
          <circle key={cx} cx={cx} cy="11" r="2.4" className="fill-[color:var(--line-strong)]" />
        ))}
        <rect
          x="44"
          y="5"
          width="232"
          height="12"
          rx="6"
          className="fill-background stroke-[color:var(--line)]"
          strokeWidth="0.8"
        />
        <path
          d="M53 12.6v-2.2a2 2 0 0 1 4 0v2.2 M52 12.6h6v3.2h-6z"
          fill="none"
          strokeWidth="0.9"
          strokeLinejoin="round"
          style={{ stroke: "var(--cite-neon)" }}
        />
        <text
          x="63"
          y="14"
          className="fill-muted-foreground font-mono"
          style={{ fontSize: "7px", letterSpacing: "0.04em" }}
        >
          {host}
        </text>

        {/* The document. */}
        <rect
          x="22"
          y="30"
          width="276"
          height="112"
          rx="7"
          className="fill-background stroke-[color:var(--line)]"
          strokeWidth="0.8"
        />

        {/* Neon layer: seal, highlight bar and rule, glowing. */}
        <g className="[filter:var(--cite-glow-soft)] dark:[filter:var(--cite-glow-strong)]">
          <circle
            className="cite-seal"
            cx="46"
            cy="50"
            r="11"
            pathLength={100}
            fill="none"
            strokeWidth="1.5"
            stroke={`url(#${id("neon")})`}
          />
          <circle
            className="cite-seal"
            cx="46"
            cy="50"
            r="6.5"
            pathLength={100}
            fill="none"
            strokeWidth="1"
            stroke={`url(#${id("neon")})`}
            style={{ animationDelay: "0.3s" }}
          />
          <circle cx="46" cy="50" r="1.8" style={{ fill: "var(--cite-neon)" }} />
          <line
            className="cite-seal"
            x1="34"
            y1="70"
            x2="286"
            y2="70"
            pathLength={100}
            strokeWidth="0.9"
            stroke={`url(#${id("neon")})`}
            style={{ animationDelay: "0.2s" }}
          />
          <rect
            x="31"
            y={76 + highlighted * 11 - 1.5}
            width="2.2"
            height="8"
            rx="1.1"
            className="cite-line"
            style={{ fill: "var(--cite-neon)", ["--cite-delay" as string]: "420ms" }}
          />
        </g>

        {/* Title block. */}
        <rect
          x="66"
          y="42"
          width="168"
          height="5.5"
          rx="2.75"
          className="cite-line fill-foreground/70"
          style={{ ["--cite-delay" as string]: "80ms" } as CSSProperties}
        />
        <rect
          x="66"
          y="53"
          width="104"
          height="4"
          rx="2"
          className="cite-line fill-muted-foreground/60"
          style={{ ["--cite-delay" as string]: "140ms" } as CSSProperties}
        />

        {/* The highlighted passage sits under its line. */}
        <rect
          x="36"
          y={76 + highlighted * 11 - 2.5}
          width={widths[highlighted] + 8}
          height="10"
          rx="3"
          className="cite-highlight [fill-opacity:0.16] dark:[fill-opacity:0.28]"
          style={{ fill: "var(--cite-neon)" }}
        />

        {/* Body lines. */}
        {widths.map((width, i) => (
          <rect
            key={i}
            x="40"
            y={76 + i * 11}
            width={width}
            height="3.5"
            rx="1.75"
            className={
              i === highlighted
                ? "cite-line fill-foreground/80"
                : "cite-line fill-muted-foreground/35"
            }
            style={{ ["--cite-delay" as string]: `${180 + i * 50}ms` } as CSSProperties}
          />
        ))}

        {/* Sheen. */}
        <rect
          x="0"
          y="0"
          width="96"
          height="132"
          className="cite-sheen"
          fill={`url(#${id("sheen")})`}
        />
      </g>

      <rect
        x="0.5"
        y="0.5"
        width="319"
        height="131"
        rx="11.5"
        fill="none"
        className="stroke-[color:var(--line-strong)]"
      />
    </svg>
  );
}
