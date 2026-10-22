import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { faqs } from "../src/content/faq";
import { renderLlmsTxt } from "../src/content/llms";
import { plans } from "../src/content/pricing";
import {
  publicationBlocker,
  publicRetentionSchedule,
  type RetentionRule,
  retentionContentReview,
  retentionPage,
  retentionPointer,
  retentionReuse,
  retentionRules,
  sourceReferences,
} from "../src/content/retention";
import { assert, suite, test } from "./harness";
import { collectStrings, retentionCopyProblems } from "./retention-guards";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path: string) => readFileSync(join(ROOT, path), "utf8");

suite("data retention");

/**
 * Fixture only. Every value is deliberately fake: real research, periods and
 * review records are kept outside this repository.
 */
function fixture(overrides: Partial<RetentionRule> = {}): RetentionRule {
  return {
    id: "fixture.rule",
    version: 2,
    category: "FIXTURE CATEGORY",
    jurisdiction: "FIXTURE JURISDICTION",
    applicability: "FIXTURE APPLICABILITY",
    period: "FIXTURE PERIOD",
    trigger: "FIXTURE TRIGGER",
    qualification: "FIXTURE QUALIFICATION",
    citation: "FIXTURE CITATION",
    sourceUrl: "https://example.invalid/fixture",
    commencement: null,
    sourceCheckedOn: "2000-01-01",
    status: "VERIFIED",
    review: { reference: "FIXTURE-REVIEW-REF", reviewedOn: "2000-01-02", approvedVersion: 2 },
    approvedForPublicDisplay: true,
    ...overrides,
  };
}

test("a complete, reviewed, display-approved rule is published with public fields only", () => {
  const [entry] = publicRetentionSchedule([fixture()]);
  assert.ok(entry);
  assert.deepEqual(Object.keys(entry).sort(), [
    "applicability",
    "category",
    "citation",
    "id",
    "jurisdiction",
    "period",
    "qualification",
    "sourceUrl",
    "trigger",
  ]);
  const serialised = JSON.stringify(entry);
  assert.doesNotMatch(serialised, /FIXTURE-REVIEW-REF|2000-01-0[12]|sourceCheckedOn|review/);
});

test("CITED and PENDING_REVIEW rules never reach public output", () => {
  for (const status of ["CITED", "PENDING_REVIEW"] as const) {
    assert.equal(publicRetentionSchedule([fixture({ status })]).length, 0, status);
    assert.match(publicationBlocker(fixture({ status })) ?? "", new RegExp(status));
  }
});

test("incomplete approval metadata cannot produce a published VERIFIED rule", () => {
  const broken: Array<[string, Partial<RetentionRule>]> = [
    ["no review", { review: null }],
    [
      "empty reference",
      { review: { reference: " ", reviewedOn: "2000-01-02", approvedVersion: 2 } },
    ],
    ["bad date", { review: { reference: "R", reviewedOn: "02/01/2000", approvedVersion: 2 } }],
    ["stale version", { review: { reference: "R", reviewedOn: "2000-01-02", approvedVersion: 1 } }],
    ["not display-approved", { approvedForPublicDisplay: false }],
    ["no source", { sourceUrl: null }],
    ["insecure source", { sourceUrl: "http://example.invalid" }],
    ["no applicability", { applicability: null }],
    ["blank jurisdiction", { jurisdiction: "" }],
    ["no period", { period: null }],
  ];
  for (const [label, overrides] of broken) {
    const rule = fixture(overrides);
    assert.ok(publicationBlocker(rule), `${label} should block publication`);
    assert.equal(publicRetentionSchedule([rule]).length, 0, label);
  }
});

test("a substantive change to a reviewed rule needs fresh review", () => {
  const reviewed = fixture();
  assert.equal(publicationBlocker(reviewed), null);
  const changed = { ...reviewed, version: reviewed.version + 1, period: "FIXTURE PERIOD 2" };
  assert.match(publicationBlocker(changed) ?? "", /approved version/);
});

test("published entries keep their jurisdiction and applicability labels", () => {
  for (const entry of publicRetentionSchedule([fixture()])) {
    assert.ok(entry.jurisdiction.trim());
    assert.ok(entry.applicability.trim());
  }
});

