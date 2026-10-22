import { Database, Landmark, Lock, Network, Server, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { PageSchema } from "@/components/site/page-schema";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@fairhelm/ui/components/accordion";
import { ctaLabels, siteCtas } from "@/content/site-content";
import { createPageMetadata } from "@/lib/seo";

// Rule of this page: every statement is either a design decision we can show,
// or an offer to document specifics during a security review. No numbers we
// cannot evidence, no absolutes, no fabricated status indicators.

export const metadata: Metadata = createPageMetadata({
  title: "Infrastructure",
  description:
    "How SquareCampus infrastructure is designed: Microsoft Azure in India, encryption in transit and at rest, an India data-residency posture, and Enterprise private deployment on AWS — with documentation available through the security review process.",
  path: "/infrastructure",
  ogImage: "https://squarecampus.com/og/infrastructure.png",
});

const heroSignals = [
  ["Cloud", "Microsoft Azure"],
  ["Region", "India"],
  ["Residency", "India-first posture"],
  ["Encryption", "Transit & at rest"],
] as const;

const comparisonData = [
  {
    category: "Data residency",
    us: {
      title: "Microsoft Azure, India",
      details:
        "The platform is hosted on Microsoft Azure in India. The specific regions and data flows are named in writing during evaluation.",
    },
    them: {
      title: "“India” (unspecified)",
      details: "Often vague: an India endpoint can sit in front of infrastructure hosted anywhere.",
      ask: "Which region and provider, in writing?",
    },
  },
  {
    category: "Reliability design",
    us: {
      title: "Documented resilience",
      details:
        "High availability, backup and recovery design are documented in writing and shared during evaluation, so the answer is specific to your deployment rather than a marketing line.",
    },
    them: {
      title: "Single location",
      details: "One facility means one point of failure and manual recovery.",
      ask: "What is your recovery plan if the building fails?",
    },
  },
  {
    category: "Physical security",
    us: {
      title: "Microsoft Azure data centres",
      details:
        "Azure facilities carry independent certifications (published by Microsoft). Our application-level controls are documented separately and shared on request.",
    },
    them: {
      title: "“Secure” (undefined)",
      details: "Varies widely; sometimes a locked room with no third-party attestation.",
      ask: "Can you share any third-party attestation?",
    },
  },
  {
    category: "Scalability",
    us: {
      title: "Cloud auto-scaling",
      details:
        "Capacity can be added for admission season and exam-week load without hardware purchases, in the same region.",
    },
    them: {
      title: "Hardware bottleneck",
      details: "Physical servers must be ordered, shipped, and installed to grow.",
      ask: "How do you handle a 10x load spike?",
    },
  },
  {
    category: "Transparency",
    us: {
      title: "Questions answered in writing",
      details:
        "We answer infrastructure questionnaires in writing and share architecture documentation during the security review process.",
    },
    them: {
      title: "Vague claims",
      details: "“Own servers” without documentation is a marketing line, not an architecture.",
      ask: "Will you put your answers in writing?",
    },
  },
] as const;

const capabilities = [
  {
    icon: Server,
    title: "Built to stay available",
    body: "The platform runs on a hyperscale cloud designed so that a problem in one facility does not take daily campus operations down. The availability design for your deployment is documented during security review.",
  },
  {
    icon: Database,
    title: "Backups by design",
    body: "Backup cadence, retention and restore procedures are documented in writing and shared during security review.",
  },
  {
    icon: ShieldCheck,
    title: "Encryption as baseline",
    body: "Data is encrypted in transit and at rest as baseline infrastructure, with access controlled by roles and administrative activity logged.",
  },
  {
    icon: Lock,
    title: "India residency posture",
    body: "The platform is designed to keep institutional data in Microsoft Azure regions in India. Enterprise private deployments on AWS, in a private cloud or on premises are scoped with the same residency expectations.",
  },
  {
    icon: Network,
    title: "Layered network protections",
    body: "Application servers are designed to sit behind managed network protections rather than being directly exposed to the internet.",
  },
] as const;

const faqData = [
  {
    question: "Why a hyperscale cloud instead of “own servers”?",
    answer:
      "Data residency is defined by where data physically sits and how access is governed — not by who owns the racks. Microsoft Azure in India gives us mature managed services, availability zones within an Indian region, and independently certified facilities, which is a stronger foundation than self-managed hardware for a platform schools depend on daily. Institutions that need their own boundary can scope an Enterprise private deployment on AWS, in a private cloud or on premises.",
  },
  {
    question: "How do we verify where our data is hosted?",
    answer:
      "Ask us in writing. During evaluation we share architecture documentation describing the region, the residency controls, and the data flows, and we support vendor security questionnaires. We would rather answer specific questions than ask you to take a marketing page on faith.",
  },
  {
    question: "What happens if a data centre has an outage?",
    answer:
      "Availability, recovery objectives and procedures are documented in writing and shared during the security review process.",
  },
  {
    question: "Is our data encrypted?",
    answer:
      "Yes — in transit and at rest, as part of the platform's baseline design. Key management and implementation details are covered in the security documentation we share on request.",
  },
  {
    question: "Can you complete our security questionnaire?",
    answer:
      "Yes. Send it to security@squarecampus.com. We answer infrastructure and security questionnaires in writing as part of institutional procurement.",
  },
] as const;

const dueDiligenceQuestions = [
  {
    question: "What region and provider host our data?",
    whyItMatters: "“Hosted in India” without a named region and provider is unverifiable.",
    ourAnswer:
      "Microsoft Azure in India. The specific regions and data flows are documented in writing during evaluation.",
  },
  {
    question: "What happens when a facility fails?",
    whyItMatters: "This separates a real architecture from a single server in a rack.",
    ourAnswer:
      "Availability design, recovery objectives and procedures are part of the documentation we share during security review.",
  },
  {
    question: "Can you share third-party attestations?",
    whyItMatters:
      "Anyone can say “secure”. Attestation and documentation are what procurement can rely on.",
    ourAnswer:
      "Microsoft publishes Azure's facility certifications. Our application-level security documentation is shared on request, and we support vendor questionnaires.",
  },
  {
    question: "Will you answer these questions in writing?",
    whyItMatters: "Verbal assurances do not survive procurement or audits.",
    ourAnswer: "Yes — every answer above, in writing, addressed to your institution.",
  },
] as const;

export default function InfrastructurePage() {
  return (
    <main tabIndex={-1} id="main-content">
      <PageSchema
        name="Infrastructure"
        description="SquareCampus deployment and hosting architecture: Indian cloud regions, data residency posture, isolation options and operational resilience."
        path="/infrastructure"
      />

      <SectionShell className="pt-12 sm:pt-16">
        <Reveal immediate className="max-w-3xl space-y-6">
          <p className="section-kicker">Infrastructure</p>
          <h1 className="font-display text-4xl leading-none tracking-[-0.06em] sm:text-5xl lg:text-6xl">
            Infrastructure, stated plainly.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            SquareCampus is hosted on Microsoft Azure in India. This page describes how the platform
            is designed — and anything it does not answer, we will answer in writing during your
            evaluation.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2 lg:grid-cols-4">
            {heroSignals.map(([label, value]) => (
              <div key={label} className="surface-panel rounded-[1.2rem] p-4">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
                  {label}
                </p>
                <p className="mt-2 font-display text-lg tracking-[-0.03em]">{value}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="#comparison" label="See the comparison" />
            <ButtonLink href={siteCtas.securityHref} label="Security posture" variant="secondary" />
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="Why managed cloud"
        title="Why Azure in India? Why not &ldquo;own servers&rdquo;?"
        body="Data residency isn't defined by who makes the servers — it's defined by where they physically sit and how access is governed. Choosing Microsoft Azure in India is an engineering decision."
      >
        <Reveal className="surface-panel-strong rounded-[1.8rem] p-7 lg:p-8">
          <div className="flex items-start gap-4">
            <Landmark className="mt-1 size-5 shrink-0 text-(--amber)" />
            <div>
              <h2 className="font-display text-2xl tracking-[-0.04em]">
                The &ldquo;own servers&rdquo; reality check
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
                In this market, &ldquo;own servers in India&rdquo; can mean very different things:
              </p>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {[
                  "Rented racks in shared co-location facilities",
                  "A VPS from a hosting provider, sometimes outside India",
                  "A single server in a locked room on consumer hardware",
                  "“Own” hardware leased from a local hosting company",
                ].map((item) => (
                  <p
                    key={item}
                    className="rounded-[1.1rem] bg-(--surface-muted) px-4 py-3 text-sm leading-6 text-muted-foreground"
                  >
                    {item}
                  </p>
                ))}
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
                None of these are automatically bad — but they are different risk profiles, and an
                institution deserves to know which one it is buying. The useful move is to ask every
                vendor, including us, the same infrastructure questions in writing.
              </p>
            </div>
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell
        id="comparison"
        eyebrow="The comparison"
        title="Managed cloud design vs unspecified &ldquo;own servers&rdquo;"
        body="What we run, next to the questions worth asking any vendor."
      >
        <Reveal staggerChildren className="grid gap-4">
          {comparisonData.map((row) => (
            <article
              key={row.category}
              data-reveal-item
              className="surface-panel rounded-[1.6rem] p-6"
            >
              <p className="section-kicker">{row.category}</p>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <div className="rounded-[1.3rem] border border-(--line) bg-(--surface-strong) p-5">
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-(--brand)">
                    SquareCampus · Azure, India
                  </p>
                  <p className="mt-2.5 font-display text-xl tracking-[-0.03em]">{row.us.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{row.us.details}</p>
                </div>
                <div className="rounded-[1.3rem] bg-(--surface-muted) p-5">
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Typical unspecified claims
                  </p>
                  <p className="mt-2.5 font-display text-xl tracking-[-0.03em] text-muted-foreground">
                    {row.them.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{row.them.details}</p>
                  <p className="mt-3 text-xs font-medium text-(--amber)">
                    Ask every vendor: {row.them.ask}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="Design decisions"
        title="What this design means for your institution"
        body="These are the architectural commitments the platform is built around. The specifics behind each one are documented for security reviews."
      >
        <Reveal staggerChildren className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {capabilities.map((cap) => (
            <article
              key={cap.title}
              data-reveal-item
              className="surface-panel rounded-[1.6rem] p-6"
            >
              <cap.icon className="size-5 text-(--brand)" />
              <h2 className="mt-5 font-display text-xl tracking-[-0.03em]">{cap.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{cap.body}</p>
            </article>
          ))}
          <article data-reveal-item className="surface-panel-strong rounded-[1.6rem] p-6">
            <ShieldCheck className="size-5 text-(--teal)" />
            <h2 className="mt-5 font-display text-xl tracking-[-0.03em]">
              Documentation on request
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Architecture summaries, data-flow documentation, and questionnaire responses are
              available to evaluating institutions through the security review process.
            </p>
            <div className="mt-5">
              <ButtonLink
                href="mailto:security@squarecampus.com?subject=Infrastructure%20Documentation%20Request"
                label="Request documentation"
                variant="secondary"
              />
            </div>
          </article>
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="Due diligence"
        title="Questions worth asking every vendor — including us"
        body="Use these during your evaluation and compare the answers in writing."
      >
        <Reveal>
          <Accordion className="surface-panel rounded-[1.6rem] px-6">
            {dueDiligenceQuestions.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger className="py-5 text-left font-display text-base tracking-[-0.02em] hover:no-underline sm:text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="grid gap-3">
                  <p className="text-sm leading-6 text-muted-foreground">
                    <span className="font-medium text-foreground">Why it matters:</span>{" "}
                    {item.whyItMatters}
                  </p>
                  <div className="rounded-[1.1rem] border border-(--line) bg-(--surface-strong) px-4 py-3 text-sm leading-6 text-foreground">
                    <span className="font-medium text-(--brand)">Our answer:</span> {item.ourAnswer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </SectionShell>

      <SectionShell eyebrow="Infrastructure FAQ" title="The technical questions, answered plainly">
        <Reveal>
          <Accordion className="surface-panel rounded-[1.6rem] px-6">
            {faqData.map((faq) => (
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
          <p className="section-kicker">Infrastructure review</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl tracking-[-0.05em] sm:text-4xl">
            Ask us the hard questions.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Bring your security questionnaire, your IT committee, or your auditor. We answer
            infrastructure questions in writing as part of an evaluation.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} />
            <ButtonLink
              href="mailto:security@squarecampus.com?subject=Infrastructure%20Questions"
              label="Email security"
              variant="secondary"
            />
          </div>
        </Reveal>
      </SectionShell>
    </main>
  );
}
