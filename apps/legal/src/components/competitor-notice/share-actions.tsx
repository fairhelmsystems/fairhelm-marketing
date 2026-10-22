"use client";

import { cn } from "@fairhelm/ui/lib/utils";
import { ArrowUpRight, Check, FileText, Mail } from "lucide-react";
import { useState } from "react";

// Custom icons for print and copy
const PrinterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" />
    <rect x="6" y="14" width="12" height="8" rx="1" />
  </svg>
);

const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

export function ShareActions() {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEmailCounsel = () => {
    const subject = encodeURIComponent("SquareCampus Competitor Notice - Legal Review Required");
    const body = encodeURIComponent(
      `Please review the following legal notice from SquareCampus regarding competitor access policies:\n\n${window.location.href}\n\nDocument ID: COMP-NOTICE-2026-001\nEffective Date: January 22, 2026`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const generateCitation = () => {
    const citation = `Fairhelm Systems (OPC) Private Limited. "Notice to Competitors: Unauthorized Access and Misuse Are Prohibited." SquareCampus, Document ID: COMP-NOTICE-2026-001, Version 1.1, January 22, 2026. ${window.location.href}`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const actions = [
    {
      id: "print",
      label: "Print Page",
      icon: PrinterIcon,
      onClick: handlePrint,
    },
    {
      id: "copy",
      label: copied ? "Copied!" : "Copy Link",
      icon: copied ? Check : CopyIcon,
      onClick: handleCopyLink,
    },
    {
      id: "email",
      label: "Email to Counsel",
      icon: Mail,
      onClick: handleEmailCounsel,
    },
    {
      id: "cite",
      label: "Generate Citation",
      icon: FileText,
      onClick: generateCitation,
    },
  ];

  return (
    <div className="border-b border-neutral-800 bg-neutral-900/50 py-4 print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Share this notice</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  type="button"
                  key={action.id}
                  onClick={action.onClick}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-3 py-2",
                    "text-xs font-medium text-neutral-300",
                    "border border-neutral-700 bg-neutral-800/50",
                    "transition hover:border-neutral-600 hover:bg-neutral-800 hover:text-white",
                    "focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-neutral-900",
                    action.id === "copy" && copied && "border-emerald-500/50 text-emerald-400"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
