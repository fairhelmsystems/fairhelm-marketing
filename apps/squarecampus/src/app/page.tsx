import { heroVocabulary } from "@/content/background";
import {
  ArrowRightLeft,
  BellRing,
  Building2,
  ChartNoAxesCombined,
  Check,
  Globe2,
  Landmark,
  Languages,
  Radar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import { AegisIntelligenceVisual } from "@/components/site/aegis-intelligence-visual";
import { AvailabilityNote } from "@/components/site/availability-note";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { FoundingPartnerSection } from "@/components/site/founding-partner-section";
import { GlyphField } from "@fairhelm/ui/backgrounds/glyph-field";
import { HeroProductComposition } from "@/components/site/hero-product";
import { MobileExpand } from "@fairhelm/ui/components/mobile-expand";
import { PainRemedyGrid } from "@/components/site/pain-remedy";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SyntheticDataNote } from "@/components/site/synthetic-data-note";
import { WorkflowCards } from "@/components/site/workflow-cards";
import { deploymentSummary, product } from "@/content/commercial";
import {
  CANONICAL_PROMISE,
  homepagePainIds,
  RECORD_VS_DECISION,
} from "@/content/operational-pains";
import { ctaLabels, siteCtas } from "@/content/site-content";
import { createAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "SquareCampus | School Management Software for Indian Schools and Trusts",
  description:
    "School management software built as a connected School OS: admissions, attendance, fees, exams and parent communication on one record for Indian schools.",
  // Canonical plus the homepage's Markdown alternate (content/markdown-alternates.ts).
  alternates: createAlternates("/"),
};

const heroProofPoints = [
  "Exceptions get an owner before term end.",
  "Current state, not stitched reports.",
  "Every override stays auditable.",
  "Ownership survives staff changes.",
] as const;

const governanceMoves = [
  {
    title: "Set policy once",
    body: "Fee rules, approval chains, academic calendars, and access boundaries are defined at the trust level — not re-invented per campus.",
  },
  {
    title: "Campuses execute with autonomy",
    body: "Principals and campus teams run their day inside clear guardrails, with local variation where the institution allows it.",
  },
  {
    title: "Exceptions surface early",
    body: "Attendance drift, fee exposure, and stalled approvals escalate to the right desk while they are still small.",
  },
  {
    title: "Every action stays accountable",
    body: "Approvals, overrides, and edits land on one auditable timeline — who, what, when, and in which campus context.",
  },
] as const;

const sovereigntyPillars = [
  {
    title: "Deployment on your terms",
    icon: Landmark,
    body: deploymentSummary,
  },
  {
    title: "India-first residency posture",
    icon: Globe2,
    body: "The platform is designed to keep institutional data in an Indian cloud region, with the posture documented in writing during evaluation.",
  },
  {
    title: "Your data, your exit rights",
    icon: ShieldCheck,
    body: "Role-scoped access and essential auditability across plans, with institution-owned data, supported exports and documented offboarding.",
  },
] as const;

const rolloutTrust = [
  {
    title: "Guided rollout",
    icon: Globe2,
    body: "Migration, role-based training, and go-live are sequenced around admissions, fee cycles, and exam windows — with named counterparts, not ticket queues.",
  },
  {
    title: "Parallel validation",
    icon: ArrowRightLeft,
    body: "Critical workflows run in parallel with your current systems until finance, academic, and admin teams trust the numbers.",
  },
  {
    title: "Trust posture",
    icon: ShieldCheck,
    body: "Role-based access, encryption in transit and at rest, and audit trails are product design — and security documentation is shared in writing on request.",
  },
  {
    title: "Operational calm",
    icon: BellRing,
    body: "The outcome that matters: fee deadlines, inspections, and board reviews handled from one system, without the end-of-term scramble.",
  },
] as const;

