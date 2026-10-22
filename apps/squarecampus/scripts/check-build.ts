#!/usr/bin/env bun
/**
 * Post-build machine-readability check.
 *
 * Runs after `next build` and scripts/markdown-alternates.ts, against the
 * static export in ./out — the files that will actually be served. Fails the
 * build when:
 *   - /llms.txt is missing or differs from the generator's output;
 *   - a Markdown alternate is missing, lacks front matter or its H1;
 *   - a critical page is missing its canonical, its Markdown alternate link,
 *     the describedby pointer, or carries noindex;
 *   - the sitemap or robots.txt lacks a required entry;
 *   - JSON-LD on a critical page fails to parse, carries a rating/review/
 *     priced-offer node, or lacks the stable root entity ids;
 *   - a stale commercial claim survives in rendered HTML or Markdown;
 *   - /data-retention/ renders an unreviewed period, a deadline, money or an
 *     overclaim, or its metadata drifts from the visible wording; the pricing
 *     retention pointer is missing from a plan; or a retention link is absent.
 *
 *   bun scripts/check-build.ts   (also part of `bun run build`)
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { corePlatform, launchPilot } from "../src/content/commercial";
import { faqs } from "../src/content/faq";
import { llmsLinks, llmsRoute, renderLlmsTxt } from "../src/content/llms";
import { renderLlmsFullTxt } from "../src/content/llms-full";
import { markdownAlternatePath, markdownAlternatePaths } from "../src/content/markdown-alternates";
import { plans, pricingFaqs } from "../src/content/pricing";
import {
  publicRetentionSchedule,
  RETENTION_PATH,
  retentionContentReview,
  retentionPage,
  retentionPointer,
} from "../src/content/retention";
import { securityFaqs } from "../src/content/security-faq";
import { retentionCopyProblems } from "../tests/retention-guards";
import { findStaleClaims } from "../tests/stale-claims";
import { publishedLegalCopyStatus } from "./legal-copy-baselines";
import { fullContextDocuments } from "./llms-full";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "out");
const SITE = "https://squarecampus.com";

const problems: string[] = [];
const fail = (msg: string) => problems.push(msg);

const CRITICAL = [
  "/",
  "/what-is-squarecampus",
  "/pricing",
  "/enterprise",
  "/platform",
  "/security",
  "/aegis",
  "/launch-partners",
  "/launch-partners/higher-education",
  "/school-management-system",
  "/multi-campus-school-management-software",
  "/faq",
  "/about",
];

function htmlFile(route: string) {
  return route === "/"
    ? join(OUT, "index.html")
    : join(OUT, route.replace(/^\//, ""), "index.html");
}

function canonicalOf(route: string) {
  return route === "/" ? `${SITE}/` : `${SITE}${route}/`;
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

// --- llms-full.txt: complete text from the exact production HTML ------------
const fullPath = join(OUT, "llms-full.txt");
if (!existsSync(fullPath)) fail("out/llms-full.txt is missing");
else {
  const text = readFileSync(fullPath, "utf8");
  if (text !== renderLlmsFullTxt(fullContextDocuments()))
    fail("llms-full.txt differs from the production pages");
  if (!text.includes(`Source: ${SITE}/enterprise/`)) fail("llms-full.txt: Enterprise is missing");
  for (const document of fullContextDocuments()) {
    const legalStatus = publishedLegalCopyStatus(document);
    if (legalStatus === "changed") {
      fail(
        `llms-full.txt (${document.url}): published legal copy changed; review before updating its baseline`
      );
      continue;
    }
    if (legalStatus === "unchanged") continue;
    for (const hit of findStaleClaims(document.markdown))
      fail(`llms-full.txt (${document.url}): stale claim ${hit.pattern} (${hit.reason})`);
  }
}

// --- sitemap and robots -----------------------------------------------------
const sitemapPath = join(OUT, "sitemap.xml");
const sitemap = existsSync(sitemapPath) ? readFileSync(sitemapPath, "utf8") : "";
if (!sitemap) fail("out/sitemap.xml is missing");
const locs = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
for (const route of CRITICAL) {
  if (!locs.has(canonicalOf(route))) fail(`sitemap: missing ${canonicalOf(route)}`);
}
if (!locs.has(`${SITE}/llms.txt`)) fail("sitemap: missing /llms.txt");
for (const link of llmsLinks()) {
  if (/^https:\/\/(?:blogs.squarecampus.com|legal.fairhelmsystems.com)\//.test(link.path)) continue;
  const route = llmsRoute(link.path);
  const url = route.includes(".") ? `${SITE}${route}` : `${SITE}${route}`;
  if (!locs.has(url)) fail(`sitemap: llms.txt links to ${url}, which is not listed`);
}
for (const loc of locs) {
  if (loc.endsWith(".md"))
    fail(`sitemap: Markdown alternate ${loc} must not be listed (it is an alternate, not a page)`);
}

const robotsPath = join(OUT, "robots.txt");
const robots = existsSync(robotsPath) ? readFileSync(robotsPath, "utf8") : "";
if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`))
  fail("robots.txt: missing canonical Sitemap line");
if (!robots.includes(`${SITE}/llms.txt`)) fail("robots.txt: missing llms.txt pointer");
if (/Disallow:\s*\/\s*$/m.test(robots)) fail("robots.txt: a blanket Disallow: / is present");

// --- critical pages ---------------------------------------------------------
const faqSources: Record<string, ReadonlyArray<{ question: string; answer: string }>> = {
  "/pricing": pricingFaqs,
  "/faq": faqs,
  "/security": securityFaqs,
};

function normaliseText(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, decimal) => String.fromCodePoint(Number(decimal)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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
  // JSON-LD: parse every block, no ratings/reviews/priced offers, root ids present.
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (blocks.length === 0) fail(`${route}: no JSON-LD`);
  const faqNodes: Array<{ mainEntity: unknown }> = [];
  for (const [, json] of blocks) {
    try {
      const parsed = JSON.parse(json);
      for (const node of parsed["@graph"] ?? [parsed]) {
        if (node["@type"] === "FAQPage") faqNodes.push(node);
      }
    } catch (error) {
      fail(`${route}: JSON-LD does not parse (${String(error)})`);
    }
    if (FORBIDDEN_TYPES.test(json)) fail(`${route}: JSON-LD carries a rating/review node`);
    if (/"@type":\s*"Offer"/.test(json) && /"price"/.test(json))
      fail(`${route}: JSON-LD carries a priced Offer`);
  }
  const graph = blocks.map((b) => b[1]).join("\n");
  for (const id of [`${SITE}/#org`, `${SITE}/#website`, `${SITE}/#software`]) {
    if (!graph.includes(`"@id":"${id}"`)) fail(`${route}: root entity ${id} missing from JSON-LD`);
  }
  // Rendered text (scripts and styles removed) must carry no stale claim.
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "");
  for (const hit of findStaleClaims(text))
    fail(`${route}: stale claim ${hit.pattern} (${hit.reason})`);
  const visibleText = normaliseText(text.replace(/<[^>]*>/g, " "));
  const expectedFaqs = faqSources[route];
  if (expectedFaqs) {
    const expected = expectedFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    }));
    if (
      faqNodes.length !== 1 ||
      JSON.stringify(faqNodes[0]?.mainEntity) !== JSON.stringify(expected)
    )
      fail(`${route}: FAQ JSON-LD differs from the canonical visible FAQ source`);
    for (const faq of expectedFaqs) {
      if (!visibleText.includes(normaliseText(faq.answer)))
        fail(`${route}: FAQ answer absent from rendered content: ${faq.question}`);
    }
  }
  if (route === "/data-retention") {
    for (const fact of [
      ...retentionPage.posture.points,
      ...retentionPage.exit.paragraphs,
      retentionPage.schedule.emptyNotice,
    ]) {
      if (!visibleText.includes(normaliseText(fact)))
        fail(`${route}: missing restored public policy text: ${fact}`);
    }
  }
  if (route === "/pricing") {
    if (/<form\b/i.test(html)) fail("/pricing: enquiry forms belong on dedicated enquiry pages");
    if (html.includes("Enterprise control is not reserved for large institutions."))
      fail("/pricing: Enterprise fit section belongs on /enterprise/");
    for (const fact of [
      corePlatform.included,
      corePlatform.multiCampus,
      launchPilot.summary,
      launchPilot.boundaries,
      launchPilot.pricing,
    ]) {
      if (!visibleText.includes(normaliseText(fact)))
        fail(`${route}: missing canonical commercial fact: ${fact}`);
    }
    if (!html.includes(`href="${launchPilot.enquiryHref}"`))
      fail("/pricing: launch-pilot enquiry CTA missing");
  }
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
  const route = `/${relative(OUT, dirname(file))}`.replace(/\/$/, "") || "/";
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
  if (!/^# .+/m.test(md)) fail(`${route}: Markdown alternate has no H1`);
  if (md.length < 1500)
    fail(`${route}: Markdown alternate is only ${md.length} chars — content lost?`);
  if (/<\/?(div|span|section|p)\b/.test(md))
    fail(`${route}: Markdown alternate contains raw HTML tags`);
  // Conversion debris: dangling link brackets, empty emphasis, fused ordinals
  // in table headers, or a heading marker with no text.
  for (const [pattern, reason] of [
    [/\[[^\]\n]*\]\s*(?:\n|$)/m, "link text without a target"],
    [/\*\* \*\*|\*\*\s+\*\*/, "empty emphasis"],
    [/\| \d{2}[A-Z]/, "ordinal fused into a table header"],
    [/^#{1,6}\s*$/m, "heading marker with no text"],
    [/\S \*\*$/m, "space before closing emphasis"],
    [/^\d\. \d{2} /m, "ordinal duplicated in a list item"],
  ] as const) {
    if (pattern.test(md)) fail(`${route}: Markdown alternate has ${reason}`);
  }
  for (const hit of findStaleClaims(md))
    fail(`${route}: Markdown alternate stale claim ${hit.pattern}`);
}

