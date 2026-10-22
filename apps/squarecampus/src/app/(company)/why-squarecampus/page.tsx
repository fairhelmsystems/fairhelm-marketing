import {
  ArrowRightLeft,
  CircleCheckBig,
  Database,
  FileCheck,
  FileSpreadsheet,
  Layers3,
  Shield,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { FactTable } from "@/components/site/fact-table";
import { PageSchema } from "@/components/site/page-schema";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { ctaLabels, siteCtas } from "@/content/site-content";

/**
 * Evaluation criteria instead of blanket "traditional ERP vs us" claims
 * (audit SC-020): each row is something a buyer can ask any vendor to show,
 * beside how SquareCampus is designed to answer it. No competitor is
 * characterised here; named comparisons live on /compare/, with each
 * competitor's genuine strengths.
 */
const evaluationCriteria = [
  {
    label: "Concession approvals",
    ask: "Grant a sibling concession above the desk's limit. Who approves it, and where is that approval recorded?",
    squareCampus:
      "Concessions follow the institution's limits; anything above a limit goes to a named approver and is recorded on the fee record's audit trail.",
  },
  {
    label: "Cross-campus permissions",
    ask: "Sign in as a campus principal, then as a trust administrator. What can each one see?",
    squareCampus:
      "Access is scoped by role and by campus: a trust role sees across its campuses, a campus role sees its own.",
  },
  {
    label: "Exception ownership",
    ask: "Show an attendance exception. Who owns it, and what closes it?",
    squareCampus:
      "Each exception is routed to a named owner and stays open until it is closed with a recorded reason.",
  },
  {
    label: "Migration validation",
    ask: "How are migrated balances and records checked before the old system is switched off?",
    squareCampus:
      "Trial imports reconcile against agreed checks, and a parallel run continues until finance and academic owners sign off.",
  },
  {
    label: "Exports and exit",
    ask: "What can we take out when we leave — in what format, by when, and at what cost?",
    squareCampus:
      "Export scope, format, timing and charges are agreed in the order form, not left for the day you leave.",
  },
] as const;

const schoolOsPrinciples = [
  {
    title: "The data model is shared",
    icon: Database,
    body: "Admissions, academics, finance, communication, and operations do not compete to define the truth.",
  },
  {
    title: "The workflows are connected",
    icon: Layers3,
    body: "Approvals, communication, attendance, dues, and reporting happen in a coordinated sequence rather than across disconnected tabs.",
  },
  {
    title: "The institution is visible now",
    icon: FileSpreadsheet,
    body: "Leaders operate with current signals, not after-action exports assembled under pressure.",
  },
  {
    title: "The trust posture is product-level",
    icon: Shield,
    body: "Auditability and access control are part of the product design, and availability and recovery are documented in writing during security review.",
  },
] as const;

const switchingReasons = [
  "The institution wants fewer tools without losing admissions, fees, exams or reporting capability.",
  "Leadership wants live visibility instead of delayed reporting rituals.",
  "Finance and compliance teams need controls that survive real scrutiny.",
  "Parents and staff need one clear place for notices, dues and follow-ups instead of several apps and message threads.",
] as const;

export default function WhyDifferentPage() {
  return (
    <main tabIndex={-1} id="main-content">
      <PageSchema
        name="Why SquareCampus"
        description="Why institutions choose a School Operating System over a conventional school ERP: ownership, exception handling, auditability and leadership visibility."
        path="/why-squarecampus"
      />

      <SectionShell className="pt-12 sm:pt-16">
        <Reveal immediate className="space-y-6">
          <p className="section-kicker">Why SquareCampus</p>
          <h1 className="max-w-4xl font-display text-4xl leading-none tracking-[-0.06em] sm:text-5xl lg:text-6xl">
            Not a rebranded ERP. Not a bundle of point tools.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-[color:var(--muted-foreground)]">
            SquareCampus is school management software built as a connected School OS. Admissions,
            academics, fees and communication share one record, and the approvals, owners and audit
            history that connect them sit on that record too.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} />
            <ButtonLink href={siteCtas.platformHref} label="View platform" variant="secondary" />
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="How to evaluate"
        title="Five things to check in any school management system"
        body="Differences you can verify in a demo, including in ours."
      >
        <Reveal>
          <FactTable
            caption="Evaluation criteria to check in any school management system, and how SquareCampus is designed to answer each."
            columns={[
              { key: "ask", label: "Ask any vendor to show you" },
              { key: "squareCampus", label: "How SquareCampus is designed to answer" },
            ]}
            rows={evaluationCriteria.map((row) => ({
              label: row.label,
              values: [row.ask, row.squareCampus],
            }))}
          />
        </Reveal>
        <Reveal delay={80} className="mt-4">
          <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
            Comparing against a named product?{" "}
            <Link
              href="/compare/"
              className="text-[color:var(--foreground)] underline underline-offset-4"
            >
              Our comparison pages
            </Link>{" "}
            list each competitor&rsquo;s genuine strengths and when it is the better fit.
          </p>
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="What the label commits us to"
        title="What “School OS” means in practice"
        body="Four properties you can ask to see in a demo. If a system cannot show them, the label does not apply."
      >
        <Reveal staggerChildren className="grid gap-4 md:grid-cols-2">
          {schoolOsPrinciples.map((item) => (
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
      </SectionShell>

      <SectionShell
        eyebrow="Why institutions move"
        title="Where the conversation usually starts"
        body="Usually with one pressure point — fees, reporting, admissions, communication or compliance. Underneath it, the work is often split across tools that do not share a record."
      >
        <Reveal className="grid gap-4 lg:grid-cols-[1fr_0.92fr]">
          <div className="surface-panel rounded-[1.8rem] p-7">
            <p className="section-kicker">Common switch triggers</p>
            <div className="mt-5 grid gap-3">
              {switchingReasons.map((reason) => (
                <div
                  key={reason}
                  className="rounded-[1.2rem] bg-[color:var(--surface-muted)] px-4 py-4 text-sm leading-6 text-[color:var(--muted-foreground)]"
                >
                  {reason}
                </div>
              ))}
            </div>
          </div>
          <div className="surface-panel-strong rounded-[1.8rem] p-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-2 text-sm text-[color:var(--foreground)]">
              <Sparkles className="size-4 text-[color:var(--amber)]" />
              What “different” looks like in practice
            </div>
            <div className="mt-5 grid gap-3">
              {[
                {
                  icon: ArrowRightLeft,
                  text: "One system replaces fragmented vendor management and repeated internal workarounds.",
                },
                {
                  icon: FileCheck,
                  text: "Audit-friendly operations stop depending on who remembered to export or forward the right spreadsheet.",
                },
                {
                  icon: CircleCheckBig,
                  text: "Fee deadlines, inspections and board reviews are handled from one record instead of a scramble for spreadsheets.",
                },
              ].map((item) => (
                <div
                  key={item.text}
                  className="rounded-[1.2rem] border border-[color:var(--line)] bg-[color:var(--surface)] px-4 py-4 text-sm leading-6 text-[color:var(--muted-foreground)]"
                >
                  <item.icon className="mb-3 size-4 text-[color:var(--brand)]" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell className="pb-22">
        <Reveal className="surface-panel-strong rounded-[2rem] p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
            <div>
              <p className="section-kicker">See it in context</p>
              <h2 className="mt-4 font-display text-3xl tracking-[-0.05em] sm:text-4xl">
                Compare the School OS model against your current stack.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted-foreground)]">
                The most useful demo is usually a direct comparison between your current operating
                reality and the connected model SquareCampus is designed to provide.
              </p>
            </div>
            <div className="grid gap-3">
              <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} />
              <ButtonLink
                href={siteCtas.rolloutHref}
                label="See rollout model"
                variant="secondary"
              />
            </div>
          </div>
        </Reveal>
      </SectionShell>
    </main>
  );
}
