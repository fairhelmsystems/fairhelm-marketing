import { Check } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { DetailsFaq } from "@fairhelm/ui/components/details-faq";
import { FactTable } from "@/components/site/fact-table";
import { CTAGroup, Eyebrow, OperationalBadge } from "@fairhelm/ui/components/marketing";
import { MotionPoster } from "@/components/site/motion-poster";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { availability, product } from "@/content/commercial";
import { motionAssets } from "@/content/motion-assets";
import { CANONICAL_PROMISE, RECORD_VS_DECISION } from "@/content/operational-pains";
import { ctaLabels, siteCtas } from "@/content/site-content";
import {
  AEGIS_DEFINITION,
  aegisBoundaries,
  CANONICAL_DEFINITION,
  dashboardVsDecisionLayer,
  entityFaqs,
  glossary,
  multiCampusContrast,
} from "@/content/what-is-squarecampus";
import { workflows } from "@/content/workflows";

export default function WhatIsSquareCampusPage() {
  return (
    <main tabIndex={-1} id="main-content">
      {/* Canonical definition */}
      <SectionShell className="pt-12 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
          <Reveal immediate className="space-y-6">
            <Eyebrow>Category and definition</Eyebrow>
            <h1 className="type-display">What is SquareCampus?</h1>
            <p className="type-body measure text-[color:var(--muted-foreground)]">
              {CANONICAL_DEFINITION}
            </p>
            <CTAGroup>
              <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} variant="cta" />
              <ButtonLink
                href={siteCtas.platformHref}
                label="See the platform"
                variant="secondary"
              />
            </CTAGroup>
          </Reveal>

          <Reveal immediate delay={120}>
            <div className="surface-panel-strong rounded-[var(--radius-panel-lg)] p-6 sm:p-8">
              <Eyebrow>The distinction that matters</Eyebrow>
              {/* A pull-quote, not a section heading: the sentence is long, and
                  the heading steps swamp the panel at laptop widths. */}
              <p className="type-quote mt-4">{RECORD_VS_DECISION}</p>
              <p className="type-support mt-5 border-t border-[color:var(--line)] pt-5">
                {CANONICAL_PROMISE}
              </p>
            </div>
          </Reveal>
        </div>
      </SectionShell>

      {/* At a glance (audit SC-012): the four introductory questions answered
          in one place, each linking to the page that goes deeper, instead of
          repeating the Platform page's architecture here. */}
      <SectionShell
        id="at-a-glance"
        eyebrow="At a glance"
        title="What it is, who it serves, what it includes."
      >
        <Reveal>
          <dl className="surface-panel divide-y divide-[color:var(--line)] rounded-[var(--radius-panel-lg)] px-6 sm:px-8">
            <div className="grid gap-2 py-5 md:grid-cols-[14rem_1fr] md:gap-8">
              <dt className="type-card-title">What it is</dt>
              <dd className="type-support">{product.categoryRelationship}</dd>
            </div>
            <div className="grid gap-2 py-5 md:grid-cols-[14rem_1fr] md:gap-8">
              <dt className="type-card-title">Who it serves</dt>
              <dd className="type-support">
                <ul className="grid gap-1.5">
                  {product.audiences.map((audience) => (
                    <li key={audience}>{audience}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="grid gap-2 py-5 md:grid-cols-[14rem_1fr] md:gap-8">
              <dt className="type-card-title">What it includes</dt>
              <dd className="type-support">
                <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {workflows.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className="text-[color:var(--foreground)] underline underline-offset-4"
                      >
                        {item.linkLabel}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/aegis/"
                      className="text-[color:var(--foreground)] underline underline-offset-4"
                    >
                      AEGIS, the read-only intelligence layer
                    </Link>
                  </li>
                </ul>
                <p className="mt-3">{availability.short}</p>
              </dd>
            </div>
            <div className="grid gap-2 py-5 md:grid-cols-[14rem_1fr] md:gap-8">
              <dt className="type-card-title">How it relates to ERP</dt>
              <dd className="type-support">
                It covers the record-keeping and workflows expected from school ERP software; the
                difference is that ownership, approvals and audit history sit on the same record.{" "}
                <Link
                  href="/school-erp-software/"
                  className="text-[color:var(--foreground)] underline underline-offset-4"
                >
                  School ERP software, explained
                </Link>
              </dd>
            </div>
            <div className="grid gap-2 py-5 md:grid-cols-[14rem_1fr] md:gap-8">
              <dt className="type-card-title">How it is organised</dt>
              <dd className="type-support">
                Four layers — record, workflow, governance and intelligence.{" "}
                <Link
                  href="/platform/#layers"
                  className="text-[color:var(--foreground)] underline underline-offset-4"
                >
                  See the platform
                </Link>
              </dd>
            </div>
          </dl>
        </Reveal>
      </SectionShell>

      {/* Dashboard vs decision layer */}
      <SectionShell
        id="decision-layer"
        eyebrow="Dashboard versus decision layer"
        title="A bar chart shows a condition. A decision layer explains what to do about it."
        body="This is the difference between reporting that describes the institution and an operating layer that moves it."
      >
        {/* Tier 2: still only. The five stages are the literal answer to the
            heading above, so the alt text states them rather than decorating. */}
        <MotionPoster
          asset={motionAssets["operating-signal-to-action"]}
          className="mx-auto mb-5 w-full max-w-4xl"
          alt="A record becomes an exception, the exception is routed to a named owner, the owner acts with a recorded reason, and the action is committed to an append-only audit timeline."
        />

        <Reveal className="grid gap-4 lg:grid-cols-2">
          <div className="surface-quiet rounded-[var(--radius-panel)] p-6 sm:p-7">
            <Eyebrow>A dashboard tells you</Eyebrow>
            <ul className="mt-5 space-y-3">
              {dashboardVsDecisionLayer.dashboard.map((item) => (
                <li
                  key={item}
                  className="type-support border-t border-[color:var(--line)] pt-3 first:border-t-0 first:pt-0"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="surface-panel-strong rounded-[var(--radius-panel)] p-6 sm:p-7">
            <Eyebrow>A decision layer tells you</Eyebrow>
            <ul className="mt-5 space-y-3">
              {dashboardVsDecisionLayer.decisionLayer.map((item) => (
                <li key={item} className="type-support flex gap-2.5">
                  <Check aria-hidden className="mt-1 size-3.5 shrink-0 text-[color:var(--brand)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="surface-panel mt-5 rounded-[var(--radius-panel)] p-6 sm:p-7">
            <div className="flex flex-wrap items-center gap-3">
              <OperationalBadge tone="brand">AEGIS</OperationalBadge>
              <p className="type-support">{AEGIS_DEFINITION}</p>
            </div>
            <ul className="mt-5 grid gap-2.5 border-t border-[color:var(--line)] pt-5 sm:grid-cols-2">
              {aegisBoundaries.map((item) => (
                <li key={item} className="type-support flex gap-2.5">
                  <Check aria-hidden className="mt-1 size-3.5 shrink-0 text-[color:var(--brand)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </SectionShell>

      {/* Glossary. "School OS" has to mean something checkable, or it is a
          synonym for ERP. Each term is also emitted as DefinedTerm JSON-LD. */}
      <SectionShell
        id="glossary"
        eyebrow="What the words mean here"
        title="School OS, governance, exception ownership, accountability."
        body="These terms are used across the site with specific meanings. This is what each one commits SquareCampus to."
      >
        <Reveal>
          <dl className="grid gap-4 md:grid-cols-2">
            {glossary.map((entry) => (
              <div key={entry.term} className="surface-panel rounded-[var(--radius-panel)] p-6">
                <dt className="type-card-title">{entry.term}</dt>
                <dd className="type-support mt-3">{entry.definition}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={80} className="mt-8">
          <Eyebrow>Multi-campus governance versus supporting multiple campuses</Eyebrow>
          <FactTable
            className="mt-4"
            caption="How multi-campus governance differs from software that merely supports several campuses."
            columns={[
              { key: "supports", label: "Supports multiple campuses" },
              { key: "governs", label: "Multi-campus governance" },
            ]}
            rows={multiCampusContrast.map((row) => ({
              label: row.dimension,
              values: [row.supports, row.governs],
            }))}
          />
        </Reveal>
      </SectionShell>

      {/* Entity FAQ — includes the canonical ERP answer */}
      <SectionShell
        id="definition-faq"
        eyebrow="Direct answers"
        title="The questions people ask before they know what to call it."
      >
        <Reveal>
          <DetailsFaq items={entityFaqs} />
        </Reveal>
      </SectionShell>

      <SectionShell className="pb-22">
        <Reveal className="surface-panel-strong rounded-[var(--radius-panel-lg)] p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <Eyebrow>Next step</Eyebrow>
              <h2 className="type-section-title mt-4">
                The fastest way to understand a School OS is to point it at a real bottleneck.
              </h2>
              <p className="type-body measure mt-4 text-[color:var(--muted-foreground)]">
                Bring one cycle that consistently costs your institution time &mdash; collections,
                results, attendance follow-up or parent escalations &mdash; and we will map what a
                governed version of it looks like.
              </p>
            </div>
            <div className="grid gap-3">
              <ButtonLink
                href={siteCtas.demoHref}
                label={ctaLabels.demo}
                variant="cta"
                className="justify-center"
              />
              <ButtonLink
                href={siteCtas.pricingHref}
                label="See the commercial model"
                variant="secondary"
                className="justify-center"
              />
            </div>
          </div>
        </Reveal>
      </SectionShell>
    </main>
  );
}
