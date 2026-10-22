import {
  publicRetentionSchedule,
  RETENTION_PATH,
  retentionContentReview,
  retentionPage,
  sourceReference,
  sourceReferences,
} from "@fairhelm/squarecampus-content/retention";
import { Separator } from "@fairhelm/ui/components/separator";
import { formatIsoDate } from "@fairhelm/ui/lib/utils";
import { ArrowUpRight, CircleCheck, CircleDashed } from "lucide-react";
import { CitationPreview } from "@/components/legal/citation-preview";
import { EntityIdentity, LegalSection, LegalShell } from "@/components/legal/legal-shell";
import { PageSchema } from "@/components/site/page-schema";

const page = retentionPage;

const toc = [
  { label: page.roles.heading, href: "#responsibilities" },
  { label: page.determination.heading, href: "#determination" },
  { label: page.schedule.heading, href: "#schedule" },
  { label: page.erasure.heading, href: "#purpose-consent-preservation" },
  { label: page.preservation.heading, href: "#preservation" },
  { label: page.exit.heading, href: "#contract-end" },
  { label: page.backups.heading, href: "#backups" },
  { label: page.enquiries.heading, href: "#website-enquiries" },
  { label: page.requests.heading, href: "#requests" },
  { label: page.references.heading, href: "#references" },
];

