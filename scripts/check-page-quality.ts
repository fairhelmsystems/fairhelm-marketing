import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
const results = [];
for (const app of ["squarecampus", "fairhelm", "blogs", "legal", "press"]) {
  const out = resolve(root, "apps", app, "out");
  const sitemap = readFileSync(resolve(out, "sitemap.xml"), "utf8");
  for (const [, url] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const path = new URL(url).pathname;
    if (path.endsWith(".txt")) continue;
    const file = resolve(out, `.${path}`, "index.html");
    const html = readFileSync(file, "utf8");
    const issues = [];
    if ((html.match(/<h1[ >]/g) || []).length !== 1) issues.push("H1 count");
    if ((html.match(/<main[ >]/g) || []).length !== 1) issues.push("main landmark count");
    if (!/<a\b[^>]*href="#main-content"/.test(html)) issues.push("skip link missing");
    if (!/<main\b(?=[^>]*id="main-content")(?=[^>]*tabindex="-1")/.test(html))
      issues.push("keyboard focus target missing");
    if (!/<html[^>]+lang="en-IN"/.test(html)) issues.push("document language");
    if (!/<meta name="viewport" content="width=device-width, initial-scale=1"/.test(html))
      issues.push("responsive viewport");
    if (app !== "squarecampus") {
      if ((html.match(/<footer\b/g) || []).length !== 1 || !html.includes("data-company-footer="))
        issues.push("shared company footer missing or nested");
      if (!/<link\b(?=[^>]*rel="icon")(?=[^>]*href="\/favicon.ico")/.test(html))
        issues.push("company favicon missing");
      if (
        !/<link\b(?=[^>]*rel="apple-touch-icon")(?=[^>]*href="\/apple-touch-icon.png")/.test(html)
      )
        issues.push("company touch icon missing");
    }
    if (app === "legal" && path.split("/").filter(Boolean).length === 2) {
      const scope = path.split("/")[1];
      if (!html.includes("data-legal-reading-layout="))
        issues.push("shared legal reading layout missing");
      if (!html.includes(`data-legal-scope="${scope}"`))
        issues.push("document navigation scope mismatch");
    }
    const canonical = html.match(/<link rel="canonical" href="([^\"]+)"/)?.[1];
    if (!canonical || new URL(canonical).href !== new URL(url).href)
      issues.push("canonical mismatch");
    for (const [, tag] of html.matchAll(/(<img\b[^>]*>)/g)) {
      if (!/\balt="[^\"]*"/.test(tag)) issues.push("image missing alt");
      const src = tag.match(/\bsrc="([^\"]+)"/)?.[1];
      if (src?.startsWith("/") && !src.startsWith("//") && !existsSync(resolve(out, src.slice(1))))
        issues.push(`missing image ${src}`);
      if (!/width="/.test(tag) && !/position:absolute/.test(tag))
        issues.push("image without fixed dimensions or fill positioning");
    }
    results.push({ app, path, issues });
  }
}
const failures = results.filter((r) => r.issues.length);
console.log(
  `Page quality: ${results.length} canonical HTML pages checked, ${failures.length} failures.`
);
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}
