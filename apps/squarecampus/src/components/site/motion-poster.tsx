import type { MotionAsset } from "@/content/motion-assets";
import { cn } from "@fairhelm/ui/lib/utils";

/**
 * The still form of a motion composition: the meaningful final frame, and
 * nothing else.
 *
 * Used where the priority matrix says a page gets a storyboard rather than a
 * video (tier 2), and on the homepage — which already carries the command
 * centre and substantial HTML, and must not gain a second auto-starting asset.
 *
 * Deliberately a Server Component with no JavaScript at all. Both theme
 * variants are in the markup and CSS decides which one is displayed; because
 * both are `loading="lazy"`, the hidden one has no layout box, never
 * intersects the viewport, and is never fetched. One file on the wire, correct
 * in either theme, no hydration, no theme flash.
 *
 * Both images carry the same `alt`, and neither is `aria-hidden`: the inactive
 * one is `display: none`, so it is already out of the accessibility tree.
 * Marking one of them hidden unconditionally would silence the figure entirely
 * in whichever theme that one happened to be.
 */
export function MotionPoster({
  asset,
  className,
  alt,
  priority = false,
}: {
  asset: MotionAsset;
  className?: string;
  /** Empty string marks the figure as decorative when adjacent copy says the same. */
  alt?: string;
  /** Only for an above-the-fold LCP candidate. These placements are all below it. */
  priority?: boolean;
}) {
  const text = alt ?? asset.description;
  const shared = {
    width: asset.width,
    height: asset.height,
    decoding: "async" as const,
    ...(priority ? {} : { loading: "lazy" as const }),
  };

  return (
    <div
      className={cn("surface-panel overflow-hidden rounded-[var(--radius-panel)] p-0", className)}
      style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
    >
      {/* biome-ignore lint/performance/noImgElement: next/image is unoptimized in
          this static export, so it would emit the same <img> with extra inline
          styles and no srcset. These are pre-sized, content-hashed assets. */}
      <img
        {...shared}
        alt={text}
        src={asset.light.poster}
        className="block h-full w-full dark:hidden"
      />
      {/* biome-ignore lint/performance/noImgElement: see above */}
      <img
        {...shared}
        alt={text}
        src={asset.dark.poster}
        className="hidden h-full w-full dark:block"
      />
    </div>
  );
}
