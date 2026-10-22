import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  publicRetentionSchedule,
  RETENTION_PATH,
  retentionContentReview,
  retentionPage,
} from "@fairhelm/squarecampus-content/retention";
import { retentionCopyProblems } from "./retention-guards";

const out = resolve(import.meta.dirname, "../out");
const problems: string[] = [];
const fail = (message: string) => problems.push(message);
{
  const escapeHtml = (text: string) =>
    text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  const html = existsSync(resolve(out, "squarecampus/data-retention/index.html"))
    ? readFileSync(resolve(out, "squarecampus/data-retention/index.html"), "utf8")
    : "";
  const mdFile = resolve(out, "squarecampus/data-retention/index.md");
  const md = existsSync(mdFile) ? readFileSync(mdFile, "utf8") : "";
  const schedule = publicRetentionSchedule();

  // Metadata and structured data say what the page says.
  const description = escapeHtml(retentionPage.description);
  if (!html.includes(`<meta name="description" content="${description}"`))
    fail(`${RETENTION_PATH}: meta description differs from retentionPage.description`);
  if (!html.includes(`"description":${JSON.stringify(retentionPage.description)}`))
    fail(`${RETENTION_PATH}: JSON-LD description differs from retentionPage.description`);

  // The visible and Markdown representations carry the approved wording.
  for (const [label, doc] of [
    ["HTML", html],
    ["Markdown", md],
  ] as const) {
    if (!doc.includes(retentionPage.disclaimer))
      fail(`${RETENTION_PATH}: ${label} lacks the disclaimer`);
    if (schedule.length === 0 && !doc.includes(retentionPage.schedule.emptyNotice))
      fail(`${RETENTION_PATH}: ${label} lacks the empty-schedule notice`);
  }
  if (!retentionContentReview.reviewedOn && /Content last reviewed/.test(html))
    fail(`${RETENTION_PATH}: renders a review date that is not recorded`);

  // No period may appear unless it belongs to a reviewed schedule entry.
  let body = md;
  for (const entry of schedule) body = body.split(entry.period).join("");
  for (const problem of retentionCopyProblems(body, `${RETENTION_PATH} (Markdown)`)) fail(problem);
}

assert.ok(readFileSync(resolve(out, "sitemap.xml"), "utf8").includes("legal.fairhelmsystems.com"));
assert.deepEqual(problems, [], problems.join("\n"));
console.log("Legal: reviewed retention wording, citations, Markdown and approval gates verified.");

// Existing published baseline, preserved across the URL/metadata relocation.
const terms = readFileSync(resolve(out, "squarecampus/terms-of-service/index.md"), "utf8")
  .replaceAll("https://legal.fairhelmsystems.com/squarecampus/", "https://squarecampus.com/")
  .replaceAll("https://legal.fairhelmsystems.com/llms.txt", "https://squarecampus.com/llms.txt")
  .replace(" | Fairhelm Legal", " | SquareCampus");
assert.equal(
  createHash("sha256").update(terms).digest("hex"),
  "7c1c67313e9da3f33cd9ff77f136401e373f92fdd900f45facca4469683add12",
  "Published Terms wording changed: legal review is required before updating the existing baseline"
);
