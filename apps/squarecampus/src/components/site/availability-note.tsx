import { Info } from "lucide-react";
import { availability } from "@/content/commercial";
import { cn } from "@fairhelm/ui/lib/utils";

/**
 * The availability qualifier (content/commercial.ts › availability).
 *
 * Placed beside capability lists so a description of the design is never
 * read as a promise that every module is switched on for every institution.
 */
export function AvailabilityNote({
  className,
  text = availability.note,
}: {
  className?: string;
  text?: string;
}) {
  return (
    <p
      data-availability-note
      className={cn(
        "flex items-start gap-2.5 rounded-[1.2rem] border border-dashed border-(--line-strong) bg-(--surface) px-4 py-3 text-sm leading-6 text-muted-foreground sm:px-5",
        className
      )}
    >
      <Info aria-hidden className="mt-1 size-3.5 shrink-0 text-(--brand)" />
      <span>{text}</span>
    </p>
  );
}
