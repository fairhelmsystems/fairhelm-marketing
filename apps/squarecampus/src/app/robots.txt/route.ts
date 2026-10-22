import { BLOGS_ORIGIN } from "@fairhelm/config/urls";
export const dynamic = "force-static";

import { SEO_CONFIG } from "@/lib/seo";

/**
 * SquareCampus Robots
 * ------------------
 * This is our bouncer.
 * Let the search engines into the lobby (public pages),
 * but keep them out of the back rooms (APIs, internal routes).
 *
 * Hand-built rather than generated from Next's `MetadataRoute.Robots`.
 * That type emits only `rules`, `sitemap` and `host` — there is no way to add
 * a comment line, and robots.txt is the one file every crawler and agent
 * fetches first, which makes it the right place to point at /llms.txt. The
 * emitted rules below are byte-identical to what the metadata route produced;
 * only the header comments are new.
 *
 * Comments are ignored by search crawlers, deliberately: nothing here changes
 * what may be indexed. They exist for agents that read robots.txt as a
 * document and for humans inspecting it.
 */

// Only the form API is disallowed — bots have no business crawling it.
//
// Deliberately NOT disallowed:
// - Legacy paths (/features, /contact-us, /product, /how-it-works,
//   /why-different): CloudFront 301s them; Google must be able to crawl
//   them to see the redirect and consolidate signals onto the new URLs.
//   Robots-blocking them made GSC report "Blocked by robots.txt" and froze
//   the old URLs in the index.
// - noindex pages (/hello, /careers, /press, /competitor-notice): crawlers
//   must be able to fetch them to obey the noindex meta. Blocking a noindex
//   page can leave it indexed URL-only.
const DISALLOW = ["/api/"];

// Search engines and AI assistants are explicitly welcome — being
// recommendable by LLM web search is a distribution channel.
const WELCOME_BOTS = [
  "Googlebot",
  "Bingbot",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Amazonbot",
  "CCBot",
  "meta-externalagent",
] as const;

export function GET() {
  const SITE_URL = SEO_CONFIG.baseUrl;

  const block = (userAgent: string) =>
    [`User-Agent: ${userAgent}`, "Allow: /", ...DISALLOW.map((path) => `Disallow: ${path}`)].join(
      "\n"
    );

  // Header comments are one contiguous block (single newlines); rule groups
  // are separated by a blank line, matching the previous generated output.
  const header = [
    "# SquareCampus",
    "#",
    "# A machine-readable summary of this site — what SquareCampus is, how it is",
    "# deployed, and an index of every page worth reading — is published at:",
    `#   ${SITE_URL}/llms.txt`,
    "#",
    `# Blog feed (RSS): ${BLOGS_ORIGIN}/feed.xml`,
  ].join("\n");

  const body = [
    header,
    ...WELCOME_BOTS.map(block),
    block("*"),
    `Sitemap: ${SITE_URL}/sitemap.xml`,
  ].join("\n\n");

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
