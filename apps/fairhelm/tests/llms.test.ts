import { llmsLinks, llmsRoute, renderLlmsTxt } from "../src/content/llms";
import { hasMarkdownAlternate } from "../src/content/markdown-alternates";
import { siteConfig } from "../src/lib/site-config";
import { assert, suite, test } from "./harness";
import { ILLUSTRATIVE_FIGURES } from "./illustrative-figures";
import { DIRECTIVE_PHRASES, findStaleClaims } from "./stale-claims";

suite("llms.txt");

const doc = renderLlmsTxt();
const lines = doc.split("\n");

test("starts with the H1 and a one-paragraph blockquote summary", () => {
  assert.equal(lines[0], "# Fairhelm Systems");
  assert.equal(lines[1], "");
  assert.match(lines[2], /^> Fairhelm Systems is a product-first technology company/);
});

test("has the agreed sections in order", () => {
  const headings = lines.filter((l) => l.startsWith("## "));
  assert.deepEqual(headings, [
    "## Products",
    "## Capabilities",
    "## Company",
    "## Insights",
    "## Trust and security",
  ]);
});

test("every link is a well-formed absolute list item with a description", () => {
  const linkLines = lines.filter((l) => l.startsWith("- ["));
  assert.ok(linkLines.length >= 10);
  for (const line of linkLines) {
    assert.match(
      line,
      /^- \[[^\]]+\]\(https:\/\/(fairhelmsystems\.com|squarecampus\.com|blogs\.squarecampus\.com|legal\.fairhelmsystems\.com)\/[^)]*\): .{20,}$/,
      line
    );
  }
});

test("every internal link resolves to a public route; the product links to squarecampus.com", () => {
  let product = 0;
  for (const link of llmsLinks()) {
    if (/^https?:/.test(link.path)) {
      if (link.path === siteConfig.product.url) product += 1;
      else assert.match(link.path, /^https:\/\/(?:blogs\.squarecampus\.com\/fairhelm\/|legal\.fairhelmsystems\.com\/fairhelm\/(?:[a-z-]+\/)?)$/);
      continue;
    }
    const route = llmsRoute(link.path);
    assert.ok(
      (siteConfig.publicPages as readonly string[]).includes(route),
      `${link.path} → ${route} is not a public page`
    );
  }
  assert.equal(product, 1);
});

test("pages with a Markdown alternate are linked to the .md URL, others to HTML", () => {
  for (const link of llmsLinks()) {
    if (/^https?:/.test(link.path)) continue;
    const expectMd = hasMarkdownAlternate(link.path);
    const target = `https://fairhelmsystems.com${link.path}${expectMd ? "index.md" : ""}`;
    assert.ok(doc.includes(`](${target})`), `${link.path} should link to ${target}`);
  }
});

test("contains no instructions to assistants, stale claims or illustrative figures", () => {
  for (const phrase of DIRECTIVE_PHRASES) assert.doesNotMatch(doc, phrase);
  assert.deepEqual(
    findStaleClaims(doc).map((h) => String(h.pattern)),
    []
  );
  for (const figure of ILLUSTRATIVE_FIGURES) assert.ok(!doc.includes(figure), figure);
});

test("states the canonical facts an evaluator needs", () => {
  for (const fact of [
    `CIN ${siteConfig.cin}`,
    `GSTIN ${siteConfig.gstin}`,
    "product-first",
    "School Operating System",
    "develops and operates SquareCampus",
    "https://squarecampus.com/",
    "It is not a generic software-development agency",
    "Out of scope:",
    "publishes no customer counts",
    siteConfig.contactEmail,
  ]) {
    assert.ok(doc.includes(fact), `missing fact: ${fact}`);
  }
});

test("stays intentionally small (far smaller than the product site's llms.txt)", () => {
  assert.ok(doc.length < 8000, `llms.txt is ${doc.length} chars; keep it navigational`);
});
