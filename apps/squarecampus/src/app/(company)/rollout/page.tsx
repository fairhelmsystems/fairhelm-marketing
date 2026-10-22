import {
  ArrowRightLeft,
  BriefcaseBusiness,
  DatabaseBackup,
  GraduationCap,
  Handshake,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { RolloutMockup } from "@/components/site/mockups";
import { MotionFigure } from "@/components/site/motion-figure";
import { PageSchema } from "@/components/site/page-schema";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { motionAssets } from "@/content/motion-assets";
import { ctaLabels, siteCtas } from "@/content/site-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "School ERP Implementation & Migration",
  description:
    "How a SquareCampus implementation runs: what the school provides, what we deliver and when each stage is done — from blueprint and data migration to parallel runs and go-live.",
  path: "/rollout",
  ogImage: "https://squarecampus.com/og/rollout.png",
});

/**
 * Each stage states what the school provides, what SquareCampus delivers and
 * when the stage is complete (audit SC-019). No durations or deadlines are
 * published: timelines depend on scope and data, and are agreed in writing.
 */
const rolloutSteps = [
  {
    title: "Institution blueprint",
    icon: BriefcaseBusiness,
    school: "Current systems, campus structure, roles, approval paths and the academic calendar.",
    squarecampus:
      "A written blueprint of the workflows in scope, their owners and the go-live sequence.",
    done: "The institution signs off the blueprint and the sequence.",
  },
  {
    title: "Data migration",
    icon: DatabaseBackup,
    school: "Exports from current systems, and a named person to answer questions about the data.",
    squarecampus:
      "Mapping, cleaning and trial imports, with a list of issues for the institution to resolve.",
    done: "Trial imports reconcile against the checks agreed in the blueprint — for example student counts and dues totals — and the data owner signs off.",
  },
  {
    title: "Role-based training",
    icon: GraduationCap,
    school: "Staff time by role, scheduled around the calendar.",
    squarecampus: "Training on the workflows each role will actually use.",
    done: "Each role has completed its sessions and can carry out its core tasks.",
  },
  {
    title: "Parallel validation",
    icon: ArrowRightLeft,
    school:
      "The current system kept running for the workflows in scope, and people to compare results.",
    squarecampus: "Side-by-side runs and a list of every difference with its cause.",
    done: "Finance and academic owners agree the results match on the agreed checks.",
  },
  {
    title: "Go-live under guardrails",
    icon: ShieldCheck,
    school: "Approval of the go-live date, and escalation contacts on each side.",
    squarecampus: "A staged launch with named counterparts and an agreed escalation path.",
    done: "The workflows in scope run in SquareCampus, and the old system is retired or kept read-only, as agreed.",
  },
  {
    title: "Adoption follow-through",
    icon: UserRoundCheck,
    school: "Feedback from each role after launch.",
    squarecampus: "Follow-up where teams slip back into spreadsheets and side channels.",
    done: "The success measures agreed at the start are reviewed together.",
  },
] as const;

const rolloutSignals = [
  "Migration is treated as an operating exercise, not only a data import.",
  "Training is role-specific so the platform lands in real institutional behavior.",
  "Parallel runs reduce risk for finance, attendance, communication, and reporting.",
  "Success is measured after go-live, not only at handover.",
] as const;

const buyersQuestions = [
  {
    title: "Who owns the rollout?",
    body: "SquareCampus runs a guided process with named counterparts so institutions are not left coordinating vendors and spreadsheets alone.",
  },
  {
    title: "How do we avoid disruption?",
    body: "By sequencing migration, training, and dry runs around real calendar pressure points such as admissions, fee cycles, and exam windows.",
  },
  {
    title: "What about multiple campuses?",
    body: "The structure is designed to support institution-wide policy, branch-level variation, and phased launches without creating separate systems.",
  },
] as const;

