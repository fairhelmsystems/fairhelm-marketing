import { ArrowRight } from "lucide-react";
import type { OperationalPain } from "@/content/operational-pains";
import { operationalPains } from "@/content/operational-pains";
import { cn } from "@fairhelm/ui/lib/utils";

/**
 * The pain → remedy pattern.
 *
 * Every card runs the same four beats in the same order, so the reader learns
 * the shape once: what hurts, what it quietly costs, what replaces it, and who
 * owns the result. `measure` is what a pilot would measure — never a claimed
 * outcome.
 */

function PainCard({ item }: { item: OperationalPain }) {
  return (
    <article className="surface-panel flex flex-col rounded-[var(--radius-panel)] p-6 sm:p-7">
      <p className="eyebrow">{item.area}</p>

      <p className="type-card-title mt-4 text-[color:var(--foreground)]">{item.pain}</p>

      <p className="type-support mt-3 border-l-2 border-[color:var(--state-attention)] pl-4">
        {item.hiddenCost}
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-[var(--radius-chip)] border border-[color:var(--line-strong)] bg-[color:var(--brand-tint)] px-4 py-4">
        <ArrowRight aria-hidden className="mt-0.5 size-4 shrink-0 text-[color:var(--brand)]" />
        <p className="type-support text-[color:var(--foreground)]">{item.remedy}</p>
      </div>

      <dl className="mt-auto grid gap-3 pt-6 sm:grid-cols-2">
        <div>
          <dt className="eyebrow">Accountable owner</dt>
          <dd className="type-support mt-1.5">{item.owner}</dd>
        </div>
        <div>
          <dt className="eyebrow">Pilot measures</dt>
          <dd className="type-support mt-1.5">{item.measure}</dd>
        </div>
      </dl>
    </article>
  );
}

export function PainRemedyGrid({
  ids,
  className,
}: {
  /** Which pains to show. Omit for all of them. */
  ids?: readonly string[];
  className?: string;
}) {
  const items = ids
    ? ids.map((id) => operationalPains.find((p) => p.id === id)).filter(Boolean)
    : operationalPains;

  return (
    <div className={cn("grid items-stretch gap-4 lg:grid-cols-2", className)}>
      {(items as OperationalPain[]).map((item) => (
        <PainCard key={item.id} item={item} />
      ))}
    </div>
  );
}
