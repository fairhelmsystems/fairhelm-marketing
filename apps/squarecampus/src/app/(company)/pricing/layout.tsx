import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pricingFaqs } from "@/content/pricing";
import {
  createBreadcrumbSchema,
  createPageMetadata,
  createWebPageSchema,
  SEO_CONFIG,
} from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "SquareCampus Pricing | Annual INR Plans & Calculator",
  description:
    "Calculate SquareCampus pricing in INR. Compare annual Starter, Growth and Enterprise subscriptions, progressive student rates, shared features and optional services.",
  path: "/pricing",
  ogImage: "https://squarecampus.com/og/pricing.png",
  ogTitle: "Your school. Your scale. Your price. | SquareCampus",
  ogDescription:
    "Public annual INR rates, progressive student slabs and a live estimate. Every generally available feature is eligible on every plan. Additional usage and GST are separate.",
});

/**
 * Structured data for /pricing.
 *
 * The page describes a progressive schedule, not a universal institutional
 * checkout amount. FAQ answers and the downloadable policy expose the real
 * pricing basis without inventing a fixed all-in Offer price.
 *
 * The FAQPage entries are generated from the same `pricingFaqs` array the page
 * renders, so the markup and the visible answers are guaranteed identical.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    createWebPageSchema({
      name: "SquareCampus Pricing | Annual INR Plans & Calculator",
      description:
        "Public annual INR pricing for Starter, Growth and Enterprise. A deterministic calculator applies progressive student slabs and separates recurring services, one-time branding, GST and additional usage.",
      url: `${SEO_CONFIG.baseUrl}/pricing`,
    }),
    createBreadcrumbSchema([
      { name: "Home", url: SEO_CONFIG.baseUrl },
      { name: "Pricing", url: `${SEO_CONFIG.baseUrl}/pricing` },
    ]),
    {
      "@type": "FAQPage",
      "@id": `${SEO_CONFIG.baseUrl}/pricing#faqpage`,
      mainEntity: pricingFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

export default function PricingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
