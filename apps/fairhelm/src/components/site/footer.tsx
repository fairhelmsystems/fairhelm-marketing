import { companyFooterGroups } from "@fairhelm/config/footer";
import { CompanyFooter } from "@fairhelm/ui/components/company-footer";
import { Logo } from "@/components/site/logo";
import { siteConfig } from "@/lib/site-config";
export function Footer() {
  return (
    <CompanyFooter
      brand={<Logo />}
      company={siteConfig}
      groups={companyFooterGroups("fairhelm")}
      location="Bangalore, Karnataka, India"
    />
  );
}
