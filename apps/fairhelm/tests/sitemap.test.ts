import { renderRobotsTxt } from "../src/app/robots.txt/route";
import sitemap from "../src/app/sitemap";
import { markdownAlternatePaths } from "../src/content/markdown-alternates";
import { siteConfig } from "../src/lib/site-config";
import { assert, suite, test } from "./harness";

suite("sitemap and robots");

const entries = sitemap();
const urls = entries.map((e) => e.url);

test("lists every public page in canonical trailing-slash form, plus llms.txt", () => {
  for (const path of siteConfig.publicPages) {
    assert.ok(urls.includes(`https://fairhelmsystems.com${path}`), path);
  }
  assert.ok(urls.includes("https://fairhelmsystems.com/llms.txt"));
});

test("lists nothing non-canonical: no .md, no other host, no duplicates", () => {
  for (const url of urls) {
    assert.ok(url.startsWith("https://fairhelmsystems.com/"), url);
    assert.ok(!url.endsWith(".md"), url);
    assert.ok(url === "https://fairhelmsystems.com/llms.txt" || url.endsWith("/"), url);
  }
  assert.equal(new Set(urls).size, urls.length);
});

test("every entry has a lastmod date so IndexNow can diff materially changed URLs", () => {
  for (const entry of entries) {
    assert.ok(entry.lastModified instanceof Date && !Number.isNaN(entry.lastModified.getTime()));
  }
});

test("every Markdown alternate belongs to a page the sitemap lists", () => {
  for (const path of markdownAlternatePaths) {
    assert.ok(urls.includes(`https://fairhelmsystems.com${path}`), path);
  }
});

test("robots.txt allows crawling, names the canonical sitemap and points at llms.txt", () => {
  const robots = renderRobotsTxt();
  assert.ok(robots.includes("Sitemap: https://fairhelmsystems.com/sitemap.xml"));
  assert.ok(robots.includes("https://fairhelmsystems.com/llms.txt"));
  assert.doesNotMatch(robots, /Disallow:\s*\/\s*$/m);
  assert.match(robots, /User-Agent: \*\nAllow: \//);
});
