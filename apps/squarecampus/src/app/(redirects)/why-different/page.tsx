import type { Metadata } from "next";
import { RedirectStub } from "@/components/site/redirect-stub";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: "https://squarecampus.com/why-squarecampus/" },
};

export default function Page() {
  return <RedirectStub to="/why-squarecampus/" label="Why SquareCampus" />;
}
