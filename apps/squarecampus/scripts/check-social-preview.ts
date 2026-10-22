#!/usr/bin/env bun
/**
 * Test the actual static production export over HTTP, without hydration.
 * Also usable after deployment (no local build needed):
 * SOCIAL_PREVIEW_ORIGIN=https://squarecampus.com bun scripts/check-social-preview.ts
 */
import { once } from "node:events";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { assert, runAll, suite, test } from "../tests/harness";

const SITE = "https://squarecampus.com";
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../out");
const ALT =
  "SquareCampus School Operating System — Run every campus. Govern them as one. Connected campuses by Fairhelm Systems.";
const OG = `${SITE}/social/squarecampus-og-v1.jpg`;
const X = `${SITE}/social/squarecampus-x-v1.jpg`;
const userAgents = ["Mozilla/5.0", "Twitterbot/1.0"];

// No SPA/HTML fallback: a missing asset must fail, even if the host would
// otherwise respond with an HTML page and status 200.
const remote = process.env.SOCIAL_PREVIEW_ORIGIN;
const mime: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".txt": "text/plain; charset=utf-8",
};
const server = remote
  ? undefined
  : createServer(async (request, response) => {
      try {
        const path = decodeURIComponent(new URL(request.url || "/", "http://localhost").pathname);
        const filePath = resolve(OUT, `.${path}`, path.endsWith("/") ? "index.html" : "");
        if (!filePath.startsWith(`${OUT}/`)) throw new Error("Outside export");
        const bytes = await readFile(filePath);
        response.writeHead(200, {
          "Content-Type": mime[extname(filePath)] || "application/octet-stream",
        });
        response.end(bytes);
      } catch {
        response.writeHead(404);
        response.end();
      }
    }).listen(0, "127.0.0.1");
if (server) await once(server, "listening");
const address = server?.address();
const origin =
  remote ||
  (address && typeof address !== "string" ? `http://127.0.0.1:${address.port}` : undefined);
if (!origin) throw new Error("No test origin available.");
console.log(
  `social-preview: testing ${remote ? "remote deployment" : "production export"} at ${origin}`
);

function decode(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function attributes(tag: string) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], decode(m[2])])
  );
}

function metadata(html: string) {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
  assert.ok(head, "Raw response must have a server-rendered head");
  // Restrict to real tags, excluding serialized RSC data and scripts.
  const tags = [...head.matchAll(/<meta\b[^>]*>/g)].map((m) => attributes(m[0]));
  return {
    head,
    one(name: string) {
      const matches = tags.filter((tag) => tag.name === name || tag.property === name);
      assert.equal(matches.length, 1, `Expected exactly one ${name} tag`);
      return matches[0].content;
    },
  };
}

async function get(path: string, userAgent: string) {
  const response = await fetch(new URL(path, origin), {
    headers: { "User-Agent": userAgent },
    redirect: "manual",
    signal: AbortSignal.timeout(30_000),
  });
  assert.equal(response.status, 200, `${path} (${userAgent}): HTTP ${response.status}`);
  return response;
}

const routes = [
  { path: "/", og: OG, x: X },
  { path: "/enterprise/", og: OG, x: X },
  { path: "/pricing/", og: `${SITE}/og/pricing.png`, x: `${SITE}/og/pricing.png` },
  { path: "/services/", og: `${SITE}/og/services-card.png`, x: `${SITE}/og/services-card.png` },
  {
    path: "/multi-campus-school-management-software/",
    og: `${SITE}/og/multi-campus-school-management-software.png`,
    x: `${SITE}/og/multi-campus-school-management-software.png`,
  },
];

