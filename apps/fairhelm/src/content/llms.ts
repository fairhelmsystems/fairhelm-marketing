import {siteHref} from "@fairhelm/config/urls";
import { blogUrl } from "@fairhelm/config/urls";
/**
 * /llms.txt — the company's machine-readable surface.
 *
 * Rendered by src/app/llms.txt/route.ts at build time from the canonical
 * facts in lib/site-config.ts, so it states exactly what the pages, the
 * JSON-LD and the footer state. It is navigational and factual: a short
 * orientation, then links with useful descriptions to the canonical pages.
 * It is deliberately small, far smaller than SquareCampus's own llms.txt,
 * contains no instructions to assistants, publishes no metrics, and
 * duplicates nothing that the linked pages state better.
 *
 * Structure follows the llms.txt convention: H1, a blockquote summary,
 * orientation bullets, then H2 sections of `- [title](url): description`.
 * Pages with a Markdown alternate are linked to it; everything else links to
 * the HTML page. tests/llms.test.ts checks the structure and that every
 * link resolves to a public route.
 */
import { hasMarkdownAlternate, markdownAlternatePath } from "@/content/markdown-alternates";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export type LlmsLink = { path: string; title: string; description: string };
export type LlmsSection = { heading: string; links: LlmsLink[] };

/** Absolute URL for a route, preferring the Markdown alternate where one exists. */
export function llmsUrl(path: string): string {
  const moved=siteHref("fairhelm",path);
  if(moved!==path) return moved;
  if (/^https?:/.test(path)) return path;
  if (path.includes(".")) return absoluteUrl(path);
  return absoluteUrl(hasMarkdownAlternate(path) ? markdownAlternatePath(path) : path);
}

/** The route a link resolves to, for sitemap checks (`.md` → its page). */
export function llmsRoute(path: string): string {
  return path.replace(/index\.md$/, "");
}

export const llmsSections: readonly LlmsSection[] = [
  {
    heading: "Products",
    links: [
      {
        path: siteConfig.product.url,
        title: "SquareCampus (canonical product site)",
        description:
          "The School Operating System itself: what it is, platform, security, pricing model, rollout and commercial programmes. Product and commercial questions are answered there, not here.",
      },
      {
        path: siteConfig.product.page,
        title: "SquareCampus at Fairhelm",
        description:
          "Operator context: Fairhelm Systems develops and operates SquareCampus, and how institutions should begin evaluating it.",
      },
    ],
  },
  {
    heading: "Capabilities",
    links: siteConfig.services.lanes.map((lane) => ({
      path: lane.href,
      title: lane.name,
      description: lane.summary,
    })),
  },
  {
    heading: "Company",
    links: [
      {
        path: "/about/",
        title: "About Fairhelm Systems",
        description:
          "What the company builds, how it operates, what engineering work it takes on and what is outside its scope.",
      },
      {
        path: "/contact/",
        title: "Contact",
        description:
          "How to engage Fairhelm for SquareCampus or for data engineering and dashboard work; registered office and corporate identity.",
      },
      {
        path: "/legal/",
        title: "Legal and company information",
        description:
          "The publishing entity, CIN, registered office and the index of public policies.",
      },
      {
        path: "/privacy/",
        title: "Privacy policy",
        description:
          "Data Fiduciary, categories of personal data, purposes, retention and Data Principal rights under the DPDP Act, 2023.",
      },
      {
        path: "/terms/",
        title: "Website terms",
        description:
          "Terms for the public website; contracted products and services are governed only by signed agreements.",
      },
    ],
  },
  {
    heading: "Insights",
    links: [
      {
        path: blogUrl("/fairhelm/"),
        title: "Insights: practice notes",
        description:
          "Long-form notes on reconciliation in ETL/ELT, KPI contracts and exception ownership for dashboards, readable audit trails, and why Fairhelm is product-first. Read all practice notes on the shared Fairhelm publication.",
      },
    ],
  },
  {
    heading: "Trust and security",
    links: [
      {
        path: "/security/",
        title: "Security and governance posture",
        description:
          "Role-based access, auditability, least privilege, tenant separation and privacy-first handling, stated as design posture rather than certification.",
      },
      {
        path: "/ai-policy/",
        title: "AI policy",
        description:
          "Boundaries for governed intelligence: human oversight, customer-data training limits and public AI agents.",
      },
      {
        path: "/ai/",
        title: "Information for AI agents and researchers",
        description:
          "Canonical names, sources and data-usage boundaries to use when describing Fairhelm Systems and SquareCampus.",
      },
    ],
  },
];

export function llmsLinks(): LlmsLink[] {
  return llmsSections.flatMap((section) => section.links).map(link=>({...link,path:siteHref("fairhelm",link.path)}));
}

export function renderLlmsTxt(): string {
  const c = siteConfig;
  const lines: string[] = [
    `# ${c.name}`,
    "",
    `> ${c.descriptionLong}`,
    "",
    `- Company: ${c.legalNameDisplay} (CIN ${c.cin}), ${c.companyType.toLowerCase()} incorporated in India on ${c.incorporationDateDisplay}. GSTIN ${c.gstin}. Registered office: ${c.address.full}.`,
    `- Positioning: ${c.positioning.is} It is not ${c.positioning.isNot.join(", ")}.`,
    `- Flagship product: ${c.product.name}, a ${c.product.category} for ${c.product.audience}. ${c.product.relationship}`,
    `- Engineering work: ${c.services.summary}`,
    `- Out of scope: ${c.services.outOfScope.map((s) => s.replace(/\.$/, "")).join("; ")}.`,
    `- Evidence: Fairhelm publishes no customer counts, named customers, testimonials, uptime figures, measured outcomes, rankings, awards or certifications. Interface examples on the site use illustrative data and are labelled as such.`,
    `- Canonical origin: ${c.url}/. Contact: ${c.contactEmail}.`,
    "",
  ];
  for (const section of llmsSections) {
    lines.push(`## ${section.heading}`, "");
    for (const link of section.links) {
      lines.push(`- [${link.title}](${llmsUrl(link.path)}): ${link.description}`);
    }
    lines.push("");
  }
  return `${lines.join("\n").trim()}\n`;
}
