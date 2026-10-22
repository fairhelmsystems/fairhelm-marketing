export type LegalScope = "fairhelm" | "squarecampus";
export type LegalDocumentLink = { slug: string; title: string; description: string };

export const documentScopes = {
  fairhelm: {
    name: "Fairhelm Systems",
    label: "Company and services",
    description:
      "Public website terms, company privacy information and Fairhelm’s approach to contracted services. The processing overview and AI posture explain their own status and limits.",
    documents: [
      {
        slug: "privacy",
        title: "Company privacy notice",
        description:
          "Website enquiries, technical data and personal data in contracted deployments; roles, rights and contacts.",
      },
      {
        slug: "terms",
        title: "Website terms",
        description:
          "Access to the public company website. Product and service engagements have their own agreements.",
      },
      {
        slug: "acceptable-use",
        title: "Website acceptable use",
        description:
          "Responsible use of the public site, prohibited conduct and security reporting.",
      },
      {
        slug: "ai-policy",
        title: "AI and governed intelligence",
        description:
          "Fairhelm’s public AI posture, including AEGIS direction, human oversight and training boundaries.",
      },
      {
        slug: "data-processing",
        title: "Data processing overview",
        description:
          "Questions a customer agreement needs to address. This public overview is not a signed DPA.",
      },
      {
        slug: "refund-policy",
        title: "Company cancellation and refunds",
        description:
          "The public position for scoped engagements; applicable signed terms determine the engagement.",
      },
    ],
  },
  squarecampus: {
    name: "SquareCampus",
    label: "Product and institutional use",
    description:
      "Policies for the SquareCampus service and its institutional users, including student and guardian data, product controls, subscription terms and processing responsibilities.",
    documents: [
      {
        slug: "privacy-policy",
        title: "SquareCampus privacy policy",
        description:
          "Personal data handled through the product, institutional responsibilities and individual rights.",
      },
      {
        slug: "terms-of-service",
        title: "SquareCampus terms of service",
        description:
          "Service access, accounts, licences, subscriptions and institutional responsibilities.",
      },
      {
        slug: "data-processing-addendum",
        title: "Data processing addendum",
        description:
          "Processing roles and obligations between the institution and the service provider, read with the applicable agreement.",
      },
      {
        slug: "data-retention",
        title: "Data retention",
        description:
          "How retention is determined, reviewed schedules, exit, deletion and backup considerations.",
      },
      {
        slug: "acceptable-use",
        title: "Product acceptable use",
        description:
          "Permitted and prohibited use of the SquareCampus service by institutions and authorised users.",
      },
      {
        slug: "ai-policy",
        title: "SquareCampus AI policy",
        description:
          "How AI features are used in the product, with human oversight, data boundaries and institutional controls.",
      },
      {
        slug: "refund-policy",
        title: "SquareCampus cancellation and refunds",
        description:
          "Subscription cancellation, implementation work, refund requests and applicable signed terms.",
      },
    ],
  },
} satisfies Record<
  LegalScope,
  { name: string; label: string; description: string; documents: LegalDocumentLink[] }
>;

export function documentPath(scope: LegalScope, slug = "") {
  return `/${scope}/${slug ? `${slug}/` : ""}`;
}
