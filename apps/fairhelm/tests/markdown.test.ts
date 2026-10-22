import { htmlToMarkdown, pageToMarkdown } from "../scripts/markdown-alternates";
import { assert, suite, test } from "./harness";

suite("Markdown converter");

const page = `<!doctype html><html><head><title>About | Fairhelm Systems</title>
<meta name="description" content="A description."/>
<link rel="canonical" href="https://fairhelmsystems.com/about/"/></head>
<body><header><nav><a href="/">Home</a></nav></header>
<main>
<h1>Heading one</h1>
<p>Body text with <strong>emphasis</strong> and a <a href="/contact/">link</a>.</p>
<section class="border-b py-10 md:hidden"><h2>Mobile duplicate</h2><p>Phone-only copy.</p></section>
<section class="hidden py-20 md:block"><h2>Desktop section</h2>
<ul><li>First item</li><li>Second item</li></ul></section>
<div data-md-skip role="img" aria-label="Illustrative"><p>Data trust 98.4% Reconciled</p></div>
<form><input name="x"/><button>Send</button></form>
<table><tr><th>Col A</th><th>Col B</th></tr><tr><td>1</td><td>2</td></tr></table>
</main><footer><p>Footer text</p></footer></body></html>`;

test("keeps main content, headings, emphasis, links, lists and tables", () => {
  const md = htmlToMarkdown(page);
  assert.ok(md.startsWith("# Heading one"));
  assert.ok(md.includes("**emphasis**"));
  assert.ok(md.includes("[link](https://fairhelmsystems.com/contact/)"));
  assert.ok(md.includes("## Desktop section"));
  assert.ok(
    md.includes("- First item\n\n- Second item") || md.includes("- First item\n- Second item")
  );
  assert.ok(md.includes("| Col A | Col B |"));
});

test("drops navigation, footer, forms, the phone-only duplicate and illustrative panels", () => {
  const md = htmlToMarkdown(page);
  assert.ok(!md.includes("Home"));
  assert.ok(!md.includes("Footer text"));
  assert.ok(!md.includes("Send"));
  assert.ok(!md.includes("Mobile duplicate"));
  assert.ok(!md.includes("98.4%"));
});

test("front matter carries title, description, canonical and the describedby pointer", () => {
  const md = pageToMarkdown(page);
  assert.ok(md.startsWith('---\ntitle: "About | Fairhelm Systems"'));
  assert.ok(md.includes("canonical: https://fairhelmsystems.com/about/"));
  assert.ok(md.includes("describedby: https://fairhelmsystems.com/llms.txt"));
});
