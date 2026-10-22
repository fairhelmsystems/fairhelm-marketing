"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@fairhelm/ui/hooks/useReducedMotion";
import { cn } from "@fairhelm/ui/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  once?: boolean;
  staggerChildren?: boolean;
  /**
   * Above-the-fold content (e.g. the hero) must paint on first frame, not wait
   * for JS to hydrate and the IntersectionObserver to fire — otherwise the LCP
   * element is stuck at `opacity: 0` until hydration, which wrecks mobile LCP.
   * `immediate` renders visible from SSR and plays a transform-only load
   * animation (opacity stays 1, so LCP registers at first paint) with no JS.
   */
  immediate?: boolean;
}

/**
 * Scroll-triggered entrance. All motion is CSS transitions (see the
 * `.reveal-*` utilities in globals.css); this component only toggles a
 * class when the node scrolls into view.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 20,
  once = true,
  staggerChildren = false,
  immediate = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (immediate) {
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    if (prefersReducedMotion) {
      node.classList.add("is-revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            if (!once) {
              node.classList.remove("is-revealed");
            }
            continue;
          }

          node.classList.add("is-revealed");

          if (once) {
            observer.disconnect();
          }
        }
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.05,
      }
    );

    observer.observe(node);

    // Never leave content hidden if the observer misfires.
    const timeout = setTimeout(() => node.classList.add("is-revealed"), 4000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [once, prefersReducedMotion, immediate]);

  return (
    <div
      ref={ref}
      className={cn(
        immediate ? "reveal-immediate" : "reveal-root",
        staggerChildren && "reveal-stagger",
        className
      )}
      style={
        {
          "--reveal-delay": `${delay}ms`,
          "--reveal-distance": `${distance}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
