import { BarChart3, Gauge, KeyRound, LifeBuoy, Server, Smartphone } from "lucide-react";
import { optionalEnhancements } from "@/content/commercial";
import { licenceIncludes, WHITE_LABEL_NOTE } from "@/content/pricing";

const icons = [KeyRound, Smartphone, Gauge, BarChart3, Server, LifeBuoy] as const;

/** Commercial treatment stays with each enhancement, not inferred from its plan. */
export function ScopedCostGrid() {
  return (
    <div>
      <section className="surface-panel-strong mb-6 rounded-[var(--radius-panel-lg)] p-6 sm:p-8">
        <h3 className="eyebrow">In every licence</h3>
        <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {licenceIncludes.map((item) => (
            <li key={item.id}>
              <h4 className="font-medium">
                {item.title}
                {item.plans ? ` — ${item.plans}` : ""}
              </h4>
              <p className="type-support mt-2">{item.detail}</p>
            </li>
          ))}
        </ul>
        <p className="type-support mt-5">{WHITE_LABEL_NOTE}</p>
      </section>
      <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {optionalEnhancements.map((enhancement, index) => {
          const Icon = icons[index];
          return (
            <article
              key={enhancement.name}
              className="surface-quiet rounded-[var(--radius-panel)] p-6 sm:p-7"
            >
              <Icon aria-hidden className="size-5 text-[color:var(--brand)]" />
              <h3 className="mt-4 text-base font-medium tracking-[-0.02em]">{enhancement.name}</h3>
              <p className="type-caption mt-3 text-[color:var(--brand)]">{enhancement.treatment}</p>
              <p className="type-support mt-3">{enhancement.body}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
