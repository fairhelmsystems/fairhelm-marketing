import { FooterBackground } from "@fairhelm/ui/backgrounds/footer-background";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { MarketingContainer as Container } from "./marketing";

export type FooterLinkGroup = { label: string; links: readonly { label: string; href: string }[] };
export type FooterCompany = {
  description: string;
  legalName: string;
  legalNameDisplay: string;
  cin: string;
  incorporationStatus: string;
  gstin: string;
  contactEmail: string;
  phone?: string;
  trademarkNotice: string;
  address: { full: string };
};

function DisclosureField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="eyebrow text-[0.6rem]">{label}</span>
      <span className="text-sm leading-6 text-muted-foreground">{children}</span>
    </div>
  );
}

/**
 * Statutory company disclosure. Section 12(3)(c) of the Companies Act, 2013
 * requires the company's name, registered-office address, CIN, telephone and
 * email to be published on its business letters and notices; the site footer
 * is the surface that carries it on every page. It stays visible rather than
 * collapsing behind a link.
 */
function CompanyDisclosure({ company }: { company: FooterCompany }) {
  return (
    <address className="grid gap-6 not-italic sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
      <DisclosureField label="Registered office">
        <span className="block font-medium text-foreground">{company.legalName}</span>
        <span className="mt-1 flex items-start gap-2">
          <MapPin
            aria-hidden="true"
            className="mt-1.5 size-3.5 shrink-0 text-[color:var(--brand-ink)]"
          />
          {company.address.full}
        </span>
      </DisclosureField>
      <div className="flex flex-col gap-4">
        <DisclosureField label="CIN">
          <span className="font-mono text-[0.8rem] tracking-tight text-foreground">
            {company.cin}
          </span>
          <span className="mt-1 block">{company.incorporationStatus}</span>
        </DisclosureField>
        <DisclosureField label="GSTIN">
          <span className="font-mono text-[0.8rem] tracking-tight text-foreground">
            {company.gstin}
          </span>
        </DisclosureField>
      </div>
      <div className="flex flex-col gap-4">
        <DisclosureField label="Email">
          <a
            href={`mailto:${company.contactEmail}`}
            className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-[color:var(--brand-ink)]"
          >
            <Mail aria-hidden="true" className="size-3.5 text-[color:var(--brand-ink)]" />
            {company.contactEmail}
          </a>
        </DisclosureField>
        {company.phone ? (
          <DisclosureField label="Telephone">
            <a
              href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
              className="transition-colors hover:text-foreground"
            >
              {company.phone}
            </a>
          </DisclosureField>
        ) : null}
      </div>
    </address>
  );
}

export function CompanyFooter({
  brand,
  company,
  groups,
  location,
}: {
  brand: ReactNode;
  company: FooterCompany;
  groups: readonly FooterLinkGroup[];
  location: string;
}) {
  return (
    <footer
      className="relative overflow-hidden border-t border-border px-4 sm:px-6 lg:px-8"
      data-company-footer
    >
      <FooterBackground />
      <Container className="relative py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
          <div className="max-w-sm">
            {brand}
            <p className="mt-5 text-sm leading-6 text-muted-foreground">{company.description}</p>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin aria-hidden="true" className="size-3.5 text-[color:var(--brand-ink)]" />
              {location}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {groups.map((group) => (
              <div key={group.label} className="flex flex-col gap-3">
                <p className="eyebrow text-[0.6rem]">{group.label}</p>
                {group.links.map((link) =>
                  /^https?:/.test(link.href) ? (
                    <a
                      key={link.href}
                      href={link.href}
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                      <ArrowUpRight aria-hidden="true" className="size-3" />
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="my-9 h-px bg-border" />
        <CompanyDisclosure company={company} />
        <div className="my-9 h-px bg-border" />
        <div className="flex flex-col gap-3 text-xs leading-5 text-muted-foreground sm:flex-row sm:items-start sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.legalNameDisplay}. All rights reserved.
          </p>
          <p className="sm:max-w-sm sm:text-right">{company.trademarkNotice}</p>
        </div>
      </Container>
    </footer>
  );
}
