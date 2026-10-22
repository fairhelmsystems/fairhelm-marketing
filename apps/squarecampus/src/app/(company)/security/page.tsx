import {siteHref} from "@fairhelm/config/urls";
import {
  Bell,
  Database,
  FileText,
  Fingerprint,
  LockKeyhole,
  MapPin,
  TimerReset,
} from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { DetailsFaq } from "@fairhelm/ui/components/details-faq";
import { IdentityFlow } from "@/components/site/identity-flow";
import { SecurityMockup } from "@/components/site/mockups";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { deploymentSummary, identity, securityBaseline } from "@/content/commercial";
import { securityFaqs } from "@/content/security-faq";
import { ctaLabels, siteCtas } from "@/content/site-content";

/**
 * The questions a procurement or IT review asks first, each answered with a
 * statement the site can stand behind (audit SC-023). Design statements say
 * "by design"; anything that needs evidence is offered in writing during
 * security review rather than asserted here. No certification, uptime,
 * backup cadence or response-time figure is published.
 */
const controls = [
  {
    title: "Access control",
    icon: Fingerprint,
    body: `Access is role-based and scoped by campus. ${identity.baseline.body} Authorisation is always decided inside SquareCampus, never by an email domain.`,
  },
  {
    title: "Audit history",
    icon: Database,
    body: "Approvals, overrides and record changes are designed to be recorded with who made them, what changed and when, in the campus context they happened in.",
  },
  {
    title: "Encryption",
    icon: LockKeyhole,
    body: "Data is encrypted in transit and at rest as part of the platform's baseline design. Implementation details are shared during security review.",
  },
  {
    title: "Hosting",
    icon: MapPin,
    body: `${deploymentSummary} Hosting details and data-flow documentation are given in writing during evaluation.`,
  },
  {
    title: "Backups and recovery",
    icon: TimerReset,
    body: "Availability, backup and recovery design are documented in writing during security review. We do not publish uptime, backup or recovery figures.",
  },
  {
    title: "Reporting a security concern",
    icon: Bell,
    body: "Email security@squarecampus.com with a description, steps to reproduce and the likely impact. Sensitive reports can be encrypted with our PGP key.",
  },
] as const;

