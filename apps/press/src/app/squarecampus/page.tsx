import { PRESS_ORIGIN } from "@fairhelm/config/urls";
import { ResourceCard } from "@fairhelm/ui/components/resource-card";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { ArrowUpRight, Building2, GraduationCap, Mail, Newspaper } from "lucide-react";
import type { Metadata } from "next";
import { BrandDownloads } from "@/components/brand-downloads";
export const metadata: Metadata = {
  title: "SquareCampus press resources",
  alternates: { canonical: `${PRESS_ORIGIN}/squarecampus/` },
  robots: { index: false, follow: true },
};
const companyFacts = [
  {
    icon: GraduationCap,
    title: "Overview",
    body: "SquareCampus is an operating system for schools and colleges, connecting admissions, academics, finance, and communication into one platform.",
  },
  {
    icon: Building2,
    title: "Founded",
    body: "SquareCampus is a product of Fairhelm Systems (OPC) Private Limited, incorporated in India on 5 August 2026, founded and led by Mohit Gupta, sole founder.",
  },
  {
    icon: Mail,
    title: "Media contact",
    body: "For media enquiries, please write to press@squarecampus.com.",
  },
];
export default function Page() {
  return (
    <main tabIndex={-1} id="main-content">
      <SectionShell
        eyebrow="SquareCampus · Press"
        title="Press resources & media contact."
        as="h1"
        titleSize="page"
        body="For journalists, partners, and event organizers who need a concise view of what SquareCampus does and how to reach us."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {companyFacts.map((item) => (
            <ResourceCard
              key={item.title}
              title={item.title}
              icon={<item.icon className="size-5" />}
            >
              <p className="mt-5 text-sm leading-7 text-muted-foreground">{item.body}</p>
            </ResourceCard>
          ))}
        </div>
      </SectionShell>
      <SectionShell
        eyebrow="Brand resources"
        title="Company and product marks."
        className="pt-0 sm:pt-0 lg:pt-0"
      >
        <BrandDownloads />
      </SectionShell>
      <SectionShell
        eyebrow="Coverage"
        title="Press releases & coverage"
        className="pt-0 sm:pt-0 lg:pt-0"
      >
        <ResourceCard
          icon={<Newspaper className="size-5" />}
          title="No press releases published yet"
        >
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            Announcements and coverage will appear here as we grow. For official quotes, background,
            or data points, reach out and we’ll respond with what you need.
          </p>
          <a
            href="mailto:press@squarecampus.com"
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-(--brand)"
          >
            <Mail aria-hidden className="size-4" />
            Email media contact
            <ArrowUpRight aria-hidden className="size-4" />
          </a>
        </ResourceCard>
      </SectionShell>
    </main>
  );
}
