import type { ComponentProps } from "react";
import { forwardRef } from "react";
import { MarketingContainer } from "@fairhelm/ui/components/marketing";
export const Container = forwardRef<HTMLDivElement, ComponentProps<"div">>(function Container(
  { className, ...props },
  ref
) {
  return (
    <MarketingContainer
      ref={ref}
      className={`px-4 sm:px-6 lg:px-8 ${className || ""}`}
      {...props}
    />
  );
});
