import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@fairhelm/ui/lib/utils";

type ButtonLinkProps = {
  href: string;
  label: string;
  /**
   * `cta` is the brand gradient and should appear at most once per section.
   * `link` is a plain text link for tertiary actions.
   */
  variant?: "primary" | "secondary" | "ghost" | "cta" | "link";
  external?: boolean;
  className?: string;
};

const variantClasses: Record<NonNullable<ButtonLinkProps["variant"]>, string> = {
  primary:
    "min-h-11 rounded-full border px-5 border-transparent bg-[color:var(--foreground)] text-[color:var(--background)] hover:opacity-92 active:opacity-85",
  secondary:
    "min-h-11 rounded-full border px-5 border-[color:var(--line-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)] hover:bg-[color:var(--surface)] active:bg-[color:var(--surface-muted)]",
  ghost:
    "min-h-11 rounded-full border px-5 border-transparent bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--surface-muted)] active:bg-[color:var(--surface)]",
  cta: "min-h-11 rounded-full border px-5 cta-button border-transparent text-white",
  link: "min-h-11 rounded-md text-[color:var(--brand-ink)] underline decoration-[color:var(--line-strong)] underline-offset-4 hover:decoration-current",
};

export function ButtonLink({
  href,
  label,
  variant = "primary",
  external = false,
  className,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        // `text-balance` keeps a long label that does wrap (full-width mobile
        // CTAs) from leaving a one-word orphan line.
        "group/button inline-flex items-center gap-2 text-balance text-sm font-medium transition-all",
        variantClasses[variant],
        className
      )}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      <span>{label}</span>
      <ArrowRight
        aria-hidden
        className="size-4 transition-transform duration-300 group-hover/button:translate-x-0.5"
      />
    </Link>
  );
}
