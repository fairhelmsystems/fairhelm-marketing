import Link from "next/link";
import { cn } from "@fairhelm/ui/lib/utils";

type ButtonLinkProps = {
  href: string;
  label: string;
  /**
   * `cta` is the solid brand action and should appear at most once per
   * section. `link` is a plain text link for tertiary actions.
   */
  variant?: "primary" | "secondary" | "ghost" | "cta" | "link";
  external?: boolean;
  className?: string;
};

// Every variant: a 44px target, a hover that only changes colour, a press
// that settles a pixel, and the site-wide `:focus-visible` ring (styles.css).
const variantClasses: Record<NonNullable<ButtonLinkProps["variant"]>, string> = {
  primary:
    "min-h-11 rounded-full border px-5 border-transparent bg-[color:var(--foreground)] text-[color:var(--background)] hover:opacity-90 active:translate-y-px active:opacity-85",
  secondary:
    "min-h-11 rounded-full border px-5 border-[color:var(--line-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)] hover:bg-[color:var(--surface-muted)] active:translate-y-px",
  ghost:
    "min-h-11 rounded-full border px-5 border-transparent bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--surface-muted)] active:translate-y-px",
  cta: "min-h-11 rounded-full border px-5 cta-button border-transparent",
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
        "inline-flex items-center gap-2 text-balance text-sm font-medium transition-[background-color,opacity,text-decoration-color,transform] duration-150 motion-reduce:transition-none",
        variantClasses[variant],
        className
      )}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      {label}
    </Link>
  );
}
