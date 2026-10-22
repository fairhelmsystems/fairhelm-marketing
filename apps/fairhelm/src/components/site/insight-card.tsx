import { blogHref } from "@fairhelm/config/urls";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CardMotif, type Motif } from "@/components/site/card-motif";
import { formatInsightDate, type Insight } from "@/content/insights";
import { cn } from "@fairhelm/ui/lib/utils";

/** Cover image path convention: public/insights/<slug>.webp, optional. */
export function insightCover(slug: string): string {
  return blogHref(`/insights/${slug}.webp`);
}

const categoryMotif: Record<string, Motif> = {
  "Data engineering": "flow",
  "Decision systems": "bars",
  Governance: "shield",
  Company: "grid",
};

export function motifForCategory(category: string): Motif {
  return categoryMotif[category] ?? "nodes";
}

export function InsightCard({
  post,
  featured = false,
  hasCover = Boolean(post.cover),
  className,
}: {
  post: Insight;
  featured?: boolean;
  hasCover?: boolean;
  className?: string;
}) {
  return (
    <article
      data-slot="card"
      className={cn(
        "group/card relative flex h-full flex-col overflow-hidden surface-panel rounded-[var(--radius-panel)]",
        featured && "lg:grid lg:grid-cols-[1.1fr_0.9fr]",
        className
      )}
    >
      {hasCover ? (
        <div
          className={cn(
            "relative aspect-[16/9] overflow-hidden border-b border-border bg-secondary",
            featured && "lg:aspect-auto lg:border-r lg:border-b-0"
          )}
        >
          <Image
            src={insightCover(post.slug)}
            alt=""
            fill
            sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "33vw"}
            className={cn("object-cover", featured && "lg:object-right")}
          />
        </div>
      ) : (
        <CardMotif motif={motifForCategory(post.category)} />
      )}
      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="chip">{post.category}</span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 text-muted-foreground transition-colors group-hover/card:text-[color:var(--brand-ink)]"
          />
        </div>
        <p className="mt-4 font-mono text-[0.62rem] tracking-[0.18em] text-muted-foreground uppercase">
          <time dateTime={post.date}>{formatInsightDate(post.date)}</time>
          <span className="mx-2">·</span>
          {post.minutes} min read
        </p>
        <h3 className={cn("display-3 mt-3", featured && "lg:text-[1.75rem]")}>
          <Link
            href={blogHref(post.path)}
            className="after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{post.description}</p>
        <p className="mt-auto pt-5 text-sm font-medium text-[color:var(--brand-ink)]">
          Read the note
        </p>
      </div>
    </article>
  );
}
