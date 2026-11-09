import { emptyEmphasisPattern } from "../scripts/markdown-quality";
import { assert, suite, test } from "./harness";

suite("Markdown quality guard");

test("adjacent disclosure and definition labels remain valid bold paragraphs", () => {
  for (const markdown of [
    "**Slab breakdown**\n\n**First 1,000 students**",
    "**Preview**\n\n**Capabilities**",
    "****",
  ]) {
    assert.equal(emptyEmphasisPattern.test(markdown), false);
  }
});

test("genuinely empty emphasis within a paragraph still fails", () => {
  for (const markdown of ["** **", "**\t**", "**\n**", "** \n  **"]) {
    assert.equal(emptyEmphasisPattern.test(markdown), true);
  }
});
