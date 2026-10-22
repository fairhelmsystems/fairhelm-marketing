import {
  enterpriseBeyondModules,
  fit,
  foundingProgramme,
  identity,
  planHierarchy,
  pricingAvailability,
  product,
} from "../src/content/commercial";
import { company } from "../src/content/company";
import { faqs } from "../src/content/faq";
import { foundingPartners, higherEducationPartners } from "../src/content/founding-partners";
import { plans, pricingFaqs } from "../src/content/pricing";
import { securityFaqs } from "../src/content/security-faq";
import { entityFaqs } from "../src/content/what-is-squarecampus";
import { assert, suite, test } from "./harness";
import { findStaleClaims } from "./stale-claims";

suite("commercial facts");

test("exactly two Founding Institutional Partner positions, one school and one university", () => {
  assert.equal(foundingProgramme.positions, 2);
  assert.equal(foundingProgramme.positionLabels.length, 2);
  assert.match(foundingProgramme.positionLabels[0], /school/i);
  assert.match(foundingProgramme.positionLabels[1], /university/i);
  assert.match(foundingProgramme.positionsStatement, /exactly two/i);
  assert.match(foundingProgramme.closure, /closes permanently/i);
});

test("the protected Enterprise discount is 40% and carries no duration", () => {
  assert.equal(foundingProgramme.enterpriseDiscountPercent, 40);
  const text = JSON.stringify([foundingProgramme, foundingPartners, higherEducationPartners]);
  assert.match(text, /40% (Enterprise )?discount|40% discount on Enterprise/);
  assert.doesNotMatch(text, /lifetime/i);
  assert.doesNotMatch(text, /initial term/i);
  assert.doesNotMatch(text, /for the agreed term/i);
});

test("Founding Partner copy uses neutral commitment wording and no securities language", () => {
  const text = JSON.stringify([foundingProgramme, foundingPartners, higherEducationPartners]);
  assert.match(text, /strategic capital commitment under a separately executed agreement/);
  for (const hit of findStaleClaims(text)) {
    assert.fail(`stale claim in founding partner content: ${hit.pattern} (${hit.reason})`);
  }
  assert.doesNotMatch(text, /cohort/i);
});

test("roadmap influence is bounded: no veto, control or IP ownership", () => {
  const boundaries = foundingProgramme.boundaries.join(" ");
  assert.match(boundaries, /not a veto/);
  assert.match(boundaries, /intellectual property/i);
  assert.match(
    boundaries,
    /retains final product, architecture, security and engineering authority/
  );
});

test("the plan hierarchy keeps Enterprise as governance, not more modules", () => {
  assert.deepEqual(
    planHierarchy.map((p) => p.id),
    ["starter", "pro", "enterprise"]
  );
  assert.match(planHierarchy[2].summary, /governance/i);
  assert.match(planHierarchy[2].summary, /identity governance/i);
  assert.ok(enterpriseBeyondModules.length >= 5);
  assert.match(plans[2].spotlight?.note ?? "", /not Pro with more modules/);
});

test("identity doctrine: common security baseline, separately quoted SSO across plans, scoped governance", () => {
  assert.match(identity.baseline.body, /baseline requirements in every plan/);
  assert.match(identity.baseline.body, /deployment readiness are confirmed before activation/);
  assert.match(identity.sso.body, /optional single sign-on with Microsoft Entra ID/);
  assert.match(identity.enterprise.body, /identity governance rather than by having SSO/);
  assert.equal(identity.modes.length, 3);
  assert.match(identity.principle, /never derived from an email address or domain alone/);
  const sso = identity.byPlan.find((row) => /Entra ID single sign-on/.test(row.capability));
  assert.ok(sso);
  assert.match(sso.starter, /Available separately/);
  assert.equal(sso.starter, sso.pro);
  assert.equal(sso.pro, sso.enterprise);
  assert.match(sso.starter, /quotation and technical onboarding/);
  // Nothing unimplemented is described as available.
  const text = JSON.stringify(identity);
  assert.doesNotMatch(text, /Google Workspace (SSO|single sign-on)/);
  assert.doesNotMatch(text, /SAML/);
  assert.doesNotMatch(text, /\bSCIM\b/);
});

test("pricing availability is stated once and reused verbatim by every FAQ surface", () => {
  const short = pricingAvailability.short;
  assert.match(short, /model is published/i);
  const pricingAnswer = pricingFaqs.find((f) => f.question === "Is pricing public?")?.answer ?? "";
  const siteAnswer = faqs.find((f) => f.question === "Is pricing public?")?.answer ?? "";
  assert.ok(pricingAnswer.includes(short), "pricing FAQ must quote pricingAvailability.short");
  assert.ok(siteAnswer.includes(short), "site FAQ must quote pricingAvailability.short");
});

test("no rupee amounts or rates anywhere in commercial content", () => {
  const text = JSON.stringify([pricingAvailability, plans, pricingFaqs, faqs, foundingProgramme]);
  assert.doesNotMatch(text, /₹|\bRs\.?\s?\d|\bINR\b|per student per (year|month)/);
});

test("fit guidance names who SquareCampus is not for", () => {
  assert.ok(fit.notRightFitIf.length >= 3);
  assert.match(fit.notRightFitIf.join(" "), /attendance, fee collection and report cards/);
  assert.match(pricingAvailability.positioning, /will look expensive/);
});

test("the canonical short description is one sentence in the agreed semantic territory", () => {
  assert.match(product.shortDescription, /^SquareCampus is a School Operating System/);
  for (const term of ["governance", "accountability", "operational visibility", "India"]) {
    assert.ok(product.shortDescription.includes(term), `missing "${term}"`);
  }
});

test("no stale commercial claims in any FAQ array", () => {
  const text = JSON.stringify([faqs, pricingFaqs, securityFaqs, entityFaqs]);
  const hits = findStaleClaims(text);
  assert.deepEqual(
    hits.map((h) => h.reason),
    [],
    `stale claims: ${hits.map((h) => String(h.pattern)).join(", ")}`
  );
});

test("GSTIN is well-formed, Karnataka-registered and passes its check digit", () => {
  const gstin = company.gstin;
  assert.match(gstin, /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/);
  // State code 29 is Karnataka, where the registered office is.
  assert.equal(gstin.slice(0, 2), "29");
  assert.equal(company.address.region, "Karnataka");
  // The embedded PAN belongs to a company ("C" in the fourth position).
  assert.equal(gstin[5], "C");
  // Check digit: GSTN's base-36 weighted checksum over the first 14 chars.
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    const product = chars.indexOf(gstin[i]) * (i % 2 === 0 ? 1 : 2);
    sum += Math.floor(product / 36) + (product % 36);
  }
  assert.equal(gstin[14], chars[(36 - (sum % 36)) % 36]);
});

test("the GST FAQ names the invoicing entity and its GSTIN", () => {
  const answer = pricingFaqs.find((f) => f.question === "Is GST included?")?.answer ?? "";
  assert.ok(answer.includes(company.gstin), "GST FAQ must quote company.gstin");
  assert.ok(answer.includes(company.legalNameDisplay));
});
