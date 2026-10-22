import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { PageSchema } from "@/components/site/page-schema";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { comparisons } from "@/content/comparisons";
import { ctaLabels, siteCtas } from "@/content/site-content";
import { createAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Compare School Management Systems",
  description:
    "Honest, side-by-side comparisons of SquareCampus with Entab CampusCare, Fedena, Teachmint, and other school ERPs — plus a framework for evaluating any school management system for India.",
  alternates: createAlternates("/compare"),
  openGraph: {
    title: "Compare School Management Systems",
    description:
      "Honest, side-by-side comparisons of SquareCampus with Entab CampusCare, Fedena, Teachmint, and other school ERPs.",
    url: "https://squarecampus.com/compare/",
    siteName: "SquareCampus",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://squarecampus.com/og/compare.png",
        width: 1200,
        height: 630,
        alt: "Compare School Management Systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://squarecampus.com/og/compare.png"],
  },
};

const evaluationCriteria = [
  {
    q: "Is it one system or many modules?",
    body: "Ask whether every module writes to the same record, or whether integrations keep separate products in sync. Sync gaps are where data drift and reconciliation work come from.",
  },
  {
    q: "Can you verify the infrastructure?",
    body: "Ask for the hosting region, the uptime SLA, and the audit posture — in writing. A vendor that publishes these is easier to trust than one that answers 'it's secure.'",
  },
  {
    q: "Is the pricing transparent?",
    body: "Ask what's included versus billed separately: mobile apps, each module, support, training. One institutional licence with the standard apps included and the separately scoped lines stated up front is easier to budget than per-module upsells.",
  },
  {
    q: "Who runs and secures it?",
    body: "Self-hosted means your team owns hosting, security, and upgrades. Managed means the vendor does. Decide which your institution actually has the capacity for.",
  },
  {
    q: "What does the intelligence layer actually do?",
    body: "Ask whether 'AI' means a governed layer that respects roles and logs every query, or a chatbot bolted onto reports. Governance is what makes it safe for a school.",
  },
  {
    q: "How long, really, to go live?",
    body: "Ask for a week-by-week rollout plan with migration, training, and a parallel run — not a vague 'a few months.' A concrete plan is a sign the vendor has done it before.",
  },
] as const;

export default function CompareHubPage() {
  return (
    <main tabIndex={-1} id="main-content">
      <PageSchema
        name="Compare School Management Systems"
        description="Evaluation hub for comparing SquareCampus with existing school ERP and school management platforms, one named comparison per page."
        path="/compare"
      />

      <SectionShell className="pt-12 sm:pt-16">
        <Reveal immediate className="max-w-3xl space-y-6">
          <p className="section-kicker">Compare</p>
          <h1 className="font-display text-4xl leading-none tracking-[-0.06em] sm:text-5xl lg:text-6xl">
            Evaluating school management systems? Start here.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            Honest, side-by-side comparisons of SquareCampus with the school ERPs you&rsquo;re
            likely weighing — including where each alternative is the better fit — plus a framework
            for evaluating any of them.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} variant="cta" />
            <ButtonLink
              href="/school-management-system"
              label="See the platform"
              variant="secondary"
            />
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell eyebrow="Head to head" title="SquareCampus compared" className="pt-0">
        <Reveal staggerChildren className="grid gap-4 md:grid-cols-3">
          {comparisons.map((c) => (
            <article
              key={c.slug}
              data-reveal-item
              className="surface-panel group relative flex flex-col rounded-[1.6rem] p-6 transition-shadow hover:shadow-[0_30px_72px_rgba(8,15,30,0.1)]"
            >
              <p className="section-kicker">{c.intentLabel}</p>
              <h2 className="mt-4 font-display text-2xl tracking-[-0.04em]">
                <Link href={`/compare/${c.slug}`} className="after:absolute after:inset-0">
                  SquareCampus vs {c.competitorShort}
                </Link>
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{c.lede}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-(--brand)">
                Read the comparison
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </article>
          ))}
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="Evaluation framework"
        title="Six questions to ask any school ERP vendor"
        body="Whether or not SquareCampus makes your shortlist, these are the questions that separate a real platform from a demo that falls apart in production."
      >
        <Reveal staggerChildren className="grid gap-4 md:grid-cols-2">
          {evaluationCriteria.map((item, index) => (
            <article key={item.q} data-reveal-item className="surface-panel rounded-[1.6rem] p-6">
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-3 font-display text-xl tracking-[-0.03em]">{item.q}</h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </Reveal>
      </SectionShell>

      <SectionShell className="pb-22 pt-0">
        <Reveal className="surface-panel-strong rounded-[2rem] p-6 text-center sm:p-10">
          <p className="section-kicker">Skip the spreadsheet</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-2xl tracking-[-0.05em] sm:text-4xl">
            Bring your shortlist. We&rsquo;ll map SquareCampus against it, honestly.
          </h2>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} variant="cta" />
            <ButtonLink href="/why-squarecampus" label="Why SquareCampus" variant="secondary" />
          </div>
        </Reveal>
      </SectionShell>
    </main>
  );
}
