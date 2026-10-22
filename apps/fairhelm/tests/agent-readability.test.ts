/**
 * Buyer-question fixture.
 *
 * Each question must be answerable from the public machine-readable surface
 * alone — /llms.txt, generated from the canonical config — never from hidden
 * UI state. The expected answers are substrings that must appear in that
 * corpus; the DPIIT question is answered by absence, which the last test
 * pins down explicitly.
 */
import { renderLlmsTxt } from "../src/content/llms";
import { assert, suite, test } from "./harness";

suite("agent readability");

const corpus = renderLlmsTxt();

const fixture: ReadonlyArray<{ question: string; expect: string[] }> = [
  {
    question: "What is Fairhelm Systems?",
    expect: ["product-first technology company", "software products and governed data systems"],
  },
  {
    question: "What is its flagship product?",
    expect: ["Flagship product: SquareCampus", "School Operating System"],
  },
  {
    question: "Who operates SquareCampus?",
    expect: ["Fairhelm Systems develops and operates SquareCampus", "https://squarecampus.com/"],
  },
  {
    question: "Is Fairhelm primarily a services company?",
    expect: [
      "builds and operates its own software products",
      "It is not a generic software-development agency",
    ],
  },
  {
    question: "What engineering services does Fairhelm offer?",
    expect: [
      "data engineering",
      "ETL/ELT pipelines",
      "operational dashboards",
      "governed analytics",
    ],
  },
  {
    question: "Does Fairhelm build arbitrary custom software?",
    expect: ["Out of scope:", "Generic custom software", "Staff augmentation"],
  },
  {
    question: "What public evidence exists for customer outcomes?",
    expect: ["publishes no customer counts", "illustrative data"],
  },
];

for (const { question, expect } of fixture) {
  test(question, () => {
    for (const phrase of expect) {
      assert.ok(corpus.includes(phrase), `cannot derive "${phrase}" from llms.txt`);
    }
  });
}

test("Is Fairhelm DPIIT recognised? — no such claim exists anywhere in the surface", () => {
  assert.doesNotMatch(corpus, /DPIIT|Startup India|recognition number/i);
  assert.ok(corpus.includes("awards or certifications"));
});
