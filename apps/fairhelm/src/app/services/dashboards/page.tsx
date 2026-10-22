import {
  BellRing,
  ChartNoAxesCombined,
  CircleGauge,
  GitBranch,
  ListFilter,
  SearchCheck,
  ShieldCheck,
  Siren,
} from "lucide-react";
import { CommandSurfaceVisual } from "@/components/site/command-surface-visual";
import { Container } from "@/components/site/container";
import { CtaBand } from "@/components/site/cta-band";
import { FeatureCard } from "@/components/site/feature-card";
import { Hero } from "@/components/site/hero";
import { JsonLd } from "@/components/site/json-ld";
import { PageNav } from "@/components/site/page-nav";
import { RelatedInsights } from "@/components/site/related-insights";
import { SectionHeading } from "@/components/site/section-heading";
import { createPageMetadata } from "@/lib/seo";
import { breadcrumbSchema, serviceSchema } from "@/lib/structured-data";

const description =
  "Fairhelm Systems builds executive and operational dashboards with governed KPIs, trusted data, drilldowns, alerts, exception tracking and decision workflows for organisations in India.";

export const metadata = createPageMetadata({
  title: "Operational Dashboards and Decision Systems",
  description,
  path: "/services/dashboards/",
});

const capabilities = [
  {
    icon: CircleGauge,
    title: "KPI design",
    motif: "ticks" as const,
    description:
      "Define the decision, metric contract, grain, owner, target and guardrail before designing the chart.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Executive reporting",
    motif: "bars" as const,
    description:
      "Boardroom-ready views that explain state, direction, variance, risk and the operating implication.",
  },
  {
    icon: GitBranch,
    title: "Drilldowns",
    motif: "funnel" as const,
    description:
      "Move from portfolio signal to segment, institution, team, transaction or exception without losing context.",
  },
  {
    icon: Siren,
    title: "Exception tracking",
    motif: "pulse" as const,
    description:
      "Surface what is outside tolerance, why it matters, who owns it and whether resolution is moving.",
  },
  {
    icon: BellRing,
    title: "Alerts",
    motif: "rings" as const,
    description:
      "Notify on material conditions with thresholds and escalation designed to reduce noise, not generate it.",
  },
  {
    icon: ListFilter,
    title: "Semantic models",
    motif: "nodes" as const,
    description:
      "Keep metric logic consistent across views with governed dimensions, measures and calculation rules.",
  },
  {
    icon: SearchCheck,
    title: "Data trust",
    motif: "shield" as const,
    description:
      "Expose freshness, reconciliation, definitions and caveats so users know what the dashboard can support.",
  },
  {
    icon: ShieldCheck,
    title: "Decision workflows",
    motif: "steps" as const,
    description:
      "Connect insight to review, ownership, follow-up and evidence without bypassing operating controls.",
  },
];

const standard = [
  ["Metric contract", "What exactly is measured, at what grain, under which rule?"],
  ["Decision context", "What changed, against which target, and why does it matter now?"],
  ["Trust state", "How fresh, complete, reconciled and qualified is the underlying data?"],
  ["Action route", "Who owns the exception, what happens next, and how is closure evidenced?"],
] as const;

const altitudes = [
  ["Executive", "Direction, target, variance, risk and strategic implication."],
  ["Operational", "Throughput, queues, bottlenecks, exceptions and owners."],
  ["Trust / school", "Portfolio comparison with institutional drilldown and governance context."],
  ["Finance / sales", "Plan, actuals, pipeline, collections, margins and exception movement."],
] as const;

export default function DashboardsPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "Operational Dashboards and Decision Systems",
            description,
            path: "/services/dashboards/",
            serviceType: "Operational dashboards, governed analytics and decision systems",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services/dashboards/" },
            { name: "Dashboards", path: "/services/dashboards/" },
          ]),
        ]}
      />
      <Hero
        eyebrow="Dashboards · Operational intelligence"
        title="Dashboards that behave like command surfaces."
        highlight="command surfaces"
        description="We build executive and operational dashboards around governed metrics, trusted data, exceptions, ownership and the decisions that follow, not around a gallery of charts."
        primary={{ label: "Design a command surface", href: "/contact/" }}
        secondary={{
          label: "Fix the data foundation",
          href: "/services/data-engineering/",
        }}
        bullets={[
          "Governed KPI definitions and semantic models",
          "Drilldowns from portfolio signal to transaction",
          "Exceptions with owners, alerts without noise",
          "Trust state visible on every view",
        ]}
      >
        <CommandSurfaceVisual />
      </Hero>

      <section className="section">
        <Container className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <SectionHeading
            eyebrow="The standard"
            title="If the data cannot be trusted, the dashboard is theatre."
            description="A serious dashboard makes the metric contract, source state, refresh context and exception path visible enough for accountable decisions."
          />
          <div className="panel p-2.5 sm:p-3">
            <div className="panel-inner grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              {standard.map(([title, detail], index) => (
                <div key={title}>
                  <span className="index">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="display-3 mt-3">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="section border-y border-border section-alt">
        <Container>
          <SectionHeading
            eyebrow="Decision infrastructure"
            title="Every layer should move the user closer to a defensible action."
            description="From metric semantics to exception ownership, the dashboard is designed as part of the operating system."
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
            eyebrow="Designed for the room"
            title="The same truth, at the right altitude."
            description="A board, trust, executive, finance, sales and frontline operations team should share metric logic while seeing the context appropriate to their responsibility."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {altitudes.map(([title, detail], index) => (
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
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <SectionHeading
            eyebrow="What we avoid"
            title="Vanity charts. Ambiguous metrics. Alert spam."
          />
          <div className="grid gap-6 text-base leading-7 text-muted-foreground sm:grid-cols-2">
            <p>
              We do not optimise for chart count or visual novelty. A visual earns its place by
              reducing decision time, surfacing risk or making operating accountability clearer.
            </p>
            <p>
              Where source quality is weak, we expose and address the gap. A polished surface must
              never manufacture confidence the evidence cannot support.
            </p>
          </div>
        </Container>
      </section>

      <RelatedInsights lane="/services/dashboards/" />

      <PageNav
        items={[
          {
            eyebrow: "Lane 01",
            title: "Data engineering",
            description:
              "Fix the data foundation before the dashboard: ETL/ELT, reconciliation, observability.",
            href: "/services/data-engineering/",
          },
          {
            eyebrow: "Next step",
            title: "Start a conversation",
            description:
              "Bring the recurring deck or the metric dispute. Scope is agreed in writing.",
            href: "/contact/",
          },
        ]}
      />

      <CtaBand
        title="Turn reporting into an operating advantage."
        description="Bring the recurring deck, the metric dispute or the dashboard nobody acts on. We will redesign the decision system around it."
        label="Discuss your dashboard"
        secondaryLabel="Fix the data foundation"
        secondaryHref="/services/data-engineering/"
      />
    </>
  );
}
