"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { cn } from "@fairhelm/ui/lib/utils";

/**
 * Pointer-driven parallax for device scenes.
 *
 * Sets `--tilt-x` / `--tilt-y` on the wrapper; the transform itself is CSS
 * (`.tilt-stage > *` in globals.css) so the effect composes with the scene's
 * float animation and costs nothing when the pointer is elsewhere.
 *
 * Only active on hover-capable, fine-pointer devices without a reduced-motion
 * preference. Everywhere else it renders a plain wrapper.
 */
export function TiltStage({
  children,
  className,
  /** Maximum rotation on either axis, in degrees. */
  max = 4.5,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    const capable = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );
    if (!capable.matches) {
      return;
    }

    let frame = 0;
    const set = (x: number, y: number) => {
      node.style.setProperty("--tilt-x", `${x.toFixed(2)}deg`);
      node.style.setProperty("--tilt-y", `${y.toFixed(2)}deg`);
    };

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => set(-py * max * 2, px * max * 2));
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      set(0, 0);
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);

  return (
    <div ref={ref} className={cn("tilt-stage", className)}>
      <div className="relative">{children}</div>
    </div>
  );
}
