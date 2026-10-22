import { diffSitemaps } from "../scripts/indexnow";
import { assert, suite, test } from "./harness";

suite("IndexNow diff");

const previous = new Map([
  ["https://squarecampus.com/", "2026-09-01T00:00:00.000Z"],
  ["https://squarecampus.com/pricing/", "2026-09-01T00:00:00.000Z"],
  ["https://squarecampus.com/retired-page/", "2026-08-01T00:00:00.000Z"],
]);
const next = new Map([
  ["https://squarecampus.com/", "2026-09-01T00:00:00.000Z"],
  ["https://squarecampus.com/pricing/", "2026-09-10T00:00:00.000Z"],
  ["https://squarecampus.com/new-page/", "2026-09-10T00:00:00.000Z"],
]);

test("submits only URLs that are new, materially changed or removed", () => {
  const { changed, removed } = diffSitemaps(previous, next);
  assert.deepEqual(
    changed.map((e) => e.loc),
    ["https://squarecampus.com/pricing/", "https://squarecampus.com/new-page/"]
  );
  assert.deepEqual(removed, ["https://squarecampus.com/retired-page/"]);
});

test("an unchanged sitemap submits nothing", () => {
  const { changed, removed } = diffSitemaps(next, next);
  assert.equal(changed.length, 0);
  assert.equal(removed.length, 0);
});

test("without a previous sitemap every URL counts as changed, none as removed", () => {
  const { changed, removed } = diffSitemaps(null, next);
  assert.equal(changed.length, next.size);
  assert.equal(removed.length, 0);
});
