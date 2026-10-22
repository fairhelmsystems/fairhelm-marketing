"use client";

import { Eye, Fingerprint, Radar, ScrollText, ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@fairhelm/ui/lib/utils";
import { SyntheticDataNote } from "./synthetic-data-note";

export const AEGIS_EXAMPLE_LABEL = "Illustrative example — synthetic data";

/**
 * The AEGIS governed console: an illustrative exchange where a trust
 * administrator asks an operational question and AEGIS answers with scoped,
 * audited cards. Every figure is synthetic and labelled as such.
 *
 * Static first. The server-rendered markup is the finished exchange, so it is
 * complete without JavaScript, with reduced motion, and for a visitor who
 * lands with the console already on screen. Only when the console starts
 * below the fold does the component add `.will-animate` (which hides the
 * steps) and then `.is-live` on scroll, so the choreography is an enhancement
 * and never a wait. All choreography is CSS (`.aegis-console` in globals.css).
 *
 * AEGIS is read-only (content/what-is-squarecampus.ts › aegisBoundaries): the
 * follow-ups are suggestions for a person to act on, never actions it takes.
 */
export function AegisConsole({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyVisible = node.getBoundingClientRect().top < window.innerHeight;
    if (reduceMotion || alreadyVisible) {
      return;
    }
    node.classList.add("will-animate");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add("is-live");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    const timeout = setTimeout(() => node.classList.add("is-live"), 4000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div data-md-skip ref={ref} className={cn("aegis-console", className)}>
      <div className="surface-panel-strong relative overflow-hidden rounded-[1.9rem]">
        <div className="pointer-events-none absolute inset-x-[10%] top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(88,124,204,0.18),transparent_70%)]" />

        {/* Console chrome */}
        <div className="flex items-center justify-between border-b border-(--line) px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand-soft),transparent_70%)]">
              <Radar className="size-3.5 text-(--brand)" />
            </span>
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-muted-foreground">
              AEGIS · Governed console
            </span>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-(--surface) px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
            <Fingerprint className="size-3 text-(--brand)" />
            Scoped: Trust Administrator
          </span>
        </div>
        <div className="border-b border-(--line) px-5 py-2.5">
          <SyntheticDataNote variant="chip" label={AEGIS_EXAMPLE_LABEL} />
        </div>

        <div className="grid gap-3 p-5">
          {/* The question */}
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-[1.3rem] rounded-br-md bg-foreground px-4 py-3">
              <p className="aegis-console-query font-mono text-[0.78rem] leading-6 text-background">
                Which campuses have fee collections drifting this term?
              </p>
            </div>
          </div>

          {/* AEGIS answer */}
          <div data-console-step style={{ "--d": "1.2s" } as React.CSSProperties}>
            <div className="max-w-[92%] rounded-[1.3rem] rounded-bl-md border border-(--line) bg-(--surface) p-4">
              <p className="text-sm leading-6 text-foreground">
                2 of 6 campuses are behind plan. Rest are on track.
              </p>
              <div className="mt-3 grid gap-2">
                {[
                  {
                    campus: "North Campus",
                    stat: "68% collected",
                    detail: "vs 84% planned · 214 families with dues > 30 days",
                    tone: "amber",
                  },
                  {
                    campus: "Riverside Campus",
                    stat: "74% collected",
                    detail: "vs 82% planned · concentrated in Grades 8–10",
                    tone: "amber",
                  },
                ].map((row) => (
                  <div
                    key={row.campus}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-[1rem] border border-(--line) bg-(--surface-strong) px-3.5 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="size-1.5 rounded-full bg-(--amber)" />
                      <span className="text-sm font-medium text-foreground">{row.campus}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-foreground">{row.stat}</p>
                      <p className="text-[0.68rem] text-muted-foreground">{row.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Suggested next steps */}
          <div data-console-step style={{ "--d": "1.9s" } as React.CSSProperties}>
            <div className="max-w-[92%] rounded-[1.3rem] rounded-bl-md border border-(--line) bg-(--surface) p-4">
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
                Suggested follow-ups · your team decides
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {[
                  "Send a reminder circular (Hindi + English)",
                  "Review concession approvals at North",
                  "Raise with the North principal",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-(--line) bg-(--surface-strong) px-3 py-1.5 text-[0.7rem] text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Governance footer */}
          <div data-console-step style={{ "--d": "2.5s" } as React.CSSProperties}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[1.1rem] bg-(--surface-muted) px-4 py-3">
              {[
                { icon: ShieldCheck, text: "Scoped to your role" },
                { icon: ScrollText, text: "Question recorded on the audit trail" },
                { icon: Eye, text: "Read-only: AEGIS takes no action" },
              ].map((item) => (
                <span
                  key={item.text}
                  className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground"
                >
                  <item.icon className="size-3 text-(--teal)" />
                  {item.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
