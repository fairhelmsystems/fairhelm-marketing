#!/usr/bin/env bun
/**
 * IndexNow: notify Bing, Yandex and the other IndexNow engines about URLs
 * that were created, materially updated or removed by this deploy.
 *
 * Not Google: Google reads the sitemap and does not participate in IndexNow.
 *
 * What gets submitted, and why only that:
 * - The sitemap is the source of canonical, indexable URLs (every entry goes
 *   through `canonicalUrl()`; noindex pages, redirect stubs and Markdown
 *   alternates are not in it). Nothing outside the sitemap is ever sent.
 * - The sitemap's `<lastmod>` comes from the git commit time of each route's
 *   content sources, so it changes when content changes, not when the site is
 *   merely redeployed. The previous live sitemap (fetched by deploy.sh before
 *   the upload) is diffed against the new one: a URL is submitted only if it
 *   is new, its lastmod changed, or it disappeared (deleted URLs are sent so
 *   the engines re-crawl and drop them).
 * - Unchanged URLs are never resubmitted, and nothing is sent per request or
 *   per render: this runs once, at the end of a deploy.
 *
 * Usage (deploy.sh does this):
 *   bun scripts/indexnow.ts --previous /tmp/previous-sitemap.xml [--dry-run]
 *
 * Without `--previous` (or if the previous sitemap is unreadable) every
 * sitemap URL is treated as changed — the conservative first-deploy case.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HOST = "squarecampus.com";
const ENDPOINT = "https://api.indexnow.org/indexnow";

type Entry = { loc: string; lastmod: string };

function parseSitemap(xml: string): Map<string, string> {
  const entries = new Map<string, string>();
  const re = /<url>([\s\S]*?)<\/url>/g;
  let m: RegExpExecArray | null = re.exec(xml);
  while (m) {
    const loc = /<loc>([^<]+)<\/loc>/.exec(m[1])?.[1]?.trim();
    const lastmod = /<lastmod>([^<]+)<\/lastmod>/.exec(m[1])?.[1]?.trim() ?? "";
    if (loc) entries.set(loc, lastmod);
    m = re.exec(xml);
  }
  return entries;
}

export function diffSitemaps(previous: Map<string, string> | null, next: Map<string, string>) {
  const changed: Entry[] = [];
  const removed: string[] = [];
  for (const [loc, lastmod] of next) {
    if (!previous?.has(loc) || previous.get(loc) !== lastmod) {
      changed.push({ loc, lastmod });
    }
  }
  if (previous) {
    for (const loc of previous.keys()) {
      if (!next.has(loc)) removed.push(loc);
    }
  }
  return { changed, removed };
}

function readKey(): string | null {
  const publicDir = join(ROOT, "public");
  const key = readdirSync(publicDir).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  return key ? key.replace(/\.txt$/, "") : null;
}

/** Only canonical URLs on the production host are ever submitted. */
function isSubmittable(url: string) {
  return url.startsWith(`https://${HOST}/`);
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const prevIndex = args.indexOf("--previous");
  const previousPath = prevIndex !== -1 ? args[prevIndex + 1] : undefined;

  const key = readKey();
  if (!key) {
    console.log("indexnow: no key file in public/ (expected <32 hex>.txt); skipping.");
    process.exit(0);
  }

  const nextPath = join(ROOT, "out", "sitemap.xml");
  if (!existsSync(nextPath)) {
    console.error("indexnow: out/sitemap.xml missing — run the build first.");
    process.exit(1);
  }
  const next = parseSitemap(readFileSync(nextPath, "utf8"));
  const previous =
    previousPath &&
    existsSync(previousPath) &&
    readFileSync(previousPath, "utf8").includes("<urlset")
      ? parseSitemap(readFileSync(previousPath, "utf8"))
      : null;

  const { changed, removed } = diffSitemaps(previous, next);
  const urlList = [...changed.map((e) => e.loc), ...removed].filter(isSubmittable);

  console.log(
    `indexnow: ${previous ? `${previous.size} previous` : "no previous sitemap"}, ${next.size} current, ${changed.length} new or updated, ${removed.length} removed.`
  );
  if (urlList.length === 0) {
    console.log("indexnow: nothing changed; not submitting.");
    process.exit(0);
  }
  for (const url of urlList)
    console.log(`  ${removed.includes(url) ? "removed " : "changed "} ${url}`);
  if (dryRun) {
    console.log("indexnow: dry run, not submitting.");
    process.exit(0);
  }

  const body = {
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${key}.txt`,
    urlList: urlList.slice(0, 10000),
  };
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    console.log(`indexnow: HTTP ${response.status} for ${urlList.length} URL(s).`);
  } catch (error) {
    // Never fail a deploy over a notification.
    console.log(
      `indexnow: submission failed (${String(error)}); the sitemap still carries the change.`
    );
  }
}
