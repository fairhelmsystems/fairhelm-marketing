import {
  Activity,
  Boxes,
  Braces,
  CircleDollarSign,
  GitCompareArrows,
  ListChecks,
  RefreshCw,
  Route,
} from "lucide-react";
import { Container } from "@/components/site/container";
import { CtaBand } from "@/components/site/cta-band";
import { DataPipelineVisual } from "@/components/site/data-pipeline-visual";
import { FeatureCard } from "@/components/site/feature-card";
import { Hero } from "@/components/site/hero";
import { JsonLd } from "@/components/site/json-ld";
import { PageNav } from "@/components/site/page-nav";
import { RelatedInsights } from "@/components/site/related-insights";
import { SectionHeading } from "@/components/site/section-heading";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { breadcrumbSchema, serviceSchema } from "@/lib/structured-data";

const description =
  "Fairhelm Systems designs and operates ETL and ELT pipelines for organisations in India that need accurate, reconciled, observable data without undisciplined cloud spend.";

export const metadata = createPageMetadata({
  title: "Data Engineering and ETL/ELT Pipelines in India",
  description,
  path: "/services/data-engineering/",
});

const capabilities = [
  {
    icon: Braces,
    title: "Source ingestion",
    motif: "flow" as const,
    description:
      "Bring operational databases, APIs, spreadsheets, file drops and legacy systems into a controlled ingestion model.",
  },
  {
    icon: Boxes,
    title: "Data modelling",
    motif: "mesh" as const,
    description:
      "Design warehouse or lakehouse layers around durable business entities, measures, history and consumption needs.",
  },
  {
    icon: GitCompareArrows,
    title: "Reconciliation",
    motif: "ledger" as const,
    description:
      "Prove movement with control totals, record-level exceptions, source-to-target comparisons and accountable resolution.",
  },
  {
    icon: RefreshCw,
    title: "Pipeline orchestration",
    motif: "orbit" as const,
    description:
      "Schedule and coordinate batch or event-driven flows with retries, dependencies, idempotency and predictable recovery.",
  },
  {
    icon: ListChecks,
    title: "Data quality",
    motif: "ticks" as const,
    description:
      "Encode freshness, validity, completeness, uniqueness and referential checks where failure becomes visible early.",
  },
  {
    icon: Activity,
    title: "Observability",
    motif: "pulse" as const,
    description:
      "Monitor lineage, runtime, volume shifts, schema drift, failure and service-level expectations in production.",
  },
  {
    icon: CircleDollarSign,
    title: "Cloud cost discipline",
    motif: "steps" as const,
    description:
      "Choose storage, compute, cadence and retention deliberately so pipeline economics stay proportional to value.",
  },
  {
    icon: Route,
    title: "Production refresh",
    motif: "waves" as const,
    description:
      "Move from one-off migration to an owned, documented, repeatable refresh process with clear operating responsibility.",
  },
];

const failures = [
  [
    "Source ambiguity",
    "Identify owners, grain, extraction rules and the operational meaning of each source.",
  ],
  [
    "Business-rule drift",
    "Move critical transformations out of tribal knowledge and into reviewable models.",
  ],
  [
    "Silent quality failure",
    "Detect freshness, volume, schema and validity problems before they reach leadership.",
  ],
  [
    "Refresh fragility",
    "Engineer retries, recovery, idempotency and operating runbooks for the real failure path.",
  ],
] as const;

const delivery = [
  ["Map", "Sources, owners, grain, rules, dependencies and decision consumers."],
  ["Design", "Contracts, models, quality gates, orchestration and cost envelope."],
  ["Prove", "Backfills, reconciliation, exception review, performance and recovery."],
  ["Operate", "Monitoring, runbooks, refresh ownership, lineage and change discipline."],
] as const;

