import { BadgeCheck, Building2, CalendarClock, FileSpreadsheet, UsersRound } from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { ContactForm } from "@/components/site/contact-form";
import { PageSchema } from "@/components/site/page-schema";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import {
  demoPage,
  FOUNDING_PARTNER_FORM_HREF,
  formCopy,
  legacyIntentRedirectScript,
} from "@/content/demo-intents";
import { createPageMetadata } from "@/lib/seo";

/**
 * The standard demo journey, and only that (audit SC-024, SC-026, SC-027).
 *
 * The Founding Institutional Partner diagnosis has its own form on
 * /launch-partners/ and the proposal request has its own on /pricing/, so this
 * page has one <h1>, one lead and one next step. Legacy
 * /demo/?intent=founding-partner links are forwarded before first paint.
 */
export const metadata: Metadata = createPageMetadata({
  title: "Book a School Management Software Demo",
  description:
    "Book a guided SquareCampus demo and see how the School OS maps to admissions, academics, finance, communication, and institutional operations.",
  path: "/demo",
  ogImage: "https://squarecampus.com/og/demo.png",
});

const expectations = [
  {
    title: "Platform walkthrough",
    icon: Building2,
    body: "The workflows institutions compare vendors on — admissions, academics, fees, communication, visibility and controls — shown against the areas you chose.",
  },
  {
    title: "Where it would sit",
    icon: FileSpreadsheet,
    body: "Bring your current systems, spreadsheets or pain points. We map where SquareCampus would sit beside them, and what a first rollout would realistically involve.",
  },
  {
    title: "The right people in the room",
    icon: UsersRound,
    body: "Principals, trustees, operations, finance and IT usually care about different things. The session can be structured around each of them.",
  },
  {
    title: "Rollout, honestly",
    icon: CalendarClock,
    body: "Go-live sequencing, training, what stays in place while adoption happens, and what your institution would need to do to move responsibly.",
  },
] as const;

export default function DemoPage() {
  return (
    <main tabIndex={-1} id="main-content">
      {/* Forwards legacy /demo/?intent=founding-partner links to the
          founding-partner form. Self-authored; it reads the query string but
          never renders it. */}
      <script dangerouslySetInnerHTML={{ __html: legacyIntentRedirectScript }} />

      <PageSchema
        name="Book a School Management Software Demo"
        description="Request a guided SquareCampus walkthrough mapped to the institution's own admissions, academics, finance, communication and governance workflows."
        path="/demo"
      />

      <SectionShell className="pt-12 sm:pt-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal immediate className="space-y-6">
            <p className="section-kicker">{demoPage.eyebrow}</p>

            <h1 className="font-display text-4xl leading-none tracking-[-0.06em] sm:text-5xl lg:text-6xl">
              {demoPage.heading}
            </h1>

            <p className="max-w-xl text-lg leading-8 text-[color:var(--muted-foreground)]">
              {demoPage.lead}
            </p>

            <div className="grid gap-3">
              {demoPage.points.map((item) => (
                <div
                  key={item}
                  className="surface-panel rounded-[1.35rem] px-4 py-3 text-sm leading-6 text-[color:var(--muted-foreground)]"
                >
                  {item}
                </div>
              ))}
            </div>

            <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
              {demoPage.foundingPartnerNote}{" "}
              <a
                href={FOUNDING_PARTNER_FORM_HREF}
                className="font-medium text-[color:var(--foreground)] underline underline-offset-4"
              >
                Request a partnership diagnosis
              </a>
            </p>
          </Reveal>

          <Reveal immediate delay={120} className="surface-panel-strong rounded-[2rem] p-6 lg:p-8">
            <p className="section-kicker">{formCopy.demo.eyebrow}</p>
            <h2 className="mt-4 font-display text-3xl tracking-[-0.05em]">
              {formCopy.demo.heading}
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-[color:var(--muted-foreground)]">
              {formCopy.demo.body}
            </p>
            <div className="mt-6">
              <ContactForm intent="demo" />
            </div>
          </Reveal>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={demoPage.expectations.eyebrow}
        title={demoPage.expectations.heading}
        body={demoPage.expectations.body}
      >
        <Reveal staggerChildren className="grid gap-4 md:grid-cols-2">
          {expectations.map((item) => (
            <article
              key={item.title}
              data-reveal-item
              className="surface-panel rounded-[1.6rem] p-6"
            >
              <item.icon aria-hidden className="size-5 text-[color:var(--brand)]" />
              <h3 className="mt-5 font-display text-2xl tracking-[-0.04em]">{item.title}</h3>
              <p className="mt-3 text-base leading-7 text-[color:var(--muted-foreground)]">
                {item.body}
              </p>
            </article>
          ))}
        </Reveal>
      </SectionShell>

      <SectionShell className="pb-22">
        <Reveal className="surface-panel rounded-[1.8rem] p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div>
              <p className="section-kicker">{demoPage.close.eyebrow}</p>
              <h2 className="mt-4 font-display text-3xl tracking-[-0.05em] sm:text-4xl">
                {demoPage.close.heading}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted-foreground)]">
                {demoPage.close.body}
              </p>
              <div className="mt-6">
                <ButtonLink href="/pricing" label="How pricing works" variant="secondary" />
              </div>
            </div>
            <div className="grid gap-3">
              {demoPage.close.points.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.2rem] border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-4 text-sm leading-6 text-[color:var(--muted-foreground)]"
                >
                  <BadgeCheck aria-hidden className="mb-3 size-4 text-[color:var(--teal)]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </SectionShell>
    </main>
  );
}
