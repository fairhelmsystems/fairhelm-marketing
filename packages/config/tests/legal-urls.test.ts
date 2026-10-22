import { expect, test } from "bun:test";
import { legalUrl, siteHref } from "../src/urls";

test("legal canonicals keep fragment and query outside the normalized path", () => {
  expect(legalUrl("squarecampus", "/terms-of-service?source=demo#competitor-access")).toBe(
    "https://legal.fairhelmsystems.com/squarecampus/terms-of-service/?source=demo#competitor-access"
  );
  expect(legalUrl("fairhelm", "/legal/")).toBe("https://legal.fairhelmsystems.com/fairhelm/");
  expect(legalUrl("squarecampus", "/data-retention/index.md")).toBe(
    "https://legal.fairhelmsystems.com/squarecampus/data-retention/index.md"
  );
});
test("document migration does not claim image assets or unrelated routes", () => {
  expect(siteHref("fairhelm", "/insights/the-kpi-contract.webp")).toBe(
    "/insights/the-kpi-contract.webp"
  );
  expect(siteHref("squarecampus", "/privacy-policy/cover.webp")).toBe("/privacy-policy/cover.webp");
  expect(siteHref("squarecampus", "/security/")).toBe("/security/");
});
