import {
  enterpriseBeyondModules,
  corePlatform,
  fit,
  foundingProgramme,
  identity,
  commercialScope,
  mobileAppPublishing,
  planHierarchy,
  planComparisonRows,
  pricingAvailability,
  product,
} from "../src/content/commercial";
import { company } from "../src/content/company";
import { faqs } from "../src/content/faq";
import policy from "@fairhelm/squarecampus-content/pricing-policy.json";
import { plans, pricingFaqs, WHITE_LABEL_NOTE } from "../src/content/pricing";
import { pricingPolicy } from "@fairhelm/squarecampus-content/pricing";
import { securityFaqs } from "../src/content/security-faq";
import { CANONICAL_DEFINITION, entityFaqs } from "../src/content/what-is-squarecampus";
import { assert, suite, test } from "./harness";
import { findStaleClaims } from "./stale-claims";

suite("commercial facts");

test("Fairhelm owns the publisher accounts for standard and white-label mobile apps", () => {
  assert.equal(pricingPolicy.whiteLabel.publisherAccountScope, "fairhelm_systems");
  assert.match(mobileAppPublishing, /Standard and white-label mobile apps/);
  assert.ok(mobileAppPublishing.includes(company.legalNameDisplay));
  assert.ok(WHITE_LABEL_NOTE.includes(mobileAppPublishing));
});

test("founding pilot has a fixed fee and no automatic conversion", () => {
  const pilot = policy.foundingPilot;
  assert.equal(pilot.feePaise, 5000000);
  assert.equal(pilot.autoRenew, false);
  assert.equal(pilot.conversionCreditPaise, 0);
  assert.equal(pilot.accessEnd, "2027-03-31T23:59:00+05:30");
  assert.match(pilot.tax, /additional/);
  assert.match(pilot.scope, /limits/);
  assert.match(foundingProgramme.nature, /₹50,000/);
});

test("current founding programme excludes superseded public terms", () => {
  const text = JSON.stringify(foundingProgramme);
  assert.doesNotMatch(text, /60[–-]90|40%|strategic capital|exactly two|white.labelled/i);
  assert.match(text, /generally available/i);
  assert.equal(50000 * 0.18, 9000);
});

test("stable plan identifiers expose Growth and equal generally available feature eligibility", () => {
  assert.deepEqual(
    planHierarchy.map((p) => p.id),
    ["starter", "pro", "enterprise"]
  );
  assert.match(planHierarchy[2].summary, /governance/i);
  assert.equal(planHierarchy[1].name, "Growth");
  assert.match(corePlatform.promise, /No module or feature is gated/);
  const core = planComparisonRows.find((row) => row.label === "Operational scope");
  assert.ok(core);
  assert.equal(core.starter, core.pro);
  assert.equal(core.pro, core.enterprise);
  assert.ok(enterpriseBeyondModules.length >= 5);
  assert.match(corePlatform.differentiation, /same generally available/);
});

test("identity doctrine preserves common security with optional SSO on every plan and included Enterprise activation", () => {
  assert.match(identity.baseline.body, /baseline requirements in every plan/);
  assert.match(identity.baseline.body, /deployment readiness are confirmed before activation/);
  assert.match(identity.sso.body, /optional single sign-on with Microsoft Entra ID/);
  assert.match(identity.enterprise.body, /identity governance is eligible on every plan/);
  assert.equal(identity.modes.length, 3);
  assert.match(identity.principle, /never derived from an email address or domain alone/);
  const sso = identity.byPlan.find((row) => /Entra ID single sign-on/.test(row.capability));
  assert.ok(sso);
  assert.equal(sso.starter, sso.pro);
  assert.match(sso.enterprise, /included in the annual licence/);
  assert.match(sso.pro, /technical onboarding required/);
  // Nothing unimplemented is described as available.
  const text = JSON.stringify(identity);
  assert.doesNotMatch(text, /Google Workspace (SSO|single sign-on)/);
  assert.doesNotMatch(text, /SAML/);
  assert.doesNotMatch(text, /\bSCIM\b/);
});

test("pricing availability is stated once and reused verbatim by every FAQ surface", () => {
  const short = pricingAvailability.short;
  assert.match(short, /Annual INR subscription rates.*public/i);
  const pricingAnswer = pricingFaqs.find((f) => f.question === "Is pricing public?")?.answer ?? "";
  const siteAnswer = faqs.find((f) => f.question === "Is pricing public?")?.answer ?? "";
  assert.ok(pricingAnswer.includes(short), "pricing FAQ must quote pricingAvailability.short");
  assert.ok(siteAnswer.includes(short), "site FAQ must quote pricingAvailability.short");
});

