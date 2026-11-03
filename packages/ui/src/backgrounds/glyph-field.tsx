"use client";

import { useEffect, useRef } from "react";
import { cn } from "@fairhelm/ui/lib/utils";

/**
 * Hero backdrop: the ledger glyph field.
 *
 * Decoration only: `aria-hidden`, receives no pointer events. Without JS the
 * hero is exactly the hero.
 *
 * A faint canvas grid of monospace marks drawn from the product's own
 * vocabulary (register ticks, receipt numbers, timestamps, section codes).
 * It fades to nothing behind the content and shows toward the edges, so it
 * reads as the paper the interface is printed on.
 *
 * A band of brand light sweeps across it three times after load and then the
 * hero rests: one compositor-only `transform` animation in CSS, no script per
 * frame, none under reduced motion.
 *
 * The canvas is painted once (and again only on resize or a theme flip).
 * There is no animation loop: the old per-frame flicker kept a core and the compositor
 * busy for as long as the hero was on screen, which is most of a visit on a
 * low-end phone. Ink follows the theme, read from CSS.
 *
 * The pointer spotlight that used to scramble a gradient sheet under the
 * cursor was removed in the design-system pass: it competed with the
 * headline and the product for the eye on the one screen that matters.
 */

const GLYPHS = "0123456789::://%%··——++=×✓✓▸◦□▪";
const TOKENS = ["09:40", "OK", "AUDIT", "LOGGED", "OWNER", "SCOPE", "REVIEWED", "Δ 0", "✓ ✓ ✓"];

const CELL_W = 17;
const CELL_H = 24;
const MAX_ALPHA = 0.08;

type Cell = {
  x: number;
  y: number;
  text: string;
  /** Alpha multiplier, 0–1 before the mask and MAX_ALPHA are applied. */
  a: number;
  /** Positional mask, 0 behind the content, 1 at the edges. */
  weight: number;
};

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const pick = <T,>(list: ArrayLike<T>): T => list[Math.floor(Math.random() * list.length)];

export function GlyphField({
  className,
  vocabulary,
}: {
  className?: string;
  /** `fragments` is accepted for compatibility; only `tokens` are drawn. */
  vocabulary?: { tokens: readonly string[]; fragments?: readonly string[] };
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const tokens = vocabulary?.tokens?.length ? vocabulary.tokens : TOKENS;
    const canvas = canvasRef.current;
    // The wrapper is `absolute inset-0` of the nearest positioned ancestor,
    // the hero <section>; sizes come from the wrapper's own box.
    const wrapper = canvas?.parentElement;
    if (!canvas || !wrapper) {
      return;
    }
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      return;
    }

    const narrow = window.matchMedia("(max-width: 640px)").matches;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let dpr = 1;
    let ink = "rgb(35, 42, 60)";
    let font = "12px monospace";
    let cells: Cell[] = [];

    const readStyle = () => {
      const style = getComputedStyle(canvas);
      ink = style.color;
      font = `${12 * dpr}px ${style.fontFamily}`;
    };

    const weightAt = (x: number, y: number) => {
      // Elliptical mask centred slightly above the middle of the section —
      // where the headline and the device sit.
      const nx = (x / width - 0.5) / 0.5;
      const ny = (y / height - 0.47) / 0.53;
      const d = Math.sqrt(nx * nx * 0.85 + ny * ny * 1.35);
      const radial = clamp01((d - 0.5) / 0.48);
      const bottom = clamp01((1 - y / height) / 0.22);
      const top = clamp01(y / height / 0.06);
      return radial * bottom * top * (narrow ? 0.55 : 1);
    };

    const paintCell = (cell: Cell) => {
      ctx.clearRect(cell.x * dpr, cell.y * dpr, CELL_W * dpr * cell.text.length, CELL_H * dpr);
      const alpha = cell.a * cell.weight * MAX_ALPHA;
      if (alpha < 0.004) {
        return;
      }
      ctx.globalAlpha = alpha;
      ctx.fillText(cell.text, (cell.x + 3) * dpr, (cell.y + 6) * dpr);
    };

    const paintAll = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = font;
      ctx.textBaseline = "top";
      ctx.fillStyle = ink;
      for (const cell of cells) {
        paintCell(cell);
      }
      ctx.globalAlpha = 1;
    };

    const build = () => {
      const rect = wrapper.getBoundingClientRect();
      width = Math.round(rect.width);
      height = Math.round(rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      readStyle();

      cols = Math.ceil(width / CELL_W);
      rows = Math.ceil(height / CELL_H);
      const next: Cell[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const roll = Math.random();
          if (roll < 0.5) {
            continue; // empty cell — the field must breathe
          }
          let text: string;
          if (roll > 0.955) {
            text = pick(tokens);
            c += text.length - 1;
          } else {
            text = pick(GLYPHS);
          }
          const x = c * CELL_W - (text.length - 1) * CELL_W;
          const y = r * CELL_H;
          const weight = weightAt(x + (text.length * CELL_W) / 2, y + CELL_H / 2);
          if (weight < 0.02) {
            continue;
          }
          const a = 0.25 + Math.random() * 0.75;
          next.push({ x, y, text, a, weight });
        }
      }
      cells = next;
      paintAll();
    };

    build();

    let resizeFrame = 0;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(build);
    });
    resizeObserver.observe(wrapper);

    const theme = new MutationObserver(() => {
      readStyle();
      paintAll();
    });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      theme.disconnect();
    };
  }, [vocabulary]);

  return (
    <div
      data-md-skip
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full font-mono text-foreground"
      />
      {/* The sweep: a band of brand light crossing the ledger a few times
          after load, then resting (styles.css, `.glyph-sweep`). CSS only. */}
      <div className="glyph-sweep" />
    </div>
  );
}
