import { siteConfig } from "@fairhelm/fairhelm-content/company";
import { aiPolicySections, legalUpdated } from "@fairhelm/fairhelm-content/legal";
import { Hero } from "@/components/site/hero";
import { JsonLd } from "@/components/site/json-ld";
import { LegalDocument } from "@/components/site/legal-document";
import { breadcrumbSchema, createPageMetadata } from "@/lib/fairhelm-seo";

export const metadata = createPageMetadata({
  title: "AI and Governed Intelligence Policy",
  description:
    "Fairhelm Systems' interim AI policy covers AEGIS, human oversight, customer-data training boundaries, responsible design, and public AI agents.",
  path: "/ai-policy/",
});

export default function AiPolicyPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Legal", path: "/legal/" },
          { name: "AI policy", path: "/ai-policy/" },
        ])}
      />
      <Hero
        eyebrow="Legal · Governed intelligence"
        title="AI policy"
        description="A public statement of Fairhelm's AI boundaries: bounded assistance, visible authority, customer control, reviewable evidence, and human accountability."
        compact
      />
      <LegalDocument
        current="/ai-policy/"
        statusTitle="Interim policy status"
        statusDescription={`${siteConfig.legalName} is incorporated in India as a One Person Company. This posture describes product direction and design constraints; contract-specific AI terms must match the system actually delivered.`}
        sections={aiPolicySections}
        lastUpdated={legalUpdated}
      />
    </main>
  );
}
