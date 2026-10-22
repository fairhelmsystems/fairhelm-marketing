import {
  blogHref,
  fairhelmHref,
  LEGAL_ORIGIN,
  legalHref,
  legalUrl,
  pressHref,
  squarecampusHref,
} from "./urls";

export type CompanyPublication = "fairhelm" | "legal" | "press" | "blogs";

/** Keep same-app navigation local; cross-app links go directly to their owner. */
export function companyFooterGroups(app: CompanyPublication) {
  const company = (path: string) => (app === "fairhelm" ? path : fairhelmHref(path));
  const legal = (path: string) =>
    app === "legal"
      ? legalUrl("fairhelm", path).replace(LEGAL_ORIGIN, "")
      : legalHref("fairhelm", path);
  const legalHome = app === "legal" ? "/" : legalHref("fairhelm").replace(/\/fairhelm\/$/, "/");
  return [
    {
      label: "Product",
      links: [
        { label: "SquareCampus", href: company("/squarecampus/") },
        { label: "squarecampus.com", href: squarecampusHref("/") },
      ],
    },
    {
      label: "Engineering",
      links: [
        { label: "Data engineering", href: company("/services/data-engineering/") },
        { label: "Operational dashboards", href: company("/services/dashboards/") },
      ],
    },
    {
      label: "Company",
      links: [
        { label: "Fairhelm Systems", href: company("/") },
        { label: "About", href: company("/about/") },
        { label: "Journal", href: app === "blogs" ? "/" : blogHref("/") },
        { label: "Press", href: app === "press" ? "/" : pressHref("/") },
        { label: "Security", href: company("/security/") },
        { label: "Contact", href: company("/contact/") },
        { label: "GitHub", href: "https://github.com/Fairhelm-Systems" },
        { label: "For AI agents", href: company("/ai/") },
        { label: "llms.txt", href: company("/llms.txt") },
      ],
    },
    {
      label: "Trust & legal",
      links: [
        { label: "Legal center", href: legalHome },
        { label: "Privacy", href: legal("/privacy/") },
        { label: "Terms", href: legal("/terms/") },
        { label: "Acceptable use", href: legal("/acceptable-use/") },
        { label: "Refunds", href: legal("/refund-policy/") },
        { label: "AI policy", href: legal("/ai-policy/") },
        { label: "Data processing", href: legal("/data-processing/") },
      ],
    },
  ];
}
