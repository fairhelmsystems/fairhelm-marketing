/**
 * Pages that ship a Markdown alternate for agents.
 *
 * The Markdown is generated after `next build` by scripts/markdown-alternates.ts
 * from the rendered HTML of each page — the same source the browser gets, with
 * navigation, footer and decorative UI removed — so there is no second
 * hand-written copy to maintain. Each page here advertises its alternate with
 * `<link rel="alternate" type="text/markdown">` (see lib/seo.ts), and
 * /llms.txt links to the Markdown URL.
 *
 * URL convention (llms.txt): directory-style pages get `<path>/index.md`.
 * The home page is `/index.md`.
 *
 * Keep this list to the pages a buyer or an agent evaluates from — the
 * generator and the build check both walk it, so every entry must be a real,
 * indexable route.
 */
export const markdownAlternatePaths = [
  "/",
  "/what-is-squarecampus",
  "/pricing",
  "/enterprise",
  "/platform",
  "/security",
  "/aegis",
  "/launch-partners",
  "/launch-partners/higher-education",
  "/school-management-system",
  "/school-erp-software",
  "/multi-campus-school-management-software",
  "/compare",
  "/why-squarecampus",
  "/faq",
  "/rollout",
] as const;

export type MarkdownAlternatePath = (typeof markdownAlternatePaths)[number];

/** Normalise a route to the slash-less form the list uses. */
function normalise(path: string) {
  if (path === "/" || path === "") return "/";
  return path.endsWith("/") ? path.slice(0, -1) : path;
}

export function hasMarkdownAlternate(path: string): boolean {
  return (markdownAlternatePaths as readonly string[]).includes(normalise(path));
}

/** Site-relative Markdown URL for a route: `/pricing` → `/pricing/index.md`. */
export function markdownAlternatePath(path: string): string {
  const p = normalise(path);
  return p === "/" ? "/index.md" : `${p}/index.md`;
}
