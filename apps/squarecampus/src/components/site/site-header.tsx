"use client";

import { usePathname } from "next/navigation";
import { MarketingHeader } from "@fairhelm/ui/navigation/marketing-header";
import { ctaLabels, siteCtas } from "@/content/site-content";
import { BrandLogo } from "./brand-logo";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { navigationItems } from "./navigation";

/** SquareCampus-specific composition; reusable behaviour lives in navigation/. */
export function SiteHeader() {
  return (
    <MarketingHeader
      pathname={usePathname()}
      items={navigationItems}
      brand={<BrandLogo subtitleClassName="hidden xl:block" />}
      desktopAction={
        <ButtonLink
          href={siteCtas.demoHref}
          label={ctaLabels.demo}
          variant="cta"
          className="whitespace-nowrap"
        />
      }
      mobileActions={
        <>
          <ButtonLink
            href={siteCtas.demoHref}
            label={ctaLabels.demo}
            variant="cta"
            className="justify-center"
          />
          <ButtonLink
            href={siteCtas.loginHref}
            label="Sign in"
            external
            variant="secondary"
            className="justify-center"
          />
        </>
      }
    />
  );
}
