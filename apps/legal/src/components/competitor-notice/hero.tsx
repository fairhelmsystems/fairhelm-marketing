"use client";

import { cn } from "@fairhelm/ui/lib/utils";
import { AlertTriangle, Clock, FileText, Shield } from "lucide-react";

const documentMeta = {
  effectiveDate: "January 22, 2026",
  version: "1.1",
  documentId: "COMP-NOTICE-2026-001",
  jurisdiction: "India (Karnataka for courts where applicable)",
  governingLaw:
    "Indian law, including the Information Technology Act, 2000 and other applicable statutes",
};

const quickConsequences = [
  { label: "Civil Remedies", value: "Injunctions + Compensation" },
  { label: "Criminal Complaints", value: "Where Applicable" },
  { label: "Regulatory Notices", value: "If Required by Law" },
  { label: "Customer Protection", value: "Security Notifications" },
];

export function Hero() {
  return (
    <section className="relative bg-neutral-950 pt-8 pb-16 sm:pt-12 sm:pb-24">
      {/* Warning Banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full",
              "border border-red-500/30 bg-red-950/50 px-4 py-2",
              "text-xs font-semibold uppercase tracking-widest text-red-400"
            )}
          >
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            <span>Legal Notice to Competitors</span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                Notice to Competitors:{" "}
                <span className="text-red-400">Unauthorized Access and Misuse Are Prohibited</span>
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg">
                Fairhelm Systems (OPC) Private Limited (trading as SquareCampus) issues this public
                legal notice to competitors and their agents. Any unauthorized access, credential
                solicitation, misuse of non-public information, or circumvention of access controls
                is prohibited. We reserve the right to pursue civil, criminal, and regulatory
                remedies as permitted by Indian law.
              </p>
            </div>

            {/* Document Metadata */}
            <div
              className={cn(
                "rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 sm:p-6",
                "grid grid-cols-2 gap-4 text-xs sm:text-sm"
              )}
            >
              <div className="flex items-start gap-3">
                <Clock
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-500"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-medium text-neutral-400">Effective Date</p>
                  <p className="text-white">{documentMeta.effectiveDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-500"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-medium text-neutral-400">Document ID</p>
                  <p className="font-mono text-white">{documentMeta.documentId}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-500"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-medium text-neutral-400">Jurisdiction</p>
                  <p className="text-white">{documentMeta.jurisdiction}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-500"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-medium text-neutral-400">Version</p>
                  <p className="text-white">{documentMeta.version}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Consequences Summary */}
          <div className="lg:pl-8">
            <div
              className={cn(
                "rounded-2xl border-2 border-red-500/20 bg-gradient-to-br from-red-950/40 to-neutral-900/60 p-6 sm:p-8",
                "shadow-[0_0_60px_rgba(239,68,68,0.1)]"
              )}
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
                  <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Violation Consequences</h2>
                  <p className="text-xs text-neutral-400">
                    Actions may include civil, criminal, and regulatory routes
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {quickConsequences.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-red-500/10 bg-red-950/30 p-4"
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-red-400/80">
                      {item.label}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-950/20 p-4">
                <p className="text-xs leading-relaxed text-amber-200/90">
                  <strong className="text-amber-300">Warning:</strong> Unauthorized access or misuse
                  may lead to legal action. Access and security events are logged in the ordinary
                  course of business for protection and compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
