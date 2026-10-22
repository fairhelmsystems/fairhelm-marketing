import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description:
    "SquareCampus Terms of Service: Legal agreement governing the use of our school and college management platform for educational institutions.",
  path: "/squarecampus/terms-of-service",
  ogDescription:
    "Legal terms and conditions for using the SquareCampus platform for your educational institution.",
});

export default function TOCLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
