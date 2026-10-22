import { expect, test } from "bun:test";
import {
  loadEdgeHandler,
  parseExportHtml,
  resolveThroughEdge,
} from "../../../scripts/lib/export-graph";

test("offline HTML audit distinguishes real links from script data and comments", () => {
  const page = parseExportHtml(`
    <main id="main-content"><h1 id="a&b">Title</h1><div id="same"></div><span id="same"></span>
    <a href="/guide/?tag=a&amp;tag=b#a&amp;b">Read</a>
    <video poster="/poster.webp"><source src="/clip.mp4"></video>
    <link rel="stylesheet" href="/styles.css"><script src="/app.js"></script>
    <script>const example = '<a href="/not-a-link/">';</script>
    <!-- <a href="/also-not-a-link/"> -->
    </main>`);
  expect(page.ids.has("a&b")).toBe(true);
  expect(page.duplicateIds).toEqual(["same"]);
  expect(page.references).toEqual([
    { kind: "link", value: "/guide/?tag=a&tag=b#a&b" },
    { kind: "asset", value: "/poster.webp" },
    { kind: "asset", value: "/clip.mp4" },
    { kind: "asset", value: "/styles.css" },
    { kind: "asset", value: "/app.js" },
  ]);
});

test("actual migration destinations retain fragments and repeated query parameters", () => {
  const resolved = resolveThroughEdge(
    new URL("https://fairhelmsystems.com/insights/the-kpi-contract?tag=a&tag=b#main-content"),
    loadEdgeHandler()
  );
  expect(resolved.url.href).toBe(
    "https://blogs.squarecampus.com/fairhelm/the-kpi-contract/?tag=a&tag=b#main-content"
  );
  expect(resolved.uri).toBe("/fairhelm/the-kpi-contract/index.html");
  expect(resolved.hops).toBe(1);
});

test("the offline audit fails instead of accepting redirect loops", () => {
  expect(() =>
    resolveThroughEdge(new URL("https://squarecampus.com/loop/"), () => ({
      statusCode: 301,
      headers: { location: { value: "/loop/" } },
    }))
  ).toThrow("Redirect loop");
});
