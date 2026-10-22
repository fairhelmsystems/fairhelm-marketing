import { Check, Minus } from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { ContactForm } from "@/components/site/contact-form";
import { LaunchPilotNote } from "@/components/site/launch-pilot-note";
import {
  CTAGroup,
  Eyebrow,
  FeaturePanel,
  OperationalBadge,
  TrustNote,
} from "@fairhelm/ui/components/marketing";
import { MotionFigure } from "@/components/site/motion-figure";
import { PageSchema } from "@/components/site/page-schema";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { FORM_ANCHORS, formCopy, foundingPartnerForm } from "@/content/demo-intents";
import {
  FOUNDING_PARTNER_DEMO_HREF,
  foundingPartners,
  higherEducationPartners,
} from "@/content/founding-partners";
import { motionAssets } from "@/content/motion-assets";
import { ctaLabels, siteCtas } from "@/content/site-content";
import { createPageMetadata } from "@/lib/seo";

/**
 * Metadata and structured data live on the page, not in a `layout.tsx`.
 *
 * A layout wraps every route beneath it, so the WebPage/BreadcrumbList it
 * emitted would also have been served on /launch-partners/higher-education/ —
 * describing the parent page, at the child's URL. Moving both here keeps each
 * route's identity to itself. The rendered output for this page is unchanged.
 */
export const metadata: Metadata = createPageMetadata({
  title: "Founding Institutional Partners",
  description:
    "A measured, founder-led programme for schools, school groups and education trusts that want to shape SquareCampus against a real operating bottleneck.",
  path: "/launch-partners",
  ogImage: "https://squarecampus.com/og/launch-partners.png",
  ogTitle: "Founding Institutional Partners | SquareCampus",
  ogDescription:
    "A founder-led 60–90 day pilot against one measurable operating bottleneck, under a separately negotiated founding agreement, distinct from the selected complimentary launch pilot.",
});

const { page } = foundingPartners;

