import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CANONICAL_DEFINITION, entityFaqs, glossary } from "@/content/what-is-squarecampus";
import {
  createBreadcrumbSchema,
  createPageMetadata,
  createWebPageSchema,
  SEO_CONFIG,
} from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "What is SquareCampus? | Enterprise School OS",
  description: CANONICAL_DEFINITION,
  path: "/what-is-squarecampus",
  ogImage: "https://squarecampus.com/og/what-is-squarecampus.png",
  ogTitle: "What is SquareCampus? | Enterprise School OS",
  ogDescription: CANONICAL_DEFINITION,
});

/**
 * This route is the canonical entity answer for "what is SquareCampus". The
 * `DefinedTerm` node states the category explicitly so search engines and
 * language models can resolve the brand to its Enterprise School OS category.
 *
 * The FAQPage entries are generated from the same `entityFaqs` array the page
 * renders, so the markup and the visible answers cannot drift apart.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    createWebPageSchema({
      name: "What is SquareCampus? | Enterprise School OS",
      description: CANONICAL_DEFINITION,
      url: `${SEO_CONFIG.baseUrl}/what-is-squarecampus`,
    }),
    createBreadcrumbSchema([
      { name: "Home", url: SEO_CONFIG.baseUrl },
      { name: "What is SquareCampus?", url: `${SEO_CONFIG.baseUrl}/what-is-squarecampus` },
    ]),
    {
      "@type": "DefinedTermSet",
      "@id": `${SEO_CONFIG.baseUrl}/what-is-squarecampus#terms`,
      name: "SquareCampus vocabulary",
      url: `${SEO_CONFIG.baseUrl}/what-is-squarecampus/#glossary`,
    },
    {
      "@type": "DefinedTerm",
      "@id": `${SEO_CONFIG.baseUrl}/what-is-squarecampus#definition`,
      name: "SquareCampus",
      description: CANONICAL_DEFINITION,
      inDefinedTermSet: { "@id": `${SEO_CONFIG.baseUrl}/what-is-squarecampus#terms` },
    },
    // The glossary terms the page renders, so "School OS", "governance" and
    // "exception ownership" resolve to stated definitions rather than to
    // marketing vocabulary.
    ...glossary.map((entry, index) => ({
      "@type": "DefinedTerm",
      "@id": `${SEO_CONFIG.baseUrl}/what-is-squarecampus#term-${index + 1}`,
      name: entry.term,
      description: entry.definition,
      inDefinedTermSet: { "@id": `${SEO_CONFIG.baseUrl}/what-is-squarecampus#terms` },
    })),
    {
      "@type": "FAQPage",
      "@id": `${SEO_CONFIG.baseUrl}/what-is-squarecampus#faqpage`,
      mainEntity: entityFaqs.map((faq) => ({
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

export default function WhatIsSquareCampusLayout({ children }: { children: ReactNode }) {
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
