export const dynamic = "force-static";

import { execFileSync } from "node:child_process";
import type { MetadataRoute } from "next";
import { comparisons } from "@/content/comparisons";
import { intentPages } from "@/content/intent-pages";
import { canonicalUrl, SEO_CONFIG } from "@/lib/seo";

/**
 * SquareCampus Sitemap
 * -------------------
 * Only indexable pages are listed. Careers, press, the competitor notice,
 * redirect stubs, and /hello are intentionally absent (noindex or utility).
 *
 * Two deliberate non-HTML entries: /llms.txt and /llms-full.txt. These are
 * crawlable, indexable text documents, and a sitemap entry is the
 * strongest crawl signal available — stronger than the footer link alone. An
 * SEO linter may flag a non-HTML URL here; that is cosmetic, and the crawl is
 * the point.
 *
 * lastmod is derived from the git commit time of each route's content
 * sources, so it reflects content change rather than "we deployed again".
 * Builds without git history fall back to a fixed release date.
 *
 * Every URL is emitted through `canonicalUrl()`, i.e. in the trailing-slash
 * form the site actually serves. The previous form (`${SITE_URL}${path}`)
 * listed `/platform`, which the edge 301s to `/platform/` — a sitemap of
 * redirects, and a mismatch with the canonical tag on the page itself.
 */
const FALLBACK_LASTMOD = new Date("2026-07-14T00:00:00.000Z");

function gitLastmod(sources: string[]): Date {
  try {
    const options = {
      encoding: "utf8" as const,
      stdio: ["ignore", "pipe", "ignore"] as ["ignore", "pipe", "ignore"],
    };
    const iso = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", ...sources],
      options
    ).trim();
    return iso ? new Date(iso) : FALLBACK_LASTMOD;
  } catch {
    return FALLBACK_LASTMOD;
  }
}

