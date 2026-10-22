import { getInsights } from "@fairhelm/fairhelm-content/insights";
import { blogPosts } from "@fairhelm/squarecampus-content/blog/posts";
import { ContentTabs } from "@fairhelm/ui/components/content-tabs";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { BookOpen, Building2, GraduationCap } from "lucide-react";
import { type JournalEntry, JournalGrid } from "@/components/journal-grid";
import { PageSchema } from "@/components/page-schema";
import { canonicalUrl, SEO_CONFIG } from "@/lib/seo";

export default function BlogPage() {
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
  const fairhelm: JournalEntry[] = getInsights().map((post) => ({
    path: post.path,
    title: post.title,
    summary: post.description,
    date: post.date,
    readingTime: `${post.minutes} min read`,
    category: post.category,
    team: "Fairhelm",
    image: post.cover ? { src: post.cover, alt: "" } : undefined,
  }));
  const squarecampus: JournalEntry[] = posts.map((post) => ({
    path: `/${post.slug}/`,
    title: post.title,
    summary: post.summary,
    date: post.date,
    readingTime: post.readingTime,
    category: post.tag ?? "Operations",
    team: "SquareCampus",
    image: post.image,
  }));
  const all = [...fairhelm, ...squarecampus].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main tabIndex={-1} id="main-content">
      <PageSchema
        name="Fairhelm Journal"
        description="Writing on school operations, multi-campus governance, migration risk and how institutions evaluate school management systems."
        path="/"
      />

      {/*
        Blog + ItemList for the index itself.

        PageSchema says what this page is; this says what it contains. Without
        it, the library is discoverable only by following each card, and a
        crawler or assistant that reads structured data has no way to learn the
        set exists. Every post is listed with its own URL, date and headline —
        all facts already on the page, restated in a form machines read.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${canonicalUrl("/")}#blog`,
            name: "Fairhelm Journal",
            description:
              "Writing on school operations, governance, exception handling and how institutions evaluate school management systems.",
            url: canonicalUrl("/"),
            inLanguage: SEO_CONFIG.language,
            publisher: { "@id": "https://fairhelmsystems.com/#org" },
            blogPost: [
              ...getInsights().map((post) => ({
                "@type": "BlogPosting",
                "@id": `${canonicalUrl(post.path)}#article`,
                headline: post.title,
                description: post.description,
                url: canonicalUrl(post.path),
                datePublished: post.date,
                articleSection: post.category,
              })),
              ...posts.map((post) => ({
                "@type": "BlogPosting",
                "@id": `${canonicalUrl(`/${post.slug}`)}#article`,
                headline: post.title,
                description: post.summary,
                url: canonicalUrl(`/${post.slug}`),
                datePublished: post.date,
                ...(post.tag && { articleSection: post.tag }),
                ...(post.tags?.length && { keywords: post.tags.join(", ") }),
              })),
            ],
          }),
        }}
      />

      <SectionShell
        eyebrow="Fairhelm Journal"
        title="Ideas for systems that work."
        as="h1"
        titleSize="page"
        body="Guides to school operations, data engineering and governance from the teams at SquareCampus and Fairhelm Systems."
      >
        <ContentTabs
          label="Journal collections"
          defaultValue="all"
          items={[
            {
              value: "all",
              label: "All stories",
              icon: <BookOpen className="size-4" />,
              count: all.length,
              content: <JournalGrid posts={all} />,
            },
            {
              value: "fairhelm",
              label: "Fairhelm notes",
              icon: <Building2 className="size-4" />,
              count: fairhelm.length,
              content: <JournalGrid posts={fairhelm} />,
            },
            {
              value: "squarecampus",
              label: "SquareCampus stories",
              icon: <GraduationCap className="size-4" />,
              count: squarecampus.length,
              content: <JournalGrid posts={squarecampus} />,
            },
          ]}
        />
      </SectionShell>
    </main>
  );
}