export default function SecurityPage() {
  return (
    <main tabIndex={-1} id="main-content">
      <SectionShell className="pt-12 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <Reveal immediate className="space-y-6">
            <p className="section-kicker">Trust and security</p>
            <h1 className="font-display text-4xl leading-none tracking-[-0.06em] sm:text-5xl lg:text-6xl">
              Security answers for the people who review school software.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[color:var(--muted-foreground)]">
              Access control, audit history, encryption, hosting, backups and how to report an issue
              — stated plainly, with the evidence behind each one shared in writing during security
              review.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} />
              <ButtonLink
                href="mailto:security@squarecampus.com"
                label="Contact security"
                variant="secondary"
              />
            </div>
          </Reveal>
          <Reveal immediate delay={120}>
            <SecurityMockup />
          </Reveal>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow="Control domains"
        title="The trust posture is designed for institutional accountability"
        body={securityBaseline}
      >
        <Reveal staggerChildren className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {controls.map((item) => (
            <article
              key={item.title}
              data-reveal-item
              className="surface-panel rounded-[1.6rem] p-6"
            >
              <item.icon className="size-5 text-[color:var(--brand)]" />
              <h2 className="mt-5 font-display text-2xl tracking-[-0.04em]">{item.title}</h2>
              <p className="mt-3 text-base leading-7 text-[color:var(--muted-foreground)]">
                {item.body}
              </p>
            </article>
          ))}
        </Reveal>
      </SectionShell>

      <SectionShell
        id="identity"
        eyebrow="Identity and access"
        title="Your identity environment remains yours"
        body={identity.principle}
      >
        {/* The three tiers of identity, stated as facts a review team can
            check against the pricing page: credentials everywhere, optional
            separately quoted institutional SSO across plans, identity governance under Enterprise. */}
        <Reveal staggerChildren className="grid gap-4 md:grid-cols-3">
          {[
            { step: "All plans", ...identity.baseline },
            { step: "Available separately", ...identity.sso },
            { step: "Enterprise", ...identity.enterprise },
          ].map((tier) => (
            <article
              key={tier.name}
              data-reveal-item
              className="surface-panel rounded-[1.6rem] p-6"
            >
              <p className="section-kicker">{tier.step}</p>
              <h3 className="mt-4 font-display text-2xl tracking-[-0.04em]">{tier.name}</h3>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted-foreground)]">
                {tier.body}
              </p>
            </article>
          ))}
        </Reveal>

        <Reveal className="mt-5">
          <IdentityFlow />
        </Reveal>

        <Reveal delay={80}>
          <div className="surface-panel mt-5 rounded-[1.6rem] p-6 sm:p-7">
            <p className="section-kicker">Sign-in modes the institution chooses between</p>
            <ol className="mt-4 grid gap-2 sm:grid-cols-3">
              {identity.modes.map((mode, index) => (
                <li
                  key={mode}
                  className="rounded-[1.2rem] bg-[color:var(--surface-muted)] px-4 py-4 text-sm leading-6 text-[color:var(--foreground)]"
                >
                  <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                    Mode {index + 1}
                  </span>
                  <span className="mt-2 block">{mode}</span>
                </li>
              ))}
            </ol>
            <ul className="mt-5 grid gap-2 border-t border-[color:var(--line)] pt-5">
              {identity.notes.map((note) => (
                <li key={note} className="text-sm leading-6 text-[color:var(--muted-foreground)]">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell
        id="documents"
        eyebrow="Documents on request"
        title="What we share in writing during a security review"
        body="Ask for any of these by email. They are shared under the security review process, not published."
        compactBody
      >
        <Reveal className="surface-panel rounded-[1.6rem] p-6 lg:p-7">
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Completed vendor security questionnaires",
              "Hosting and data-flow documentation",
              "Availability, backup and recovery design",
              "Encryption and access-control implementation notes",
              "The Data Processing Addendum and data retention approach",
              "Identity and sign-in configuration for your plan",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-foreground">
                <FileText aria-hidden className="mt-0.5 size-4 shrink-0 text-(--brand)" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-(--line) pt-5 text-sm">
            <Link href={siteHref("squarecampus", "/data-processing-addendum/")} className="underline underline-offset-4">
              Data Processing Addendum
            </Link>
            <Link href={siteHref("squarecampus", "/data-retention/")} className="underline underline-offset-4">
              Data retention
            </Link>
            <Link href="/infrastructure/" className="underline underline-offset-4">
              Infrastructure
            </Link>
            <Link href="/pgp/" className="underline underline-offset-4">
              PGP key
            </Link>
          </div>
        </Reveal>
      </SectionShell>

      {/* This route's FAQPage JSON-LD is built from the same array. Previously
          the schema declared answers that were never rendered anywhere. */}
      <SectionShell
        id="security-faq"
        eyebrow="Security questions"
        title="What review teams ask first"
      >
        <Reveal>
          <DetailsFaq items={securityFaqs} />
        </Reveal>
      </SectionShell>

      <SectionShell className="pb-22">
        <Reveal className="surface-panel-strong rounded-[2rem] p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
            <div>
              <p className="section-kicker">Security review</p>
              <h2 className="mt-4 font-display text-3xl tracking-[-0.05em] sm:text-4xl">
                Bring your questionnaire, policy concerns, or institutional requirements.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted-foreground)]">
                The right trust conversation covers the real product controls, the operating
                posture, and how the institution can stay confident after go-live.
              </p>
            </div>
            <div className="grid gap-3">
              <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} />
              <ButtonLink
                href="mailto:security@squarecampus.com"
                label="Email security"
                variant="secondary"
              />
            </div>
          </div>
        </Reveal>
      </SectionShell>
    </main>
  );
}
