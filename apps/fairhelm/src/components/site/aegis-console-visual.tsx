"use client";

import { Fingerprint, ListChecks, Radar, ScrollText, ShieldCheck } from "lucide-react";
import type { CSSProperties } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@fairhelm/ui/lib/utils";

/**
 * SquareCampus's AEGIS as a governed console: a scoped administrator asks an
 * operational question and AEGIS answers with role-limited, audited cards —
 * read-only, RBAC-aware, and audit-backed, matching the posture described on
 * the page (no autonomous writes). The exchange stages in via `.viz-reveal`.
 *
 * Campuses, percentages and counts are sample data. The console is labelled
 * "Illustrative" in the UI, carries an accessible description saying so, and
 * is excluded from the Markdown alternates (`data-md-skip`).
 */

const behind = [
  {
    campus: "North Campus",
    stat: "68% collected",
    detail: "vs 84% planned · 214 families past 30 days",
  },
  {
    campus: "Riverside Campus",
    stat: "74% collected",
    detail: "vs 82% planned · concentrated in grades 8–10",
  },
] as const;

const nextSteps = [
  "Queue reminder circular",
  "Review concession approvals",
  "Flag for principal review",
] as const;

const governance = [
  { icon: ShieldCheck, text: "Within trust boundaries" },
  { icon: ScrollText, text: "Every query audited" },
  { icon: Radar, text: "Live data · no copies" },
] as const;

export function AegisConsoleVisual({ className }: { className?: string }) {
  const ref = useReveal(0.25);

  return (
    <div
      ref={ref}
      data-md-skip
      role="img"
      aria-label="Illustrative example of an AEGIS console exchange with sample campuses and figures. Not customer data."
      className={cn("viz-reveal", className)}
    >
      <div className="viz-panel surface-panel rounded-[var(--radius-panel)]/70 backdrop-blur">
        <div className="viz-cap" />

        {/* Console chrome */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary/15">
              <Radar className="size-3.5 text-primary" />
            </span>
            <span className="font-mono text-[0.58rem] tracking-[0.22em] text-muted-foreground uppercase">
              AEGIS · Governed console
            </span>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 font-mono text-[0.52rem] tracking-[0.16em] text-muted-foreground uppercase">
            <Fingerprint className="size-3 text-primary" />
            Illustrative · Trust admin
          </span>
        </div>

        <div className="grid gap-3 p-5">
          {/* The question */}
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-3">
              <p className="font-mono text-[0.76rem] leading-6 text-primary-foreground">
                Which campuses have fee collections drifting this term?
              </p>
            </div>
          </div>

          {/* AEGIS answer */}
          <div data-rise style={{ "--d": "160ms" } as CSSProperties}>
            <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-border bg-background/55 p-4">
              <p className="text-sm leading-6 text-foreground">
                2 of 6 campuses are behind plan. The rest are on track.
              </p>
              <div className="mt-3 grid gap-2">
                {behind.map((row) => (
                  <div
                    key={row.campus}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-secondary/40 px-3.5 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="size-1.5 rounded-full bg-chart-4" />
                      <span className="text-sm font-medium text-foreground">{row.campus}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-foreground">{row.stat}</p>
                      <p className="text-[0.66rem] text-muted-foreground">{row.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Suggested next steps */}
          <div data-rise style={{ "--d": "320ms" } as CSSProperties}>
            <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-border bg-background/55 p-4">
              <p className="flex items-center gap-1.5 font-mono text-[0.54rem] tracking-[0.18em] text-muted-foreground uppercase">
                <ListChecks className="size-3 text-primary" />
                Suggested next steps
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {nextSteps.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-[0.7rem] text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Governance footer */}
          <div
            data-rise
            style={{ "--d": "460ms" } as CSSProperties}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-secondary/40 px-4 py-3"
          >
            {governance.map((item) => (
              <span
                key={item.text}
                className="inline-flex items-center gap-1.5 font-mono text-[0.55rem] tracking-[0.14em] text-muted-foreground uppercase"
              >
                <item.icon className="size-3 text-chart-4" />
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