export default function DataRetentionPage() {
  const schedule = publicRetentionSchedule();
  const dpdpAct = sourceReference("dpdp-act-2023");
  const dpdpRules = sourceReference("dpdp-rules-2025");
  const cbse = sourceReference("cbse-affiliation-bye-laws");

  return (
    <>
      <PageSchema name={page.title} description={page.description} path={RETENTION_PATH} />
      <LegalShell
        title={page.title}
        current="/data-retention/"
        contents={toc}
        description={page.description}
      >
        {/* The case for caring, before the mechanics. */}
        <section
          aria-labelledby="retention-opening"
          className="relative overflow-hidden rounded-[1.4rem] border border-[color:var(--line-strong)] bg-[color:var(--brand-tint)] p-6 sm:p-8 dark:border-[color:var(--cite-neon)]/25 dark:bg-[radial-gradient(120%_140%_at_100%_0%,color-mix(in_oklch,var(--cite-neon)_16%,transparent),transparent_55%),linear-gradient(180deg,rgba(2,4,10,0.85),rgba(2,4,10,0.6))] dark:shadow-[0_0_60px_-24px_var(--cite-neon),inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-1 bg-[color:var(--brand)] dark:bg-[linear-gradient(180deg,var(--cite-neon),var(--cite-neon-2))] dark:shadow-[0_0_18px_2px_var(--cite-neon)]"
          />
          <h2
            id="retention-opening"
            className="max-w-2xl font-display text-2xl leading-tight tracking-[-0.04em] text-foreground sm:text-3xl"
          >
            {page.opening.heading}
          </h2>
          <div className="mt-4 flex max-w-2xl flex-col gap-3 text-[0.95rem] leading-7">
            {page.opening.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        <section aria-labelledby="retention-posture" className="flex flex-col gap-4">
          <h2
            id="retention-posture"
            className="font-display text-lg tracking-[-0.02em] text-foreground"
          >
            {page.posture.heading}
          </h2>
          <p className="text-foreground">{page.posture.lead}</p>
          <ol className="grid gap-3 sm:grid-cols-3">
            {page.posture.points.map((point, index) => (
              <li
                key={point}
                className="rounded-[1.1rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-4 transition-[border-color,box-shadow] dark:bg-black/40 dark:hover:border-[color:var(--cite-neon)]/40 dark:hover:shadow-[0_0_32px_-14px_var(--cite-neon)]"
              >
                <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-[color:var(--brand)] dark:text-[color:var(--cite-neon)] dark:[text-shadow:0_0_10px_var(--cite-neon)]">
                  0{index + 1}
                </span>
                <p className="mt-2 text-[0.82rem] leading-6">{point}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Confirmed versus awaiting confirmation, side by side. */}
        <section aria-labelledby="retention-status" className="flex flex-col gap-4">
          <h2
            id="retention-status"
            className="font-display text-lg tracking-[-0.02em] text-foreground"
          >
            {page.status.heading}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-[1.1rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5 dark:border-[color:var(--cite-neon)]/30 dark:bg-black/40 dark:shadow-[0_0_40px_-22px_var(--cite-neon)]">
              <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CircleCheck
                  aria-hidden
                  className="size-4 text-[color:var(--brand)] dark:text-[color:var(--cite-neon)] dark:drop-shadow-[0_0_6px_var(--cite-neon)]"
                />
                Confirmed today
              </h3>
              <ul className="mt-3 flex flex-col gap-2.5">
                {page.status.confirmed.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[0.82rem] leading-6">
                    <span
                      aria-hidden
                      className="mt-[0.6rem] size-1 shrink-0 rounded-full bg-[color:var(--brand)] dark:bg-[color:var(--cite-neon)] dark:shadow-[0_0_6px_var(--cite-neon)]"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.1rem] border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-muted)] p-5">
              <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CircleDashed aria-hidden className="size-4 text-muted-foreground" />
                Awaiting confirmation
              </h3>
              <ul className="mt-3 flex flex-col gap-2.5">
                {page.status.awaiting.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[0.82rem] leading-6">
                    <span
                      aria-hidden
                      className="mt-[0.6rem] size-1 shrink-0 rounded-full border border-muted-foreground"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="space-y-10">
          <LegalSection title={page.roles.heading} id="responsibilities">
            <p>{page.roles.institution}</p>
            <p>{page.roles.processor}</p>
            <p>{page.roles.ownData}</p>
            <EntityIdentity documentNoun="this page" />
          </LegalSection>

          <LegalSection title={page.determination.heading} id="determination">
            <p>{page.determination.paragraphs[0]}</p>
            <p>
              Board and statutory sources differ in what they cover. The{" "}
              <CitationPreview reference={cbse}>CBSE Affiliation Bye-Laws</CitationPreview>, for
              example, list records an affiliated school is to maintain, while the{" "}
              <CitationPreview reference={dpdpAct}>
                Digital Personal Data Protection Act, 2023
              </CitationPreview>{" "}
              and the <CitationPreview reference={dpdpRules}>DPDP Rules, 2025</CitationPreview>{" "}
              govern the processing of personal data.
            </p>
            <p>{page.determination.paragraphs[1]}</p>
            <p className="rounded-[1.1rem] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-4 text-foreground">
              {page.determination.paragraphs[2]}
            </p>
          </LegalSection>

          <LegalSection title={page.schedule.heading} id="schedule">
            {schedule.length === 0 ? (
              <p className="rounded-[1.1rem] border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-muted)] p-4 text-foreground">
                {page.schedule.emptyNotice}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[40rem] border-collapse text-left text-xs">
                  <thead>
                    <tr>
                      {page.schedule.columns.map((column) => (
                        <th
                          key={column}
                          scope="col"
                          className="border-b border-[color:var(--line-strong)] pb-2 pr-4 font-medium text-foreground"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((entry) => (
                      <tr key={entry.id} className="align-top">
                        <th scope="row" className="py-3 pr-4 font-medium text-foreground">
                          {entry.category}
                        </th>
                        <td className="py-3 pr-4">
                          {entry.jurisdiction} · {entry.applicability}
                        </td>
                        <td className="py-3 pr-4">{entry.period}</td>
                        <td className="py-3 pr-4">{entry.trigger ?? "—"}</td>
                        <td className="py-3 pr-4">{entry.qualification ?? "—"}</td>
                        <td className="py-3">
                          <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer">
                            {entry.citation}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </LegalSection>

          <LegalSection title={page.erasure.heading} id="purpose-consent-preservation">
            {page.erasure.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </LegalSection>

          <LegalSection title={page.preservation.heading} id="preservation">
            {page.preservation.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </LegalSection>

          <LegalSection title={page.exit.heading} id="contract-end">
            <p>
              {page.exit.paragraphs[0]} See{" "}
              <a
                href="/squarecampus/data-processing-addendum/#retention"
                className="text-foreground underline"
              >
                section 11 of the Data Processing Addendum
              </a>
              .
            </p>
            {page.exit.paragraphs.slice(1).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </LegalSection>

          <LegalSection title={page.backups.heading} id="backups">
            {page.backups.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </LegalSection>

          <LegalSection title={page.enquiries.heading} id="website-enquiries">
            {page.enquiries.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="text-foreground">{page.enquiries.requests}</p>
          </LegalSection>

          <LegalSection title={page.requests.heading} id="requests">
            <dl className="grid gap-3 sm:grid-cols-3">
              {page.requests.items.map((item) => (
                <div
                  key={item.who}
                  className="rounded-[1.1rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-4"
                >
                  <dt className="text-sm font-medium text-foreground">{item.who}</dt>
                  <dd className="mt-2 text-[0.82rem] leading-6">{item.body}</dd>
                </div>
              ))}
            </dl>
          </LegalSection>

          <LegalSection title={page.references.heading} id="references">
            <p>{page.references.note}</p>
            <ol className="flex flex-col gap-3">
              {sourceReferences.map((ref) => (
                <li
                  key={ref.id}
                  id={`ref-${ref.id}`}
                  className="scroll-mt-24 rounded-[1.1rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-4 target:border-[color:var(--brand)]"
                >
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1.5 font-medium text-foreground hover:text-[color:var(--brand)]"
                  >
                    {ref.title}
                    <ArrowUpRight aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                  </a>
                  <p className="mt-1 text-xs">
                    {ref.issuer} · {ref.host}
                  </p>
                  <p className="mt-2 text-[0.82rem] leading-6">{ref.covers}</p>
                  <p className="mt-2 text-[0.7rem]">
                    Source checked {formatIsoDate(ref.checkedOn)}
                  </p>
                </li>
              ))}
            </ol>
          </LegalSection>
        </div>

        <Separator className="mt-10" />
        <div className="flex flex-col gap-2 text-xs text-muted-foreground">
          {retentionContentReview.reviewedOn ? (
            <p>Content last reviewed {formatIsoDate(retentionContentReview.reviewedOn)}.</p>
          ) : null}
          <p>{page.disclaimer}</p>
        </div>
      </LegalShell>
    </>
  );
}
