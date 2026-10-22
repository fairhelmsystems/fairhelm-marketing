import { Alert, AlertDescription, AlertTitle } from "@fairhelm/ui/components/alert";
import { LegalNavBand } from "@/components/site/legal-navigation";
import { LegalReadingLayout } from "@/components/site/legal-reading-layout";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

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
      <LegalReadingLayout
        contents={sections.map((section) => ({ label: section.title, href: `#${section.id}` }))}
      >
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
        <p className="mt-10 font-mono text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
      </LegalReadingLayout>
    </>
  );
}
