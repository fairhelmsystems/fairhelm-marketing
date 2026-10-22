import { Archive, ArrowRight } from "lucide-react";
import Link from "next/link";
import { retentionPointer } from "@/content/retention";
import { cn } from "@fairhelm/ui/lib/utils";

/**
 * The shared retention pointer. Every plan presentation renders this one
 * component, so the statement cannot differ between Starter, Pro and
 * Enterprise — the point is that it does not depend on the plan at all.
 */
export function RetentionPointer({ className }: { className?: string }) {
  return (
    <p data-retention-pointer className={cn("type-support flex items-start gap-2.5", className)}>
      <Archive aria-hidden className="mt-1 size-3.5 shrink-0 text-[color:var(--brand)]" />
      <span>
        {retentionPointer.text}{" "}
        <Link
          href={retentionPointer.href}
          className="inline-flex items-center gap-1 whitespace-nowrap text-[color:var(--foreground)] underline decoration-[color:var(--brand)]/50 underline-offset-[3px] hover:decoration-[color:var(--brand)]"
        >
          {retentionPointer.linkLabel}
          <ArrowRight aria-hidden className="size-3" />
        </Link>
      </span>
    </p>
  );
}
