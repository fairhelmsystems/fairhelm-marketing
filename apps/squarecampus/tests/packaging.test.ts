import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PlanArchitecture } from "../src/components/pricing/plan-architecture";
import { PlanMatrix } from "../src/components/pricing/plan-matrix";
import { ScopedCostGrid } from "../src/components/pricing/scoped-cost-grid";
import {
  commercialProgrammes,
  corePlatform,
  dataPortability,
  foundingProgramme,
  identity,
  launchPilot,
  optionalEnhancements,
  planComparisonRows,
  securityBaseline,
} from "../src/content/commercial";
import { faqs } from "../src/content/faq";
import { foundingPartners, higherEducationPartners } from "../src/content/founding-partners";
import { renderLlmsTxt } from "../src/content/llms";
import { plans, pricingFaqs } from "../src/content/pricing";
import { securityFaqs } from "../src/content/security-faq";
import { assert, suite, test } from "./harness";

suite("packaging and launch-pilot regression");

test("each rendered plan carries the same core and multi-campus entitlement", () => {
  const html = renderToStaticMarkup(createElement(PlanArchitecture));
  for (const plan of plans) {
    const band =
      html.split(`aria-label="${plan.name} plan details"`)[1]?.split("</section>")[0] ?? "";
    assert.ok(band.includes(corePlatform.included), plan.id);
    assert.ok(band.includes(corePlatform.multiCampus), plan.id);
  }
});

test("comparison preserves equal core, security, ownership and consumption disclosure", () => {
  for (const label of [
    "Operational scope",
    "Baseline security",
    "Institution-owned data and supported exports",
    "SMS, WhatsApp and email allowances",
  ]) {
    const row = planComparisonRows.find((item) => item.label === label);
    assert.ok(row, label);
    assert.equal(row.starter, row.pro, label);
    assert.equal(row.pro, row.enterprise, label);
  }
  const campuses = planComparisonRows.find((row) => row.label === "Institutional structure");
  assert.ok(campuses);
  for (const plan of plans) assert.match(campuses[plan.id], /Multi-campus operations/);
  const html = renderToStaticMarkup(createElement(PlanMatrix));
  assert.doesNotMatch(html, /hidden md:block|Single campus|Single or growing campus/);
  assert.match(html, /<caption/);
  assert.match(html, /scope="col"/);
  assert.match(html, /scope="row"/);
  assert.match(html, /aria-label="Plan comparison, scroll horizontally on smaller screens"/);
});

test("enhancements identify their commercial treatment without numeric offers", () => {
  const html = renderToStaticMarkup(createElement(ScopedCostGrid));
  for (const item of optionalEnhancements) {
    assert.ok(html.includes(item.name));
    assert.ok(html.includes(item.treatment));
  }
  assert.match(html, /Available separately/);
  assert.match(html, /usage charges/);
  assert.match(html, /professional services/);
  assert.match(html, /require confirmation|requirement|confirmed/);
  assert.doesNotMatch(html, /₹|\bINR\b|unlimited ordinary-use/);
  for (const row of identity.byPlan.filter((item) => /Entra ID/.test(item.capability))) {
    for (const plan of plans)
      assert.match(row[plan.id], /Available separately.*technical onboarding/);
  }
});

test("launch and founding programmes retain separate costs, durations and outcomes", () => {
  assert.equal(commercialProgrammes.length, 3);
  assert.equal(launchPilot.days, 90);
  assert.match(launchPilot.summary, /90-day complimentary pilot/);
  assert.match(launchPilot.summary, /standard onboarding and reasonable operational support/);
  assert.match(launchPilot.eligibility, /approval and an agreed scope/);
  for (const term of ["Messaging", "AI", "storage", "integrations", "external-service"]) {
    assert.ok(launchPilot.boundaries.includes(term), term);
  }
  assert.match(launchPilot.scope, /documented success criteria/);
  assert.match(launchPilot.pricing, /before pilot activation/);
  assert.match(launchPilot.pricing, /review before.*expires/);
  assert.match(launchPilot.pricing, /subscribe or discontinue/);
  assert.match(launchPilot.geography, /Kotdwara and surrounding areas/);
  assert.match(launchPilot.separation, /does not confer founding status/);
  assert.equal(foundingProgramme.pilot.window, "60–90 days");
  assert.match(foundingProgramme.pilot.paidNote, /paid, scoped/);
  assert.equal(foundingPartners.page.path.paidNote, foundingProgramme.pilot.paidNote);
  assert.equal(higherEducationPartners.evidence.paidNote, foundingProgramme.pilot.paidNote);
});

test("pilot FAQ answers and machine-readable orientation use canonical facts", () => {
  for (const array of [faqs, pricingFaqs]) {
    const answer = array.find(
      (item) => item.question === "Is there a trial or pilot option?"
    )?.answer;
    assert.ok(answer);
    for (const value of [
      launchPilot.summary,
      launchPilot.eligibility,
      launchPilot.boundaries,
      launchPilot.pricing,
      launchPilot.separation,
    ]) {
      assert.ok(answer.includes(value), value);
    }
  }
  const llms = renderLlmsTxt();
  for (const value of [
    corePlatform.included,
    launchPilot.summary,
    launchPilot.pricing,
    securityBaseline,
    dataPortability,
  ]) {
    assert.ok(llms.includes(value));
  }
});

test("security and exit answers share baseline policy without invented delivery promises", () => {
  assert.ok(securityFaqs.some((item) => item.answer === securityBaseline));
  assert.ok(faqs.some((item) => item.answer.includes(dataPortability)));
  assert.match(dataPortability, /institution owns/i);
  assert.match(dataPortability, /retention and deletion/);
  assert.doesNotMatch(dataPortability, /within \d+ days|CSV|JSON|free exports/);
});
