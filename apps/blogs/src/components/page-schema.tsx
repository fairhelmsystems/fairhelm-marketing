import { canonicalUrl } from "@/lib/seo";
export function PageSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${canonicalUrl(path)}#webpage`,
          name,
          description,
          url: canonicalUrl(path),
          isPartOf: { "@id": `${canonicalUrl("/")}#website` },
          inLanguage: "en-IN",
        }),
      }}
    />
  );
}
