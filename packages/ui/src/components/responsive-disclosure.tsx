"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { revealAnchor } from "@fairhelm/ui/lib/reveal-anchor";
import { cn } from "@fairhelm/ui/lib/utils";

/** A single DOM tree for interactive content. Phones use native disclosure;
 * wider screens show it inline. Native controls also work without JavaScript.
 */
export function ResponsiveDisclosure({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const details = useRef<HTMLDetailsElement>(null);
  const [inline, setInline] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 40rem)");
    const update = () => {
      const node = details.current;
      if (node) node.open = media.matches || node.contains(document.activeElement);
      setInline(media.matches);
    };
    const openAnchor = () => revealAnchor(window.location.href);
    update();
    openAnchor();
    media.addEventListener("change", update);
    window.addEventListener("hashchange", openAnchor);
    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("hashchange", openAnchor);
    };
  }, []);

  return (
    <details
      ref={details}
      className={cn("responsive-disclosure", className)}
      data-inline={inline}
      // Native fragment navigation can open this disclosure before React hydrates it.
      suppressHydrationWarning
    >
      <summary>{label}</summary>
      <div data-md-include>{children}</div>
    </details>
  );
}
