import {
  ArrowRightLeft,
  BellRing,
  Building2,
  ChartColumnIncreasing,
  CircleCheckBig,
  DatabaseZap,
  Fingerprint,
  Globe2,
  GraduationCap,
  MessageSquareMore,
  Network,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";
import type { Metadata } from "next";
import { AvailabilityNote } from "@/components/site/availability-note";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { PlatformMockupRow } from "@/components/site/mockups";
import { MotionFigure } from "@/components/site/motion-figure";
import { PageSchema } from "@/components/site/page-schema";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { SystemLayerGrid } from "@/components/site/system-layers";
import { WorkflowCards } from "@/components/site/workflow-cards";
import { motionAssets } from "@/content/motion-assets";
import { ctaLabels, siteCtas } from "@/content/site-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "School Management Platform",
  description:
    "The SquareCampus school management platform: admissions, attendance, fees, exams and parent communication as connected workflows on one record, and the four layers underneath.",
  path: "/platform",
  ogImage: "https://squarecampus.com/og/platform.png",
});

const backboneLayers = [
  {
    title: "Admissions to academics",
    icon: GraduationCap,
    body: "From inquiry, documents, and enrollment through timetable, attendance, exams, and report publishing.",
  },
  {
    title: "Finance to compliance",
    icon: WalletCards,
    body: "Fees, concessions, receipts, auditability, and institution-level oversight in the same operating model.",
  },
  {
    title: "Communication as infrastructure",
    icon: MessageSquareMore,
    body: "Parents, students, staff, and administrators receive the right information through the right channels without disconnected tools.",
  },
  {
    title: "Operations as part of the core",
    icon: Building2,
    body: "Transport, services, assets, and campus workflows stay linked to the same institutional identity and timeline.",
  },
] as const;

const sharedSystem = [
  {
    title: "Shared identity",
    icon: Fingerprint,
    body: "Users, permissions, and organizational boundaries are defined once and respected everywhere.",
  },
  {
    title: "Shared data model",
    icon: DatabaseZap,
    body: "A record created in admissions becomes the same record used by academics, finance, and communication.",
  },
  {
    title: "Shared operating timeline",
    icon: ArrowRightLeft,
    body: "Approvals, updates, dues, parent communication, and staff actions roll into one auditable sequence.",
  },
  {
    title: "Shared observability",
    icon: ChartColumnIncreasing,
    body: "Leaders see the institution through dashboards built on current records instead of stitched reports and spreadsheet exports.",
  },
] as const;

const experienceSurfaces = [
  {
    title: "Admin command center",
    body: "Branch health, role controls, rollout visibility, finance oversight, and policy enforcement from one place.",
  },
  {
    title: "Teacher workspace",
    body: "Attendance, lesson delivery, remarks, assessments, communication, and action queues without context switching.",
  },
  {
    title: "Parent and student app",
    body: "Fees, receipts, circulars, attendance, academic visibility, and service requests, designed for the family's preferred language.",
  },
  {
    title: "Leadership visibility",
    body: "Board reviews, campus-level dashboards, fee risk, academic exceptions, and operational exposure from current records.",
  },
] as const;

const operatingClaims = [
  "One login and one governed record for admissions, academics, finance, and communication.",
  "Institution-aware structure for schools, colleges, and multi-campus organizations.",
  "Parent-facing communication in families' languages, with institutional reporting kept consistent.",
  "AEGIS answers leadership questions from the same records, inside the same permissions.",
] as const;

