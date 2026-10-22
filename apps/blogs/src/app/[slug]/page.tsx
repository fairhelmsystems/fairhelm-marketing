import { squarecampusHref } from "@fairhelm/config/urls";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import type { BlogSection } from "@fairhelm/squarecampus-content/blog/posts";
import {
  blogPostBySlug,
  blogPosts,
  relatedPosts,
  sectionSlug,
} from "@fairhelm/squarecampus-content/blog/posts";
import { canonicalUrl, createBreadcrumbSchema, SEO_CONFIG } from "@/lib/seo";
import { cn } from "@fairhelm/ui/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostBySlug(slug);
  if (!post) {
    return { title: "Blog" };
  }

  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical: canonicalUrl(`/${post.slug}`),
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      url: canonicalUrl(`/${post.slug}`),
      publishedTime: post.date,
      section: post.tag,
      tags: post.tags,
      images: post.image
        ? [{ url: post.image.src, alt: post.image.alt }]
        : [
            {
              url: "https://blogs.squarecampus.com/og/blog.png",
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: post.title,
      description: post.summary,
      ...(post.image && { images: [post.image.src] }),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPostBySlug(slug);
  if (!post) notFound();
  const related = relatedPosts(slug);

  const articleSchema = {
    "@type": "BlogPosting",
    "@id": `${canonicalUrl(`/${post.slug}`)}#article`,
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    mainEntityOfPage: canonicalUrl(`/${post.slug}`),
    inLanguage: "en-IN",
    ...(post.tag && { articleSection: post.tag }),
    ...(post.tags?.length && { keywords: post.tags.join(", ") }),
    author: {
      "@type": "Organization",
      name: "SquareCampus",
      url: "https://squarecampus.com",
    },
    publisher: { "@id": "https://squarecampus.com/#org" },
    ...(post.image && { image: post.image.src }),
    // Word count is a real, checkable property of the document, so it costs
    // nothing to state and helps a crawler judge depth. dateModified equals
    // datePublished until a post is actually revised — claiming a fresher
    // modification date than the content has is exactly the signal not to send.
    wordCount: post.sections.reduce(
      (total, section) =>
        total +
        section.paragraphs.join(" ").split(/\s+/).length +
        (section.bullets?.join(" ").split(/\s+/).length ?? 0),
      0
    ),
    dateModified: post.date,
  };

  return (
    <main tabIndex={-1} id="main-content" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              articleSchema,
              // Every other indexable page carries breadcrumbs; a post that
              // does not is the inconsistency search engines notice.
              createBreadcrumbSchema([
                { name: "Home", url: SEO_CONFIG.baseUrl },
                { name: "Blog", url: canonicalUrl("/") },
                { name: post.title, url: canonicalUrl(`/${post.slug}`) },
              ]),
            ],
          }),
        }}
      />
      <article className="mx-auto flex w-full max-w-3xl flex-col gap-12">
        <header className="space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            ← All posts
          </Link>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
            <span className="rounded-full border border-(--line) bg-(--surface) px-3 py-1.5">
              {post.tag ?? "Update"}
            </span>
            <span>{post.date}</span>
            <span>{post.readingTime}</span>
          </div>
          <div className="space-y-4">
            <p className="section-kicker">{post.hero.eyebrow}</p>
            <h1 className="font-display text-3xl leading-tight tracking-[-0.05em] sm:text-4xl md:text-5xl">
              {post.title}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              {post.hero.lede}
            </p>
          </div>
        </header>

        {post.image ? (
          <figure className="surface-panel overflow-hidden rounded-[1.6rem]">
            <Image
              src={post.image.src}
              alt={post.image.alt}
              width={1200}
              height={675}
              className="h-auto w-full object-cover"
              priority
            />
            <figcaption className="border-t border-(--line) px-6 py-4 text-sm text-muted-foreground">
              {post.image.caption}
            </figcaption>
          </figure>
        ) : null}

        {/*
          In-page contents. These posts run to nine or ten minutes, and a
          reader arriving from search usually wants one section rather than the
          whole thing. It doubles as a set of internal anchors a search engine
          can offer as jump links. Suppressed on genuinely short posts, where
          it would be furniture rather than navigation.
        */}
        {post.sections.length >= 5 ? (
          <nav aria-labelledby="post-contents" className="surface-quiet rounded-[1.4rem] p-6">
            <h2
              id="post-contents"
              className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground"
            >
              In this article
            </h2>
            <ol className="mt-4 grid gap-2 sm:grid-cols-2">
              {post.sections.map((section, index) => (
                <li key={section.heading} className="flex gap-3 text-sm leading-6">
                  <span className="font-mono text-[0.7rem] text-muted-foreground tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={`#${sectionSlug(section.heading)}`}
                    className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <section className="flex flex-col gap-12">
          {post.sections.map((section) => (
            <BlogSectionBlock key={section.heading} section={section} />
          ))}
        </section>

        <section className="surface-panel-strong rounded-[2rem] p-6 sm:p-8">
          <h3 className="font-display text-2xl tracking-[-0.04em]">{post.cta.heading}</h3>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">{post.cta.body}</p>
          <div className="mt-6">
            <ButtonLink href={squarecampusHref(post.cta.href)} label={post.cta.label} />
          </div>
        </section>

        {/*
          Related reading. Three links per post turns a flat list of articles
          into a browsable library — the reader gets somewhere to go next, and
          the crawler gets internal links between posts that would otherwise
          only ever be reachable from the index.
        */}
        {related.length > 0 ? (
          <section aria-labelledby="related-posts" className="border-t border-(--line) pt-10">
            <h2
              id="related-posts"
              className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground"
            >
              Related reading
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <article
                  key={item.slug}
                  className="surface-panel group relative flex flex-col rounded-[1.3rem] p-5"
                >
                  <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {item.tag ?? "Update"}
                  </span>
                  <h3 className="mt-3 font-display text-lg leading-snug tracking-[-0.03em]">
                    <Link href={`/${item.slug}`} className="after:absolute after:inset-0">
                      {item.title}
                    </Link>
                  </h3>
                  <span className="mt-auto pt-4 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
                    {item.readingTime}
                  </span>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-(--line) pt-8 text-sm text-muted-foreground">
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <Link href="/" className="font-medium text-foreground hover:underline">
              ← Back to blog
            </Link>
            <span>SquareCampus · Building calm systems for schools</span>
          </div>
          {post.tags?.length ? (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-(--line) bg-(--surface) px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </article>
    </main>
  );
}

function SectionImage({ image, className }: { image: BlogSection["image"]; className?: string }) {
  if (!image) return null;

  return (
    <figure className={cn("surface-panel overflow-hidden rounded-[1.4rem]", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        width={800}
        height={450}
        className="h-auto w-full object-cover"
      />
      {image.caption && (
        <figcaption className="border-t border-(--line) px-4 py-3 text-xs text-muted-foreground">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}

// Normal block flow (no flex/BFC) so inline content wraps around floated
// section images instead of shrinking into a narrow column beside them.
function SectionContent({ section }: { section: BlogSection }) {
  return (
    <div className="space-y-4">
      {/* scroll-mt clears the sticky header when an anchor is followed. */}
      <h2
        id={sectionSlug(section.heading)}
        className="scroll-mt-24 font-display text-2xl tracking-[-0.04em]"
      >
        {section.heading}
      </h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-base leading-8 text-muted-foreground">
          {paragraph}
        </p>
      ))}
      {section.bullets && (
        <ul className="space-y-2 pl-5 text-base text-muted-foreground">
          {section.bullets.map((bullet) => (
            <li key={bullet} className="list-disc leading-7">
              {bullet}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BlogSectionBlock({ section }: { section: BlogSection }) {
  const { image } = section;

  if (!image) {
    return <SectionContent section={section} />;
  }

  if (image.orientation === "top") {
    return (
      <div className="flex flex-col gap-6">
        <SectionImage image={image} />
        <SectionContent section={section} />
      </div>
    );
  }

  // Side orientations float the figure so text and bullets wrap around it and
  // reclaim the full column width below the image — no dead space beside long
  // sections. flow-root contains the float; mobile stacks naturally.
  return (
    <div className="flow-root">
      <SectionImage
        image={image}
        className={cn(
          "mb-6 sm:mb-4 sm:w-[46%]",
          image.orientation === "right" ? "sm:float-right sm:ml-7" : "sm:float-left sm:mr-7"
        )}
      />
      <SectionContent section={section} />
    </div>
  );
}
