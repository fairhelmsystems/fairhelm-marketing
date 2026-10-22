import { canonicalUrl, createBreadcrumbSchema, createWebPageSchema, SEO_CONFIG } from "@/lib/seo";

/**
 * WebPage + BreadcrumbList for a non-home page.
 *
 * The site used to emit these on some comparable pages and not on others,
 * which is a worse signal than emitting neither: it tells a crawler the
 * hierarchy is inconsistent. This is the one implementation path, so every
 * page that carries page-level structured data carries the same shape, with
 * URLs already in their canonical trailing-slash form.
 *
 * Deliberately nothing else. No Product, Offer, Review, AggregateRating or
 * VideoObject: the site publishes no prices, no customer proof, and its motion
 * assets are supplementary diagrams rather than video watch pages.
 */
export function PageSchema({
  name,
  description,
  path,
  /** Intermediate crumbs between Home and this page, if the page has a parent. */
  parents = [],
  label,
}: {
  name: string;
  description: string;
  path: string;
  parents?: Array<{ name: string; path: string }>;
  /** Breadcrumb label for this page. Defaults to `name`. */
  label?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      createWebPageSchema({ name, description, url: canonicalUrl(path) }),
      createBreadcrumbSchema([
        { name: "Home", url: SEO_CONFIG.baseUrl },
        ...parents.map((p) => ({ name: p.name, url: canonicalUrl(p.path) })),
        { name: label ?? name, url: canonicalUrl(path) },
      ]),
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Plain script tag: server-rendered so non-JS crawlers see the schema.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
