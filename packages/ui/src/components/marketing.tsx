import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import { cn } from "@fairhelm/ui/lib/utils";

/**
 * Shared marketing composition primitives.
 *
 * These exist so spacing, heading hierarchy and panel treatment are declared
 * once instead of being re-typed (and drifting) on every page. `SectionShell`
 * builds on `SectionHeader`, so pages that already use it inherit the type
 * scale automatically.
 */

export function MarketingContainer({
  children,
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  return (
    <div {...props} className={cn("mx-auto w-full max-w-6xl", className)}>
      {children}
    </div>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("eyebrow", className)}>{children}</p>;
}

type SectionHeaderProps = {
  eyebrow?: string;
  title?: ReactNode;
  body?: ReactNode;
  /** Heading level. Defaults to h2 — pages set `as="h1"` for the page title. */
  as?: ElementType;
  align?: "left" | "center";
  /** Page titles use the larger display step; section titles use the section step. */
  size?: "page" | "section";
  className?: string;
  bodyClassName?: string;
  children?: ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  body,
  as: Heading = "h2",
  align = "left",
  size = "section",
  className,
  bodyClassName,
  children,
}: SectionHeaderProps) {
  if (!eyebrow && !title && !body && !children) {
    return null;
  }

  return (
    <div
      className={cn(
        "max-w-3xl space-y-3 sm:space-y-4",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {title ? (
        <Heading className={size === "page" ? "type-page-title" : "type-section-title"}>
          {title}
        </Heading>
      ) : null}
      {body ? (
        <p
          className={cn(
            "type-body measure text-[color:var(--muted-foreground)]",
            align === "center" && "mx-auto",
            bodyClassName
          )}
        >
          {body}
        </p>
      ) : null}
      {children}
    </div>
  );
}

/**
 * A group of calls to action. Only the first action should be `cta`/`primary`;
 * the rest are secondary so a section never has competing primary buttons.
 */
export function CTAGroup({
  children,
  className,
  align = "left",
}: {
  children: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3",
        align === "center" && "justify-center",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Primary narrative panel — the load-bearing block in a section.
 * `tone="quiet"` steps it down to a supporting capability card so a grid does
 * not read as an undifferentiated wall of identical cards.
 */
export function FeaturePanel({
  children,
  className,
  tone = "default",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "strong" | "quiet";
  as?: ElementType;
}) {
  return (
    <Tag
      className={cn(
        "rounded-[var(--radius-panel)] p-6 sm:p-7",
        tone === "strong" && "surface-panel-strong rounded-[var(--radius-panel-lg)]",
        tone === "default" && "surface-panel",
        tone === "quiet" && "surface-quiet",
        className
      )}
    >
      {children}
    </Tag>
  );
}

/** A labelled figure. The label is real text, never colour-only meaning. */
export function MetricPanel({
  label,
  value,
  caption,
  className,
}: {
  label: string;
  value: ReactNode;
  caption?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "surface-quiet rounded-[var(--radius-chip)] px-4 py-4 sm:px-5 sm:py-5",
        className
      )}
    >
      <p className="eyebrow">{label}</p>
      <p className="type-metric mt-3 text-[color:var(--foreground)]">{value}</p>
      {caption ? <p className="type-support mt-2">{caption}</p> : null}
    </div>
  );
}

/** Small reassurance line under a CTA cluster. */
export function TrustNote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "type-support max-w-xl border-l-2 border-[color:var(--line-strong)] pl-4",
        className
      )}
    >
      {children}
    </p>
  );
}

type BadgeTone = "neutral" | "brand" | "ok" | "attention";

const badgeTones: Record<BadgeTone, string> = {
  neutral:
    "border-[color:var(--line-strong)] bg-[color:var(--surface-muted)] text-[color:var(--muted-foreground)]",
  brand:
    "border-[color:var(--line-strong)] bg-[color:var(--brand-tint)] text-[color:var(--brand-ink)]",
  ok: "border-[color:var(--line-strong)] bg-[color:var(--state-ok-soft)] text-[color:var(--state-ok)]",
  attention:
    "border-[color:var(--line-strong)] bg-[color:var(--state-attention-soft)] text-[color:var(--state-attention)]",
};

/**
 * Status chip. Tone is decorative reinforcement only — the label always
 * carries the meaning, so nothing is encoded in colour alone.
 */
export function OperationalBadge({
  children,
  tone = "neutral",
  icon: Icon,
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  icon?: ElementType;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.16em]",
        badgeTones[tone],
        className
      )}
    >
      {Icon ? <Icon aria-hidden className="size-3" /> : null}
      {children}
    </span>
  );
}

/**
 * One row of a plan comparison. Rendered as a real table row on desktop and
 * a real `<tr>` with a row header, so the comparison keeps its semantics for
 * screen readers instead of becoming a grid of unlabelled cells.
 */
export function ComparisonRow({
  label,
  values,
  className,
}: {
  label: string;
  /** One entry per column, keyed by the column id it belongs to. */
  values: ReadonlyArray<{ key: string; content: ReactNode }>;
  className?: string;
}) {
  return (
    <tr className={cn("border-t border-[color:var(--line)]", className)}>
      <th
        scope="row"
        className="py-4 pr-6 text-left align-top text-sm font-medium text-[color:var(--foreground)]"
      >
        {label}
      </th>
      {values.map((value) => (
        <td
          key={value.key}
          className="py-4 pr-6 align-top text-sm leading-6 text-[color:var(--muted-foreground)] last:pr-0"
        >
          {value.content}
        </td>
      ))}
    </tr>
  );
}