export default function RolloutPage() {
  return (
    <main tabIndex={-1} id="main-content">
      <PageSchema
        name="School ERP Implementation & Migration"
        description="How a SquareCampus rollout runs: institution blueprint, migration clinic, role-based training, parallel validation, staged go-live and adoption follow-through."
        path="/rollout"
      />

      <SectionShell className="pt-12 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <Reveal immediate className="space-y-6">
            <p className="section-kicker">Rollout model</p>
            <h1 className="font-display text-4xl leading-none tracking-[-0.06em] sm:text-5xl lg:text-6xl">
              Go live like an institution, not a software experiment.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[color:var(--muted-foreground)]">
              Schools and colleges do not have the luxury of chaotic launches. SquareCampus rollout
              is designed around migration discipline, role-based training, parallel validation, and
              predictable go-live support.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} />
              <ButtonLink
                href={siteCtas.platformHref}
                label="See the platform"
                variant="secondary"
              />
            </div>
            <div className="grid gap-3 pt-2">
              {rolloutSignals.map((signal) => (
                <div
                  key={signal}
                  className="surface-panel rounded-[1.35rem] px-4 py-3 text-sm leading-6 text-[color:var(--muted-foreground)]"
                >
                  {signal}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal immediate delay={120}>
            <RolloutMockup />
          </Reveal>
        </div>
      </SectionShell>

      {/*
        Deployment paths.

        The site describes SquareCampus three ways — as a connected system that
        replaces fragmented tools, as a layer that coexists with what an
        institution already runs, and as a governed decision layer. Those are
        the same product at three points on one path, but a reader meeting all
        three across /pricing/, /launch-partners/ and here has no way to know
        that. Stated once, on the page about how deployment actually happens,
        so the other pages do not each have to hedge.
      */}
      <SectionShell
        id="deployment-paths"
        eyebrow="Two paths, one product"
        title="Coexistence first. Replacement only when the institution chooses it."
        body="Nothing has to be switched off for a SquareCampus deployment to begin, and nothing is replaced on a vendor’s schedule."
      >
        <Reveal className="grid gap-4 lg:grid-cols-2">
          <div className="surface-panel rounded-[1.6rem] p-6 sm:p-8">
            <p className="section-kicker">Path one · Coexistence</p>
            <h2 className="mt-4 font-display text-2xl tracking-[-0.04em]">
              A bounded deployment runs alongside the current stack.
            </h2>
            <p className="mt-3 text-base leading-7 text-[color:var(--muted-foreground)]">
              One campus, or one workflow bundle. The existing ERP, LMS, payment portal and identity
              provider stay in place and stay authoritative. SquareCampus governs the workflow that
              runs across them — routing exceptions, assigning ownership, recording what was decided
              — while critical numbers are validated in parallel.
            </p>
          </div>
          <div className="surface-quiet rounded-[1.6rem] p-6 sm:p-8">
            <p className="section-kicker">Path two · Consolidation</p>
            <h2 className="mt-4 font-display text-2xl tracking-[-0.04em]">
              A later rollout may replace selected fragmented tools.
            </h2>
            <p className="mt-3 text-base leading-7 text-[color:var(--muted-foreground)]">
              When the institution decides to — after the evidence exists, and workflow by workflow.
              Consolidation is an outcome an institution can choose, never a precondition of
              starting. There is no compulsory rip-and-replace at any point.
            </p>
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="Six stages"
        title="What each stage needs, delivers and signs off"
        body="A stage is complete only when its criteria are met, so nothing moves forward on a date alone. Timelines are agreed in writing during scoping."
      >
        {/* Redundant by design: it animates exactly the six stages listed
            below, so it is hidden from assistive technology rather than read
            out twice. */}
        <Reveal className="mb-5">
          <MotionFigure
            asset={motionAssets["rollout-path"]}
            redundant
            className="mx-auto w-full max-w-4xl"
          />
        </Reveal>

        <Reveal staggerChildren className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rolloutSteps.map((step, index) => (
            <article
              key={step.title}
              data-reveal-item
              className="surface-panel rounded-[1.6rem] p-6"
            >
              <div className="flex items-center justify-between">
                <step.icon className="size-5 text-[color:var(--brand)]" />
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
                  Stage {index + 1}
                </span>
              </div>
              <h3 className="mt-5 font-display text-2xl tracking-[-0.04em]">{step.title}</h3>
              <dl className="mt-4 grid gap-3 text-sm leading-6">
                <div>
                  <dt className="font-medium text-foreground">The school provides</dt>
                  <dd className="mt-0.5 text-[color:var(--muted-foreground)]">{step.school}</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">SquareCampus delivers</dt>
                  <dd className="mt-0.5 text-[color:var(--muted-foreground)]">
                    {step.squarecampus}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">Done when</dt>
                  <dd className="mt-0.5 text-[color:var(--muted-foreground)]">{step.done}</dd>
                </div>
              </dl>
            </article>
          ))}
        </Reveal>
        <Reveal delay={80} className="mt-4">
          <div className="surface-panel rounded-[1.4rem] px-5 py-4 text-sm leading-6 text-[color:var(--muted-foreground)] sm:px-6">
            <p className="font-medium text-[color:var(--foreground)]">Migration dependencies</p>
            <p className="mt-1.5">
              Migration moves as fast as your data and your current vendor&rsquo;s exports allow. It
              is included from Pro and quoted on Starter. Anything the old system cannot supply is
              flagged before go-live, and the parallel run ends when the checks pass, not on a date.
            </p>
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="Operator confidence"
        title="What a switch has to protect"
        body="Admissions, fees and results cannot pause for a system change, so the rollout is sequenced around them."
      >
        <Reveal className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-panel rounded-[1.8rem] p-7">
            <p className="section-kicker">What the rollout must protect</p>
            <div className="mt-5 grid gap-3">
              {[
                "Admission teams cannot lose pipeline visibility during switch-over.",
                "Finance teams need confidence around dues, receipts, and approval trails.",
                "Academic leaders need continuity across attendance, assessments, and communication.",
                "Institution leadership needs a single owner for coordination and escalation.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.2rem] bg-[color:var(--surface-muted)] px-4 py-4 text-sm leading-6 text-[color:var(--muted-foreground)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            {buyersQuestions.map((question) => (
              <div key={question.title} className="surface-panel rounded-[1.6rem] p-6">
                <Handshake className="size-5 text-[color:var(--teal)]" />
                <h2 className="mt-5 font-display text-2xl tracking-[-0.04em]">{question.title}</h2>
                <p className="mt-3 text-base leading-7 text-[color:var(--muted-foreground)]">
                  {question.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell className="pb-22">
        <Reveal className="surface-panel-strong rounded-[2rem] p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="section-kicker">Next step</p>
              <h2 className="mt-4 font-display text-3xl tracking-[-0.05em] sm:text-4xl">
                Bring your current patchwork and launch constraints to the table.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted-foreground)]">
                We can map your institution’s current operating stack, outline a rollout path, and
                show where SquareCampus would sit alongside what you already run — and where it
                would eventually replace complexity, without destabilizing the term in motion.
              </p>
            </div>
            <div className="grid gap-3">
              <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} />
              <ButtonLink
                href={siteCtas.whyDifferentHref}
                label="Why SquareCampus"
                variant="secondary"
              />
            </div>
          </div>
        </Reveal>
      </SectionShell>
    </main>
  );
}
