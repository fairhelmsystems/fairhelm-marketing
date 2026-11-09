import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

// Comparison/decision page - captures comparison searches and switching intent.
// No invented rank, counts, or testimonials — the argument is structural.

export const metadata: Metadata = createPageMetadata({
  title: "Why SquareCampus | Enterprise School OS vs School ERP",
  description:
    "Compare SquareCampus's Enterprise School OS with school ERP software. Evaluate workflow ownership, campus oversight, approvals, audit history and guided rollout.",
  path: "/why-squarecampus",
  ogImage: "https://squarecampus.com/og/why-squarecampus.png",
  ogTitle: "Why SquareCampus | Enterprise School OS vs School ERP",
  ogDescription:
    "One governed system of record instead of stitched modules and point tools. See the structural difference and decide for your institution.",
  twitterTitle: "SquareCampus Enterprise School OS vs School ERP",
  twitterDescription:
    "Evaluate SquareCampus's Enterprise School OS against school ERP software, from connected records and accountable workflows to governance and guided rollout.",
});

export default function WhyDifferentLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
