"use client";

import { useEffect, useRef } from "react";

/**
 * Adds `.is-live` to an element the first time it scrolls into view, which the
 * `.viz-reveal` rules in globals.css use to stage a composite visual's entrance.
 * A timeout backstop flips it on regardless, so anything that never intersects
 * (short viewports, no IntersectionObserver) still reaches its final state.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add("is-live");
            observer.disconnect();
          }
        }
      },
      { threshold }
    );

    observer.observe(node);
    const timeout = window.setTimeout(() => node.classList.add("is-live"), 3500);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [threshold]);

  return ref;
}