const APP = "src/app";
const CONTENT = "src/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const SITE_URL = SEO_CONFIG.baseUrl;

  /**
   * Crawl strategy:
   * - The money pages are the crown jewels.
   * - The supporting pages stay visible, but not louder than the core.
   * - Legal pages exist for trust, not traffic.
   */
  // Absolute URLs for the product screenshots we want Google Images to index
  // and associate with each page. Only images that actually render on the
  // listed URL belong here — Google drops image-sitemap entries whose image
  // is not present on the page. The device frames around product screens are
  // drawn in CSS (src/components/site/device-frames.tsx), so there is no
  // decorative bezel image to exclude any more.
  const img = (path: string) => `${SITE_URL}${path}`;

  const routes: Array<{
    path: `/${string}` | "/";
    sources: string[];
    changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
    priority: number;
    images?: string[];
  }> = [
    // Primary intent / "rank me for this" page
    {
      path: "/school-management-system",
      sources: [`${APP}/(company)/school-management-system`],
      changeFrequency: "weekly",
      priority: 1.0,
      images: [img("/images/marketing/dashboard.webp")],
    },

    // Search-intent pages: one per query cluster, flat keyword slugs, all
    // reachable from the category page above and from the footer.
    ...intentPages.map((page) => ({
      path: `/${page.slug}` as const,
      sources: [`${APP}/(company)/[intent]`, `${CONTENT}/intent-pages.ts`],
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),

    // Home: high authority, frequent link target
    {
      path: "/",
      sources: [`${APP}/page.tsx`, `${APP}/layout.tsx`],
      changeFrequency: "weekly",
      priority: 0.9,
      images: [img("/images/editorial/campus-courtyard.webp")],
    },

    // Canonical entity answer: "what is SquareCampus". High authority for
    // category resolution by search engines and language models.
    {
      path: "/what-is-squarecampus",
      sources: [`${APP}/(company)/what-is-squarecampus`, `${CONTENT}/what-is-squarecampus.ts`],
      changeFrequency: "monthly",
      priority: 0.9,
    },

    {
      path: "/enterprise",
      sources: [`${APP}/(company)/enterprise`, `${CONTENT}/commercial.ts`, `${CONTENT}/pricing.ts`],
      changeFrequency: "monthly",
      priority: 0.85,
    },

    // Conversion + differentiation pages
    {
      path: "/why-squarecampus",
      sources: [`${APP}/(company)/why-squarecampus`],
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      path: "/compare",
      sources: [`${APP}/(company)/compare/page.tsx`, `${CONTENT}/comparisons.ts`],
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...comparisons.map((c) => ({
      path: `/compare/${c.slug}` as const,
      sources: [`${APP}/(company)/compare/[slug]`, `${CONTENT}/comparisons.ts`],
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      path: "/platform",
      sources: [`${APP}/(company)/platform`],
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      path: "/aegis",
      sources: [`${APP}/(company)/aegis`],
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      path: "/services",
      sources: [`${APP}/(company)/services`],
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      path: "/rollout",
      sources: [`${APP}/(company)/rollout`],
      changeFrequency: "weekly",
      priority: 0.82,
    },
    {
      path: "/ecosystem",
      sources: [`${APP}/(company)/ecosystem`],
      changeFrequency: "weekly",
      priority: 0.8,
    },

    // Commercial model. High buyer intent; the model is published, figures
    // follow a written proposal.
    {
      path: "/pricing",
      sources: [`${APP}/(company)/pricing`, `${CONTENT}/pricing.ts`, "src/components/pricing"],
      changeFrequency: "monthly",
      priority: 0.85,
    },

    // Founding Institutional Partner programme: a qualified-conversion page,
    // not another school-ERP keyword landing page. Sits next to /pricing
    // because it is the commercial path, not a product page.
    {
      path: "/launch-partners",
      sources: [`${APP}/(company)/launch-partners`, `${CONTENT}/founding-partners.ts`],
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // The higher-education lane of the same programme. Lower priority than
    // its parent on purpose: the site is school-led, and this route is a
    // qualified path for universities and multi-school groups rather than a
    // second front door.
    {
      path: "/launch-partners/higher-education",
      sources: [
        `${APP}/(company)/launch-partners/higher-education`,
        `${CONTENT}/founding-partners.ts`,
      ],
      changeFrequency: "monthly",
      priority: 0.75,
    },

    // Trust pages
    {
      path: "/security",
      sources: [`${APP}/(company)/security`],
      changeFrequency: "monthly",
      priority: 0.6,
      // No image entry: /security/ now renders the audit screen as video, whose
      // poster is a `poster` attribute rather than an <img>. Listing it would
      // claim a page image Google cannot associate, which is the exact failure
      // the note above warns about.
    },
    {
      path: "/infrastructure",
      sources: [`${APP}/(company)/infrastructure`],
      changeFrequency: "monthly",
      priority: 0.55,
    },
    {
      path: "/pgp",
      sources: [`${APP}/(company)/pgp`],
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      path: "/about",
      sources: [`${APP}/(company)/about`],
      changeFrequency: "monthly",
      priority: 0.6,
    },

    // Support & contact
    {
      path: "/faq",
      sources: [`${APP}/(company)/faq`, `${CONTENT}/faq.ts`],
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      path: "/demo",
      sources: [
        `${APP}/(company)/demo`,
        `${CONTENT}/demo-intents.ts`,
        "src/components/site/contact-form.tsx",
        "src/lib/demo-enquiry.ts",
      ],
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      path: "/contact",
      sources: [`${APP}/(company)/contact`, `${CONTENT}/company.ts`],
      changeFrequency: "yearly",
      priority: 0.5,
    },

    // Machine-readable site summary. Low priority on purpose: it exists to be
    // crawled and read by assistants, not to compete with the pages it points at.
    {
      path: "/llms.txt",
      sources: [`${APP}/llms.txt/route.ts`, `${CONTENT}/llms.ts`, `${CONTENT}/commercial.ts`],
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      path: "/llms-full.txt",
      sources: ["src/app", "src/content", "scripts/llms-full.ts", "scripts/markdown-alternates.ts"],
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  return routes.map((r) => ({
    url: canonicalUrl(r.path),
    lastModified: gitLastmod([
      ...r.sources,
      ...([
        "/",
        "/pricing",
        "/faq",
        "/security",
        "/school-management-system",
        "/launch-partners",
        "/launch-partners/higher-education",
        "/what-is-squarecampus",
        "/demo",
        "/multi-campus-school-management-software",
      ].includes(r.path)
        ? [`${CONTENT}/commercial.ts`]
        : []),
    ]),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    ...(r.images ? { images: r.images } : {}),
  }));
}
