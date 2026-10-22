import { ArrowUpRight, Check, ScrollText, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@fairhelm/ui/components/accordion";
import { COMPARISON_AS_OF, comparisonBySlug, comparisons } from "@/content/comparisons";
import { ctaLabels, siteCtas } from "@/content/site-content";
import {
  canonicalUrl,
  createAlternates,
  createBreadcrumbSchema,
  createPageMetadata,
  SEO_CONFIG,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const c = comparisonBySlug(slug);
  if (!c) {
    return { title: "Compare" };
  }
  return {
    ...createPageMetadata({
      title: c.metaTitle,
      description: c.metaDescription,
      path: `/compare/${c.slug}`,
      ogImage: `${SEO_CONFIG.baseUrl}/og/${c.slug}.png`,
    }),
    alternates: createAlternates(`/compare/${c.slug}`),
  };
}

const differentiatorIcons = [Sparkles, ScrollText, ShieldCheck, Wallet];

export default async function ComparePage({ params }: PageProps) {
  const { slug } = await params;
  const c = comparisonBySlug(slug);
  if (!c) {
    // generateStaticParams guarantees a match at build time.
    return null;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SEO_CONFIG.baseUrl}/compare/${c.slug}#webpage`,
        name: c.metaTitle,
        description: c.metaDescription,
        url: canonicalUrl(`/compare/${c.slug}`),
        inLanguage: SEO_CONFIG.language,
        isPartOf: { "@id": `${SEO_CONFIG.baseUrl}/#website` },
      },
      createBreadcrumbSchema([
        { name: "Home", url: SEO_CONFIG.baseUrl },
        { name: "Compare", url: canonicalUrl("/compare") },
        {
          name: `SquareCampus vs ${c.competitor}`,
          url: canonicalUrl(`/compare/${c.slug}`),
        },
      ]),
      {
        "@type": "FAQPage",
        "@id": `${SEO_CONFIG.baseUrl}/compare/${c.slug}#faq`,
        mainEntity: c.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <main tabIndex={-1} id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <SectionShell className="pt-12 sm:pt-16">
        <Reveal immediate className="max-w-3xl space-y-6">
          <p className="section-kicker">
            <Link href="/compare" className="hover:text-foreground">
              Compare
            </Link>{" "}
            · {c.intentLabel}
          </p>
          <h1 className="font-display text-4xl leading-none tracking-[-0.06em] sm:text-5xl lg:text-6xl">
            SquareCampus vs {c.competitor}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">{c.lede}</p>
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

      <SectionShell
        eyebrow="The honest version"
        title={`What ${c.competitorShort} is genuinely good at`}
        body="A comparison you can trust starts by being fair about the alternative."
        compactBody
      >
        <Reveal staggerChildren className="grid gap-4 md:grid-cols-3">
          {c.competitorStrengths.map((item) => (
            <article key={item} data-reveal-item className="surface-panel rounded-[1.6rem] p-6">
              <Check className="size-5 text-(--teal)" />
              <p className="mt-4 text-base leading-7 text-muted-foreground">{item}</p>
            </article>
          ))}
        </Reveal>
      </SectionShell>

      <SectionShell eyebrow="Side by side" title={`SquareCampus vs ${c.competitor}, by dimension`}>
        <Reveal>
          <div className="surface-panel overflow-hidden rounded-[1.6rem]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[40rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-(--line)">
                    <th className="px-5 py-4 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
                      Dimension
                    </th>
                    <th className="px-5 py-4 font-display text-base tracking-[-0.02em] text-(--brand)">
                      SquareCampus
                    </th>
                    <th className="px-5 py-4 font-display text-base tracking-[-0.02em] text-muted-foreground">
                      {c.competitor}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {c.rows.map((row, index) => (
                    <tr
                      key={row.dimension}
                      className={index % 2 === 1 ? "bg-(--surface-muted)" : undefined}
                    >
                      <th className="px-5 py-4 align-top font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
                        {row.dimension}
                      </th>
                      <td className="px-5 py-4 align-top text-sm leading-6 text-foreground">
                        {row.squarecampus}
                      </td>
                      <td className="px-5 py-4 align-top text-sm leading-6 text-muted-foreground">
                        {row.competitor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell
        eyebrow="Where SquareCampus is different"
        title="The differences that actually matter"
      >
        <Reveal staggerChildren className="grid gap-4 md:grid-cols-2">
          {c.differentiators.map((item, index) => {
            const Icon = differentiatorIcons[index % differentiatorIcons.length];
            return (
              <article
                key={item.title}
                data-reveal-item
                className="surface-panel rounded-[1.6rem] p-6"
              >
                <Icon className="size-5 text-(--brand)" />
                <h2 className="mt-5 font-display text-2xl tracking-[-0.04em]">{item.title}</h2>
                <p className="mt-3 text-base leading-7 text-muted-foreground">{item.body}</p>
              </article>
            );
          })}
        </Reveal>
      </SectionShell>

      <SectionShell eyebrow="Which one fits you" title="An honest recommendation" compactBody>
        <Reveal className="grid gap-4 lg:grid-cols-2">
          <div className="surface-panel rounded-[1.8rem] p-7">
            <p className="section-kicker">Choose {c.competitorShort} when</p>
            <ul className="mt-4 grid gap-2.5">
              {c.theyFitWhen.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-6 text-muted-foreground"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-panel-strong rounded-[1.8rem] p-7">
            <p className="section-kicker">Choose SquareCampus when</p>
            <ul className="mt-4 grid gap-2.5">
              {c.weFitWhen.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-6 text-foreground"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-(--brand)" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell eyebrow="FAQ" title={`SquareCampus and ${c.competitorShort}, answered`}>
        <Reveal>
          <Accordion className="surface-panel rounded-[1.6rem] px-6">
            {c.faqs.map((faq) => (
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

      <SectionShell className="pt-0">
        <Reveal className="surface-panel-strong rounded-[2rem] p-6 text-center sm:p-10">
          <p className="section-kicker">See it on your own numbers</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-2xl tracking-[-0.05em] sm:text-4xl">
            The fastest way to compare is to see SquareCampus run your workflows.
          </h2>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} variant="cta" />
            <ButtonLink href="/compare" label="See all comparisons" variant="secondary" />
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell className="pb-12 pt-0 sm:pb-16">
        <p className="mx-auto max-w-3xl text-center text-xs leading-6 text-muted-foreground">
          Comparison based on publicly available information as of {COMPARISON_AS_OF}.{" "}
          <Link
            href={c.competitorUrl}
            target="_blank"
            rel="noreferrer noopener nofollow"
            className="inline-flex items-center gap-0.5 underline underline-offset-2 hover:text-foreground"
          >
            {c.competitor} <ArrowUpRight className="size-3" />
          </Link>{" "}
          and other names are trademarks of their respective owners, used here for identification
          and comparison only. Details change — verify current features and pricing with each
          vendor. Spotted something out of date? Email contact@squarecampus.com and we&rsquo;ll
          correct it.
        </p>
      </SectionShell>
    </main>
  );
}
