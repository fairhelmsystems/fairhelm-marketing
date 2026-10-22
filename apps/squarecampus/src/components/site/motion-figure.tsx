"use client";

import { useEffect, useRef, useState } from "react";
import type { MotionAsset, MotionSource } from "@/content/motion-assets";
import { cn } from "@fairhelm/ui/lib/utils";

/**
 * Delivery wrapper for the build-time motion assets.
 *
 * Remotion renders these files during development (see `motion/README.md`);
 * nothing from Remotion reaches the browser. What ships is this component and
 * an ordinary `<video>` element.
 *
 * The rules it enforces, in the order they matter:
 *
 *  1. The poster is the real deliverable. It is the composition's meaningful
 *     final frame, it is in the markup from the first byte, and it is a
 *     complete picture on its own. Everything below is an enhancement.
 *  2. Nothing is downloaded until the figure is close to the viewport. The
 *     `<video>` is server-rendered with `preload="none"` and *no source at
 *     all*, so a below-the-fold asset cannot enter the initial critical path
 *     even if a browser ignores `preload`. The source is attached by an
 *     IntersectionObserver.
 *  3. `prefers-reduced-motion` and Save-Data never attach a source. Those
 *     visitors get the poster and no video bytes at all.
 *  4. It plays once and holds the final frame. `loop` is deliberately absent:
 *     an explanatory diagram that restarts forever is decoration.
 *  5. It pauses when scrolled substantially out of view.
 *  6. If anything fails — no JS, blocked media, a decode error — the poster
 *     stays. There is no blank box and no broken-media state.
 *
 * `loading="lazy"` is not defined for `<video>` (it is an `<img>`/`<iframe>`
 * attribute), so it is not emitted here; rule 2 achieves the same result
 * without shipping markup that only looks like it does something.
 *
 * Theme: each composition is rendered twice at build time. The markup carries
 * the light variant because the site's server-rendered default is light (the
 * theme script only switches to dark from localStorage, so a no-JS visitor is
 * always on light). Once mounted, this component follows `data-theme` — and
 * still fetches exactly one video, because the source is chosen after the
 * theme is known.
 *
 * The DOM around this component remains the authoritative explanation. When
 * `redundant` is true the figure is hidden from assistive technology, because
 * the adjacent copy already says the same thing.
 */
export function MotionFigure({
  asset,
  className,
  redundant = false,
  caption,
  bare = false,
}: {
  asset: MotionAsset;
  className?: string;
  /** True when adjacent DOM copy already carries the whole meaning. */
  redundant?: boolean;
  /** Visible caption. Also becomes the accessible name when not redundant. */
  caption?: string;
  /**
   * Drop the panel chrome and fill the parent instead. For screens rendered
   * inside a device mockup, where the bezel is already the frame.
   */
  bare?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Follow the site's own theme switch. Cheap: one observer on one attribute.
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setTheme(root.dataset.theme === "dark" ? "dark" : "light");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const source: MotionSource = asset[theme];

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source.mp4) {
      return;
    }

    video.poster = source.poster;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Save-Data is Chromium-only and often absent; `!== true` keeps the
    // default path for every browser that does not report it.
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ===
      true;

    if (reduced || saveData) {
      return;
    }

    const sources: Array<{ src: string; type: string }> = [];
    if (source.webm) {
      sources.push({ src: source.webm, type: "video/webm" });
    }
    sources.push({ src: source.mp4, type: "video/mp4" });

    let attached = false;
    let finished = false;

    const attach = () => {
      if (attached) {
        return;
      }
      attached = true;
      for (const candidate of sources) {
        const node = document.createElement("source");
        node.src = candidate.src;
        node.type = candidate.type;
        video.appendChild(node);
      }
      video.load();
    };

    const onEnded = () => {
      finished = true;
    };
    video.addEventListener("ended", onEnded);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            attach();
            if (!finished) {
              // A rejected play() is not worth surfacing: the poster is
              // already the complete fallback.
              void video.play().catch(() => {});
            }
          } else if (!video.paused) {
            video.pause();
          }
        }
      },
      // Threshold 0 plus a 200px margin, deliberately: a 16:9 figure is taller
      // than a short viewport, so a ratio-based threshold can be impossible to
      // reach on the very devices that most need the asset to behave. Any part
      // of the figure within 200px of the viewport counts as "here"; nothing
      // within 200px counts as substantially out of view.
      { rootMargin: "200px 0px", threshold: 0 }
    );
    observer.observe(video);

    return () => {
      observer.disconnect();
      video.removeEventListener("ended", onEnded);
      // Re-attach cleanly if the theme changed mid-view.
      for (const node of Array.from(video.querySelectorAll("source"))) {
        node.remove();
      }
    };
  }, [source]);

  const label = caption ?? asset.description;

  if (bare) {
    // Inside a device bezel a tier-2 asset is still the whole picture, so it
    // renders as the theme pair rather than nothing. The markup is duplicated
    // from MotionPoster rather than imported: putting that Server Component in
    // the client graph too made Turbopack's static export emit a flight
    // reference to a chunk it never wrote, and every page using this component
    // died with a ChunkLoadError during hydration. The graphs stay separate.
    if (!asset.light.mp4) {
      const text = redundant ? "" : label;
      const shared = {
        width: asset.width,
        height: asset.height,
        loading: "lazy" as const,
        decoding: "async" as const,
      };
      return (
        <>
          {/* biome-ignore lint/performance/noImgElement: next/image is unoptimized
              in this static export; these are pre-sized, content-hashed assets. */}
          <img
            {...shared}
            alt={text}
            src={asset.light.poster}
            className="absolute inset-0 block h-full w-full object-fill dark:hidden"
          />
          {/* biome-ignore lint/performance/noImgElement: see above */}
          <img
            {...shared}
            alt={text}
            src={asset.dark.poster}
            className="absolute inset-0 hidden h-full w-full object-fill dark:block"
          />
        </>
      );
    }

    return (
      // Silent diagram: no audio track, so no <track> element.
      <video
        ref={videoRef}
        poster={asset.light.poster}
        width={asset.width}
        height={asset.height}
        muted
        playsInline
        preload="none"
        disablePictureInPicture
        className={cn("absolute inset-0 h-full w-full object-fill", className)}
        {...(redundant ? {} : { role: "img", "aria-label": label })}
      />
    );
  }

  // Outside a bezel, a tier-2 asset belongs to `MotionPoster` — same reasoning
  // about keeping the two module graphs separate.
  if (!asset.light.mp4) {
    return null;
  }

  return (
    <figure className={cn("m-0", className)} aria-hidden={redundant || undefined}>
      <div
        className="surface-panel overflow-hidden rounded-[var(--radius-panel)] p-0"
        // Intrinsic ratio reserved in CSS as well as on the element, so the box
        // exists before the poster decodes: new media contributes no layout shift.
        style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
      >
        {/* Silent explanatory diagram: no audio track, so no <track> element.
            The meaning is carried by the adjacent DOM copy, and by aria-label
            when the figure is not redundant. */}
        <video
          ref={videoRef}
          poster={asset.light.poster}
          width={asset.width}
          height={asset.height}
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          className="block h-full w-full"
          {...(redundant ? {} : { role: "img", "aria-label": label })}
        />
      </div>
      {caption ? <figcaption className="type-caption mt-3">{caption}</figcaption> : null}
    </figure>
  );
}
