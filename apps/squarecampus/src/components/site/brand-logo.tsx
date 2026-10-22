import Image from "next/image";
import Link from "next/link";
import { cn } from "@fairhelm/ui/lib/utils";

interface BrandLogoProps {
  className?: string;
  subtitle?: string;
  /** Lets the header reclaim the subtitle's width when the nav is crowded. */
  subtitleClassName?: string;
  iconSize?: number;
  framed?: boolean;
}

export function BrandLogo({
  className,
  subtitle = "School OS for India",
  subtitleClassName,
  iconSize = 44,
  framed = false,
}: BrandLogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "relative shrink-0",
          framed
            ? "overflow-hidden rounded-[1.1rem] border border-[color:var(--line-strong)] bg-[linear-gradient(135deg,rgba(83,117,194,0.12),transparent_65%)] shadow-[0_18px_36px_rgba(8,15,30,0.08)] dark:shadow-[0_18px_36px_rgba(0,0,0,0.34)]"
            : "drop-shadow-[0_14px_28px_rgba(8,15,30,0.12)] dark:drop-shadow-[0_14px_28px_rgba(0,0,0,0.34)]"
        )}
        style={{ width: iconSize, height: iconSize }}
      >
        {/*
          Explicit intrinsic width/height rather than `fill`.

          `fill` emits an absolutely-positioned <img> with no width or height
          attributes, which is the one remaining missing-dimension case on the
          site — and it is the most repeated image there is, appearing in the
          header and the footer of every page. The square box around it is
          already sized by `iconSize`, so the attributes cost nothing and give
          the browser the aspect ratio before the file arrives.
        */}
        <Image
          src="/images/marketing/logo-light.webp"
          alt=""
          width={iconSize}
          height={iconSize}
          className="h-full w-full object-contain"
        />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-display text-lg tracking-[-0.03em] text-[color:var(--foreground)]">
          SquareCampus
        </span>
        <span
          className={cn(
            "mt-0.5 block font-mono text-[0.6875rem] uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]",
            subtitleClassName
          )}
        >
          {subtitle}
        </span>
      </span>
    </Link>
  );
}
