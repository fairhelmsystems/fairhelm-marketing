import {siteHref} from "@fairhelm/config/urls";
import { blogHref } from "@fairhelm/config/urls";
import type { NavigationGroup, NavigationLink } from "@fairhelm/ui/navigation/types";

export const siteCtas = {
  demoHref: "/demo",
  platformHref: "/platform",
  aegisHref: "/aegis",
  rolloutHref: "/rollout",
  whyDifferentHref: "/why-squarecampus",
  ecosystemHref: "/ecosystem",
  securityHref: "/security",
  pricingHref: "/pricing",
  launchPilotHref: "/pricing/#pilot",
  launchPartnersHref: "/launch-partners",
  loginHref: "https://app.squarecampus.com",
  /** Pricing enquiries use the dedicated Contact page. */
  proposalHref: "/contact/",
} as const;

/**
 * Call-to-action labels, one per journey (audit SC-005). The main product
 * journey says "Book a demo" everywhere and lands on /demo/; Pricing asks for
 * a proposal; diagnosis language belongs only to the Founding Partner journey.
 */
export const ctaLabels = {
  demo: "Book a demo",
  proposal: "Request a proposal",
  foundingPartner: "Request a partnership diagnosis",
} as const;

export type NavLink = NavigationLink;
export type NavGroup = NavigationGroup;

/**
 * Primary navigation, grouped by what a buyer is trying to do rather than by
 * product vocabulary (audit SC-030). Every route the old flat menu exposed is
 * still one click away inside a group; AEGIS and the apps stay under Product.
 */
