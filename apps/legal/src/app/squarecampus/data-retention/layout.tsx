import { RETENTION_PATH, retentionPage } from "@fairhelm/squarecampus-content/retention";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: retentionPage.metaTitle,
  description: retentionPage.description,
  path: RETENTION_PATH,
});

export default function DataRetentionLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
