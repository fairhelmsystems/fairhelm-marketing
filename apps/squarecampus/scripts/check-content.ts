#!/usr/bin/env bun
/**
 * Structural content check ("doctor").
 *
 * `check-claims.sh` guards what the site may SAY. This guards the SHAPE of
 * the pages that are generated from typed content — the comparison pages and
 * the blog — so that a page cannot ship missing the parts that make it
 * citable: the competitor's genuine strengths, the "they fit when" list, a
 * FAQ block, a CTA that resolves to a real route, and so on.
 *
 * It reads the same typed arrays the pages are built from, so there is no
 * second source of truth to keep in sync. TypeScript already enforces the
 * field list; this enforces the parts of the contract a type cannot express
 * (minimum counts, lengths, link targets, dates).
 *
 * Runs as part of `bun run build` and standalone via `bun run check:content`.
 * Errors fail the build. Warnings print and pass.
 */
import { readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { allBlogPosts, blogPosts } from "../src/content/blog/posts";
import { comparisons } from "../src/content/comparisons";
import { intentPages } from "../src/content/intent-pages";

type Level = "error" | "warn";
type Finding = { level: Level; where: string; message: string };

const findings: Finding[] = [];
const error = (where: string, message: string) => findings.push({ level: "error", where, message });
const warn = (where: string, message: string) => findings.push({ level: "warn", where, message });

// ---------------------------------------------------------------------------
// Routes: every `page.tsx` under src/app, with route groups stripped. Dynamic
// segments are expanded from the same content arrays. Anything under the
// `(redirects)` group is a stub that 301s at the edge — content must never
// link to it, it must link to the destination.
// ---------------------------------------------------------------------------
const APP_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "app");

function walkPages(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkPages(full, out);
    } else if (entry === "page.tsx") {
      out.push(full);
    }
  }
  return out;
}

const routes = new Map<string, { redirectStub: boolean }>();
for (const file of walkPages(APP_DIR)) {
  const rel = relative(APP_DIR, file).replace(/\/?page\.tsx$/, "");
  const segments = rel.split("/").filter(Boolean);
  const redirectStub = segments.includes("(redirects)");
  const path = segments.filter((s) => !s.startsWith("(")).join("/");
  if (path.includes("[")) {
    // Expanded below from content.
    continue;
  }
  routes.set(`/${path}${path ? "/" : ""}`, { redirectStub });
}
for (const post of blogPosts) {
  routes.set(`/blog/${post.slug}/`, { redirectStub: true });
}
for (const c of comparisons) {
  routes.set(`/compare/${c.slug}/`, { redirectStub: false });
}
for (const page of intentPages) {
  const path = `/${page.slug}/`;
  if (routes.has(path)) {
    error(`intent-pages.ts › ${page.slug}`, `slug collides with the static route ${path}`);
  }
  routes.set(path, { redirectStub: false });
}

