import { diffSitemaps, isSubmittable, parseSitemap } from "../scripts/indexnow";
import { assert, suite, test } from "./harness";

suite("IndexNow diff");

const previous = new Map([
  ["https://fairhelmsystems.com/", "2026-09-01T00:00:00.000Z"],
  ["https://fairhelmsystems.com/about/", "2026-09-01T00:00:00.000Z"],
  ["https://fairhelmsystems.com/retired/", "2026-08-01T00:00:00.000Z"],
]);
const next = new Map([
  ["https://fairhelmsystems.com/", "2026-09-01T00:00:00.000Z"],
  ["https://fairhelmsystems.com/about/", "2026-09-10T00:00:00.000Z"],
  ["https://fairhelmsystems.com/new/", "2026-09-10T00:00:00.000Z"],
]);

test("submits only URLs that are new, materially changed or removed", () => {
  const { changed, removed } = diffSitemaps(previous, next);
  assert.deepEqual(
    changed.map((e) => e.loc),
    ["https://fairhelmsystems.com/about/", "https://fairhelmsystems.com/new/"]
  );
  assert.deepEqual(removed, ["https://fairhelmsystems.com/retired/"]);
});

test("an unchanged sitemap submits nothing", () => {
  const { changed, removed } = diffSitemaps(next, next);
  assert.equal(changed.length + removed.length, 0);
});

test("without a previous sitemap every URL counts as changed, none as removed", () => {
  const { changed, removed } = diffSitemaps(null, next);
  assert.equal(changed.length, next.size);
  assert.equal(removed.length, 0);
});

test("only canonical-host page URLs are submittable; Markdown and other hosts are not", () => {
  assert.ok(isSubmittable("https://fairhelmsystems.com/about/"));
  assert.ok(isSubmittable("https://fairhelmsystems.com/llms.txt"));
  assert.ok(!isSubmittable("https://fairhelmsystems.com/about/index.md"));
  assert.ok(!isSubmittable("https://www.fairhelmsystems.com/about/"));
  assert.ok(!isSubmittable("https://squarecampus.com/"));
});

test("parses a sitemap into loc → lastmod", () => {
  const map = parseSitemap(
    "<urlset><url><loc>https://fairhelmsystems.com/</loc><lastmod>2026-09-10</lastmod></url></urlset>"
  );
  assert.deepEqual([...map], [["https://fairhelmsystems.com/", "2026-09-10"]]);
});
