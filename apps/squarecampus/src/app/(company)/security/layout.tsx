import type { Metadata } from "next";
import type { ReactNode } from "react";
import { securityFaqs } from "@/content/security-faq";
import {
  createBreadcrumbSchema,
  createPageMetadata,
  createWebPageSchema,
  SEO_CONFIG,
} from "@/lib/seo";

// Security page - critical for enterprise trust and procurement decisions
// Target: Security-conscious decision makers, IT heads, compliance officers
// Rule: only design-posture statements here. Specific certifications, SLAs,
// and audit artifacts are shared through the security review process.

// Server-side structured data for security page
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    createWebPageSchema({
      name: "Security & Trust | SquareCampus",
      description:
        "How SquareCampus approaches security for school data: encryption, role-based access, audit trails, and an India-first hosting posture.",
      url: `${SEO_CONFIG.baseUrl}/security`,
    }),
    createBreadcrumbSchema([
      { name: "Home", url: SEO_CONFIG.baseUrl },
      { name: "Security", url: `${SEO_CONFIG.baseUrl}/security` },
    ]),
    {
      "@type": "FAQPage",
      "@id": `${SEO_CONFIG.baseUrl}/security#faqpage`,
      mainEntity: securityFaqs.map((faq) => ({
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

export const metadata: Metadata = createPageMetadata({
  title: "Security & Trust | SquareCampus School Operating System",
  description:
    "How SquareCampus approaches security for school data: encryption in transit and at rest, role-based access, audit trails, and an India-first hosting posture. Documentation available on request.",
  path: "/security",
  ogImage: "https://squarecampus.com/og/security.png",
  ogTitle: "Security & Trust | SquareCampus",
  ogDescription:
    "Encryption, role-based access, audit trails, and an India-first hosting posture. Security documentation available through the review process.",
  twitterTitle: "Security & Trust | SquareCampus",
  twitterDescription:
    "Encryption, role-based access, audit trails, and an India-first hosting posture for school data.",
});

type SecurityLayoutProps = {
  children: ReactNode;
};

export default function SecurityLayout({ children }: SecurityLayoutProps) {
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
