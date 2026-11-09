import type { Metadata } from "next";
import type { ReactNode } from "react";
import { faqs as faqData } from "@/content/faq";
import {
  createBreadcrumbSchema,
  createPageMetadata,
  createWebPageSchema,
  SEO_CONFIG,
} from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "SquareCampus FAQ | Enterprise School OS",
  description:
    "Answers about SquareCampus's Enterprise School OS for Indian schools and trusts, including plans, governance, rollout, security and data ownership.",
  path: "/faq",
  ogImage: "https://squarecampus.com/og/faq.png",
  ogTitle: "SquareCampus FAQ | Enterprise School OS",
  ogDescription:
    "The Enterprise School OS for Indian schools and trusts. Answers on plans, governance, implementation, security and data ownership.",
});

// Server-side structured data for FAQ page
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    createWebPageSchema({
      name: "SquareCampus FAQ | Enterprise School OS",
      description:
        "Answers about SquareCampus's Enterprise School OS, including getting started, features, security and identity, pricing and implementation.",
      url: `${SEO_CONFIG.baseUrl}/faq`,
    }),
    createBreadcrumbSchema([
      { name: "Home", url: SEO_CONFIG.baseUrl },
      { name: "FAQ", url: `${SEO_CONFIG.baseUrl}/faq` },
    ]),
    {
      "@type": "FAQPage",
      "@id": `${SEO_CONFIG.baseUrl}/faq#faqpage`,
      mainEntity: faqData.map((faq) => ({
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

type FAQLayoutProps = {
  children: ReactNode;
};

export default function FAQLayout({ children }: FAQLayoutProps) {
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
