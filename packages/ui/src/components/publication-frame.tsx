import type { ReactNode } from "react";
import { PublicationHeader } from "./publication-header";
import { SkipLink } from "./skip-link";
import { ThemeScript } from "./theme-script";
import { ThemeToggle } from "./theme-toggle";
export function PublicationFrame({
  brand,
  items,
  children,
  footer,
  brandMarkSrc,
}: {
  brand: string;
  items: readonly { label: string; href: string }[];
  children: ReactNode;
  footer: ReactNode;
  brandMarkSrc?: string;
}) {
  return (
    <>
      <ThemeScript />
      <noscript>
        <style>
          {
            ".reveal-root,.reveal-stagger [data-reveal-item]{opacity:1!important;transform:none!important}"
          }
        </style>
      </noscript>
      <SkipLink />
      <div className="page-shell">
        <PublicationHeader brand={brand} items={items} brandMarkSrc={brandMarkSrc} />
        {children}
        {footer}
      </div>
      <ThemeToggle />
    </>
  );
}
