import { RetentionPointer } from "@/components/pricing/retention-pointer";
import { ComparisonRow } from "@fairhelm/ui/components/marketing";
import { planComparisonRows } from "@/content/commercial";
import { plans, SCOPE_NOTE } from "@/content/pricing";

/**
 * At-a-glance comparison for procurement readers.
 *
 * A real <table> with row headers and column headers, so the relationship
 * between a dimension and a plan survives screen-reader navigation. It is
 * available at every width, alongside the stacked plan bands.
 */

export function PlanMatrix() {
  return (
    <div className="mt-8">
      <h3 className="eyebrow mb-4">At a glance</h3>
      <section
        aria-label="Plan comparison, scroll horizontally on smaller screens"
        className="surface-panel overflow-x-auto rounded-[var(--radius-panel-lg)] p-6 focus-visible:outline-2 focus-visible:outline-[color:var(--brand)] lg:p-8"
      >
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <caption className="sr-only">
            SquareCampus plan comparison across operational scope, visibility, accountability,
            structure, integrations, intelligence, deployment and support. The licensing model is
            published; figures are issued in a written proposal after institutional discovery.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-[15rem] pb-5 pr-6 align-bottom">
                <span className="eyebrow">Dimension</span>
              </th>
              {plans.map((plan) => (
                <th key={plan.id} scope="col" className="pb-5 pr-6 align-bottom last:pr-0">
                  <span className="type-caption block text-[color:var(--brand)]">{plan.step}</span>
                  <span className="mt-2 block font-display text-xl tracking-[-0.04em] text-[color:var(--foreground)]">
                    {plan.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {planComparisonRows.map((row) => (
              <ComparisonRow
                key={row.label}
                label={row.label}
                values={[
                  { key: "starter", content: row.starter },
                  { key: "pro", content: row.pro },
                  { key: "enterprise", content: row.enterprise },
                ]}
              />
            ))}
          </tbody>
        </table>
      </section>
      <p className="type-caption mt-4">{SCOPE_NOTE}</p>
      <RetentionPointer className="mt-3" />
    </div>
  );
}
