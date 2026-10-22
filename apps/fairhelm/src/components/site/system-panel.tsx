"use client";

import {
  Activity,
  ArrowUpRight,
  Check,
  DatabaseZap,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import type { CSSProperties } from "react";
import { useReveal } from "@/hooks/use-reveal";

/**
 * The home hero visual: a Fairhelm "control plane" — the flagship product
 * and the two engineering lanes as governed systems, each with its posture
 * signals. Every figure is sample data; the panel says so on screen, in its
 * accessible name, and is excluded from the Markdown alternates.
 */
const systems = [
  {
    icon: GraduationCap,
    name: "SquareCampus",
    kind: "School Operating System",
    state: "Governed",
    detail: "Admissions · Fees · Attendance · Exams",
  },
  {
    icon: DatabaseZap,
    name: "Data pipelines",
    kind: "ETL / ELT",
    state: "Reconciled",
    detail: "6 sources · control totals matched",
  },
  {
    icon: Activity,
    name: "Command surface",
    kind: "Operational dashboard",
    state: "On time",
    detail: "Refresh 06:00 · 2 exceptions owned",
  },
] as const;

const posture = [
  ["RBAC", "Role-aware"],
  ["Audit", "Traceable"],
  ["Tenancy", "Separated"],
  ["Cost", "Bounded"],
] as const;

export function SystemPanel() {
  const ref = useReveal(0.2);

  return (
    <div
      ref={ref}
      data-md-skip
      role="img"
      aria-label="Illustrative control-plane panel showing Fairhelm's flagship product and engineering lanes with governance, reconciliation and refresh signals. Sample data, not a live system."
      className="viz-reveal panel mx-auto w-full max-w-xl p-2.5 sm:p-3"
    >
      <div className="viz-cap" />
      <div className="panel-inner overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3.5 sm:px-5">
          <div>
            <p className="eyebrow text-[0.6rem]">Fairhelm control plane</p>
            <p className="mt-1.5 font-heading text-[0.98rem] tracking-[-0.02em] text-foreground">
              Institutional systems · today
            </p>
          </div>
          <span className="chip">
            <span className="size-1.5 rounded-full bg-teal shadow-[0_0_10px_var(--teal)]" />
            Live
          </span>
        </div>

        <ul className="flex flex-col gap-2 p-3 sm:p-4">
          {systems.map((system, index) => (
            <li
              key={system.name}
              data-rise
              style={{ "--d": `${120 + index * 110}ms` } as CSSProperties}
              className="flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-card/70 p-3 sm:gap-3.5 sm:p-3.5"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-[color:var(--brand-ink)]">
                <system.icon aria-hidden="true" className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {system.name}
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  <span className="hidden font-mono text-[0.58rem] tracking-[0.14em] uppercase sm:inline">
                    {system.kind}
                    <span className="mx-1.5">·</span>
                  </span>
                  {system.detail}
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-teal/30 bg-teal/10 px-2.5 py-1 font-mono text-[0.58rem] tracking-[0.14em] text-teal uppercase">
                <Check aria-hidden="true" className="size-3" />
                {system.state}
              </span>
            </li>
          ))}
        </ul>

        <div
          data-rise
          style={{ "--d": "480ms" } as CSSProperties}
          className="grid grid-cols-4 gap-2 border-t border-border px-3 py-3.5 sm:px-4"
        >
          {posture.map(([label, value]) => (
            <div key={label} className="min-w-0 text-center">
              <p className="flex items-center justify-center gap-1 font-mono text-[0.58rem] tracking-[0.14em] text-muted-foreground uppercase">
                <ShieldCheck aria-hidden="true" className="size-3 text-[color:var(--brand-ink)]" />
                {label}
              </p>
              <p className="mt-1 truncate text-xs font-medium text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-3 pt-2.5 pb-1 text-[0.7rem] text-muted-foreground sm:px-4">
        <span>Product first. Services by exception.</span>
        <span className="inline-flex items-center gap-1 text-[color:var(--brand-ink)]">
          squarecampus.com
          <ArrowUpRight aria-hidden="true" className="size-3" />
        </span>
      </div>
    </div>
  );
}
