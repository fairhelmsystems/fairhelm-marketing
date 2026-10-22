import {
  ArrowRightLeft,
  Cable,
  ChartNoAxesCombined,
  Cloud,
  Code2,
  Database,
  Landmark,
  Lock,
  Server,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { PageSchema } from "@/components/site/page-schema";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { ServicesFlowVisual } from "@/components/site/services-flow-visual";
import { deploymentOptions, integrationScope } from "@/content/commercial";
import { ctaLabels, siteCtas } from "@/content/site-content";
import { createAlternates } from "@/lib/seo";

const ogImage = {
  url: "https://squarecampus.com/og/services-card.png",
  width: 1200,
  height: 630,
  alt: "SquareCampus services: fragmented school tools flowing through an ETL/ELT engine into one dashboard",
};

export const metadata: Metadata = {
  title: "Integration, Data & Deployment Services",
  description:
    "SquareCampus services: scoped integrations with the school tools you keep, ETL/ELT pipelines into one custom dashboard, and Enterprise private deployment — each assessed and confirmed in writing.",
  alternates: createAlternates("/services"),
  openGraph: {
    title: "Your school's tools, finally talking to each other | SquareCampus",
    description:
      "Scoped integrations, ETL/ELT pipelines and one leadership dashboard — on our managed cloud or a dedicated Enterprise environment.",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImage.url],
  },
};

const integrationPoints = [
  {
    title: "Scoped connectors",
    icon: Cable,
    body: "Where a tool offers a documented API — a biometric device, payment gateway, LMS, accounting package or government portal — we assess whether and how it can connect, and scope the bridge before anything is built.",
  },
  {
    title: "Agreed direction and frequency",
    icon: ArrowRightLeft,
    body: "Each integration states which system owns which record, which way data moves, how often, and how errors are validated and retried — agreed in writing rather than assumed.",
  },
  {
    title: "Built as workflows",
    icon: Workflow,
    body: "Integrations are designed around your operating logic — for example, an admission confirmed in one system starting fee setup in another — where both systems allow it.",
  },
  {
    title: "Development APIs for your own apps",
    icon: Code2,
    body: "Institutions that want their own portal, frontend or mobile apps can scope access to SquareCampus development APIs. Access follows the same role-based permissions and audit trail, and is granted after a compliance review.",
  },
] as const;

const dataPoints = [
  {
    title: "ETL / ELT pipelines",
    icon: Database,
    body: "We extract from your fragmented sources — legacy ERPs, spreadsheets, standalone apps — transform them into one consistent model, and keep them flowing on schedule.",
  },
  {
    title: "One custom dashboard",
    icon: ChartNoAxesCombined,
    body: "Leadership gets a single dashboard built around your institution's questions: collections, attendance, academics, operations — not a generic BI template.",
  },
  {
    title: "Your servers or our cloud",
    icon: Server,
    body: "Pipelines and the dashboard run on our Microsoft Azure setup in India or on infrastructure you already own, as agreed in the scope.",
  },
] as const;

/** Icons for the deployment options in content/commercial.ts. */
const deploymentIcons = { managed: Cloud, private: Lock, byoc: Landmark } as const;

