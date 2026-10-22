// app/careers/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

// No open roles are published yet, so this page stays noindex until it has
// real content. Reachable directly, but kept out of primary crawl paths.
export const metadata: Metadata = createPageMetadata({
  title: "Careers",
  description:
    "SquareCampus builds operational infrastructure for schools and colleges in India. Roles are published here as the team expands.",
  path: "/careers",
  noIndex: true,
});

type CareersLayoutProps = {
  children: ReactNode;
};

export default function CareersLayout({ children }: CareersLayoutProps) {
  return <>{children}</>;
}
