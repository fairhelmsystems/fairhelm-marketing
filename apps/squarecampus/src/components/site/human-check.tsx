"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * The human check.
 *
 * Shown after the visitor presses submit, not before: someone who reads /demo
 * and leaves should never be asked to prove anything, and the intake function
 * only renders a board for a form that is already filled in and valid.
 *
 * The task is to drag the tile to the dot where its own wire ends. What makes
 * that resistant to a bot is not this file — everything here is readable by
 * anyone who opens devtools. It is that the board arrives as a picture and the
 * answer stays on the server: the response carries the image and where the
 * tile starts, and nothing else. There is no target in the DOM to read, no
 * list of dots to shortlist, and one guess per board.
 *
 * Accessibility: the tile is a button and moves under the arrow keys, so this
 * does not require a mouse or a touchscreen. It does require sight, and no
 * amount of care changes that — so the panel always shows the address a
 * visitor can simply email instead, and that is a real route, not a courtesy.
 */

export type HumanCheckResult =
  | { kind: "pass"; token: string }
  /** The service is not enforcing the check (no secret configured). Submit
   *  as before rather than blocking a real enquiry on our own rollout. */
  | { kind: "skip" }
  | { kind: "cancel" };

type Board = {
  id: string;
  image: string;
  width: number;
  height: number;
  start: { x: number; y: number };
  tolerance: number;
};

type Phase = "loading" | "ready" | "checking" | "passed" | "blocked" | "error";

const CONTACT_EMAIL = "contact@squarecampus.com";
const TILE = 34;
const KEY_STEP = 6;
const KEY_STEP_FAST = 18;
/** Long enough to read the tick, short enough not to feel like a wait. */
const VERIFIED_DWELL_MS = 1150;

const clamp = (value: number, min: number, max: number) =>
  value < min ? min : value > max ? max : value;