// --- collapsed FAQ answers ----------------------------------------------------
// Closed accordion answers must survive into the Markdown alternate: the
// FAQPage JSON-LD declares every one of them.
{
  const mdFile = join(OUT, markdownAlternatePath("/faq").replace(/^\//, ""));
  const md = existsSync(mdFile) ? readFileSync(mdFile, "utf8").replace(/\s+/g, " ") : "";
  const missing = faqs.filter((f) => !md.includes(f.answer.slice(0, 80).replace(/\s+/g, " ")));
  if (missing.length > 0)
    fail(
      `/faq: ${missing.length} FAQ answers missing from the Markdown alternate (first: "${missing[0].question}")`
    );
}

// Pricing keeps the reviewed retention wording and destination.
{
  // One pointer per plan band, plus the comparison table.
  // Count rendered markup only: the RSC payload in <script> repeats every string.
  const pricingFile = htmlFile("/pricing");
  const pricing = (existsSync(pricingFile) ? readFileSync(pricingFile, "utf8") : "").replace(
    /<script[\s\S]*?<\/script>/g,
    ""
  );
  const pointers = pricing.split('data-retention-pointer="true"').length - 1;
  if (pointers !== plans.length + 1)
    fail(`/pricing: expected ${plans.length + 1} retention pointers, found ${pointers}`);
  if (pricing.split(retentionPointer.text).length - 1 !== pointers)
    fail("/pricing: a retention pointer does not carry the shared wording");
  if (!pricing.includes(`href="${retentionPointer.href}"`))
    fail(`/pricing: retention pointer does not link to ${retentionPointer.href}`);

}

// --- report -----------------------------------------------------------------
if (problems.length > 0) {
  for (const p of problems) console.log(`ERROR  ${p}`);
  console.log(`\ncheck-build: ${problems.length} problem${problems.length === 1 ? "" : "s"}.`);
  process.exit(1);
}
console.log(
  `check-build: OK — llms.txt, sitemap, robots, ${CRITICAL.length} critical pages and ${markdownAlternatePaths.length} Markdown alternates verified.`
);
