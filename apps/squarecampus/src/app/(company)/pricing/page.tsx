import { CalendarRange, Check, FileText, Minus, ShieldCheck } from "lucide-react";
import { CommercialModel } from "@/components/pricing/commercial-model";
import { PlanArchitecture } from "@/components/pricing/plan-architecture";
import { PlanMatrix } from "@/components/pricing/plan-matrix";
import { ScopedCostGrid } from "@/components/pricing/scoped-cost-grid";
import { VolumeRationale } from "@/components/pricing/volume-rationale";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { DetailsFaq } from "@fairhelm/ui/components/details-faq";
import { FactTable } from "@/components/site/fact-table";
import {
  CTAGroup,
  Eyebrow,
  FeaturePanel,
  OperationalBadge,
  TrustNote,
} from "@fairhelm/ui/components/marketing";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import {
  commercialProgrammes,
  corePlatform,
  dataPortability,
  enterpriseBeyondModules,
  fit,
  foundingProgramme,
  identity,
  launchPilot,
  pricingAvailability,
  securityBaseline,
} from "@/content/commercial";
import { DISCOVERY_NOTE, pricingFaqs, proposalInputs } from "@/content/pricing";
import { ctaLabels, siteCtas } from "@/content/site-content";

const heroSignals = [
  { label: "Licence", value: "Annual, institutional" },
  { label: "Calculated on", value: "Student-volume bands" },
  { label: "Shaped by", value: "The plan chosen and the institution's complexity" },
] as const;

