#!/usr/bin/env bun
/**
 * Post-build machine-readability check.
 *
 * Runs after `next build` and scripts/markdown-alternates.ts, against the
 * static export in ./out — the files that will actually be served. Fails the
 * build when:
 *   - /llms.txt is missing or differs from the generator's output;
 *   - /llms-full.txt is missing or not derived from llms.txt;
 *   - a Markdown alternate is missing, lacks front matter or its H1, carries
 *     conversion debris, or contains an illustrative figure;
 *   - a critical page is missing its canonical, its Markdown alternate link,
 *     the describedby pointer, or carries noindex;
 *   - the sitemap or robots.txt lacks a required entry, or lists a .md URL;
 *   - JSON-LD on a critical page fails to parse, carries a rating/review/
 *     priced-offer node, duplicates the Organization, or lacks the stable
 *     root entity ids (including the canonical SquareCampus entity);
 *   - a stale claim, a DPIIT claim or an unverified sameAs survives in the
 *     rendered HTML, llms.txt or Markdown.
 *
 *   bun scripts/check-build.ts   (also part of `bun run build`)
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { llmsLinks, llmsRoute, renderLlmsTxt } from "../src/content/llms";
import { markdownAlternatePath, markdownAlternatePaths } from "../src/content/markdown-alternates";
import { siteConfig } from "../src/lib/site-config";
import { SCHEMA_IDS } from "../src/lib/structured-data";
import { ILLUSTRATIVE_FIGURES } from "../tests/illustrative-figures";
import { findStaleClaims } from "../tests/stale-claims";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "out");
const SITE = siteConfig.url;

const problems: string[] = [];
const fail = (msg: string) => problems.push(msg);

const CRITICAL = [
  "/",
  "/about/",
  "/squarecampus/",
  "/services/data-engineering/",
  "/services/dashboards/",
  "/security/",
  "/contact/",
  "/ai/",
];

function htmlFile(route: string) {
  return route === "/"
    ? join(OUT, "index.html")
    : join(OUT, route.replace(/^\/|\/$/g, ""), "index.html");
}

function canonicalOf(route: string) {
  return `${SITE}${route}`;
}

// --- llms.txt ---------------------------------------------------------------
const llmsPath = join(OUT, "llms.txt");
if (!existsSync(llmsPath)) {
  fail("out/llms.txt is missing");
} else {
  const served = readFileSync(llmsPath, "utf8");
  if (served !== renderLlmsTxt()) fail("out/llms.txt differs from renderLlmsTxt()");
  for (const hit of findStaleClaims(served))
    fail(`llms.txt: stale claim ${hit.pattern} (${hit.reason})`);
}
const llmsFullPath = join(OUT, "llms-full.txt");
if (!existsSync(llmsFullPath)) {
  fail("out/llms-full.txt is missing (scripts/markdown-alternates.ts writes it)");
} else {
  const full = readFileSync(llmsFullPath, "utf8");
  if (!full.startsWith(renderLlmsTxt().trim()))
    fail("out/llms-full.txt does not begin with the llms.txt summary");
  for (const figure of ILLUSTRATIVE_FIGURES)
    if (full.includes(figure)) fail(`llms-full.txt: illustrative figure "${figure}" leaked`);
  for (const hit of findStaleClaims(full))
    fail(`llms-full.txt: stale claim ${hit.pattern} (${hit.reason})`);
}

// --- sitemap and robots -----------------------------------------------------
const sitemapPath = join(OUT, "sitemap.xml");
const sitemap = existsSync(sitemapPath) ? readFileSync(sitemapPath, "utf8") : "";
if (!sitemap) fail("out/sitemap.xml is missing");
const locs = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
for (const route of siteConfig.publicPages) {
  if (!locs.has(canonicalOf(route))) fail(`sitemap: missing ${canonicalOf(route)}`);
}
if (!locs.has(`${SITE}/llms.txt`)) fail("sitemap: missing /llms.txt");
for (const link of llmsLinks()) {
  if (/^https?:/.test(link.path)) continue; // the canonical product site
  const url = `${SITE}${llmsRoute(link.path)}`;
  if (!locs.has(url)) fail(`sitemap: llms.txt links to ${url}, which is not listed`);
}
for (const loc of locs) {
  if (loc.endsWith(".md"))
    fail(`sitemap: Markdown alternate ${loc} must not be listed (it is an alternate, not a page)`);
  if (!loc.startsWith(`${SITE}/`)) fail(`sitemap: ${loc} is not on the canonical host`);
}

const robotsPath = join(OUT, "robots.txt");
const robots = existsSync(robotsPath) ? readFileSync(robotsPath, "utf8") : "";
if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`))
  fail("robots.txt: missing canonical Sitemap line");
if (!robots.includes(`${SITE}/llms.txt`)) fail("robots.txt: missing llms.txt pointer");
if (/Disallow:\s*\/\s*$/m.test(robots)) fail("robots.txt: a blanket Disallow: / is present");

// --- critical pages ---------------------------------------------------------
const FORBIDDEN_TYPES = /"@type":\s*"(AggregateRating|Review|Rating)"/;
for (const route of CRITICAL) {
  const file = htmlFile(route);
  if (!existsSync(file)) {
    fail(`${route}: ${file} missing`);
    continue;
  }
  const html = readFileSync(file, "utf8");
  const canonical = canonicalOf(route);
  if (!html.includes(`<link rel="canonical" href="${canonical}"`))
    fail(`${route}: canonical is not ${canonical}`);
  if (/<meta name="robots" content="[^"]*noindex/i.test(html)) fail(`${route}: carries noindex`);
  if (!html.includes('<link rel="describedby" href="/llms.txt"'))
    fail(`${route}: missing describedby → /llms.txt`);
  if ((markdownAlternatePaths as readonly string[]).includes(route)) {
    const md = `${SITE}${markdownAlternatePath(route)}`;
    if (!html.includes(`type="text/markdown" href="${md}"`))
      fail(`${route}: missing rel=alternate text/markdown → ${md}`);
  }
  // JSON-LD: parse every block, no ratings/reviews/priced offers, one
  // Organization, root ids present, product on its canonical URL.
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (blocks.length === 0) fail(`${route}: no JSON-LD`);
  let organizations = 0;
  for (const [, json] of blocks) {
    try {
      JSON.parse(json);
    } catch (error) {
      fail(`${route}: JSON-LD does not parse (${String(error)})`);
    }
    if (FORBIDDEN_TYPES.test(json)) fail(`${route}: JSON-LD carries a rating/review node`);
    if (/"@type":\s*"Offer"/.test(json) && /"price"/.test(json))
      fail(`${route}: JSON-LD carries a priced Offer`);
    organizations += (json.match(/"@type":"Organization"/g) ?? []).length;
  }
  if (organizations !== 1)
    fail(`${route}: expected exactly one Organization node, found ${organizations}`);
  const graph = blocks.map((b) => b[1]).join("\n");
  for (const id of [SCHEMA_IDS.org, SCHEMA_IDS.website, SCHEMA_IDS.product]) {
    if (!graph.includes(`"@id":"${id}"`)) fail(`${route}: root entity ${id} missing from JSON-LD`);
  }
  if (!graph.includes(`"url":"${siteConfig.product.url}"`))
    fail(`${route}: SquareCampus entity does not point at ${siteConfig.product.url}`);
  if (/"sameAs"/.test(graph) && siteConfig.sameAs.length === 0)
    fail(`${route}: JSON-LD carries sameAs but no profile is verified in site-config`);
  // Rendered text (scripts and styles removed) must carry no stale claim.
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "");
  for (const hit of findStaleClaims(text))
    fail(`${route}: stale claim ${hit.pattern} (${hit.reason})`);
}

// --- every HTML page: describedby pointer and resolvable Markdown alternate ---
function walkHtml(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "_next") continue;
      walkHtml(full, out);
    } else if (entry === "index.html") {
      out.push(full);
    }
  }
  return out;
}
for (const file of walkHtml(OUT)) {
  const html = readFileSync(file, "utf8");
  const rel = relative(OUT, dirname(file));
  const route = rel ? `/${rel}/` : "/";
  if (!html.includes('<link rel="describedby" href="/llms.txt"'))
    fail(`${route}: missing describedby → /llms.txt`);
  const alternates = [
    ...html.matchAll(/<link rel="alternate" type="text\/markdown" href="([^"]+)"/g),
  ].map((m) => m[1]);
  for (const href of alternates) {
    if (!href.startsWith(`${SITE}/`)) {
      fail(`${route}: Markdown alternate ${href} is not on the canonical host`);
      continue;
    }
    const target = join(OUT, href.slice(SITE.length + 1));
    if (!existsSync(target))
      fail(`${route}: Markdown alternate ${href} does not resolve to a built file`);
  }
  const expectsAlternate = (markdownAlternatePaths as readonly string[]).includes(route);
  if (expectsAlternate && alternates.length !== 1)
    fail(`${route}: expected exactly one Markdown alternate link, found ${alternates.length}`);
  if (!expectsAlternate && alternates.length > 0)
    fail(`${route}: advertises a Markdown alternate it should not have`);
  if (/DPIIT|Startup India/i.test(html)) fail(`${route}: carries a DPIIT / Startup India claim`);
}

// --- Markdown alternates ----------------------------------------------------
for (const route of markdownAlternatePaths) {
  const file = join(OUT, markdownAlternatePath(route).replace(/^\//, ""));
  if (!existsSync(file)) {
    fail(`${route}: Markdown alternate ${file} missing`);
    continue;
  }
  const md = readFileSync(file, "utf8");
  if (!md.startsWith("---\ntitle: ")) fail(`${route}: Markdown alternate lacks front matter`);
  if (!md.includes(`canonical: ${canonicalOf(route)}`))
    fail(`${route}: Markdown alternate canonical is not ${canonicalOf(route)}`);
  if (!/^# .+/m.test(md)) fail(`${route}: Markdown alternate has no H1`);
  if (md.length < 1200)
    fail(`${route}: Markdown alternate is only ${md.length} chars — content lost?`);
  if (/<\/?(div|span|section|p)\b/.test(md))
    fail(`${route}: Markdown alternate contains raw HTML tags`);
  for (const [pattern, reason] of [
    [/\[[^\]\n]*\]\s*(?:\n|$)/m, "link text without a target"],
    [/\[\s*\n/, "link text that opens onto a new line"],
    [/\*\* \*\*|\*\*\s+\*\*/, "empty emphasis"],
    [/\| \d{2}[A-Z]/, "ordinal fused into a table header"],
    [/^#{1,6}\s*$/m, "heading marker with no text"],
    [/\S \*\*$/m, "space before closing emphasis"],
    [/^\d\. \d{2} /m, "ordinal duplicated in a list item"],
  ] as const) {
    if (pattern.test(md)) fail(`${route}: Markdown alternate has ${reason}`);
  }
  for (const figure of ILLUSTRATIVE_FIGURES)
    if (md.includes(figure)) fail(`${route}: illustrative figure "${figure}" leaked into Markdown`);
  for (const hit of findStaleClaims(md))
    fail(`${route}: Markdown alternate stale claim ${hit.pattern}`);
}

// --- report -----------------------------------------------------------------
if (problems.length > 0) {
  for (const p of problems) console.log(`ERROR  ${p}`);
  console.log(`\ncheck-build: ${problems.length} problem${problems.length === 1 ? "" : "s"}.`);
  process.exit(1);
}
console.log(
  `check-build: OK — llms.txt, llms-full.txt, sitemap, robots, ${CRITICAL.length} critical pages and ${markdownAlternatePaths.length} Markdown alternates verified.`
);
