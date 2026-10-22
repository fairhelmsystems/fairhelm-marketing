import { BLOGS_ORIGIN } from "@fairhelm/config/urls";
export const SEO_CONFIG = { baseUrl: BLOGS_ORIGIN, language: "en-IN" } as const;
export function canonicalUrl(path: string): string {
  return `${BLOGS_ORIGIN}${path.includes(".") || path.endsWith("/") ? path : `${path}/`}`;
}
export function createBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
