"use client";

import { Activity, BadgeCheck, ChartNoAxesColumn, CircleAlert, Clock, Gauge } from "lucide-react";
import type { CSSProperties } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@fairhelm/ui/lib/utils";

/**
 * A leadership "command surface": governed metrics, an exception that carries
 * an owner and a next step, and the controls that back the number. Stages in
 * via the `.viz-reveal` rules; the trend bars grow from the baseline.
 *
 * Every figure below is sample data. The panel is labelled "Illustrative" in
 * the UI, carries an accessible description saying so, and is excluded from
 * the Markdown alternates (`data-md-skip`) so no number can be read as a
 * customer result.
 */

const trend = [46, 58, 52, 70, 64, 82, 78] as const;

const exceptions = [
  {
    label: "Revenue vs plan",
    detail: "92.8% of target · owner: Finance",
    tone: "ok",
  },
  {
    label: "Overdue receivables",
    detail: "3 accounts past terms · owner: Ops",
    tone: "warn",
  },
] as const;

const controls = [
  { icon: BadgeCheck, text: "Governed metrics" },
  { icon: Activity, text: "Ownership assigned" },
  { icon: Clock, text: "Within refresh SLA" },
] as const;

export function CommandSurfaceVisual({ className }: { className?: string }) {
  const ref = useReveal(0.25);

  return (
    <div
      ref={ref}
      data-md-skip
      role="img"
      aria-label="Illustrative example of an operational dashboard with sample figures. Not customer data."
      className={cn("viz-reveal", className)}
    >
      <div className="viz-panel surface-panel rounded-[var(--radius-panel)]/70 backdrop-blur">
        <div className="viz-cap" />

        {/* Console chrome */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary/15">
              <Gauge className="size-3.5 text-[color:var(--brand-ink)]" />
            </span>
            <span className="font-mono text-[0.58rem] tracking-[0.22em] text-muted-foreground uppercase">
              Command surface
            </span>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 font-mono text-[0.52rem] tracking-[0.18em] text-muted-foreground uppercase">
            <span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
            Illustrative data
          </span>
        </div>

        <div className="grid gap-3 p-5">
          {/* Governed metric + trend */}
          <div
            data-rise
            style={{ "--d": "120ms" } as CSSProperties}
            className="rounded-2xl border border-border bg-background/55 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[0.54rem] tracking-[0.2em] text-muted-foreground uppercase">
                  Operating posture
                </p>
                <p className="mt-1.5 text-2xl font-semibold text-foreground">On track</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Reconciled · +3.4% vs prior period
                </p>
              </div>
              <div className="flex h-14 items-end gap-1">
                {trend.map((h, i) => (
                  <span
                    key={h}
                    data-grow
                    className="w-2 rounded-t-[3px] bg-linear-to-t from-primary/50 to-primary"
                    style={
                      {
                        height: `${h * 0.5}px`,
                        "--d": `${360 + i * 70}ms`,
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Exceptions with ownership */}
          <div
            data-rise
            style={{ "--d": "260ms" } as CSSProperties}
            className="rounded-2xl border border-border bg-background/55 p-4"
          >
            <p className="flex items-center gap-1.5 font-mono text-[0.54rem] tracking-[0.2em] text-muted-foreground uppercase">
              <ChartNoAxesColumn className="size-3 text-[color:var(--brand-ink)]" />
              Exceptions that need a decision
            </p>
            <div className="mt-3 grid gap-2">
              {exceptions.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-secondary/40 px-3.5 py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    {row.tone === "warn" ? (
                      <CircleAlert className="size-3.5 text-chart-4" />
                    ) : (
                      <BadgeCheck className="size-3.5 text-[color:var(--brand-ink)]" />
                    )}
                    <span className="text-sm font-medium text-foreground">{row.label}</span>
                  </div>
                  <span className="text-[0.68rem] text-muted-foreground">{row.detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Controls footer */}
          <div
            data-rise
            style={{ "--d": "400ms" } as CSSProperties}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-secondary/40 px-4 py-3"
          >
            {controls.map((item) => (
              <span
                key={item.text}
                className="inline-flex items-center gap-1.5 font-mono text-[0.56rem] tracking-[0.16em] text-muted-foreground uppercase"
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
