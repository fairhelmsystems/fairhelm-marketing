import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { blogUrl } from "../src/urls";

const handler = runInNewContext(
  `${readFileSync(new URL("../../../infra/edge/viewer-request.js", import.meta.url), "utf8")}\nhandler;`
);
function request(host: string, uri: string, querystring = {}) {
  return handler({
    request: { method: "GET", uri, headers: { host: { value: host } }, querystring },
  });
}
describe("blog migration at the real edge handler", () => {
  for (const host of [
    "squarecampus.com",
    "www.squarecampus.com",
    "squarecampus.in",
    "fairhelmsystems.com",
    "www.fairhelmsystems.com",
  ]) {
    for (const [from, to] of [
      ["/blog", "/"],
      ["/blog/", "/"],
      ["/blog/school-erp-implementation", "/school-erp-implementation/"],
      ["/blog/feed.xml", "/feed.xml"],
    ]) {
      test(`${host}${from} permanently redirects in one hop`, () => {
        const response = request(host, from);
        expect(response.statusCode).toBe(301);
        expect(response.headers.location.value).toBe(blogUrl(to));
      });
    }
  }
  test("Fairhelm blog aliases consolidate instead of serving duplicate articles", () => {
    expect(
      request("blogs.fairhelmsystems.com", "/school-erp-implementation").headers.location.value
    ).toBe(blogUrl("/school-erp-implementation/"));
  });
  test("query strings, encoded values and repeated parameters survive", () => {
    const response = request("squarecampus.com", "/blog/guide", {
      utm_source: { value: "fairhelm%20systems" },
      tag: { value: "a", multiValue: [{ value: "a" }, { value: "b" }] },
    });
    expect(response.headers.location.value).toBe(
      `${blogUrl("/guide/")}?utm_source=fairhelm%20systems&tag=a&tag=b`
    );
  });
  test("canonical pages rewrite to their own HTML without a redirect loop", () => {
    expect(request("blogs.squarecampus.com", "/guide/").uri).toBe("/guide/index.html");
    expect(request("squarecampus.com", "/").uri).toBe("/index.html");
  });
  test("assets and Next payloads stay untouched", () => {
    for (const uri of ["/feed.xml", "/_next/static/a.js", "/guide/index.txt", "/sitemap.xml"]) {
      expect(request("blogs.squarecampus.com", uri).uri).toBe(uri);
    }
  });
  test("similarly named routes are not mistaken for blogs", () => {
    expect(request("squarecampus.com", "/blogging/").uri).toBe("/blogging/index.html");
  });
});

test("Fairhelm's existing insights, feed and Markdown URLs reach their exact replacements", () => {
  for (const [path, expected] of [
    ["/insights/", "/fairhelm/"],
    ["/insights/the-kpi-contract", "/fairhelm/the-kpi-contract/"],
    ["/insights/the-kpi-contract/index.md", "/fairhelm/the-kpi-contract/index.md"],
    ["/insights/feed.xml", "/feed.xml"],
  ]) {
    const response = request("fairhelmsystems.com", path);
    expect(response.statusCode).toBe(301);
    expect(response.headers.location.value).toBe(blogUrl(expected));
  }
});

test("insight cover assets remain available on both distribution hosts", () => {
  for (const host of ["fairhelmsystems.com", "blogs.squarecampus.com"]) {
    const response = request(host, "/insights/the-kpi-contract.webp");
    expect(response.statusCode).toBeUndefined();
    expect(response.uri).toBe("/insights/the-kpi-contract.webp");
  }
});

test("unusual slash paths cannot turn a canonical redirect into another origin", () => {
  for (const host of ["squarecampus.com", "fairhelmsystems.com", "blogs.squarecampus.com"]) {
    for (const path of [
      "//outside.example/guide",
      "/\\outside.example/guide",
      "///outside.example/guide/",
    ]) {
      const response = request(host, path, { source: { value: "test" } });
      expect(response.statusCode).toBe(301);
      const destination = new URL(response.headers.location.value, `https://${host}`);
      expect(destination.origin).toBe(`https://${host}`);
      expect(destination.pathname).toBe("/outside.example/guide/");
      expect(destination.search).toBe("?source=test");
    }
  }
});

test("path normalization reaches final blog and page destinations in one hop", () => {
  expect(
    request("squarecampus.com", "//blog//school-erp-implementation").headers.location.value
  ).toBe(blogUrl("/school-erp-implementation/"));
  expect(request("fairhelmsystems.com", "/insights//the-kpi-contract").headers.location.value).toBe(
    blogUrl("/fairhelm/the-kpi-contract/")
  );
  expect(request("squarecampus.com", "/pricing//").headers.location.value).toBe("/pricing/");
  expect(request("blogs.squarecampus.com", "//feed.xml").headers.location.value).toBe("/feed.xml");
});

test("company and product policy moves preserve queries and Markdown in one hop", () => {
  for (const [host, path, expected] of [
    [
      "squarecampus.com",
      "/privacy-policy/",
      "https://legal.fairhelmsystems.com/squarecampus/privacy-policy/",
    ],
    [
      "www.squarecampus.in",
      "/data-retention/index.md",
      "https://legal.fairhelmsystems.com/squarecampus/data-retention/index.md",
    ],
    ["fairhelmsystems.com", "/legal/", "https://legal.fairhelmsystems.com/fairhelm/"],
    ["www.fairhelmsystems.in", "/privacy", "https://legal.fairhelmsystems.com/fairhelm/privacy/"],
    ["squarecampus.com", "/press/", "https://press.fairhelmsystems.com/squarecampus/"],
    ["fairhelmsystems.com", "/press/", "https://press.fairhelmsystems.com/"],
  ]) {
    const result = handler({
      request: {
        method: "GET",
        uri: path,
        headers: { host: { value: host } },
        querystring: {
          source: { value: "a%2Fb", multiValue: [{ value: "a%2Fb" }, { value: "second" }] },
        },
      },
    });
    expect(result).toMatchObject({
      statusCode: 301,
      headers: { location: { value: `${expected}?source=a%2Fb&source=second` } },
    });
  }
});
