import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

// Comparison/decision page - captures comparison searches and switching intent.
// No invented rank, counts, or testimonials — the argument is structural.

export const metadata: Metadata = createPageMetadata({
  title: "Why SquareCampus | School OS vs Traditional School ERPs",
  description:
    "Why school groups choose a School OS over stitched ERP modules and point tools: one governed system of record, connected workflows, live visibility, and clear accountability.",
  path: "/why-squarecampus",
  ogImage: "https://squarecampus.com/og/why-squarecampus.png",
  ogTitle: "Why SquareCampus | School OS vs Traditional ERPs",
  ogDescription:
    "One governed system of record instead of stitched modules and point tools. See the structural difference and decide for your institution.",
  twitterTitle: "Why SquareCampus | School ERP Comparison",
  twitterDescription:
    "Compare the School OS model against traditional school ERPs and point tools — architecture, daily work, reporting, and accountability.",
});

export default function WhyDifferentLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
