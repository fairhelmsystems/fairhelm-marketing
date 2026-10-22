import { Activity, Compass, Landmark, ShieldCheck, Sparkles, Target } from "lucide-react";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { PageSchema } from "@/components/site/page-schema";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { product } from "@/content/commercial";
import { company } from "@/content/company";
import { ctaLabels, siteCtas } from "@/content/site-content";

const values = [
  {
    title: "Reliability over decoration",
    icon: ShieldCheck,
    body: "SquareCampus is built for the days that matter most — fee deadlines, results, inspections. Availability and recovery design are documented in writing during security review, not promised on a web page.",
  },
  {
    title: "Real-world operations first",
    icon: Compass,
    body: "We design for paperwork, habits, audits, and constraints as they exist today, not how a hypothetical perfect campus might work.",
  },
  {
    title: "Radical clarity for admins",
    icon: Target,
    body: "Everyone works from the same governed record: who is present, what is pending, and what needs action now.",
  },
] as const;

const pillars = [
  {
    title: "Built for Indian institutions",
    caption: "From standalone schools to multi-city groups.",
    points: [
      "Ready for multi-campus, multi-branch structures.",
      "Handles complex fee setups, terms, and concessions.",
      "Respects your existing processes instead of forcing a reset.",
    ],
  },
  {
    title: "Digitizing every corner",
    caption: "A single operating system instead of stitched tools.",
    points: [
      "Connects admissions, academics, and finance into one flow.",
      "Turns paper-based approvals into clear, trackable workflows.",
      "A change made once reaches the shared record, instead of being re-keyed into another system.",
    ],
  },
  {
    title: "Data you can act on",
    caption: "Not just charts — actual decisions.",
    points: [
      "Shows what changed, who changed it, and when.",
      "Highlights trends in attendance, performance, and collections.",
      "Keeps insights role-based so everyone sees what matters to them.",
    ],
  },
] as const;

const founders = [
  {
    initials: "MG",
    name: "Mohit Gupta",
    role: "Founder & CTO",
    body: "Leads product and platform engineering. Built systems processing 100M+ records daily and brings that reliability mindset to every workflow.",
  },
] as const;

const wePractice = [
  "Infrastructure that runs admission to alumni",
  "Workflows designed around fee season, results and inspections",
  "Software built for Indian institutional reality",
  "A sustainable business that respects its team",
] as const;

