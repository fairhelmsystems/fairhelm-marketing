"use client";

import { Menu, X } from "lucide-react";
import { type ReactNode, useEffect, useId, useState } from "react";
import { cn } from "@fairhelm/ui/lib/utils";
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
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <div
        className={cn(
          "mx-auto max-w-6xl rounded-[1.75rem] px-4 py-3 transition-all duration-300 sm:px-5",
          scrolled
            ? "bg-[color:var(--surface-strong)]/90 shadow-[0_24px_60px_rgba(8,15,30,0.08)] backdrop-blur-xl dark:shadow-[0_28px_72px_rgba(0,0,0,0.38)]"
            : "bg-transparent"
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
          </div>
        ) : null}
      </div>
    </header>
  );
}
