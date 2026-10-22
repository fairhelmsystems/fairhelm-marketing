"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@fairhelm/ui/lib/utils";
import {
  isNavigationGroup,
  normaliseNavigationPath,
  type NavigationGroup,
  type NavigationItem,
  type NavigationLink,
} from "@fairhelm/ui/navigation/types";

function NavigationIcon({ link }: { link: NavigationLink }) {
  const Icon = link.icon;
  return Icon ? (
    <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-[color:var(--brand)]" />
  ) : null;
}

function linkIsCurrent(href: string, pathname: string) {
  return normaliseNavigationPath(href) === normaliseNavigationPath(pathname);
}

function groupIsActive(group: NavigationGroup, pathname: string) {
  return (
    group.links.some((link) => linkIsCurrent(link.href, pathname)) ||
    (group.footer ? linkIsCurrent(group.footer.href, pathname) : false)
  );
}

/**
 * One desktop disclosure menu (the WAI "disclosure navigation" pattern): a
 * real <button> with aria-expanded that shows a plain list of links. No
 * floating-UI engine and no ARIA menu roles — these are navigation links, and
 * Tab, Enter and Escape behave exactly as they do everywhere else on the page.
 */
function NavDisclosure({
  group,
  pathname,
  open,
  onOpenChange,
  onHover,
}: {
  group: NavigationGroup;
  pathname: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHover: () => void;
}) {
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const active = groupIsActive(group, pathname);
  const wide = group.links.length > 5;

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          onOpenChange(false);
          buttonRef.current?.focus();
        }
      }}
      onBlur={(event) => {
        // Close when focus leaves the button and its panel entirely.
        if (open && !wrapperRef.current?.contains(event.relatedTarget as Node | null)) {
          onOpenChange(false);
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        data-current={active || open || undefined}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") onHover();
        }}
        className="navigation-material-item inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-sm outline-none xl:px-4"
      >
        {group.label}
        <ChevronDown
          aria-hidden
          className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className={cn(
          "navigation-material absolute left-1/2 top-[calc(100%+0.75rem)] z-50 -translate-x-1/2 rounded-[1.4rem] p-2",
          wide ? "w-[34rem]" : "w-[20rem]"
        )}
      >
        <ul className={cn("grid gap-0.5", wide && "grid-cols-2")}>
          {group.links.map((link) => {
            const current = linkIsCurrent(link.href, pathname);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  onClick={() => onOpenChange(false)}
                  className="navigation-material-item flex items-start gap-3 rounded-xl px-3.5 py-2.5 outline-none"
                >
                  <NavigationIcon link={link} />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-[color:var(--foreground)]">
                      {link.label}
                    </span>
                    {link.description ? (
                      <span className="mt-0.5 block text-[0.8125rem] leading-5 text-[color:var(--muted-foreground)]">
                        {link.description}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        {group.footer ? (
          <div className="mt-2 flex justify-end border-t border-[color:var(--line)] px-3.5 pt-3 pb-2">
            <Link
              href={group.footer.href}
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-[color:var(--brand)] outline-none hover:bg-[color:var(--surface-muted)]"
            >
              {group.footer.label}
              <ArrowUpRight aria-hidden className="size-4" />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function DesktopNavigation({
  items,
  pathname,
  label = "Primary",
  className,
}: {
  items: readonly NavigationItem[];
  pathname: string;
  label?: string;
  className?: string;
}) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: route changes close disclosures
  useEffect(() => {
    setOpenGroup(null);
  }, [pathname]);
  useEffect(() => {
    if (!openGroup) return;
    const closeOutside = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenGroup(null);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [openGroup]);
  return (
    <nav
      ref={navRef}
      aria-label={label}
      onKeyDown={(event) => {
        if (event.key === "Escape" && openGroup) {
          event.preventDefault();
          const trigger = navRef.current?.querySelector<HTMLButtonElement>(
            'button[aria-expanded="true"]'
          );
          setOpenGroup(null);
          trigger?.focus();
        }
      }}
      className={cn(
        "marketing-navigation navigation-material hidden items-center gap-0.5 rounded-full p-1 lg:flex",
        className
      )}
    >
      {items.map((item) =>
        isNavigationGroup(item) ? (
          <NavDisclosure
            key={item.label}
            group={item}
            pathname={pathname}
            open={openGroup === item.label}
            onOpenChange={(next) => setOpenGroup(next ? item.label : null)}
            onHover={() => {
              if (openGroup !== null) setOpenGroup(item.label);
            }}
          />
        ) : (
          <Link
            key={item.href}
            href={item.href}
            aria-current={linkIsCurrent(item.href, pathname) ? "page" : undefined}
            className="navigation-material-item whitespace-nowrap rounded-full px-3 py-2 text-sm outline-none xl:px-4"
          >
            {item.label}
          </Link>
        )
      )}
    </nav>
  );
}

export function MobileNavigation({
  items,
  pathname,
  onNavigate,
  label = "Primary (mobile)",
}: {
  items: readonly NavigationItem[];
  pathname: string;
  onNavigate: () => void;
  label?: string;
}) {
  const renderLink = (link: NavigationLink) => (
    <Link
      href={link.href}
      aria-current={linkIsCurrent(link.href, pathname) ? "page" : undefined}
      onClick={onNavigate}
      className="navigation-material-item flex items-center gap-3 rounded-2xl px-4 py-2.5 text-[0.95rem] outline-none"
    >
      <NavigationIcon link={link} />
      {link.label}
    </Link>
  );
  return (
    <nav aria-label={label} className="marketing-navigation grid gap-4">
      {items.map((item) =>
        isNavigationGroup(item) ? (
          <div key={item.label}>
            <p className="px-4 pb-1 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
              {item.label}
            </p>
            <ul className="grid">
              {item.links.map((link) => (
                <li key={link.href}>{renderLink(link)}</li>
              ))}
            </ul>
            {item.footer ? (
              <div className="mt-2 flex justify-end border-t border-[color:var(--line)] pt-2">
                {renderLink(item.footer)}
              </div>
            ) : null}
          </div>
        ) : (
          <div key={item.href}>{renderLink(item)}</div>
        )
      )}
    </nav>
  );
}
