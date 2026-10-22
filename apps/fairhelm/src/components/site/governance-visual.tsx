"use client";

import { ScrollText } from "lucide-react";
import type { CSSProperties } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@fairhelm/ui/lib/utils";

/**
 * Governance as a posture: a shield core under a rotating radar sweep, ringed
 * by the controls that make authority legible. Callers pass the corner nodes
 * and footer chips so the same visual serves the security and legal contexts.
 * Reuses the `.svg-radar` / `.svg-*orbit` animations from globals.css.
 */

type Node = readonly [number, number, string];

const defaultNodes: readonly Node[] = [
  [170, 110, "RBAC"],
  [390, 110, "AUDIT"],
  [280, 20, "PRIVACY"],
  [280, 200, "CONTROL"],
] as const;

export function GovernanceVisual({
  nodes = defaultNodes,
  chips,
  className,
}: {
  nodes?: readonly Node[];
  chips: readonly string[];
  className?: string;
}) {
  const ref = useReveal(0.2);

  return (
    <div ref={ref} className={cn("viz-reveal", className)}>
      <div className="viz-panel surface-panel rounded-[var(--radius-panel)]/70 p-4 backdrop-blur sm:p-5">
        <div className="viz-cap" />

        <div data-rise style={{ "--d": "80ms" } as CSSProperties}>
          <svg
            viewBox="0 0 560 220"
            className="h-auto w-full"
            role="img"
            aria-label="A governed core ringed by radar-swept controls"
          >
            <defs>
              <linearGradient id="gov-flow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="var(--primary)" stopOpacity="0.9" />
                <stop offset="1" stopColor="var(--chart-2)" stopOpacity="0.2" />
              </linearGradient>
              <radialGradient id="gov-glow">
                <stop offset="0" stopColor="var(--primary)" stopOpacity="0.5" />
                <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="gov-sweep" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="var(--primary)" stopOpacity="0" />
                <stop offset="1" stopColor="var(--primary)" stopOpacity="0.34" />
              </linearGradient>
            </defs>

            <circle cx="280" cy="110" r="78" fill="none" stroke="var(--border)" />
            <g className="svg-radar">
              <path d="M280 110 L346.7 83 A72 72 0 0 1 346.7 137 Z" fill="url(#gov-sweep)" />
              <line
                x1="280"
                y1="110"
                x2="356"
                y2="110"
                stroke="var(--primary)"
                strokeWidth="1.5"
                strokeOpacity="0.5"
                strokeLinecap="round"
              />
            </g>
            <circle
              className="svg-governance-orbit"
              cx="280"
              cy="110"
              r="66"
              fill="none"
              stroke="url(#gov-flow)"
              strokeWidth="2"
              strokeDasharray="14 12"
            />
            <circle
              className="svg-orbit-reverse"
              cx="280"
              cy="110"
              r="52"
              fill="none"
              stroke="var(--chart-2)"
              strokeWidth="1.25"
              strokeDasharray="3 10"
              opacity="0.6"
            />
            <circle className="svg-core-glow" cx="280" cy="112" r="44" fill="url(#gov-glow)" />

            <path
              d="M280 58 L324 78 V111 C324 139 306 157 280 168 C254 157 236 139 236 111 V78 Z"
              fill="var(--card)"
              stroke="var(--primary)"
              strokeOpacity="0.7"
              strokeWidth="1.5"
            />
            <path
              d="M260 111 L274 125 L302 94"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {nodes.map(([x, y, label], index) => (
              <g
                key={label}
                className="svg-node-pulse"
                style={{ animationDelay: `${index * 480}ms` }}
              >
                <circle cx={x} cy={y} r="14" fill="url(#gov-glow)" opacity="0.7" />
                <circle cx={x} cy={y} r="5" fill="var(--primary)" />
                <text
                  x={x}
                  y={y - 12}
                  textAnchor="middle"
                  fill="var(--muted-foreground)"
                  fontSize="8"
                  letterSpacing="1.4"
                >
                  {label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div
          data-rise
          style={{ "--d": "520ms" } as CSSProperties}
          className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
        >
          {chips.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-1.5 font-mono text-[0.56rem] tracking-[0.16em] text-muted-foreground uppercase"
            >
              <ScrollText className="size-3 text-[color:var(--brand-ink)]" />
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
