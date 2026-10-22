import type { ReactNode } from "react";
import { cn } from "@fairhelm/ui/lib/utils";

/**
 * CSS-drawn device frames. No raster bezel, no request at any breakpoint,
 * and the aluminium follows the theme. The geometry lives in globals.css
 * ("Device frames"); these components only lay out the parts.
 *
 * Children are the screen. They are positioned `absolute; inset: 0` by the
 * stylesheet, so pass anything that fills its box: a MotionFigure, an inline
 * SVG wrapper, an <Image fill>, or a div with a CSS background.
 */

export function LaptopDevice({
  children,
  className,
  collapsible = false,
  shine = false,
}: {
  children: ReactNode;
  className?: string;
  /**
   * Below `lg` the bezel is dropped and the screen alone is shown in a plain
   * rounded box. Use for above-the-fold product shots, where a quarter of a
   * phone's width spent on aluminium makes the screen illegible.
   */
  collapsible?: boolean;
  /** Play the glass sweep on load (for frames that are not inside a scene). */
  shine?: boolean;
}) {
  return (
    <div
      className={cn(
        "device-laptop",
        collapsible && "device-laptop--collapsible",
        shine && "device-shine",
        className
      )}
    >
      <div className="device-laptop__lid">
        <div className="device-laptop__screen">
          {children}
          <div aria-hidden className="device-glare" />
        </div>
      </div>
      <div aria-hidden className="device-laptop__base" />
      <div aria-hidden className="device-laptop__shadow" />
    </div>
  );
}

export function PhoneDevice({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("device-phone", className)}>
      <div className="device-phone__body">
        <span aria-hidden className="device-phone__btn device-phone__btn--mute" />
        <span aria-hidden className="device-phone__btn device-phone__btn--up" />
        <span aria-hidden className="device-phone__btn device-phone__btn--down" />
        <span aria-hidden className="device-phone__btn device-phone__btn--power" />
        <div className="device-phone__screen">
          {children}
          <div aria-hidden className="device-glare" />
        </div>
        <span aria-hidden className="device-phone__island" />
      </div>
    </div>
  );
}
