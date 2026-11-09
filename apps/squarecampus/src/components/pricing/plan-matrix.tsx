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

const planName = (id: string) => plans.find((plan) => plan.id === id)?.name ?? id;

export function PlanMatrix() {
  return (
    <div className="mt-8">
      <h3 className="type-card-title mb-4">Actual inclusions, side by side.</h3>
      {/* The plan cards above already summarise each plan; on a phone the
          full matrix is one tap away (MobileExpand) instead of a long wall. */}

      <section
        aria-label="Plan comparison, scroll horizontally on smaller screens"
        className="surface-panel rounded-[var(--radius-panel-lg)] p-5 sm:overflow-x-auto sm:p-6 lg:p-8"
      >
        {/* On phones each dimension restacks as one block listing the three
              plans (.compare-stack); from sm up it is the full table. */}
        <table className="compare-stack w-full border-collapse text-left sm:min-w-[46rem]">
          <caption className="sr-only">
            SquareCampus plan comparison across operational scope, visibility, accountability,
            structure, integrations, intelligence, deployment and support. Annual rates and
            progressive student slabs are public. Optional services and additional usage are
            separate.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-[15rem] pb-5 pr-6 align-bottom">
                <span>Included scope</span>
              </th>
              {plans.map((plan) => (
                <th key={plan.id} scope="col" className="pb-5 pr-6 align-bottom last:pr-0">
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
                  { key: "starter", content: row.starter, label: planName("starter") },
                  { key: "pro", content: row.pro, label: planName("pro") },
                  { key: "enterprise", content: row.enterprise, label: planName("enterprise") },
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