/** Internal links must be root-relative and in the trailing-slash form the edge serves. */
function checkInternalLink(where: string, href: string) {
  if (/^(https?:)?\/\//.test(href) || href.startsWith("mailto:")) {
    return;
  }
  if (!href.startsWith("/")) {
    error(where, `link "${href}" must be root-relative (start with "/")`);
    return;
  }
  const [pathOnly] = href.split(/[?#]/);
  if (pathOnly !== "/" && !pathOnly.endsWith("/")) {
    error(
      where,
      `link "${href}" must use the trailing-slash form ("${pathOnly}/") — the edge 301s the bare path`
    );
    return;
  }
  const route = routes.get(pathOnly);
  if (!route) {
    error(where, `link "${href}" does not resolve to a page under src/app`);
    return;
  }
  if (route.redirectStub) {
    error(where, `link "${href}" points at a redirect stub — link to its destination instead`);
  }
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function unique<T>(items: T[], key: (item: T) => string, where: string, label: string) {
  const seen = new Set<string>();
  for (const item of items) {
    const k = key(item);
    if (seen.has(k)) {
      error(where, `duplicate ${label} "${k}"`);
    }
    seen.add(k);
  }
}

function nonEmpty(where: string, field: string, value: string | undefined) {
  if (!value?.trim()) {
    error(where, `${field} is empty`);
    return false;
  }
  return true;
}

function lengthBetween(
  where: string,
  field: string,
  value: string,
  min: number,
  max: number,
  level: Level = "error"
) {
  const n = value.trim().length;
  if (n < min || n > max) {
    (level === "error" ? error : warn)(where, `${field} is ${n} chars; expected ${min}–${max}`);
  }
}

function atLeast<T>(where: string, field: string, items: readonly T[] | undefined, min: number) {
  const n = items?.length ?? 0;
  if (n < min) {
    error(where, `${field} has ${n} item${n === 1 ? "" : "s"}; at least ${min} required`);
  }
}

// ---------------------------------------------------------------------------
// Comparison pages. The contract mirrors the accuracy rules at the top of
// src/content/comparisons.ts: the page is only credible if it names what the
// competitor does well and says who should pick them.
// ---------------------------------------------------------------------------
unique(comparisons, (c) => c.slug, "comparisons", "slug");

for (const c of comparisons) {
  const where = `comparisons.ts › ${c.slug}`;

  if (!/^squarecampus-vs-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.slug)) {
    error(where, `slug must match squarecampus-vs-<competitor>`);
  }
  nonEmpty(where, "competitor", c.competitor);
  nonEmpty(where, "competitorShort", c.competitorShort);
  if (!/^https:\/\//.test(c.competitorUrl)) {
    error(where, `competitorUrl must be an https URL (readers verify the claims there)`);
  }
  if (nonEmpty(where, "metaTitle", c.metaTitle)) {
    lengthBetween(where, "metaTitle", c.metaTitle, 20, 70);
  }
  if (nonEmpty(where, "metaDescription", c.metaDescription)) {
    lengthBetween(where, "metaDescription", c.metaDescription, 70, 160, "warn");
  }
  nonEmpty(where, "intentLabel", c.intentLabel);
  if (nonEmpty(where, "lede", c.lede) && !c.lede.includes(c.competitorShort)) {
    warn(where, `lede does not mention "${c.competitorShort}"`);
  }

  atLeast(where, "competitorStrengths", c.competitorStrengths, 2);
  atLeast(where, "rows", c.rows, 4);
  atLeast(where, "differentiators", c.differentiators, 3);
  atLeast(where, "theyFitWhen", c.theyFitWhen, 2);
  atLeast(where, "weFitWhen", c.weFitWhen, 2);
  atLeast(where, "faqs", c.faqs, 2);

  c.rows.forEach((row, i) => {
    for (const field of ["dimension", "squarecampus", "competitor"] as const) {
      nonEmpty(`${where} › rows[${i}]`, field, row[field]);
    }
  });
  unique(c.rows, (r) => r.dimension, where, "row dimension");

  c.faqs.forEach((faq, i) => {
    nonEmpty(`${where} › faqs[${i}]`, "answer", faq.answer);
    if (
      nonEmpty(`${where} › faqs[${i}]`, "question", faq.question) &&
      !faq.question.trim().endsWith("?")
    ) {
      warn(
        `${where} › faqs[${i}]`,
        `question does not end with "?" (FAQPage schema reads better as a question)`
      );
    }
  });
}

// ---------------------------------------------------------------------------
// Search-intent pages. The contract is what makes one citable: a direct
// answer that stands alone, enough workflows to show the work connects, a
// neutral evaluation list, a FAQ block for the schema, and related links
// that resolve — the pages exist partly to densify the internal graph.
// ---------------------------------------------------------------------------
unique(intentPages, (p) => p.slug, "intent-pages", "slug");

for (const page of intentPages) {
  const where = `intent-pages.ts › ${page.slug}`;

  if (!SLUG.test(page.slug)) {
    error(where, `slug must be lowercase words joined by "-"`);
  }
  nonEmpty(where, "keyword", page.keyword);
  if (nonEmpty(where, "metaTitle", page.metaTitle)) {
    lengthBetween(where, "metaTitle", page.metaTitle, 20, 70);
  }
  if (nonEmpty(where, "metaDescription", page.metaDescription)) {
    lengthBetween(where, "metaDescription", page.metaDescription, 70, 160);
  }
  nonEmpty(where, "h1", page.h1);
  nonEmpty(where, "lede", page.lede);
  if (nonEmpty(where, "definition.body", page.definition.body)) {
    const words = page.definition.body.trim().split(/\s+/).length;
    if (words < 40 || words > 90) {
      warn(where, `definition.body is ${words} words; a snippet-friendly answer is 40–90`);
    }
  }
  if (!/\?$/.test(page.definition.title.trim())) {
    warn(where, `definition.title should be phrased as the question it answers`);
  }
  atLeast(where, "audience", page.audience, 3);
  atLeast(where, "workflows", page.workflows, 4);
  atLeast(where, "indiaSpecifics", page.indiaSpecifics, 3);
  atLeast(where, "evaluation", page.evaluation, 4);
  atLeast(where, "faqs", page.faqs, 4);
  atLeast(where, "related", page.related, 4);

  page.faqs.forEach((faq, i) => {
    nonEmpty(`${where} › faqs[${i}]`, "answer", faq.answer);
    if (
      nonEmpty(`${where} › faqs[${i}]`, "question", faq.question) &&
      !faq.question.trim().endsWith("?")
    ) {
      warn(`${where} › faqs[${i}]`, `question does not end with "?"`);
    }
  });
  page.related.forEach((link, i) => {
    checkInternalLink(`${where} › related[${i}]`, link.href);
    if (link.href === `/${page.slug}/`) {
      error(`${where} › related[${i}]`, `page links to itself`);
    }
  });
}

// ---------------------------------------------------------------------------
// Blog posts. Framework-first posts need real
// structure: several sections with headings, a lede, and a CTA that goes to a
// live page.
// ---------------------------------------------------------------------------
unique(allBlogPosts, (p) => p.slug, "posts.ts", "slug");

const today = new Date().toISOString().slice(0, 10);

for (const post of allBlogPosts) {
  const where = `posts.ts › ${post.slug}`;

  if (!SLUG.test(post.slug)) {
    error(where, `slug must be lowercase kebab-case`);
  }
  if (nonEmpty(where, "title", post.title)) {
    lengthBetween(where, "title", post.title, 20, 110, "warn");
  }
  if (nonEmpty(where, "summary", post.summary)) {
    lengthBetween(where, "summary", post.summary, 60, 220, "warn");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date) || Number.isNaN(Date.parse(post.date))) {
    error(where, `date "${post.date}" must be a valid YYYY-MM-DD`);
  } else if (post.date > today) {
    warn(where, `scheduled: date "${post.date}" is after today, so this build does not publish it`);
  }
  if (!/^\d+ min read$/.test(post.readingTime)) {
    error(where, `readingTime "${post.readingTime}" must look like "7 min read"`);
  }
  if (!post.tag && !(post.tags && post.tags.length > 0)) {
    warn(where, `no tag or tags — the post cannot be grouped on the index`);
  }

  nonEmpty(where, "hero.eyebrow", post.hero.eyebrow);
  nonEmpty(where, "hero.lede", post.hero.lede);
  if (post.image) {
    nonEmpty(where, "image.alt", post.image.alt);
    if (!post.image.src.startsWith("/")) {
      error(where, `image.src must be a root-relative path`);
    }
  }

  atLeast(where, "sections", post.sections, 3);
  unique(post.sections, (s) => s.heading, where, "section heading");
  post.sections.forEach((section, i) => {
    const sw = `${where} › sections[${i}]`;
    nonEmpty(sw, "heading", section.heading);
    atLeast(sw, "paragraphs", section.paragraphs, 1);
    if (section.image) {
      nonEmpty(sw, "image.alt", section.image.alt);
    }
  });

  nonEmpty(where, "cta.heading", post.cta.heading);
  nonEmpty(where, "cta.body", post.cta.body);
  nonEmpty(where, "cta.label", post.cta.label);
  if (nonEmpty(where, "cta.href", post.cta.href)) {
    checkInternalLink(`${where} › cta`, post.cta.href);
  }
}

// ---------------------------------------------------------------------------
// Report.
// ---------------------------------------------------------------------------
const errors = findings.filter((f) => f.level === "error");
const warnings = findings.filter((f) => f.level === "warn");

for (const f of findings) {
  console.log(`${f.level === "error" ? "ERROR" : "warn "}  ${f.where}\n       ${f.message}`);
}

const checked = `${comparisons.length} comparison page${comparisons.length === 1 ? "" : "s"}, ${intentPages.length} intent page${intentPages.length === 1 ? "" : "s"}, ${blogPosts.length} blog post${blogPosts.length === 1 ? "" : "s"}`;

if (errors.length > 0) {
  console.log(
    `\ncheck-content: ${errors.length} error${errors.length === 1 ? "" : "s"}, ${warnings.length} warning${warnings.length === 1 ? "" : "s"} across ${checked}.`
  );
  process.exit(1);
}

console.log(
  `check-content: OK — ${checked} pass${warnings.length ? ` (${warnings.length} warning${warnings.length === 1 ? "" : "s"})` : ""}.`
);
