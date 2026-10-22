import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

export type Reference = { kind: "link" | "asset"; value: string };
export type ParsedExport = { ids: Set<string>; duplicateIds: string[]; references: Reference[] };

type QueryValue = { value: string; multiValue?: Array<{ value: string }> };
type EdgeRequest = {
  method: string;
  uri: string;
  headers: { host: { value: string } };
  querystring: Record<string, QueryValue>;
};
type EdgeResponse = { statusCode: number; headers: { location: { value: string } } };
export type EdgeHandler = (event: { request: EdgeRequest }) => EdgeRequest | EdgeResponse;

/** Parse the exported HTML without running client code or opening a browser. */
export function parseExportHtml(html: string): ParsedExport {
  const ids = new Set<string>();
  const duplicateIds: string[] = [];
  const references: Reference[] = [];
  new HTMLRewriter()
    .on("*", {
      element(element) {
        const attr = (name: string) => {
          const value = element.getAttribute(name);
          return value === null ? null : decodeAttribute(value);
        };
        const id = attr("id");
        if (id) {
          if (ids.has(id)) duplicateIds.push(id);
          ids.add(id);
        }
        const add = (kind: Reference["kind"], value: string | null) => {
          if (value) references.push({ kind, value });
        };
        if (element.tagName === "a") add("link", attr("href"));
        if (["img", "script", "source", "video", "audio"].includes(element.tagName))
          add("asset", attr("src"));
        if (element.tagName === "video") add("asset", attr("poster"));
        if (
          element.tagName === "link" &&
          ["stylesheet", "preload", "icon", "apple-touch-icon", "manifest"].includes(
            attr("rel") || ""
          )
        )
          add("asset", attr("href"));
      },
    })
    .transform(html);
  return { ids, duplicateIds, references };
}

/** React's HTML attribute escapes must be decoded before resolving URL queries/fragments. */
export function decodeAttribute(value: string): string {
  const named: Record<string, string> = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">" };
  return value.replace(/&(amp|quot|apos|lt|gt|#(?:x[\da-f]+|\d+));/gi, (entity, code: string) => {
    if (!code.startsWith("#")) return named[code.toLowerCase()] || entity;
    const point =
      code[1].toLowerCase() === "x"
        ? Number.parseInt(code.slice(2), 16)
        : Number.parseInt(code.slice(1), 10);
    return point > 0 && point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff)
      ? String.fromCodePoint(point)
      : "\uFFFD";
  });
}

export function loadEdgeHandler(): EdgeHandler {
  const source = readFileSync(
    new URL("../../infra/edge/viewer-request.js", import.meta.url),
    "utf8"
  );
  return runInNewContext(`${source}\nhandler;`) as EdgeHandler;
}

export function resolveThroughEdge(
  initial: URL,
  handler: EdgeHandler
): { url: URL; uri: string; hops: number } {
  let current = new URL(initial);
  const seen = new Set<string>();
  for (let hops = 0; hops <= 8; hops++) {
    if (seen.has(current.href)) throw new Error(`Redirect loop at ${current.href}`);
    seen.add(current.href);
    const querystring: Record<string, QueryValue> = {};
    for (const [key, value] of current.searchParams) {
      const k = encodeURIComponent(key),
        v = { value: encodeURIComponent(value) };
      if (!querystring[k]) querystring[k] = v;
      else (querystring[k].multiValue ||= [{ value: querystring[k].value }]).push(v);
    }
    const result = handler({
      request: {
        method: "GET",
        uri: current.pathname,
        headers: { host: { value: current.hostname } },
        querystring,
      },
    });
    if (!("statusCode" in result)) return { url: current, uri: result.uri, hops };
    if (result.statusCode < 300 || result.statusCode > 399)
      throw new Error(`Unexpected edge response ${result.statusCode}`);
    const location = result.headers.location.value;
    const next = new URL(location, current);
    if (!location.includes("#")) next.hash = current.hash;
    current = next;
  }
  throw new Error(`Too many redirects from ${initial.href}`);
}
