import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const marketing = readFileSync(resolve(root, "apps/squarecampus/out/sitemap.xml"), "utf8");
assert.ok(!marketing.includes("/blog/"), "Marketing sitemap must exclude migrated blog pages");
const journal = readFileSync(resolve(root, "apps/blogs/out/sitemap.xml"), "utf8");
for (const [, url] of journal.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const path = new URL(url).pathname;
  assert.ok(
    existsSync(resolve(root, "apps/blogs/out", `.${path}`, "index.html")),
    `Missing canonical target ${url}`
  );
}
const stub = readFileSync(resolve(root, "apps/squarecampus/out/blog/index.html"), "utf8");
assert.ok(stub.includes("noindex"));
const stubCanonical = stub.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
assert.equal(new URL(stubCanonical || "").href, "https://blogs.squarecampus.com/");
console.log(
  "Cross-app migration verified: canonical targets exist and legacy routes are excluded from indexing."
);
const companyMap = readFileSync(resolve(root, "apps/fairhelm/out/sitemap.xml"), "utf8");
assert.ok(!companyMap.includes("/insights/"), "Company sitemap must exclude migrated insights");
const companyStub = readFileSync(resolve(root, "apps/fairhelm/out/insights/index.html"), "utf8");
assert.ok(companyStub.includes("noindex"));
assert.ok(companyStub.includes('rel="canonical" href="https://blogs.squarecampus.com/fairhelm/"'));

const { squarecampusLegalPaths, fairhelmLegalPaths, legalUrl } = await import(
  "../packages/config/src/urls"
);
for (const [app, paths] of [
  ["squarecampus", squarecampusLegalPaths],
  ["fairhelm", fairhelmLegalPaths],
] as const) {
  const sitemap = readFileSync(resolve(root, `apps/${app}/out/sitemap.xml`), "utf8");
  for (const slug of paths) {
    assert.ok(
      !sitemap.includes(
        `<loc>https://${app === "squarecampus" ? "squarecampus.com" : "fairhelmsystems.com"}/${slug}/</loc>`
      ),
      `Moved ${app}/${slug} remains in marketing sitemap`
    );
    const html = readFileSync(resolve(root, `apps/${app}/out/${slug}/index.html`), "utf8");
    assert.ok(html.includes("noindex"), `${app}/${slug} must not index a second policy copy`);
    assert.ok(
      html.includes(`rel="canonical" href="${legalUrl(app, slug)}"`),
      `${app}/${slug} canonical must point at its legal scope`
    );
  }
}
const home = readFileSync(resolve(root, "apps/fairhelm/out/index.html"), "utf8");
for (const slug of [
  "the-kpi-contract",
  "exception-ownership",
  "reconciliation-is-the-deliverable",
]) {
  assert.ok(
    home.includes(`src="https://blogs.squarecampus.com/insights/${slug}.webp"`),
    `Fairhelm cover ${slug} must use the Journal origin`
  );
}
console.log("Legal/press migration and cross-app Journal cover ownership verified.");