/** Boards are rendered server-side, so the theme has to be sent, not inherited. */
function currentTheme() {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function HumanCheck({
  endpoint,
  onResolve,
}: {
  /** Base challenge URL; `${endpoint}/solve` marks an answer. */
  endpoint: string;
  onResolve: (result: HumanCheckResult) => void;
}) {
  const [board, setBoard] = useState<Board | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [note, setNote] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [nudge, setNudge] = useState(0);
  /*
    The panel is portalled to <body>.

    It has to be: the form sits inside .surface-panel-strong, which sets
    backdrop-filter, and any filter or backdrop-filter makes an element the
    containing block for its `position: fixed` descendants. Rendered in place,
    a `fixed inset-0` overlay covers the form panel rather than the viewport —
    it looked like a z-index problem and was not one.
  */
  const [mounted, setMounted] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);
  const tileRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(pos);
  const startedAt = useRef(0);
  /*
    The parent's callback, held in a ref.

    `onResolve` is rebuilt on every render of the form, so using it directly as
    a hook dependency made `load` a new function on every parent render, and
    the effect that runs `load` fired again each time — a fresh board issued
    underneath a visitor who was halfway through tracing one, and a Lambda
    invocation and a DynamoDB write for each. Reading it through a ref keeps
    the callback current without letting its identity drive effects.
  */
  const resolveRef = useRef(onResolve);
  resolveRef.current = onResolve;
  const solvedIn = useRef(0);
  const live = useRef(true);

  posRef.current = pos;

  const place = useCallback((next: { x: number; y: number }) => {
    posRef.current = next;
    setPos(next);
  }, []);

  useEffect(() => {
    live.current = true;
    return () => {
      live.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    setPhase("loading");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: currentTheme() }),
      });
      if (!live.current) return;
      // No secret configured on the intake function: it is not enforcing the
      // check either, so asking the visitor to solve one would be theatre.
      if (response.status === 503) {
        resolveRef.current({ kind: "skip" });
        return;
      }
      if (response.status === 429) {
        setPhase("blocked");
        return;
      }
      if (!response.ok) {
        setPhase("error");
        return;
      }
      const next = (await response.json()) as Board;
      if (!live.current) return;
      setBoard(next);
      place(next.start);
      startedAt.current = performance.now();
      setElapsed(0);
      setPhase("ready");
    } catch {
      if (live.current) setPhase("error");
    }
  }, [endpoint, place]);

  useEffect(() => {
    void load();
  }, [load]);

  // The counter. It is the only moving thing on the panel, which is the point:
  // it says "this is a quick one" without a sentence of reassurance.
  useEffect(() => {
    if (phase !== "ready") return;
    const id = window.setInterval(() => {
      setElapsed((performance.now() - startedAt.current) / 1000);
    }, 100);
    return () => window.clearInterval(id);
  }, [phase]);

  const submitAnswer = useCallback(
    async (at: { x: number; y: number }) => {
      if (!board) return;
      solvedIn.current = (performance.now() - startedAt.current) / 1000;
      setPhase("checking");
      setNote(null);
      try {
        const response = await fetch(`${endpoint}/solve`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: board.id, x: Math.round(at.x), y: Math.round(at.y) }),
        });
        if (!live.current) return;
        if (response.status === 429) {
          setPhase("blocked");
          return;
        }
        const result = (await response.json()) as {
          ok?: boolean;
          pass?: string;
          expired?: boolean;
        };
        if (result.ok && result.pass) {
          setPhase("passed");
          window.setTimeout(() => {
            if (live.current) resolveRef.current({ kind: "pass", token: result.pass as string });
          }, VERIFIED_DWELL_MS);
          return;
        }
        setNote(
          result.expired
            ? "That board timed out. Here is a fresh one."
            : "Not quite — that wire ends somewhere else. Here is a fresh one."
        );
        setNudge((n) => n + 1);
        await load();
      } catch {
        if (live.current) setPhase("error");
      }
    },
    [board, endpoint, load]
  );

  // --- dragging ---------------------------------------------------------
  const toBoard = (clientX: number, clientY: number) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect || !board) return null;
    const scale = rect.width / board.width;
    return {
      x: clamp((clientX - rect.left) / scale, 0, board.width),
      y: clamp((clientY - rect.top) / scale, 0, board.height),
    };
  };

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (phase !== "ready") return;
    event.preventDefault();
    // Capture keeps the drag alive when the pointer leaves the tile, which is
    // every drag. It throws if the pointer is no longer active — a stale
    // pointerId, a synthetic event — and losing capture is survivable, so it
    // must not take the whole check down with it.
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* drag still works, it just stops tracking outside the tile */
    }
    setDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;
    const next = toBoard(event.clientX, event.clientY);
    if (next) place(next);
  };

  const endDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;
    setDragging(false);
    try {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    } catch {
      /* already released */
    }
    void submitAnswer(posRef.current);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (phase !== "ready" || !board) return;
    const step = event.shiftKey ? KEY_STEP_FAST : KEY_STEP;
    const moves: Record<string, [number, number]> = {
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      place({
        x: clamp(posRef.current.x + move[0], 0, board.width),
        y: clamp(posRef.current.y + move[1], 0, board.height),
      });
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      void submitAnswer(posRef.current);
    }
  };

  // Escape leaves the check without losing anything the visitor typed.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") resolveRef.current({ kind: "cancel" });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (phase === "ready") tileRef.current?.focus();
  }, [phase]);

  useEffect(() => {
    setMounted(true);
    // The page behind must not scroll under the panel, on a phone especially,
    // where a drag that starts on the board would otherwise pan the document.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const pct = (value: number, of: number) => `${(value / of) * 100}%`;

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[color:var(--background)]/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="human-check-title"
    >
      <div
        ref={panelRef}
        className="surface-panel-strong w-full max-w-[30rem] overflow-hidden rounded-[1.75rem] p-5 sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Quick human check</p>
            <h2
              id="human-check-title"
              className="mt-1.5 font-display text-lg tracking-[-0.02em] sm:text-xl"
            >
              Follow the wire. Drop the tile where it ends.
            </h2>
          </div>
          <p
            className="shrink-0 rounded-full border border-[color:var(--line)] px-2.5 py-1 font-mono text-[0.7rem] tabular-nums text-[color:var(--muted-foreground)]"
            aria-live="off"
          >
            {(phase === "passed" ? solvedIn.current : elapsed).toFixed(1)}s
          </p>
        </div>

        {phase === "passed" ? (
          <Verified seconds={solvedIn.current} />
        ) : phase === "blocked" ? (
          <Message
            title="Let's do this the easy way."
            body={`Too many tries from this connection. Email ${CONTACT_EMAIL} and we will pick it up from there — you will not have to fill this in again.`}
          />
        ) : phase === "error" ? (
          <Message
            title="That did not load."
            body={`Try again in a moment, or email ${CONTACT_EMAIL} and we will take it from there.`}
            onRetry={() => void load()}
          />
        ) : (
          <>
            <div
              ref={boardRef}
              key={nudge}
              className={`relative mt-4 overflow-hidden rounded-2xl border border-[color:var(--line)] ${
                nudge > 0 ? "human-check-nudge" : ""
              }`}
              style={{ aspectRatio: board ? `${board.width} / ${board.height}` : "440 / 300" }}
            >
              {board ? (
                <>
                  {/* Decorative: the board cannot be described without giving
                      away its answer, and the panel already offers a route
                      that does not involve solving it. */}
                  {/* A plain <img>, not next/image: the source is a data URI
                      minted for this one visitor, so there is nothing for a
                      build-time optimiser to do and no file to point at. */}
                  {/* biome-ignore lint/performance/noImgElement: per-request data URI, not a static asset next/image could optimise */}
                  <img
                    src={board.image}
                    alt=""
                    width={board.width}
                    height={board.height}
                    className="pointer-events-none absolute inset-0 h-full w-full select-none"
                    draggable={false}
                  />
                  <button
                    ref={tileRef}
                    type="button"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                    onKeyDown={onKeyDown}
                    aria-label="Tile. Drag it, or move it with the arrow keys and press Enter, to the dot where its wire ends."
                    className={`absolute rounded-[0.6rem] border border-white/25 bg-[color:var(--brand)] shadow-lg outline-none transition-[box-shadow,transform] focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-2 ${
                      dragging ? "scale-110 cursor-grabbing" : "cursor-grab"
                    } ${phase === "checking" ? "opacity-60" : ""}`}
                    style={{
                      width: TILE,
                      height: TILE,
                      left: pct(pos.x, board.width),
                      top: pct(pos.y, board.height),
                      transform: "translate(-50%, -50%)",
                      touchAction: "none",
                    }}
                  />
                </>
              ) : (
                <div className="absolute inset-0 animate-pulse bg-[color:var(--surface)]" />
              )}
            </div>

            <p
              className="mt-3 text-sm leading-6 text-[color:var(--muted-foreground)]"
              aria-live="polite"
            >
              {note ??
                "One of the lines starts under the tile. Follow it through the crossings and drop the tile on the dot at its far end."}
            </p>
          </>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--line)] pt-4">
          <p className="text-xs leading-5 text-[color:var(--muted-foreground)]">
            Rather not?{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline underline-offset-2 hover:text-[color:var(--foreground)]"
            >
              Email us
            </a>{" "}
            and we will reply the same way.
          </p>
          <button
            type="button"
            onClick={() => resolveRef.current({ kind: "cancel" })}
            className="text-xs font-medium text-[color:var(--muted-foreground)] underline underline-offset-2 hover:text-[color:var(--foreground)]"
          >
            Back to the form
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/** The confirmation: a ruled panel with the tick drawn onto it. */
function Verified({ seconds }: { seconds: number }) {
  return (
    <div className="human-check-verified mt-4 flex flex-col items-center justify-center rounded-2xl border border-[color:var(--line)] py-10">
      <svg
        className="human-check-tick size-14 text-[color:var(--brand)]"
        viewBox="0 0 56 56"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="human-check-ring"
          cx="28"
          cy="28"
          r="24"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.35"
          pathLength={1}
        />
        <path
          d="M17 29.5 L24.5 37 L39 21"
          stroke="currentColor"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
        />
      </svg>
      <p className="mt-3 font-display text-base tracking-[-0.02em]">Verified</p>
      <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
        {seconds < 6
          ? `Solved in ${seconds.toFixed(1)}s — quick`
          : `Solved in ${seconds.toFixed(1)}s`}
      </p>
    </div>
  );
}

function Message({ title, body, onRetry }: { title: string; body: string; onRetry?: () => void }) {
  return (
    <div className="mt-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5">
      <p className="font-display text-base tracking-[-0.02em]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[color:var(--muted-foreground)]">{body}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 text-sm font-medium underline underline-offset-2"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