export const primaryNavigation: readonly (NavGroup | NavLink)[] = [
  {
    label: "Product",
    links: [
      { href: "/platform", label: "Platform", description: "Everything on one school record" },
      { href: "/aegis", label: "AEGIS", description: "Read-only AI for school leaders" },
      {
        href: "/ecosystem",
        label: "Apps & Integrations",
        description: "Admin, teacher, parent and student apps",
      },
      { href: "/security", label: "Security", description: "Access, audit and hosting" },
      {
        href: "/what-is-squarecampus",
        label: "What is SquareCampus?",
        description: "A short definition",
      },
    ],
  },
  {
    label: "Solutions",
    links: [
      { href: "/school-admission-management-software", label: "Admissions" },
      { href: "/school-attendance-management-system", label: "Attendance" },
      { href: "/fee-management-software-for-schools", label: "Fee management" },
      { href: "/school-exam-management-software", label: "Exams & results" },
      { href: "/parent-communication-app-for-schools", label: "Parent communication" },
      { href: "/school-erp-software", label: "School ERP" },
      { href: "/multi-campus-school-management-software", label: "Multi-campus groups" },
      { href: "/school-management-system", label: "School management system" },
    ],
  },
  {
    label: "Implementation",
    links: [
      {
        href: "/rollout",
        label: "Rollout & migration",
        description: "Stages, inputs and sign-off",
      },
      {
        href: "/services",
        label: "Data & integration services",
        description: "Scoped integrations and deployment",
      },
      { href: "/infrastructure", label: "Infrastructure", description: "Where the platform runs" },
    ],
  },
  {
    label: "Pricing",
    footer: { href: "/enterprise", label: "Explore Enterprise" },
    links: [
      {
        href: "/pricing",
        label: "Pricing overview",
        description: "The institutional licence at a glance",
      },
      {
        href: "/pricing/#plans",
        label: "Plans & comparison",
        description: "Starter, Pro and Enterprise",
      },
      {
        href: "/pricing/#model",
        label: "How the licence works",
        description: "The inputs that shape your proposal",
      },
      {
        href: "/pricing/#scoped-separately",
        label: "Included & optional",
        description: "What the licence covers",
      },
      {
        href: "/pricing/#pilot",
        label: "Selected launch pilot",
        description: "Eligibility, scope and the 90-day evaluation",
      },
      {
        href: "/pricing/#procurement-faq",
        label: "Commercial questions",
        description: "Answers before you commit",
      },
      {
        href: "/contact/",
        label: "Request a proposal",
        description: "Start with your institution's requirements",
      },
    ],
  },
  {
    label: "Resources",
    links: [
      { href: "/why-squarecampus", label: "Why SquareCampus" },
      { href: "/compare", label: "Compare school ERPs" },
      { href: "/faq", label: "FAQ" },
      { href: blogHref("/"), label: "Blog" },
      { href: "/launch-partners", label: "Founding partners" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
] as const;

export function isNavGroup(item: NavGroup | NavLink): item is NavGroup {
  return "links" in item;
}

/**
 * Five balanced columns rather than one long "Platform" list and three short
 * ones. Grouped by what the reader is trying to do — understand the product,
 * evaluate commercially, learn about the company, verify trust, read terms.
 * Home is omitted: the footer brand mark already links there.
 *
 * Careers and Press stay out until they have real content; both are noindex
 * and reachable by direct link only.
 */
export const footerGroups = [
  {
    title: "Product",
    links: [
      { href: "/what-is-squarecampus", label: "What is SquareCampus?" },
      { href: siteCtas.platformHref, label: "Platform" },
      { href: "/enterprise", label: "SquareCampus Enterprise" },
      { href: siteCtas.aegisHref, label: "AEGIS Intelligence" },
      { href: siteCtas.ecosystemHref, label: "Apps & Integrations" },
      { href: siteCtas.rolloutHref, label: "Rollout" },
      { href: "/services", label: "Data & Integration Services" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { href: "/school-erp-software", label: "School ERP Software" },
      { href: "/fee-management-software-for-schools", label: "Fee Management" },
      { href: "/school-attendance-management-system", label: "Attendance" },
      { href: "/school-admission-management-software", label: "Admissions" },
      { href: "/school-exam-management-software", label: "Exams & Results" },
      { href: "/parent-communication-app-for-schools", label: "Parent Communication" },
    ],
  },
  {
    title: "Institutions",
    links: [
      { href: "/school-management-system", label: "School Management System" },
      { href: "/multi-campus-school-management-software", label: "Multi-Campus Groups" },
      { href: "/school-management-software-for-cbse-schools", label: "CBSE Schools" },
      { href: "/school-management-software-for-icse-schools", label: "ICSE Schools" },
      { href: "/school-management-software-for-state-board-schools", label: "State Board Schools" },
      { href: "/launch-partners/higher-education", label: "Higher Education" },
      { href: siteCtas.launchPartnersHref, label: "Founding Partners" },
    ],
  },
  {
    title: "Evaluate",
    links: [
      { href: siteCtas.pricingHref, label: "Pricing" },
      { href: siteCtas.launchPilotHref, label: "Selected Launch Pilot" },
      { href: siteCtas.whyDifferentHref, label: "Why SquareCampus" },
      { href: "/compare", label: "Compare School ERPs" },
      { href: "/faq", label: "FAQ" },
      { href: blogHref("/"), label: "Blog" },
    ],
  },
  {
    title: "Company & Trust",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: siteCtas.securityHref, label: "Security" },
      { href: "/infrastructure", label: "Infrastructure" },
      { href: "/pgp", label: "PGP Key" },
      /*
        The site's machine-readable summary. It sat at /llms.txt with nothing
        on the site linking to it, so the only crawlers that could find it were
        the ones already guessing the conventional path. One real internal
        link, on every page, is what makes it discoverable to the rest —
        including the search crawlers that do not know the convention.

        Rendered as a plain anchor rather than a <Link>: it is a file, not a
        route, and the client router has nothing to navigate to. The footer
        decides that from the extension, the same test the edge function uses.
      */
      { href: "/llms.txt", label: "llms.txt" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: siteHref("squarecampus", "/privacy-policy"), label: "Privacy Policy" },
      { href: siteHref("squarecampus", "/terms-of-service"), label: "Terms of Service" },
      { href: siteHref("squarecampus", "/acceptable-use"), label: "Acceptable Use" },
      { href: siteHref("squarecampus", "/refund-policy"), label: "Cancellation & Refunds" },
      { href: siteHref("squarecampus", "/data-processing-addendum"), label: "Data Processing Addendum" },
      { href: siteHref("squarecampus", "/data-retention/"), label: "Data Retention" },
    ],
  },
] as const;

export const footerContact = {
  sales: "contact@squarecampus.com",
  support: "support@squarecampus.com",
  location: "Bangalore, India",
} as const;

export const socialLinks = [
  {
    href: "https://www.linkedin.com/company/square-campus",
    label: "LinkedIn",
    icon: "linkedin",
  },
  {
    href: "https://x.com/squarecampushq",
    label: "X",
    icon: "x",
  },
  {
    href: "https://instagram.com/squarecampus",
    label: "Instagram",
    icon: "instagram",
  },
  {
    href: "https://github.com/fairhelmsystems",
    label: "GitHub",
    icon: "github",
  },
] as const;

/**
 * This website's own source code. The repository is public, so the claims
 * register, the build checks and every page's copy can be read by anyone —
 * including the checks that stop this site from overclaiming.
 */
export const siteSource = {
  repoUrl: "https://github.com/fairhelmsystems/squarecampus.com",
  label: "This site is open source",
  tooltip:
    "Read the code behind every page, including the claims register and the build checks that keep this site honest. Issues and pull requests welcome.",
} as const;
