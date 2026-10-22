import {
  ArrowRightLeft,
  BadgeCheck,
  Building2,
  Bus,
  CalendarClock,
  FileSpreadsheet,
  Fingerprint,
  GraduationCap,
  MessageSquareShare,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AvailabilityNote } from "@/components/site/availability-note";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@fairhelm/ui/components/accordion";
import { identity, pricingAvailability } from "@/content/commercial";
import { intentPages } from "@/content/intent-pages";
import { ctaLabels, siteCtas } from "@/content/site-content";
import { createBreadcrumbSchema, createWebPageSchema, SEO_CONFIG } from "@/lib/seo";

const securityPackMailto =
  "mailto:security@squarecampus.com?subject=Security%20%26%20Compliance%20Pack%20Request%20-%20%5BSchool%20Name%5D&body=Hello%20SquareCampus%20Security%20Team%2C%0A%0AWe%20would%20like%20to%20request%20your%20Security%20%26%20Compliance%20Pack.%0A%0ASchool%20name%3A%20%5BYour%20School%20Name%5D%0AContact%20name%3A%20%5BYour%20Name%5D%0ARole%3A%20%5BTitle%20%2F%20Department%5D%0AEmail%3A%20%5BWork%20Email%5D%0APhone%3A%20%5BPhone%20Number%5D%0AStudent%20count%3A%20%5BApproximate%5D%0ACampuses%3A%20%5BNumber%20of%20Campuses%5D%0ASpecific%20requirements%3A%20%5BOptional%5D%0A%0AThank%20you%2C%0A%5BYour%20Name%5D";

const faqItems = [
  {
    question: "What is a school management system?",
    answer:
      "A school management system is a unified platform that runs daily operations like admissions, attendance, fees, exams, communication, and compliance. SquareCampus is a school management system designed specifically for Indian schools so every stakeholder works from one source of truth.",
  },
  {
    question: "How is SquareCampus different from legacy school ERPs?",
    answer:
      "Legacy ERPs bolt modules together and feel like separate products. SquareCampus is architected as one operating system: a unified institutional data model, consistent workflows, and human support included.",
  },
  {
    question: "Does SquareCampus handle Indian fee structures and compliance?",
    answer:
      "Yes. We support complex fee terms, concessions, transport, late fees, GST, audit exports, and compliance-friendly audit trails. Multi-campus structures are built-in, not custom scripts.",
  },
  {
    question: "How fast can we go live?",
    answer:
      "Rollout is guided and sequenced around your academic calendar. We import historical data, run a parallel dry run, train admins and teachers, and then go live with a rollback plan ready. Timelines depend on data complexity and are agreed before we start.",
  },
  {
    question: "Is there a mobile experience for parents and staff?",
    answer:
      "Yes. Parents get attendance, fees, transport, messages, and results in one app. Staff handle attendance, approvals, communication, and tasks without desktop friction.",
  },
  {
    question: "How is data secured inside the school management system?",
    answer:
      "Role-based access, scoped permissions, encryption in transit and at rest, activity logs, and export controls are part of the product design. Every action is traceable to a user and timestamp.",
  },
  {
    question: "How is school data protected and accessed securely?",
    answer:
      "Access is role-based and scoped by campus, department, and workflow. Data is encrypted in transit and at rest, and audit trails show every change with user and timestamp.",
  },
  {
    question: "Can we see documentation for your security posture?",
    answer:
      "Yes. We can share a security and compliance pack with data flow summaries, subprocessors, and incident response overview upon request.",
  },
  {
    question: "Do you support single sign-on with our identity provider?",
    answer: `Every plan includes SquareCampus-managed credentials with role-based access. ${identity.sso.body} ${identity.enterprise.body}`,
  },
  {
    question: "What does pricing look like?",
    answer: `${pricingAvailability.short} ${pricingAvailability.model} ${pricingAvailability.included} Anything optional, such as custom integrations, is shown in the proposal before signature.`,
  },
  {
    question: "Can SquareCampus integrate with our existing tools?",
    answer:
      "Yes, as scoped work. There is no catalogue of pre-built connectors: each integration is assessed during discovery and confirmed in writing.",
  },
  {
    question: "Will teachers and admins need heavy training?",
    answer:
      "No. Interfaces follow existing workflows, not abstract menus. We deliver role-based onboarding, videos, and live sessions until adoption is steady.",
  },
] as const;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const workflowModules = [
  {
    title: "Admissions to Enrolment",
    icon: GraduationCap,
    body: "Inquiry → application → document verification → fee collection → section allocation. Parents see status; admins see where each application is stuck.",
  },
  {
    title: "Attendance to Fees",
    icon: Wallet,
    body: "Daily attendance updates fee rules, transport billing, and alerts to guardians. Exceptions are logged with reasons and approvers.",
  },
  {
    title: "Exams to Promotions",
    icon: BadgeCheck,
    body: "Schedule exams, capture marks, publish results, and roll promotions with auditability. Grade templates match CBSE/ICSE norms.",
  },
  {
    title: "Approvals to Audit Trails",
    icon: Fingerprint,
    body: "Leave, concessions, refunds, procurements, and gate passes run through RBAC-backed workflows with time-stamped approvals.",
  },
  {
    title: "Communication to Resolution",
    icon: MessageSquareShare,
    body: "Role-aware messaging to parents, staff, and students with templates, delivery status, and escalation paths.",
  },
  {
    title: "Transport to Compliance",
    icon: Bus,
    body: "Vehicle, route, and driver management with attendance sync and safety checks documented for audits.",
  },
] as const;

