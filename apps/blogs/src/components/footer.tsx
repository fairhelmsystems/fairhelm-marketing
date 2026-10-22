import { companyFooterGroups } from "@fairhelm/config/footer";
import { fairhelmHref } from "@fairhelm/config/urls";
import { siteConfig } from "@fairhelm/fairhelm-content/company";
import { BrandLockup } from "@fairhelm/ui/components/brand-lockup";
import { CompanyFooter } from "@fairhelm/ui/components/company-footer";
export function Footer() {
  return (
    <CompanyFooter
      brand={
        <BrandLockup
          href={fairhelmHref("/")}
          label="Fairhelm Systems"
          tagline="Software · Data · Governance"
          markSrc="/brand/fairhelm-logo.svg"
        />
      }
      company={siteConfig}
      groups={companyFooterGroups("blogs")}
      location="Bangalore, Karnataka, India"
    />
  );
}
