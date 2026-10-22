import Image from "next/image";
import Link from "next/link";
import { cn } from "@fairhelm/ui/lib/utils";

export function BrandLockup({
  className,
  href,
  label,
  tagline,
  markSrc,
  priority = false,
}: {
  className?: string;
  href: string;
  label: string;
  tagline?: string;
  markSrc: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={`${label} home`}
      className={cn("inline-flex items-center gap-3", className)}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-[#f4f6fa] p-1.5 shadow-sm">
        <Image
          src={markSrc}
          alt=""
          width={562}
          height={892}
          className="h-full w-auto"
          priority={priority}
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-heading text-[1.02rem] tracking-[-0.02em] text-foreground">
          {label}
        </span>
        {tagline ? (
          <span className="mt-1 hidden font-mono text-[0.56rem] tracking-[0.26em] text-muted-foreground uppercase sm:block">
            {tagline}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
