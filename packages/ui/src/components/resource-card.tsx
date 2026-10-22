import type { ReactNode } from "react";
import { cn } from "../lib/utils";

export function IconBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border border-(--line) bg-(--brand-tint) text-(--brand)",
        className
      )}
    >
      {children}
    </span>
  );
}

export function ResourceCard({
  icon,
  eyebrow,
  title,
  children,
  className,
}: {
  icon: ReactNode;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("surface-panel min-w-0 rounded-[var(--radius-panel)] p-6 sm:p-8", className)}
    >
      <div className="flex items-center gap-4">
        <IconBadge>{icon}</IconBadge>
        <div className="min-w-0">
          {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
          <h2 className="type-card-title">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}
