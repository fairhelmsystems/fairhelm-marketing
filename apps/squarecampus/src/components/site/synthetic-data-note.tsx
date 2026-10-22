import { Info } from "lucide-react";
import { cn } from "@fairhelm/ui/lib/utils";

export const SYNTHETIC_DATA_LABEL = "Illustrative product preview using synthetic data.";

/**
 * Synthetic-data disclosure.
 *
 * Every fictional institution, campus figure, student count, fee amount or
 * attendance percentage on the site must carry this, and it must be visible in
 * the same component as the numbers it qualifies — not buried in a footer.
 */
export function SyntheticDataNote({
  className,
  variant = "inline",
  label,
}: {
  className?: string;
  /** `chip` for a compact corner label, `inline` for a full sentence. */
  variant?: "inline" | "chip";
  /** Overrides the default wording; it must still say the data is synthetic. */
  label?: string;
}) {
  if (variant === "chip") {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface-strong)] px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[color:var(--muted-foreground)]",
          className
        )}
      >
        <Info aria-hidden className="size-2.5" />
        {label ?? "Synthetic data"}
      </span>
    );
  }

  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface-strong)] px-3.5 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[color:var(--muted-foreground)]",
        className
      )}
    >
      <Info aria-hidden className="size-3 shrink-0" />
      {label ?? SYNTHETIC_DATA_LABEL}
    </p>
  );
}