export default function LaunchPartnersPage() {
  return (
    <main tabIndex={-1} id="main-content">
      {/*
        WebPage + BreadcrumbList only, alongside the Organization / WebSite /
        SoftwareApplication graph the root layout already emits.

        Deliberately absent:
        - Product/Offer — the page publishes no price and makes no offer of sale.
        - Event — the programme is not an event with a date and a place.
        - VideoObject — the composition on this page is a silent supplementary
          diagram, not a video watch page. Marking it up would claim
          video-result eligibility for content that is not what a viewer would
          be sent to watch.
      */}
      <PageSchema
        name="Founding Institutional Partners | SquareCampus"
        description="The SquareCampus Founding Institutional Partner programme: a founder-led 60–90 day pilot run against one measurable operating bottleneck, with preferential founding terms and structured roadmap participation."
        path="/launch-partners"
      />
      {/* 1 — Hero. `immediate` keeps the H1 painted on the first frame instead
          of waiting for hydration to remove the reveal's opacity: 0. */}
      <SectionShell className="pt-12 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
          <Reveal immediate className="space-y-6">
            <Eyebrow>{page.hero.eyebrow}</Eyebrow>
            <h1 className="type-display">{page.hero.heading}</h1>
            <p className="type-body measure text-[color:var(--muted-foreground)]">
              {page.hero.body}
            </p>
            <CTAGroup>
              <ButtonLink
                href={FOUNDING_PARTNER_DEMO_HREF}
                label={ctaLabels.foundingPartner}
                variant="cta"
                className="w-full justify-center sm:w-auto"
              />
              <ButtonLink
                href="#partnership-path"
                label="See the 60–90 day pilot"
                variant="secondary"
                className="w-full justify-center sm:w-auto"
              />
            </CTAGroup>
            <TrustNote>{page.hero.trustLine}</TrustNote>
          </Reveal>

          <Reveal immediate delay={120} className="lg:pt-2">
            <FeaturePanel tone="strong">
              <Eyebrow>What a founding pilot is</Eyebrow>
              <p className="font-display mt-4 text-2xl leading-[1.25] tracking-[-0.04em] sm:text-[1.75rem]">
                One measurable bottleneck, a written baseline, and a decision taken against
                evidence.
              </p>
              <dl className="mt-7 border-t border-[color:var(--line)]">
                {[
                  { term: "Positions", detail: "Two, ever: one school, one university" },
                  { term: "Window", detail: "60–90 days" },
                  { term: "Scope", detail: "One campus or one workflow bundle" },
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

      {/* 1b — The programme, precisely. Positions, nature, entitlements and
          boundaries come from content/commercial.ts, so this block, the
          homepage section, the FAQ and llms.txt cannot describe different
          programmes. */}
      <SectionShell
        id="programme"
        className="scroll-mt-24"
        eyebrow={page.programme.eyebrow}
        title={page.programme.heading}
        body={page.programme.nature}
      >
        <Reveal className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-panel-strong rounded-[var(--radius-panel-lg)] p-6 sm:p-8">
            <Eyebrow>The two positions</Eyebrow>
            <ol className="mt-5">
              {page.programme.positions.map((position, index) => (
                <li
                  key={position}
                  className="flex gap-4 border-t border-[color:var(--line)] py-4 first:border-t-0 first:pt-0"
                >
                  <span className="eyebrow mt-1 shrink-0 text-[color:var(--brand)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="type-body text-[color:var(--foreground)]">{position}</span>
                </li>
              ))}
            </ol>
            <TrustNote className="mt-6">{page.programme.closure}</TrustNote>
          </div>

          <div className="surface-panel rounded-[var(--radius-panel-lg)] p-6 sm:p-8">
            <Eyebrow>What a Founding Partner receives, under the executed agreement</Eyebrow>
            <dl className="mt-5">
              {page.programme.entitlements.map((entitlement) => (
                <div
                  key={entitlement.title}
                  className="border-t border-[color:var(--line)] py-4 first:border-t-0 first:pt-0"
                >
                  <dt className="text-sm font-medium text-[color:var(--foreground)]">
                    {entitlement.title}
                  </dt>
                  <dd className="type-support mt-1.5">{entitlement.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="surface-quiet mt-4 rounded-[var(--radius-panel)] p-6 sm:p-8">
            <Eyebrow>What founding status is not</Eyebrow>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {page.programme.boundaries.map((boundary) => (
                <li key={boundary} className="type-support flex gap-3">
                  <Minus
                    aria-hidden
                    className="mt-1 size-3.5 shrink-0 text-[color:var(--muted-foreground)]"
                  />
                  <span>{boundary}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </SectionShell>

      {/* 2 — What founding status changes */}
      <SectionShell
        id="what-changes"
        eyebrow="What founding status changes"
        title={page.pillarsHeading}
        body="Three pillars, not a wall of feature cards. Each one is bounded by the executed agreement."
      >
        <Reveal staggerChildren className="grid gap-4 lg:grid-cols-3">
          {page.pillars.map((pillar) => (
            <article
              key={pillar.number}
              data-reveal-item
              className="surface-panel flex flex-col rounded-[var(--radius-panel)] p-6 sm:p-7"
            >
              <p className="eyebrow">{pillar.number}</p>
              <h3 className="type-card-title mt-4">{pillar.title}</h3>
              <p className="type-support mt-3">{pillar.summary}</p>
              <ul className="mt-6 border-t border-[color:var(--line)]">
                {pillar.points.map((point) => (
                  <li
                    key={point}
                    className="type-support flex gap-3 border-b border-[color:var(--line)] py-3"
                  >
                    <Check
                      aria-hidden
                      className="mt-1 size-3.5 shrink-0 text-[color:var(--brand)]"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </Reveal>
      </SectionShell>

      {/* 3 — Managed digital campus */}
      <SectionShell
        id="digital-campus"
        eyebrow={page.digitalCampus.eyebrow}
        title={page.digitalCampus.heading}
        body={page.digitalCampus.body}
      >
        <Reveal>
          <div className="surface-panel-strong rounded-[var(--radius-panel-lg)] p-6 sm:p-8 lg:p-10">
            {/* 8 capabilities: two columns divide evenly, three leave a ragged row. */}
            <ul className="grid gap-3 sm:grid-cols-2">
              {page.digitalCampus.capabilities.map((capability) => (
                <li
                  key={capability}
                  className="type-support surface-quiet rounded-[var(--radius-chip)] px-5 py-4"
                >
                  {capability}
                </li>
              ))}
            </ul>
            <TrustNote className="mt-7">{page.digitalCampus.scopeNote}</TrustNote>
          </div>
        </Reveal>
      </SectionShell>

      {/* 4 — Partnership path. The page's one motion asset sits here, beside the
          steps it explains, and is below the fold on every breakpoint. */}
      <SectionShell
        id="partnership-path"
        className="scroll-mt-24"
        eyebrow={page.path.eyebrow}
        title={page.path.heading}
        body="Four stages. Each one has to produce something the next stage can be judged against."
      >
        <Reveal>
          <MotionFigure
            asset={motionAssets["founding-partner-path"]}
            redundant
            className="mx-auto mb-5 w-full max-w-4xl"
          />
        </Reveal>

        <Reveal staggerChildren className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {page.path.steps.map((step) => (
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
            <OperationalBadge tone="brand">60–90 day pilot</OperationalBadge>
            <p className="type-support flex-1">
              The same sequencing, migration discipline and parallel validation described on the{" "}
              <a
                href="/rollout/"
                className="underline underline-offset-2 hover:text-[color:var(--foreground)]"
              >
                rollout page
              </a>
              , run with founder-level involvement.
            </p>
          </div>
        </Reveal>

        {/* The programme already said it is not a free trial. It never said
            what it is. Stated here, next to the path it applies to, rather
            than left for the proposal call to reveal. */}
        <Reveal delay={120}>
          <div className="surface-panel mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-[var(--radius-panel)] px-6 py-5">
            <OperationalBadge tone="brand">Paid, scoped engagement</OperationalBadge>
            <p className="type-support flex-1">{page.path.paidNote}</p>
          </div>
        </Reveal>
      </SectionShell>

      {/* Higher-education lane. A contextual route, not a navigation item: the
          site stays school-led, and a university reading this page should be
          able to find the version written for it without the global menu
          growing a second column. */}
      <SectionShell id="higher-education" className="pt-0 sm:pt-0 lg:pt-0">
        <Reveal className="surface-quiet rounded-[var(--radius-panel-lg)] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-center">
            <div>
              <Eyebrow>{page.higherEducationLink.eyebrow}</Eyebrow>
              <h2 className="type-section-title mt-4">{page.higherEducationLink.heading}</h2>
              <p className="type-body measure mt-4 text-[color:var(--muted-foreground)]">
                {page.higherEducationLink.body}
              </p>
            </div>
            <div className="grid gap-3">
              <ButtonLink
                href={higherEducationPartners.href}
                label={page.higherEducationLink.linkLabel}
                variant="secondary"
                className="justify-center"
              />
            </div>
          </div>
        </Reveal>
      </SectionShell>

      {/* 5 — Who should apply */}
      <SectionShell
        id="who-should-apply"
        eyebrow={page.fit.eyebrow}
        title={page.fit.heading}
        body="Founding partnership asks for something from the institution as well. These are the signals that a pilot will produce usable evidence."
      >
        <Reveal className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="surface-panel rounded-[var(--radius-panel)] p-6 sm:p-8">
            <Eyebrow>Good-fit signals</Eyebrow>
            <ul className="mt-5">
              {page.fit.signals.map((signal) => (
                <li
                  key={signal}
                  className="type-support flex gap-3 border-t border-[color:var(--line)] py-3.5 first:border-t-0 first:pt-0"
                >
                  <Check aria-hidden className="mt-1 size-3.5 shrink-0 text-[color:var(--teal)]" />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface-quiet rounded-[var(--radius-panel)] p-6 sm:p-8">
            <Eyebrow>What founding status is not</Eyebrow>
            <p className="type-body mt-5 text-[color:var(--muted-foreground)]">
              {page.fit.boundary}
            </p>
            <div className="mt-7 grid gap-3">
              <ButtonLink
                href={siteCtas.pricingHref}
                label="How the licence is composed"
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

      {/* 6 — Objection handling. The single biggest conversion obstacle for a
          young company is not interest, it is the board meeting afterwards.
          Answering the hard questions in public — including "why would we
          depend on you" — is worth more than another benefit card, and it
          costs nothing in claims because every answer points at something the
          site already substantiates. */}
      <SectionShell
        id="before-you-commit"
        className="scroll-mt-24"
        eyebrow={page.objections.eyebrow}
        title={page.objections.heading}
        body={page.objections.body}
      >
        <Reveal staggerChildren className="grid gap-4 lg:grid-cols-2">
          {page.objections.items.map((item) => (
            <article
              key={item.question}
              data-reveal-item
              className="surface-panel rounded-[var(--radius-panel)] p-6 sm:p-7"
            >
              <h3 className="type-card-title">{item.question}</h3>
              <p className="type-support mt-3">{item.answer}</p>
            </article>
          ))}
        </Reveal>
      </SectionShell>

      {/* 7 — The founding-partner diagnosis request. The form lives here, on
          the programme's own page, rather than as a variant of /demo/ (audit
          SC-026): this journey has its own heading, copy and routing. */}
      <SectionShell id={FORM_ANCHORS.foundingPartner} className="scroll-mt-28 pb-12 sm:pb-22">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal className="space-y-6">
            <Eyebrow>{page.finalCta.eyebrow}</Eyebrow>
            <h2 className="type-section-title">{page.finalCta.heading}</h2>
            <p className="type-body measure text-[color:var(--muted-foreground)]">
              {page.finalCta.body}
            </p>
            <div className="grid gap-3">
              {foundingPartnerForm.points.map((item) => (
                <div
                  key={item}
                  className="surface-panel rounded-[1.35rem] px-4 py-3 text-sm leading-6 text-[color:var(--muted-foreground)]"
                >
                  {item}
                </div>
              ))}
            </div>
            <TrustNote>{page.finalCta.microcopy}</TrustNote>
            <ButtonLink
              href={siteCtas.rolloutHref}
              label="Review rollout and trust"
              variant="secondary"
            />
          </Reveal>
          <Reveal delay={120} className="surface-panel-strong rounded-[2rem] p-6 lg:p-8">
            <Eyebrow>{formCopy["founding-partner"].eyebrow}</Eyebrow>
            <h3 className="mt-4 font-display text-3xl tracking-[-0.05em]">
              {formCopy["founding-partner"].heading}
            </h3>
            <p className="mt-3 max-w-xl text-base leading-7 text-[color:var(--muted-foreground)]">
              {formCopy["founding-partner"].body}
            </p>
            <div className="mt-6">
              <ContactForm intent="founding-partner" />
            </div>
          </Reveal>
        </div>
      </SectionShell>
      <SectionShell>
        <LaunchPilotNote />
      </SectionShell>
    </main>
  );
}
