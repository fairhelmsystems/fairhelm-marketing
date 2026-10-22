import { Container } from "@/components/site/container";
import { LegalTabs } from "@/components/site/legal-tabs";
import { Alert, AlertDescription, AlertTitle } from "@fairhelm/ui/components/alert";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export function LegalNavBand({ current }: { current: string }) {
  return (
    <section className="border-y border-border section-alt">
      <Container className="no-scrollbar overflow-x-auto py-2">
        <LegalTabs current={current} />
      </Container>
    </section>
  );
}

export function LegalDocument({
  current,
  statusTitle,
  statusDescription,
  sections,
  lastUpdated = "15 July 2026",
}: {
  current: string;
  statusTitle: string;
  statusDescription: string;
  sections: readonly LegalSection[];
  lastUpdated?: string;
}) {
  return (
    <>
      <LegalNavBand current={current} />
      <section className="section">
        <Container className="grid max-w-6xl gap-10 lg:grid-cols-[14rem_1fr] lg:gap-14">
          <aside className="min-w-0 self-start lg:sticky lg:top-28">
            <p className="eyebrow">On this page</p>
            <nav
              aria-label="Document sections"
              className="no-scrollbar mt-4 flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible"
            >
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs whitespace-nowrap text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground lg:rounded-lg lg:border-transparent lg:px-3 lg:py-2 lg:text-sm lg:whitespace-normal lg:hover:bg-accent"
                >
                  <span className="mr-2 font-mono text-[0.62rem] text-[color:var(--brand-ink)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <article className="min-w-0">
            <Alert>
              <AlertTitle>{statusTitle}</AlertTitle>
              <AlertDescription>{statusDescription}</AlertDescription>
            </Alert>
            <div className="mt-10 flex flex-col gap-10">
              {sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 border-b border-border pb-10 last:border-0"
                >
                  <p className="index">{String(index + 1).padStart(2, "0")}</p>
                  <h2 className="display-3 mt-3 sm:text-[1.6rem]">{section.title}</h2>
                  <div className="mt-4 flex flex-col gap-4 text-[0.95rem] leading-7 text-muted-foreground">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.bullets?.length ? (
                      <ul className="flex list-disc flex-col gap-2 pl-5">
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </section>
              ))}
            </div>
            <p className="mt-10 font-mono text-xs text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </article>
        </Container>
      </section>
    </>
  );
}
