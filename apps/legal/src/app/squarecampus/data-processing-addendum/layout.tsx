import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Data Processing Addendum (DPA)",
  description:
    "The SquareCampus Data Processing Addendum: the terms on which personal data is processed on behalf of educational institutions, including roles, security measures, sub-processors, data subject requests, and return or deletion of data.",
  path: "/squarecampus/data-processing-addendum",
  ogTitle: "Data Processing Addendum | SquareCampus",
  ogDescription:
    "The terms on which SquareCampus processes personal data on behalf of educational institutions.",
});

export default function TOCLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
