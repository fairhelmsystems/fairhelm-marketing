import { FeaturePanel } from "@fairhelm/ui/components/marketing";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { CardMotif, type Motif } from "@/components/site/card-motif";
import { cn } from "@fairhelm/ui/lib/utils";

/**
 * The family's standard card. Header row: icon tile on the left (or the mono
 * index when there is no icon); index and link arrow on the right. When
 * `href` is given the title is a stretched link, so the whole card is
 * clickable while the Markdown alternate keeps its heading structure.
 */
export function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
  meta,
  index,
  motif,
  children,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  href?: string;
  meta?: string;
  index?: string;
  motif?: Motif;
  children?: ReactNode;
  className?: string;
}) {
  const external = href ? /^https?:/.test(href) : false;
  const linkClass = "after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none";

  return (
    <FeaturePanel
      className={cn(
        "group/card relative flex h-full flex-col overflow-hidden has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring/50",
        className
      )}
    >
      {motif ? <CardMotif motif={motif} /> : null}
      <div className="relative flex items-start justify-between gap-4">
        {Icon ? (
          <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-secondary text-[color:var(--brand-ink)]">
            <Icon aria-hidden="true" className="size-4" />
          </span>
        ) : (
          <span className="index pt-1">{index}</span>
        )}
        <span className="flex items-center gap-3 pt-1">
          {Icon && index ? <span className="index">{index}</span> : null}
          {href ? (
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 text-muted-foreground transition-colors group-hover/card:text-[color:var(--brand-ink)]"
            />
          ) : null}
        </span>
      </div>
      <h3 className={cn("relative display-3", Icon ? "mt-5" : "mt-4")}>
        {href ? (
          external ? (
            <a href={href} className={linkClass}>
              {title}
            </a>
          ) : (
            <Link href={href} className={linkClass}>
              {title}
            </Link>
          )
        ) : (
          title
        )}
      </h3>
      <p className="relative mt-2.5 text-sm leading-6 text-muted-foreground">{description}</p>
      {children}
      {meta ? (
        <p className="mt-auto pt-5 font-mono text-[0.62rem] tracking-[0.2em] text-muted-foreground uppercase">
          {meta}
        </p>
      ) : null}
    </FeaturePanel>
  );
}
