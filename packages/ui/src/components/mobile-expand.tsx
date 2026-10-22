"use client";

import { ChevronUp } from "lucide-react";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useState } from "react";

/** Loaded only when a visitor first opens a section on a phone. */
const BottomSheet = dynamic(() => import("./bottom-sheet"), { ssr: false });

/**
 * Progressive disclosure for phones. From sm: up the children always render
 * inline. On a phone they are collapsed behind a pill that opens them in a
 * draggable bottom sheet — the site's phone "know more" pattern — so the page
 * stays short and the reader never loses their place in it.
 *
 * The inline copy stays in the DOM on every screen (hidden with CSS below sm),
 * so crawlers and the Markdown alternates see everything; the sheet renders
 * its own copy only while it is open.
 */
export function MobileExpand({
  label,
  title,
  children,
  className,
}: {
  label: string;
  /** Sheet heading; defaults to the pill label. */
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  return (
    <div className={className}>
      <div className="hidden sm:block">{children}</div>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => {
          setMounted(true);
          setOpen(true);
        }}
        className="mt-1 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-(--line) bg-(--surface) px-5 text-sm font-medium text-foreground transition-colors active:bg-(--surface-muted) sm:hidden"
      >
        {label}
        <ChevronUp aria-hidden className="size-4" />
      </button>
      {mounted ? (
        <BottomSheet open={open} onOpenChange={setOpen} title={title ?? label}>
          {children}
        </BottomSheet>
      ) : null}
    </div>
  );
}
