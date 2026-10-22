import { runInNewContext } from "node:vm";
import {
  demoIntentForEnquiry,
  demoIntentKeys,
  enquiryTypes,
  legacyIntentRedirectScript,
  resolveDemoIntent,
} from "../src/content/demo-intents";
import { buildEnquiryPayload, enquirySource, foundingPartnerFields } from "../src/lib/demo-enquiry";
import { assert, suite, test } from "./harness";

suite("enquiry journeys");

test("all journeys have distinct trusted enquiry labels and existing intake source tags", () => {
  assert.equal(new Set(demoIntentKeys.map((key) => enquiryTypes[key])).size, 4);
  for (const intent of demoIntentKeys) {
    const label = enquiryTypes[intent];
    assert.equal(demoIntentForEnquiry(label), intent);
    assert.equal(enquirySource(label), intent === "demo" ? "demo-form" : `demo-form:${intent}`);
    assert.ok(label.length <= 60, "existing intake enquiryType limit");
    assert.ok(enquirySource(label).length <= 40, "existing intake source limit");
  }
});

test("unknown, hostile and missing URL values fall back without being echoed", () => {
  for (const value of [
    null,
    "",
    "__proto__",
    "constructor",
    "<script>alert(1)</script>",
    "launch-pilot&approved=true",
  ]) {
    assert.equal(resolveDemoIntent(value), "demo");
    assert.equal(demoIntentForEnquiry(value ?? ""), "demo");
  }
});

test("legacy intent links redirect only to trusted, dedicated form sections", () => {
  for (const value of [...demoIntentKeys, "__proto__", '" onload="alert(1)', ""]) {
    const redirects: string[] = [];
    runInNewContext(legacyIntentRedirectScript, {
      URLSearchParams,
      window: {
        location: {
          search: `?intent=${encodeURIComponent(value)}`,
          replace: (url: string) => redirects.push(url),
        },
      },
    });
    const expected =
      value === "founding-partner"
        ? ["/launch-partners/#request-diagnosis"]
        : value === "launch-pilot"
          ? ["/contact/"]
          : [];
    assert.deepEqual(redirects, expected);
  }
});

test("launch and demo payloads discard stale founding answers and honeypot, retaining normal fields", () => {
  for (const intent of ["launch-pilot", "demo"] as const) {
    const state = {
      enquiryType: enquiryTypes[intent],
      website: "",
      institution: "Regression fixture school",
      message: "Multi-campus workflow evaluation",
      consent: true,
      ...Object.fromEntries(foundingPartnerFields.map(([key]) => [key, "old founding answer"])),
    };
    const payload = buildEnquiryPayload(state);
    assert.equal(payload.enquiryType, enquiryTypes[intent]);
    assert.equal(payload.message, state.message);
    assert.equal(payload.institution, state.institution);
    assert.equal(payload.consent, true);
    assert.ok(!Object.hasOwn(payload, "website"));
    for (const [key] of foundingPartnerFields) assert.ok(!Object.hasOwn(payload, key), key);
    assert.ok(Object.hasOwn(state, "bottleneck"), "do not mutate the visitor's form state");
  }
});

test("founding payload preserves its diagnostic answers", () => {
  const answers = Object.fromEntries(
    foundingPartnerFields.map(([key]) => [key, `answer to ${key}`])
  );
  const payload = buildEnquiryPayload({
    enquiryType: enquiryTypes["founding-partner"],
    website: "",
    ...answers,
  });
  for (const [key] of foundingPartnerFields)
    assert.equal((payload as Record<string, unknown>)[key], answers[key]);
  assert.ok(!Object.hasOwn(payload, "website"));
});
