import type { FaqItem } from "@/content/faq";

/**
 * Always-visible question list. No accordion: the answers are the content a
 * search engine and an assistant should index, so they stay in the DOM.
 */
export function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <dl className="grid gap-4 md:grid-cols-2">
      {items.map((item, index) => (
        <div key={item.question} className="surface-panel rounded-[var(--radius-panel)] p-5 sm:p-6">
          <span className="index">{String(index + 1).padStart(2, "0")}</span>
          <dt className="display-3 mt-3">{item.question}</dt>
          <dd className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</dd>
        </div>
      ))}
    </dl>
  );
}
