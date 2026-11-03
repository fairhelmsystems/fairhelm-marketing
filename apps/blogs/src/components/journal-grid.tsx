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

const dateFormat: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
};

/**
 * The story index. On a phone each story is one compact row (a small
 * thumbnail beside the title and its meta) so 25 stories read as a list, not
 * 15,000px of stacked cards; the summary joins from md up, where the card
 * takes its full shape. The whole card is the link (the title's ::after).
 */
export function JournalGrid({ posts }: { posts: readonly JournalEntry[] }) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
      {posts.map((post) => (
        <article
          key={post.path}
          className="surface-panel relative grid min-w-0 grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-4 overflow-hidden rounded-[var(--radius-panel)] p-3 transition-colors hover:bg-(--surface-strong) md:flex md:h-full md:flex-col md:gap-0 md:p-0"
        >
          {post.image ? (
            <div className="relative aspect-square overflow-hidden rounded-xl md:aspect-video md:w-full md:rounded-none md:border-b md:border-(--line)">
              <Image
                src={post.image.src}
                alt={post.image.alt}
                fill
                sizes="(min-width:1280px) 30vw,(min-width:768px) 45vw,88px"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              aria-hidden
              className="relative flex aspect-square items-end overflow-hidden rounded-xl bg-(--surface-strong) p-2 md:aspect-video md:w-full md:rounded-none md:border-b md:border-(--line) md:p-6"
            >
              <span className="font-display text-sm tracking-tight text-(--brand-ink) md:text-6xl">
                {post.team}
              </span>
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col md:p-6">
            <h2 className="type-card-title">
              <Link
                href={post.path}
                className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-(--brand)"
              >
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground md:mt-3 md:text-sm">
              <span>{post.team}</span>
              <span>{post.category}</span>
              <time dateTime={post.date}>
                {new Date(`${post.date}T00:00:00Z`).toLocaleDateString("en-GB", dateFormat)}
              </time>
              <span>{post.readingTime}</span>
            </p>
            <p className="type-body mt-4 hidden text-muted-foreground md:block">{post.summary}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