export default function AboutPage() {
  return (
    <main tabIndex={-1} id="main-content">
      <PageSchema
        name="About SquareCampus"
        description="SquareCampus is built by Fairhelm Systems OPC for Indian schools, school groups and education trusts that need one governed operating system."
        path="/about"
      />

      <SectionShell className="pt-12 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <Reveal immediate className="space-y-6">
            <p className="section-kicker">About SquareCampus</p>
            <h1 className="font-display text-4xl leading-none tracking-[-0.06em] sm:text-5xl lg:text-6xl">
              A founder-led company building software for Indian schools.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              SquareCampus is built by {company.legalNameDisplay}, in Bangalore. It exists to put
              admissions, academics, fees and communication on one record, with a clear owner for
              every exception — for standalone schools, school groups and education trusts.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} />
              <ButtonLink
                href={siteCtas.platformHref}
                label="Explore the platform"
                variant="secondary"
              />
            </div>
          </Reveal>

          {/* Company identity first (audit SC-028): facts a buyer can check,
              from the same record the footer's statutory disclosure uses. */}
          <Reveal immediate delay={120}>
            <dl className="surface-panel divide-y divide-(--line) rounded-[1.5rem] px-5">
              {[
                ["Company", company.legalNameDisplay],
                ["CIN", company.cin],
                ["Registered office", `${company.address.locality}, ${company.address.region}`],
                ["Founder", "Mohit Gupta, Founder & CTO"],
                ["Product", "SquareCampus™ (trademark registration pending)"],
              ].map(([term, value]) => (
                <div key={term} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
                  <dt className="section-kicker">{term}</dt>
                  <dd className="text-sm leading-6 text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow="Our story"
        title="Built for campuses that can't afford chaos"
        body="Institutions rarely struggle because people don't work hard. They struggle because data is scattered, processes are inconsistent, and every department runs its own system of record."
      >
        <Reveal className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="surface-panel-strong rounded-[1.8rem] p-7 lg:p-8">
            <Landmark className="size-5 text-(--brand)" />
            <h2 className="mt-5 font-display text-3xl tracking-[-0.05em]">
              One system of record for daily operations.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Decisions get made on partial context, and the office ends up firefighting instead of
              planning. SquareCampus gives schools and colleges one connected system where every
              workflow is connected, auditable, and simple enough to use every day.
            </p>
            <div className="mt-6 rounded-[1.4rem] border border-(--line) bg-(--surface) p-5">
              <p className="section-kicker">We built SquareCampus because institutions deserve</p>
              <ul className="mt-4 grid gap-2.5">
                {[
                  "Software that flows like thought, not clicks like paperwork",
                  "Systems that anticipate needs, not wait for tickets",
                  "Automation that gives time back to teaching, not admin",
                  "Data that tells stories, not just sits in rows",
                  "Technology that delights users, not frustrates them",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                    <Sparkles className="mt-1 size-3.5 shrink-0 text-(--brand)" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-6 font-display text-lg leading-snug tracking-[-0.02em]">
              {product.categoryRelationship}
            </p>
          </div>

          <div className="grid content-start gap-4">
            <div className="surface-panel rounded-[1.6rem] p-6">
              <p className="section-kicker">Founder-led</p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                SquareCampus, a product of Fairhelm Systems (OPC) Private Limited, is built by a
                founder-led, product-first team focused on building something that can sit at the
                center of your institution for years, not months.
              </p>
              <div className="mt-5 grid gap-3">
                {founders.map((person) => (
                  <div
                    key={person.initials}
                    className="flex items-start gap-4 rounded-[1.3rem] border border-(--line) bg-(--surface) p-4"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-xs text-background">
                      {person.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {person.name} · {person.role}
                      </p>
                      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                        {person.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                The shared goal: a platform that doesn&rsquo;t just look good in demos, but survives
                timetables, fee seasons, inspections, and everything in between.
              </p>
            </div>

            <div className="surface-panel rounded-[1.6rem] p-6">
              <h3 className="font-display text-lg tracking-[-0.02em]">What we build</h3>
              <ul className="mt-4 grid gap-2.5">
                {wePractice.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
                    <span aria-hidden className="text-(--teal)">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="What we optimise for"
        title="Less friction for the institution. More trust in the data."
        body="Every feature, integration, and workflow inside SquareCampus is measured against that single question."
      >
        <Reveal staggerChildren className="grid gap-4 md:grid-cols-3">
          {values.map((value) => (
            <article
              key={value.title}
              data-reveal-item
              className="surface-panel rounded-[1.6rem] p-6"
            >
              <value.icon className="size-5 text-(--brand)" />
              <h2 className="mt-5 font-display text-2xl tracking-[-0.04em]">{value.title}</h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">{value.body}</p>
            </article>
          ))}
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="Institutional fit"
        title="How SquareCampus fits into your institution"
        body="SquareCampus doesn't arrive as a rigid template. It adapts to your workflows while giving you the structure you need to scale without losing control."
      >
        <Reveal staggerChildren className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              data-reveal-item
              className="surface-panel rounded-[1.6rem] p-6"
            >
              <p className="section-kicker">{pillar.caption}</p>
              <h2 className="mt-4 font-display text-2xl tracking-[-0.04em]">{pillar.title}</h2>
              <ul className="mt-4 grid gap-2.5">
                {pillar.points.map((point) => (
                  <li key={point} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
                    <Activity className="mt-1 size-3.5 shrink-0 text-(--teal)" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </Reveal>
      </SectionShell>

      <SectionShell className="pt-0">
        <Reveal className="surface-panel-strong relative overflow-hidden rounded-[2rem] p-8 lg:p-12">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(88,124,204,0.12),transparent)]" />
          <blockquote className="relative mx-auto max-w-3xl">
            <p className="font-display text-2xl leading-snug tracking-[-0.03em] sm:text-3xl">
              &ldquo;Indian schools and colleges don&rsquo;t need another shiny dashboard — they
              need software that understands the messy, beautiful chaos of running real institutions
              in this country. SquareCampus absorbs that complexity so institutions can stop
              firefighting and focus on what actually matters: education.&rdquo;
            </p>
            <footer className="mt-6 text-sm text-muted-foreground">
              Mohit Gupta · Founder &amp; CTO
            </footer>
          </blockquote>
        </Reveal>
      </SectionShell>

      <SectionShell className="pb-22 pt-0">
        <Reveal className="surface-panel-strong rounded-[2rem] p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-center">
            <div>
              <p className="section-kicker">Next step</p>
              <h2 className="mt-4 font-display text-3xl tracking-[-0.05em] sm:text-4xl">
                Ready to see SquareCampus in action?
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                Share how your institution operates today, and we&rsquo;ll walk you through how
                SquareCampus can simplify, connect, and de-risk your daily workflows.
              </p>
            </div>
            <div className="grid gap-3">
              <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} />
              <ButtonLink
                href={siteCtas.platformHref}
                label="Explore the platform"
                variant="secondary"
              />
            </div>
          </div>
        </Reveal>
      </SectionShell>
    </main>
  );
}
