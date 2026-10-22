import { blogUrl } from "@fairhelm/config/urls";
import { getInsights } from "@fairhelm/fairhelm-content/insights";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import type { Metadata } from "next";
import { JournalGrid } from "@/components/journal-grid";
export const metadata: Metadata = {
  title: "Fairhelm practice notes",
  description:
    "Practical writing on data engineering, decision systems and governance from Fairhelm Systems.",
  alternates: { canonical: blogUrl("/fairhelm/") },
  openGraph: {
    type: "website",
    url: blogUrl("/fairhelm/"),
    title: "Fairhelm practice notes",
    description: "Writing on data engineering, decision systems and governance.",
    siteName: "Fairhelm Journal",
    images: [{ url: "/brand/fairhelm-og.png", width: 1200, height: 630, alt: "Fairhelm Systems" }],
  },
};
export default function Page() {
  return (
    <main tabIndex={-1} id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${blogUrl("/fairhelm/")}#webpage`,
            name: "Fairhelm practice notes",
            url: blogUrl("/fairhelm/"),
            isPartOf: { "@id": `${blogUrl("/")}#website` },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: getInsights().map((post, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: post.title,
                url: blogUrl(post.path),
              })),
            },
          }),
        }}
      />
      <SectionShell
        eyebrow="Fairhelm Systems"
        title="How governed systems are built."
        as="h1"
        titleSize="page"
        body="Practice notes on data engineering, decision systems and governance."
      >
        <JournalGrid
          posts={getInsights().map((post) => ({
            path: post.path,
            title: post.title,
            summary: post.description,
            date: post.date,
            readingTime: `${post.minutes} min read`,
            category: post.category,
            team: "Fairhelm",
            image: post.cover ? { src: post.cover, alt: "" } : undefined,
          }))}
        />
      </SectionShell>
    </main>
  );
}