export default function DataEngineeringPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "Data Engineering and ETL/ELT Pipelines",
            description,
            path: "/services/data-engineering/",
            serviceType: "Data engineering, ETL and ELT pipelines",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services/data-engineering/" },
            { name: "Data Engineering", path: "/services/data-engineering/" },
          ]),
        ]}
      />
      <Hero
        eyebrow="Data engineering · ETL · ELT"
        title="ETL/ELT pipelines built for accuracy, auditability and decision velocity."
        highlight="accuracy, auditability and decision velocity"
        description="We turn fragmented operational data into reliable, reconciled, production-grade foundations, without pretending a connector is the same thing as a data system."
        primary={{ label: "Discuss your data estate", href: "/contact/" }}
        secondary={{
          label: "Explore dashboards",
          href: "/services/dashboards/",
        }}
        bullets={[
          "Databases, APIs, spreadsheets, files and legacy systems",
          "Control totals and reconciliation as evidence",
          "Lineage, observability and refresh ownership",
          "Cloud cost proportional to operating value",
        ]}
      >
        <DataPipelineVisual />
      </Hero>

      <section className="section">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <SectionHeading
            eyebrow="For messy operational data"
            title="The problem is rarely moving bytes. It is establishing trust."
            description="Different systems disagree. Spreadsheets encode undocumented rules. IDs drift. Reports reconcile only after manual intervention. We make those realities explicit, testable and operable."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {failures.map(([title, detail], index) => (
              <FeatureCard
                key={title}
                index={String(index + 1).padStart(2, "0")}
                title={title}
                description={detail}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="section border-y border-border section-alt">
        <Container>
          <SectionHeading
            eyebrow="End-to-end capability"
            title="From extraction to a production refresh leadership can rely on."
            description="Architecture, implementation, validation and operating discipline are treated as one system."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability) => (
              <FeatureCard key={capability.title} {...capability} />
            ))}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <SectionHeading
            eyebrow="Delivery model"
            title="A pipeline is complete when it can be trusted in production."
            description="The delivery sequence is shaped around evidence, control and ownership, not only code completion."
          />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {delivery.map(([title, detail], index) => (
              <li key={title} className="h-full">
                <FeatureCard
                  index={String(index + 1).padStart(2, "0")}
                  title={title}
                  description={detail}
                />
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="section border-y border-border section-alt">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <SectionHeading
            eyebrow="How to engage"
            title="Selective by design. Bounded by scope."
            description="Fairhelm is a product company that takes on data engineering work where it aligns with its own systems. Bring the concrete operating problem, the source estate and the decisions the data must support; the first conversation establishes whether the work fits."
          />
          <div className="grid gap-6 text-base leading-7 text-muted-foreground sm:grid-cols-2">
            <p>
              In scope: production ETL/ELT pipelines, data platforms, reconciliation, data quality,
              observability, and the operational dashboards and governed analytics that sit on top
              of them.
            </p>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm leading-6">
              {siteConfig.services.outOfScope.map((item) => (
                <li key={item}>Not offered: {item}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="section">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <SectionHeading
            eyebrow="Architecture judgment"
            title="Batch when batch is enough. Events when events earn their complexity."
          />
          <div className="grid gap-6 text-base leading-7 text-muted-foreground sm:grid-cols-2">
            <p>
              We choose movement patterns based on latency, correctness, recovery, source behaviour,
              team capability and cost, not trend value.
            </p>
            <p>
              The result is a data platform that fits the operating need and remains intelligible to
              the people who must own it after launch.
            </p>
          </div>
        </Container>
      </section>

      <RelatedInsights lane="/services/data-engineering/" />

      <PageNav
        items={[
          {
            eyebrow: "Lane 02",
            title: "Operational dashboards",
            description: "Command surfaces built on the governed data these pipelines produce.",
            href: "/services/dashboards/",
          },
          {
            eyebrow: "Flagship product",
            title: "SquareCampus",
            description: "The School Operating System Fairhelm builds and operates.",
            href: "/squarecampus/",
          },
        ]}
      />

      <CtaBand
        title="Make your operational data answerable."
        description="Bring the source sprawl, fragile reports and reconciliation pain. We will help define a governed route to production."
        label="Discuss data engineering"
        secondaryLabel="Explore dashboards"
        secondaryHref="/services/dashboards/"
      />
    </>
  );
}
