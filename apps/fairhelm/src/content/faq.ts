import { siteConfig } from "@/lib/site-config";

/**
 * Buyer questions answered from the canonical facts. Rendered visibly on the
 * pages that use them and mirrored into FAQPage JSON-LD by `faqSchema`, so
 * search engines and assistants read the same words a visitor does.
 */
export type FaqItem = { question: string; answer: string };

const lanes = siteConfig.services.lanes.map((lane) => lane.name).join(" and ");

export const companyFaq: readonly FaqItem[] = [
  {
    question: "What does Fairhelm Systems do?",
    answer: siteConfig.descriptionLong,
  },
  {
    question: "Is Fairhelm Systems an IT services company or a product company?",
    answer: `${siteConfig.positioning.is} It is not ${siteConfig.positioning.isNot.join(", ")}.`,
  },
  {
    question: "Where is Fairhelm Systems based?",
    answer: `${siteConfig.legalNameDisplay} is incorporated in India (CIN ${siteConfig.cin}) with its registered office in ${siteConfig.address.locality}, ${siteConfig.address.region}. It builds for Indian institutional realities and serves organisations across India.`,
  },
  {
    question: "What is SquareCampus, and who operates it?",
    answer: `${siteConfig.product.description} ${siteConfig.product.relationship}`,
  },
  {
    question: "What engineering work does Fairhelm take on?",
    answer: `${lanes}, plus product or platform engineering where it clearly aligns with that focus. Outside scope: ${siteConfig.services.outOfScope.join("; ")}.`,
  },
  {
    question: "How do I start a conversation with Fairhelm Systems?",
    answer: `Write to ${siteConfig.contactEmail} or use the inquiry form on the contact page with the concrete operating problem. Institutions evaluating SquareCampus should start at squarecampus.com, which holds product, security and pricing information.`,
  },
];
