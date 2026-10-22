"use client";

import { PreviewCard } from "@base-ui/react/preview-card";
import type { SourceReference } from "@fairhelm/squarecampus-content/retention";
import { formatIsoDate } from "@fairhelm/ui/lib/utils";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { SourceThumbnail } from "./source-thumbnail";

/**
 * An inline citation with a preview of its official source.
 *
 * The trigger is an ordinary in-page link to the reference list, so it works
 * without JavaScript, on touch screens (a tap jumps to the full reference) and
 * in the Markdown alternate. On hover or keyboard focus, Base UI's PreviewCard
 * shows a neon sketch of the document (see SourceThumbnail), the instrument,
 * issuer, what it covers and its official host. Everything is rendered from
 * props: no screenshot, no third-party request, and only public reference
 * fields ever reach the browser.
 */
export function CitationPreview({
  reference,
  children,
}: {
  reference: SourceReference;
  children: ReactNode;
}) {
  return (
    <PreviewCard.Root>
      <PreviewCard.Trigger
        href={`#ref-${reference.id}`}
        className="text-foreground underline decoration-[color:var(--brand)]/50 decoration-1 underline-offset-[3px] transition-colors hover:decoration-[color:var(--brand)] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)] data-popup-open:decoration-[color:var(--brand)] dark:decoration-[color:var(--cite-neon)]/60 dark:hover:decoration-[color:var(--cite-neon)] dark:hover:[text-shadow:0_0_12px_color-mix(in_oklch,var(--cite-neon)_55%,transparent)]"
      >
        {children}
      </PreviewCard.Trigger>
      <PreviewCard.Portal>
        <PreviewCard.Positioner sideOffset={10} className="z-50">
          <PreviewCard.Popup className="w-[min(22rem,calc(100vw-2rem))] origin-[var(--transform-origin)] rounded-[1.1rem] border border-[color:var(--line-strong)] bg-background p-4 text-left shadow-[0_24px_60px_rgba(8,15,30,0.18)] dark:border-[color:var(--cite-neon)]/35 dark:shadow-[0_0_48px_-16px_var(--cite-neon),0_24px_60px_rgba(0,0,0,0.6)] transition-[transform,opacity] duration-150 ease-out data-ending-style:scale-[0.97] data-ending-style:opacity-0 data-starting-style:scale-[0.97] data-starting-style:opacity-0 motion-reduce:transition-none">
            <SourceThumbnail host={reference.host} seed={reference.id} />
            <p className="mt-3.5 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[color:var(--brand)]">
              Official source · {reference.host}
            </p>
            <p className="mt-2 font-display text-base leading-snug tracking-[-0.02em] text-foreground">
              {reference.title}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{reference.issuer}</p>
            <p className="mt-3 text-[0.8rem] leading-5 text-muted-foreground">{reference.covers}</p>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-[color:var(--line)] pt-3">
              <span className="text-[0.7rem] text-muted-foreground">
                Source checked {formatIsoDate(reference.checkedOn)}
              </span>
              <a
                href={reference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-[color:var(--brand)]"
              >
                Open
                <ArrowUpRight aria-hidden className="size-3.5" />
              </a>
            </div>
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  );
}
