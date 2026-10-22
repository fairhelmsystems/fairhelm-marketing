import { siteConfig } from "../src/lib/site-config";
import {
  organizationSchema,
  SCHEMA_IDS,
  serviceSchema,
  siteGraph,
  squareCampusSchema,
  websiteSchema,
} from "../src/lib/structured-data";
import { assert, suite, test } from "./harness";

suite("JSON-LD entity graph (lib/structured-data.ts)");

const json = JSON.stringify(siteGraph);

test("serialises to valid JSON with stable root ids", () => {
  assert.doesNotThrow(() => JSON.parse(json));
  assert.equal(SCHEMA_IDS.org, "https://fairhelmsystems.com/#org");
  assert.equal(SCHEMA_IDS.website, "https://fairhelmsystems.com/#website");
  assert.equal(SCHEMA_IDS.product, "https://squarecampus.com/#software");
});

test("exactly one Organization node, and it carries the statutory facts", () => {
  const orgs = siteGraph["@graph"].filter((n) => n["@type"] === "Organization");
  assert.equal(orgs.length, 1);
  assert.equal(organizationSchema.legalName, siteConfig.legalName);
  assert.deepEqual(
    organizationSchema.identifier.map((id) => [id.propertyID, id.value]),
    [
      ["CIN", siteConfig.cin],
      ["GSTIN", siteConfig.gstin],
    ]
  );
  assert.equal(organizationSchema.taxID, siteConfig.gstin);
  assert.equal(organizationSchema.foundingDate, siteConfig.incorporationDate);
  assert.equal(organizationSchema.address.postalCode, siteConfig.address.postalCode);
});

test("Organization omits empty telephone and unverified sameAs", () => {
  assert.ok(!("telephone" in organizationSchema) || organizationSchema.telephone);
  assert.ok(!("sameAs" in organizationSchema));
});

test("WebSite is published by the Organization", () => {
  assert.deepEqual(websiteSchema.publisher, { "@id": SCHEMA_IDS.org });
});

test("SquareCampus is one canonical entity, created/published/provided by Fairhelm", () => {
  assert.equal(squareCampusSchema["@id"], SCHEMA_IDS.product);
  assert.equal(squareCampusSchema.url, "https://squarecampus.com/");
  assert.equal(squareCampusSchema.mainEntityOfPage, "https://squarecampus.com/");
  assert.equal(squareCampusSchema.applicationSubCategory, "School Operating System");
  for (const rel of ["creator", "publisher", "provider"] as const) {
    assert.deepEqual(squareCampusSchema[rel], { "@id": SCHEMA_IDS.org });
  }
  assert.equal(organizationSchema.brand.name, "SquareCampus");
  assert.equal(organizationSchema.brand.url, "https://squarecampus.com/");
});

test("no ratings, reviews, offers, prices, employee counts or DPIIT", () => {
  assert.doesNotMatch(
    json,
    /AggregateRating|"Review"|"Rating"|"Offer"|"price"|numberOfEmployees|DPIIT/
  );
  assert.doesNotMatch(json, /featureList/);
});

test("Service nodes attach to the Organization and stay on canonical URLs", () => {
  const s = serviceSchema({
    name: "x",
    description: "y",
    path: "/services/dashboards/",
    serviceType: "z",
  });
  assert.deepEqual(s.provider, { "@id": SCHEMA_IDS.org });
  assert.equal(s.url, "https://fairhelmsystems.com/services/dashboards/");
});
