import { blogHref } from "@fairhelm/config/urls";
/**
 * Canonical company facts.
 *
 * Every public surface — page copy, metadata, JSON-LD, /llms.txt, the
 * Markdown alternates and the footer disclosure — derives from this module
 * so a fact is stated once and cannot drift. Legal facts are statutory data:
 * change them only against the MCA record.
 */

/** The canonical SquareCampus product site. Product detail, pricing and
 * commercial programmes live there, never here. */
export const squareCampusUrl = "https://squarecampus.com/";

export const siteConfig = {
  name: "Fairhelm Systems",
  legalName: "FAIRHELM SYSTEMS (OPC) PRIVATE LIMITED",
  // Title-case rendering of the legal name, for running prose and the
  // copyright line where the all-caps MCA form would read as shouting.
  legalNameDisplay: "Fairhelm Systems (OPC) Private Limited",
  companyType: "One Person Company (Private Limited)",
  // Corporate Identity Number allotted by the MCA. Required on business
  // letters, billheads and all public notices under s.12(3)(c) of the
  // Companies Act, 2013.
  cin: "U62099KA2026OPC225579",
  incorporationDate: "2026-08-05",
  incorporationDateDisplay: "5 August 2026",
  incorporationStatus:
    "Incorporated in India on 5 August 2026 under the Companies Act, 2013 · One Person Company",
  // Goods and Services Tax Identification Number, Karnataka (state code 29),
  // from Form GST REG-06. Required on tax invoices; published so buyers can
  // verify it on the GST portal before raising a purchase order.
  gstin: "29AAHCF1819L1ZA",
  gstinRegistrationDate: "2026-09-22",
  gstinRegistrationDateDisplay: "22 September 2026",
  trademarkNotice:
    "SquareCampus™ is a trademark (registration pending) of Fairhelm Systems (OPC) Private Limited.",
  shortName: "Fairhelm",
  url: "https://fairhelmsystems.com",

  /**
   * Canonical positioning. `tagline` is the title-bar phrase; `description`
   * is the metadata-length sentence; `descriptionLong` is the entity
   * description used in JSON-LD and llms.txt. Fairhelm is a product-first
   * technology company — not an agency, an outsourcing firm, an AI
   * consultancy or an ERP vendor — that takes on a deliberately narrow set of
   * engineering work aligned with its own systems.
   */
  tagline: "Software products and governed data systems",
  description:
    "Fairhelm Systems builds and operates software products and governed data systems, including SquareCampus, its School Operating System for educational institutions.",
  descriptionLong:
    "Fairhelm Systems is a product-first technology company building software products and governed data systems. Its flagship product is SquareCampus, a School Operating System for schools, universities and multi-campus educational institutions. Alongside its products, Fairhelm selectively takes on data engineering, operational dashboard and governed analytics work where it aligns with the company's technical focus.",
  positioning: {
    is: "A product-first technology company that builds and operates its own software products and takes on selected, technically aligned engineering work.",
    isNot: [
      "a generic software-development agency",
      "an outsourcing or staff-augmentation company",
      "an AI consultancy that builds anything on request",
      "an ERP vendor",
    ],
  },

  /**
   * Author of record for Insights. The founder is already named publicly on
   * squarecampus.com; the title here is the minimal, verifiable one.
   */
  founder: {
    name: "Mohit Gupta",
    initials: "MG",
    title: "Founder",
    bio: "Writes the practice notes on data engineering, decision systems and governance that Fairhelm applies to SquareCampus and to its engineering work.",
  },

  contactEmail: "hello@fairhelmsystems.com",
  contactEmailIsPlaceholder: false,
  // Statutory contact telephone. Left empty until a line is provisioned; every
  // surface that renders it (footer, /contact, Organization JSON-LD) omits the
  // row while it is empty rather than publishing a placeholder number.
  phone: "" as string,
  // Grievance channel for Data Principal requests under the DPDP Act, 2023.
  // Addressed to the office, not to a named individual.
  grievanceEmail: "hello@fairhelmsystems.com",
  grievanceContactName: "Grievance Officer, Fairhelm Systems (OPC) Private Limited",
  // Contact-handling endpoint (API Gateway → Lambda → SquareCampus CRM). Empty
  // until the CRM proxy is deployed with platform credentials; while empty, the
  // inquiry form falls back to opening the visitor's mail client via mailto.
  contactEndpoint: "",
  location: "India",
  // Registered office (MCA). Display uses `full`; the structured fields feed the
  // PostalAddress in the Organization JSON-LD and any future contact markup.
  address: {
    full: "No. 33, 4th Floor, 1st Main, Road 3, Ganganagar, R T Nagar, Bangalore North, Bangalore – 560032, Karnataka, India",
    street: "No. 33, 4th Floor, 1st Main, Road 3, Ganganagar, R T Nagar, Bangalore North",
    locality: "Bangalore",
    region: "Karnataka",
    postalCode: "560032",
    country: "IN",
  },

  /**
   * Flagship product. `url` is the canonical product site; `page` is the
   * operator-context page on this site, which establishes that Fairhelm
   * develops and operates SquareCampus and then directs buyers to
   * squarecampus.com. `schemaId` is the product entity's stable id as
   * published on squarecampus.com, so both sites describe one entity.
   */
  product: {
    name: "SquareCampus",
    category: "School Operating System",
    url: squareCampusUrl,
    page: "/squarecampus/",
    schemaId: `${squareCampusUrl}#software`,
    description:
      "SquareCampus is a School Operating System for schools, universities and multi-campus educational institutions, focused on connected operations, institutional governance, accountability and operational visibility. It is developed and operated by Fairhelm Systems.",
    audience: "schools, universities and multi-campus educational institutions",
    relationship:
      "Fairhelm Systems develops and operates SquareCampus. Detailed product, security and commercial information is published on squarecampus.com.",
  },

  /**
   * Bounded engineering practice. Only the lanes below are offered; the
   * out-of-scope list is published so buyers and agents do not have to infer
   * it. Do not add lanes here without a page that represents a genuinely
   * distinct buyer intent.
   */
  services: {
    summary:
      "Fairhelm selectively takes on production data engineering, ETL/ELT pipelines, unified operational dashboards, governed analytics and decision systems, and product or platform engineering where it clearly aligns with the company's technical focus.",
    lanes: [
      {
        name: "Data engineering and ETL/ELT pipelines",
        href: "/services/data-engineering/",
        summary:
          "Production pipelines with ingestion, modelling, reconciliation, orchestration, data quality, observability and cost discipline.",
      },
      {
        name: "Operational dashboards and decision systems",
        href: "/services/dashboards/",
        summary:
          "Executive and operational dashboards built on governed metric definitions, trusted data, exceptions, ownership and decision workflows.",
      },
    ],
    outOfScope: [
      "Websites and marketing sites for hire",
      "Mobile apps for hire",
      "Generic custom software or 'build anything' development",
      "Digital marketing",
      "AI chatbot development",
      "Staff augmentation or commodity IT services",
    ],
  },

  /**
   * Verified official profiles for `sameAs`. Empty on purpose: no Fairhelm
   * Systems company profile has been verified yet, and an ambiguous or
   * product-level profile would link the wrong entity. Add a URL only after
   * confirming it is the company's own account.
   */
  sameAs: [] as readonly string[],

  /**
   * Government or programme recognitions. Empty until an approval actually
   * exists. DPIIT / Startup India recognition has NOT been granted; nothing
   * about it may be published until the certificate is issued. When it is,
   * add `{ name, issuer, identifier, date }` here and the surfaces that render
   * recognitions will pick it up.
   */
  recognitions: [] as ReadonlyArray<{
    name: string;
    issuer: string;
    identifier?: string;
    date?: string;
  }>,

  navigation: [
    { label: "SquareCampus", href: "/squarecampus/" },
    {
      label: "Engineering",
      links: [
        { label: "Data Engineering", href: "/services/data-engineering/" },
        { label: "Dashboards", href: "/services/dashboards/" },
      ],
    },
    { label: "Security", href: "/security/" },
    { label: "Insights", href: blogHref("/fairhelm/") },
    { label: "About", href: "/about/" },
  ],
  legalNavigation: [
    { label: "Overview", href: "/legal/" },
    { label: "Privacy", href: "/privacy/" },
    { label: "Terms", href: "/terms/" },
    { label: "Acceptable use", href: "/acceptable-use/" },
    { label: "AI policy", href: "/ai-policy/" },
    { label: "Data processing", href: "/data-processing/" },
    { label: "Refunds", href: "/refund-policy/" },
    { label: "Security", href: "/security/" },
  ],
  publicPages: [
    "/",
    "/squarecampus/",
    "/services/data-engineering/",
    "/services/dashboards/",
    "/about/",
    "/contact/",
    "/security/",
    "/ai/",
  ],
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
