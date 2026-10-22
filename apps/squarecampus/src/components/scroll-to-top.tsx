"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

export function ScrollToTop() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // Disable browser's automatic scroll restoration
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Scroll to top on route changes
  useLayoutEffect(() => {
    if (!pathname) return;
    // Skip on first render (initial page load handles its own scroll)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Skip if there's a hash in the URL (anchor links)
    if (window.location.hash) return;

    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      root.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToTop();
    const rafId = window.requestAnimationFrame(() => {
      scrollToTop();
      root.style.scrollBehavior = previousBehavior;
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      root.style.scrollBehavior = previousBehavior;
    };
  }, [pathname]);

  return null;
}
