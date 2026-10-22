"use client";

import { Drawer } from "@base-ui/react/drawer";
import { X } from "lucide-react";
import type { ReactNode } from "react";

/**
 * The phone "know more" pattern, site-wide: a draggable bottom sheet
 * (Base UI Drawer). Used for plan details on /pricing/ and by MobileExpand for
 * every collapsed section on a phone.
 *
 * Callers load it with next/dynamic when it is first opened, so the drawer's
 * code is never part of a page's first load. Swipe down, the close button,
 * Escape or the backdrop dismiss it; focus is trapped while it is open and
 * returns to the button that opened it.
 */
export default function BottomSheet({
  open,
  onOpenChange,
  title,
  children,
  closeLabel = "Close",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  closeLabel?: string;
}) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} swipeDirection="down">
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Drawer.Viewport className="fixed inset-0 z-50 flex items-end justify-center">
          <Drawer.Popup className="bottom-sheet relative flex max-h-[88dvh] w-full flex-col rounded-t-[1.75rem] border border-b-0 border-[color:var(--line-strong)] bg-background shadow-[0_-24px_60px_rgba(8,15,30,0.28)] outline-none">
            {/* Drag handle: the popup itself is swipeable; this is the affordance. */}
            <span
              aria-hidden
              className="mx-auto mt-3 mb-2 block h-1.5 w-10 shrink-0 rounded-full bg-[color:var(--line-strong)]"
            />
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[color:var(--line)] px-5 pb-3">
              <Drawer.Title className="font-display text-xl tracking-[-0.04em] text-[color:var(--foreground)]">
                {title}
              </Drawer.Title>
              <Drawer.Close
                aria-label={closeLabel}
                className="inline-flex size-11 items-center justify-center rounded-full border border-[color:var(--line)] text-[color:var(--foreground)]"
              >
                <X aria-hidden className="size-4" />
              </Drawer.Close>
            </div>
            <Drawer.Content className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              {children}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
