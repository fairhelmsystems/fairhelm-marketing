import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getInsights } from "@fairhelm/fairhelm-content/insights";
import { blogUrl, FAIRHELM_ORIGIN } from "@fairhelm/config/urls";
for (const post of getInsights()) {
  const source = readFileSync(
    resolve(
      import.meta.dirname,
      "../../../packages/fairhelm-content/src/insights",
      `${post.slug}.md`
    ),
    "utf8"
  );
  const body = source
    .replace(/^---[\s\S]*?---\s*/, "")
    .replace(
      /\]\((\/[^)]+)\)/g,
      (_, path) =>
        `](${path.startsWith("/insights/") ? blogUrl(path.replace("/insights/", "/fairhelm/")) : `${FAIRHELM_ORIGIN}${path}`})`
    );
  const dir = resolve(import.meta.dirname, "../out", `.${post.path}`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    resolve(dir, "index.md"),
    `---\nurl: ${blogUrl(post.path)}\ntitle: ${JSON.stringify(post.title)}\n---\n\n# ${post.title}\n\n${body}`
  );
}
