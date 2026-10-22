import {
  Building2,
  Fingerprint,
  GitBranch,
  Network,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { Metadata } from "next";
import { RetentionPointer } from "@/components/pricing/retention-pointer";
import { AvailabilityNote } from "@/components/site/availability-note";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { IdentityFlow } from "@/components/site/identity-flow";
import {
  CTAGroup,
  Eyebrow,
  FeaturePanel,
  OperationalBadge,
} from "@fairhelm/ui/components/marketing";
import { PageSchema } from "@/components/site/page-schema";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import {
  commercialScope,
  corePlatform,
  dataPortability,
  enterpriseBeyondModules,
  identity,
  pricingAvailability,
  securityBaseline,
} from "@/content/commercial";
import { enterpriseForSmallerInstitutions } from "@/content/pricing";
import { createPageMetadata } from "@/lib/seo";

const description =
  "Explore SquareCampus Enterprise for institutional governance, cross-campus command, identity and audit requirements, with deployment and commercial scope agreed during discovery.";

export const metadata: Metadata = createPageMetadata({
  title: "SquareCampus Enterprise | Institutional Governance",
  description,
  path: "/enterprise",
});

const icons = [Network, Building2, Workflow, Fingerprint, ShieldCheck, Sparkles, GitBranch];

export default function EnterprisePage() {
  return (
    <main tabIndex={-1} id="main-content">
      <PageSchema name="SquareCampus Enterprise" description={description} path="/enterprise" />
      <SectionShell className="pt-12 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <Reveal immediate className="space-y-6">
            <OperationalBadge tone="brand" icon={Building2}>
              SquareCampus Enterprise
            </OperationalBadge>
            <h1 className="type-display">
              Run every campus.
              <br />
              <span className="text-[color:var(--brand)]">Govern them as one.</span>
            </h1>
            <p className="type-body measure text-[color:var(--muted-foreground)]">
              For trusts, school groups and standalone institutions with deeper governance, identity
              or audit requirements. Define central policy, campus accountability and the controls
              your institution needs in one agreed operating scope.
            </p>
            <CTAGroup>
              <ButtonLink href="/contact/" label="Discuss Enterprise" variant="cta" />
              <ButtonLink href="/pricing/#plans" label="Compare the plans" variant="secondary" />
            </CTAGroup>
            <p className="type-caption">{pricingAvailability.short}</p>
          </Reveal>
          <Reveal delay={100}>
            <FeaturePanel tone="strong" className="relative overflow-hidden">
              <Eyebrow>Institutional governance</Eyebrow>
              <div className="mt-7 rounded-[var(--radius-panel)] border border-[color:var(--brand)]/35 bg-[color:var(--brand-tint)] px-5 py-5">
                <div className="flex items-center gap-3">
                  <Network aria-hidden className="size-5 text-[color:var(--brand)]" />
                  <p className="type-card-title">One institutional policy</p>
                </div>
                <p className="type-support mt-3">Identity · Authority · Audit requirements</p>
              </div>
              <div aria-hidden className="mx-auto h-8 w-px bg-[color:var(--line-strong)]" />
              <div className="grid grid-cols-3 gap-3">
                {["Campus A", "Campus B", "Campus C"].map((campus) => (
                  <div
                    key={campus}
                    className="rounded-[var(--radius-chip)] border border-[color:var(--line)] bg-[color:var(--surface)] px-2 py-4 text-center"
                  >
                    <Building2 aria-hidden className="mx-auto size-5 text-[color:var(--brand)]" />
                    <p className="mt-3 text-sm font-medium">{campus}</p>
                    <p className="type-caption mt-2">Local scope</p>
                  </div>
                ))}
              </div>
              <p className="type-support mt-6">Central governance. Defined local responsibility.</p>
              <p className="type-caption mt-3">
                Illustrative governance model. The proposal confirms available controls and
                deployment scope.
              </p>
            </FeaturePanel>
          </Reveal>
        </div>
      </SectionShell>

      <SectionShell
        id="governance"
        eyebrow="The Enterprise dimension"
        title="Institutional governance, across the operating model."
        body="Enterprise is selected for the governance requirement. Discovery establishes the available capabilities, institutional boundaries and delivery scope for each dimension."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enterpriseBeyondModules.map((dimension, index) => {
            const Icon = icons[index];
            return (
              <article
                key={dimension.dimension}
                className={`surface-panel rounded-[var(--radius-panel)] p-6 sm:p-7 ${index === enterpriseBeyondModules.length - 1 ? "sm:col-span-2 lg:col-span-3" : ""}`}
              >
                <Icon aria-hidden className="size-5 text-[color:var(--brand)]" />
                <h3 className="type-card-title mt-5">{dimension.dimension}</h3>
                <p className="type-support mt-3">{dimension.enterprise}</p>
              </article>
            );
          })}
        </div>
        <AvailabilityNote className="mt-6" />
      </SectionShell>

      <SectionShell
        id="identity"
        eyebrow="Identity and authority"
        title="Institutional sign-in. SquareCampus-governed access."
        body={identity.principle}
      >
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <p className="type-support">{identity.enterprise.body}</p>
            <p className="type-support">{identity.sso.body}</p>
            <p className="type-support">{identity.notes[1]}</p>
            <ButtonLink
              href="/security/#identity"
              label="Review identity and access"
              variant="link"
            />
          </div>
          <IdentityFlow />
        </div>
      </SectionShell>

      <SectionShell
        id="fit"
        eyebrow="Chosen by requirement"
        title={enterpriseForSmallerInstitutions.heading}
        body={enterpriseForSmallerInstitutions.body}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {enterpriseForSmallerInstitutions.triggers.map((trigger) => (
            <div
              key={trigger}
              className="surface-panel flex items-start gap-3 rounded-[var(--radius-panel)] p-5"
            >
              <ShieldCheck aria-hidden className="mt-1 size-4 shrink-0 text-[color:var(--brand)]" />
              <p className="type-support">{trigger}</p>
            </div>
          ))}
        </div>
        <p className="type-support mt-6">{enterpriseForSmallerInstitutions.counterNote}</p>
      </SectionShell>

      <SectionShell
        id="foundations"
        eyebrow="The shared foundations"
        title="A complete core. A common security baseline."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <FeaturePanel>
            <h3 className="type-card-title">Every plan starts with the core</h3>
            <p className="type-support mt-4">{corePlatform.included}</p>
            <p className="type-support mt-4">{corePlatform.multiCampus}</p>
            <p className="type-support mt-4">{commercialScope.implementation}</p>
          </FeaturePanel>
          <FeaturePanel>
            <h3 className="type-card-title">Institution-owned data and defined terms</h3>
            <p className="type-support mt-4">{securityBaseline}</p>
            <p className="type-support mt-4">{dataPortability}</p>
            <RetentionPointer className="mt-5" />
          </FeaturePanel>
        </div>
      </SectionShell>

      <SectionShell
        id="discovery"
        eyebrow="Define the operating scope"
        title="Bring the governance question."
      >
        <FeaturePanel tone="strong" className="grid items-center gap-7 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="type-body">
              Share your campus structure, identity requirements, approval boundaries and audit
              expectations. We establish the supported scope and deployment responsibilities, then
              document the commercial terms in a written proposal.
            </p>
            <p className="type-support mt-4">{commercialScope.noSurprises}</p>
          </div>
          <ButtonLink href="/contact/" label="Discuss Enterprise" variant="cta" />
        </FeaturePanel>
      </SectionShell>
    </main>
  );
}
