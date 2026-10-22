import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { getInsight, getInsights, formatInsightDate } from "@fairhelm/fairhelm-content/insights";
import { blogUrl, FAIRHELM_ORIGIN } from "@fairhelm/config/urls";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { Prose } from "@/components/prose";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return getInsights().map((post) => ({ slug: post.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getInsight((await params).slug);
  if (!post) return { title: "Article not found", robots: { index: false } };
  const url = blogUrl(post.path);
  const image = `/insights/${post.slug}.webp`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url, types: { "text/markdown": `${url}index.md` } },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: `${post.date}T00:00:00Z`,
      section: post.category,
      images: [{ url: image, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
    },
  };
}
export default async function Page({ params }: Props) {
  const post = getInsight((await params).slug);
  if (!post) notFound();
  const url = blogUrl(post.path);
  const image = `/insights/${post.slug}.webp`;
  const hasCover = existsSync(resolve(process.cwd(), "public", image.slice(1)));
  const related = getInsights()
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);
  return (
    <main tabIndex={-1} id="main-content" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <article className="mx-auto max-w-3xl space-y-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "BlogPosting",
                  "@id": `${url}#article`,
                  headline: post.title,
                  description: post.description,
                  datePublished: post.date,
                  dateModified: post.date,
                  mainEntityOfPage: url,
                  inLanguage: "en-IN",
                  articleSection: post.category,
                  wordCount: post.words,
                  author: {
                    "@type": "Person",
                    name: "Mohit Gupta",
                    url: `${FAIRHELM_ORIGIN}/about/`,
                  },
                  publisher: { "@id": `${FAIRHELM_ORIGIN}/#org` },
                  ...(hasCover ? { image: blogUrl(image) } : {}),
                },
                {
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Journal", item: blogUrl("/") },
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: "Fairhelm",
                      item: blogUrl("/fairhelm/"),
                    },
                    { "@type": "ListItem", position: 3, name: post.title, item: url },
                  ],
                },
              ],
            }),
          }}
        />
        <header className="space-y-5">
          <Link className="text-sm text-muted-foreground hover:underline" href="/fairhelm/">
            ← All Fairhelm notes
          </Link>
          <p className="eyebrow">
            {post.category} · <time dateTime={post.date}>{formatInsightDate(post.date)}</time> ·{" "}
            {post.minutes} min read
          </p>
          <h1 className="type-page-title">{post.title}</h1>
          <p className="type-body text-muted-foreground">{post.description}</p>
          <p className="type-support">By Mohit Gupta · Fairhelm Systems</p>
        </header>
        {hasCover ? (
          <Image
            src={image}
            alt={post.title}
            width={1600}
            height={900}
            priority
            className="h-auto w-full rounded-[var(--radius-panel)]"
          />
        ) : null}
        {post.headings.length ? (
          <nav
            aria-label="In this article"
            className="surface-quiet rounded-[var(--radius-panel)] p-6"
          >
            <p className="eyebrow">In this article</p>
            <ol className="mt-4 space-y-2">
              {post.headings.map((item) => (
                <li key={item.id}>
                  <a className="text-sm text-muted-foreground hover:underline" href={`#${item.id}`}>
                    {item.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <Prose blocks={post.blocks} />
        <section className="surface-panel-strong rounded-[var(--radius-panel)] p-6">
          <h2 className="type-card-title">Put these ideas to work.</h2>
          <p className="type-body mt-3 text-muted-foreground">
            Talk to Fairhelm Systems about governed data engineering and decision systems.
          </p>
          <div className="mt-5">
            <ButtonLink
              href={`${FAIRHELM_ORIGIN}/contact/`}
              label="Start a conversation"
              variant="cta"
            />
          </div>
        </section>
        <section>
          <h2 className="type-section-title">Related reading</h2>
          <ul className="mt-5 space-y-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link className="text-muted-foreground hover:underline" href={item.path}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}
