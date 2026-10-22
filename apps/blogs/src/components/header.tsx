"use client";

import { PublicationHeader } from "@fairhelm/ui/components/publication-header";

export function Header() {
  return (
    <PublicationHeader
      brand="Fairhelm Journal"
      brandMarkSrc="/brand/fairhelm-logo.svg"
      items={[
        { href: "/", label: "All stories" },
        { href: "/fairhelm/", label: "Fairhelm notes" },
        { href: "/squarecampus/", label: "SquareCampus stories" },
      ]}
    />
  );
}
