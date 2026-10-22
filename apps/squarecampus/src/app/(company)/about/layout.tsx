import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About SquareCampus | Building the Operating System for Indian Education",
  description:
    "SquareCampus is a School Operating System for schools, educational trusts and multi-campus groups in India, built by Fairhelm Systems (OPC) Private Limited. Founder-led, focused on connected operations, governance and accountability.",
  path: "/about",
  ogImage: "https://squarecampus.com/og/about.png",
  ogTitle: "About SquareCampus | The Team Behind the School OS",
  ogDescription:
    "Meet the team building operational infrastructure for Indian education: one governed system of record for admissions, academics, finance, and compliance.",
  twitterDescription:
    "Building operational infrastructure for Indian schools and colleges. Founder-led, product-first, and focused on institutional operating command.",
});

type AboutLayoutProps = {
  children: ReactNode;
};

export default function AboutLayout({ children }: AboutLayoutProps) {
  // This segment layout simply passes through the About page content.
  // Global shell (nav, footer, theme) should live in the root layout.
  return <>{children}</>;
}
