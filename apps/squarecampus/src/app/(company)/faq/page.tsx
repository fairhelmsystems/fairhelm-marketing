import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { FaqExplorer } from "@/components/site/faq-explorer";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { ctaLabels, siteCtas } from "@/content/site-content";

export default function FAQPage() {
  return (
    <main tabIndex={-1} id="main-content">
      <SectionShell className="pt-12 sm:pt-16">
        <Reveal immediate className="max-w-3xl space-y-6">
          <p className="section-kicker">Frequently asked questions</p>
          <h1 className="font-display text-4xl leading-none tracking-[-0.06em] sm:text-5xl lg:text-6xl">
            The questions institutions actually ask.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            Getting started, modules, security, data ownership, pricing, and what support looks like
            after go-live. If it isn&rsquo;t answered here, the demo covers it.
          </p>
        </Reveal>
      </SectionShell>

      <SectionShell className="pt-0">
        <Reveal>
          <FaqExplorer />
        </Reveal>
      </SectionShell>

      <SectionShell className="pb-22 pt-0">
        <Reveal className="surface-panel-strong rounded-[2rem] p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-center">
            <div>
              <p className="section-kicker">Still deciding?</p>
              <h2 className="mt-4 font-display text-3xl tracking-[-0.05em] sm:text-4xl">
                Bring the unanswered questions to a guided demo.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                We map your current stack, show how the operating model changes daily work, and
                answer the specifics for your institution.
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
