import type { Metadata } from "next";
import { RedirectStub } from "@/components/site/redirect-stub";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: "https://squarecampus.com/platform/" },
};

export default function Page() {
  return <RedirectStub to="/platform/" label="the platform overview" />;
}