test("published pricing is explicit and unconfigured AIC tariffs are never advertised", () => {
  assert.match(pricingAvailability.short, /Annual INR subscription rates/);
  assert.match(identity.sso.body, /₹2,500/);
  assert.match(
    pricingFaqs.find((faq) => faq.question === "How is AEGIS usage handled?")?.answer ?? "",
    /Purchased-AIC validity and cancellation terms are on your order form/
  );
  const text = JSON.stringify([pricingAvailability, plans, pricingFaqs, faqs]);
  assert.doesNotMatch(
    text,
    /150 (questions|prompts)|unlimited AI|₹0\.25\s*(per |\/)AIC|5.credit WhatsApp/i
  );
});

test("fit guidance names who SquareCampus is not for", () => {
  assert.ok(fit.notRightFitIf.length >= 3);
  assert.match(fit.notRightFitIf.join(" "), /attendance, fee collection and report cards/);
  assert.match(pricingAvailability.positioning, /will look expensive/);
});

test("the canonical short description is one sentence in the agreed semantic territory", () => {
  assert.equal(product.category, "Enterprise School Operating System");
  assert.match(product.shortDescription, /^SquareCampus is an Enterprise School Operating System/);
  for (const term of ["governance", "accountability", "operational visibility", "India"]) {
    assert.ok(product.shortDescription.includes(term), `missing "${term}"`);
  }
});

test("branded definitions and the enterprise-pain answer reuse canonical product facts", () => {
  assert.equal(CANONICAL_DEFINITION, product.shortDescription);
  assert.equal(
    entityFaqs.find((faq) => faq.question === "What is SquareCampus?")?.answer,
    product.shortDescription
  );
  assert.equal(
    entityFaqs.find((faq) => faq.question === "What does minus the enterprise pain mean?")?.answer,
    product.positioningSupport
  );
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

test("future standard features share every plan's licence without feature-based repricing", () => {
  assert.equal(pricingPolicy.version, "2026-11-10.3");
  assert.deepEqual(pricingPolicy.featureAccess.eligiblePlans, ["starter", "pro", "enterprise"]);
  assert.equal(pricingPolicy.featureAccess.futureFeaturesIncluded, true);
  assert.equal(pricingPolicy.featureAccess.featureAdditionSurchargePaise, 0);
  assert.equal(pricingPolicy.featureAccess.featureAdditionsTriggerRepricing, false);
  for (const source of [pricingFaqs, faqs]) {
    assert.equal(
      source.find((faq) => faq.question === "Will new standard features increase my price?")
        ?.answer,
      corePlatform.futureFeatures
    );
  }
  assert.match(corePlatform.futureFeatures, /PTM when released/);
  assert.equal(pricingPolicy.renewal.ratesFixedDuringTerm, true);
  assert.equal(pricingPolicy.renewal.minimumNoticeDays, 30);
  assert.match(commercialScope.renewal, /at least 30 days/);
});


test("finance onboarding has explicit plan entitlements and institution-owned settlement", () => {
  assert.deepEqual(pricingPolicy.includedServices.tallyReadyExportSetupPlans, ["pro", "enterprise"]);
  assert.deepEqual(pricingPolicy.includedServices.institutionOwnedRazorpaySetupPlans, ["starter", "pro", "enterprise"]);
  assert.match(commercialScope.tallyExport, /Standard self-service exports remain available on every plan/);
  assert.match(commercialScope.tallyExport, /sample import/);
  assert.match(commercialScope.paymentGateway, /institution’s own Razorpay account/);
  assert.match(commercialScope.paymentGateway, /Settlement goes to the institution’s bank account/);
  assert.ok(pricingFaqs.some((faq) => faq.answer === commercialScope.tallyExport));
  assert.ok(pricingFaqs.some((faq) => faq.answer === commercialScope.paymentGateway));
});


test("custom AEGIS dashboards are an included Enterprise service", () => {
  assert.deepEqual(pricingPolicy.includedServices.customAegisDashboardPlans, ["enterprise"]);
  assert.match(commercialScope.customAegisDashboards, /included in Enterprise/);
  assert.match(commercialScope.customAegisDashboards, /agreed during onboarding/);
  assert.match(commercialScope.customAegisDashboards, /AIC wallet/);
  const row = planComparisonRows.find((item) => item.label === "Custom AEGIS dashboards");
  assert.ok(row);
  assert.equal(row.enterprise, commercialScope.customAegisDashboards);
  assert.equal(pricingFaqs.find((faq) => faq.question === "Are custom AEGIS dashboards included?")?.answer, row.enterprise);
  assert.doesNotMatch(planHierarchy[2].summary, /optional custom|scoped and quoted/);
});
