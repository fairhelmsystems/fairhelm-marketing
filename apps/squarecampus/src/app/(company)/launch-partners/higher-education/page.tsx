import { Check, Minus } from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { LaunchPilotNote } from "@/components/site/launch-pilot-note";
import {
  CTAGroup,
  Eyebrow,
  FeaturePanel,
  OperationalBadge,
  TrustNote,
} from "@fairhelm/ui/components/marketing";
import { PageSchema } from "@/components/site/page-schema";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import {
  FOUNDING_PARTNER_DEMO_HREF,
  foundingPartners,
  higherEducationPartners as he,
} from "@/content/founding-partners";
import { siteCtas } from "@/content/site-content";
import { createPageMetadata } from "@/lib/seo";

/**
 * /launch-partners/higher-education/
 *
 * A lane, not a repositioning. The homepage and the primary navigation stay
 * school-led; this route exists so a private university or a multi-school
 * group can be approached at the workflow level without being sold school
 * copy. It is reached contextually from /launch-partners/ and from the
 * sitemap — deliberately not from the global navigation, which is already at
 * the width it can carry.
 *
 * No motion asset: the page's argument is textual, and the one composition
 * this programme has (`founding-partner-path`) is already carried by the
 * parent page it links back to. Adding a second copy of it here would be
 * decoration paid for in bytes.
 */
export const metadata: Metadata = createPageMetadata({
  title: "Founding Partners for Higher Education",
  description:
    "A governed operating layer that runs alongside a university's existing ERP, LMS, payment and identity systems. One bounded workflow, a written baseline and a 60–90 day evidence model.",
  path: "/launch-partners/higher-education",
  ogTitle: "Founding Institutional Partners for Higher Education | SquareCampus",
  ogDescription:
    "For private universities and multi-school groups: admissions-to-enrolment exceptions, payment-to-ERP reconciliation and interdepartmental approvals, governed across the systems you already run.",
});

