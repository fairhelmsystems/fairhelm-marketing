#!/usr/bin/env bun
/**
 * Markdown alternates for agents.
 *
 * Runs after `next build`. For every route in content/markdown-alternates.ts
 * it reads the rendered `out/<route>/index.html`, keeps the `<main>` element,
 * drops navigation, footer, scripts, media and decorative markup, and writes
 * a clean Markdown document to `out/<route>/index.md` (`out/index.md` for
 * the home page). The Markdown is therefore generated from the same source
 * the browser gets; there is no second copy to keep in sync.
 *
 * The converter is deliberately small and dependency-free: a tokenizer over
 * the well-formed HTML Next emits, a tag stack, and block/inline rules for
 * headings, paragraphs, lists, definition lists, tables, details/summary,
 * links, emphasis and images with alt text. Anything it does not understand
 * falls through as text, so a page can never silently lose content — the
 * build check (scripts/check-build.ts) verifies each file has its H1 and no
 * conversion debris.
 *
 * Responsive markup: an element hidden at every width (Tailwind `hidden`
 * without a `sm:`/`md:`/`lg:` display class) or hidden from `sm:` upwards is
 * treated as invisible, so the desktop representation is the one converted
 * and a page never appears twice. Elements may opt out with `data-md-skip`,
 * and chip-like spans may ask for wrapping with `data-md-prefix` /
 * `data-md-suffix`.
 *
 *   bun scripts/markdown-alternates.ts            # all routes
 *   bun scripts/markdown-alternates.ts /pricing   # one route, prints it
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { markdownAlternatePaths } from "../src/content/markdown-alternates";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "out");
const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://squarecampus.com").replace(/\/$/, "");

import {createMarkdownConverter} from "@fairhelm/content-tools/markdown";
export const {htmlToMarkdown,pageToMarkdown}=createMarkdownConverter(SITE);

// ---------------------------------------------------------------------------
// Driver
// ---------------------------------------------------------------------------

export function outputPaths(route: string) {
  const dir = route === "/" ? OUT : join(OUT, route.replace(/^\//, ""));
  return { html: join(dir, "index.html"), md: join(dir, "index.md") };
}

if (import.meta.main) {
  const only = process.argv[2];
  const routes = only ? [only.replace(/\/$/, "") || "/"] : [...markdownAlternatePaths];
  let failed = false;
  for (const route of routes) {
    const { html, md } = outputPaths(route);
    if (!existsSync(html)) {
      console.error(`markdown-alternates: missing ${html} — did next build run?`);
      failed = true;
      continue;
    }
    const markdown = pageToMarkdown(readFileSync(html, "utf8"));
    writeFileSync(md, markdown);
    if (only) console.log(markdown);
    else
      console.log(
        `markdown-alternates: wrote ${md.replace(`${OUT}/`, "out/")} (${markdown.length} chars)`
      );
  }
  if (failed) process.exit(1);
}
