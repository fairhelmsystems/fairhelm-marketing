import { expect, test } from "bun:test";
import { type AuditReport, summarize } from "./lighthouse-summary";

function report(score: number, lcp: number): AuditReport {
  return {
    requestedUrl: "http://localhost:3100/",
    finalDisplayedUrl: "http://localhost:3100/",
    lighthouseVersion: "fixture",
    fetchTime: "2026-10-22T00:00:00Z",
    categories: {
      performance: { score },
      accessibility: { score: 1 },
      "best-practices": { score: 0.95 },
      seo: { score: 1 },
    },
    audits: {
      "largest-contentful-paint": { numericValue: lcp },
      "total-blocking-time": { numericValue: 100 },
      "cumulative-layout-shift": { numericValue: 0.01 },
    },
  };
}

test("median resists an outlier while retaining honest metric units", () => {
  const result = summarize([report(0.91, 2300), report(0.3, 9000), report(0.93, 2200)]);
  expect(result.runs).toBe(3);
  expect(result.medianScores.performance).toBe(91);
  expect(result.medianMetrics["largest-contentful-paint"]).toBe(2300);
});

test("missing and unscored audits cannot appear to pass", () => {
  const broken = report(0.9, 2000);
  broken.categories.seo.score = null;
  expect(() => summarize([broken])).toThrow("Missing or invalid category");
  expect(() => summarize([])).toThrow("No Lighthouse reports");
  broken.categories.seo.score = 1;
  delete broken.audits["cumulative-layout-shift"];
  expect(() => summarize([broken])).toThrow("Missing or invalid metric");
});

test("browser runtime errors and unexpected redirects invalidate measurements", () => {
  const broken = report(0.9, 2000);
  broken.runtimeError = { message: "Page did not load" };
  expect(() => summarize([broken])).toThrow("Page did not load");
  delete broken.runtimeError;
  broken.finalDisplayedUrl = "https://squarecampus.com/";
  expect(() => summarize([broken])).toThrow("Unexpected navigation");
});
