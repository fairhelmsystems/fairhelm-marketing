import { getInsights } from "@fairhelm/fairhelm-content/insights";
export const dynamic = "force-static";

import { blogPostsByDate } from "@fairhelm/squarecampus-content/blog/posts";
import { canonicalUrl, SEO_CONFIG } from "@/lib/seo";

/**
 * RSS 2.0 feed for /blog/.
 *
 * The site had no feed at all, which meant the only way to discover a new post
 * was to crawl the index and diff it. A feed is the one format every reader,
 * aggregator and assistant crawler already understands, it is cheap to emit
 * from the same content the pages are built from, and it cannot drift from
 * them because there is no second copy of the content.
 *
 * Emitted as a static file by the export build (`force-static`), served from
 * S3 like every other route. `<link rel="alternate">` in the blog layout points
 * at it, and robots/sitemap discovery is unaffected.
 */
const FEED_PATH = "/feed.xml";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RFC 822, which is what RSS requires — not ISO 8601. */
function rfc822(date: string) {
  return new Date(`${date}T09:00:00.000Z`).toUTCString();
}

export function GET() {
  const entries = [
    ...blogPostsByDate.map((post) => ({ ...post, path: `/${post.slug}` })),
    ...getInsights().map((post) => ({
      title: post.title,
      summary: post.description,
      date: post.date,
      tag: post.category,
      path: post.path,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));
  const items = entries
    .map((post) => {
      const url = canonicalUrl(post.path);
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(post.date)}</pubDate>
      <description>${escapeXml(post.summary)}</description>${
        post.tag ? `\n      <category>${escapeXml(post.tag)}</category>` : ""
      }
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Fairhelm Journal</title>
    <link>${canonicalUrl("/")}</link>
    <atom:link href="${SEO_CONFIG.baseUrl}${FEED_PATH}" rel="self" type="application/rss+xml" />
    <description>Writing on school operations, governance, exception handling and how institutions evaluate school management systems.</description>
    <language>${SEO_CONFIG.language}</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
