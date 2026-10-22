import { getInsights } from "@fairhelm/fairhelm-content/insights";
import { expect, test } from "bun:test";
import { blogPosts } from "@fairhelm/squarecampus-content/blog/posts";
import { BLOGS_ORIGIN } from "@fairhelm/config/urls";
import sitemap from "../src/app/sitemap";
import { GET } from "../src/app/feed.xml/route";
import { generateMetadata, generateStaticParams } from "../src/app/[slug]/page";

test("every published article has one canonical sitemap URL and feed item", async () => {
  const entries = sitemap();
  const feed = await GET().text();
  expect(new Set(entries.map((entry) => entry.url)).size).toBe(
    blogPosts.length + getInsights().length + 3
  );
  expect(entries.every((entry) => entry.url.startsWith(`${BLOGS_ORIGIN}/`))).toBe(true);
  expect(
    generateStaticParams()
      .map((p) => p.slug)
      .sort()
  ).toEqual(blogPosts.map((p) => p.slug).sort());
  for (const post of blogPosts) {
    const url = `${BLOGS_ORIGIN}/${post.slug}/`;
    expect(entries.some((entry) => entry.url === url)).toBe(true);
    expect(feed).toContain(`<link>${url}</link>`);
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: post.slug }) });
    expect(metadata.alternates?.canonical).toBe(url);
    expect(metadata.openGraph?.url).toBe(url);
  }
  expect(feed).not.toContain("https://squarecampus.com/blog/");
});

test("Fairhelm practice notes keep their dates, namespaces and discoverability", async () => {
  const entries = sitemap();
  const feed = await GET().text();
  const { generateMetadata } = await import("../src/app/fairhelm/[slug]/page");
  for (const post of getInsights()) {
    const url = `${BLOGS_ORIGIN}${post.path}`;
    expect(entries.some((entry) => entry.url === url)).toBe(true);
    expect(feed).toContain(`<link>${url}</link>`);
    const meta = await generateMetadata({ params: Promise.resolve({ slug: post.slug }) });
    expect(meta.alternates?.canonical).toBe(url);
    expect(meta.alternates?.types?.["text/markdown"]).toBe(`${url}index.md`);
    expect(meta.openGraph?.url).toBe(url);
  }
});
