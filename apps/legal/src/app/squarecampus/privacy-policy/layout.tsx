import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "SquareCampus Privacy Policy: How we collect, use, protect, and manage personal data for educational institutions in compliance with Indian data protection laws.",
  path: "/squarecampus/privacy-policy",
  ogDescription:
    "Understand how SquareCampus handles and protects your institution's data in compliance with Indian privacy regulations.",
});

export default function TOCLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
