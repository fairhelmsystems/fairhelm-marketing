import { siteConfig } from "@fairhelm/fairhelm-content/company";
import { legalUpdated, privacySections } from "@fairhelm/fairhelm-content/legal";
import { Hero } from "@/components/site/hero";
import { JsonLd } from "@/components/site/json-ld";
import { LegalDocument } from "@/components/site/legal-document";
import { breadcrumbSchema, createPageMetadata } from "@/lib/fairhelm-seo";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Fairhelm Systems' privacy notice under the DPDP Act, 2023: the Data Fiduciary, categories of personal data including student and children's data, purposes, retention, Data Principal rights, and the grievance contact.",
  path: "/privacy/",
});

export default function PrivacyPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Legal", path: "/legal/" },
          { name: "Privacy", path: "/privacy/" },
        ])}
      />
      <Hero
        eyebrow="Legal · DPDP Act, 2023"
        title="Privacy policy"
        description="Who the Data Fiduciary is, what personal data is processed — student and children's data included — why, for how long, and the rights you hold over it."
        compact
      />
      <LegalDocument
        current="/privacy/"
        statusTitle="Data Fiduciary"
        statusDescription={`${siteConfig.legalNameDisplay} (CIN ${siteConfig.cin}), registered office ${siteConfig.address.full}. This notice is written against the Digital Personal Data Protection Act, 2023 and the DPDP Rules, 2025, which take full effect on 13 May 2027.`}
        sections={privacySections}
        lastUpdated={legalUpdated}
      />
    </main>
  );
}
