"use client";

import { Menu, X } from "lucide-react";
import { type ReactNode, useEffect, useId, useState } from "react";
import { cn } from "@fairhelm/ui/lib/utils";
import { ThemeToggle } from "@fairhelm/ui/components/theme-toggle";
import { DesktopNavigation, MobileNavigation } from "@fairhelm/ui/navigation/marketing-navigation";
import { type NavigationItem, normaliseNavigationPath } from "@fairhelm/ui/navigation/types";

/** Brand, actions and navigation data are supplied by each consuming site. */
export function MarketingHeader({
  brand,
  items,
  pathname: rawPath,
  desktopAction,
  mobileActions,
}: {
  brand: ReactNode;
  items: readonly NavigationItem[];
  pathname: string;
  desktopAction?: ReactNode;
  mobileActions?: ReactNode;
}) {
  const pathname = normaliseNavigationPath(rawPath);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelId = useId();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // biome-ignore lint/correctness/useExhaustiveDependencies: every route change closes mobile navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);
  return (
    <header className="sticky top-0 z-40 px-3 pt-2 sm:px-6 sm:pt-4 lg:px-8">
      <div
        className={cn(
          "mx-auto max-w-6xl rounded-[1.75rem] border px-3 py-2 sm:px-4 sm:py-3 transition-[background-color,border-color] duration-200 sm:px-5",
          scrolled
            ? "border-[color:var(--line-strong)] bg-[color:var(--surface-strong)]"
            : "border-transparent bg-transparent"
        )}
      >
        <div className="flex items-center justify-between gap-2 xl:gap-3">
          {brand}
          <DesktopNavigation items={items} pathname={pathname} />
          {desktopAction ? (
            <div className="hidden items-center gap-2 lg:flex">{desktopAction}</div>
          ) : null}
          <div className="flex items-center gap-2 lg:hidden marketing-navigation">
            <button
              type="button"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              aria-controls={panelId}
              onClick={() => setMobileOpen((open) => !open)}
              className="navigation-material inline-flex size-11 items-center justify-center rounded-full text-[color:var(--foreground)]"
            >
              {mobileOpen ? (
                <X aria-hidden className="size-4.5" />
              ) : (
                <Menu aria-hidden className="size-4.5" />
              )}
            </button>
          </div>
        </div>
        {mobileOpen ? (
          <div
            id={panelId}
            className="navigation-material mt-4 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain rounded-[1.5rem] p-4 lg:hidden"
          >
            <MobileNavigation
              items={items}
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
            />
            {mobileActions ? <div className="mt-4 grid gap-2">{mobileActions}</div> : null}
            <div className="mt-4 flex items-center justify-between border-t border-[color:var(--line)] pt-4">
              <span className="label">Theme</span>
              <ThemeToggle inline />
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
