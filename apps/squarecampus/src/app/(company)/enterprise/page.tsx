import { pricingPolicy } from "@fairhelm/squarecampus-content/pricing";
import { ResponsiveDisclosure } from "@fairhelm/ui/components/responsive-disclosure";
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
  FeaturePanel,
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
  "SquareCampus Enterprise includes 4,000 monthly AEGIS AI Credits, white-label Android and iOS setup, optional Entra SSO and larger communication allowances. Every plan shares the same standard features.";

export const metadata: Metadata = createPageMetadata({
  title: "SquareCampus Enterprise | Institutional Governance",
  description,
  path: "/enterprise",
});

const icons = [Network, Building2, Workflow, Fingerprint, ShieldCheck, Sparkles, GitBranch];

export default function EnterprisePage() {
  const monthlyAic = (pricingPolicy.plans.enterprise.monthlyIncludedMilliAic / 1000).toLocaleString("en-IN");
  const communicationCredits = pricingPolicy.communication.monthlyCreditsPerStudent.enterprise;
  return (
    <main tabIndex={-1} id="main-content">
      <PageSchema name="SquareCampus Enterprise" description={description} path="/enterprise" />
      <SectionShell className="key-page-hero pt-12 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <Reveal immediate className="space-y-6">
            <h1 className="type-display">More room for AEGIS.</h1>
            <p className="type-body measure text-[color:var(--muted-foreground)]">
              Enterprise includes larger monthly pools, branded apps and optional Entra SSO.
            </p>
            <CTAGroup>
              <ButtonLink href="/contact/" label="Discuss Enterprise" variant="cta" />
              <ButtonLink href="/pricing/#plans" label="Compare the plans" variant="secondary" />
            </CTAGroup>
            <p className="type-caption">{pricingAvailability.short}</p>
          </Reveal>
          <ResponsiveDisclosure label="See what Enterprise includes" className="hero-visual-disclosure">
            <Reveal immediate delay={100}>
              <FeaturePanel tone="strong">
                <h2 className="type-card-title">Included with Enterprise</h2>
                <dl className="mt-6 divide-y divide-(--line)">
                  <div className="pb-5">
                    <dt className="type-support">AEGIS AI Credits each month</dt>
                    <dd className="mt-2 font-display text-5xl tabular-nums">{monthlyAic} AIC</dd>
                  </div>
                  <div className="py-5">
                    <dt className="type-support">Communication credits each month</dt>
                    <dd className="type-card-title mt-2">{communicationCredits} × enrolled students</dd>
                  </div>
                  <div className="py-5">
                    <dt className="type-card-title">Your institution’s app identity</dt>
                    <dd className="type-support mt-2">White-label Android and iOS setup included.</dd>
                  </div>
                  <div className="pt-5">
                    <dt className="type-card-title">Microsoft Entra SSO</dt>
                    <dd className="type-support mt-2">Activate it when you need it. The licence price stays the same.</dd>
                  </div>
                </dl>
                <p className="type-caption mt-6">Monthly pools reset each cycle. Additional usage is prepaid. Store fees and maintenance scope are confirmed before activation.</p>
              </FeaturePanel>
            </Reveal>
          </ResponsiveDisclosure>
        </div>
      </SectionShell>

      <SectionShell mobileDisclosure="Institutional governance"
        id="governance"
        title="Institutional governance, across the operating model."
        body="Every plan is eligible for generally available institutional governance. Discovery establishes implemented capabilities, institutional boundaries, optional services and delivery scope for each dimension."
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

      <SectionShell mobileDisclosure="Sign-in and access"
        id="identity"
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

      <SectionShell mobileDisclosure="Plans at any enrolment"
        id="fit"
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

      <SectionShell mobileDisclosure="Security and data ownership"
        id="foundations"
        title="A complete core. A common security baseline."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <FeaturePanel>
            <h3 className="type-card-title">Every plan starts with the core</h3>
            <p className="type-support mt-4">{corePlatform.included}</p>
            <p className="type-support mt-4">{corePlatform.multiCampus}</p>
            <p className="type-support mt-4">{corePlatform.futureFeatures}</p>
            <p className="type-support mt-4">{commercialScope.implementation}</p>
            <p className="type-support mt-4">{commercialScope.tallyExport}</p>
            <p className="type-support mt-4">{commercialScope.paymentGateway}</p>
          </FeaturePanel>
          <FeaturePanel>
            <h3 className="type-card-title">Institution-owned data and defined terms</h3>
            <p className="type-support mt-4">{securityBaseline}</p>
            <p className="type-support mt-4">{dataPortability}</p>
            <RetentionPointer className="mt-5" />
          </FeaturePanel>
        </div>
      </SectionShell>

      <SectionShell className="key-page-close"
        id="discovery"
        title="Bring the governance question."
      >
        <FeaturePanel tone="strong" className="grid items-center gap-7 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="type-body">
              Bring your campus structure and an operational question. Review the standard platform,
              Enterprise allowances and any separately scoped services against your published
              price calculation.
            </p>
            <p className="type-support mt-4">{commercialScope.noSurprises}</p>
          </div>
          <ButtonLink href="/contact/" label="Discuss Enterprise" variant="cta" />
        </FeaturePanel>
      </SectionShell>
    </main>
  );
}
