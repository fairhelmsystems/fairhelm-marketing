import {siteHref} from "@fairhelm/config/urls";
import {
  BetweenHorizontalStart,
  Eye,
  FileClock,
  KeyRound,
  LockKeyhole,
  ScanEye,
  ShieldCheck,
} from "lucide-react";
import { AccessControlVisual } from "@/components/site/access-control-visual";
import { Container } from "@/components/site/container";
import { CtaBand } from "@/components/site/cta-band";
import { FeatureCard } from "@/components/site/feature-card";
import { Hero } from "@/components/site/hero";
import { JsonLd } from "@/components/site/json-ld";
import { LegalNavBand } from "@/components/site/legal-document";
import { PageNav } from "@/components/site/page-nav";
import { RelatedInsights } from "@/components/site/related-insights";
import { SectionHeading } from "@/components/site/section-heading";
import { Alert, AlertDescription, AlertTitle } from "@fairhelm/ui/components/alert";
import { createPageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata = createPageMetadata({
  title: "Security and Governance Posture",
  description:
    "Fairhelm Systems' security posture covers RBAC, auditability, least privilege, tenant separation, secure cloud deployment and privacy-first data handling.",
  path: "/security/",
});

const principles = [
  {
    icon: KeyRound,
    title: "Role-based access control",
    motif: "key" as const,
    description:
      "Access should follow explicit roles, scopes and responsibilities rather than convenience or broad defaults.",
  },
  {
    icon: FileClock,
    title: "Auditability",
    motif: "ledger" as const,
    description:
      "Material actions and sensitive interactions should produce intelligible, reviewable records.",
  },
  {
    icon: LockKeyhole,
    title: "Least privilege",
    motif: "partition" as const,
    description:
      "People, services and automation receive only the access necessary for the approved operating purpose.",
  },
  {
    icon: BetweenHorizontalStart,
    title: "Tenant separation",
    motif: "mesh" as const,
    description:
      "Customer and institutional boundaries are treated as architectural concerns, not naming conventions.",
  },
  {
    icon: ShieldCheck,
    title: "Secure cloud deployment",
    motif: "shield" as const,
    description:
      "Encryption, controlled network paths, managed secrets, monitored services and recoverable operations guide deployments.",
  },
  {
    icon: ScanEye,
    title: "Privacy-first handling",
    motif: "rings" as const,
    description:
      "Collection, use, retention, sharing and deletion should remain proportionate, explicit and governed.",
  },
];

const commitments = [
  [
    "No selling student or parent data",
    "Fairhelm does not treat personal or institutional data as a hidden monetisation stream.",
  ],
  [
    "No training AI on customer data by default",
    "Customer data will not be used to train AI systems unless that use is explicitly contracted and governed.",
  ],
  [
    "Customer data belongs to the school or trust",
    "The customer retains ownership; Fairhelm acts only within the agreed service and processing scope.",
  ],
  [
    "No governance bypass",
    "Intelligence and automation are designed to respect role, scope, approval and audit requirements.",
  ],
] as const;

export default function SecurityPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Security", path: "/security/" },
        ])}
      />
      <Hero
        eyebrow="Security · Privacy · Governance"
        title="Trust is an architecture, not a badge."
        highlight="architecture"
        description="Fairhelm Systems approaches security through explicit authority, least privilege, auditable action, protected data boundaries and cloud operations designed to remain predictable under scrutiny."
        primary={{ label: "Discuss security requirements", href: "/contact/" }}
        secondary={{ label: "Read privacy posture", href: siteHref("fairhelm", "/privacy/") }}
        bullets={[
          "Role-based access and least privilege",
          "Audit trails for material action",
          "Tenant separation as architecture",
          "No unearned certifications claimed",
        ]}
      >
        <AccessControlVisual />
      </Hero>

      <LegalNavBand current="/security/" />

      <section className="section">
        <Container>
          <SectionHeading
            eyebrow="Core principles"
            title="Governed access. Traceable action. Clear data boundaries."
            description="The exact control set depends on product maturity, deployment scope, customer requirements and contract. These principles define the direction of travel."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((principle) => (
              <FeatureCard key={principle.title} {...principle} />
            ))}
          </div>
        </Container>
      </section>

      <section className="section border-y border-border section-alt">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <SectionHeading
            eyebrow="SquareCampus data commitments"
            title="Student, parent and institutional data are not inventory."
            description="Our product posture starts from customer ownership and explicit permission."
          />
          <div className="grid gap-4">
            {commitments.map(([title, description], index) => (
              <div
                key={title}
                className="flex gap-4 surface-panel rounded-[var(--radius-panel)] p-5 sm:p-6"
              >
                <span className="index mt-1.5">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="display-3">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <SectionHeading
            eyebrow="AEGIS controls"
            title="Governed intelligence begins with deliberate limits."
            description="AEGIS is read-only first, RBAC-aware, audit-backed and explainable. Autonomous writes are outside the v1 posture."
          />
          <Alert className="self-start">
            <Eye />
            <AlertTitle>No fake compliance claims</AlertTitle>
            <AlertDescription>
              This page is a public security and governance posture. It is not a certification,
              audit report, data processing agreement, security addendum or warranty.
              Contract-specific controls must be documented in the relevant agreement.
            </AlertDescription>
          </Alert>
        </Container>
      </section>

      <RelatedInsights lane="/security/" />

      <PageNav
        items={[
          {
            eyebrow: "Legal",
            title: "Privacy policy",
            description:
              "The Data Fiduciary, categories of personal data, retention and Data Principal rights.",
            href: siteHref("fairhelm", "/privacy/"),
          },
          {
            eyebrow: "Legal",
            title: "Legal and governance center",
            description: "Every public policy, indexed, with the publishing entity named.",
            href: siteHref("fairhelm", "/legal/"),
          },
        ]}
      />

      <CtaBand
        title="Bring security into the system conversation early."
        description="Share the data classification, roles, deployment constraints, audit needs and customer obligations before architecture hardens."
        label="Discuss governance requirements"
        secondaryLabel="Read the privacy policy"
        secondaryHref="/privacy/"
      />
    </>
  );
}
