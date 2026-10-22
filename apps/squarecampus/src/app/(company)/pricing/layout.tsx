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
  title: "SquareCampus Pricing | School OS Plans for Schools and Trusts",
  description:
    "Explore Starter, Pro and Enterprise plans for SquareCampus. Every plan includes the generally available core platform and multi-campus operations. Review optional enhancements and the selected 90-day complimentary launch pilot.",
  path: "/pricing",
  ogImage: "https://squarecampus.com/og/pricing.png",
  ogTitle: "SquareCampus Pricing | Plans for Schools, Trusts and Multi-Campus Groups",
  ogDescription:
    "Annual institutional licensing calculated through student-volume bands and shaped by the plan chosen (Starter, Pro or Enterprise), governance needs and deployment. Tailored proposal after institutional discovery.",
});

/**
 * Structured data for /pricing.
 *
 * Deliberately NO Product/Offer schema: this page publishes no prices, and
 * emitting an Offer without a real price (or with an invented one) would be
 * both an SEO error and a commercial claim the order form does not support.
 *
 * The FAQPage entries are generated from the same `pricingFaqs` array the page
 * renders, so the markup and the visible answers are guaranteed identical.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    createWebPageSchema({
      name: "SquareCampus Pricing | School OS Plans for Schools and Trusts",
      description:
        "How SquareCampus is licensed: annual institutional licensing calculated through student-volume bands and shaped by the plan chosen (Starter, Pro or Enterprise), governance needs and deployment profile.",
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
