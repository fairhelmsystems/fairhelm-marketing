import { LEGAL_ORIGIN } from "@fairhelm/config/urls";
import { siteConfig } from "@fairhelm/fairhelm-content/company";
import { IconBadge, ResourceCard } from "@fairhelm/ui/components/resource-card";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  Building2,
  FileCheck2,
  FileText,
  GraduationCap,
  Mail,
  Scale,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { documentPath, documentScopes, type LegalScope } from "@/lib/documents";

export const metadata: Metadata = {
  title: "Policies and legal documents",
  description:
    "Understand which Fairhelm Systems and SquareCampus documents apply, from privacy notices and AI policies to service terms and data processing.",
  alternates: { canonical: `${LEGAL_ORIGIN}/` },
};

const documentIcons: Record<string, typeof FileText> = {
  privacy: ShieldCheck,
  "privacy-policy": ShieldCheck,
  terms: Scale,
  "terms-of-service": Scale,
  "acceptable-use": FileCheck2,
  "ai-policy": BrainCircuit,
  "data-processing": FileText,
  "data-processing-addendum": FileText,
  "data-retention": BookOpen,
  "refund-policy": FileCheck2,
};

const comparisons = [
  {
    icon: ShieldCheck,
    title: "Privacy notices",
    description: "Who handles personal data, why it is used and how to exercise rights.",
    company:
      "Fairhelm’s notice covers its website and personal data in contracted deployments. The website itself handles technical and enquiry data.",
    product:
      "SquareCampus’s notice explains product data, institutional roles and student, guardian and staff information. The institution’s own notice governs its relationship with those people.",
    companyPath: "privacy",
    productPath: "privacy-policy",
  },
  {
    icon: BrainCircuit,
    title: "AI policies",
    description: "Shared principles, with different levels of product detail.",
    company:
      "Fairhelm describes its public AI posture and AEGIS direction, including human oversight, authority boundaries and customer-data training limits.",
    product:
      "SquareCampus describes AI feature use, institutional controls, data handling and human review within the product.",
    companyPath: "ai-policy",
    productPath: "ai-policy",
  },
  {
    icon: FileText,
    title: "Data processing",
    description: "A public overview and a processing addendum serve different purposes.",
    company:
      "The Fairhelm overview explains what an engagement-specific agreement needs to address. It is not a signed DPA or a set of processing instructions.",
    product:
      "The SquareCampus addendum sets out institutional and provider responsibilities for service data. Read it with the agreement that applies to your engagement.",
    companyPath: "data-processing",
    productPath: "data-processing-addendum",
  },
  {
    icon: Scale,
    title: "Terms and acceptable use",
    description:
      "Browsing a website and operating a school system carry different responsibilities.",
    company:
      "Company website terms cover public-site access and use. Contracted products and services have their own applicable agreements.",
    product:
      "SquareCampus service terms cover accounts, licences, subscriptions, institutional users and product access. Its acceptable-use policy covers use of the service.",
    companyPath: "terms",
    productPath: "terms-of-service",
  },
];

