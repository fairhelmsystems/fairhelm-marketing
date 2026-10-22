import { Building2, LifeBuoy, Mail, Newspaper, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { PageSchema } from "@/components/site/page-schema";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { company } from "@/content/company";
import { ctaLabels, siteCtas } from "@/content/site-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact | Registered Office and Enquiries",
  description:
    "Registered office, corporate identity, and contact channels for Fairhelm Systems (OPC) Private Limited, the company behind SquareCampus.",
  path: "/contact",
  ogImage: "https://squarecampus.com/og/contact.png",
  ogDescription: "Registered office, CIN, and how to reach the team behind SquareCampus.",
});

const channels = [
  {
    icon: Mail,
    label: "Sales and general enquiries",
    value: company.email.general,
    href: `mailto:${company.email.general}`,
  },
  {
    icon: LifeBuoy,
    label: "Customer support",
    value: company.email.support,
    href: `mailto:${company.email.support}`,
  },
  {
    icon: ShieldCheck,
    label: "Privacy and data requests",
    value: company.email.privacy,
    href: `mailto:${company.email.privacy}`,
  },
  {
    icon: Newspaper,
    label: "Press and media",
    value: company.email.press,
    href: `mailto:${company.email.press}`,
  },
] as const;

export default function ContactPage() {
  return (
    <main tabIndex={-1} id="main-content">
      <PageSchema
        name="Contact | Registered Office and Enquiries"
        description="Registered particulars for Fairhelm Systems OPC, the mailbox for each kind of enquiry, and how to request a guided SquareCampus walkthrough."
        path="/contact"
        label="Contact"
      />

      {/* This section header is the page's H1: the page had no H1 at all,
          because SectionShell defaults its title to h2. */}
      <SectionShell
        as="h1"
        titleSize="page"
        eyebrow="Contact"
        title="Talk to the company behind SquareCampus."
        body="The right mailbox for what you need, a demo when you are ready to see the system, and the company's registered particulars."
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Contact choices first, registered particulars after (audit
              SC-029): most visitors want the right mailbox. The statutory
              particulars stay complete, below on phones and beside on desktop. */}
          <div className="grid content-start gap-4">
            <div className="surface-panel rounded-[1.6rem] p-6">
              <p className="section-kicker">Reach the right desk</p>
              <ul className="mt-5 grid gap-4">
                {channels.map(({ icon: Icon, ...channel }) => (
                  <li key={channel.href} className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-(--surface-strong) text-(--brand)">
                      <Icon className="size-3.5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs text-muted-foreground">{channel.label}</p>
                      <a href={channel.href} className="text-sm text-foreground hover:underline">
                        {channel.value}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface-panel rounded-[1.6rem] p-6">
              <p className="section-kicker">Evaluating SquareCampus?</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                A guided walkthrough is the fastest way to judge whether the system fits how your
                institution actually runs.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} />
                <ButtonLink
                  href={siteCtas.pricingHref}
                  label="See pricing model"
                  variant="secondary"
                />
              </div>
            </div>
          </div>

          <div className="surface-panel rounded-[1.6rem] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-(--surface-strong) text-(--brand)">
                <Building2 className="size-4" aria-hidden="true" />
              </span>
              <p className="section-kicker">Registered office</p>
            </div>
            <address className="mt-5 not-italic text-sm leading-7 text-muted-foreground">
              <span className="block text-base font-medium text-foreground">
                {company.legalName}
              </span>
              <span className="mt-2 block">{company.address.full}</span>
            </address>
            <dl className="mt-6 grid gap-4 border-t border-(--line) pt-6 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-muted-foreground">
                  CIN
                </dt>
                <dd className="mt-1.5 font-mono text-[0.8rem] text-foreground">{company.cin}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-muted-foreground">
                  Incorporated
                </dt>
                <dd className="mt-1.5 text-foreground">{company.incorporationDateDisplay}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-muted-foreground">
                  GSTIN
                </dt>
                <dd className="mt-1.5 font-mono text-[0.8rem] text-foreground">{company.gstin}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-muted-foreground">
                  GST registered
                </dt>
                <dd className="mt-1.5 text-foreground">{company.gstinRegistrationDateDisplay}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-muted-foreground">
                  Telephone
                </dt>
                <dd className="mt-1.5 text-muted-foreground">
                  {company.phone ? (
                    <a
                      href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
                      className="text-foreground hover:underline"
                    >
                      {company.phone}
                    </a>
                  ) : (
                    <>Email is the fastest route to us today.</>
                  )}
                </dd>
              </div>
            </dl>
            <p className="mt-6 text-xs leading-6 text-muted-foreground">
              {company.incorporationStatus}. These particulars are published under section 12(3) of
              the Companies Act, 2013.
            </p>
          </div>
        </div>
      </SectionShell>
    </main>
  );
}
