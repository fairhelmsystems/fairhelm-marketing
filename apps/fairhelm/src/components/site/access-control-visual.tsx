"use client";

import { Ban, Check, Fingerprint, KeyRound, Lock, ScrollText, ShieldCheck } from "lucide-react";
import type { CSSProperties } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@fairhelm/ui/lib/utils";

/**
 * Security as an architecture, not a badge: an access request evaluated against
 * explicit authority. One scope is allowed, the rest denied by least privilege,
 * and the decision lands in an immutable audit trail. Stages in via
 * `.viz-reveal`; every claim mirrors the page's "posture over performance" copy.
 */

const decisions = [
  {
    icon: Check,
    verdict: "Allowed",
    detail: "Fee ledger · North Zone (in scope)",
    tone: "allow",
  },
  {
    icon: Ban,
    verdict: "Denied",
    detail: "Other zones · outside granted authority",
    tone: "deny",
  },
] as const;

const controls = [
  { icon: KeyRound, text: "RBAC" },
  { icon: ScrollText, text: "Audit trail" },
  { icon: Lock, text: "Data boundaries" },
] as const;

export function AccessControlVisual({ className }: { className?: string }) {
  const ref = useReveal(0.25);

  return (
    <div
      ref={ref}
      data-md-skip
      role="img"
      aria-label="Illustrative example of an access decision evaluated against explicit authority. Sample roles and scopes, not customer data."
      className={cn("viz-reveal", className)}
    >
      <div className="viz-panel surface-panel rounded-[var(--radius-panel)]/70 backdrop-blur">
        <div className="viz-cap" />

        {/* Console chrome */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary/15">
              <ShieldCheck className="size-3.5 text-[color:var(--brand-ink)]" />
            </span>
            <span className="font-mono text-[0.58rem] tracking-[0.22em] text-muted-foreground uppercase">
              Access control plane
            </span>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 font-mono text-[0.52rem] tracking-[0.16em] text-muted-foreground uppercase">
            <KeyRound className="size-3 text-[color:var(--brand-ink)]" />
            Least privilege
          </span>
        </div>

        <div className="grid gap-3 p-5">
          {/* The principal + request */}
          <div
            data-rise
            style={{ "--d": "120ms" } as CSSProperties}
            className="rounded-2xl border border-border bg-background/55 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Fingerprint className="size-4 text-[color:var(--brand-ink)]" />
                <div>
                  <p className="text-sm font-medium text-foreground">Regional Coordinator</p>
                  <p className="font-mono text-[0.6rem] tracking-[0.14em] text-muted-foreground uppercase">
                    Scope: North Zone
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-[0.66rem] text-muted-foreground">
                Requests export
              </span>
            </div>
          </div>

          {/* Decisions */}
          <div data-rise style={{ "--d": "260ms" } as CSSProperties} className="grid gap-2">
            {decisions.map((row) => (
              <div
                key={row.verdict}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3",
                  row.tone === "allow"
                    ? "border-primary/40 bg-primary/10"
                    : "border-border bg-secondary/40"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full",
                      row.tone === "allow"
                        ? "bg-primary/20 text-[color:var(--brand-ink)]"
                        : "bg-destructive/15 text-destructive"
                    )}
                  >
                    <row.icon className="size-3.5" />
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[0.64rem] tracking-[0.16em] uppercase",
                      row.tone === "allow"
                        ? "text-[color:var(--brand-ink)]"
                        : "text-muted-foreground"
                    )}
                  >
                    {row.verdict}
                  </span>
                </div>
                <span className="text-right text-[0.7rem] text-muted-foreground">{row.detail}</span>
              </div>
            ))}
          </div>

          {/* Audit line */}
          <div
            data-rise
            style={{ "--d": "400ms" } as CSSProperties}
            className="flex items-center gap-2.5 rounded-xl border border-border bg-background/55 px-4 py-2.5"
          >
            <ScrollText className="size-3.5 shrink-0 text-chart-4" />
            <p className="font-mono text-[0.6rem] leading-5 tracking-[0.1em] text-muted-foreground uppercase">
              Decision written to immutable audit trail
            </p>
          </div>

          {/* Controls footer */}
          <div
            data-rise
            style={{ "--d": "520ms" } as CSSProperties}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-secondary/40 px-4 py-3"
          >
            {controls.map((item) => (
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
