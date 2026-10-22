import { Check, Database, Layers, ShieldCheck, Sparkles } from "lucide-react";
import type { ElementType } from "react";
import { systemLayers } from "@/content/what-is-squarecampus";

const layerIcons: Record<string, ElementType> = {
  record: Database,
  workflow: Layers,
  governance: ShieldCheck,
  intelligence: Sparkles,
};

/**
 * The four layers, outcome first.
 *
 * `showCapabilities` controls whether the capability list appears. The list is
 * evidence that the operating backbone is complete — it deliberately sits
 * below the outcome rather than leading, so the page never reads as a module
 * inventory.
 */
export function SystemLayerGrid({ showCapabilities = false }: { showCapabilities?: boolean }) {
  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      {systemLayers.map((layer, index) => {
        const Icon = layerIcons[layer.id];

        return (
          <article
            key={layer.id}
            className="surface-panel flex flex-col rounded-[var(--radius-panel)] p-6 sm:p-7"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-tint)]">
                {Icon ? <Icon aria-hidden className="size-4 text-[color:var(--brand)]" /> : null}
              </span>
              <div className="min-w-0">
                <p className="type-caption text-[color:var(--brand)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="text-base font-medium tracking-[-0.02em] text-[color:var(--foreground)]">
                  {layer.name}
                </h3>
              </div>
            </div>

            {/* Outcome before capability, always. */}
            <p className="type-card-title mt-5 text-[color:var(--foreground)]">{layer.outcome}</p>
            <p className="type-support mt-3">{layer.body}</p>

            {showCapabilities ? (
              <div className="mt-6 border-t border-[color:var(--line)] pt-5">
                <p className="eyebrow">What that includes</p>
                <ul className="mt-3 grid gap-2">
                  {layer.capabilities.map((capability) => (
                    <li key={capability} className="type-support flex gap-2.5">
                      <Check
                        aria-hidden
                        className="mt-1 size-3.5 shrink-0 text-[color:var(--brand)]"
                      />
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