test("no rule in the repository is publishable yet, so the schedule is empty", () => {
  assert.equal(publicRetentionSchedule().length, 0);
  for (const rule of retentionRules) {
    assert.notEqual(publicationBlocker(rule), null, `${rule.id} must not be publishable`);
  }
});

test("the approved review-state and disclaimer wording is used verbatim", () => {
  assert.equal(
    retentionPage.schedule.emptyNotice,
    "We have not yet published a reviewed retention schedule. Applicable retention requirements depend on the institution and the records concerned."
  );
  assert.equal(
    retentionPage.disclaimer,
    "This page explains SquareCampus’s approach to data retention and the arrangements described here. It is not legal advice. Institutions should confirm their obligations with their own advisors."
  );
  assert.match(
    retentionPage.enquiries.requests,
    /We assess each request against applicable requirements and any continuing need to retain the information\./
  );
});

test("public retention copy carries no periods, deadlines, storage amounts, money or overclaims", () => {
  const surfaces: Array<[string, unknown]> = [
    ["retentionPage", retentionPage],
    ["retentionPointer", retentionPointer],
    ["retentionReuse", retentionReuse],
    ["sourceReferences", sourceReferences.map((r) => [r.title, r.issuer, r.covers])],
  ];
  const problems = surfaces.flatMap(([label, value]) =>
    collectStrings(value).flatMap((text) => retentionCopyProblems(text, label))
  );
  assert.deepEqual(problems, []);
});

test("the retention FAQ answers reuse the reconciled wording", () => {
  const exit = faqs.find((f) => f.question === "What happens to our data if we leave?");
  const compliance = faqs.find((f) => f.question === "What compliance standards do you follow?");
  assert.ok(
    exit?.answer.includes(retentionReuse.faqExit),
    "Retain the full reconciled exit wording"
  );
  assert.equal(compliance?.answer, retentionReuse.faqCompliance);
});

test("the pricing pointer is one shared statement on every plan presentation", () => {
  assert.equal(
    retentionPointer.text,
    "Your plan does not determine your legal retention obligations. Storage and archive arrangements are specified in your proposal and order form."
  );
  assert.equal(retentionPointer.href, "https://legal.fairhelmsystems.com/squarecampus/data-retention/");
  // Every plan band renders the same component inside the per-plan loop.
  const bands = read("src/components/pricing/plan-architecture.tsx");
  const loop = bands.slice(bands.indexOf("plans.map("));
  assert.ok(loop.includes("<RetentionPointer"), "plan bands must render <RetentionPointer />");
  assert.ok(read("src/components/pricing/plan-matrix.tsx").includes("<RetentionPointer"));
  assert.ok(plans.length === 3);
  // It never names or varies by a plan.
  for (const plan of plans) assert.ok(!retentionPointer.text.includes(plan.name));
  assert.ok(renderLlmsTxt().includes(retentionPointer.text), "llms.txt must carry the pointer");
});

test("source references are official, https and self-consistent", () => {
  for (const ref of sourceReferences) {
    const url = new URL(ref.url);
    assert.equal(url.protocol, "https:");
    assert.ok(url.hostname.endsWith(ref.host), `${ref.id}: host ${ref.host} vs ${url.hostname}`);
    assert.match(url.hostname, /\.gov\.in$/, `${ref.id} must be an official source`);
    assert.match(ref.checkedOn, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test("the content-review date is recorded by hand and never derived from the build", () => {
  const { reviewedOn } = retentionContentReview;
  assert.ok(reviewedOn === null || /^\d{4}-\d{2}-\d{2}$/.test(reviewedOn));
  const page = read("../legal/src/app/squarecampus/data-retention/page.tsx");
  const content = read("../../packages/squarecampus-content/src/retention.ts");
  for (const source of [page, content]) {
    assert.doesNotMatch(source, /new Date\(|Date\.now\(|toLocaleDateString/);
  }
});

test("internal research markers never appear in public content", () => {
  const content = read("../../packages/squarecampus-content/src/retention.ts");
  // Reviewer identities are held by reference only; research status words
  // may appear in the type definitions but no record may carry them.
  assert.equal(retentionRules.length, 0);
  assert.doesNotMatch(content, /reviewedBy|verifiedBy|counsel said|legal opinion/i);
});
