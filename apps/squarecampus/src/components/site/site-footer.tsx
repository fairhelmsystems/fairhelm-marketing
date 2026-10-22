import { FooterBackground } from "@fairhelm/ui/backgrounds/footer-background";
import { Mail, MapPin } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { company, copyrightLine } from "@/content/company";
import {
  ctaLabels,
  footerContact,
  footerGroups,
  siteCtas,
  socialLinks,
} from "@/content/site-content";
import { BrandLogo } from "./brand-logo";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { MobileExpand } from "@fairhelm/ui/components/mobile-expand";
import { SourceLink } from "./source-link";

const socialIconPaths: Record<(typeof socialLinks)[number]["icon"], string> = {
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.775.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.006.404 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
};

function SocialIcon({ name }: { name: (typeof socialLinks)[number]["icon"] }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d={socialIconPaths[name]} />
    </svg>
  );
}

function DisclosureField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
        {label}
      </p>
      <div className="text-sm leading-6 text-[color:var(--muted-foreground)]">{children}</div>
    </div>
  );
}

/**
 * Statutory company disclosure. Section 12(3) of the Companies Act, 2013
 * requires the company's name, registered office, CIN, telephone and email on
 * its business letters and notices; the footer is the surface that carries it
 * on every page. It stays visible rather than collapsing behind a link — the
 * mobile disclosure above it is for navigation, not for this.
 */
function CompanyDisclosure() {
  return (
    <address className="grid gap-6 not-italic py-6 sm:grid-cols-[1.7fr_1fr]">
      {/* Contact sits directly under the registered office: both answer
          "where do I reach the company", so they read as one block. */}
      <div className="flex flex-col gap-6">
        <DisclosureField label="Registered office">
          <p className="font-medium text-[color:var(--foreground)]">{company.legalName}</p>
          <p className="mt-1">{company.address.full}</p>
        </DisclosureField>
        <DisclosureField label="Contact">
          <a
            href={`mailto:${company.email.general}`}
            className="block transition-colors hover:text-[color:var(--foreground)]"
          >
            {company.email.general}
          </a>
          {company.phone ? (
            <a
              href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
              className="mt-1 block transition-colors hover:text-[color:var(--foreground)]"
            >
              {company.phone}
            </a>
          ) : null}
        </DisclosureField>
      </div>
      <DisclosureField label="CIN">
        <p className="font-mono text-[0.78rem] tracking-tight text-[color:var(--foreground)]">
          {company.cin}
        </p>
        <p className="mt-1">{company.incorporationStatus}</p>
        <p className="mt-2">
          GSTIN{" "}
          <span className="font-mono text-[0.78rem] tracking-tight text-[color:var(--foreground)]">
            {company.gstin}
          </span>
        </p>
      </DisclosureField>
    </address>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-[color:var(--line)] px-4 pb-10 pt-16 sm:px-6 lg:px-8 lg:pt-20">
      <FooterBackground />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* No shared closing CTA here (audit SC-032): every page ends with its
            own context-specific next step, so a second, generic conversion
            panel directly underneath it only repeated the ask — and on /demo/
            it linked the page to itself. */}
        <div className="grid gap-8 border-b border-[color:var(--line)] pb-8 sm:gap-10 sm:pb-10 lg:grid-cols-[1fr_1.95fr] lg:gap-12">
          <div className="space-y-5">
            <BrandLogo subtitle="One login. One timeline. One truth." />
            <div className="flex flex-wrap items-center gap-2">
              <ButtonLink href={siteCtas.demoHref} label={ctaLabels.demo} variant="secondary" />
              <ButtonLink href={siteCtas.loginHref} label="Sign in" external variant="ghost" />
            </div>
            <p className="hidden max-w-md text-sm leading-7 text-[color:var(--muted-foreground)] sm:block">
              Built for schools, colleges, and multi-campus institutions that need operational
              clarity without sacrificing reliability.
            </p>
            <div className="grid gap-2 text-sm text-[color:var(--muted-foreground)]">
              <a
                href={`mailto:${footerContact.sales}`}
                className="inline-flex items-center gap-2 hover:text-[color:var(--foreground)]"
              >
                <Mail className="size-4" />
                {footerContact.sales}
              </a>
              <div className="inline-flex items-center gap-2">
                <MapPin className="size-4" />
                {footerContact.location}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={link.label}
                  className="inline-flex size-9 items-center justify-center rounded-full bg-[color:var(--surface-strong)] text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--foreground)]"
                >
                  <SocialIcon name={link.icon} />
                </a>
              ))}
            </div>
          </div>

          <MobileExpand label="Explore all pages" title="All pages">
            <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8 lg:gap-x-8">
              {footerGroups.map((group) => (
                <div key={group.title}>
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                    {group.title}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {group.links.map((link) => {
                      // A path with an extension is a file, not a route. The
                      // client router cannot navigate to one, so those render
                      // as plain anchors. Same test the CloudFront function
                      // uses to decide what not to canonicalise.
                      const isFile = link.href.includes(".");
                      const className =
                        "text-sm text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--foreground)]";
                      return (
                        <li key={link.href}>
                          {isFile ? (
                            <a href={link.href} className={className}>
                              {link.label}
                            </a>
                          ) : (
                            <Link href={link.href} className={className}>
                              {link.label}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </MobileExpand>
        </div>

        <CompanyDisclosure />

        <div className="flex flex-col gap-4 border-t border-[color:var(--line)] pt-6 text-sm text-[color:var(--muted-foreground)] sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-[color:var(--muted-foreground)]">
              Built with ❤️ in Bharath
            </p>
            <p>For institutions that cannot afford operational drift.</p>
          </div>
          <SourceLink />
          <div className="sm:max-w-md sm:text-right">
            <p>{copyrightLine(new Date().getFullYear())}</p>
            <p className="mt-1">{company.trademarkNotice}</p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none relative hidden overflow-hidden pt-6 sm:block">
        <p
          aria-hidden="true"
          className="select-none text-center font-display text-[4rem] uppercase tracking-[0.22em] text-[color:var(--foreground)]/[0.045] md:text-[5.5rem] lg:text-[7rem]"
        >
          SquareCampus
        </p>
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[color:var(--background)] to-transparent" />
      </div>
    </footer>
  );
}