export default function PricingPage() {
  return (
    <main tabIndex={-1} id="main-content">
      {/* 1 — Hero */}
      <SectionShell className="pt-12 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
          <Reveal immediate className="space-y-6">
            <Eyebrow>Commercial model</Eyebrow>
            <h1 className="type-display">
              Pricing that scales with the institution &mdash; not with software complexity.
            </h1>
            <p className="type-body measure text-[color:var(--muted-foreground)]">
              One annual institutional licence, calculated on student-volume bands and shaped by the
              plan you choose. The three plans are below; figures follow in a written proposal after
              a short discovery.
            </p>
            <CTAGroup>
              <ButtonLink href={siteCtas.proposalHref} label={ctaLabels.proposal} variant="cta" />
              <ButtonLink href="#plans" label="Compare the plans" variant="secondary" />
            </CTAGroup>
            <TrustNote>
              No hidden module wall. No compulsory rip-and-replace. Scope, ownership and success
              measures agreed before deployment.
            </TrustNote>
          </Reveal>

          <Reveal delay={120} className="lg:pt-2">
            <FeaturePanel tone="strong">
              <Eyebrow>How pricing works</Eyebrow>
              <p className="type-support mt-4">
                Student numbers set the scale. The plan sets how much operational and governance
                control you get. The two are decided separately.
              </p>

              {/* Stacked rows rather than three columns: the labels are very
                  different lengths, so a column layout goes ragged in this
                  narrow panel at laptop widths. */}
              <dl className="mt-5 border-t border-[color:var(--line)]">
                {heroSignals.map((signal) => (
                  <div
                    key={signal.label}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[color:var(--line)] py-3.5"
                  >
                    <dt className="eyebrow">{signal.label}</dt>
                    <dd className="text-sm leading-6 text-[color:var(--foreground)]">
                      {signal.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </FeaturePanel>
          </Reveal>
        </div>
      </SectionShell>

      {/* 2 — Plans, straight after a short introduction (audit SC-013). */}
      <SectionShell
        id="plans"
        eyebrow="Plan architecture"
        title="Three levels of institutional command, not three feature bundles."
        body={`${corePlatform.included} ${corePlatform.differentiation}`}
      >
        <Reveal>
          <PlanArchitecture />
        </Reveal>

        <Reveal delay={80} className="md:mt-12">
          <PlanMatrix />
        </Reveal>
      </SectionShell>

      {/* 3 — How the licence is composed (the detail, below the plans) */}
      <SectionShell
        id="model"
        eyebrow="How the licence is composed"
        title="Four inputs, agreed openly, before any number is issued."
        body="The annual platform licence is not a module count. It is the sum of institutional scale, the plan selected (how much operational and governance control it includes), the complexity of the institution and how the platform is delivered."
      >
        <Reveal>
          <CommercialModel />
        </Reveal>
      </SectionShell>

      {/* 3b — What Enterprise adds beyond ordinary ERP modules. A table, not a
          slogan: procurement reads it dimension by dimension. */}
      <SectionShell
        id="enterprise-adds"
        eyebrow="What Enterprise adds"
        title="Enterprise is not Pro with more modules."
        body="An ordinary ERP grows by adding modules. Enterprise grows by adding institutional governance: the structure, command, identity, audit and deployment controls a trust or a complex institution actually has to run on."
      >
        <Reveal>
          <FactTable
            caption="What Enterprise adds beyond ordinary ERP modules, by dimension."
            columns={[
              { key: "modules", label: "Ordinary ERP modules" },
              { key: "enterprise", label: "SquareCampus Enterprise" },
            ]}
            rows={enterpriseBeyondModules.map((row) => ({
              label: row.dimension,
              values: [row.modules, row.enterprise],
            }))}
          />
        </Reveal>

        {/* Identity by plan is stated on the plan cards, in the comparison and
            in the FAQ; the full explanation lives on /security/#identity. */}
        <Reveal delay={80}>
          <p className="surface-panel mt-4 flex items-start gap-3 rounded-[var(--radius-panel)] px-6 py-4 text-sm leading-6 text-[color:var(--muted-foreground)]">
            <ShieldCheck aria-hidden className="mt-1 size-4 shrink-0 text-[color:var(--brand)]" />
            <span>
              {identity.principle}{" "}
              <a
                href="/security/#identity"
                className="whitespace-nowrap text-[color:var(--foreground)] underline underline-offset-4"
              >
                Sign-in options by plan
              </a>
            </span>
          </p>
        </Reveal>
      </SectionShell>

      {/* 3d — Fit. Buyer qualification, not self-deprecation: the institution
          that only needs attendance and fees should find out here. */}
      <SectionShell
        id="fit"
        eyebrow="Fit"
        title="Who SquareCampus is priced for, and who it is not."
        body={pricingAvailability.positioning}
      >
        <Reveal className="grid gap-4 lg:grid-cols-2">
          <div className="surface-panel rounded-[var(--radius-panel)] p-6 sm:p-8">
            <Eyebrow>Best suited to</Eyebrow>
            <ul className="mt-5">
              {fit.bestFor.map((item) => (
                <li
                  key={item}
                  className="type-support flex gap-3 border-t border-[color:var(--line)] py-3.5 first:border-t-0 first:pt-0"
                >
                  <Check aria-hidden className="mt-1 size-3.5 shrink-0 text-[color:var(--teal)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-quiet rounded-[var(--radius-panel)] p-6 sm:p-8">
            <Eyebrow>SquareCampus may not be the right fit if</Eyebrow>
            <ul className="mt-5">
              {fit.notRightFitIf.map((item) => (
                <li
                  key={item}
                  className="type-support flex gap-3 border-t border-[color:var(--line)] py-3.5 first:border-t-0 first:pt-0"
                >
                  <Minus
                    aria-hidden
                    className="mt-1 size-3.5 shrink-0 text-[color:var(--muted-foreground)]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </SectionShell>

      {/* 4 — Why volume-based pricing */}
      <SectionShell
        id="volume"
        eyebrow="Volume-based pricing"
        title="The marginal rate reduces as enrolment grows."
        body="Student volume sets platform scale, and larger volumes use the shared platform foundation more efficiently. The commercial model reflects those economies rather than imposing a flat rate for every institution."
      >
        <Reveal>
          <VolumeRationale />
        </Reveal>
      </SectionShell>

      {/* 5 — What shapes the proposal */}
      <SectionShell
        id="proposal"
        eyebrow="What shapes the proposal"
        title="The inputs we establish during institutional discovery."
        body="A proposal is only useful if it reflects the institution as it actually operates. These are the dimensions mapped before commercial terms are issued."
      >
        <Reveal staggerChildren className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {proposalInputs.map((input) => (
            <div
              key={input.label}
              data-reveal-item
              className="surface-quiet rounded-[var(--radius-chip)] px-5 py-5"
            >
              <h3 className="text-sm font-medium text-[color:var(--foreground)]">{input.label}</h3>
              <p className="type-support mt-2">{input.detail}</p>
            </div>
          ))}
        </Reveal>

        <Reveal delay={80}>
          <div className="surface-panel mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[var(--radius-panel)] px-6 py-5">
            <FileText aria-hidden className="size-5 shrink-0 text-[color:var(--brand)]" />
            <p className="text-sm leading-6 text-[color:var(--foreground)]">{DISCOVERY_NOTE}</p>
            <ButtonLink
              href={siteCtas.proposalHref}
              label={ctaLabels.proposal}
              variant="link"
              className="ml-auto"
            />
          </div>
        </Reveal>
      </SectionShell>

      {/* 6 — What is priced separately */}
      <SectionShell
        id="scoped-separately"
        eyebrow="Included versus separately scoped"
        title="No hidden subsidies. No surprise implementation bill."
        body="The licence already covers your plan, the apps, self-serve reports, implementation and support, a monthly usage allowance and, from Pro, data migration. Anything else is optional and priced in the proposal before you sign."
      >
        <Reveal>
          <ScopedCostGrid />
        </Reveal>
      </SectionShell>

      <SectionShell
        id="pilot"
        eyebrow="Three commercial paths"
        title="Choose the engagement that fits your institution."
        body={launchPilot.separation}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {commercialProgrammes.map((programme) => (
            <article
              key={programme.name}
              className="surface-panel rounded-[var(--radius-panel)] p-6"
            >
              <h3 className="type-card-title">{programme.name}</h3>
              <p className="type-support mt-4">{programme.body}</p>
              <ButtonLink
                href={programme.href}
                label={programme.cta}
                variant="link"
                className="mt-4"
              />
            </article>
          ))}
        </div>
        <div className="surface-panel-strong mt-6 rounded-[var(--radius-panel-lg)] p-6 sm:p-8">
          <OperationalBadge tone="brand" icon={CalendarRange}>
            90 days
          </OperationalBadge>
          <h3 className="type-section-title mt-5">{launchPilot.name}</h3>
          {[
            launchPilot.summary,
            launchPilot.eligibility,
            launchPilot.geography,
            launchPilot.scope,
            launchPilot.boundaries,
            launchPilot.pricing,
          ].map((fact) => (
            <p key={fact} className="type-support mt-4">
              {fact}
            </p>
          ))}
          <ButtonLink
            href={launchPilot.enquiryHref}
            label="Request launch-pilot review"
            variant="cta"
            className="mt-6"
          />
          <p className="type-support mt-6">{foundingProgramme.pilot.paidNote}</p>
          <p className="type-support mt-3">
            Founding pilots run for {foundingProgramme.pilot.window}, with the choice to convert,
            extend or stop.
          </p>
        </div>
      </SectionShell>

      <SectionShell
        id="baseline"
        eyebrow="Common foundations"
        title="Security and data ownership apply to every plan."
      >
        <p className="type-support">{securityBaseline}</p>
        <p className="type-support mt-4">{dataPortability}</p>
      </SectionShell>

      {/* 8 — Procurement FAQ */}
      <SectionShell
        id="procurement-faq"
        eyebrow="Procurement questions"
        title="The commercial questions institutions ask before signing."
        body="Answers here describe how the model works. The signed order form governs the specific terms for your institution."
      >
        <Reveal>
          <DetailsFaq items={pricingFaqs} />
        </Reveal>
      </SectionShell>

      <SectionShell id="request-proposal" className="pb-22">
        <FeaturePanel
          tone="strong"
          className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <Eyebrow>Next step</Eyebrow>
            <h2 className="type-card-title mt-3">Talk through your institution's requirements.</h2>
            <p className="type-support mt-3">
              Bring your campus structure, workflows and governance needs. Commercial terms follow a
              written proposal.
            </p>
          </div>
          <ButtonLink
            href={siteCtas.proposalHref}
            label="Contact the team"
            variant="cta"
            className="shrink-0"
          />
        </FeaturePanel>
      </SectionShell>
    </main>
  );
}