const comparisonRows = [
  {
    title: "Architecture",
    us: "One unified institutional data model, shared workflows, consistent UX.",
    them: "Multiple products bolted together with custom scripts.",
  },
  {
    title: "Implementation",
    us: "Guided rollout with parallel run and live training.",
    them: "Months of customization tickets and delays.",
  },
  {
    title: "Pricing",
    us: "All modules included; mobile apps included; transparent renewals.",
    them: "Per-module upsells, per-user fees, hidden mobile costs.",
  },
  {
    title: "Support",
    us: "Human-first, context-aware support with product and ops in the same room.",
    them: "Ticket queues with generic replies and slow escalations.",
  },
] as const;

export default function SchoolManagementSystemPage() {
  const pageUrl = `${SEO_CONFIG.baseUrl}/school-management-system`;

  const webPageSchema = createWebPageSchema({
    name: "School Management System for Indian Schools",
    description:
      "SquareCampus is a school management system built for Indian schools-fees, attendance, exams, communication, and compliance in one unified School OS.",
    url: pageUrl,
  });

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: SEO_CONFIG.baseUrl },
    { name: "School Management System", url: pageUrl },
  ]);

  return (
    <main tabIndex={-1} id="main-content">
      <SectionShell className="pt-12 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <Reveal immediate className="space-y-6">
            <p className="section-kicker">School management system</p>
            <h1 className="font-display text-4xl leading-none tracking-[-0.06em] sm:text-5xl lg:text-6xl">
              School management system built for Indian schools.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              A school management system should be the operating manual of your campus — not a stack
              of disconnected tools. Sometimes labeled school ERP software, SquareCampus is a School
              OS built for India: admissions, attendance, fees, exams, communication, transport, and
              compliance stay connected so nothing slips.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Guided rollout", "One governed record", "Audit-ready by design"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-(--line) bg-(--surface) px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} />
              <ButtonLink
                href={siteCtas.ecosystemHref}
                label="See how workflows connect"
                variant="secondary"
              />
            </div>
          </Reveal>

          <Reveal immediate delay={120} className="surface-panel-strong rounded-[2rem] p-5 lg:p-6">
            <div className="flex items-center justify-between font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
              <span>One view, zero chaos</span>
              <span className="inline-flex items-center gap-2">
                <span className="size-1.5 animate-pulse rounded-full bg-(--teal)" />
                Live workflow
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Admins, teachers, and finance teams share the same source of truth. No swivel
              chairing, no manual reconciliations, no &ldquo;who updated this?&rdquo; mysteries.
            </p>
            <div className="mt-4 overflow-hidden rounded-[1.4rem] border border-(--line)">
              <Image
                src="/images/marketing/dashboard.webp"
                alt="SquareCampus school management system dashboard preview for Indian schools"
                width={960}
                height={540}
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                ["Time to launch", "Guided rollout"],
                ["Modules included", "Unified platform"],
                ["Support", "Human + product"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[1.2rem] border border-(--line) bg-(--surface) p-3"
                >
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow="Definition"
        title="What is a school management system?"
        body="It is the operating core that coordinates academics, finance, and communication. In India, you might also hear it called school ERP software or school management software. A true school management system connects attendance with fees, ties assessments to promotion decisions, and keeps parents and staff aligned without duplicate data entry. SquareCampus treats this definition as engineering spec, not marketing copy."
      >
        <Reveal className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-panel-strong rounded-[1.8rem] p-7">
            <p className="section-kicker">Operating loop</p>
            <div className="mt-5 grid gap-3">
              {[
                "Admissions initiate fee plans and onboarding.",
                "Attendance powers compliance and billing.",
                "Assessments connect to promotion decisions.",
                "Communication follows every workflow step.",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-4 rounded-[1.2rem] border border-(--line) bg-(--surface) px-4 py-3.5"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-[0.65rem] text-background">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-[1.2rem] bg-(--surface-muted) px-4 py-3 text-sm leading-6 text-foreground">
              When one workflow moves, the rest follow automatically — no re-entry, no drift.
            </p>
          </div>

          <div className="surface-panel rounded-[1.8rem] p-7">
            <h2 className="font-display text-2xl tracking-[-0.04em]">
              Why schools need a unified system
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Fragmented tools create data drift, parent confusion, and audit risk. A unified OS
              keeps every update consistent, triggers the right follow-up, and makes compliance a
              side-effect of normal work — not an afterthought.
            </p>
            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {[
                "Attendance flows directly into fee rules and reports.",
                "Communication is tied to context — class, term, fee status, or incident.",
                "Exams, grading, and promotions stay in sync with academic calendars.",
                "Transport, hostels, and inventory stay reconciled without extra spreadsheets.",
                "Parents see one story: attendance, dues, announcements, and results.",
                "Staff permissions are scoped by role, location, and workflow step.",
                "Leadership tracks trends in collections, learning, and risk in one place.",
                "Every action is logged for admins, auditors, and compliance reviewers.",
              ].map((item) => (
                <p
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-6 text-muted-foreground"
                >
                  <ArrowRightLeft className="mt-1 size-3.5 shrink-0 text-(--brand)" />
                  {item}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="Solutions by need"
        title="Start from the question you actually have"
        body="Each page opens with a direct answer, then the workflow as it runs, the India-specific realities, and what to check in any vendor."
      >
        <Reveal staggerChildren className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {intentPages.map((page) => (
            <Link
              key={page.slug}
              href={`/${page.slug}/`}
              data-reveal-item
              className="surface-panel group flex flex-col justify-between gap-4 rounded-[1.4rem] p-5 transition-colors hover:border-(--line-strong)"
            >
              <span>
                <span className="block font-display text-lg tracking-[-0.03em] text-foreground">
                  {page.keyword}
                </span>
                <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                  {page.definition.title}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground group-hover:text-(--brand)">
                Read the answer
                <ArrowRightLeft className="size-3" />
              </span>
            </Link>
          ))}
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="Modules as workflows"
        title="Modules inside SquareCampus, explained as workflows"
        body="Feature lists hide the real question: does the work actually connect? Here is how each module is designed to connect."
      >
        <Reveal staggerChildren className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workflowModules.map((item) => (
            <article
              key={item.title}
              data-reveal-item
              className="surface-panel rounded-[1.6rem] p-6"
            >
              <item.icon className="size-5 text-(--brand)" />
              <h3 className="mt-5 font-display text-xl tracking-[-0.03em]">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </Reveal>
        <AvailabilityNote className="mt-4" />
      </SectionShell>

      <SectionShell
        eyebrow="India-first"
        title="Built for Indian schools: fees, compliance, multi-campus"
      >
        <Reveal className="grid gap-4 lg:grid-cols-2">
          <div className="surface-panel rounded-[1.8rem] p-7">
            <Building2 className="size-5 text-(--brand)" />
            <h3 className="mt-5 font-display text-2xl tracking-[-0.04em]">Operational reality</h3>
            <ul className="mt-4 grid gap-2.5">
              {[
                "Handles complex fee plans, concessions, transport slabs, and arrears.",
                "GST-ready invoicing, receipts, and exports to accounting tools.",
                "Region-aware attendance rules and academic calendars.",
                "Designed for India data-residency expectations, with audit logs built in.",
                "Multi-branch hierarchies with shared services and campus-level autonomy.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-6 text-muted-foreground"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-(--teal)" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-panel rounded-[1.8rem] p-7">
            <ShieldCheck className="size-5 text-(--teal)" />
            <h3 className="mt-5 font-display text-2xl tracking-[-0.04em]">
              Security, RBAC &amp; audit trails
            </h3>
            <ul className="mt-4 grid gap-2.5">
              {[
                "Role-based access with fine-grained scopes by campus, department, and module.",
                "Encryption in transit and at rest for sensitive records.",
                "Activity timelines on every record: who changed what, when, and from where.",
                "Export controls designed to prevent data leakage.",
                "Change logs tied to user identity and timestamps.",
                "Designed to support DPDP Act obligations and education data guidelines.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-6 text-muted-foreground"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-(--brand)" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <ButtonLink
                href={securityPackMailto}
                label="Request Security & Compliance Pack"
                variant="secondary"
              />
            </div>
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="Rollout & pricing"
        title="A launch that respects the academic calendar"
      >
        <Reveal className="grid gap-4 lg:grid-cols-2">
          <div className="surface-panel rounded-[1.8rem] p-7">
            <CalendarClock className="size-5 text-(--amber)" />
            <h3 className="mt-5 font-display text-2xl tracking-[-0.04em]">
              Implementation sequence
            </h3>
            <ol className="mt-5 grid gap-3 border-l border-(--line) pl-5">
              {[
                "Scope confirmation, data templates shared, owners assigned.",
                "Data import dry run, key workflows configured, access provisioned.",
                "Parallel run with real data, teacher and admin training.",
                "Go-live with rollback plan, success metrics, and support channel.",
                "Post-launch review, fee-rule tuning, recurring tasks automated.",
              ].map((item) => (
                <li key={item} className="relative text-sm leading-6 text-muted-foreground">
                  <span className="absolute -left-[26px] top-2 size-2 rounded-full bg-(--brand)" />
                  {item}
                </li>
              ))}
            </ol>
          </div>
          <div className="surface-panel rounded-[1.8rem] p-7">
            <FileSpreadsheet className="size-5 text-(--brand)" />
            <h3 className="mt-5 font-display text-2xl tracking-[-0.04em]">Pricing philosophy</h3>
            <ul className="mt-5 grid gap-2.5">
              {[
                "One annual institutional licence — no per-module surprises.",
                "Standard parent and staff mobile apps included; no hidden 'parent app' fees.",
                "Calculated on active enrolled students in progressive volume bands, not usage penalties.",
                "Data migration included from Pro; optional lines are priced before signature.",
                "The model is published on the pricing page; figures follow a written proposal after discovery.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-6 text-muted-foreground"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-(--teal)" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="The comparison"
        title="SquareCampus vs legacy school ERPs"
        body="Choose architecture, not nostalgia. This is the difference between one OS and stitched-together software."
      >
        <Reveal staggerChildren className="grid gap-4 md:grid-cols-2">
          {comparisonRows.map((row) => (
            <article
              key={row.title}
              data-reveal-item
              className="surface-panel rounded-[1.6rem] p-6"
            >
              <p className="section-kicker">{row.title}</p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-[1.2rem] border border-(--line) bg-(--surface-strong) px-4 py-3.5">
                  <p className="text-sm leading-6 text-foreground">
                    <span className="font-medium text-(--brand)">SquareCampus:</span> {row.us}
                  </p>
                </div>
                <div className="rounded-[1.2rem] bg-(--surface-muted) px-4 py-3.5">
                  <p className="text-sm leading-6 text-muted-foreground">
                    <span className="font-medium">Legacy ERPs:</span> {row.them}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </Reveal>
        <div className="mt-6 text-center">
          <ButtonLink
            href="/why-squarecampus"
            label="Read the full breakdown"
            variant="secondary"
          />
        </div>
      </SectionShell>

      <SectionShell eyebrow="FAQs" title="Questions procurement teams ask">
        <Reveal>
          <Accordion className="surface-panel rounded-[1.6rem] px-6">
            {faqItems.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger className="py-5 text-left font-display text-base tracking-[-0.02em] hover:no-underline sm:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="max-w-3xl text-base leading-7 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </SectionShell>

      <SectionShell className="pb-22 pt-0">
        <Reveal className="surface-panel-strong rounded-[2rem] p-8 text-center lg:p-12">
          <p className="section-kicker">School management system</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl tracking-[-0.05em] sm:text-4xl">
            Ready to run every campus day from one operating system?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Book a demo, see your workflows mapped, and launch with a timeline that respects the
            academic calendar.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} />
            <ButtonLink
              href={securityPackMailto}
              label="Request Security & Compliance Pack"
              variant="secondary"
            />
          </div>
        </Reveal>
      </SectionShell>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            // Organization and SoftwareApplication are emitted once, by the
            // root layout, with stable ids. This page used to redeclare both
            // with fewer facts and a different category; nodes here reference
            // those ids instead of restating them.
            "@graph": [
              {
                ...webPageSchema,
                "@id": `${pageUrl}#webpage`,
                primaryImageOfPage: {
                  "@type": "ImageObject",
                  url: "https://squarecampus.com/og/school-management-system.png",
                },
                mainEntity: { "@id": `${SEO_CONFIG.baseUrl}/#org` },
              },
              {
                ...breadcrumbSchema,
                "@id": `${pageUrl}#breadcrumb`,
              },
              {
                ...faqSchema,
                "@id": `${pageUrl}#faq`,
              },
            ],
          }),
        }}
      />
    </main>
  );
}
