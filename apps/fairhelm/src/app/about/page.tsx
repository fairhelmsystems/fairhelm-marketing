import {
  BarChart3,
  Boxes,
  Building2,
  CloudCog,
  DatabaseZap,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Waypoints,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { CtaBand } from "@/components/site/cta-band";
import { FeatureCard } from "@/components/site/feature-card";
import { Hero } from "@/components/site/hero";
import { JsonLd } from "@/components/site/json-ld";
import { PageNav } from "@/components/site/page-nav";
import { RelatedInsights } from "@/components/site/related-insights";
import { SectionHeading } from "@/components/site/section-heading";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata = createPageMetadata({
  title: "About Fairhelm Systems — Technology Company in Bangalore, India",
  description:
    "Fairhelm Systems is a product-first technology company in Bangalore, India. It builds and operates SquareCampus, its School Operating System, and selectively takes on data engineering and operational dashboard work.",
  path: "/about/",
});

const capabilities = [
  {
    icon: GraduationCap,
    title: "SquareCampus",
    motif: "orbit" as const,
    description:
      "The flagship product: a School Operating System for schools, universities and multi-campus educational institutions, developed and operated by Fairhelm.",
    href: siteConfig.product.page,
  },
  {
    icon: DatabaseZap,
    title: "Data engineering",
    motif: "flow" as const,
    description:
      "ETL and ELT systems built around accuracy, reconciliation, observability and accountable production refresh.",
    href: "/services/data-engineering/",
  },
  {
    icon: BarChart3,
    title: "Operational intelligence",
    motif: "bars" as const,
    description:
      "Decision infrastructure that connects trusted metrics to drilldowns, exceptions, ownership and action.",
    href: "/services/dashboards/",
  },
  {
    icon: CloudCog,
    title: "Platform engineering",
    motif: "mesh" as const,
    description:
      "Product and platform engineering, taken on only where it clearly aligns with Fairhelm's data and product focus.",
  },
];

const standard = [
  [
    Waypoints,
    "Systems before screens",
    "A polished interface cannot rescue weak process, ambiguous ownership or unreliable data.",
  ],
  [
    ShieldCheck,
    "Governance before automation",
    "Automation should operate inside explicit authority, audit and privacy boundaries.",
  ],
  [
    Boxes,
    "Products with operating context",
    "SquareCampus begins with the cycles and constraints of Indian educational institutions.",
  ],
  [
    CloudCog,
    "Engineering with economic judgment",
    "Architecture, service levels and cloud cost should align to the value and risk of the workload.",
  ],
] as const;

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about/" },
        ])}
      />
      <Hero
        eyebrow="About Fairhelm Systems"
        title="A product-first technology company in Bangalore, built for serious operations."
        highlight="product-first technology company"
        description="Fairhelm Systems builds and operates software products and governed data systems. Its flagship product is SquareCampus, a School Operating System for educational institutions. Alongside it, Fairhelm selectively takes on data engineering and dashboard work where reliability, privacy and execution discipline are not negotiable."
        primary={{ label: "Work with Fairhelm", href: "/contact/" }}
        secondary={{ label: "Explore SquareCampus", href: "/squarecampus/" }}
        bullets={[
          "Incorporated in India under the Companies Act, 2013",
          "Registered office in Bangalore, Karnataka",
          "Product first, engineering services by exception",
          "No customer logos, metrics or awards published",
        ]}
        visualLabel={null}
      >
        <div className="panel p-2.5 sm:p-3">
          <div className="panel-inner p-5 sm:p-7">
            <div className="flex items-center gap-5">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-[#f4f6fa] p-3 shadow-sm">
                <Image
                  src="/brand/fairhelm-logo.svg"
                  alt="Fairhelm Systems logo mark"
                  width={562}
                  height={892}
                  className="h-full w-auto"
                  priority
                />
              </div>
              <div>
                <p className="eyebrow text-[0.6rem]">Operating brand</p>
                <p className="mt-2 font-heading text-xl tracking-[-0.02em] text-foreground">
                  Fairhelm Systems
                </p>
              </div>
            </div>
            <dl className="mt-7 grid gap-5 border-t border-border pt-6 sm:grid-cols-2">
              <div>
                <dt className="eyebrow text-[0.6rem]">Legal entity</dt>
                <dd className="mt-2 text-sm font-medium text-foreground">
                  {siteConfig.legalNameDisplay}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-[0.6rem]">CIN</dt>
                <dd className="mt-2 font-mono text-[0.8rem] tracking-tight text-foreground">
                  {siteConfig.cin}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-[0.6rem]">GSTIN</dt>
                <dd className="mt-2 font-mono text-[0.8rem] tracking-tight text-foreground">
                  {siteConfig.gstin}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-[0.6rem]">Incorporated</dt>
                <dd className="mt-2 text-sm text-foreground">
                  {siteConfig.incorporationDateDisplay} · One Person Company
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="eyebrow text-[0.6rem]">Registered office</dt>
                <dd className="mt-2 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                  <MapPin
                    aria-hidden="true"
                    className="mt-1.5 size-3.5 shrink-0 text-[color:var(--brand-ink)]"
                  />
                  {siteConfig.address.full}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Hero>

      <section className="section">
        <Container className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <SectionHeading
            eyebrow="The company"
            title="We build systems that survive scale, scrutiny and boardrooms."
            description="The Fairhelm standard is simple: understand the operating reality, establish clear authority, make the data defensible and engineer the system to behave predictably under pressure."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {standard.map(([Icon, title, description]) => (
              <FeatureCard key={title} icon={Icon} title={title} description={description} />
            ))}
          </div>
        </Container>
      </section>

      <section className="section border-y border-border section-alt">
        <Container>
          <SectionHeading
            eyebrow="Capability"
            title="Product thinking, data depth and operating discipline in one room."
            description="Fairhelm works across the layers that determine whether an institutional system creates clarity or simply relocates chaos."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability) => (
              <FeatureCard key={capability.title} {...capability} />
            ))}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <SectionHeading
            eyebrow="Scope"
            title="Product first. Services by exception."
            description={siteConfig.services.summary}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="surface-panel rounded-[var(--radius-panel)] p-5 sm:p-6">
              <span className="index">01</span>
              <h3 className="display-3 mt-3">
                Is Fairhelm a product company or a services company?
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {siteConfig.positioning.is} It is not {siteConfig.positioning.isNot.join(", ")}.
              </p>
            </div>
            <div className="surface-panel rounded-[var(--radius-panel)] p-5 sm:p-6">
              <span className="index">02</span>
              <h3 className="display-3 mt-3">Who operates SquareCampus?</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {siteConfig.product.relationship} Institutions should evaluate it at{" "}
                <a
                  href={siteConfig.product.url}
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  squarecampus.com
                </a>
                .
              </p>
            </div>
            <div className="surface-panel rounded-[var(--radius-panel)] p-5 sm:p-6">
              <span className="index">03</span>
              <h3 className="display-3 mt-3">What engineering work does Fairhelm take on?</h3>
              <ul className="mt-3 flex list-disc flex-col gap-1 pl-5 text-sm leading-6 text-muted-foreground">
                {siteConfig.services.lanes.map((lane) => (
                  <li key={lane.href}>
                    <Link
                      href={lane.href}
                      className="font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      {lane.name}
                    </Link>
                  </li>
                ))}
                <li>Product or platform engineering where it clearly aligns with that focus</li>
              </ul>
            </div>
            <div className="surface-panel rounded-[var(--radius-panel)] p-5 sm:p-6">
              <span className="index">04</span>
              <h3 className="display-3 mt-3">What is outside Fairhelm's scope?</h3>
              <ul className="mt-3 flex list-disc flex-col gap-1 pl-5 text-sm leading-6 text-muted-foreground">
                {siteConfig.services.outOfScope.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="section border-y border-border section-alt">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <SectionHeading
            eyebrow="How we operate"
            title="Sharp diagnosis. Explicit tradeoffs. Disciplined execution."
          />
          <div className="grid gap-6 text-base leading-7 text-muted-foreground sm:grid-cols-2">
            <p>
              We are comfortable saying a requirement is premature, a metric is unsafe, an
              automation needs tighter control, or an architecture is more expensive than the
              problem justifies.
            </p>
            <p>
              The objective is not maximum software. It is the minimum governed system that can
              reliably carry the institution to the next level of operating maturity.
            </p>
          </div>
        </Container>
      </section>

      <section className="section">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <SectionHeading
            eyebrow="Where we work from"
            title="Bangalore, India. Built for Indian institutional realities."
            description="Fairhelm is incorporated in India and works with schools, trusts and organisations across the country, designing for multi-entity operations, uneven source systems and real administrative pressure."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FeatureCard
              icon={Building2}
              title="Registered in Karnataka"
              description={`${siteConfig.legalNameDisplay}, ${siteConfig.incorporationStatus.toLowerCase()}.`}
            />
            <FeatureCard
              icon={MapPin}
              title="Registered office"
              description={siteConfig.address.full}
            />
          </div>
        </Container>
      </section>

      <RelatedInsights lane="/about/" />

      <PageNav
        items={[
          {
            eyebrow: "Flagship product",
            title: "SquareCampus",
            description: "How Fairhelm builds and operates its School Operating System.",
            href: "/squarecampus/",
          },
          {
            eyebrow: "Trust",
            title: "Security and governance posture",
            description:
              "RBAC, auditability, least privilege and tenant separation, stated as design posture.",
            href: "/security/",
          },
        ]}
      />

      <CtaBand
        title="Bring the operating problem, not a pre-selected buzzword."
        description="We will help frame the system, the controls, the data and the execution sequence that the outcome actually requires."
      />
    </>
  );
}
