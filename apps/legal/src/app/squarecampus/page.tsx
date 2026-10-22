import { legalUrl } from "@fairhelm/config/urls";
import type { Metadata } from "next";
import { DocumentDirectory } from "../page";
export const metadata: Metadata = {
  title: "SquareCampus legal documents",
  alternates: { canonical: legalUrl("squarecampus") },
};
export default function Page() {
  return <DocumentDirectory scope="squarecampus" />;
}