suite("social previews — production HTML and HTTP responses");
for (const userAgent of userAgents) {
  for (const route of routes) {
    test(`${route.path} (${userAgent}): one card, canonical and intentional images`, async () => {
      const response = await get(route.path, userAgent);
      assert.match(response.headers.get("content-type") || "", /^text\/html\b/);
      const html = await response.text();
      const meta = metadata(html);
      assert.equal(meta.one("twitter:card"), "summary_large_image");
      assert.equal(meta.one("og:image"), route.og);
      assert.equal(meta.one("twitter:image"), route.x);
      assert.ok(meta.one("og:image:alt").length > 20, "Meaningful OG alt text");
      const canonicals = [...meta.head.matchAll(/<link\b[^>]*>/g)]
        .map((m) => attributes(m[0]))
        .filter((tag) => tag.rel === "canonical");
      assert.deepEqual(
        canonicals.map((tag) => tag.href),
        [`${SITE}${route.path}`]
      );
      for (const key of ["og:title", "og:description", "twitter:title", "twitter:description"]) {
        assert.ok(meta.one(key).length > 10, `${key} must be populated`);
      }
      const schemas = [
        ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
      ];
      assert.ok(schemas.length, "Structured data remains in raw HTML");
      for (const [, schema] of schemas) JSON.parse(schema);
      assert.ok(html.includes(`${SITE}/#org`), "Root organisation identity preserved");
      if (
        route.path === "/" ||
        route.path === "/enterprise/"
      ) {
        assert.equal(meta.one("og:image:width"), "1200");
        assert.equal(meta.one("og:image:height"), "630");
        assert.equal(meta.one("og:image:type"), "image/jpeg");
        assert.equal(meta.one("og:image:alt"), ALT);
        assert.equal(meta.one("twitter:image:alt"), ALT);
        assert.equal(meta.one("twitter:site"), "@squarecampushq");
        assert.equal(meta.one("og:type"), "website");
        assert.equal(meta.one("og:site_name"), "SquareCampus");
        assert.equal(meta.one("og:url"), `${SITE}${route.path}`);
      }
      if (route.path === "/") {
        assert.ok(
          meta.head.includes(
            "<title>SquareCampus | School Management Software for Indian Schools and Trusts</title>"
          )
        );
        assert.equal(
          meta.one("description"),
          "School management software built as a connected School OS: admissions, attendance, fees, exams and parent communication on one record for Indian schools."
        );
        assert.equal(
          meta.one("og:title"),
          "SquareCampus | School Operating System for Indian Schools and Trusts"
        );
        assert.equal(
          meta.one("og:description"),
          "Know what requires attention today. SquareCampus connects school operations, assigns ownership to exceptions, and gives leadership a governed view of the institution."
        );
        assert.equal(
          meta.one("twitter:title"),
          "SquareCampus | School Operating System for Indian Schools and Trusts"
        );
        assert.equal(
          meta.one("twitter:description"),
          "A system of record stores what happened. A decision layer shows what requires attention, who owns it, and what happens next."
        );
        assert.ok(!meta.head.includes("/og/home.png"), "No stale homepage override");
      }
      if (route.path.startsWith("/blog/")) assert.equal(meta.one("og:type"), "article");
    });
  }

  const imageUrls = new Set(routes.flatMap((route) => [route.og, route.x]));
  for (const url of imageUrls) {
    test(`${new URL(url).pathname} (${userAgent}): public, correctly typed, decodable image`, async () => {
      assert.equal(new URL(url).origin, SITE, "Absolute production HTTPS image URL");
      // Map the emitted production path to the tested origin. Never fetch the
      // old live image while claiming to validate a local export.
      const path = new URL(url).pathname;
      const response = await get(path, userAgent);
      const bytes = Buffer.from(await response.arrayBuffer());
      const image = sharp(bytes);
      const info = await image.metadata();
      const contentType = `image/${info.format === "jpeg" ? "jpeg" : info.format}`;
      assert.equal(response.headers.get("content-type")?.split(";")[0], contentType);
      await image.raw().toBuffer(); // Decode the full image, not just its header.
      if (!remote) assert.deepEqual(bytes, readFileSync(resolve(OUT, `.${path}`)));
      if (url === OG || url === X) {
        assert.equal(info.format, "jpeg");
        assert.equal(info.width, 1200);
        assert.equal(info.height, url === OG ? 630 : 600);
        assert.equal(info.space, "srgb");
        assert.equal(info.channels, 3);
        assert.equal(info.hasAlpha, false);
        assert.ok(bytes.length < 1_000_000, "Optimised below 1 MB (and the 5 MB limit)");
        if (!remote) assert.deepEqual(bytes, readFileSync(resolve(OUT, "../public", `.${path}`)));
      }
    });
  }

  test(`robots.txt (${userAgent}): public pages and social assets allowed`, async () => {
    const robots = await (await get("/robots.txt", userAgent)).text();
    assert.ok(robots.includes("User-Agent: *\nAllow: /\nDisallow: /api/"));
    assert.ok(robots.includes(`Sitemap: ${SITE}/sitemap.xml`));
    assert.ok(!/Disallow:\s*\/(?:social\b|$)/m.test(robots));
  });
}

try {
  const failed = await runAll();
  if (failed) process.exitCode = 1;
} finally {
  server?.closeAllConnections();
  if (server) await new Promise<void>((done) => server.close(() => done()));
}
