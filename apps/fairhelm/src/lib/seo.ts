import type { Metadata } from "next";
import { hasMarkdownAlternate, markdownAlternatePath } from "@/content/markdown-alternates";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

type PageMetadata = {
  title: string;
  description: string;
  path: string;
};

export const ogImage = {
  url: "/brand/fairhelm-og.png",
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} — ${siteConfig.tagline.toLowerCase()}`,
};

/**
 * Canonical plus, where the page ships one, the Markdown alternate. The HTML
 * URL stays canonical; `types["text/markdown"]` renders as
 * `<link rel="alternate" type="text/markdown" href="…/index.md">`, the
 * advertised agent-readable representation of the same page.
 */
export function createAlternates(path: string) {
  return {
    canonical: absoluteUrl(path),
    ...(hasMarkdownAlternate(path)
      ? { types: { "text/markdown": absoluteUrl(markdownAlternatePath(path)) } }
      : {}),
  };
}

/**
 * Page metadata. No meta keywords: search engines ignore them and lists of
 * "X services India" phrases invite the keyword stuffing this site avoids.
 */
export function createPageMetadata({ title, description, path }: PageMetadata): Metadata {
  const canonical = absoluteUrl(path);

  return {
    // The layout template appends "| Fairhelm Systems"; a title that already
    // names the company is used as-is so the brand is not repeated.
    title: title.includes(siteConfig.name) ? { absolute: title } : title,
    description,
    alternates: createAlternates(path),
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}
