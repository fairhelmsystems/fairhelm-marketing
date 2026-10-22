#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sitemap from "../src/app/sitemap";
import { type FullContextDocument, renderLlmsFullTxt } from "../src/content/llms-full";
import { pageToMarkdown } from "./markdown-alternates";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "../out");

export function fullContextDocuments(): FullContextDocument[] {
  return sitemap()
    .filter(({ url }) => !new URL(url).pathname.split("/").some((part) => part.includes(".")))
    .map(({ url }) => ({
      url,
      markdown: pageToMarkdown(
        readFileSync(join(OUT, new URL(url).pathname, "index.html"), "utf8")
      ),
    }));
}

if (import.meta.main) {
  const documents = fullContextDocuments();
  const text = renderLlmsFullTxt(documents);
  writeFileSync(join(OUT, "llms-full.txt"), text);
  console.log(
    `llms-full: wrote ${documents.length} public pages (${Buffer.byteLength(text)} bytes)`
  );
}
