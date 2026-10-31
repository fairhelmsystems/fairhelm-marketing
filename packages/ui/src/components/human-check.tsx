"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useCallback, useEffect, useRef, useState } from "react";
import { isHumanCheckDisabled } from "../lib/human-check-response";

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
  instructions?: { title?: string; help?: string; tileLabel?: string };
};

type Phase = "loading" | "ready" | "checking" | "passed" | "blocked" | "error";

const TILE = 34;
// Board text is displayed as plain React text, bounded to keep an invalid
// service response from overwhelming the dialog or its accessible label.
const validBoardText = (value: unknown, max: number): value is string =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  value.length <= max &&
  [...value].every((character) => {
    const code = character.charCodeAt(0);
    return code >= 32 && code !== 127;
  });
const boardText = (value: unknown, fallback: string, max: number) =>
  validBoardText(value, max) ? value.trim() : fallback;
const KEY_STEP = 6;
const KEY_STEP_FAST = 18;
/** Long enough to read the tick, short enough not to feel like a wait. */
const VERIFIED_DWELL_MS = 1150;

/** Pointer samples kept per board, and the cap on what is sent. */
const TRACE_MAX = 64;
const TRACE_MIN_GAP_MS = 16;

type TracePoint = { x: number; y: number; t: number };

/** Evenly thin a trace to `TRACE_MAX` points, always keeping the first and last. */
function thin(points: TracePoint[]): TracePoint[] {
  if (points.length <= TRACE_MAX) return points;
  const out: TracePoint[] = [];
  for (let i = 0; i < TRACE_MAX; i++) {
    out.push(points[Math.round((i * (points.length - 1)) / (TRACE_MAX - 1))]);
  }
  return out;
}

const clamp = (value: number, min: number, max: number) =>
  value < min ? min : value > max ? max : value;

