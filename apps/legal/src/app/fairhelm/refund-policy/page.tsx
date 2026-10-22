import { siteConfig } from "@fairhelm/fairhelm-content/company";
import { legalUpdated, refundSections } from "@fairhelm/fairhelm-content/legal";
import { Hero } from "@/components/site/hero";
import { JsonLd } from "@/components/site/json-ld";
import { LegalDocument } from "@/components/site/legal-document";
import { breadcrumbSchema, createPageMetadata } from "@/lib/fairhelm-seo";

export const metadata = createPageMetadata({
  title: "Cancellation and Refund Policy",
  description:
    "How Fairhelm Systems handles cancellation of subscriptions and engagements, when fees are refundable, how to request a refund, and how approved refunds are paid.",
  path: "/refund-policy/",
});

export default function RefundPolicyPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Legal", path: "/legal/" },
          { name: "Refund policy", path: "/refund-policy/" },
        ])}
      />
      <Hero
        eyebrow="Legal · Cancellation and refunds"
        title="Cancellation and refund policy"
        description="How a subscription or engagement with Fairhelm Systems is cancelled, what is refundable, and how an approved refund is paid."
        compact
      />
      <LegalDocument
        current="/refund-policy/"
        statusTitle="Default position"
        statusDescription={`${siteConfig.legalNameDisplay} (CIN ${siteConfig.cin}, GSTIN ${siteConfig.gstin}), registered office ${siteConfig.address.full}. Fairhelm sells to institutions under signed agreements; where an order form or statement of work sets different terms, the signed document controls.`}
        sections={refundSections}
        lastUpdated={legalUpdated}
      />
    </main>
  );
}
