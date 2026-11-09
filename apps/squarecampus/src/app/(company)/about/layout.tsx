import type { Metadata } from "next";
import type { ReactNode } from "react";
import { product } from "@/content/commercial";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About SquareCampus | Enterprise School OS for India",
  description: `SquareCampus is an ${product.category} for Indian schools and trusts, developed and operated by Fairhelm Systems. Meet the founder-led team.`,
  path: "/about",
  ogImage: "https://squarecampus.com/og/about.png",
  ogTitle: "About SquareCampus | The Team Behind the Enterprise School OS",
  ogDescription:
    "Meet the team building operational infrastructure for Indian education: one governed system of record for admissions, academics, finance, and compliance.",
  twitterDescription:
    "The team behind SquareCampus's Enterprise School OS for Indian schools and trusts. Founder-led and focused on institutional operating command.",
});

type AboutLayoutProps = {
  children: ReactNode;
};

export default function AboutLayout({ children }: AboutLayoutProps) {
  // This segment layout simply passes through the About page content.
  // Global shell (nav, footer, theme) should live in the root layout.
  return <>{children}</>;
}
