import { Plus } from "lucide-react";
import { cn } from "@fairhelm/ui/lib/utils";

/**
 * Native <details>/<summary> FAQ: keyboard-operable, screen-reader-announced
 * and fully functional with JavaScript disabled — no hydration required for a
 * reader to open every answer.
 *
 * Callers pass the same array they build their FAQPage JSON-LD from, so the
 * structured data always matches what is on screen.
 */
export function DetailsFaq({
  items,
  columns = 2,
  className,
}: {
  items: ReadonlyArray<{ question: string; answer: string }>;
  columns?: 1 | 2;
  className?: string;
}) {
  return (
    // `items-start` matters: without it the grid stretches every card in a row
    // to match the tallest one, so opening one answer inflates its neighbour
    // into a large empty panel.
    <div className={cn("grid items-start gap-3", columns === 2 && "md:grid-cols-2", className)}>
      {items.map((faq) => (
        <details
          key={faq.question}
          className="group surface-quiet rounded-[var(--radius-panel)] px-5 transition-colors open:border-[color:var(--line-strong)] open:bg-[color:var(--surface-muted)]"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-sm font-medium text-[color:var(--foreground)] [&::-webkit-details-marker]:hidden">
            <span>{faq.question}</span>
            <Plus
              aria-hidden
              className="mt-0.5 size-4 shrink-0 text-[color:var(--brand)] transition-transform duration-200 group-open:rotate-45"
            />
          </summary>
          <p className="type-support border-t border-[color:var(--line)] pb-5 pt-4">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
