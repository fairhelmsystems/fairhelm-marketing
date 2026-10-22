import {
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  DatabaseZap,
  IndianRupee,
  LockKeyhole,
  Network,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { AegisConsoleVisual } from "@/components/site/aegis-console-visual";
import { CommandSurfaceVisual } from "@/components/site/command-surface-visual";
import { Container } from "@/components/site/container";
import { CtaBand } from "@/components/site/cta-band";
import { DataPipelineVisual } from "@/components/site/data-pipeline-visual";
import { FaqList } from "@/components/site/faq-list";
import { Hero } from "@/components/site/hero";
import { JsonLd } from "@/components/site/json-ld";
import { RelatedInsights } from "@/components/site/related-insights";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { SystemPanel } from "@/components/site/system-panel";
import { buttonVariants } from "@fairhelm/ui/components/button";
import { companyFaq } from "@/content/faq";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { faqSchema } from "@/lib/structured-data";
import { cn } from "@fairhelm/ui/lib/utils";

const homeTitle = "Fairhelm Systems | Software Product & Data Engineering Company, Bangalore";

export const metadata = {
  ...createPageMetadata({
    title: homeTitle,
    description:
      "Product-first technology company in Bangalore, India. Fairhelm Systems builds and operates SquareCampus, a School Operating System, and delivers governed data pipelines and operational dashboards.",
    path: "/",
  }),
  title: { absolute: homeTitle },
};

/** Company facts, stated once, machine-readable and visible. */
const facts = [
  {
    label: "Company",
    value: "Product-first technology company",
    detail: "Builds and operates its own software. Not an agency.",
  },
  {
    label: "Incorporated",
    value: siteConfig.incorporationDateDisplay,
    detail: `${siteConfig.address.locality}, ${siteConfig.address.region} · One Person Company`,
  },
  {
    label: "Flagship product",
    value: siteConfig.product.name,
    detail: `${siteConfig.product.category} · squarecampus.com`,
  },
  {
    label: "Engineering lanes",
    value: "Data pipelines · Dashboards",
    detail: "Selective, technically aligned work",
  },
] as const;

/** The operating problems Fairhelm exists for, each mapped to what it builds. */
const problems = [
  {
    index: "01",
    title: "Fragmented records",
    symptom:
      "Admissions, fees, attendance and parent communication live in different tools, each holding part of the truth.",
    cost: "Every report becomes a reconciliation exercise, and leadership sees the institution late.",
    response:
      "One governed system of record where ownership, approvals and audit sit on the same timeline.",
    lane: "SquareCampus",
    href: "/squarecampus/",
  },
  {
    index: "02",
    title: "Numbers nobody trusts",
    symptom:
      "Spreadsheets encode undocumented rules, source systems disagree, identifiers drift between exports.",
    cost: "Decisions wait for manual reconciliation. The first week of every cycle rebuilds a figure that should already exist.",
    response:
      "Production ETL/ELT with control totals, lineage, quality gates and an observable refresh.",
    lane: "Data engineering",
    href: "/services/data-engineering/",
  },
  {
    index: "03",
    title: "Reports instead of decisions",
    symptom:
      "Dashboards show charts without metric definitions, owners or a route from signal to action.",
    cost: "Meetings argue about the number instead of acting on it, and exceptions have no one accountable.",
    response:
      "Command surfaces built on governed KPIs, drilldowns and exceptions that carry an owner.",
    lane: "Operational dashboards",
    href: "/services/dashboards/",
  },
] as const;

const cycles = [
  "Admissions",
  "Academic year",
  "Attendance",
  "Fees",
  "Exams",
  "Reporting",
  "Parent communication",
  "Trust governance",
] as const;

const aegisPosture = [
  "Read-only first",
  "RBAC-aware",
  "Audit-backed",
  "No autonomous writes in v1",
] as const;

const lanes = [
  {
    icon: DatabaseZap,
    eyebrow: "Lane 01 · Data engineering",
    title: "ETL/ELT pipelines built for accuracy and auditability",
    description:
      "Fragmented operational data becomes a reliable, reconciled, production-grade foundation, without pretending a connector is a data system.",
    bullets: [
      "Databases, APIs, spreadsheets, files and legacy systems",
      "Control totals, exceptions and source-to-target reconciliation",
      "Lineage, observability and refresh ownership in production",
    ],
    href: "/services/data-engineering/",
    label: "Explore data engineering",
    Visual: DataPipelineVisual,
  },
  {
    icon: BarChart3,
    eyebrow: "Lane 02 · Operational dashboards",
    title: "Dashboards that behave like command surfaces",
    description:
      "Executive and operational views built around governed metrics, trusted data, exceptions and the decisions that follow.",
    bullets: [
      "KPI contracts: definition, grain, owner, target, guardrail",
      "Drilldowns from portfolio signal to transaction",
      "Exceptions with owners, alerts without noise",
    ],
    href: "/services/dashboards/",
    label: "Explore dashboards",
    Visual: CommandSurfaceVisual,
  },
] as const;

const flow = [
  ["Ingest", "Known sources, explicit extraction boundaries"],
  ["Transform", "Validated business logic, durable models"],
  ["Reconcile", "Control totals, exceptions, source alignment"],
  ["Operate", "Refresh, lineage, observability, cost"],
  ["Decide", "Governed KPIs, owners, action"],
] as const;

const engagement = [
  {
    title: "Bring the concrete problem",
    detail:
      "Describe what is breaking, who is affected and which outcome matters. The first conversation establishes whether the work fits Fairhelm's scope; if it does not, we say so.",
  },
  {
    title: "Scope in writing",
    detail:
      "Scope, success measure and commercial terms are agreed in writing before work begins. No open-ended build, no pre-selected buzzword.",
  },
  {
    title: "Build and prove",
    detail:
      "Reconciliation, parallel validation and exception review continue until the people accountable for the numbers trust them, not merely receive them.",
  },
  {
    title: "Operate with ownership",
    detail:
      "Runbooks, refresh ownership, lineage and change discipline, so the system survives the people who built it.",
  },
] as const;

const principles = [
  {
    icon: ShieldCheck,
    title: "Governance first",
    description:
      "Access, change and intelligence are designed around authority, not bolted on later.",
  },
  {
    icon: Network,
    title: "Systems before screens",
    description:
      "We design around operating cycles, dependencies, failure modes and the humans accountable for outcomes.",
  },
  {
    icon: IndianRupee,
    title: "Cost-aware cloud execution",
    description:
      "Architecture earns its spend. Capacity, observability and refresh cadence match operational value.",
  },
  {
    icon: LockKeyhole,
    title: "Privacy-conscious architecture",
    description:
      "Least privilege, tenant separation and explicit data boundaries are product decisions.",
  },
  {
    icon: Building2,
    title: "Indian institutional realities",
    description:
      "Built for trusts, multi-entity operations, uneven source systems and real administrative pressure.",
  },
  {
    icon: Sparkles,
    title: "AI without theatre",
    description:
      "Intelligence stays explainable, role-aware, audit-backed and inside customer governance.",
  },
] as const;

const published = [
  ["Legal entity, CIN and registered office", "/legal/"],
  ["Security and governance posture", "/security/"],
  ["Privacy notice under the DPDP Act, 2023", "/privacy/"],
  ["Bounded services scope and exclusions", "/about/"],
  ["Machine-readable company summary (llms.txt)", "/llms.txt"],
] as const;

const withheld = [
  "Customer names, logos or counts",
  "Testimonials and quotes",
  "Awards, certifications or programme recognitions",
  "Uptime figures or measured outcomes",
  "Pricing for SquareCampus (published on squarecampus.com)",
] as const;

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema("/", companyFaq)} />

      <Hero
        eyebrow="Software products · Data systems · Bangalore"
        title="Governed software systems for institutions where reliability is non-negotiable."
        highlight="reliability is non-negotiable"
        description="Fairhelm Systems is a product-first technology company. It builds and operates SquareCampus, its School Operating System for educational institutions, and selectively takes on production data pipelines and decision dashboards for organisations that need governance and operational clarity."
        primary={{ label: "Explore SquareCampus", href: "/squarecampus/" }}
        secondary={{ label: "Discuss data & dashboards", href: "/contact/" }}
        bullets={[
          "Builds and operates its own flagship product",
          "Data engineering and dashboards, selectively",
          "RBAC, audit trails and tenant separation by design",
          "Incorporated in Bangalore, Karnataka, India",
        ]}
      >
        <SystemPanel />
      </Hero>

      {/* Company facts: the four things a buyer or an agent checks first. */}
      <section aria-label="Company facts" className="border-y border-border section-alt">
        <Container>
          <Reveal
            stagger
            className="grid grid-cols-2 gap-x-6 gap-y-6 py-7 lg:grid-cols-4 lg:gap-x-10"
          >
            {facts.map((fact) => (
              <div key={fact.label} className="min-w-0">
                <p className="eyebrow text-[0.6rem]">{fact.label}</p>
                <p className="mt-2 font-heading text-[1.05rem] leading-snug tracking-[-0.02em] text-foreground sm:text-lg">
                  {fact.value}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-[0.8rem]">
                  {fact.detail}
                </p>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* 01 · The problem, and what Fairhelm builds in response */}
      <section className="section">
        <Container>
          <SectionHeading
            number="01"
            eyebrow="The problem"
            title="Institutions rarely lack software. They lack visibility and ownership."
            description="Recurring operating cycles break in predictable places. Each failure has a cost, and each maps to something Fairhelm builds."
          />
          <Reveal stagger className="mt-10 grid gap-4 lg:grid-cols-3">
            {problems.map((problem) => (
              <article
                key={problem.index}
                data-slot="card"
                className="group/card relative flex h-full flex-col surface-panel rounded-[var(--radius-panel)] p-5 sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="index">{problem.index}</span>
                  <span className="chip">{problem.lane}</span>
                </div>
                <h3 className="display-3 mt-4">{problem.title}</h3>
                <p className="symptom mt-4">{problem.symptom}</p>
                <dl className="mt-5 grid gap-4 text-sm leading-6">
                  <div>
                    <dt className="eyebrow text-[0.58rem]">Hidden cost</dt>
                    <dd className="mt-1.5 text-muted-foreground">{problem.cost}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-[0.58rem]">What we build</dt>
                    <dd className="mt-1.5 text-foreground">{problem.response}</dd>
                  </div>
                </dl>
                <Link
                  href={problem.href}
                  className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-[color:var(--brand-ink)] after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none"
                >
                  {problem.lane}
                  <ArrowRight aria-hidden="true" className="size-3.5" />
                </Link>
              </article>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* 02 · The flagship product */}
      <section className="section border-y border-border section-alt">
        <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <div>
            <SectionHeading
              number="02"
              eyebrow="Flagship product · SquareCampus"
              title="One School Operating System, built around the cycles schools actually govern."
              description="Not a module list. SquareCampus connects each operating cycle to its owners, evidence, exceptions and governance context, for a single school or a multi-campus trust."
            />
            <Reveal delay={120} className="mt-7">
              <p className="eyebrow text-[0.6rem]">Operating cycles</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {cycles.map((cycle) => (
                  <li key={cycle} className="chip normal-case tracking-normal">
                    <span className="font-sans text-xs text-foreground">{cycle}</span>
                  </li>
                ))}
              </ul>
              <p className="eyebrow mt-6 text-[0.6rem]">
                AEGIS · governed intelligence inside the product
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {aegisPosture.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-teal/12 text-teal">
                      <Check aria-hidden="true" className="size-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/squarecampus/" className={cn(buttonVariants())}>
                  How Fairhelm builds SquareCampus
                  <ArrowRight data-icon="inline-end" />
                </Link>
                <a
                  href={siteConfig.product.url}
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Evaluate on squarecampus.com
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={160} className="min-w-0">
            <AegisConsoleVisual />
            <p data-md-skip className="mt-4 flex justify-center lg:justify-start">
              <span className="chip">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-teal" />
                Illustrative console using sample data
              </span>
            </p>
          </Reveal>
        </Container>
      </section>

      {/* 03 · The engineering lanes */}
      <section className="section">
        <Container>
          <SectionHeading
            number="03"
            eyebrow="Engineering lanes"
            title="From raw operational data to decisions leadership can act on."
            description="Two lanes, one standard. Fairhelm takes on this work selectively, where it aligns with the systems it already builds and operates."
          />
          <Reveal stagger className="mt-10 grid gap-5 lg:grid-cols-2">
            {lanes.map(({ Visual, icon: Icon, ...lane }) => (
              <article
                key={lane.href}
                data-slot="card"
                className="group/card relative flex h-full flex-col overflow-hidden surface-panel rounded-[var(--radius-panel)]"
              >
                <div className="p-3 sm:p-4">
                  <Visual />
                </div>
                <div className="flex flex-1 flex-col px-5 pt-2 pb-6 sm:px-7 sm:pb-7">
                  <div className="flex items-center justify-between gap-4">
                    <p className="eyebrow text-[0.6rem]">{lane.eyebrow}</p>
                    <span className="flex size-9 items-center justify-center rounded-xl border border-border bg-secondary text-[color:var(--brand-ink)]">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                  </div>
                  <h3 className="display-3 mt-3">
                    <Link
                      href={lane.href}
                      className="after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none"
                    >
                      {lane.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{lane.description}</p>
                  <ul className="mt-5 grid gap-2.5">
                    {lane.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2.5 text-sm leading-6 text-foreground"
                      >
                        <Check aria-hidden="true" className="mt-1.5 size-3.5 shrink-0 text-teal" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-[color:var(--brand-ink)]">
                    {lane.label}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-3.5 transition-transform group-hover/card:translate-x-0.5"
                    />
                  </span>
                </div>
              </article>
            ))}
          </Reveal>

          <Reveal delay={120} className="mt-6">
            <ol className="flow">
              {flow.map(([step, detail], index) => (
                <li key={step} className="flow-step">
                  <span className="index">{String(index + 1).padStart(2, "0")}</span>
                  <p className="mt-3 font-heading text-base text-foreground">{step}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </Container>
      </section>

      {/* 04 · How an engagement runs */}
      <section className="section border-y border-border section-alt">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <SectionHeading
              number="04"
              eyebrow="How an engagement runs"
              title="Diagnosis first. Scope in writing. Proof before hand-over."
              description="The same sequence whether the subject is a SquareCampus pilot or a data pipeline: it protects the institution's time as much as ours."
            />
            <Reveal
              delay={120}
              className="mt-8 surface-panel rounded-[var(--radius-panel)] p-5 sm:p-6"
            >
              <p className="eyebrow text-[0.6rem]">Outside our scope</p>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground">
                {siteConfig.services.outOfScope.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <X
                      aria-hidden="true"
                      className="mt-1.5 size-3.5 shrink-0 text-muted-foreground/70"
                    />
                    <span>
                      <span className="sr-only">Not offered: </span>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal className="panel p-2.5 sm:p-3">
            <ol className="panel-inner divide-y divide-border">
              {engagement.map((step, index) => (
                <li
                  key={step.title}
                  className="grid gap-3 p-5 sm:grid-cols-[3rem_1fr] sm:gap-5 sm:p-6"
                >
                  <span className="index pt-1.5">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="display-3">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </Container>
      </section>

      {/* 05 · Operating standard */}
      <section className="section">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <SectionHeading
            number="05"
            eyebrow="Operating standard"
            title="Discipline is a product feature."
            description="Product judgment, systems engineering and operating realism, applied to environments where weak controls become expensive quickly."
          />
          <Reveal stagger className="grid gap-x-8 sm:grid-cols-2">
            {principles.map((principle, index) => (
              <div
                key={principle.title}
                className="flex gap-4 border-b border-border py-5 first:pt-0 last:border-b-0 sm:[&:nth-child(2)]:pt-0 sm:[&:nth-last-child(2)]:border-b-0"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-[color:var(--brand-ink)]">
                  <principle.icon aria-hidden="true" className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-heading text-base text-foreground">{principle.title}</h3>
                    <span className="index shrink-0">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* 06 · What we publish */}
      <section className="section border-y border-border section-alt">
        <Container>
          <SectionHeading
            number="06"
            eyebrow="Transparency"
            title="What this site publishes, and what it deliberately does not."
            description="A company site should be checkable. Every fact here derives from one canonical record; anything unverified stays off the page until it exists."
          />
          <Reveal stagger className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="surface-panel rounded-[var(--radius-panel)] p-5 sm:p-6">
              <p className="eyebrow text-[0.6rem]">Published</p>
              <ul className="mt-4 divide-y divide-border">
                {published.map(([label, href]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group flex items-center justify-between gap-4 py-3 text-sm text-foreground"
                    >
                      <span className="flex items-center gap-3">
                        <Check aria-hidden="true" className="size-3.5 shrink-0 text-teal" />
                        {label}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[color:var(--brand-ink)]"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="surface-panel rounded-[var(--radius-panel)] p-5 sm:p-6">
              <p className="eyebrow text-[0.6rem]">Not published until it exists and is verified</p>
              <ul className="mt-4 divide-y divide-border">
                {withheld.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 py-3 text-sm text-muted-foreground"
                  >
                    <X aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground/70" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
                Interface previews on this site use sample data and are labelled illustrative.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 07 · Latest insights */}
      <RelatedInsights
        number="07"
        eyebrow="Insights"
        title="Practice notes, written before the case studies exist."
        className="border-t-0"
      />

      {/* 08 · FAQ */}
      <section className="section border-t border-border">
        <Container>
          <SectionHeading
            number="08"
            eyebrow="Frequently asked"
            title="Straight answers about the company."
            description="What Fairhelm Systems is, where it operates from, what it builds and where its engineering work stops."
          />
          <Reveal className="mt-10">
            <FaqList items={companyFaq} />
          </Reveal>
        </Container>
      </section>

      <CtaBand
        title="Bring the operating problem. We will tell you whether it fits."
        description="Talk to Fairhelm Systems about SquareCampus, a reliable data foundation or a command surface your leadership can trust. Scope and success measure are agreed in writing before work begins."
      />
    </>
  );
}
