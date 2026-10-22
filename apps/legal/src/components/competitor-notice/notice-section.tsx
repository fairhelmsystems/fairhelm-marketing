"use client";

import { cn } from "@fairhelm/ui/lib/utils";
import { AlertTriangle, Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { type ReactNode, useState } from "react";

export type Severity = "critical" | "high" | "medium" | "info";

const severityConfig = {
  critical: {
    label: "CRITICAL",
    borderColor: "border-l-red-500",
    badgeBg: "bg-red-500/10",
    badgeText: "text-red-400",
    iconColor: "text-red-400",
  },
  high: {
    label: "HIGH",
    borderColor: "border-l-amber-500",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-400",
    iconColor: "text-amber-400",
  },
  medium: {
    label: "MEDIUM",
    borderColor: "border-l-blue-500",
    badgeBg: "bg-blue-500/10",
    badgeText: "text-blue-400",
    iconColor: "text-blue-400",
  },
  info: {
    label: "INFO",
    borderColor: "border-l-emerald-500",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-400",
    iconColor: "text-emerald-400",
  },
};

type NoticeSectionProps = {
  id: string;
  number: number;
  title: string;
  severity: Severity;
  children: ReactNode;
};

export function NoticeSection({ id, number, title, severity, children }: NoticeSectionProps) {
  const config = severityConfig[severity];

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 border-l-4 bg-neutral-900/30 py-8 pl-6 pr-4 sm:py-12 sm:pl-8 sm:pr-6",
        config.borderColor
      )}
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="font-mono text-sm font-semibold text-neutral-500">
          {number.toString().padStart(2, "0")}
        </span>
        <h2 className="text-xl font-semibold text-white sm:text-2xl md:text-3xl">{title}</h2>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
            config.badgeBg,
            config.badgeText
          )}
        >
          {config.label}
        </span>
      </div>
      <div className="prose prose-sm prose-invert max-w-none">{children}</div>
    </section>
  );
}

type WarningBoxProps = {
  title?: string;
  children: ReactNode;
  severity?: "critical" | "warning";
};

export function WarningBox({
  title = "Critical Warning",
  children,
  severity = "critical",
}: WarningBoxProps) {
  const isCritical = severity === "critical";

  return (
    <div
      className={cn(
        "my-6 rounded-lg border-l-4 p-4 sm:p-6",
        isCritical ? "border-l-red-500 bg-red-950/30" : "border-l-amber-500 bg-amber-950/30"
      )}
    >
      <div className="flex gap-3">
        <AlertTriangle
          className={cn(
            "mt-0.5 h-5 w-5 flex-shrink-0",
            isCritical ? "text-red-400" : "text-amber-400"
          )}
          aria-hidden="true"
        />
        <div>
          <h4
            className={cn(
              "mb-2 text-base font-semibold",
              isCritical ? "text-red-300" : "text-amber-300"
            )}
          >
            {title}
          </h4>
          <div
            className={cn(
              "text-sm leading-relaxed",
              isCritical ? "text-red-200/90" : "text-amber-200/90"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

type InfoBoxProps = {
  children: ReactNode;
  variant?: "teal" | "blue" | "green";
};

export function InfoBox({ children, variant = "teal" }: InfoBoxProps) {
  const colors = {
    teal: "border-teal-500/30 bg-teal-950/30 text-teal-200",
    blue: "border-blue-500/30 bg-blue-950/30 text-blue-200",
    green: "border-emerald-500/30 bg-emerald-950/30 text-emerald-200",
  };

  return (
    <div className={cn("my-6 rounded-lg border p-4 sm:p-6", colors[variant])}>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

type ExampleBoxProps = {
  children: ReactNode;
  type: "violation" | "proper";
};

export function ExampleBox({ children, type }: ExampleBoxProps) {
  const isViolation = type === "violation";

  return (
    <div
      className={cn(
        "my-3 flex items-start gap-2 rounded-lg border p-3 sm:p-4",
        isViolation ? "border-red-500/20 bg-red-950/20" : "border-emerald-500/20 bg-emerald-950/20"
      )}
    >
      {isViolation ? (
        <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" aria-hidden="true" />
      ) : (
        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" aria-hidden="true" />
      )}
      <div className={cn("text-sm", isViolation ? "text-red-200/90" : "text-emerald-200/90")}>
        {children}
      </div>
    </div>
  );
}

type ExpandableSectionProps = {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
};

export function ExpandableSection({
  title,
  children,
  defaultExpanded = false,
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="my-4 rounded-lg border border-neutral-800 bg-neutral-900/50">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left"
        aria-expanded={isExpanded}
      >
        <span className="font-semibold text-white">{title}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-neutral-400" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 text-neutral-400" aria-hidden="true" />
        )}
      </button>
      {isExpanded && <div className="border-t border-neutral-800 p-4">{children}</div>}
    </div>
  );
}

type BulletListProps = {
  items: string[];
  type?: "check" | "x" | "default";
};

export function BulletList({ items, type = "default" }: BulletListProps) {
  return (
    <ul className="my-4 space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2 text-neutral-300">
          {type === "check" && (
            <Check className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-400" aria-hidden="true" />
          )}
          {type === "x" && (
            <X className="mt-1 h-4 w-4 flex-shrink-0 text-red-400" aria-hidden="true" />
          )}
          {type === "default" && (
            <span
              className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-500"
              aria-hidden="true"
            />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

type DataTableProps = {
  headers: string[];
  rows: string[][];
};

export function DataTable({ headers, rows }: DataTableProps) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-700 bg-neutral-800/50">
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-3 text-left font-semibold text-neutral-200">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-neutral-800 hover:bg-neutral-800/30">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 text-neutral-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Paragraph({ children }: { children: ReactNode }) {
  return <p className="my-4 text-sm leading-relaxed text-neutral-300 sm:text-base">{children}</p>;
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-white">{children}</strong>;
}

export function SubHeading({ children }: { children: ReactNode }) {
  return <h3 className="mb-3 mt-8 text-lg font-semibold text-white sm:text-xl">{children}</h3>;
}