export default function ServicesPage() {
  return (
    <main tabIndex={-1} id="main-content">
      <PageSchema
        name="Data and Integration Services"
        description="Integration, data migration and deployment services: connecting existing school tools, building pipelines, and running SquareCampus on managed, private or customer-owned infrastructure."
        path="/services"
      />

      <SectionShell className="pt-12 sm:pt-16">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal immediate className="max-w-3xl space-y-6">
            <p className="section-kicker">Integration, data &amp; deployment services</p>
            <h1 className="font-display text-4xl leading-none tracking-[-0.06em] sm:text-5xl lg:text-6xl">
              Your existing tools don&rsquo;t have to be dead ends.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              Beyond the School OS, we scope connections to the systems you already run, unify their
              data into one dashboard, and deploy on our managed cloud or a dedicated Enterprise
              environment.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} variant="cta" />
              <ButtonLink
                href={siteCtas.platformHref}
                label="Explore the platform"
                variant="secondary"
              />
            </div>
          </Reveal>
          <Reveal immediate delay={120}>
            <ServicesFlowVisual />
          </Reveal>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow="Systems integration"
        title="Connect the fragmented tools you already have"
        body="Replacing everything on day one isn't always realistic. Where a system offers a documented API, we assess and scope a bridge so it stops being an island."
        compactBody
      >
        <Reveal staggerChildren className="grid gap-4 md:grid-cols-3">
          {integrationPoints.map((item) => (
            <article
              key={item.title}
              data-reveal-item
              className="surface-panel rounded-[1.6rem] p-6"
            >
              <item.icon className="size-5 text-(--brand)" />
              <h2 className="mt-5 font-display text-2xl tracking-[-0.04em]">{item.title}</h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </Reveal>
        <Reveal delay={100} className="mt-4">
          <p className="rounded-[1.2rem] border border-dashed border-(--line-strong) bg-(--surface) px-4 py-3 text-sm leading-6 text-foreground sm:px-5">
            In plain words: if your fingerprint machines, fee gateway or accounts software offer an
            API, we can scope a bridge between them. Each one is assessed and quoted on its own.
          </p>
        </Reveal>
        {/* What connects, and on what terms. Derived from
            content/commercial.ts › integrationScope so no page can imply a
            pre-built connector that does not exist. */}
        <Reveal delay={120} className="mt-4">
          <div id="integration-scope" className="surface-panel rounded-[1.6rem] p-6 lg:p-7">
            <p className="section-kicker">Integration status</p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-foreground">
              {integrationScope.summary}
            </p>
            <dl className="mt-5 grid gap-3 md:grid-cols-2">
              {integrationScope.groups.map((group) => (
                <div
                  key={group.label}
                  className="rounded-[1.2rem] border border-(--line) bg-(--surface-strong) p-4"
                >
                  <dt className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">{group.label}</span>
                    <span className="rounded-full border border-(--line) px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                      {group.status}
                    </span>
                  </dt>
                  <dd className="mt-2 text-sm leading-6 text-muted-foreground">{group.detail}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-sm font-medium text-foreground">
              Before any integration is built
            </p>
            <ul className="mt-2 grid gap-1.5">
              {integrationScope.prerequisites.map((item) => (
                <li key={item} className="text-sm leading-6 text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="Data engineering"
        title="ETL/ELT pipelines and one dashboard that answers to leadership"
        body="Scattered systems mean scattered truth. We consolidate your data into one governed model and one custom dashboard your leadership actually uses."
        compactBody
      >
        <Reveal staggerChildren className="grid gap-4 md:grid-cols-3">
          {dataPoints.map((item) => (
            <article
              key={item.title}
              data-reveal-item
              className="surface-panel rounded-[1.6rem] p-6"
            >
              <item.icon className="size-5 text-(--teal)" />
              <h2 className="mt-5 font-display text-2xl tracking-[-0.04em]">{item.title}</h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </Reveal>
        <Reveal delay={100} className="mt-4">
          <p className="rounded-[1.2rem] border border-dashed border-(--line-strong) bg-(--surface) px-4 py-3 text-sm leading-6 text-foreground sm:px-5">
            In plain words: the numbers from the tools in scope, in one screen your principal can
            read with morning tea.
          </p>
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="Deployment options"
        title="SquareCampus runs where your governance says it should"
        body="Managed cloud is the default. A dedicated Enterprise environment is a scoped service, with the same role-based access and audit design."
        compactBody
      >
        <Reveal staggerChildren className="grid gap-4 md:grid-cols-3">
          {deploymentOptions.map((item) => {
            const Icon = deploymentIcons[item.id];
            return (
              <article
                key={item.id}
                data-reveal-item
                data-offer-status={item.status}
                className="surface-panel-strong rounded-[1.8rem] p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="section-kicker">{item.status}</p>
                  <Icon className="size-5 shrink-0 text-(--brand)" />
                </div>
                <h2 className="mt-4 font-display text-2xl tracking-[-0.04em]">{item.title}</h2>
                <p className="mt-3 text-base leading-7 text-muted-foreground">{item.body}</p>
              </article>
            );
          })}
        </Reveal>
        <Reveal delay={100} className="mt-4">
          <p className="rounded-[1.2rem] border border-dashed border-(--line-strong) bg-(--surface) px-4 py-3 text-sm leading-6 text-foreground sm:px-5">
            In plain words: our cloud by default, or a dedicated Enterprise environment on AWS, a
            private cloud or your own premises.
          </p>
        </Reveal>
        <Reveal delay={120} className="mt-4">
          <div className="surface-panel flex flex-wrap items-center gap-x-5 gap-y-2 rounded-[1.4rem] px-5 py-4">
            <span className="inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
              <ShieldCheck className="size-3.5 text-(--teal)" />
              Same role-based access and audit design in every model
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
              <Lock className="size-3.5 text-(--teal)" />
              Hosted on Microsoft Azure in India by default
            </span>
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell className="pb-12 sm:pb-22">
        <Reveal className="surface-panel-strong rounded-[2rem] p-5 sm:p-8 lg:p-10">
          <div className="grid gap-5 sm:gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-center">
            <div>
              <p className="section-kicker">Start with an integration audit</p>
              <h2 className="mt-4 font-display text-2xl tracking-[-0.05em] sm:text-4xl">
                Bring your current tool list. We&rsquo;ll map what connects.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                In one session we identify which systems can integrate, what the pipeline looks
                like, and which deployment model fits your institution&rsquo;s governance.
              </p>
            </div>
            <div className="grid gap-3">
              <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} variant="cta" />
              <ButtonLink
                href="mailto:contact@squarecampus.com?subject=Integration%20%26%20Data%20Services"
                label="Email the services team"
                variant="secondary"
              />
            </div>
          </div>
        </Reveal>
      </SectionShell>
    </main>
  );
}
