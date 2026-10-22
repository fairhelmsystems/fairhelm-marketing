import { siteConfig } from "@fairhelm/fairhelm-content/company";
import { dataProcessingSections, legalUpdated } from "@fairhelm/fairhelm-content/legal";
import { Hero } from "@/components/site/hero";
import { JsonLd } from "@/components/site/json-ld";
import { LegalDocument } from "@/components/site/legal-document";
import { breadcrumbSchema, createPageMetadata } from "@/lib/fairhelm-seo";

export const metadata = createPageMetadata({
  title: "Data Processing Overview",
  description:
    "A public overview of Fairhelm Systems' intended approach to documented processing instructions, customer responsibilities, subprocessors, retention, and engagement-specific DPAs.",
  path: "/data-processing/",
});

export default function DataProcessingPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Legal", path: "/legal/" },
          { name: "Data processing", path: "/data-processing/" },
        ])}
      />
      <Hero
        eyebrow="Legal · Data governance"
        title="Data processing overview"
        description="A public view of the contractual questions Fairhelm expects to answer before processing customer personal data. This page is not itself a Data Processing Addendum."
        compact
      />
      <LegalDocument
        current="/data-processing/"
        statusTitle="Public overview — not a signed DPA"
        statusDescription={`${siteConfig.legalName} is incorporated in India as a One Person Company. Binding roles, instructions, controls, locations, providers, assistance, and retention must be defined for the specific engagement.`}
        sections={dataProcessingSections}
        lastUpdated={legalUpdated}
      />
    </main>
  );
}
