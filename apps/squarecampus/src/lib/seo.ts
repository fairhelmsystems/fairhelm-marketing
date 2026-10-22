// SEO configuration and utilities for consistent metadata across the application.
// Rule of the file: every signal emitted here must be true and verifiable.
// No rankings, no customer counts, no keyword stuffing.

import { hasMarkdownAlternate, markdownAlternatePath } from "@/content/markdown-alternates";

/**
 * squarecampus.com is the single canonical domain; squarecampus.in 301s to it
 * at the edge, so no hreflang set is emitted (redirecting alternates would be
 * an SEO error). NEXT_PUBLIC_SITE_URL stays overridable for previews.
 */
export const PRIMARY_DOMAIN = "https://squarecampus.com";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || PRIMARY_DOMAIN;

/**
 * Canonical for a page, plus the Markdown alternate where the page has one.
 * Every page that exports its own metadata must set this, otherwise it
 * inherits the root layout's canonical ("/") and search engines read it as a
 * duplicate of the homepage.
 *
 * `types["text/markdown"]` renders as
 * `<link rel="alternate" type="text/markdown" href="…/index.md">` — the
 * advertised agent-readable representation of the same page. The HTML URL
 * stays canonical; the Markdown is an alternate, never a duplicate route.
 */
export function createAlternates(path: string) {
  return {
    canonical: canonicalUrl(path),
    ...(hasMarkdownAlternate(path)
      ? { types: { "text/markdown": `${baseUrl}${markdownAlternatePath(path)}` } }
      : {}),
  };
}

/**
 * The one true URL for a route.
 *
 * `trailingSlash: true` (next.config.ts) means `/pricing` is not a page — the
 * edge 301s it to `/pricing/`. Anything that emits a URL (canonical, OG url,
 * sitemap entry, JSON-LD `url`/`item`/`@id`) has to emit the destination, not
 * the redirect: a BreadcrumbList pointing at a 301 makes Google resolve the
 * hop before it can trust the item, and a sitemap of redirects is a crawl
 * budget tax. Everything routes through here so the four signals cannot drift
 * apart again.
 */
export function canonicalUrl(path: string) {
  // A path whose last segment carries an extension is a file, not a route:
  // /llms.txt is served as-is and /llms.txt/ is a 404. `canonicalise()` below
  // already applied this rule to absolute URLs; the two disagreed, which is
  // exactly the kind of drift this module exists to prevent.
  const lastSegment = path.slice(path.lastIndexOf("/") + 1);
  if (lastSegment.includes(".")) {
    return `${baseUrl}${path}`;
  }
  const withSlash = path === "/" ? "/" : path.endsWith("/") ? path : `${path}/`;
  return `${baseUrl}${withSlash}`;
}

export const SEO_CONFIG = {
  baseUrl,
  siteName: "SquareCampus",
  // Canonical category: School Operating System / institutional decision
  // layer. ERP and "school management system" terminology is deliberately
  // confined to search-intent routes (/school-management-system, /compare,
  // /school-erp-alternative) so the brand pages resolve to the right category.
  defaultTitle: "SquareCampus | School Operating System for Indian Schools and Trusts",
  defaultDescription:
    "SquareCampus connects school operations, workflow ownership, institutional visibility and governed intelligence in one School Operating System for schools and educational trusts.",
  language: "en-IN",
  openGraphLocale: "en_IN",
  /** Company account; attribution for Twitter/X cards. */
  twitterHandle: "@squarecampushq",
  // Versioned, static artwork. Keep production HTTPS URLs even on previews;
  // the canonical-base override must not leak a localhost URL into a card.
  socialImages: {
    openGraph: {
      url: `${PRIMARY_DOMAIN}/social/squarecampus-og-v1.jpg`,
      width: 1200,
      height: 630,
      type: "image/jpeg",
      alt: "SquareCampus School Operating System — Run every campus. Govern them as one. Connected campuses by Fairhelm Systems.",
    },
    twitter: {
      url: `${PRIMARY_DOMAIN}/social/squarecampus-x-v1.jpg`,
      alt: "SquareCampus School Operating System — Run every campus. Govern them as one. Connected campuses by Fairhelm Systems.",
    },
  },

  /**
   * Entity links: help Google and the Knowledge Graph connect the brand to
   * the places it is described elsewhere.
   *
   * Social profiles and vendor-directory listings both belong here, because
   * `sameAs` asks for references to the *same entity* rather than for social
   * accounts specifically. Note what these are not: a listing that links back
   * with `rel="nofollow"`, as SoftwareSuggest does, passes no ranking signal,
   * so this array buys entity association and nothing more.
   *
   * This is the only copy. `layout.tsx` renders the Organization JSON-LD from
   * it rather than repeating the URLs, because repeating them is what made a
   * single X-handle change take two pull requests (#67 and #68) to land.
   */
  sameAs: [
    "https://www.linkedin.com/company/square-campus",
    "https://x.com/squarecampushq",
    "https://instagram.com/squarecampus",
    "https://www.softwaresuggest.com/squarecampus",
  ],
  // Logo used in structured data.
  logo: "https://squarecampus.com/brand/squarecampus.png",
} as const;