export function DocumentDirectory({ scope }: { scope?: LegalScope }) {
  const collection = scope ? documentScopes[scope] : undefined;
  return (
    <main id="main-content" tabIndex={-1}>
      <SectionShell
        eyebrow="Fairhelm Systems · Legal center"
        title={
          collection ? `${collection.name} documents` : "Know what applies. Find what you need."
        }
        as="h1"
        titleSize="page"
        body={
          collection
            ? collection.description
            : "One company, with documents for different relationships. Start with the company or product you use, then check the scope of the document and your applicable agreement."
        }
      >
        {!scope ? (
          <div className="mb-8 flex items-start gap-4 rounded-2xl border border-(--line) bg-(--surface-strong) p-5 sm:p-6">
            <IconBadge>
              <BookOpen className="size-5" />
            </IconBadge>
            <div className="min-w-0">
              <h2 className="font-display text-lg text-foreground">A guide to the documents</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                Fairhelm Systems is the company behind SquareCampus. Some principles overlap, but a
                company website notice, a product policy and a customer agreement answer different
                questions. Each document states its scope; signed agreements and order forms govern
                the engagements they cover.
              </p>
              <a
                href="#reading-guide"
                className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-(--brand)"
              >
                Compare similar titles <ArrowRight aria-hidden className="size-4" />
              </a>
            </div>
          </div>
        ) : null}
        <div className="grid items-start gap-6 md:grid-cols-2">
          {(["fairhelm", "squarecampus"] as const)
            .filter((item) => !scope || item === scope)
            .map((item) => {
              const collection = documentScopes[item];
              const ScopeIcon = item === "fairhelm" ? Building2 : GraduationCap;
              return (
                <ResourceCard
                  key={item}
                  icon={<ScopeIcon className="size-5" />}
                  eyebrow={collection.label}
                  title={collection.name}
                  className={scope ? "md:col-span-2" : undefined}
                >
                  <p className="type-body mt-5 text-muted-foreground">{collection.description}</p>
                  <nav aria-label={`${collection.name} documents`} className="mt-6 grid gap-2">
                    {collection.documents.map((document) => {
                      const Icon = documentIcons[document.slug] ?? FileText;
                      return (
                        <Link
                          key={document.slug}
                          href={documentPath(item, document.slug)}
                          className="group flex items-start gap-3 rounded-2xl border border-(--line) bg-(--surface) px-4 py-4 transition-colors hover:border-(--line-strong) hover:bg-(--surface-muted) focus-visible:outline-2 focus-visible:outline-(--brand)"
                        >
                          <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-(--brand)" />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-foreground">
                              {document.title}
                            </span>
                            <span className="mt-1 block text-xs leading-6 text-muted-foreground">
                              {document.description}
                            </span>
                          </span>
                          <ArrowUpRight
                            aria-hidden
                            className="mt-0.5 size-4 shrink-0 text-muted-foreground group-hover:text-(--brand)"
                          />
                        </Link>
                      );
                    })}
                  </nav>
                  {!scope ? (
                    <Link
                      href={documentPath(item)}
                      className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-(--brand)"
                    >
                      View {collection.name} documents <ArrowRight aria-hidden className="size-4" />
                    </Link>
                  ) : null}
                </ResourceCard>
              );
            })}
        </div>
      </SectionShell>
      {!scope ? (
        <SectionShell
          id="reading-guide"
          eyebrow="Reading guide"
          title="Similar titles. Specific scopes."
          body="Use these distinctions to find the right document. This guide helps you navigate; the linked documents retain their own wording and status."
          className="pt-0 sm:pt-0 lg:pt-0"
        >
          <div className="grid gap-6">
            {comparisons.map((item) => (
              <ResourceCard
                key={item.title}
                title={item.title}
                icon={<item.icon className="size-5" />}
              >
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.description}</p>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="border-t border-(--line) pt-5">
                    <h3 className="eyebrow">Fairhelm Systems</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.company}</p>
                    <Link
                      href={documentPath("fairhelm", item.companyPath)}
                      className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-(--brand)"
                    >
                      Read the company document <ArrowUpRight aria-hidden className="size-4" />
                    </Link>
                  </div>
                  <div className="border-t border-(--line) pt-5">
                    <h3 className="eyebrow">SquareCampus</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.product}</p>
                    <Link
                      href={documentPath("squarecampus", item.productPath)}
                      className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-(--brand)"
                    >
                      Read the product document <ArrowUpRight aria-hidden className="size-4" />
                    </Link>
                  </div>
                </div>
              </ResourceCard>
            ))}
          </div>
        </SectionShell>
      ) : null}
      <SectionShell className="pt-0 sm:pt-0 lg:pt-0">
        <ResourceCard
          icon={<Mail className="size-5" />}
          eyebrow="Need a hand?"
          title="Find the right starting point."
        >
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            For questions about a document or the terms for a particular engagement, contact the
            company. For a personal-data request, use the contact and process stated in the
            applicable privacy notice.
          </p>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-(--brand)"
          >
            {siteConfig.contactEmail}
            <ArrowUpRight aria-hidden className="size-4" />
          </a>
        </ResourceCard>
      </SectionShell>
    </main>
  );
}
export default function Page() {
  return <DocumentDirectory />;
}
