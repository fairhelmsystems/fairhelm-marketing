"use client";

import { usePathname } from "next/navigation";
import { MarketingHeader } from "@fairhelm/ui/navigation/marketing-header";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { Logo } from "@/components/site/logo";
import { siteConfig } from "@/lib/site-config";
export function Header() {
  return (
    <MarketingHeader
      pathname={usePathname()}
      brand={<Logo />}
      items={siteConfig.navigation}
      desktopAction={<ButtonLink href="/contact/" label="Start a conversation" variant="cta" />}
      mobileActions={<ButtonLink href="/contact/" label="Start a conversation" variant="cta" />}
    />
  );
}
