/**
 * Agent-readability fixture.
 *
 * Each buyer question below must be answerable from /llms.txt plus the
 * content that the linked Markdown pages are generated from (the FAQ arrays
 * and the commercial facts) — never from hidden UI state. The expected
 * answers are substrings that must appear in that corpus.
 */
import { faqs } from "../src/content/faq";
import { foundingPartners } from "../src/content/founding-partners";
import { renderLlmsTxt } from "../src/content/llms";
import { pricingFaqs } from "../src/content/pricing";
import { securityFaqs } from "../src/content/security-faq";
import { entityFaqs } from "../src/content/what-is-squarecampus";
import { assert, suite, test } from "./harness";

suite("agent readability");

const corpus = [
  renderLlmsTxt(),
  JSON.stringify([faqs, pricingFaqs, securityFaqs, entityFaqs, foundingPartners]),
].join("\n");

const fixture: ReadonlyArray<{ question: string; expect: string[] }> = [
  {
    question: "What is SquareCampus?",
    expect: ["School Operating System", "institutional governance", "operational visibility"],
  },
  {
    question: "Who is it designed for?",
    expect: ["educational trusts", "multi-campus", "higher-education institutions"],
  },
  {
    question: "Is pricing public?",
    expect: [
      "model is published on the pricing page",
      "written proposal after institutional discovery",
    ],
  },
  {
    question: "What does Enterprise add?",
    expect: [
      "cross-campus command",
      "identity governance",
      "The institution owns its institutional data in every plan",
    ],
  },
  {
    question: "Does Pro support institutional SSO?",
    expect: ["optional single sign-on with Microsoft Entra ID"],
  },
  {
    question: "Can an institution use normal credentials?",
    expect: [
      "baseline requirements in every plan",
      "deployment readiness are confirmed before activation",
    ],
  },
  {
    question: "How many Founding Institutional Partner positions exist?",
    expect: ["exactly two Founding Institutional Partner positions", "closes permanently"],
  },
  {
    question: "What does a Founding Partner receive?",
    expect: ["40%", "roadmap influence", "without the standard white-label charge"],
  },
  {
    question: "Is SquareCampus appropriate if I only need attendance and fees?",
    expect: ["will look expensive"],
  },
  {
    question: "Does Starter support multi-campus institutions?",
    expect: ["Starter, Pro and Enterprise support multi-campus operations"],
  },
  {
    question: "What does the selected complimentary pilot include?",
    expect: [
      "90-day complimentary pilot",
      "standard onboarding",
      "reasonable operational support",
      "subscribe or discontinue",
    ],
  },
  {
    question: "Can Starter request Entra separately?",
    expect: ["Starter, Pro or Enterprise", "separately quoted enhancement"],
  },
  {
    question: "Is SSO mandatory?",
    expect: ["Single sign-on is optional"],
  },
];

for (const { question, expect } of fixture) {
  test(question, () => {
    for (const phrase of expect) {
      assert.ok(
        corpus.includes(phrase),
        `cannot derive "${phrase}" from llms.txt + linked content`
      );
    }
  });
}
