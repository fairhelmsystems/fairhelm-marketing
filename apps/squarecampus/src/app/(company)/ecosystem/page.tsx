import {
  BellRing,
  Building2,
  Globe2,
  GraduationCap,
  Landmark,
  MonitorSmartphone,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { AvailabilityNote } from "@/components/site/availability-note";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { EcosystemMockup } from "@/components/site/mockups";
import { MotionPoster } from "@/components/site/motion-poster";
import { PageSchema } from "@/components/site/page-schema";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { integrationScope } from "@/content/commercial";
import { motionAssets } from "@/content/motion-assets";
import { ctaLabels, siteCtas } from "@/content/site-content";

/**
 * Apps & Integrations (audit SC-021). The route stays /ecosystem/; the page
 * is organised by who uses what, then by what connects and on what terms.
 *
 * Each audience states its tasks and its surface (mobile app or web). Store
 * availability and supported device versions are not asserted here: they are
 * confirmed per institution in the proposal (content/commercial.ts ›
 * availability), like every other capability on the site.
 */
const audiences = [
  {
    title: "Parents",
    icon: Globe2,
    surface: "Mobile app",
    surfaceIcon: Smartphone,
    tasks: [
      "Attendance and absence alerts",
      "Fee dues, payments and receipts",
      "Circulars and acknowledgements",
      "Progress and results",
    ],
  },
  {
    title: "Students",
    icon: GraduationCap,
    surface: "Mobile app",
    surfaceIcon: Smartphone,
    tasks: ["Timetable and the day's classes", "Assignments due", "Notices", "Results"],
  },
  {
    title: "Teachers and staff",
    icon: BellRing,
    surface: "Mobile app and web",
    surfaceIcon: MonitorSmartphone,
    tasks: [
      "Class and period attendance",
      "Marks entry and remarks",
      "Messages to parents",
      "Their own queue of follow-ups",
    ],
  },
  {
    title: "Administrators and office",
    icon: Building2,
    surface: "Web",
    surfaceIcon: MonitorSmartphone,
    tasks: [
      "Admissions and student records",
      "Fee plans, concessions and reconciliation",
      "Campus setup, roles and approvals",
      "Circulars and communication logs",
    ],
  },
  {
    title: "Principals, trustees and leadership",
    icon: Landmark,
    surface: "Web",
    surfaceIcon: MonitorSmartphone,
    tasks: [
      "Current position across campuses",
      "Open exceptions and who owns them",
      "Approvals waiting on them",
      "Questions to AEGIS, inside their permissions",
    ],
  },
] as const;

export default function EcosystemPage() {
  return (
    <main tabIndex={-1} id="main-content">
      <PageSchema
        name="Apps & Integrations"
        description="SquareCampus apps for parents, students, teachers, administrators and leadership on one school record, and how integrations with the tools an institution keeps are scoped."
        path="/ecosystem"
      />

      <SectionShell className="pt-12 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <Reveal immediate className="space-y-6">
            <p className="section-kicker">Apps &amp; Integrations</p>
            <h1 className="font-display text-4xl leading-none tracking-[-0.06em] sm:text-5xl lg:text-6xl">
              An app for every role, on one school record.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[color:var(--muted-foreground)]">
              Parents, students, teachers, the office and leadership each get the screens their work
              needs. Everything they do lands on the same record, and the tools you keep can be
              connected as scoped work.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} />
              <ButtonLink href="#integrations" label="What connects" variant="secondary" />
            </div>
          </Reveal>
          <Reveal immediate delay={120}>
            <EcosystemMockup />
          </Reveal>
        </div>
      </SectionShell>

      <SectionShell
        id="apps"
        eyebrow="By audience"
        title="What each person does, and where"
        body="The standard parent and staff mobile apps are included in the licence; staff and leadership also work on the web."
      >
        <MotionPoster
          asset={motionAssets["ecosystem-core-surfaces"]}
          alt="Parents, teachers, principals, finance teams and trustees connected to one institutional record, each seeing the part their role owns."
        />

        <Reveal staggerChildren className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {audiences.map((item) => (
            <article
              key={item.title}
              data-reveal-item
              className="surface-panel flex flex-col rounded-[1.6rem] p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <item.icon aria-hidden className="size-5 text-[color:var(--teal)]" />
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--line)] px-2.5 py-1 text-xs text-[color:var(--muted-foreground)]">
                  <item.surfaceIcon aria-hidden className="size-3.5" />
                  {item.surface}
                </span>
              </div>
              <h2 className="mt-5 font-display text-2xl tracking-[-0.04em]">{item.title}</h2>
              <ul className="mt-3 grid gap-1.5 text-sm leading-6 text-[color:var(--muted-foreground)]">
                {item.tasks.map((task) => (
                  <li key={task}>{task}</li>
                ))}
              </ul>
            </article>
          ))}
        </Reveal>
        <AvailabilityNote
          className="mt-4"
          text="App-store availability, supported device versions and the modules in each app for your institution are confirmed in writing in your proposal. White-labelled apps under your own branding are a separately scoped option."
        />
      </SectionShell>

      <SectionShell
        id="integrations"
        eyebrow="Integrations"
        title="What connects, and on what terms"
        body={integrationScope.summary}
      >
        <Reveal>
          <dl className="grid gap-3 md:grid-cols-2">
            {integrationScope.groups.map((group) => (
              <div key={group.label} className="surface-panel rounded-[1.4rem] p-5">
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
        </Reveal>
        <Reveal delay={80} className="mt-4">
          <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
            Prerequisites, pipelines into one dashboard and deployment options are set out on{" "}
            <Link
              href="/services/#integration-scope"
              className="text-[color:var(--foreground)] underline underline-offset-4"
            >
              data and integration services
            </Link>
            .
          </p>
        </Reveal>
      </SectionShell>

      <SectionShell className="pb-22">
        <Reveal className="surface-panel-strong rounded-[2rem] p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="section-kicker">Next step</p>
              <h2 className="mt-4 font-display text-3xl tracking-[-0.05em] sm:text-4xl">
                See the apps for the roles in your institution.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted-foreground)]">
                Tell us which roles and tools matter most. We will show the relevant screens and map
                which of your current tools could connect.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} />
              <ButtonLink href={siteCtas.securityHref} label="Security" variant="secondary" />
            </div>
          </div>
        </Reveal>
      </SectionShell>
    </main>
  );
}
