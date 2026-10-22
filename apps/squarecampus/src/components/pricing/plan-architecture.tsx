"use client";

import { Check, ChevronDown, KeyRound, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState } from "react";
import { RetentionPointer } from "@/components/pricing/retention-pointer";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { OperationalBadge } from "@fairhelm/ui/components/marketing";
import { corePlatform } from "@/content/commercial";
import { type Plan, plans } from "@/content/pricing";
import { cn } from "@fairhelm/ui/lib/utils";

/**
 * Plan cards that expand.
 *
 * Three compact cards sit in one row with the essentials (name, positioning,
 * depth, who it suits). "See what's included" opens that plan's full band in a
 * panel beneath the row on desktop — one plan open at a time — and in a bottom
 * sheet on a phone. The band keeps the look of the original full-width bands.
 *
 * Closed panels stay in the served HTML as `hidden="until-found"` with
 * `data-md-include`, so search engines, find-in-page and the Markdown
 * alternates still see every plan's detail (see scripts/markdown-alternates.ts),
 * and find-in-page opens the panel it lands in. `until-found` hides content
 * but not the element's own box, so the panel's surface lives on an inner
 * element and the unstyled outer one collapses to nothing while closed.
 */

/** Phones get a bottom sheet instead; its code loads only when first opened. */
const BottomSheet = dynamic(() => import("@fairhelm/ui/components/bottom-sheet"), { ssr: false });

/** Matches Tailwind's `lg`: the breakpoint where the cards sit in one row. */
const DESKTOP_QUERY = "(min-width: 64rem)";

const cardTone = ["surface-panel", "surface-panel", "surface-panel-strong"] as const;
const railTone = [
  "bg-[color:var(--line-strong)]",
  "bg-[color:var(--brand)]/55",
  "bg-[color:var(--brand)]",
] as const;

function DepthMeter({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden className="flex items-center gap-1">
        {[0, 1, 2].map((segment) => (
          <span
            key={segment}
            className={cn(
              "h-1.5 w-5 rounded-full",
              segment < level
                ? "bg-[color:var(--brand)]"
                : "bg-[color:var(--line-strong)] opacity-60"
            )}
          />
        ))}
      </span>
      <span className="type-caption">Depth {level} of 3</span>
    </div>
  );
}

