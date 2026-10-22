import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Acceptable Use Policy",
  description:
    "SquareCampus Acceptable Use Policy: Guidelines for permitted and prohibited behavior on our platform to ensure safe, compliant use by educational institutions.",
  path: "/squarecampus/acceptable-use",
  ogDescription: "Usage guidelines and prohibited activities for the SquareCampus platform.",
});

export default function TOCLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
