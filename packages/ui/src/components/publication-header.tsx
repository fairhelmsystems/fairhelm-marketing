"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MarketingHeader } from "../navigation/marketing-header";
import { BrandLockup } from "./brand-lockup";
export function PublicationHeader({
  brand,
  items,
  brandMarkSrc,
}: {
  brand: string;
  items: readonly { label: string; href: string }[];
  brandMarkSrc?: string;
}) {
  return (
    <MarketingHeader
      pathname={usePathname()}
      brand={
        brandMarkSrc ? (
          <BrandLockup href="/" label={brand} markSrc={brandMarkSrc} />
        ) : (
          <Link href="/" className="font-display text-lg tracking-tight">
            {brand}
          </Link>
        )
      }
      items={items}
    />
  );
}
