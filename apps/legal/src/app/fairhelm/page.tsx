import { legalUrl } from "@fairhelm/config/urls";
import type { Metadata } from "next";
import { DocumentDirectory } from "../page";
export const metadata: Metadata = {
  title: "Fairhelm Systems legal documents",
  alternates: { canonical: legalUrl("fairhelm") },
};
export default function Page() {
  return <DocumentDirectory scope="fairhelm" />;
}
