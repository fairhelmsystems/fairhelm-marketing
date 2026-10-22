export const SQUARECAMPUS_ORIGIN = "https://squarecampus.com";
export const FAIRHELM_ORIGIN = "https://fairhelmsystems.com";
export const BLOGS_ORIGIN = "https://blogs.squarecampus.com";

/** Canonicals always use the public host; navigation can target local previews. */
export function blogUrl(path = "/"): string {
  const clean = path.replace(/^\/blog(?=\/|$)/, "") || "/";
  const normalized = clean.includes(".") || clean.endsWith("/") ? clean : `${clean}/`;
  return `${BLOGS_ORIGIN}${normalized}`;
}

export function blogHref(path = "/"): string {
  const origin =
    process.env.NEXT_PUBLIC_BLOG_URL?.replace(/\/$/, "") ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3001" : BLOGS_ORIGIN);
  return blogUrl(path).replace(BLOGS_ORIGIN, origin);
}

export function squarecampusHref(path = "/"): string {
  const origin =
    process.env.NEXT_PUBLIC_SQUARECAMPUS_URL?.replace(/\/$/, "") ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3000" : SQUARECAMPUS_ORIGIN);
  return `${origin}${path}`;
}

export function fairhelmHref(path = "/"): string {
  const origin =
    process.env.NEXT_PUBLIC_FAIRHELM_URL?.replace(/\/$/, "") ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3002" : FAIRHELM_ORIGIN);
  return `${origin}${path}`;
}

export const LEGAL_ORIGIN = "https://legal.fairhelmsystems.com";
export const PRESS_ORIGIN = "https://press.fairhelmsystems.com";
export const squarecampusLegalPaths = [
  "privacy-policy",
  "terms-of-service",
  "data-processing-addendum",
  "data-retention",
  "acceptable-use",
  "ai-policy",
  "refund-policy",
  "competitor-notice",
] as const;
export const fairhelmLegalPaths = [
  "legal",
  "privacy",
  "terms",
  "acceptable-use",
  "ai-policy",
  "data-processing",
  "refund-policy",
] as const;
export function legalUrl(scope: "squarecampus" | "fairhelm", path = "/") {
  const value = new URL(path, "https://document.invalid");
  const clean =
    scope === "fairhelm" && /^\/legal\/?$/.test(value.pathname)
      ? ""
      : value.pathname.replace(/^\//, "");
  const normalized = clean && !/\.[^/]+$/.test(clean) && !clean.endsWith("/") ? `${clean}/` : clean;
  return `${LEGAL_ORIGIN}/${scope}/${normalized}${value.search}${value.hash}`;
}
export function legalHref(scope: "squarecampus" | "fairhelm", path = "/") {
  const origin =
    process.env.NEXT_PUBLIC_LEGAL_URL?.replace(/\/$/, "") ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3003" : LEGAL_ORIGIN);
  return legalUrl(scope, path).replace(LEGAL_ORIGIN, origin);
}
export function pressHref(path = "/") {
  const origin =
    process.env.NEXT_PUBLIC_PRESS_URL?.replace(/\/$/, "") ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3004" : PRESS_ORIGIN);
  return `${origin}${path}`;
}

export function siteHref(scope: "squarecampus" | "fairhelm", path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const [pathname] = path.split(/[?#]/);
  const parts = pathname.split("/").filter(Boolean);
  const paths: readonly string[] =
    scope === "squarecampus" ? squarecampusLegalPaths : fairhelmLegalPaths;
  if (
    paths.includes(parts[0]) &&
    (parts.length === 1 || (parts.length === 2 && parts[1] === "index.md"))
  )
    return legalHref(scope, path);
  if (pathname === "/press" || pathname === "/press/")
    return pressHref(scope === "squarecampus" ? "/squarecampus/" : "/");
  return path;
}
