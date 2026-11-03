"use client";

import type { ReactNode } from "react";
import { cn } from "@fairhelm/ui/lib/utils";

/**
 * Wrapper for device scenes.
 *
 * This used to be a pointer-driven parallax: a `pointermove` listener on the
 * hero rewrote two custom properties every frame and the device rotated in
 * 3D under the cursor. It was removed in the design-system pass because it
 * kept the main thread and compositor busy on the most-viewed screen, pulled
 * the eye away from the headline and the action, and did nothing on touch.
 * The scene now sits still; hover feedback belongs to the controls.
 *
 * The component and its props are kept so callers do not change.
 */
export function TiltStage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  /** Accepted for compatibility; no longer used. */
  max?: number;
}) {
  return (
    <div className={cn("tilt-stage", className)}>
      <div className="relative">{children}</div>
    </div>
  );
}
