"use client";

import { cn } from "@fairhelm/ui/lib/utils";
import { AlertTriangle, Mail, Shield } from "lucide-react";

const ctaCards = [
  {
    id: "report-violation",
    icon: AlertTriangle,
    title: "Report a Violation",
    description: "Report suspected unauthorized access, credential solicitation, or misuse.",
    email: "security@squarecampus.com",
    buttonText: "Report Violation",
    variant: "danger" as const,
  },
  {
    id: "legal-inquiries",
    icon: Mail,
    title: "Legal Inquiries",
    description: "For authorized evaluation or legal questions regarding this notice.",
    email: "legal@squarecampus.com",
    buttonText: "Contact Legal",
    variant: "default" as const,
  },
  {
    id: "whistleblower",
    icon: Shield,
    title: "Confidential Reporting",
    description:
      "Confidentially report misconduct. Rewards may be offered at our discretion and subject to law.",
    email: "whistleblower@squarecampus.com",
    buttonText: "Report Anonymously",
    variant: "success" as const,
  },
];

const variantStyles = {
  danger: {
    card: "border-red-500/30 bg-gradient-to-br from-red-950/40 to-neutral-900/60",
    icon: "bg-red-500/20 text-red-400",
    button: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50",
  },
  default: {
    card: "border-neutral-700 bg-neutral-900/60",
    icon: "bg-neutral-700 text-neutral-300",
    button: "bg-neutral-700 text-white hover:bg-neutral-600 focus:ring-neutral-500/50",
  },
  success: {
    card: "border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-neutral-900/60",
    icon: "bg-emerald-500/20 text-emerald-400",
    button: "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500/50",
  },
};

export function ReportingCTA() {
  return (
    <section className="bg-neutral-950 py-16 sm:py-24 print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Take Action</h2>
          <p className="mt-3 text-neutral-400">
            Help us maintain fair competition and protect SquareCampus
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ctaCards.map((card) => {
            const styles = variantStyles[card.variant];
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                className={cn("rounded-2xl border p-6 sm:p-8", "flex flex-col", styles.card)}
              >
                <div
                  className={cn(
                    "mb-4 flex h-12 w-12 items-center justify-center rounded-full",
                    styles.icon
                  )}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>

                <h3 className="mb-2 text-lg font-semibold text-white">{card.title}</h3>
                <p className="mb-6 flex-grow text-sm text-neutral-400">{card.description}</p>

                <div className="space-y-3">
                  <p className="text-xs text-neutral-500">Contact:</p>
                  <a
                    href={`mailto:${card.email}`}
                    className="block text-sm font-medium text-teal-400 hover:text-teal-300"
                  >
                    {card.email}
                  </a>
                  <a
                    href={`mailto:${card.email}`}
                    className={cn(
                      "mt-4 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5",
                      "text-sm font-semibold transition",
                      "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900",
                      styles.button
                    )}
                  >
                    {card.buttonText}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 text-center">
          <p className="text-sm text-neutral-400">
            <strong className="text-neutral-300">PGP Encryption Available:</strong> For secure
            communication, our PGP public key is available at{" "}
            <span className="font-mono text-teal-400">squarecampus.com/pgp</span>
          </p>
        </div>
      </div>
    </section>
  );
}
