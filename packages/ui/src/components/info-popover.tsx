import type { CSSProperties, ReactNode } from "react";
import { Info } from "lucide-react";
import { Button } from "@fairhelm/ui/components/button";

/** Native popover keeps explanatory copy in the exported HTML and works before hydration. */
export function InfoPopover({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="info-popover" style={{ "--info-popover-anchor": `--${id}` } as CSSProperties}>
      <Button
        id={`${id}-trigger`}
        type="button"
        variant="link"
        popoverTarget={id}
        aria-controls={id}
        className="info-popover-trigger"
      >
        {label}
        <Info aria-hidden data-icon="inline-end" />
      </Button>
      <div
        id={id}
        popover="auto"
        role="dialog"
        aria-labelledby={`${id}-trigger`}
        className="info-popover-panel"
        data-md-include
      >
        {children}
        <Button type="button" variant="ghost" popoverTarget={id} popoverTargetAction="hide">
          Close
        </Button>
      </div>
    </div>
  );
}
