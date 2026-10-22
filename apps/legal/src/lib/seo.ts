import { LEGAL_ORIGIN, legalUrl } from "@fairhelm/config/urls";
import type { Metadata } from "next";
export function canonicalUrl(path: string) {
  return path.startsWith("/squarecampus/")
    ? `${LEGAL_ORIGIN}${path}${path.endsWith("/") || path.includes(".") ? "" : "/"}`
    : legalUrl("squarecampus", path);
}
export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
  ogDescription,
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  ogDescription?: string;
  ogTitle?: string;
}): Metadata {
  const canonical = canonicalUrl(path);
  return {
    title,
    description,
    alternates: {
      canonical,
      ...(path.includes("data-retention")
        ? { types: { "text/markdown": `${canonical}index.md` } }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${LEGAL_ORIGIN}/brand/fairhelm-og.png`],
    },
    openGraph: {
      title,
      description: ogDescription ?? description,
      url: canonical,
      type: "website",
      images: [
        {
          url: `${LEGAL_ORIGIN}/brand/fairhelm-og.png`,
          width: 1200,
          height: 630,
          alt: "Fairhelm Legal — company and product policies",
        },
      ],
    },
    robots: { index: !noIndex, follow: !noIndex },
  };
}
