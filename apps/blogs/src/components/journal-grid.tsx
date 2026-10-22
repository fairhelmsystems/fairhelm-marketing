import { ArrowUpRight, Building2, GraduationCap } from "lucide-react";
import { IconBadge } from "@fairhelm/ui/components/resource-card";
import Image from "next/image";
import Link from "next/link";
export type JournalEntry = {
  path: string;
  title: string;
  summary: string;
  date: string;
  readingTime: string;
  category: string;
  team: string;
  image?: { src: string; alt: string };
};
export function JournalGrid({ posts }: { posts: readonly JournalEntry[] }) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <article
          key={post.path}
          className="surface-panel group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[var(--radius-panel)]"
        >
          {post.image ? (
            <div className="relative aspect-video overflow-hidden border-b border-(--line)">
              <Image
                src={post.image.src}
                alt={post.image.alt}
                fill
                sizes="(min-width:1280px) 30vw,(min-width:768px) 45vw,100vw"
                className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
              />
            </div>
          ) : (
            <div
              aria-hidden
              className="relative flex aspect-video items-end overflow-hidden border-b border-(--line) bg-(--surface-strong) p-6"
            >
              <span className="font-display text-6xl tracking-tight text-(--brand)/30">
                {post.team}
              </span>
            </div>
          )}
          <div className="flex flex-1 flex-col p-6">
            <p className="eyebrow flex items-center gap-3">
              <IconBadge className="size-8 rounded-xl">
                {post.team === "Fairhelm" ? (
                  <Building2 className="size-4" />
                ) : (
                  <GraduationCap className="size-4" />
                )}
              </IconBadge>
              <span>
                {post.team} · {post.category}
              </span>
            </p>
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              <time dateTime={post.date}>
                {new Date(`${post.date}T00:00:00Z`).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </time>{" "}
              · {post.readingTime}
            </p>
            <h2 className="type-card-title mt-4">
              <Link
                href={post.path}
                className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-(--brand)"
              >
                {post.title}
              </Link>
            </h2>
            <p className="type-body mt-4 text-muted-foreground">{post.summary}</p>
            <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm text-(--brand)">
              Read the story <ArrowUpRight aria-hidden className="size-4" />
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