/** Boards are rendered server-side, so the theme has to be sent, not inherited. */
function currentTheme() {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function HumanCheck({
  endpoint,
  contactEmail,
  onResolve,
}: {
  /** Base challenge URL; `${endpoint}/solve` marks an answer. */
  endpoint: string;
  /** The address offered as the route that needs no solving. */
  contactEmail: string;
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
  const posRef = useRef(pos);
  const startedAt = useRef(0);
  /*
    How the tile was moved, for the intake function to score. A script that
    teleports the tile, or drags it in a straight line at constant speed, looks
    nothing like a hand. This is evidence, not a verdict: it is readable and
    forgeable in devtools, so only the server can weigh it, alongside the
    one-guess board and rate limits it already enforces. Keyboard use is
    labelled rather than penalised, so it stays a first-class route.
  */
  const traceRef = useRef<TracePoint[]>([]);
  const dragStartedAt = useRef(0);
  const firstTouchAt = useRef(0);
  const usedKeyboard = useRef(false);
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
        const body: unknown = await response.json().catch(() => null);
        if (!live.current) return;
        if (isHumanCheckDisabled(body)) resolveRef.current({ kind: "skip" });
        else setPhase("error");
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
      if (
        next.instructions !== undefined &&
        (!validBoardText(next.instructions?.title, 120) ||
          !validBoardText(next.instructions?.help, 300) ||
          !validBoardText(next.instructions?.tileLabel, 240))
      ) {
        setPhase("error");
        return;
      }
      setBoard(next);
      place(next.start);
      startedAt.current = performance.now();
      traceRef.current = [];
      firstTouchAt.current = 0;
      dragStartedAt.current = 0;
      usedKeyboard.current = false;
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
          body: JSON.stringify({
            id: board.id,
            x: Math.round(at.x),
            y: Math.round(at.y),
            behaviour: {
              via: usedKeyboard.current ? "keyboard" : "pointer",
              thinkMs: Math.round(firstTouchAt.current - startedAt.current),
              dragMs: Math.round(performance.now() - dragStartedAt.current),
              trace: thin(traceRef.current),
            },
          }),
        });
        if (!live.current) return;
        if (response.status === 429) {
          setPhase("blocked");
          return;
        }
        // A service failure is not evidence of an incorrect answer. Keep the
        // retry/email route available instead of silently issuing another board.
        if (!response.ok) {
          setPhase("error");
          return;
        }
        const result = (await response.json()) as {
          ok?: boolean;
          pass?: string;
          expired?: boolean;
          retry?: boolean;
        };
        if (result.ok && result.pass) {
          setPhase("passed");
          window.setTimeout(() => {
            if (live.current) resolveRef.current({ kind: "pass", token: result.pass as string });
          }, VERIFIED_DWELL_MS);
          return;
        }
        setNote(
          result.retry === true
            ? "One more quick check. Here is a fresh board."
            : result.expired
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
    const now = performance.now();
    if (!firstTouchAt.current) firstTouchAt.current = now;
    dragStartedAt.current = now;
    traceRef.current = [];
    setDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;
    const next = toBoard(event.clientX, event.clientY);
    if (!next) return;
    place(next);
    const now = performance.now();
    const last = traceRef.current[traceRef.current.length - 1];
    if (!last || now - dragStartedAt.current - last.t >= TRACE_MIN_GAP_MS) {
      traceRef.current.push({
        x: Math.round(next.x),
        y: Math.round(next.y),
        t: Math.round(now - dragStartedAt.current),
      });
    }
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
    if (move || event.key === "Enter" || event.key === " ") {
      usedKeyboard.current = true;
      const now = performance.now();
      if (!firstTouchAt.current) firstTouchAt.current = now;
      if (!dragStartedAt.current) dragStartedAt.current = firstTouchAt.current;
    }
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

  useEffect(() => {
    if (phase === "ready") tileRef.current?.focus();
  }, [phase]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pct = (value: number, of: number) => `${(value / of) * 100}%`;

  if (!mounted) return null;

  return (
    <Dialog.Root
      open
      disablePointerDismissal
      onOpenChange={(open) => {
        if (!open) resolveRef.current({ kind: "cancel" });
      }}
    >
      {/* The modal owns focus containment/restoration, Escape and scroll lock.
          Keep its portal outside filtered form panels so it covers the viewport. */}
      <Dialog.Portal>
        <Dialog.Popup className="fixed inset-0 z-[100] flex items-center justify-center bg-[color:var(--background)]/80 p-4 backdrop-blur-sm">
          <div className="surface-panel-strong w-full max-w-[30rem] overflow-hidden rounded-[1.75rem] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-kicker">Quick human check</p>
                <Dialog.Title className="mt-1.5 font-display text-lg tracking-[-0.02em] sm:text-xl">
                  {boardText(
                    board?.instructions?.title,
                    "Follow the wire. Drop the tile where it ends.",
                    120
                  )}
                </Dialog.Title>
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
                body={`Too many tries from this connection. Email ${contactEmail} and we will pick it up from there — you will not have to fill this in again.`}
              />
            ) : phase === "error" ? (
              <Message
                title="That did not load."
                body={`Try again in a moment, or email ${contactEmail} and we will take it from there.`}
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
                        aria-label={boardText(
                          board.instructions?.tileLabel,
                          "Tile. Drag it, or move it with the arrow keys and press Enter, to the dot where its wire ends.",
                          240
                        )}
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
                    boardText(
                      board?.instructions?.help,
                      "One of the lines starts under the tile. Follow it through the crossings and drop the tile on the dot at its far end.",
                      300
                    )}
                </p>
              </>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--line)] pt-4">
              <p className="text-xs leading-5 text-[color:var(--muted-foreground)]">
                Rather not?{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="underline underline-offset-2 hover:text-[color:var(--foreground)]"
                >
                  Email us
                </a>{" "}
                and we will reply the same way.
              </p>
              <Dialog.Close
                type="button"
                className="text-xs font-medium text-[color:var(--muted-foreground)] underline underline-offset-2 hover:text-[color:var(--foreground)]"
              >
                Back to the form
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
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
