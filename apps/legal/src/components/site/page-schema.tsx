import { LEGAL_ORIGIN } from "@fairhelm/config/urls";
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
          "@graph": [
            {
              "@type": "WebPage",
              name,
              description,
              url: canonicalUrl(path),
              "@id": `${canonicalUrl(path)}#webpage`,
              isPartOf: { "@id": `${LEGAL_ORIGIN}/#website` },
            },
          ],
        }),
      }}
    />
  );
}
