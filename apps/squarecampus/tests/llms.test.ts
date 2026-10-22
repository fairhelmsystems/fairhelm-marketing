import sitemap from "../src/app/sitemap";
import { llmsLinks, llmsRoute, renderLlmsTxt } from "../src/content/llms";
import { hasMarkdownAlternate } from "../src/content/markdown-alternates";
import { assert, suite, test } from "./harness";
import { DIRECTIVE_PHRASES, findStaleClaims } from "./stale-claims";

suite("llms.txt");

const doc = renderLlmsTxt();
const lines = doc.split("\n");
const sitemapRoutes = new Set(
  sitemap().map((entry) => entry.url.replace(/^https:\/\/squarecampus\.com/, ""))
);

test("starts with the H1 and a one-paragraph blockquote summary", () => {
  assert.equal(lines[0], "# SquareCampus");
  assert.equal(lines[1], "");
  assert.match(lines[2], /^> SquareCampus is a School Operating System/);
});

test("has the agreed sections in order", () => {
  const headings = lines.filter((l) => l.startsWith("## "));
  assert.deepEqual(headings, [
    "## Evaluate SquareCampus",
    "## Institutional requirements",
    "## Intelligence",
    "## Commercial programmes",
    "## Company and trust",
    "## Optional",
  ]);
});

test("every link is a well-formed absolute list item with a description", () => {
  const linkLines = lines.filter((l) => l.startsWith("- ["));
  assert.ok(linkLines.length >= 25);
  for (const line of linkLines) {
    assert.match(
      line,
      /^- \[[^\]]+\]\(https:\/\/(?:squarecampus\.com|blogs\.squarecampus\.com|legal\.fairhelmsystems\.com)\/[^)]*\): .{20,}$/,
      line
    );
  }
});

test("every linked route is in the sitemap (Markdown alternates map back to their page)", () => {
  for (const link of llmsLinks()) {
    if (/^https:\/\/(?:blogs.squarecampus.com|legal.fairhelmsystems.com)\//.test(link.path)) {
      assert.ok(doc.includes(link.path), `missing migrated blog link ${link.path}`);
      continue;
    }
    const route = llmsRoute(link.path);
    assert.ok(
      sitemapRoutes.has(route),
      `${link.path} → ${route} is not an indexable sitemap route`
    );
  }
});

test("pages with a Markdown alternate are linked to the .md URL, others to HTML", () => {
  for (const link of llmsLinks()) {
    if (/^https:\/\/(?:blogs.squarecampus.com|legal.fairhelmsystems.com)\//.test(link.path)) {
      assert.ok(doc.includes(link.path), `missing migrated blog link ${link.path}`);
      continue;
    }
    const expectMd = hasMarkdownAlternate(link.path);
    const pattern = new RegExp(
      `\\]\\(https://squarecampus\\.com${link.path.replace(/\//g, "\\/")}/?${expectMd ? "index\\.md" : ""}\\)`
    );
    assert.match(doc, pattern, `${link.path} should link to ${expectMd ? "index.md" : "HTML"}`);
  }
});

test("contains no instructions to assistants and no stale commercial claims", () => {
  for (const phrase of DIRECTIVE_PHRASES) {
    assert.doesNotMatch(doc, phrase, `directive phrase ${phrase}`);
  }
  const hits = findStaleClaims(doc);
  assert.deepEqual(
    hits.map((h) => String(h.pattern)),
    []
  );
});

test("states the canonical facts an evaluator needs", () => {
  for (const fact of [
    "exactly two Founding Institutional Partner positions",
    "closes permanently",
    "40%",
    "model is published on the pricing page",
    "written proposal after institutional discovery",
    "SquareCampus-managed sign-in",
    "90-day complimentary pilot",
    "Starter, Pro and Enterprise support multi-campus operations",
    "optional single sign-on with Microsoft Entra ID",
    "identity governance",
    "publishes no customer counts",
    "Microsoft Azure in India",
    "CIN ",
  ]) {
    assert.ok(doc.includes(fact), `missing fact: ${fact}`);
  }
});

test("stays intentionally small", () => {
  assert.ok(doc.length < 20000, `llms.txt is ${doc.length} chars; keep it navigational`);
});
