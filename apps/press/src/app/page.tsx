import { PRESS_ORIGIN, squarecampusHref } from "@fairhelm/config/urls";
import { siteConfig } from "@fairhelm/fairhelm-content/company";
import { ResourceCard } from "@fairhelm/ui/components/resource-card";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  GraduationCap,
  Mail,
  Newspaper,
  UserRound,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { BrandDownloads } from "@/components/brand-downloads";
export const metadata: Metadata = {
  title: "Press resources",
  alternates: { canonical: `${PRESS_ORIGIN}/` },
};
export default function Page() {
  return (
    <main id="main-content" tabIndex={-1}>
      <SectionShell
        eyebrow="Fairhelm Systems · Newsroom"
        title="The facts behind the work."
        as="h1"
        titleSize="page"
        body="Official company and product information for journalists, partners and event organisers. Find background, brand assets and the right contact for your story."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <ResourceCard
            icon={<Building2 className="size-5" />}
            eyebrow="Company"
            title="Fairhelm Systems"
          >
            <p className="type-body mt-5 text-muted-foreground">{siteConfig.descriptionLong}</p>
            <dl className="mt-6 grid gap-4 border-t border-(--line) pt-6 sm:grid-cols-2">
              <div>
                <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                  <UserRound aria-hidden className="size-4 text-(--brand)" />
                  Founded by
                </dt>
                <dd className="mt-2 text-sm text-foreground">{siteConfig.founder.name}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays aria-hidden className="size-4 text-(--brand)" />
                  Incorporated
                </dt>
                <dd className="mt-2 text-sm text-foreground">
                  {siteConfig.incorporationDateDisplay}
                </dd>
              </div>
            </dl>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm text-(--brand)"
            >
              <Mail aria-hidden className="size-4" />
              Company enquiries
            </a>
          </ResourceCard>
          <ResourceCard
            icon={<GraduationCap className="size-5" />}
            eyebrow="Flagship product"
            title="SquareCampus"
          >
            <p className="type-body mt-5 text-muted-foreground">
              A School Operating System for educational institutions, built and operated by Fairhelm
              Systems. It brings admissions, academics, finance and communication into one platform.
            </p>
            <div className="mt-6 rounded-2xl border border-(--line) bg-(--surface) p-5">
              <p className="eyebrow">For product stories</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Get a concise product overview, company background and the SquareCampus media
                contact.
              </p>
              <Link
                href="/squarecampus/"
                className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-(--brand)"
              >
                SquareCampus press resources
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
            <a
              href={squarecampusHref("/")}
              className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground"
            >
              Visit squarecampus.com
              <ArrowUpRight aria-hidden className="size-4" />
            </a>
          </ResourceCard>
        </div>
      </SectionShell>
      <SectionShell
        id="brand-assets"
        eyebrow="Brand resources"
        title="Company and product marks."
        body="Download the available company and product logos. For additional formats or usage questions, contact the team."
        className="pt-0 sm:pt-0 lg:pt-0"
      >
        <BrandDownloads />
      </SectionShell>
      <SectionShell
        eyebrow="Announcements"
        title="News, when there is news."
        className="pt-0 sm:pt-0 lg:pt-0"
      >
        <ResourceCard icon={<Newspaper className="size-5" />} title="Press releases and coverage">
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            No press releases or independent coverage have been published here yet. Please contact
            the team for official quotes or background.
          </p>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-(--brand)"
          >
            <Mail aria-hidden className="size-4" />
            {siteConfig.contactEmail}
          </a>
        </ResourceCard>
      </SectionShell>
    </main>
  );
}