function EditorialGeometryOverlay({ variant = "cool" }: { variant?: "cool" | "warm" }) {
  const stroke = variant === "warm" ? "rgba(255,255,255,0.22)" : "rgba(147,196,255,0.36)";
  const fill = variant === "warm" ? "rgba(255,255,255,0.1)" : "rgba(100,164,255,0.14)";
  const dot = variant === "warm" ? "rgba(255,255,255,0.62)" : "rgba(130,192,255,0.74)";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 1000 700"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <path d="M84 612L322 418L548 462L812 208" fill="none" stroke={stroke} strokeWidth="2" />
        <path d="M612 112L742 112L892 264L892 424" fill="none" stroke={stroke} strokeWidth="1.6" />
        <path
          d="M116 152C206 110 314 92 446 110C512 118 594 146 672 208"
          fill="none"
          stroke={stroke}
          strokeWidth="1.4"
          strokeDasharray="8 12"
        />
        <circle cx="322" cy="418" r="18" fill={fill} stroke={stroke} strokeWidth="1.6" />
        <circle cx="548" cy="462" r="12" fill={fill} stroke={stroke} strokeWidth="1.6" />
        <circle cx="812" cy="208" r="24" fill={fill} stroke={stroke} strokeWidth="1.8" />
        <circle cx="892" cy="424" r="14" fill={fill} stroke={stroke} strokeWidth="1.6" />
      </svg>
      <div className="absolute left-[16%] top-[18%] h-24 w-24 rounded-full border border-white/14 bg-white/8 backdrop-blur-[2px]" />
      <div className="absolute right-[12%] top-[16%] h-px w-28 bg-white/20" />
      <div className="absolute right-[12%] top-[16%] h-12 w-px bg-white/20" />
      <div
        className="absolute left-[31.5%] top-[58.5%] size-2 rounded-full"
        style={{ backgroundColor: dot }}
      />
      <div
        className="absolute right-[18.2%] top-[28.2%] size-2.5 rounded-full"
        style={{ backgroundColor: dot }}
      />
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)]" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main tabIndex={-1} id="main-content">
        {/* 1 — Hero.
            DOM order is the mobile order the brief requires: proposition →
            product proof → supporting evidence. Explicit grid placement then
            lifts the proof statements back under the copy on desktop, so no
            `order` juggling is needed and the tab order stays natural. */}
        <SectionShell className="isolate pt-8 pb-6 sm:pt-14 sm:pb-12 lg:pb-16">
          {/* Ledger glyph backdrop. `isolate` on the section keeps the canvas's
              negative z-index inside the section, above the page texture and
              below the copy. Decoration only — see glyph-field.tsx. */}
          <GlyphField vocabulary={heroVocabulary} />
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-12 xl:gap-14">
            <Reveal
              immediate
              className="space-y-4 sm:space-y-5 lg:col-start-1 lg:row-start-1 lg:self-end"
            >
              {/* Category and audience first (audit SC-007): a first-time
                  visitor should know what this is before the proposition. */}
              <p className="section-kicker">{product.categoryDescriptor}</p>
              <h1 className="type-display">
                Run daily operations. See what needs{" "}
                <span className="hero-emphasis">attention</span>.
              </h1>
              <p className="type-body measure text-muted-foreground">
                Admissions, attendance, fees, exams and parent communication in one connected system
                — with clear responsibilities for school teams and one shared view for leadership
                across campuses.
              </p>
              {/* Stacked and full-width on phones; one row from sm up. */}
              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
                <ButtonLink
                  href={siteCtas.demoHref}
                  label={ctaLabels.demo}
                  variant="cta"
                  className="w-full justify-center text-center sm:w-auto"
                />
                <ButtonLink
                  href={siteCtas.platformHref}
                  label="See how it works"
                  variant="secondary"
                  className="w-full justify-center sm:w-auto"
                />
              </div>
            </Reveal>

            <Reveal
              immediate
              delay={120}
              className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center"
            >
              <HeroProductComposition />
            </Reveal>

            {/* Supporting evidence — after the product on mobile, under the
                copy on desktop. Compact rows, not four feature cards. */}
            <Reveal
              immediate
              delay={200}
              className="lg:col-start-1 lg:row-start-2 lg:self-start lg:pt-2"
            >
              <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {heroProofPoints.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
                    <Check
                      aria-hidden
                      className="mt-1 size-3.5 shrink-0 text-[color:var(--brand)]"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </SectionShell>

        {/* 2 — The everyday workflows, straight after the hero (audit SC-006,
            SC-008): the tasks a school recognises come before the governance
            model that connects them. Each card links to its solution page. */}
        <SectionShell
          id="workflows"
          eyebrow="What school teams do in SquareCampus"
          title="The daily work, from first enquiry to results"
          body="Each workflow has an owner at every step and ends on the same school record, so nothing is re-typed between departments."
        >
          <WorkflowCards />
          <AvailabilityNote className="mt-4" />
        </SectionShell>

        {/* 2 — Operational pain and the remedy. This sits directly under the
            hero on purpose: the institution's problem is the entry point to
            the story, not the module list. */}
        <SectionShell
          id="operational-pain"
          eyebrow="What institutions actually feel"
          title="The problem is rarely a missing feature. It is delayed visibility and unclear ownership."
          body="Recurring school cycles break in predictable places. Each one has a hidden cost, a remedy, an accountable owner, and something a pilot can measure."
        >
          {/*
            Collapsed on phones like every other content section. Measured on
            the live site at 390px: this one was 2839px tall against ~260px for
            the six sections that already had the pill, and together with
            founding partners it was 57% of the whole mobile page.
          */}
          <MobileExpand label="See the breaks and remedies" title="Where school cycles break">
            <Reveal>
              <PainRemedyGrid ids={homepagePainIds} />
            </Reveal>

            <Reveal delay={80}>
              <div className="surface-panel-strong mt-5 rounded-[var(--radius-panel-lg)] p-6 sm:p-8">
                <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-12">
                  <div>
                    <p className="eyebrow">Record versus decision</p>
                    <p className="type-quote mt-4 text-balance">{RECORD_VS_DECISION}</p>
                  </div>
                  <div className="grid gap-4 border-t border-[color:var(--line)] pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                    <p className="type-body measure text-muted-foreground">{CANONICAL_PROMISE}</p>
                    <div className="flex flex-wrap gap-3">
                      <ButtonLink
                        href="/what-is-squarecampus"
                        label="What is SquareCampus?"
                        variant="secondary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </MobileExpand>
        </SectionShell>

        {/* 3 — Command centre */}
        <SectionShell
          eyebrow="The command centre"
          compactBody
          title="Management sees the institution the way a board expects to"
          body="Trust-level governance with campus-level autonomy: policy is set once, campuses execute inside guardrails, and exceptions reach the right desk early."
        >
          <MobileExpand label="See the command centre" title="The command centre">
            <Reveal className="grid gap-4 xl:grid-cols-[1.06fr_0.94fr]">
              <article className="surface-panel-strong relative overflow-hidden rounded-[2.15rem] p-6 lg:p-7">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(88,124,204,0.14),transparent)]" />
                <div className="relative flex h-full flex-col">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-(--surface) px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
                      <ChartNoAxesCombined className="size-4 text-(--teal)" />
                      Institution view
                    </div>
                    {/* Replaces a "Live state" chip: this panel renders
                        synthetic figures, so it must not imply live data. */}
                    <SyntheticDataNote />
                  </div>

                  <h2 className="mt-7 max-w-2xl font-display text-3xl tracking-[-0.05em] sm:text-4xl">
                    Attendance, fee exposure, and exceptions — before the review meeting.
                  </h2>
                  <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
                    Leadership reads current signals across campuses instead of waiting for stitched
                    reports assembled after the fact.
                  </p>

                  <div className="mt-7 grid flex-1 items-stretch gap-4 lg:grid-cols-[1fr_1fr]">
                    {/* Attendance by grade — horizontal bar chart (illustrative UI) */}
                    <div className="flex h-full flex-col rounded-[1.7rem] border border-(--line) bg-(--surface) p-6">
                      <div className="flex items-center justify-between">
                        <p className="section-kicker">Attendance by grade</p>
                        <SyntheticDataNote variant="chip" />
                      </div>
                      <div className="mt-5 flex flex-1 flex-col justify-center gap-3">
                        {[
                          ["Grade 10", 96],
                          ["Grade 9", 91],
                          ["Grade 8", 94],
                          ["Grade 7", 88],
                          ["Grade 6", 97],
                        ].map(([label, value]) => (
                          <div key={label as string} className="flex items-center gap-3">
                            <span className="w-16 shrink-0 text-right font-mono text-[0.6875rem] text-muted-foreground">
                              {label as string}
                            </span>
                            <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-(--surface-muted)">
                              <div
                                className="absolute inset-y-0 left-0 rounded-full transition-all duration-[1.5s] ease-out"
                                style={{
                                  width: `${value}%`,
                                  background:
                                    "linear-gradient(90deg, var(--brand), color-mix(in oklch, var(--brand), white 25%))",
                                  animation: `bar-grow 1.2s ease-out both`,
                                  animationDelay: `${["Grade 10", "Grade 9", "Grade 8", "Grade 7", "Grade 6"].indexOf(label as string) * 0.1}s`,
                                }}
                              />
                            </div>
                            <span className="w-8 shrink-0 font-mono text-[0.6875rem] font-medium text-foreground">
                              {value as number}%
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {["Campus roll-up", "Exceptions flagged"].map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-(--line) bg-(--surface-strong) px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Fee collection — doughnut chart (illustrative UI) */}
                    <div className="flex h-full flex-col rounded-[1.7rem] border border-(--line) bg-(--surface) p-6">
                      <div className="flex items-center justify-between">
                        <p className="section-kicker">Fee collection</p>
                        <SyntheticDataNote variant="chip" />
                      </div>
                      <div className="flex flex-1 items-center justify-center py-6">
                        <div className="relative">
                          {/* Decorative: every figure in this ring is also
                              printed as text beside it, so the chart itself is
                              kept out of the accessibility tree. */}
                          <svg
                            aria-hidden="true"
                            width="160"
                            height="160"
                            viewBox="0 0 160 160"
                            className="-rotate-90"
                          >
                            {/* Background ring */}
                            <circle
                              cx="80"
                              cy="80"
                              r="62"
                              fill="none"
                              stroke="var(--surface-muted)"
                              strokeWidth="18"
                            />
                            {/* Segments trimmed by a ~2px surface gap on each side */}
                            {/* Collected: 72% */}
                            <circle
                              cx="80"
                              cy="80"
                              r="62"
                              fill="none"
                              stroke="var(--brand)"
                              strokeWidth="18"
                              strokeDasharray={`${(0.72 - 0.008) * 2 * Math.PI * 62} ${2 * Math.PI * 62}`}
                              strokeLinecap="butt"
                              className="animate-[doughnut-draw_1.4s_ease-out_both]"
                            />
                            {/* Pending: 20% — light step of the brand hue */}
                            <circle
                              cx="80"
                              cy="80"
                              r="62"
                              fill="none"
                              stroke="color-mix(in oklch, var(--brand), white 45%)"
                              strokeWidth="18"
                              strokeDasharray={`${(0.2 - 0.008) * 2 * Math.PI * 62} ${2 * Math.PI * 62}`}
                              strokeDashoffset={`${-0.72 * 2 * Math.PI * 62}`}
                              strokeLinecap="butt"
                              className="animate-[doughnut-draw_1.4s_ease-out_0.2s_both]"
                            />
                            {/* Overdue: 8% — warning status */}
                            <circle
                              cx="80"
                              cy="80"
                              r="62"
                              fill="none"
                              stroke="var(--amber)"
                              strokeWidth="18"
                              strokeDasharray={`${(0.08 - 0.008) * 2 * Math.PI * 62} ${2 * Math.PI * 62}`}
                              strokeDashoffset={`${-0.92 * 2 * Math.PI * 62}`}
                              strokeLinecap="butt"
                              className="animate-[doughnut-draw_1.4s_ease-out_0.4s_both]"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-display text-2xl tracking-[-0.04em] text-[color:var(--foreground)]">
                              72%
                            </span>
                            <span className="mt-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
                              Collected
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center gap-5">
                        {[
                          ["Collected", "72%", "var(--brand)"],
                          ["Pending", "20%", "color-mix(in oklch, var(--brand), white 45%)"],
                          ["Overdue", "8%", "var(--amber)"],
                        ].map(([label, pct, color]) => (
                          <div key={label} className="flex items-center gap-2">
                            <span className="size-2 rounded-full" style={{ background: color }} />
                            <span className="text-xs text-muted-foreground">
                              {label} <span className="font-medium text-foreground">{pct}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid flex-1 items-stretch gap-4">
                    <div className="relative hidden min-h-72 overflow-hidden rounded-[1.7rem] border border-[color:var(--line)] sm:block">
                      {/* Plain <img>: `images.unoptimized` is on for the static
                          export, so next/image emits no srcset — it would ship
                          the 1280w file to every screen. Explicit width/height
                          give the intrinsic ratio; the container reserves the
                          box, so this contributes no layout shift. */}
                      {/* biome-ignore lint/performance/noImgElement: see above */}
                      <img
                        src="/images/editorial/campus-courtyard.webp"
                        srcSet="/images/editorial/campus-courtyard-800.webp 800w, /images/editorial/campus-courtyard-1024.webp 1024w, /images/editorial/campus-courtyard.webp 1280w"
                        sizes="(min-width: 1280px) 35vw, 50vw"
                        alt="Modern campus courtyard"
                        width={1280}
                        height={853}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <EditorialGeometryOverlay />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,24,38,0.06),rgba(16,24,38,0.76))]" />
                      <div className="absolute inset-x-5 bottom-5 rounded-[1.3rem] border border-white/14 bg-[rgba(12,20,32,0.55)] p-4 text-white backdrop-blur-md">
                        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-white/85">
                          Who it is for
                        </p>
                        <p className="mt-3 font-display text-2xl tracking-[-0.04em]">
                          Trustees, principals, finance teams and campus operators, on one record.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="surface-panel relative overflow-hidden rounded-[2.15rem] p-6 lg:p-7">
                <div className="flex h-full flex-col">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-(--line) pb-5">
                    <div>
                      <p className="section-kicker">Governance model</p>
                      <h2 className="mt-3 max-w-sm font-display text-2xl tracking-[-0.04em]">
                        Trust-level governance. Campus-level autonomy.
                      </h2>
                    </div>
                    <span className="rounded-full border border-(--line) bg-(--surface-strong) px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
                      <Building2 className="mr-2 inline size-4 text-(--brand)" />
                      Every campus
                    </span>
                  </div>

                  <div className="mt-5 grid flex-1 content-start gap-2.5">
                    {governanceMoves.map((item, index) => (
                      <div
                        key={item.title}
                        className="rounded-[1.3rem] border border-(--line) bg-(--surface-strong) p-4"
                      >
                        <div className="flex items-start gap-3.5">
                          <div
                            className={`flex size-9 shrink-0 items-center justify-center rounded-full border font-mono text-[0.7rem] ${
                              index === 0
                                ? "border-transparent bg-foreground text-background"
                                : "border-(--line) bg-(--surface) text-muted-foreground"
                            }`}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-display text-lg tracking-[-0.03em]">
                              {item.title}
                            </h3>
                            <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
                              {item.body}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          </MobileExpand>
        </SectionShell>

        {/* 5 — Sovereignty */}
        <SectionShell
          eyebrow="Sovereignty"
          compactBody
          title="Your institution's data, under your institution's governance"
          body="Sovereign means the institution stays in control: where the platform runs, who can see what, and how the data leaves if you ever want it to."
        >
          <MobileExpand label="See the sovereignty model" title="Data, deployment and exit">
            <Reveal className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
              <div className="surface-panel-strong relative overflow-hidden rounded-[1.8rem] p-8">
                <div className="pointer-events-none absolute right-[-3rem] top-[-2rem] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(88,124,204,0.16),transparent_72%)] blur-3xl" />
                <Languages className="size-5 text-[color:var(--brand)]" />
                <h2 className="mt-5 font-display text-3xl tracking-[-0.05em]">
                  Sovereign does not mean rigid.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted-foreground)]">
                  Parent-facing communication is designed to reach each family in its preferred
                  language while the institution keeps consistent controls, reporting, and
                  audit-ready records underneath.
                </p>
                <div className="mt-8 grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
                  <div className="grid gap-4">
                    <div className="rounded-[1.45rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5">
                      <p className="section-kicker">Preferred language</p>
                      <p className="mt-4 text-base leading-7 text-[color:var(--foreground)]">
                        Parent-facing updates flex by audience without fragmenting the institutional
                        record.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {["English", "Hindi", "Kannada"].map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[1.45rem] border border-[color:var(--line)] bg-[linear-gradient(180deg,var(--surface),var(--surface-strong))] p-5">
                      <p className="section-kicker">Structured underneath</p>
                      <p className="mt-4 text-base leading-7 text-[color:var(--foreground)]">
                        Circulars, dues, acknowledgements, and audit history stay attached to the
                        same student and family context.
                      </p>
                    </div>
                  </div>

                  <div className="relative hidden min-h-[20rem] overflow-hidden rounded-[1.6rem] border border-[color:var(--line)] sm:block">
                    {/* See the note on the courtyard image above. */}
                    {/* biome-ignore lint/performance/noImgElement: see above */}
                    <img
                      src="/images/editorial/school-building-delhi.webp"
                      srcSet="/images/editorial/school-building-delhi-800.webp 800w, /images/editorial/school-building-delhi-1024.webp 1024w, /images/editorial/school-building-delhi.webp 1280w"
                      sizes="(min-width: 1280px) 28vw, 50vw"
                      alt="Institution building for India-first operations context"
                      width={1280}
                      height={853}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <EditorialGeometryOverlay variant="warm" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,24,38,0.08),rgba(16,24,38,0.78))]" />

                    <div className="absolute right-4 top-4 max-w-[16rem] rounded-[1.35rem] border border-white/14 bg-[rgba(255,255,255,0.76)] p-4 text-[color:var(--foreground)] shadow-[0_18px_50px_rgba(8,15,30,0.14)] backdrop-blur-md dark:border-white/10 dark:bg-[rgba(12,20,32,0.72)] dark:text-white dark:shadow-[0_18px_50px_rgba(0,0,0,0.4)]">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[color:var(--muted-foreground)] dark:text-white/60">
                          Circular delivery
                        </p>
                        <div className="flex gap-1.5">
                          {["ENG", "HIN"].map((item) => (
                            <span
                              key={item}
                              className="rounded-full bg-[color:var(--surface-strong)] px-2 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[color:var(--muted-foreground)] dark:bg-white/10 dark:text-white/60"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 font-display text-xl tracking-[-0.04em]">
                        Fee reminder queued in the family's language
                      </p>
                      <p className="mt-3 text-sm leading-6 text-[color:var(--muted-foreground)] dark:text-white/60">
                        Same due date, same receipt trail, same operator view. Language adapts
                        without rewriting the underlying workflow.
                      </p>
                    </div>

                    <div className="absolute inset-x-4 bottom-4 rounded-[1.35rem] border border-white/14 bg-[rgba(12,20,32,0.58)] p-5 text-white backdrop-blur-md">
                      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-white/85">
                        India-aware operating model
                      </p>
                      <p className="mt-3 font-display text-2xl tracking-[-0.04em]">
                        Language stays flexible while the institution stays operationally strict.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid content-start gap-4">
                {sovereigntyPillars.map((item) => (
                  <article key={item.title} className="surface-panel rounded-[1.6rem] p-6">
                    <item.icon className="size-5 text-[color:var(--amber)]" />
                    <h2 className="mt-5 font-display text-2xl tracking-[-0.04em]">{item.title}</h2>
                    <p className="mt-3 text-base leading-7 text-[color:var(--muted-foreground)]">
                      {item.body}
                    </p>
                  </article>
                ))}
                <div className="surface-panel rounded-[1.6rem] p-6">
                  <p className="section-kicker">Deployment details</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    What managed cloud and Enterprise private deployment each involve, with the
                    status of every option, is set out on the services page.
                  </p>
                  <div className="mt-4">
                    <ButtonLink href="/services" label="See deployment options" variant="ghost" />
                  </div>
                </div>
              </div>
            </Reveal>
          </MobileExpand>
        </SectionShell>

        {/* 6 — AEGIS (secondary to the OS) */}
        <SectionShell
          eyebrow="Governed intelligence"
          compactBody
          title="AEGIS is the governed intelligence layer inside SquareCampus"
          body="AEGIS is the intelligence that lives inside SquareCampus, not a chatbot bolted onto an ERP. It surfaces what needs attention across the institution, inside the same permissions and audit trails as everything else."
        >
          <MobileExpand label="See AEGIS in action" title="AEGIS in action">
            <Reveal className="surface-panel-strong rounded-[2rem] p-8 lg:p-10">
              <div className="grid gap-10 lg:grid-cols-[0.84fr_1.16fr] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-2 text-sm text-[color:var(--foreground)]">
                    <Radar className="size-4 text-[color:var(--brand)]" />
                    AEGIS inside SquareCampus
                  </div>
                  <h2 className="mt-5 font-display text-3xl tracking-[-0.05em] sm:text-4xl">
                    Ask AEGIS. Don&rsquo;t chase reports.
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted-foreground)]">
                    Leaders ask in plain language; AEGIS answers from the school&rsquo;s own
                    records, inside their permissions. It is read-only: it suggests, people decide,
                    and every question is on the audit trail.
                  </p>
                  <div className="mt-6 grid gap-3">
                    {[
                      {
                        icon: Sparkles,
                        text: "Operational questions answered from the institution's own records",
                      },
                      {
                        icon: ShieldCheck,
                        text: "Same trust boundaries, same role-aware controls",
                      },
                      {
                        icon: Radar,
                        text: "Signals and anomalies surfaced across finance, academics, and operations",
                      },
                    ].map((item) => (
                      <div
                        key={item.text}
                        className="rounded-[1.25rem] border border-[color:var(--line)] bg-[color:var(--surface)] px-4 py-4 text-sm leading-6 text-[color:var(--muted-foreground)]"
                      >
                        <item.icon className="mb-3 size-4 text-[color:var(--brand)]" />
                        {item.text}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <ButtonLink href="/aegis" label="Meet AEGIS" variant="secondary" />
                  </div>
                </div>
                <AegisIntelligenceVisual className="lg:-mr-2" />
              </div>
            </Reveal>
          </MobileExpand>
        </SectionShell>

        {/* 7 — Rollout & trust */}
        <SectionShell
          eyebrow="Rollout & trust"
          compactBody
          title="Switching systems is an institutional decision. We treat it that way."
          body="The move is sequenced around your academic calendar, validated in parallel, and governed by the same trust posture the platform runs on."
        >
          <MobileExpand label="See rollout and trust" title="Rollout and trust">
            <Reveal staggerChildren className="grid gap-4 md:grid-cols-2">
              {rolloutTrust.map((item) => (
                <article
                  key={item.title}
                  data-reveal-item
                  className="surface-panel rounded-[1.6rem] p-6"
                >
                  <item.icon className="size-5 text-[color:var(--brand)]" />
                  <h2 className="mt-5 font-display text-2xl tracking-[-0.04em]">{item.title}</h2>
                  <p className="mt-3 text-base leading-7 text-[color:var(--muted-foreground)]">
                    {item.body}
                  </p>
                </article>
              ))}
            </Reveal>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink
                href={siteCtas.rolloutHref}
                label="See the rollout model"
                variant="secondary"
              />
              <ButtonLink
                href={siteCtas.securityHref}
                label="Review the trust posture"
                variant="secondary"
              />
            </div>
          </MobileExpand>
        </SectionShell>

        {/* 8 — Founding Institutional Partners.
            Placed after rollout & trust and before the final CTA: the reader
            now has the problem, the posture, the trust model and the rollout
            approach, so this is where earned trust becomes a privileged next
            step — and it hands straight off to "Next move" below. */}
        <FoundingPartnerSection />

        {/* 9 — Final CTA */}
        <SectionShell className="pb-12 sm:pb-22">
          <Reveal className="surface-panel-strong rounded-[2rem] p-5 sm:p-8 lg:p-10">
            <div className="grid gap-5 sm:gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
              <div>
                <p className="section-kicker">Next move</p>
                <h2 className="mt-4 font-display text-3xl tracking-[-0.05em] sm:text-4xl">
                  See whether SquareCampus can govern your institution.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted-foreground)]">
                  Bring your current stack. We will map it against the governed operating model and
                  walk through rollout, controls, and institutional fit.
                </p>
              </div>
              <div className="grid gap-3">
                <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} />
                <ButtonLink
                  href={siteCtas.platformHref}
                  label="View platform architecture"
                  variant="secondary"
                />
              </div>
            </div>
          </Reveal>
        </SectionShell>
      </main>
      <SiteFooter />
    </div>
  );
}
