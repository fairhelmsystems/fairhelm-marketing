import { renderLlmsFullTxt } from "../src/content/llms-full";
import { assert, suite, test } from "./harness";

suite("full machine-readable context");

test("includes canonical source URLs and the provided public page text", () => {
  const text = renderLlmsFullTxt([
    {
      url: "https://squarecampus.com/enterprise/",
      markdown: "# SquareCampus Enterprise\n\nInstitutional governance requirements.",
    },
  ]);
  assert.ok(text.includes("Source: https://squarecampus.com/enterprise/"));
  assert.ok(text.includes("# SquareCampus Enterprise\n\nInstitutional governance requirements."));
  assert.ok(text.includes("https://squarecampus.com/enterprise/index.md"));
  assert.ok(text.includes("https://squarecampus.com/llms-full.txt"));
});
