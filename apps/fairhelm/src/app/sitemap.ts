import { execSync } from "node:child_process";
import type { MetadataRoute } from "next";
import { getInsights, INSIGHTS_PATH } from "@/content/insights";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

/**
 * Only canonical, indexable public routes are listed — every entry in the
 * trailing-slash form the site serves. Markdown alternates are not listed:
 * they are alternates of these pages, not pages.
 *
 * One deliberate non-HTML entry: /llms.txt, the machine-readable company
 * summary. A sitemap entry is the strongest crawl signal available for it.
 *
 * `lastmod` is the git commit time of each route's content sources, so it
 * changes when content changes rather than on every deploy. The IndexNow
 * step in the deploy script diffs the live sitemap against this one and
 * submits only URLs whose lastmod moved. Builds without git history fall
 * back to a fixed release date.
 */
const FALLBACK_LASTMOD = new Date("2026-09-10T00:00:00.000Z");

/** The canonical facts every page renders (footer disclosure, JSON-LD). */
const SHARED = ["src/lib/site-config.ts"];

function gitLastmod(sources: string[]): Date {
  try {
    const iso = execSync(`git log -1 --format=%cI -- ${sources.map((s) => `'${s}'`).join(" ")}`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return iso ? new Date(iso) : FALLBACK_LASTMOD;
  } catch {
    return FALLBACK_LASTMOD;
  }
}

function pageSources(path: string): string[] {
  const dir = path === "/" ? "src/app" : `src/app${path.replace(/\/$/, "")}`;
  const sources = [`${dir}/page.tsx`, ...SHARED];
  if (path === INSIGHTS_PATH || path === "/") sources.push("src/content/insights");
  if (
    [
      "/privacy/",
      "/terms/",
      "/acceptable-use/",
      "/ai-policy/",
      "/data-processing/",
      "/refund-policy/",
    ].includes(path)
  ) {
    sources.push("src/content/legal.ts");
  }
  return sources;
}

function priorityFor(path: string): number {
  if (path === "/") return 1;
  if (path === "/squarecampus/") return 0.9;
  if (path === INSIGHTS_PATH) return 0.7;
  if (path.startsWith("/services/") || path === "/about/") return 0.8;
  if (["/contact/", "/security/", "/ai/"].includes(path)) return 0.6;
  return 0.3;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = siteConfig.publicPages.map((path) => ({
    url: absoluteUrl(path),
    lastModified: gitLastmod(pageSources(path)),
    changeFrequency:
      path === "/" || path.startsWith("/services/") || path === "/squarecampus/"
        ? "monthly"
        : "yearly",
    priority: priorityFor(path),
  }));

  pages.push({
    url: absoluteUrl("/llms.txt"),
    lastModified: gitLastmod([
      "src/app/llms.txt/route.ts",
      "src/content/llms.ts",
      "src/lib/site-config.ts",
    ]),
    changeFrequency: "monthly",
    priority: 0.3,
  });

  return pages;
}
