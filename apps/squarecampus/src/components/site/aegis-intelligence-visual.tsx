"use client";

import {
  BellRing,
  BookOpenCheck,
  ChartNoAxesCombined,
  Check,
  Fingerprint,
  MessageSquareShare,
  Radar,
  WalletCards,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@fairhelm/ui/lib/utils";

const sources = [
  {
    title: "Roles and access",
    detail: "Trustees, principals, finance, teachers, parents",
    icon: Fingerprint,
  },
  {
    title: "Admissions",
    detail: "Applications, documents, offers, enrollment",
    icon: BookOpenCheck,
  },
  {
    title: "Attendance",
    detail: "Classroom signal, staff follow-through, exceptions",
    icon: BellRing,
  },
  {
    title: "Finance ledger",
    detail: "Dues, receipts, concessions, approval history",
    icon: WalletCards,
  },
  {
    title: "Communication",
    detail: "App messages, circulars, acknowledgements",
    icon: MessageSquareShare,
  },
  {
    title: "Leadership view",
    detail: "Campus health, branch risk, cross-team visibility",
    icon: ChartNoAxesCombined,
  },
] as const;

const governanceChecks = [
  { label: "Tenant boundary", width: "100%" },
  { label: "Role-scoped answers", width: "100%" },
  { label: "Audit trail per question", width: "100%" },
  { label: "Read-only: no actions taken", width: "100%" },
] as const;

const capabilities = ["Role-aware answers", "Exception detection", "Audit-ready by default"];

/** Entrance timing (ms). Beams and packets key off the same base so packets
 *  never travel a beam that has not been drawn yet. */
const T = {
  hub: 80,
  source: 260,
  sourceStep: 70,
  beam: 520,
  beamStep: 60,
  check: 900,
  checkStep: 150,
  chip: 1250,
  chipStep: 70,
  loop: 1500,
  loopStep: 420,
};

type Vars = React.CSSProperties & Record<`--${string}`, string>;

/**
 * The AEGIS signal bus: six record streams feeding one governed
 * intelligence layer. Three sources sit above the hub and three below, each
 * wired to a hub port by a vertical beam that carries data packets inward.
 *
 * The layout is a container-query grid, so the composition holds at every
 * column width it is placed in. Every animation is transform/opacity only
 * and lives in `.aegis-visual` rules in globals.css; this component flips
 * `.is-live` once the visual scrolls into view and `.is-paused` while it is
 * off-screen so the ambient loops cost nothing when nobody is looking.
 */
export function AegisIntelligenceVisual({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add("is-live");
            node.classList.remove("is-paused");
          } else if (node.classList.contains("is-live")) {
            node.classList.add("is-paused");
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 }
    );

    observer.observe(node);
    // Never leave the visual hidden if the observer misfires.
    const timeout = setTimeout(() => node.classList.add("is-live"), 4000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  const renderSpoke = (index: number, side: "top" | "bottom") => {
    const item = sources[index];
    const loopDelay = `${T.loop + index * T.loopStep}ms`;
    return (
      <div
        key={item.title}
        className={cn("aegis-spoke group flex flex-col", side === "top" ? "" : "flex-col-reverse")}
      >
        <div
          data-aegis-sat
          data-side={side}
          style={{ "--d": `${T.source + index * T.sourceStep}ms` } as Vars}
          className="relative rounded-[1.25rem] border border-(--line) bg-(--surface) p-3.5 shadow-(--shadow-1) transition-[border-color,translate] duration-300 group-hover:border-(--line-strong) sm:p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-(--brand-tint)">
              <item.icon className="size-4 text-(--brand)" />
            </span>
            <span
              data-aegis-dot
              style={{ "--d": loopDelay } as Vars}
              className="mt-1 size-1.5 rounded-full bg-(--brand)"
            />
          </div>
          <p className="mt-3 font-display text-[0.92rem] leading-snug tracking-[-0.03em] text-foreground">
            {item.title}
          </p>
          <p className="mt-1.5 text-[0.7rem] leading-[1.15rem] text-muted-foreground">
            {item.detail}
          </p>
        </div>

        <div
          data-aegis-beam
          data-side={side}
          aria-hidden="true"
          style={
            {
              "--d": `${T.beam + index * T.beamStep}ms`,
              "--loop-d": loopDelay,
            } as Vars
          }
          className="relative hidden h-(--beam) w-full @lg:block"
        >
          <span className="aegis-beam-line" />
          <span className="aegis-packet" />
          <span className="aegis-port" />
        </div>
      </div>
    );
  };

  return (
    <div data-md-skip ref={ref} className={cn("aegis-visual @container relative", className)}>
      <div className="surface-panel-strong relative overflow-hidden rounded-4xl p-4 sm:p-5 md:p-6">
        {/* Ambient light behind the hub. Plain gradients, no filter blur. */}
        <div className="pointer-events-none absolute inset-x-[10%] top-[30%] h-[40%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(88,124,204,0.16),transparent_68%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(88,124,204,0.14),transparent_70%)]" />

        <div className="relative grid grid-cols-2 gap-3 @lg:block">
          {/* Sources above the hub */}
          <div className="contents @lg:grid @lg:grid-cols-3 @lg:gap-3">
            {[0, 1, 2].map((index) => renderSpoke(index, "top"))}
          </div>

          {/* The governed intelligence layer */}
          <div
            data-aegis-hub
            style={{ "--d": `${T.hub}ms` } as Vars}
            className="order-first col-span-2 relative rounded-[1.6rem] border border-(--line-strong) bg-(--surface-strong) p-5 shadow-(--shadow-3) @lg:order-none sm:p-6"
          >
            <span className="aegis-ring" aria-hidden="true" />

            <div className="relative grid gap-6 @xl:grid-cols-[1.05fr_0.95fr] @xl:gap-8">
              <div>
                <p className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-muted-foreground">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand-soft),transparent_70%)]">
                    <Radar className="size-3 text-(--brand)" />
                  </span>
                  AEGIS · Governed intelligence
                </p>

                <h3 className="mt-4 font-display text-[1.45rem] leading-[1.15] tracking-[-0.045em] text-foreground sm:text-2xl">
                  Institution records in.
                  <br />
                  Governed answers out.
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  AEGIS is designed to read each record where it already lives, without exporting or
                  re-keying it, inside the same permissions and audit trail as the rest of the
                  School OS.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {capabilities.map((item, index) => (
                    <span
                      key={item}
                      data-aegis-rise
                      style={{ "--d": `${T.chip + index * T.chipStep}ms` } as Vars}
                      className="rounded-full border border-(--line) bg-(--surface) px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col rounded-[1.2rem] border border-(--line) bg-(--surface-sunken) p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Governance checks
                  </p>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-(--line) bg-(--surface) px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Illustrative
                  </span>
                </div>
                <div className="mt-3.5 space-y-3">
                  {governanceChecks.map((check, index) => {
                    const delay = `${T.check + index * T.checkStep}ms`;
                    return (
                      <div key={check.label} data-aegis-check style={{ "--d": delay } as Vars}>
                        <div className="mb-1.5 flex items-center justify-between gap-3 text-[0.68rem]">
                          <span className="text-foreground">{check.label}</span>
                          <span className="aegis-status relative font-mono text-[0.6875rem] uppercase tracking-[0.16em]">
                            <span className="aegis-status-pending text-muted-foreground">
                              Checking
                            </span>
                            <span className="aegis-status-done inline-flex items-center gap-1 text-(--state-ok)">
                              <Check className="size-2.5" strokeWidth={3} />
                              Applied
                            </span>
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-(--surface-muted)">
                          <div
                            data-aegis-bar
                            style={{ width: check.width }}
                            className="h-full rounded-full bg-[linear-gradient(90deg,var(--brand),var(--teal))]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="mt-auto border-t border-(--line) pt-3.5 text-[0.68rem] leading-5 text-muted-foreground">
                  How AEGIS is designed to answer. Not a measurement of any institution.
                </p>
              </div>
            </div>
          </div>

          {/* Sources below the hub */}
          <div className="contents @lg:grid @lg:grid-cols-3 @lg:gap-3">
            {[3, 4, 5].map((index) => renderSpoke(index, "bottom"))}
          </div>
        </div>
      </div>
    </div>
  );
}
