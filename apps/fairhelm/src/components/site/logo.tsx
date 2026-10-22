import { BrandLockup } from "@fairhelm/ui/components/brand-lockup";
export function Logo({ className }: { className?: string }) {
  return (
    <BrandLockup
      href="/"
      label="Fairhelm Systems"
      tagline="Software · Data · Governance"
      markSrc="/brand/fairhelm-logo.svg"
      className={className}
      priority
    />
  );
}
