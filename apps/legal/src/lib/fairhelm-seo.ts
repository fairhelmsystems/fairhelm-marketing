import { LEGAL_ORIGIN, legalUrl } from "@fairhelm/config/urls";
import type { Metadata } from "next";
export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const canonical = legalUrl("fairhelm", path);
  return {
    title,
    description,
    alternates: { canonical, types: { "text/markdown": `${canonical}index.md` } },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${LEGAL_ORIGIN}/brand/fairhelm-og.png`],
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: `${LEGAL_ORIGIN}/brand/fairhelm-og.png`,
          width: 1200,
          height: 630,
          alt: "Fairhelm Legal — company and product policies",
        },
      ],
      url: canonical,
    },
  };
}
export function breadcrumbSchema(items: readonly { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? `${LEGAL_ORIGIN}/` : legalUrl("fairhelm", item.path),
    })),
  };
}
