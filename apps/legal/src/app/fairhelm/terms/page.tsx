import { siteConfig } from "@fairhelm/fairhelm-content/company";
import { legalUpdated, termsSections } from "@fairhelm/fairhelm-content/legal";
import { Hero } from "@/components/site/hero";
import { JsonLd } from "@/components/site/json-ld";
import { LegalDocument } from "@/components/site/legal-document";
import { breadcrumbSchema, createPageMetadata } from "@/lib/fairhelm-seo";

export const metadata = createPageMetadata({
  title: "Website Terms",
  description:
    "Interim terms for access to the Fairhelm Systems public website, including product-description limits, acceptable use, intellectual property, and signed agreements.",
  path: "/terms/",
});

export default function TermsPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Legal", path: "/legal/" },
          { name: "Terms", path: "/terms/" },
        ])}
      />
      <Hero
        eyebrow="Legal · Website terms"
        title="Website terms"
        description="Terms for the Fairhelm Systems public website. Contracted products and services are governed only by their signed agreements."
        compact
      />
      <LegalDocument
        current="/terms/"
        statusTitle="Publisher of this website"
        statusDescription={`${siteConfig.legalNameDisplay} (CIN ${siteConfig.cin}), incorporated in India on ${siteConfig.incorporationDateDisplay} under the Companies Act, 2013, registered office ${siteConfig.address.full}.`}
        sections={termsSections}
        lastUpdated={legalUpdated}
      />
    </main>
  );
}
