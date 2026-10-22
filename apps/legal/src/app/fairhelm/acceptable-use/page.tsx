import { siteConfig } from "@fairhelm/fairhelm-content/company";
import { acceptableUseSections, legalUpdated } from "@fairhelm/fairhelm-content/legal";
import { Hero } from "@/components/site/hero";
import { JsonLd } from "@/components/site/json-ld";
import { LegalDocument } from "@/components/site/legal-document";
import { breadcrumbSchema, createPageMetadata } from "@/lib/fairhelm-seo";

export const metadata = createPageMetadata({
  title: "Acceptable Use Policy",
  description:
    "Interim acceptable-use boundaries for the Fairhelm Systems public website, including responsible access, prohibited conduct, and security reporting.",
  path: "/acceptable-use/",
});

export default function AcceptableUsePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Legal", path: "/legal/" },
          { name: "Acceptable use", path: "/acceptable-use/" },
        ])}
      />
      <Hero
        eyebrow="Legal · Responsible use"
        title="Acceptable use policy"
        description="Clear boundaries for using Fairhelm's public website responsibly. Contracted systems carry additional role, security, and service-specific rules."
        compact
      />
      <LegalDocument
        current="/acceptable-use/"
        statusTitle="Interim policy status"
        statusDescription={`${siteConfig.legalName} is incorporated in India as a One Person Company. This policy establishes a responsible public baseline and will be formally reviewed as services become available.`}
        sections={acceptableUseSections}
        lastUpdated={legalUpdated}
      />
    </main>
  );
}
