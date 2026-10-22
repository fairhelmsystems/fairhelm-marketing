import type { Insight } from "@/content/insights";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

/**
 * Stable entity ids. `#org` and `#website` live on this origin; the product
 * entity is the one squarecampus.com publishes, so both sites describe a
 * single SquareCampus node rather than two partial copies.
 *
 * Known normalisation item, deliberately deferred: squarecampus.com names its
 * own Organization node `https://squarecampus.com/#org` for the same legal
 * entity as `#org` here. No cross-site `sameAs` is emitted yet; a later
 * decision will settle whether this URI becomes the canonical legal-entity id
 * across both sites.
 */
export const SCHEMA_IDS = {
  org: `${siteConfig.url}/#org`,
  website: `${siteConfig.url}/#website`,
  product: siteConfig.product.schemaId,
} as const;

/**
 * The company. Facts only: legal name, CIN, GSTIN, registered office, contact and
 * what it knows about. No ratings, reviews, offers, employee counts or
 * unverified profiles — `sameAs` is emitted only when a verified profile
 * exists in site-config.
 */
export const organizationSchema = {
  "@type": "Organization",
  "@id": SCHEMA_IDS.org,
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  alternateName: [siteConfig.shortName, siteConfig.legalNameDisplay],
  url: `${siteConfig.url}/`,
  logo: absoluteUrl("/brand/fairhelm-logo.svg"),
  image: absoluteUrl("/brand/fairhelm-og.png"),
  description: siteConfig.descriptionLong,
  slogan: siteConfig.tagline,
  email: siteConfig.contactEmail,
  foundingDate: siteConfig.incorporationDate,
  foundingLocation: {
    "@type": "Place",
    name: `${siteConfig.address.locality}, ${siteConfig.address.region}, India`,
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: siteConfig.contactEmail,
    url: absoluteUrl("/contact/"),
    areaServed: "IN",
    availableLanguage: ["en"],
  },
  // Telephone is omitted entirely until a statutory line is provisioned —
  // an empty string would publish a claim we cannot honour.
  ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
  ...(siteConfig.sameAs.length > 0 ? { sameAs: [...siteConfig.sameAs] } : {}),
  taxID: siteConfig.gstin,
  identifier: [
    {
      "@type": "PropertyValue",
      propertyID: "CIN",
      name: "Corporate Identity Number",
      value: siteConfig.cin,
    },
    {
      "@type": "PropertyValue",
      propertyID: "GSTIN",
      name: "Goods and Services Tax Identification Number",
      value: siteConfig.gstin,
    },
  ],
  address: {
    "@type": "PostalAddress",
    name: "Registered office",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.locality,
    addressRegion: siteConfig.address.region,
    postalCode: siteConfig.address.postalCode,
    addressCountry: siteConfig.address.country,
  },
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  // The product brand the company owns and operates.
  brand: {
    "@type": "Brand",
    name: siteConfig.product.name,
    url: siteConfig.product.url,
  },
  knowsAbout: [
    "School operating systems",
    "Software product engineering",
    "Data engineering",
    "ETL and ELT pipelines",
    "Operational dashboards",
    "Governed analytics and decision systems",
    "Data governance",
    "Role-based access control and auditability",
  ],
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": SCHEMA_IDS.website,
  url: `${siteConfig.url}/`,
  name: siteConfig.name,
  description: siteConfig.description,
  publisher: { "@id": SCHEMA_IDS.org },
  inLanguage: "en-IN",
};

/**
 * SquareCampus, referenced as the entity squarecampus.com publishes. This
 * node states the relationship — Fairhelm is its creator, publisher and
 * operating provider — and points at the canonical product site. Feature
 * lists, plans and pricing are deliberately absent: squarecampus.com is the
 * source for those.
 */
export const squareCampusSchema = {
  "@type": "SoftwareApplication",
  "@id": SCHEMA_IDS.product,
  name: siteConfig.product.name,
  applicationCategory: "BusinessApplication",
  applicationSubCategory: siteConfig.product.category,
  operatingSystem: "Web",
  url: siteConfig.product.url,
  description: siteConfig.product.description,
  creator: { "@id": SCHEMA_IDS.org },
  publisher: { "@id": SCHEMA_IDS.org },
  provider: { "@id": SCHEMA_IDS.org },
  mainEntityOfPage: siteConfig.product.url,
  // No `areaServed` here: schema.org defines it for Organization, Service and
  // Offer, not for a CreativeWork such as SoftwareApplication
  // (validator.schema.org flags it as an unknown field). Geography is stated
  // on the Organization.
  inLanguage: "en-IN",
};

/** The site-wide entity graph rendered once, in the root layout. */
export const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [organizationSchema, websiteSchema, squareCampusSchema],
};

export function serviceSchema({
  name,
  description,
  path,
  serviceType,
}: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(path)}#service`,
    name,
    description,
    serviceType,
    url: absoluteUrl(path),
    provider: { "@id": SCHEMA_IDS.org },
    areaServed: { "@type": "Country", name: "India" },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * FAQPage for a page's visible question-and-answer section. The answers must
 * be rendered on the page as well — this only mirrors what a reader sees.
 */
export function faqSchema(
  path: string,
  items: ReadonlyArray<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** The author of record for Insights, as a Person node owned by the company. */
export const founderSchema = {
  "@type": "Person",
  "@id": `${siteConfig.url}/#founder`,
  name: siteConfig.founder.name,
  jobTitle: siteConfig.founder.title,
  worksFor: { "@id": SCHEMA_IDS.org },
};

export function blogPostingSchema(post: Insight) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${absoluteUrl(post.path)}#article`,
    headline: post.title,
    description: post.description,
    articleSection: post.category,
    datePublished: `${post.date}T00:00:00Z`,
    dateModified: `${post.date}T00:00:00Z`,
    wordCount: post.words,
    inLanguage: "en-IN",
    isAccessibleForFree: true,
    url: absoluteUrl(post.path),
    mainEntityOfPage: absoluteUrl(post.path),
    author: founderSchema,
    publisher: { "@id": SCHEMA_IDS.org },
    isPartOf: { "@id": `${absoluteUrl("/insights/")}#blog` },
  };
}

export function blogSchema(posts: readonly Insight[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${absoluteUrl("/insights/")}#blog`,
    name: `${siteConfig.name} Insights`,
    url: absoluteUrl("/insights/"),
    description: "Practice notes on data engineering, decision systems and governance.",
    publisher: { "@id": SCHEMA_IDS.org },
    inLanguage: "en-IN",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": `${absoluteUrl(post.path)}#article`,
      headline: post.title,
      url: absoluteUrl(post.path),
      datePublished: `${post.date}T00:00:00Z`,
    })),
  };
}
