import type { ReactNode } from "react";
import { ComparisonRow } from "@fairhelm/ui/components/marketing";
import { cn } from "@fairhelm/ui/lib/utils";

/**
 * A procurement-grade fact table: a real <table> with a caption, column
 * headers and row headers, so the relationship between a dimension and a
 * column survives screen readers, crawlers and the Markdown alternates.
 *
 * Used for the buyer-decision tables (what Enterprise adds, identity by plan,
 * multi-campus governance versus multi-campus support). Content comes from
 * content/commercial.ts; nothing here invents a fact.
 */
export function FactTable({
  caption,
  columns,
  rows,
  className,
}: {
  caption: string;
  columns: ReadonlyArray<{ key: string; label: string }>;
  rows: ReadonlyArray<{ label: string; values: ReadonlyArray<ReactNode> }>;
  className?: string;
}) {
  return (
    <section
      aria-label={caption}
      className={cn(
        "surface-panel overflow-x-auto rounded-[var(--radius-panel-lg)] p-6 focus-visible:outline-2 focus-visible:outline-[color:var(--brand)] lg:p-8",
        className
      )}
    >
      <table className="w-full min-w-[40rem] border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className="w-[13rem] pb-4 pr-6 align-bottom">
              <span className="eyebrow">Dimension</span>
            </th>
            {columns.map((column) => (
              <th key={column.key} scope="col" className="pb-4 pr-6 align-bottom last:pr-0">
                <span className="text-sm font-medium text-[color:var(--foreground)]">
                  {column.label}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <ComparisonRow
              key={row.label}
              label={row.label}
              values={row.values.map((content, index) => ({
                key: columns[index]?.key ?? String(index),
                content,
              }))}
            />
          ))}
        </tbody>
      </table>
    </section>
  );
}