function Bullets({ items, icon }: { items: readonly string[]; icon: "check" | "plus" | "dot" }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item} className="type-support flex gap-2.5">
          {icon === "check" ? (
            <Check aria-hidden className="mt-1 size-3.5 shrink-0 text-[color:var(--brand)]" />
          ) : icon === "plus" ? (
            <Plus
              aria-hidden
              className="mt-1 size-3.5 shrink-0 text-[color:var(--muted-foreground)]"
            />
          ) : (
            <span
              aria-hidden
              className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-[color:var(--brand)]"
            />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PlanArchitecture() {
  const [open, setOpen] = useState<Plan["id"] | null>(null);
  const baseId = useId();
  const panelRefs = useRef<Record<string, HTMLElement | null>>({});

  // React serialises `hidden` as a plain boolean. Upgrade closed panels to
  // hidden="until-found" so find-in-page can reach (and open) them.
  useEffect(() => {
    for (const plan of plans) {
      const node = panelRefs.current[plan.id];
      if (node && open !== plan.id) node.setAttribute("hidden", "until-found");
    }
  }, [open]);

  // Find-in-page lands inside a closed panel: open that plan.
  useEffect(() => {
    const cleanups = plans.map((plan) => {
      const node = panelRefs.current[plan.id];
      if (!node) return () => undefined;
      const onMatch = () => setOpen(plan.id);
      node.addEventListener("beforematch", onMatch);
      return () => node.removeEventListener("beforematch", onMatch);
    });
    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, []);

  const [sheet, setSheet] = useState<Plan["id"] | null>(null);
  const sheetPlan = plans.find((plan) => plan.id === sheet);
  const sheetIndex = plans.findIndex((plan) => plan.id === sheet);

  const toggle = (id: Plan["id"]) => {
    if (!window.matchMedia(DESKTOP_QUERY).matches) {
      setSheet(id);
      return;
    }
    const next = open === id ? null : id;
    setOpen(next);
    if (next) {
      // Bring the opened panel into view without jumping past it.
      requestAnimationFrame(() =>
        panelRefs.current[next]?.scrollIntoView({ block: "nearest", behavior: "smooth" })
      );
    }
  };

  return (
    <>
      {sheetPlan ? (
        <BottomSheet
          open={sheet !== null}
          onOpenChange={(next) => {
            if (!next) setSheet(null);
          }}
          title={`${sheetPlan.name} in detail`}
          closeLabel="Close plan details"
        >
          <PlanDetail plan={sheetPlan} index={sheetIndex} />
        </BottomSheet>
      ) : null}
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
        {plans.map((plan, index) => {
          const isOpen = open === plan.id;
          return (
            <article
              key={plan.id}
              id={`plan-${plan.id}`}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-[var(--radius-panel-lg)] p-6 sm:p-7",
                cardTone[index],
                isOpen && "ring-2 ring-[color:var(--brand)]/60"
              )}
            >
              <span aria-hidden className={cn("absolute inset-y-0 left-0 w-1", railTone[index])} />
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="type-caption text-[color:var(--brand)]">{plan.step}</span>
                <h3 className="font-display text-2xl tracking-[-0.045em]">{plan.name}</h3>
                {plan.badge ? <OperationalBadge tone="brand">{plan.badge}</OperationalBadge> : null}
              </div>
              <p className="type-body mt-3 text-[color:var(--foreground)]">{plan.positioning}</p>
              <div className="mt-5">
                <DepthMeter level={index + 1} />
              </div>
              <p className="type-support mt-5 flex-1">
                <span className="font-medium text-[color:var(--foreground)]">Best for: </span>
                {plan.bestFor[0]}
              </p>
              <button
                type="button"
                aria-expanded={isOpen || sheet === plan.id}
                aria-controls={`${baseId}-${plan.id}`}
                onClick={() => toggle(plan.id)}
                className="mt-6 inline-flex min-h-11 items-center justify-between gap-2 rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface)] px-4 text-sm font-medium text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--surface-muted)]"
              >
                {isOpen ? "Hide details" : "See what's included"}
                <ChevronDown
                  aria-hidden
                  className={cn("size-4 transition-transform duration-200", isOpen && "rotate-180")}
                />
              </button>
            </article>
          );
        })}
      </div>
      {plans.map((plan, index) => (
        <section
          key={plan.id}
          id={`${baseId}-${plan.id}`}
          ref={(node) => {
            panelRefs.current[plan.id] = node;
          }}
          aria-label={`${plan.name} plan details`}
          data-md-include=""
          // React passes the string through; a closed panel stays findable.
          hidden={open !== plan.id}
          className="scroll-mt-28"
        >
          <div
            className={cn(
              "relative mt-4 overflow-hidden rounded-[var(--radius-panel-lg)] p-6 sm:mt-5 sm:p-8 lg:p-9",
              cardTone[index]
            )}
          >
            <span aria-hidden className={cn("absolute inset-y-0 left-0 w-1", railTone[index])} />
            <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="type-caption text-[color:var(--brand)]">{plan.step}</span>
              <p className="font-display text-xl tracking-[-0.04em]">{plan.name} in detail</p>
            </div>
            <PlanDetail plan={plan} index={index} />
          </div>
        </section>
      ))}
    </>
  );
}

function ScopedSeparately({ plan }: { plan: Plan }) {
  return (
    <div className="mt-6 border-t border-[color:var(--line)] pt-5">
      <p className="eyebrow">Scoped separately</p>
      <Bullets items={plan.scopedExtras} icon="plus" />
      <p className="type-support mt-3">
        <a href="#proposal" className="text-[color:var(--foreground)] underline underline-offset-4">
          What we need for a proposal
        </a>
      </p>
    </div>
  );
}

/**
 * The full band for one plan. Inclusions sit on the right; when the plan has an
 * identity card it follows them and the scoping detail moves left, so the card
 * sits high. Without one, the scoping detail follows the inclusions instead, so
 * the two columns stay balanced.
 */
function PlanDetail({ plan, index }: { plan: Plan; index: number }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
      <div>
        <div className="rounded-[var(--radius-chip)] border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-4">
          <p className="eyebrow">The problem it solves</p>
          <p className="type-support mt-2 text-[color:var(--muted-foreground)]">{plan.problem}</p>
        </div>

        <div className="mt-6">
          <p className="eyebrow">Best suited for</p>
          <Bullets items={plan.bestFor} icon="dot" />
        </div>

        {plan.spotlight ? <ScopedSeparately plan={plan} /> : null}

        <div className="mt-6 border-t border-[color:var(--line)] pt-5">
          <p className="eyebrow">Deployment</p>
          <p className="type-support mt-2">{plan.deployment}</p>
          <RetentionPointer className="mt-4" />
        </div>
      </div>

      <div className="flex flex-col">
        <p className="eyebrow">Core platform and plan depth</p>
        <p className="type-support mt-3">{corePlatform.included}</p>
        <p className="type-support mt-3">{corePlatform.multiCampus}</p>
        <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {plan.capabilities.map((capability) => (
            <li key={capability} className="type-support flex gap-2.5">
              <Check aria-hidden className="mt-1 size-3.5 shrink-0 text-[color:var(--brand)]" />
              <span>{capability}</span>
            </li>
          ))}
        </ul>

        {plan.spotlight ? (
          <div className="mt-6 rounded-[var(--radius-chip)] border border-[color:var(--line-strong)] bg-[color:var(--brand-tint)] px-5 py-5">
            <div className="flex items-center gap-2.5">
              <KeyRound aria-hidden className="size-4 text-[color:var(--brand)]" />
              <h4 className="text-sm font-medium text-[color:var(--foreground)]">
                {plan.spotlight.title}
              </h4>
            </div>
            <p className="type-support mt-3">{plan.spotlight.body}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {plan.spotlight.labels.map((label) => (
                <li key={label}>
                  <span className="inline-flex rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface)] px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-[color:var(--muted-foreground)]">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
            <p className="type-support mt-4">{plan.spotlight.note}</p>
          </div>
        ) : (
          <ScopedSeparately plan={plan} />
        )}

        <div className="mt-6 lg:mt-auto lg:pt-6">
          <ButtonLink
            href={plan.cta.href}
            label={plan.cta.label}
            variant={index === 2 ? "cta" : "secondary"}
            className="w-full justify-center sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
}
