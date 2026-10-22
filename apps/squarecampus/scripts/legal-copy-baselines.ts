import { createHash } from "node:crypto";
import type { FullContextDocument } from "../src/content/llms-full";

// Snapshot of the existing published Terms as rendered by pageToMarkdown.
// Legal language is preserved verbatim, rather than rewritten for a marketing
// checker. Changes must be reviewed before this digest is explicitly updated;
// never regenerate the baseline automatically during a build.
export const publishedLegalBaselines: Readonly<Record<string, string>> = {
  "https://squarecampus.com/terms-of-service/":
    "7c1c67313e9da3f33cd9ff77f136401e373f92fdd900f45facca4469683add12",
};

export function publishedLegalCopyStatus(
  document: FullContextDocument,
  baselines: Readonly<Record<string, string>> = publishedLegalBaselines
): "not-pinned" | "unchanged" | "changed" {
  const expected = baselines[document.url];
  if (!expected) return "not-pinned";
  const actual = createHash("sha256").update(document.markdown).digest("hex");
  return actual === expected ? "unchanged" : "changed";
}
