"use client";

import { useEffect, useRef } from "react";
import { cn } from "@fairhelm/ui/lib/utils";

/**
 * Hero backdrop: the ledger glyph field plus a pointer spotlight.
 *
 * Two layers, both decoration, both `aria-hidden`, neither receives pointer
 * events. Without JS the hero is exactly the hero.
 *
 * 1. FIELD (canvas). A faint grid of monospace marks drawn from the product's
 *    own vocabulary — register ticks, receipt numbers, timestamps, section
 *    codes. It fades to nothing behind the content and shows toward the
 *    edges, so it reads as the paper the interface is printed on. The grid is
 *    painted once; the loop then re-paints only the few cells whose alpha is
 *    changing (a slow random flicker), and stops when the hero leaves the
 *    viewport or the tab is hidden.
 *
 * 2. SPOTLIGHT (DOM). A radial mask follows the mouse. Inside it a brand
 *    gradient shows through, and a sheet of characters — laid out on the same
 *    17×24 grid as the field — is blended over it and re-scrambled on every
 *    pointer move, so the paper appears to decrypt under the cursor. Outside
 *    the mask there is nothing. The same construction as Aceternity's
 *    Evervault card, on the site's own palette and grid.
 *
 * Ink and gradient follow the theme (colours are read from CSS, and re-read
 * when the `dark` class flips). `prefers-reduced-motion`: the field is
 * painted once and never flickers; the spotlight still follows the mouse but
 * its characters stay put instead of scrambling. Mouse only — touch and pen
 * have no hover, so they get the field alone.
 */

const GLYPHS = "0123456789::://%%··——++=×✓✓▸◦□▪";
const TOKENS = ["09:40", "OK", "AUDIT", "LOGGED", "OWNER", "SCOPE", "REVIEWED", "Δ 0", "✓ ✓ ✓"];

/**
 * What the spotlight scrambles through: the ledger's own fragments rather
 * than cipher text, so what decrypts under the cursor is the product's
 * vocabulary — fee lines, register marks, timestamps, section codes.
 */
const FRAGMENTS = [
  "RECONCILED",
  "09:40",
  "OK",
  "OWNER",
  "ROUTED",
  "LOGGED",
  "AUDIT",
  "SCOPE",
  "REVIEWED",
  "Δ 0",
  "✓",
  "→",
];

const CELL_W = 17;
const CELL_H = 24;
const MAX_ALPHA = 0.13;
const TICK_MS = 110;
const MUTATIONS_PER_TICK = 5;

type Cell = {
  x: number;
  y: number;
  text: string;
  /** Current alpha multiplier, 0–1 before the mask and MAX_ALPHA are applied. */
  a: number;
  target: number;
  /** Positional mask, 0 behind the content, 1 at the edges. */
  weight: number;
};

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const pick = <T,>(list: ArrayLike<T>): T => list[Math.floor(Math.random() * list.length)];

function cipherSheet(cols: number, rows: number, fragments: readonly string[]) {
  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    let line = "";
    while (line.length < cols) {
      // Fragments are separated by one or two cells so the row still reads
      // as entries, not as one run of characters.
      line += pick(fragments) + (Math.random() < 0.6 ? " " : "  ");
    }
    lines.push(line.slice(0, cols));
  }
  return lines.join("\n");
}

export function GlyphField({
  className,
  vocabulary,
}: {
  className?: string;
  vocabulary?: { tokens: readonly string[]; fragments: readonly string[] };
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spotRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const tokens = vocabulary?.tokens?.length ? vocabulary.tokens : TOKENS;
    const fragments = vocabulary?.fragments?.length ? vocabulary.fragments : FRAGMENTS;
    const canvas = canvasRef.current;
    const spot = spotRef.current;
    const sheet = sheetRef.current;
    // The wrapper is `absolute inset-0` of the nearest positioned ancestor —
    // the hero <section>. Sizes come from the wrapper's own box; pointer
    // events are listened for on the section, since the wrapper takes none.
    const wrapper = canvas?.parentElement;
    const host = wrapper?.closest("section") ?? wrapper?.parentElement;
    if (!canvas || !spot || !sheet || !wrapper || !host) {
      return;
    }
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 640px)").matches;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let dpr = 1;
    let ink = "rgb(35, 42, 60)";
    let font = "12px monospace";
    let cells: Cell[] = [];
    let active = new Set<number>();
    let inView = true;
    let raf = 0;
    let lastTick = 0;

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
          next.push({ x, y, text, a, target: a, weight });
        }
      }
      cells = next;
      active = new Set();
      paintAll();
      sheet.textContent = cipherSheet(cols, rows, fragments);
    };

    const step = (now: number) => {
      raf = 0;
      if (!inView || document.hidden) {
        return;
      }
      if (now - lastTick >= TICK_MS) {
        lastTick = now;
        for (let i = 0; i < MUTATIONS_PER_TICK && cells.length > 0; i++) {
          const index = Math.floor(Math.random() * cells.length);
          const cell = cells[index];
          cell.target = Math.random() < 0.3 ? 0.05 : 0.25 + Math.random() * 0.75;
          if (cell.text.length === 1 && Math.random() < 0.5) {
            // Swap the mark while it is dim, so the change reads as a flicker
            // rather than a jump.
            cell.text = pick(GLYPHS);
          }
          active.add(index);
        }
      }
      if (active.size > 0) {
        ctx.font = font;
        ctx.textBaseline = "top";
        ctx.fillStyle = ink;
        for (const index of active) {
          const cell = cells[index];
          cell.a += (cell.target - cell.a) * 0.14;
          if (Math.abs(cell.target - cell.a) < 0.01) {
            cell.a = cell.target;
            active.delete(index);
          }
          paintCell(cell);
        }
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(step);
    };

    const run = () => {
      if (reducedMotion || raf) {
        return;
      }
      raf = requestAnimationFrame(step);
    };

    build();
    run();

    // Spotlight. The mask centre is two CSS variables; the sheet is
    // re-scrambled at most once per frame while the mouse moves.
    let moveFrame = 0;
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      const rect = wrapper.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      cancelAnimationFrame(moveFrame);
      moveFrame = requestAnimationFrame(() => {
        spot.style.setProperty("--mx", `${x}px`);
        spot.style.setProperty("--my", `${y}px`);
        spot.classList.add("is-lit");
        if (!reducedMotion) {
          sheet.textContent = cipherSheet(cols, rows, fragments);
        }
      });
    };
    const onPointerLeave = () => {
      cancelAnimationFrame(moveFrame);
      spot.classList.remove("is-lit");
    };
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);

    let resizeFrame = 0;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(build);
    });
    resizeObserver.observe(wrapper);

    const intersection = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          run();
        }
      },
      { threshold: 0 }
    );
    intersection.observe(canvas);

    const onVisibility = () => {
      if (!document.hidden) {
        run();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const theme = new MutationObserver(() => {
      readStyle();
      paintAll();
    });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(moveFrame);
      cancelAnimationFrame(resizeFrame);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      resizeObserver.disconnect();
      intersection.disconnect();
      theme.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
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
      <div ref={spotRef} className="glyph-spot absolute inset-0">
        <div className="glyph-spot__glow absolute inset-0" />
        <p ref={sheetRef} className="glyph-spot__sheet absolute inset-0 m-0" />
      </div>
    </div>
  );
}
