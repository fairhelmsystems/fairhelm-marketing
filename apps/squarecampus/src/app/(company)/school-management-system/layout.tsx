import type { Metadata } from "next";
import { product } from "@/content/commercial";
import { createPageMetadata } from "@/lib/seo";

// High-intent search page for "school management system India".
// Rank on substance and honest specifics — never on invented rank or scale.

const description = `School management system for Indian schools and trusts. SquareCampus is an ${product.category} with guided rollout and support.`;

export const metadata: Metadata = createPageMetadata({
  title: "School Management System in India | SquareCampus",
  description,
  path: "/school-management-system",
  ogImage: "https://squarecampus.com/og/school-management-system.png",
  ogTitle: "School Management System in India | SquareCampus",
  ogDescription: description,
  twitterTitle: "School Management System India | SquareCampus",
  twitterDescription: description,
});

export default function SchoolManagementSystemLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
