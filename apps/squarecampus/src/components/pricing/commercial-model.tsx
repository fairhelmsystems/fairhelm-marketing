import { Layers, Network, Route, Users } from "lucide-react";
import type { ElementType } from "react";
import { Eyebrow } from "@fairhelm/ui/components/marketing";
import { modelDimensions } from "@/content/pricing";

const dimensionIcons: Record<string, ElementType> = {
  scale: Users,
  depth: Layers,
  complexity: Network,
  delivery: Route,
};

/**
 * The four commercial inputs, without implying an arithmetic pricing formula:
 *
 *   Scale, plan depth, institutional complexity and delivery requirements
 *
 * There are deliberately no values here. The page explains what the licence is
 * composed of; the proposal is what carries figures.
 */
export function CommercialModel() {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.86fr_1.14fr] lg:gap-5">
      <div className="surface-panel-strong flex flex-col justify-between rounded-[var(--radius-panel-lg)] p-6 sm:p-8">
        <div>
          <Eyebrow>Proposal inputs</Eyebrow>
          <p className="type-section-title mt-4 text-[color:var(--foreground)]">
            Annual platform licence
          </p>
          <p className="type-body mt-4 text-[color:var(--muted-foreground)]">
            One annual institutional licence, assessed against these four inputs during scoping.
            Migration, integrations and other separately quoted services remain distinct lines.
          </p>
        </div>

        <dl className="mt-8 space-y-3 border-t border-[color:var(--line)] pt-6">
          {modelDimensions.map((dimension) => (
            <div key={dimension.id} className="flex items-baseline gap-3">
              <span
                aria-hidden
                className="w-4 shrink-0 font-mono text-sm text-[color:var(--brand)]"
              >
                •
              </span>
              <dt className="type-card-title text-[color:var(--foreground)]">{dimension.term}</dt>
              <dd className="type-support ml-auto text-right">{dimension.summary}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {modelDimensions.map((dimension) => {
          const Icon = dimensionIcons[dimension.id];

          return (
            <article key={dimension.id} className="surface-panel rounded-[var(--radius-panel)] p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-[color:var(--brand-tint)]">
                  {Icon ? <Icon aria-hidden className="size-4 text-[color:var(--brand)]" /> : null}
                </span>
                <h3 className="type-card-title text-[color:var(--foreground)]">{dimension.term}</h3>
              </div>
              <p className="eyebrow mt-4">{dimension.summary}</p>
              <p className="type-body mt-3 text-[color:var(--muted-foreground)]">
                {dimension.body}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
