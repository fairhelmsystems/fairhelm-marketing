"use client";

import {
  BookOpenCheck,
  Calculator,
  ChartNoAxesCombined,
  FileSpreadsheet,
  Fingerprint,
  MessageCircleMore,
  Wallet,
  Workflow,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@fairhelm/ui/lib/utils";

/**
 * The services story in one picture: six fragmented tools stream data packets
 * (SMIL animateMotion) through an ETL/ELT hub into a single dashboard.
 * Entrance choreography reuses the .aegis-visual CSS; packet dots hide under
 * prefers-reduced-motion via the .svc-flow rules in globals.css.
 */

const tools = [
  { label: "Biometric", icon: Fingerprint, top: "2%" },
  { label: "Payments", icon: Wallet, top: "18.4%" },
  { label: "Accounts", icon: Calculator, top: "34.8%" },
  { label: "LMS", icon: BookOpenCheck, top: "51.2%" },
  { label: "Messaging", icon: MessageCircleMore, top: "67.6%" },
  { label: "Spreadsheets", icon: FileSpreadsheet, top: "84%" },
] as const;

// Paths from each source (x=178) to the hub (x=400, y=225), viewBox 800x450.
const inPaths = [
  "M178 32 C280 32 320 225 398 225",
  "M178 106 C280 106 320 225 398 225",
  "M178 180 C280 180 330 225 398 225",
  "M178 254 C280 254 330 225 398 225",
  "M178 328 C280 328 320 225 398 225",
  "M178 402 C280 402 320 225 398 225",
] as const;

const outPath = "M472 225 C540 225 560 225 620 225";

export function ServicesFlowVisual({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add("is-live");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    const timeout = setTimeout(() => node.classList.add("is-live"), 4000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div data-md-skip ref={ref} className={cn("aegis-visual svc-flow", className)}>
      <div className="surface-panel-strong relative overflow-hidden rounded-4xl p-4 sm:p-6">
        <div className="pointer-events-none absolute inset-x-[20%] top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(88,124,204,0.16),transparent_70%)]" />

        <div className="relative aspect-800/450 w-full">
          {/* Connector lines + traveling data packets */}
          <svg
            viewBox="0 0 800 450"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {inPaths.map((d, index) => (
              <g key={d}>
                <path
                  d={d}
                  data-aegis-line
                  pathLength={1}
                  style={{ "--d": `${150 + index * 80}ms` } as React.CSSProperties}
                  fill="none"
                  stroke="var(--brand)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                {[0, 1.4].map((delay) => (
                  <circle key={delay} data-packet r="3.2" fill="var(--brand)" opacity="0.85">
                    <animateMotion
                      dur="2.8s"
                      begin={`${delay + index * 0.35}s`}
                      repeatCount="indefinite"
                      path={d}
                    />
                  </circle>
                ))}
              </g>
            ))}
            <path
              d={outPath}
              data-aegis-line
              pathLength={1}
              style={{ "--d": "700ms" } as React.CSSProperties}
              fill="none"
              stroke="var(--teal)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {[0, 0.9, 1.8].map((delay) => (
              <circle key={delay} data-packet r="3.6" fill="var(--teal)">
                <animateMotion
                  dur="1.6s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                  path={outPath}
                />
              </circle>
            ))}
          </svg>

          {/* Source tools */}
          {tools.map((tool, index) => (
            <div
              key={tool.label}
              data-aegis-rise
              style={{ "--d": `${120 + index * 70}ms`, top: tool.top } as React.CSSProperties}
              className="absolute left-0 flex w-[22%] items-center gap-1.5 rounded-full border border-(--line) bg-(--surface) px-2 py-1.5 shadow-[0_10px_26px_rgba(8,15,30,0.07)] backdrop-blur-md sm:gap-2 sm:px-3 sm:py-2"
            >
              <tool.icon className="size-3 shrink-0 text-(--brand) sm:size-4" />
              <span className="truncate text-[0.55rem] font-medium text-foreground sm:text-[0.72rem]">
                {tool.label}
              </span>
            </div>
          ))}

          {/* ETL/ELT hub */}
          <div
            data-aegis-rise
            style={{ "--d": "80ms" } as React.CSSProperties}
            className="absolute left-1/2 top-1/2 z-10 flex w-[19%] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-[1.3rem] border border-(--line-strong) bg-(--surface-strong) px-2 py-2.5 text-center shadow-[0_20px_50px_rgba(8,15,30,0.12)] backdrop-blur-xl sm:gap-1.5 sm:py-4"
          >
            <span className="svc-hub-pulse flex size-6 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand-soft),transparent_70%)] sm:size-9">
              <Workflow className="size-3 text-(--brand) sm:size-4.5" />
            </span>
            <span className="font-mono text-[0.44rem] uppercase tracking-[0.16em] text-muted-foreground sm:text-[0.56rem]">
              ETL / ELT engine
            </span>
            <span className="hidden text-[0.62rem] leading-4 text-muted-foreground sm:block">
              Clean · map · reconcile
            </span>
          </div>

          {/* One dashboard */}
          <div
            data-aegis-rise
            style={{ "--d": "600ms" } as React.CSSProperties}
            className="absolute right-0 top-1/2 z-10 w-[24%] -translate-y-1/2 rounded-[1.3rem] border border-(--line-strong) bg-(--surface-strong) p-2 shadow-[0_20px_50px_rgba(8,15,30,0.12)] backdrop-blur-xl sm:p-3.5"
          >
            <div className="flex items-center gap-1.5">
              <ChartNoAxesCombined className="size-3 shrink-0 text-(--teal) sm:size-4" />
              <span className="truncate font-mono text-[0.44rem] uppercase tracking-[0.14em] text-muted-foreground sm:text-[0.56rem]">
                One dashboard
              </span>
            </div>
            <div className="mt-1.5 flex items-end gap-1 sm:mt-2.5 sm:gap-1.5">
              {[42, 68, 55, 82, 74].map((h, i) => (
                <span
                  key={h}
                  data-svc-bar
                  className="w-full rounded-t-[3px] bg-[linear-gradient(180deg,var(--brand),color-mix(in_oklch,var(--brand),white_25%))]"
                  style={
                    { height: `${h * 0.4}px`, "--d": `${900 + i * 90}ms` } as React.CSSProperties
                  }
                />
              ))}
            </div>
            <div className="mt-1.5 grid gap-1 sm:mt-2.5">
              {["Collections", "Attendance"].map((label) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-1 rounded-md bg-(--surface-muted) px-1.5 py-0.5 sm:px-2 sm:py-1"
                >
                  <span className="truncate text-[0.5rem] text-muted-foreground sm:text-[0.62rem]">
                    {label}
                  </span>
                  <span className="size-1 rounded-full bg-(--teal) sm:size-1.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Deployment footnote */}
          <div
            data-aegis-rise
            style={{ "--d": "1100ms" } as React.CSSProperties}
            className="absolute bottom-0 translate-x-1/2 whitespace-nowrap rounded-full border border-(--line) bg-(--surface) px-2.5 py-1 font-mono text-[0.42rem] uppercase tracking-[0.16em] text-muted-foreground sm:px-4 sm:py-2 sm:text-[0.56rem]"
          >
            Illustrative · each source scoped separately
          </div>
        </div>
      </div>
    </div>
  );
}
