/** Offline graph audit: local files + the production edge function; no browser or network. */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, resolve, sep } from "node:path";
import {
  loadEdgeHandler,
  parseExportHtml,
  resolveThroughEdge,
  type ParsedExport,
  type Reference,
} from "./lib/export-graph";

const root = resolve(import.meta.dirname, "..");
const hosts = new Map([
  ["squarecampus.com", "squarecampus"],
  ["fairhelmsystems.com", "fairhelm"],
  ["blogs.squarecampus.com", "blogs"],
  ["legal.fairhelmsystems.com", "legal"],
  ["press.fairhelmsystems.com", "press"],
]);
const knownHosts = new Set([
  ...hosts.keys(),
  "www.squarecampus.com",
  "squarecampus.in",
  "www.squarecampus.in",
  "www.fairhelmsystems.com",
  "fairhelmsystems.in",
  "www.fairhelmsystems.in",
  "blogs.fairhelmsystems.com",
  "blog.fairhelmsystems.com",
]);
const handler = loadEdgeHandler();
const pages = new Map<string, ParsedExport>();
const failures = new Set<string>();
const cssVisited = new Set<string>();
let references = 0;
let redirects = 0;

function listHtml(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? listHtml(resolve(dir, entry.name))
      : entry.name.endsWith(".html")
        ? [resolve(dir, entry.name)]
        : []
  );
}
for (const [host, app] of hosts) {
  const out = resolve(root, "apps", app, "out");
  for (const file of listHtml(out)) {
    const path = file.slice(out.length).split(sep).join("/");
    if (path === "/404.html" || path.startsWith("/_not-found")) continue;
    const url = `https://${host}${path.endsWith("/index.html") ? path.slice(0, -10) : path}`;
    const parsed = parseExportHtml(readFileSync(file, "utf8"));
    pages.set(url, parsed);
    for (const id of parsed.duplicateIds) failures.add(`${url}: duplicate id ${id}`);
  }
}

function auditReference(source: string, reference: Reference) {
  if (!reference.value.trim() || /^(?:mailto:|tel:|data:|javascript:)/i.test(reference.value))
    return;
  try {
    const initial = new URL(reference.value, source);
    if (!knownHosts.has(initial.hostname)) return;
    references++;
    const target = resolveThroughEdge(initial, handler);
    redirects += target.hops;
    const app = hosts.get(target.url.hostname);
    if (!app) throw new Error(`redirect left the owned hosts: ${target.url.href}`);
    const out = resolve(root, "apps", app, "out");
    const file = resolve(out, `.${decodeURIComponent(target.uri)}`);
    if (!file.startsWith(out + sep) || !existsSync(file) || !statSync(file).isFile())
      throw new Error(`missing target ${target.url.href} (${target.uri})`);
    if (reference.kind === "link" && target.url.hash) {
      const key = new URL(target.url);
      key.hash = "";
      key.search = "";
      const page = pages.get(key.href);
      if (page && !page.ids.has(decodeURIComponent(target.url.hash.slice(1))))
        throw new Error(`missing fragment ${target.url.href}`);
    }
    if (extname(file) === ".css" && !cssVisited.has(file)) {
      cssVisited.add(file);
      const css = readFileSync(file, "utf8");
      for (const match of css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/g)) {
        const value = (match[1] ?? match[2] ?? match[3]).trim();
        auditReference(target.url.href, { kind: "asset", value });
      }
    }
  } catch (error) {
    failures.add(`${source} -> ${reference.value}: ${String(error)}`);
  }
}
for (const [url, page] of pages)
  for (const reference of page.references) auditReference(url, reference);
console.log(
  `Export graph: ${pages.size} pages, ${references} owned links/assets, ${cssVisited.size} stylesheets, ${failures.size} failures (${redirects} valid normalization/migration hops).`
);
if (failures.size) {
  console.error([...failures].join("\n"));
  process.exit(1);
}