export type PageMetadataConfig = {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
  noFollow?: boolean;
};

/**
 * Generate consistent metadata for pages
 * Follows Next.js App Router metadata conventions
 *
 * The plan:
 * - Canonicals are non-negotiable.
 * - OG/Twitter are page-specific and consistent (avoid mismatch penalties).
 * - robots flags are configurable per route.
 * - No meta keywords: they are ignored by search engines and invite stuffing.
 */
export function createPageMetadata(config: PageMetadataConfig) {
  const {
    title,
    description,
    path,
    ogTitle,
    ogDescription,
    twitterTitle,
    twitterDescription,
    ogImage,
    noIndex = false,
    noFollow = false,
  } = config;

  const pageUrl = canonicalUrl(path);
  // An explicit route image remains intentional on both platforms. Only
  // routes without an override use the new platform-specific defaults.
  const image = ogImage
    ? { url: ogImage, width: 1200, height: 630, alt: ogTitle || title }
    : SEO_CONFIG.socialImages.openGraph;

  // The root layout's title template appends " | SquareCampus". A title that
  // already carries the brand is emitted as-is, so no page renders
  // "… | SquareCampus | SquareCampus".
  const documentTitle = title.includes("SquareCampus") ? { absolute: title } : title;

  return {
    title: documentTitle,
    description,
    alternates: createAlternates(path),
    openGraph: {
      title: ogTitle || title,
      description: ogDescription || description,
      url: pageUrl,
      siteName: SEO_CONFIG.siteName,
      type: "website" as const,
      locale: SEO_CONFIG.openGraphLocale,
      images: [image],
    },
    twitter: {
      card: "summary_large_image" as const,
      site: SEO_CONFIG.twitterHandle,
      creator: SEO_CONFIG.twitterHandle,
      title: twitterTitle || ogTitle || title,
      description: twitterDescription || ogDescription || description,
      images: [ogImage ? { url: ogImage, alt: ogTitle || title } : SEO_CONFIG.socialImages.twitter],
    },
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
      },
    },
  };
}

/**
 * Normalise an absolute site URL to its canonical, 200-status form.
 *
 * Callers pass `${baseUrl}/pricing`; the live URL is `${baseUrl}/pricing/`.
 * Fragment identifiers (`#faqpage`) and file URLs (`/og/home.png`) are left
 * alone — only directory-style paths get the slash.
 */
function canonicalise(url: string) {
  const hash = url.indexOf("#");
  const base = hash === -1 ? url : url.slice(0, hash);
  const fragment = hash === -1 ? "" : url.slice(hash);
  if (base.endsWith("/")) {
    return `${base}${fragment}`;
  }
  // Split off the origin first. Without this the host itself ("squarecampus.com")
  // looks like a filename because of the dot, and the bare origin used as the
  // "Home" breadcrumb never gains its slash.
  const originEnd = base.indexOf("/", base.indexOf("//") + 2);
  const path = originEnd === -1 ? "" : base.slice(originEnd);
  const lastSegment = path.slice(path.lastIndexOf("/") + 1);
  if (lastSegment.includes(".")) {
    return `${base}${fragment}`;
  }
  return `${base}/${fragment}`;
}

/** Stable entity identifiers, so page-level nodes join the root graph. */
export const SCHEMA_IDS = {
  org: `${SEO_CONFIG.baseUrl}/#org`,
  website: `${SEO_CONFIG.baseUrl}/#website`,
  software: `${SEO_CONFIG.baseUrl}/#software`,
} as const;

/**
 * JSON-LD: WebPage schema (page-level identity)
 *
 * Carries a stable `@id` (`<canonical>#webpage`), joins the WebSite node and
 * names the SoftwareApplication as its subject, so every page's node hangs
 * off the same three root entities rather than floating as an unrelated
 * fragment.
 */
export function createWebPageSchema(config: { name: string; description: string; url: string }) {
  const url = canonicalise(config.url);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: config.name,
    description: config.description,
    url,
    inLanguage: SEO_CONFIG.language,
    isPartOf: { "@id": SCHEMA_IDS.website },
    about: { "@id": SCHEMA_IDS.software },
    publisher: { "@id": SCHEMA_IDS.org },
  };
}

/**
 * JSON-LD: BreadcrumbList schema
 * Breadcrumbs help Google understand hierarchy (and sometimes show it).
 */
export function createBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  const last = breadcrumbs[breadcrumbs.length - 1];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(last ? { "@id": `${canonicalise(last.url)}#breadcrumb` } : {}),
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: canonicalise(crumb.url),
    })),
  };
}
