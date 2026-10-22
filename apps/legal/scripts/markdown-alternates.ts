import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fairhelmLegalPaths, LEGAL_ORIGIN, squarecampusLegalPaths } from "@fairhelm/config/urls";
import { createMarkdownConverter } from "@fairhelm/content-tools/markdown";

const { pageToMarkdown } = createMarkdownConverter(LEGAL_ORIGIN);
for (const [scope, paths] of [
  ["fairhelm", fairhelmLegalPaths.filter((slug) => slug !== "legal")],
  ["squarecampus", squarecampusLegalPaths.filter((slug) => slug !== "competitor-notice")],
] as const) {
  for (const slug of paths) {
    const dir = resolve(import.meta.dirname, `../out/${scope}/${slug}`);
    writeFileSync(
      resolve(dir, "index.md"),
      pageToMarkdown(readFileSync(resolve(dir, "index.html"), "utf8"))
    );
  }
}
