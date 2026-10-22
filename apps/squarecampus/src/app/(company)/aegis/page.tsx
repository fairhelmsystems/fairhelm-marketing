import {
  BellRing,
  Building2,
  ChartNoAxesCombined,
  Check,
  Fingerprint,
  Landmark,
  Radar,
  ScrollText,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";
import type { Metadata } from "next";
import { AegisConsole } from "@/components/site/aegis-console";
import { AegisIntelligenceVisual } from "@/components/site/aegis-intelligence-visual";
import { AvailabilityNote } from "@/components/site/availability-note";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { MotionFigure } from "@/components/site/motion-figure";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { availability } from "@/content/commercial";
import { motionAssets } from "@/content/motion-assets";
import { ctaLabels, siteCtas } from "@/content/site-content";
import { AEGIS_PLAIN_DEFINITION, aegisBoundaries } from "@/content/what-is-squarecampus";
import {
  createBreadcrumbSchema,
  createPageMetadata,
  createWebPageSchema,
  SEO_CONFIG,
} from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "AEGIS: AI for School Operations",
  description:
    "AEGIS is the intelligence inside SquareCampus, not a chatbot on an ERP: read-only, plain-language answers from the institution's own records, in role scope, with an audit trail on every question.",
  path: "/aegis",
  ogImage: "https://squarecampus.com/og/aegis.png",
});

/**
 * Three realistic questions (audit SC-015). Each states what the answer is
 * drawn from, how its sources and as-of time are shown, and where AEGIS
 * stops. This is the designed behaviour, labelled as such on the page; it is
 * not a transcript of a live system.
 */
const exampleQuestions = [
  {
    role: "Principal",
    icon: Building2,
    question: "“Which Class 8 sections had attendance below 85% this week?”",
    scope: "Attendance records for the principal's own campus only.",
    sources:
      "Each section in the answer links to the attendance entries behind it, with the time the data was last updated.",
    limit: "It can suggest raising the pattern with class teachers. It does not message anyone.",
  },
  {
    role: "Finance & accounts",
    icon: WalletCards,
    question:
      "“How much of this term's fees is overdue by more than 30 days, and in which classes?”",
    scope: "The fee ledger for the campuses the finance role is permitted to see.",
    sources:
      "Totals link to the invoices and receipts they are built from, as of the last posted payment.",
    limit:
      "It does not send reminders or change any fee record; a person does that in the fees workflow.",
  },
  {
    role: "Trust leadership",
    icon: Landmark,
    question: "“Which campuses have approvals waiting longer than a week?”",
    scope: "Approval records across the campuses under the trust administrator's role.",
    sources:
      "Each item names the approval, its owner and how long it has waited, with an as-of time.",
    limit: "It cannot approve, reassign or escalate. It shows who owns each item.",
  },
] as const;

const governancePillars = [
  {
    title: "Role-based, always",
    icon: Fingerprint,
    body: "AEGIS answers within the same RBAC scopes as the rest of SquareCampus. A principal sees their campus; a trust admin sees the trust. No side doors.",
  },
  {
    title: "Tenant boundaries respected",
    icon: ShieldCheck,
    body: "Institutional data stays inside institutional boundaries. AEGIS reads your live operating records — it doesn't pool them into someone else's model.",
  },
  {
    title: "Auditable by default",
    icon: ScrollText,
    body: "Every question and answer is recorded on the audit trail. Suggested follow-ups are for people to act on through normal workflows — AEGIS never carries them out itself.",
  },
  {
    title: "Decision support, not noise",
    icon: ChartNoAxesCombined,
    body: "AEGIS is not a generic chatbot. It is a controlled intelligence layer that helps management ask sharper questions and act with operational clarity.",
  },
] as const;

