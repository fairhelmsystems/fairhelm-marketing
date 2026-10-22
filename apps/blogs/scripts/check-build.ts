import { getInsights } from "@fairhelm/fairhelm-content/insights";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { blogPosts } from "@fairhelm/squarecampus-content/blog/posts";
import { BLOGS_ORIGIN } from "@fairhelm/config/urls";
const out = resolve(import.meta.dirname, "../out");
const read = (name: string) => readFileSync(resolve(out, name), "utf8");
const sitemap = read("sitemap.xml");
const feed = read("feed.xml");
const index = read("index.html");
const tabs = index.match(/<div\b[^>]*data-slot="tabs"[^>]*>/)?.[0] ?? "";
assert.ok(
  tabs.includes('data-orientation="horizontal"'),
  "Journal tabs expose Base UI orientation"
);
const styles = [...index.matchAll(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/g)]
  .map(([, path]) => read(path.slice(1)))
  .join("\n");
// Check the shipped CSS against the actual rendered attribute. A stale
// data-horizontal variant silently puts the tablist beside the article grid.
assert.ok(tabs.includes("data-[orientation=horizontal]:flex-col"));
assert.ok(styles.includes("[data-orientation=horizontal]{flex-direction:column}"));
const header = index.match(/<header\b[\s\S]*?<\/header>/)?.[0] ?? "";
assert.ok(header.includes('href="/fairhelm/"'), "Fairhelm navigation stays in the Journal");
assert.ok(header.includes('href="/squarecampus/"'), "SquareCampus navigation stays in the Journal");
assert.ok(!/href="https?:/.test(header), "Publication navigation uses local collections");
assert.ok(read("robots.txt").includes(`${BLOGS_ORIGIN}/sitemap.xml`));
assert.ok(read("index.html").includes(`rel="canonical" href="${BLOGS_ORIGIN}/"`));
assert.ok(read("index.html").includes('type="application/rss+xml"'));
assert.equal((sitemap.match(/<loc>/g) || []).length, blogPosts.length + getInsights().length + 3);
for (const path of ["fairhelm", "squarecampus"]) {
  assert.ok(read(`${path}/index.html`).includes(`rel="canonical" href="${BLOGS_ORIGIN}/${path}/"`));
  assert.ok(sitemap.includes(`<loc>${BLOGS_ORIGIN}/${path}/</loc>`));
}
for (const post of blogPosts) {
  const url = `${BLOGS_ORIGIN}/${post.slug}/`;
  const html = read(`${post.slug}/index.html`);
  assert.ok(html.includes(`rel="canonical" href="${url}"`), `canonical: ${post.slug}`);
  assert.ok(html.includes(`property="og:url" content="${url}"`), `Open Graph: ${post.slug}`);
  assert.ok(!html.includes('content="noindex'), `indexability: ${post.slug}`);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `one H1: ${post.slug}`);
  assert.ok(sitemap.includes(`<loc>${url}</loc>`));
  assert.ok(feed.includes(`<link>${url}</link>`));
  const schemas = [
    ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
  ].map((match) => JSON.parse(match[1]));
  const nodes = schemas.flatMap((schema) => schema["@graph"] || [schema]);
  const article = nodes.find((node) => node["@type"] === "BlogPosting");
  assert.equal(article?.mainEntityOfPage, url);
  assert.equal(article?.datePublished, post.date);
  assert.equal(article?.publisher?.["@id"], "https://squarecampus.com/#org");
  for (const image of [post.image, ...post.sections.map((section) => section.image)]) {
    if (image?.src.startsWith("/"))
      assert.ok(existsSync(resolve(out, image.src.slice(1))), `asset: ${image.src}`);
  }
  assert.ok(html.includes('href="https://squarecampus.com/'), `product CTA: ${post.slug}`);
}
console.log(
  `Blog export verified: ${blogPosts.length} articles, canonicals, JSON-LD, assets, sitemap and RSS.`
);
for (const post of getInsights()) {
  const url = `${BLOGS_ORIGIN}${post.path}`;
  const html = read(`${post.path.slice(1)}index.html`);
  assert.ok(html.includes(`rel="canonical" href="${url}"`));
  assert.ok(html.includes(`property="og:url" content="${url}"`));
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
  assert.ok(sitemap.includes(`<loc>${url}</loc>`));
  assert.ok(feed.includes(`<link>${url}</link>`));
  const schemas = [
    ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
  ].flatMap((match) => {
    const schema = JSON.parse(match[1]);
    return schema["@graph"] || [schema];
  });
  const article = schemas.find((node) => node["@type"] === "BlogPosting");
  assert.equal(article?.mainEntityOfPage, url);
  assert.equal(article?.datePublished, post.date);
  assert.equal(article?.publisher?.["@id"], "https://fairhelmsystems.com/#org");
  assert.ok(read(`${post.path.slice(1)}index.md`).includes(`url: ${url}`));
  assert.ok(existsSync(resolve(out, `insights/${post.slug}.webp`)));
}
console.log(
  `Fairhelm export verified: ${getInsights().length} notes, canonicals, JSON-LD, Markdown and RSS.`
);
