/**
 * Repository-wide stale-claim search, as a test. Walks the maintained
 * source, the public directory and the README and fails on any stale or
 * forbidden wording (see stale-claims.ts). This is the regression guard for
 * the consistency pass: a reintroduced "incorporation in progress", a DPIIT
 * mention before approval, a "trusted by", a fabricated metric.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { assert, suite, test } from "./harness";
import { findStaleClaims } from "./stale-claims";

suite("repository stale-claim search");

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCAN = [
  "../../packages/fairhelm-content/src",
  "src/app",
  "src/components/site",
  "src/content",
  "src/lib",
  "public",
  "README.md",
  "docs",
];

function walk(path: string, out: string[] = []): string[] {
  if (!existsSync(path)) return out;
  if (statSync(path).isDirectory()) {
    for (const entry of readdirSync(path)) walk(join(path, entry), out);
  } else if (/\.(tsx?|md|txt|js)$/.test(path)) {
    out.push(path);
  }
  return out;
}

const files = SCAN.flatMap((p) => walk(join(ROOT, p)));

test("scans a meaningful set of files", () => {
  assert.ok(files.length > 30, `only ${files.length} files scanned`);
});

for (const file of files) {
  const rel = relative(ROOT, file);
  test(rel, () => {
    // Comments in TypeScript sources may name the doctrine itself ("DPIIT has
    // not been granted"); only code and copy are public, so strip them.
    const raw = readFileSync(file, "utf8");
    const text = /\.tsx?$/.test(file)
      ? raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "")
      : raw;
    const hits = findStaleClaims(text);
    assert.deepEqual(
      hits.map((h) => `${h.pattern} — ${h.reason}`),
      []
    );
  });
}

test("no hand-maintained llms files remain in public/ (they are generated)", () => {
  assert.ok(!existsSync(join(ROOT, "public/llms.txt")));
  assert.ok(!existsSync(join(ROOT, "public/llms-full.txt")));
});

test("no page passes meta keywords", () => {
  for (const file of files.filter((f) => f.endsWith("page.tsx"))) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /^\s*keywords:/m, relative(ROOT, file));
  }
});