const eraComparison = [
  {
    legacy:
      "Ask the office to prepare a report, wait days, get a spreadsheet that's already stale.",
    aegis: "Ask AEGIS in plain language and get an answer from the institution's own records.",
  },
  {
    legacy: "Exceptions surface at term end, when the damage is already done.",
    aegis:
      "Attendance, fee, academic, and communication exceptions are flagged against thresholds the institution sets.",
  },
  {
    legacy: "Every export is another uncontrolled copy of student data floating around.",
    aegis: "Answers stay inside role-based permissions, tenant boundaries, and audit trails.",
  },
  {
    legacy: "Leadership sees each campus through a different lens, stitched by hand.",
    aegis:
      "One governed, trust-level view across campuses — with campus-level accountability intact.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    createWebPageSchema({
      name: "AEGIS: AI for School Operations",
      description:
        "AEGIS is SquareCampus' governed intelligence layer for school leaders: role-aware answers, exception detection, and audit-ready decision support.",
      url: `${SEO_CONFIG.baseUrl}/aegis`,
    }),
    createBreadcrumbSchema([
      { name: "Home", url: SEO_CONFIG.baseUrl },
      { name: "AEGIS", url: `${SEO_CONFIG.baseUrl}/aegis` },
    ]),
  ],
};

export default function AegisPage() {
  return (
    <main tabIndex={-1} id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <SectionShell className="pt-12 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal immediate className="space-y-6">
            <p className="section-kicker inline-flex items-center gap-2">
              <Radar className="size-3.5 text-(--brand)" />
              Adaptive Enterprise Governance &amp; Intelligence System
            </p>
            <h1 className="font-display text-4xl leading-none tracking-[-0.06em] sm:text-5xl lg:text-[4.4rem]">
              Ask AEGIS. Don&rsquo;t chase reports.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              The AI inside SquareCampus, not a chatbot bolted onto an ERP. Ask in plain language;
              it answers from your school&rsquo;s records, inside your permissions, on the audit
              trail. It suggests — people decide and act.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} />
              <ButtonLink
                href={siteCtas.platformHref}
                label="Explore the platform"
                variant="secondary"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {["Inside SquareCampus", "Answers in role scope", "Read-only"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-(--line) bg-(--surface) px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </Reveal>

          {/* Above the fold: `immediate`, so the console paints complete on the
              first frame instead of waiting for hydration (audit SC-018). */}
          <Reveal immediate delay={120}>
            <AegisConsole />
          </Reveal>
        </div>
      </SectionShell>

      {/* The boundary, stated once in content/what-is-squarecampus.ts and
          shown here beside the demo, so no illustration on this page can be
          read as AEGIS acting on the institution's behalf. */}
      <SectionShell
        id="boundaries"
        eyebrow="What AEGIS does, and does not do"
        title="Answers and suggestions. People decide and act."
        body={AEGIS_PLAIN_DEFINITION}
        compactBody
      >
        <Reveal className="surface-panel rounded-[1.8rem] p-6 lg:p-7">
          <ul className="grid gap-3 md:grid-cols-2">
            {aegisBoundaries.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-foreground">
                <Check aria-hidden className="mt-1 size-3.5 shrink-0 text-(--teal)" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
        <AvailabilityNote
          className="mt-4"
          text={`The examples on this page are illustrative and use synthetic data. ${availability.short}`}
        />
      </SectionShell>

      <SectionShell
        id="examples"
        eyebrow="Three example questions"
        title="What an answer is drawn from, and where AEGIS stops"
        body="How AEGIS is designed to answer three everyday questions. Each answer stays inside the asker's permissions, shows its sources and when the data was last updated, and ends with a suggestion rather than an action."
      >
        <Reveal staggerChildren className="grid gap-4 lg:grid-cols-3">
          {exampleQuestions.map((item) => (
            <article
              key={item.role}
              data-reveal-item
              className="surface-panel flex flex-col rounded-[1.6rem] p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="section-kicker">{item.role}</p>
                <item.icon aria-hidden className="size-5 shrink-0 text-(--brand)" />
              </div>
              <h3 className="mt-4 font-display text-xl leading-snug tracking-[-0.03em]">
                {item.question}
              </h3>
              <dl className="mt-4 grid gap-3 text-sm leading-6">
                <div>
                  <dt className="font-medium text-foreground">Answer scope</dt>
                  <dd className="mt-0.5 text-muted-foreground">{item.scope}</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">Sources and as-of time</dt>
                  <dd className="mt-0.5 text-muted-foreground">{item.sources}</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">Limit</dt>
                  <dd className="mt-0.5 text-muted-foreground">{item.limit}</dd>
                </div>
              </dl>
            </article>
          ))}
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="Governance first"
        title="Intelligence that strengthens control instead of leaking it"
        body="AEGIS is designed governance-first: the permission check happens before an answer exists, not after it."
      >
        {/* The composition shows the part the copy below cannot: records being
            refused before an answer exists. It carries a caption because it is
            not a restatement of the cards. */}
        <Reveal className="mb-5">
          <MotionFigure
            asset={motionAssets["governed-question-path"]}
            className="mx-auto w-full max-w-4xl"
            caption="Scope is applied before an answer exists. Records outside the asker's tenant and role are refused rather than summarised, and the query itself becomes an audit entry."
          />
        </Reveal>

        <Reveal staggerChildren className="grid gap-4 md:grid-cols-2">
          {governancePillars.map((pillar) => (
            <article
              key={pillar.title}
              data-reveal-item
              className="surface-panel rounded-[1.6rem] p-6"
            >
              <pillar.icon className="size-5 text-(--teal)" />
              <h2 className="mt-5 font-display text-2xl tracking-[-0.04em]">{pillar.title}</h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">{pillar.body}</p>
            </article>
          ))}
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="Context is the moat"
        title="AEGIS works because the operating system underneath is connected"
        body="AEGIS is designed to work from the records your institution already runs on in SquareCampus — who may see what, timelines, fee state and communication history — rather than guessing."
      >
        <Reveal className="mx-auto max-w-3xl">
          <AegisIntelligenceVisual />
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="Before and after"
        title="The report-chasing era is over"
        body="If your current ERP's answer to every leadership question is 'we'll prepare a report', the comparison below will feel familiar."
      >
        <Reveal staggerChildren className="grid gap-4">
          {eraComparison.map((row) => (
            <article key={row.aegis} data-reveal-item className="grid gap-3 lg:grid-cols-2">
              <div className="rounded-[1.4rem] bg-(--surface-muted) p-5">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Legacy ERP reporting
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{row.legacy}</p>
              </div>
              <div className="surface-panel-strong rounded-[1.4rem] p-5">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-(--brand-ink)">
                  With AEGIS
                </p>
                <p className="mt-3 text-sm leading-7 text-foreground">{row.aegis}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </SectionShell>

      <SectionShell eyebrow="What AEGIS helps with" title="From data to defensible decisions">
        <Reveal staggerChildren className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            {
              icon: BellRing,
              text: "Identify attendance, fee, academic, and communication exceptions early.",
            },
            {
              icon: Landmark,
              text: "Give leadership a trust-level view across campuses without flattening accountability.",
            },
            {
              icon: Building2,
              text: "Support principals and administrators with contextual operational insight.",
            },
            {
              icon: ShieldCheck,
              text: "Preserve governance through RBAC, audit trails, and controlled access.",
            },
            {
              icon: Sparkles,
              text: "Turn school data into actionable intelligence without compromising ownership or privacy.",
            },
            {
              icon: ChartNoAxesCombined,
              text: "Help management ask sharper questions and act with better operational clarity.",
            },
          ].map((item) => (
            <div key={item.text} data-reveal-item className="surface-panel rounded-[1.4rem] p-5">
              <item.icon className="size-4.5 text-(--brand)" />
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </Reveal>
      </SectionShell>

      <SectionShell className="pb-22 pt-0">
        <Reveal className="surface-panel-strong relative overflow-hidden rounded-[2rem] p-8 lg:p-12">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(88,124,204,0.14),transparent)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-center">
            <div>
              <p className="section-kicker">See it on your own numbers</p>
              <h2 className="mt-4 font-display text-3xl tracking-[-0.05em] sm:text-4xl">
                Bring one question you currently wait days to answer.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                In a guided demo we&rsquo;ll walk through how AEGIS is designed to answer it, what
                it would draw on in your records, and where its limits are.
              </p>
            </div>
            <div className="grid gap-3">
              <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} />
              <ButtonLink
                href={siteCtas.securityHref}
                label="Review the trust posture"
                variant="secondary"
              />
            </div>
          </div>
        </Reveal>
      </SectionShell>
    </main>
  );
}