export default function PlatformPage() {
  return (
    <main tabIndex={-1} id="main-content">
      <PageSchema
        name="School Management Platform"
        description="The SquareCampus school management platform: connected workflows for admissions, attendance, fees, exams and communication, the four layers underneath, and the shared core behind every surface."
        path="/platform"
      />

      <SectionShell className="pt-12 sm:pt-16">
        <Reveal immediate className="mx-auto max-w-3xl space-y-6 text-center">
          <p className="section-kicker">School management platform</p>
          <h1 className="font-display text-4xl leading-none tracking-[-0.06em] sm:text-5xl lg:text-6xl">
            Every school workflow on one shared record.
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-8 text-muted-foreground">
            Admissions, attendance, fees, exams and parent communication run as connected workflows.
            What staff do in one reaches the others without re-typing, and every step has an owner.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} />
            <ButtonLink href={siteCtas.rolloutHref} label="See rollout" variant="secondary" />
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-14">
          <PlatformMockupRow />
        </Reveal>

        <Reveal delay={200} className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {operatingClaims.map((item) => (
            <div
              key={item}
              className="surface-panel rounded-[1.35rem] px-4 py-4 text-sm leading-6 text-muted-foreground"
            >
              {item}
            </div>
          ))}
        </Reveal>
      </SectionShell>

      {/* Workflows first (audit SC-011): what staff do and what they get,
          before the architecture that makes it possible. */}
      <SectionShell
        id="workflows"
        eyebrow="Supported workflows"
        title="What staff do, and what they get"
        body="Each workflow runs from the first step to a recorded result, and links to a page that covers it in depth."
      >
        <WorkflowCards />
        <AvailabilityNote className="mt-4" />
      </SectionShell>

      {/* The four layers, outcome first. This replaces the old domain-area
          grid so the page is organised by what each layer changes about the
          institution, not by which modules exist. */}
      <SectionShell
        id="layers"
        eyebrow="Underneath the workflows"
        title="Four layers make the workflows connect"
        body="Records, workflows, governance and intelligence share one foundation. Each layer changes something specific about how the institution runs."
      >
        <Reveal>
          <SystemLayerGrid showCapabilities />
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="Operating domains"
        title="The cycles the backbone has to carry"
        body="The school cycles each record passes through, from first enquiry to fees, results and campus services."
      >
        <Reveal staggerChildren className="grid gap-4 md:grid-cols-2">
          {backboneLayers.map((layer) => (
            <article
              key={layer.title}
              data-reveal-item
              className="surface-quiet rounded-[1.6rem] p-6"
            >
              <layer.icon className="size-5 text-(--brand)" />
              <h2 className="mt-5 type-card-title">{layer.title}</h2>
              <p className="type-support mt-3">{layer.body}</p>
            </article>
          ))}
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="Shared core"
        title="The system underneath the UI matters"
        body="Every surface works from one identity, data and workflow core, so a change made once reaches the rest without an export, a sync job or a second copy of the record."
      >
        {/* One core, many surfaces: the argument the cards below make in prose. */}
        <Reveal className="mb-5">
          <MotionFigure
            asset={motionAssets["platform-core-surfaces"]}
            className="mx-auto w-full max-w-4xl"
            caption="Admissions, academics, finance, communication and operations act on one identity, data and workflow core, so a change made once needs no export to reach the rest."
          />
        </Reveal>

        <Reveal staggerChildren className="grid gap-4 md:grid-cols-2">
          {sharedSystem.map((item) => (
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
      </SectionShell>

      <SectionShell
        eyebrow="Product surfaces"
        title="Designed for the people who actually run the institution"
        body="SquareCampus is not just an admin layer. Each audience gets a purpose-built surface, but the institution still runs on one connected operational model."
      >
        <Reveal staggerChildren className="grid gap-4 md:grid-cols-2">
          {experienceSurfaces.map((surface, index) => {
            const icons = [Network, BellRing, Globe2, ShieldCheck];
            const Icon = icons[index];

            return (
              <article
                key={surface.title}
                data-reveal-item
                className="surface-panel rounded-[1.6rem] p-6"
              >
                <Icon className="size-5 text-(--amber)" />
                <h2 className="mt-5 font-display text-2xl tracking-[-0.04em]">{surface.title}</h2>
                <p className="mt-3 text-base leading-7 text-muted-foreground">{surface.body}</p>
              </article>
            );
          })}
        </Reveal>
      </SectionShell>

      <SectionShell className="pb-22">
        <Reveal className="surface-panel-strong rounded-4xl p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <p className="section-kicker">Governed intelligence</p>
              <h2 className="mt-4 font-display text-3xl tracking-[-0.05em] sm:text-4xl">
                AEGIS is embedded where context already exists.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                AEGIS works inside SquareCampus, not beside it. It reads the same timelines,
                permissions and records the School OS already holds, so there is no second system to
                reconcile.
              </p>
              <div className="mt-6">
                <ButtonLink href="/aegis" label="Meet AEGIS" variant="secondary" />
              </div>
            </div>
            <div className="grid gap-3">
              {[
                {
                  icon: Sparkles,
                  label: "Role-aware suggestions",
                },
                {
                  icon: CircleCheckBig,
                  label: "Exception detection from current records",
                },
                {
                  icon: ShieldCheck,
                  label: "Institution-safe answers inside the same guardrails",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.25rem] border border-(--line) bg-(--surface) px-4 py-4 text-sm text-foreground"
                >
                  <item.icon className="mb-3 size-4 text-(--brand)" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </SectionShell>
    </main>
  );
}
