import {
  ArrowUpRight,
  BellRing,
  BookOpenCheck,
  Building2,
  CalendarRange,
  ClipboardCheck,
  Eye,
  IndianRupee,
  Languages,
  LockKeyhole,
  MessageSquareText,
  ShieldCheck,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";
import { AegisConsoleVisual } from "@/components/site/aegis-console-visual";
import { Container } from "@/components/site/container";
import { CtaBand } from "@/components/site/cta-band";
import { FeatureCard } from "@/components/site/feature-card";
import { Hero } from "@/components/site/hero";
import { JsonLd } from "@/components/site/json-ld";
import { PageNav } from "@/components/site/page-nav";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata = createPageMetadata({
  title: "SquareCampus — School Operating System by Fairhelm Systems",
  description:
    "SquareCampus is the School Operating System developed and operated by Fairhelm Systems for schools, universities and multi-campus educational institutions in India. Product detail, security documentation and pricing live on squarecampus.com.",
  path: "/squarecampus/",
});

/**
 * Where an evaluator should go next. The canonical product site holds the
 * product definition, platform, security, pricing model and rollout; this
 * page establishes operator context and hands over.
 */
const canonicalProductPages = [
  [
    "What is SquareCampus",
    "what-is-squarecampus/",
    "The canonical definition, the layers it is built from, and the direct answer to whether it is an ERP.",
  ],
  [
    "Platform",
    "platform/",
    "How the School Operating System is structured and the operating cycles it carries.",
  ],
  [
    "Security and identity",
    "security/",
    "Design posture for encryption, role-based access, auditability and India-first hosting.",
  ],
  [
    "Pricing model",
    "pricing/",
    "How the licence is structured and what a written proposal follows. No figures are published on fairhelmsystems.com.",
  ],
  [
    "Rollout",
    "rollout/",
    "Guided implementation sequenced around the academic calendar, and the deployment paths available.",
  ],
] as const;

const operatingCycles = [
  {
    icon: UserRoundPlus,
    title: "Admissions and enrolment",
    motif: "funnel" as const,
    description:
      "Connect inquiry, application, documents, offers, enrolment and the handoff into live academic and fee records.",
  },
  {
    icon: CalendarRange,
    title: "Academic year control",
    motif: "orbit" as const,
    description:
      "Structure setup, rollover, promotion and reporting around explicit academic windows and governed transitions.",
  },
  {
    icon: ClipboardCheck,
    title: "Attendance cycles",
    motif: "ticks" as const,
    description:
      "Capture, exceptions, corrections, approvals and communication designed as a recurring operating discipline.",
  },
  {
    icon: IndianRupee,
    title: "Fee cycles",
    motif: "ledger" as const,
    description:
      "Model schedules, collections, concessions, reconciliation and outstanding action without losing institutional context.",
  },
  {
    icon: BookOpenCheck,
    title: "Exams and reporting",
    motif: "bars" as const,
    description:
      "Plan assessments, govern marks workflows, compile outcomes and produce reporting with clear accountability.",
  },
  {
    icon: MessageSquareText,
    title: "Parent and staff workflows",
    motif: "waves" as const,
    description:
      "Role-aware communication and administrative action that respects school policy and operational boundaries.",
  },
  {
    icon: Building2,
    title: "Trust governance",
    motif: "partition" as const,
    description:
      "A portfolio view for educational trusts and multi-school groups without flattening each institution's authority.",
  },
  {
    icon: Languages,
    title: "Multilingual communication",
    motif: "grid" as const,
    description:
      "Adapt parent-facing communication to language needs while keeping one structured institutional record underneath.",
  },
];

const posture = [
  {
    icon: ShieldCheck,
    title: "Role-aware by design",
    motif: "key" as const,
    description: "Every surface should respect institutional role, scope and delegated authority.",
  },
  {
    icon: LockKeyhole,
    title: "Privacy and separation",
    motif: "mesh" as const,
    description:
      "Customer data boundaries, tenant separation and least privilege shape the architecture.",
  },
  {
    icon: Eye,
    title: "Auditable operations",
    motif: "ledger" as const,
    description:
      "Important actions should leave an intelligible record that authorised teams can review.",
  },
];

const aegis = [
  [Eye, "Read-only first", "Retrieve and explain before proposing action."],
  [UsersRound, "RBAC-aware", "Answers respect the user's authorised scope."],
  [BellRing, "Audit-backed", "Important interactions are designed for traceability."],
  [
    LockKeyhole,
    "No autonomous writes in v1",
    "Human approval and established workflows remain decisive.",
  ],
] as const;

export default function SquareCampusPage() {
  return (
    <>
      {/* The SquareCampus product entity itself is in the site-wide graph
          (see layout.tsx), so this page adds only its breadcrumb. */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "SquareCampus", path: "/squarecampus/" },
        ])}
      />
      <Hero
        eyebrow="SquareCampus · Fairhelm Systems flagship product"
        title="The School Operating System built and operated by Fairhelm Systems."
        highlight="School Operating System"
        description={siteConfig.product.description}
        primary={{
          label: "Visit squarecampus.com",
          href: siteConfig.product.url,
        }}
        secondary={{ label: "Discuss a pilot", href: "/contact/" }}
        bullets={[
          "Schools, universities and multi-campus groups",
          "Admissions, attendance, fees, exams, reporting",
          "AEGIS governed intelligence inside the product",
          "Trust-level governance, campus-level autonomy",
        ]}
      >
        <AegisConsoleVisual />
      </Hero>

      <section className="section border-b border-border">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <SectionHeading
            eyebrow="Evaluating SquareCampus"
            title="The product lives on squarecampus.com. This page is the operator context."
            description={`${siteConfig.product.relationship} Institutions should evaluate the product there; this site records who builds and operates it and how to reach the company.`}
          />
          <Reveal className="panel p-2.5 sm:p-3">
            <ol className="panel-inner divide-y divide-border">
              {canonicalProductPages.map(([title, path, description], index) => (
                <li
                  key={path}
                  className="group/row relative grid gap-3 p-5 transition-colors hover:bg-accent/40 first:rounded-t-[calc(var(--radius-panel)-0.5rem)] last:rounded-b-[calc(var(--radius-panel)-0.5rem)] sm:grid-cols-[3rem_1fr_auto] sm:items-start sm:gap-5 sm:p-6"
                >
                  <span className="index pt-1.5">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="display-3">
                      <a
                        href={`${siteConfig.product.url}${path}`}
                        className="after:absolute after:inset-0 focus-visible:outline-none"
                      >
                        {title}
                      </a>
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{description}</p>
                  </div>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="hidden size-4 shrink-0 text-muted-foreground transition-colors group-hover/row:text-[color:var(--brand-ink)] sm:mt-1.5 sm:block"
                  />
                </li>
              ))}
            </ol>
          </Reveal>
        </Container>
      </section>

      <section className="section">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <SectionHeading
            eyebrow="The problem with generic ERPs"
            title="A module list is not an operating model."
            description="Schools do not simply collect records. They execute recurring cycles under policy, deadlines, role boundaries, parent expectations and trust oversight. SquareCampus is designed around that reality."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [
                "Cycles over screens",
                "Work is organised around windows, handoffs, exceptions and closure, not isolated forms.",
              ],
              [
                "Trust-aware authority",
                "Institution-level autonomy and group-level governance need to coexist without ambiguity.",
              ],
              [
                "Operational intelligence",
                "Leadership should see what needs attention, why it matters and who owns the next action.",
              ],
              [
                "Respectful constraints",
                "Sensitive action requires explicit authority, audit context and predictable boundaries.",
              ],
            ].map(([title, description], index) => (
              <FeatureCard
                key={title}
                index={String(index + 1).padStart(2, "0")}
                title={title}
                description={description}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="section border-y border-border section-alt">
        <Container>
          <SectionHeading
            eyebrow="Cycle-native architecture"
            title="Built around the work schools repeat, and the pressure points they cannot ignore."
            description="SquareCampus connects each operating cycle to its owners, evidence, exceptions and governance context."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {operatingCycles.map((cycle) => (
              <FeatureCard key={cycle.title} {...cycle} />
            ))}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <SectionHeading
            eyebrow="Trust Command Center"
            title="One governed view across the institution portfolio."
            description="The Trust Command Center is built for oversight without blunt centralisation: shared definitions, exception visibility, institutional context and accountable drilldowns across schools."
          />
          <div className="panel p-2.5 sm:p-3">
            <div className="panel-inner grid gap-3 p-4 sm:p-5">
              {[
                [
                  "Portfolio state",
                  "Understand which institutions are on track and which need intervention.",
                ],
                [
                  "Comparable signals",
                  "Use governed metric definitions without erasing local context.",
                ],
                [
                  "Exception ownership",
                  "Route attention to the right operator with evidence and accountability.",
                ],
                [
                  "Boardroom readiness",
                  "Move from report assembly to a consistent operational narrative.",
                ],
              ].map(([title, description], index) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-2xl border border-border bg-card/70 p-4"
                >
                  <span className="index mt-1">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="section border-y border-border section-alt">
        <Container className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="AEGIS"
              title="Governed intelligence, not an unsupervised actor."
              description="Adaptive Enterprise Governance & Intelligence System helps authorised users ask better questions across governed institutional data. The v1 posture is deliberately constrained."
            />
            <p className="mt-6 font-heading text-xl text-foreground">
              Ask AEGIS. Don&apos;t chase reports.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {aegis.map(([Icon, title, description]) => (
              <FeatureCard key={title} icon={Icon} title={title} description={description} />
            ))}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <SectionHeading
            eyebrow="Privacy and auditability"
            title="Institutional data deserves institutional-grade boundaries."
            description="SquareCampus is designed around explicit ownership, privacy-conscious handling and clear records of material action. This is a product posture, not a claim of certification."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {posture.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </Container>
      </section>

      <section className="section border-y border-border section-alt">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <SectionHeading
            eyebrow="Deployment philosophy"
            title="Deliberate rollout over big-bang theatre."
          />
          <div className="grid gap-6 text-base leading-7 text-muted-foreground sm:grid-cols-2">
            <p>
              Start with institutional context, data boundaries, roles, cycles and the operating
              outcome that matters. Then sequence capability around adoption and control, not a
              feature checklist.
            </p>
            <p>
              Pilot discussions focus on product fit and design-partner alignment. Capabilities
              described here represent platform direction unless confirmed explicitly for a
              contracted scope.
            </p>
          </div>
        </Container>
      </section>

      <PageNav
        items={[
          {
            eyebrow: "Canonical product site",
            title: "Evaluate on squarecampus.com",
            description: "Platform, security, pricing model, rollout and commercial programmes.",
            href: siteConfig.product.url,
          },
          {
            eyebrow: "Company",
            title: "About Fairhelm Systems",
            description:
              "Who builds and operates SquareCampus, and the bounded engineering work alongside it.",
            href: "/about/",
          },
        ]}
      />

      <CtaBand
        title="Build the School OS around the institution, not the other way around."
        description="Talk to Fairhelm Systems about a SquareCampus pilot or a design-partner discussion."
        label="Discuss SquareCampus"
      />
    </>
  );
}