export default function HigherEducationPartnersPage() {
  return (
    <main tabIndex={-1} id="main-content">
      <PageSchema
        name="Founding Institutional Partners for Higher Education | SquareCampus"
        description="The SquareCampus Founding Institutional Partner lane for private universities and multi-school higher-education groups: a governed operating layer over the institution's existing ERP, LMS, payment and identity systems, piloted against one bounded workflow over 60 to 90 days."
        path="/launch-partners/higher-education"
        parents={[{ name: "Founding Institutional Partners", path: "/launch-partners" }]}
        label="Higher education"
      />

      {/* 1 — Hero */}
      <SectionShell className="pt-12 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
          <Reveal immediate className="space-y-6">
            <Eyebrow>{he.hero.eyebrow}</Eyebrow>
            <h1 className="type-display">{he.hero.heading}</h1>
            <p className="type-body measure text-[color:var(--muted-foreground)]">{he.hero.body}</p>
            <CTAGroup>
              <ButtonLink
                href={FOUNDING_PARTNER_DEMO_HREF}
                label="Request a partnership diagnosis"
                variant="cta"
                className="w-full justify-center sm:w-auto"
              />
              <ButtonLink
                href="#pilot-wedges"
                label="See where a pilot starts"
                variant="secondary"
                className="w-full justify-center sm:w-auto"
              />
            </CTAGroup>
            <TrustNote>{he.hero.trustLine}</TrustNote>
          </Reveal>

          <Reveal immediate delay={120} className="lg:pt-2">
            <FeaturePanel tone="strong">
              <Eyebrow>{he.evidence.eyebrow}</Eyebrow>
              <p className="font-display mt-4 text-2xl leading-[1.25] tracking-[-0.04em] sm:text-[1.75rem]">
                One bounded workflow, a written baseline, and a decision taken against evidence.
              </p>
              <dl className="mt-7 border-t border-[color:var(--line)]">
                {[
                  { term: "Scope", detail: "One workflow or one non-clinical department" },
                  { term: "Window", detail: "60–90 days" },
                  { term: "Sponsor", detail: "One named executive owner" },
                  { term: "Close", detail: "Convert, extend or stop" },
                ].map((row) => (
                  <div
                    key={row.term}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[color:var(--line)] py-3.5"
                  >
                    <dt className="eyebrow">{row.term}</dt>
                    <dd className="text-sm leading-6 text-[color:var(--foreground)]">
                      {row.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </FeaturePanel>
          </Reveal>
        </div>
      </SectionShell>

      {/* 2 — What this is and is not. Placed second on purpose: a university
          reading "operating system" has every reason to assume an ERP claim,
          and the page is not worth reading further until that is settled. */}
      <SectionShell
        id="what-this-is"
        eyebrow={he.honesty.eyebrow}
        title={he.honesty.heading}
        body={he.honesty.body}
      >
        <Reveal className="grid gap-4 lg:grid-cols-2">
          <div className="surface-quiet rounded-[var(--radius-panel)] p-6 sm:p-8">
            <Eyebrow>What it is not</Eyebrow>
            <ul className="mt-5">
              {he.honesty.isNot.map((item) => (
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
          <div className="surface-panel rounded-[var(--radius-panel)] p-6 sm:p-8">
            <Eyebrow>What it is</Eyebrow>
            <ul className="mt-5">
              {he.honesty.is.map((item) => (
                <li
                  key={item}
                  className="type-support flex gap-3 border-t border-[color:var(--line)] py-3.5 first:border-t-0 first:pt-0"
                >
                  <Check aria-hidden className="mt-1 size-3.5 shrink-0 text-[color:var(--brand)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </SectionShell>

      {/* 3 — Pilot wedges */}
      <SectionShell
        id="pilot-wedges"
        className="scroll-mt-24"
        eyebrow={he.wedges.eyebrow}
        title={he.wedges.heading}
        body={he.wedges.body}
      >
        <Reveal staggerChildren className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {he.wedges.items.map((item) => (
            <article
              key={item.number}
              data-reveal-item
              className="surface-panel flex flex-col rounded-[var(--radius-panel)] p-6 sm:p-7"
            >
              <p className="eyebrow">{item.number}</p>
              <h3 className="type-card-title mt-4">{item.title}</h3>
              <p className="type-support mt-3">{item.body}</p>
            </article>
          ))}
        </Reveal>

        <Reveal delay={80}>
          <div className="surface-quiet mt-5 rounded-[var(--radius-panel)] p-6 sm:p-7">
            <Eyebrow>Explicitly out of scope</Eyebrow>
            <p className="type-support measure mt-4">{he.wedges.exclusion}</p>
          </div>
        </Reveal>
      </SectionShell>

      {/* 4 — Coexistence */}
      <SectionShell
        id="how-it-sits"
        eyebrow={he.coexistence.eyebrow}
        title={he.coexistence.heading}
        body={he.coexistence.body}
      >
        <Reveal>
          <div className="surface-panel-strong rounded-[var(--radius-panel-lg)] p-6 sm:p-8 lg:p-10">
            <ul className="grid gap-3 sm:grid-cols-2">
              {he.coexistence.layers.map((layer) => (
                <li key={layer.title} className="surface-quiet rounded-[var(--radius-chip)] p-5">
                  <h3 className="type-card-title">{layer.title}</h3>
                  <p className="type-support mt-2">{layer.body}</p>
                </li>
              ))}
            </ul>
            <TrustNote className="mt-7">
              A later rollout may replace selected fragmented tools, when and if the institution
              decides to. That is a separate decision, taken after the evidence exists — never a
              precondition of the pilot.
            </TrustNote>
          </div>
        </Reveal>
      </SectionShell>

      {/* 5 — The evidence model */}
      <SectionShell
        id="evidence-model"
        eyebrow={he.evidence.eyebrow}
        title={he.evidence.heading}
        body="The same sequencing, migration discipline and parallel validation described on the rollout page, scoped to one university workflow."
      >
        <Reveal staggerChildren className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {he.evidence.steps.map((step) => (
            <article
              key={step.number}
              data-reveal-item
              className="surface-panel rounded-[var(--radius-panel)] p-6"
            >
              <p className="eyebrow">{step.number}</p>
              <h3 className="type-card-title mt-4">{step.title}</h3>
              <p className="type-support mt-3">{step.body}</p>
            </article>
          ))}
        </Reveal>

        <Reveal delay={80}>
          <div className="surface-panel mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-[var(--radius-panel)] px-6 py-5">
            <OperationalBadge tone="brand">Paid, scoped engagement</OperationalBadge>
            <p className="type-support flex-1">
              {he.evidence.paidNote}{" "}
              <a
                href={`${siteCtas.pricingHref}/`}
                className="underline underline-offset-2 hover:text-[color:var(--foreground)]"
              >
                How the licence is composed
              </a>{" "}
              and{" "}
              <a
                href={`${siteCtas.rolloutHref}/`}
                className="underline underline-offset-2 hover:text-[color:var(--foreground)]"
              >
                how a rollout runs
              </a>
              .
            </p>
          </div>
        </Reveal>
      </SectionShell>

      {/* 6 — Leadership questions */}
      <SectionShell
        id="leadership"
        eyebrow={he.leadership.eyebrow}
        title={he.leadership.heading}
        body="A pilot at a university needs several people to agree. They are not agreeing to the same thing."
      >
        <Reveal staggerChildren className="grid gap-4 lg:grid-cols-2">
          {he.leadership.items.map((item) => (
            <article
              key={item.role}
              data-reveal-item
              className="surface-panel rounded-[var(--radius-panel)] p-6 sm:p-7"
            >
              <p className="eyebrow">{item.role}</p>
              <h3 className="type-card-title mt-4">{item.question}</h3>
              <p className="type-support mt-3">{item.answer}</p>
            </article>
          ))}
        </Reveal>
      </SectionShell>

      {/* 6b — The one university position. Stated, not implied: the same
          facts as /launch-partners/ and the FAQ, from content/commercial.ts. */}
      <SectionShell
        id="position"
        eyebrow={he.position.eyebrow}
        title={he.position.heading}
        body={he.position.body}
      >
        <Reveal>
          <dl className="grid gap-4 sm:grid-cols-2">
            {he.position.entitlements.map((entitlement) => (
              <div
                key={entitlement.title}
                className="surface-panel rounded-[var(--radius-panel)] p-6"
              >
                <dt className="text-sm font-medium text-[color:var(--foreground)]">
                  {entitlement.title}
                </dt>
                <dd className="type-support mt-2">{entitlement.body}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </SectionShell>

      {/* 7 — Final CTA */}
      <SectionShell className="pb-12 sm:pb-22">
        <Reveal className="surface-panel-strong rounded-[var(--radius-panel-lg)] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <Eyebrow>{he.finalCta.eyebrow}</Eyebrow>
              <h2 className="type-section-title mt-4">{he.finalCta.heading}</h2>
              <p className="type-body measure mt-4 text-[color:var(--muted-foreground)]">
                {he.finalCta.body}
              </p>
              <TrustNote className="mt-6">{he.finalCta.microcopy}</TrustNote>
            </div>
            <div className="grid gap-3">
              <ButtonLink
                href={FOUNDING_PARTNER_DEMO_HREF}
                label="Request a partnership diagnosis"
                variant="cta"
                className="justify-center"
              />
              <ButtonLink
                href={foundingPartners.href}
                label="The full founding partner programme"
                variant="secondary"
                className="justify-center"
              />
              <ButtonLink
                href={siteCtas.securityHref}
                label="Review the trust posture"
                variant="secondary"
                className="justify-center"
              />
            </div>
          </div>
        </Reveal>
      </SectionShell>
      <SectionShell>
        <LaunchPilotNote />
      </SectionShell>
    </main>
  );
}
