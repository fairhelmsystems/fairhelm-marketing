import { SkipLink } from "@fairhelm/ui/components/skip-link";
import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Sora } from "next/font/google";
import type { ReactNode } from "react";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ThemeScript } from "@fairhelm/ui/components/theme-script";
import { ThemeToggle } from "@fairhelm/ui/components/theme-toggle";
import { product } from "@/content/commercial";
import { company } from "@/content/company";
import { SCHEMA_IDS, SEO_CONFIG } from "@/lib/seo";
import "./globals.css";

const bodyFont = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

// Every `font-display` element renders at the default 400 (no weight class
// anywhere sets Sora heavier), so only 400 is loaded — 500/600 were two
// unused font files on every page.
const displayFont = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.baseUrl),
  title: {
    default: "SquareCampus | School Operating System for Indian Schools and Trusts",
    template: "%s | SquareCampus",
  },
  description:
    "SquareCampus connects school operations, workflow ownership, institutional visibility and governed intelligence in one School Operating System for schools and educational trusts.",
  // Only the canonical here. The homepage's Markdown alternate is declared in
  // app/page.tsx: a root-layout `alternates.types` would be inherited by every
  // route without its own metadata (404, /hello), advertising the homepage's
  // Markdown as theirs.
  alternates: {
    canonical: `${SEO_CONFIG.baseUrl}/`,
  },
  openGraph: {
    type: "website",
    url: "https://squarecampus.com/",
    title: "SquareCampus | School Operating System for Indian Schools and Trusts",
    description:
      "Know what requires attention today. SquareCampus connects school operations, assigns ownership to exceptions, and gives leadership a governed view of the institution.",
    siteName: "SquareCampus",
    locale: "en_IN",
    images: [SEO_CONFIG.socialImages.openGraph],
  },
  twitter: {
    card: "summary_large_image",
    site: "@squarecampushq",
    creator: "@squarecampushq",
    title: "SquareCampus | School Operating System for Indian Schools and Trusts",
    description:
      "A system of record stores what happened. A decision layer shows what requires attention, who owns it, and what happens next.",
    images: [SEO_CONFIG.socialImages.twitter],
  },
  robots: {
    index: true,
    follow: true,
  },
  referrer: "same-origin",
  other: {
    "permissions-policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
};

