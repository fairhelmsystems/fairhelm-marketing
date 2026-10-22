import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "PGP Public Key",
  description:
    "SquareCampus PGP public key for secure communications, vulnerability reports, and message verification.",
  path: "/pgp",
});

export default function PgpLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
