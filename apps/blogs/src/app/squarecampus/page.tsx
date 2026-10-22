import { blogUrl } from "@fairhelm/config/urls";
import { blogPosts } from "@fairhelm/squarecampus-content/blog/posts";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import type { Metadata } from "next";
import { JournalGrid } from "@/components/journal-grid";

export const metadata: Metadata = {
  title: "SquareCampus stories",
  description:
    "Guides to school operations, communication and governance from the SquareCampus team.",
  alternates: { canonical: blogUrl("/squarecampus/") },
  openGraph: {
    type: "website",
    url: blogUrl("/squarecampus/"),
    title: "SquareCampus stories",
    description:
      "Guides to school operations, communication and governance from the SquareCampus team.",
    siteName: "Fairhelm Journal",
  },
};

export default function Page() {
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <main tabIndex={-1} id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${blogUrl("/squarecampus/")}#webpage`,
            name: "SquareCampus stories",
            url: blogUrl("/squarecampus/"),
            isPartOf: { "@id": `${blogUrl("/")}#website` },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: posts.map((post, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: post.title,
                url: blogUrl(`/${post.slug}/`),
              })),
            },
          }),
        }}
      />
      <SectionShell
        eyebrow="SquareCampus"
        title="Stories from the school day."
        as="h1"
        titleSize="page"
        body="Practical guides to school operations, communication and governance from the SquareCampus team."
      >
        <JournalGrid
          posts={posts.map((post) => ({
            path: `/${post.slug}/`,
            title: post.title,
            summary: post.summary,
            date: post.date,
            readingTime: post.readingTime,
            category: post.tag ?? "Operations",
            team: "SquareCampus",
            image: post.image,
          }))}
        />
      </SectionShell>
    </main>
  );
}