// Tints the mobile browser chrome to the page background. The theme script
// defaults every visitor to dark (system preference is intentionally not
// followed), so a single dark value matches the rendered default — a
// prefers-color-scheme variant would mis-tint OS-light visitors on the dark page.
export const viewport: Viewport = {
  themeColor: "#020305",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    /*
      One language policy, applied everywhere: en-IN. The site is written in
      Indian English for Indian institutions, WebSite/WebPage JSON-LD already
      declares `inLanguage: "en-IN"`, and the OG locale is `en_IN`; `lang="en"`
      was the one signal disagreeing with the other three. No hreflang set is
      emitted: there is exactly one language, and squarecampus.in 301s here, so
      alternates would point at redirects.
    */
    <html
      lang="en-IN"
      /*
        `dark` is on the server-rendered element so the very first paint is
        already dark; the inline theme script only removes it for visitors who
        saved a light preference, before anything renders.
      */
      className={`${bodyFont.variable} ${monoFont.variable} ${displayFont.variable} dark scroll-smooth`}
      suppressHydrationWarning
      data-theme="dark"
      data-scroll-behavior="smooth"
    >
      <head>
        {/*
          Pointer to the machine-readable site summary.

          `rel="describedby"` is the relation the llms.txt convention uses: the
          document at /llms.txt describes this site (and therefore this page),
          without claiming to be an alternate representation of the page —
          `rel="alternate"` is reserved for the per-page Markdown, emitted
          through `alternates.types` in metadata.

          Discovery is layered on purpose: this tag, a footer link on every
          page, a pointer comment in robots.txt, and a sitemap entry.
        */}
        <link rel="describedby" href="/llms.txt" />
        <ThemeScript />
        {/*
          The scroll-reveal system starts at `opacity: 0` and relies on JS to
          add `.is-revealed`. Without JS that class never arrives, so every
          revealed block on every page would render invisible. This restores
          the fully-composed page for no-JS visitors and crawlers that do not
          execute scripts — the content is already in the HTML either way.
        */}
        <noscript>
          <style>
            {
              ".reveal-root,.reveal-stagger [data-reveal-item],.scene-root,.scene-root [data-scene-item],.scene-root [data-scene-accent],.aegis-visual [data-aegis-rise],.aegis-visual [data-aegis-hub],.aegis-visual [data-aegis-sat],.aegis-visual [data-aegis-dot],.aegis-visual .aegis-port,.aegis-visual .aegis-ring,.aegis-visual .aegis-status-done,.aegis-console [data-console-step],nav[aria-label='Table of contents'] a{opacity:1!important;transform:none!important;animation:none!important}.aegis-visual [data-aegis-line]{stroke-dashoffset:0!important;opacity:.5!important}.aegis-visual [data-aegis-bar],.aegis-visual .aegis-beam-line,.svc-flow [data-svc-bar]{transform:none!important;animation:none!important}.aegis-visual .aegis-packet,.aegis-visual .aegis-status-pending{display:none!important}.aegis-console .aegis-console-query{max-width:100%!important;white-space:normal!important;animation:none!important}"
            }
          </style>
        </noscript>
      </head>
      <body suppressHydrationWarning className="antialiased">
        <SkipLink />
        <ScrollToTop />
        {/* Plain script tag: server-rendered so non-JS crawlers see the schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": SCHEMA_IDS.org,
                  name: "SquareCampus",
                  legalName: company.legalName,
                  description: `${company.legalNameDisplay} operates SquareCampus, a School Operating System for schools, educational trusts and multi-campus groups in India.`,
                  url: "https://squarecampus.com/",
                  logo: SEO_CONFIG.logo,
                  foundingDate: company.incorporationDate,
                  email: company.email.general,
                  // Telephone is omitted until a statutory line is
                  // provisioned — an empty string would publish a claim we
                  // cannot honour.
                  ...(company.phone ? { telephone: company.phone } : {}),
                  taxID: company.gstin,
                  identifier: [
                    {
                      "@type": "PropertyValue",
                      propertyID: "CIN",
                      name: "Corporate Identity Number",
                      value: company.cin,
                    },
                    {
                      "@type": "PropertyValue",
                      propertyID: "GSTIN",
                      name: "Goods and Services Tax Identification Number",
                      value: company.gstin,
                    },
                  ],
                  address: {
                    "@type": "PostalAddress",
                    name: "Registered office",
                    streetAddress: company.address.street,
                    addressLocality: company.address.locality,
                    addressRegion: company.address.region,
                    postalCode: company.address.postalCode,
                    addressCountry: company.address.country,
                  },
                  founder: {
                    "@type": "Person",
                    name: "Mohit Gupta",
                  },
                  sameAs: SEO_CONFIG.sameAs,
                  brand: { "@type": "Brand", name: "SquareCampus", logo: SEO_CONFIG.logo },
                  areaServed: {
                    "@type": "Country",
                    name: "India",
                  },
                  contactPoint: [
                    {
                      "@type": "ContactPoint",
                      contactType: "sales",
                      email: "contact@squarecampus.com",
                    },
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": SCHEMA_IDS.website,
                  url: "https://squarecampus.com/",
                  name: "SquareCampus",
                  description: product.shortDescription,
                  publisher: { "@id": SCHEMA_IDS.org },
                  about: { "@id": SCHEMA_IDS.software },
                  inLanguage: "en-IN",
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": SCHEMA_IDS.software,
                  name: "SquareCampus",
                  // Category signal. `SoftwareApplication` is the accurate
                  // type: the product is a platform with web and mobile
                  // clients, so the narrower WebApplication would be wrong for
                  // the apps. `BusinessApplication` is the accurate category:
                  // it is institutional operations software used by
                  // administrators and leadership, not a learning application
                  // — "EducationalApplication" would describe the customer's
                  // domain, not what the software does. The sub-category
                  // carries the canonical wording, School Operating System —
                  // NOT "school ERP" or "school management software".
                  // `description` is the one canonical short description from
                  // content/commercial.ts. No offers, price, ratings or
                  // reviews: the site publishes no figures and holds no
                  // first-party review data.
                  applicationCategory: "BusinessApplication",
                  applicationSubCategory: product.category,
                  description: product.shortDescription,
                  operatingSystem: "Web",
                  url: "https://app.squarecampus.com",
                  // The marketing pages that describe the application. The
                  // pricing page states the model; it publishes no figure.
                  mainEntityOfPage: `${SEO_CONFIG.baseUrl}/what-is-squarecampus/`,
                  softwareHelp: { "@type": "WebPage", "@id": `${SEO_CONFIG.baseUrl}/faq/#webpage` },
                  publisher: { "@id": SCHEMA_IDS.org },
                  brand: { "@id": SCHEMA_IDS.org },
                  areaServed: { "@type": "Country", name: "India" },
                  inLanguage: "en-IN",
                },
              ],
            }),
          }}
        />
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
