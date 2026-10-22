import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

// High-intent search page for "school management system India".
// Rank on substance and honest specifics — never on invented rank or scale.

export const metadata: Metadata = createPageMetadata({
  title: "School Management System in India | SquareCampus School OS",
  description:
    "SquareCampus is a school management system built for Indian schools and school groups: admissions, fees, academics, attendance, transport, exams, and parent communication in one governed system of record. Book a demo.",
  path: "/school-management-system",
  ogImage: "https://squarecampus.com/og/school-management-system.png",
  ogTitle: "School Management System in India | SquareCampus",
  ogDescription:
    "One governed system of record for admissions, fees, academics, attendance, transport, and parent communication. Built for Indian schools and school groups.",
  twitterTitle: "School Management System India | SquareCampus",
  twitterDescription:
    "One governed system of record for admissions, fees, academics, attendance, and communication — built for Indian schools and school groups.",
});

export default function SchoolManagementSystemLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
