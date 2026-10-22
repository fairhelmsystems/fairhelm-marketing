import { Check, Mail, MapPin } from "lucide-react";
import { ContactInquiry } from "@/components/site/contact-inquiry";
import { Container } from "@/components/site/container";
import { DataField } from "@/components/site/data-field";
import { JsonLd } from "@/components/site/json-ld";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata = createPageMetadata({
  title: "Contact Fairhelm Systems, Bangalore",
  description:
    "Discuss SquareCampus, ETL and ELT pipelines, operational dashboards or governed analytics with Fairhelm Systems in Bangalore, India. Registered office and corporate identity.",
  path: "/contact/",
});

const goodFit = [
  "A school, university or trust evaluating SquareCampus — start on squarecampus.com, then talk to us",
  "An operating process held together by spreadsheets and manual reconciliation",
  "A data pipeline or dashboard leadership cannot yet trust",
  "Platform engineering that clearly aligns with Fairhelm's data and product focus",
] as const;

function FitCard() {
  return (
    <div className="surface-panel rounded-[var(--radius-panel)] p-5 sm:p-6">
      <p className="eyebrow">Good fit</p>
      <h2 className="display-3 mt-3">Problems worth bringing to the table</h2>
      <ul className="mt-4 flex flex-col">
        {goodFit.map((item) => (
          <li
            key={item}
            className="flex gap-3.5 border-b border-border py-3.5 text-sm leading-6 text-muted-foreground first:pt-0 last:border-b-0 last:pb-0"
          >
            <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full border border-teal/30 bg-teal/10 text-teal">
              <Check aria-hidden="true" className="size-3" />
            </span>
            {item}
          </li>
        ))}
      </ul>
      <p className="eyebrow mt-5 border-t border-border pt-4 text-[0.6rem]">Outside our scope</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {siteConfig.services.outOfScope.join(" · ")}.
      </p>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact/" },
        ])}
      />

      <section className="hero-bleed relative isolate overflow-hidden border-b border-border">
        <div aria-hidden="true" className="hero-grid absolute inset-0 -z-10 opacity-45" />
        <div aria-hidden="true" className="hero-glow absolute inset-x-0 top-0 -z-10 h-[32rem]" />
        <DataField className="-z-10" />

        <Container className="relative grid items-start gap-10 pt-10 pb-12 sm:pt-16 sm:pb-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-x-14 lg:pt-20 lg:pb-24">
          <div className="hero-enter flex flex-col gap-5 lg:col-start-1 lg:row-start-1">
            <p className="eyebrow">Contact · Bangalore, India</p>
            <h1 className="display-1">
              Start with the <span className="text-gradient">concrete version</span> of the problem.
            </h1>
            <p className="lead max-w-xl text-pretty">
              Tell us what needs to work better, what is breaking down and where the current system
              is creating drag. The useful conversation starts there.
            </p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-[color:var(--brand-ink)]"
              >
                <Mail aria-hidden="true" className="size-4 text-[color:var(--brand-ink)]" />
                {siteConfig.contactEmail}
              </a>
              <span className="inline-flex items-start gap-2">
                <MapPin
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-[color:var(--brand-ink)]"
                />
                {siteConfig.address.locality}, {siteConfig.address.region}, India
              </span>
            </div>
          </div>

          <div className="hero-visual lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <ContactInquiry />
          </div>

          <div className="lg:col-start-1 lg:row-start-2">
            <FitCard />
          </div>
        </Container>
      </section>

      <section className="section-alt py-10 sm:py-14">
        <Container className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <address className="text-sm leading-6 not-italic text-muted-foreground">
            <span className="eyebrow">Registered office</span>
            <span className="mt-3 block font-medium text-foreground">{siteConfig.legalName}</span>
            <span className="mt-1 block">{siteConfig.address.full}</span>
          </address>
          <div className="text-sm leading-6 text-muted-foreground">
            <span className="eyebrow">Corporate identity</span>
            <span className="mt-3 block font-mono text-[0.8rem] tracking-tight text-foreground">
              {siteConfig.cin}
            </span>
            <span className="mt-1 block">{siteConfig.incorporationStatus}</span>
            <span className="mt-3 block">
              GSTIN{" "}
              <span className="font-mono text-[0.8rem] tracking-tight text-foreground">
                {siteConfig.gstin}
              </span>
            </span>
          </div>
          <div className="text-sm leading-6 text-muted-foreground">
            <span className="eyebrow">Reach us</span>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="mt-3 block text-foreground transition-colors hover:text-[color:var(--brand-ink)]"
            >
              {siteConfig.contactEmail}
            </a>
            {siteConfig.phone ? (
              <a
                href={`tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`}
                className="mt-1 block transition-colors hover:text-foreground"
              >
                {siteConfig.phone}
              </a>
            ) : null}
            <span className="mt-2 block font-mono text-xs text-muted-foreground/80">
              No hidden submission · no data capture
            </span>
          </div>
        </Container>
      </section>
    </>
  );
}
