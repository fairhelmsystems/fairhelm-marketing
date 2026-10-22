"use client";

import { cn } from "@fairhelm/ui/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export type TocSection = {
  id: string;
  number: number;
  title: string;
  severity: "critical" | "high" | "medium" | "info";
};

export const tocSections: TocSection[] = [
  {
    id: "notice-purpose",
    number: 1,
    title: "Purpose and Scope of Notice",
    severity: "critical",
  },
  {
    id: "prohibited-conduct",
    number: 2,
    title: "Prohibited Conduct",
    severity: "critical",
  },
  {
    id: "permitted-conduct",
    number: 3,
    title: "Permitted Competitive Conduct",
    severity: "info",
  },
  {
    id: "legal-basis",
    number: 4,
    title: "Legal Basis (India)",
    severity: "critical",
  },
  {
    id: "potential-remedies",
    number: 5,
    title: "Potential Remedies",
    severity: "high",
  },
  {
    id: "criminal-exposure",
    number: 6,
    title: "Criminal Law Exposure",
    severity: "critical",
  },
  {
    id: "regulatory-notifications",
    number: 7,
    title: "Regulatory and Industry Notifications",
    severity: "high",
  },
  {
    id: "evidence-preservation",
    number: 8,
    title: "Evidence Preservation and Monitoring",
    severity: "info",
  },
  {
    id: "individual-responsibility",
    number: 9,
    title: "Individual Responsibility",
    severity: "high",
  },
  {
    id: "proper-evaluation",
    number: 10,
    title: "Proper Evaluation Channels",
    severity: "info",
  },
  {
    id: "voluntary-disclosure",
    number: 11,
    title: "Voluntary Disclosure and Mitigation",
    severity: "high",
  },
  {
    id: "confidential-reporting",
    number: 12,
    title: "Confidential Reporting",
    severity: "info",
  },
  {
    id: "no-waiver",
    number: 13,
    title: "No Waiver; Reservation of Rights",
    severity: "info",
  },
  {
    id: "governing-law",
    number: 14,
    title: "Governing Law and Jurisdiction",
    severity: "info",
  },
  {
    id: "no-legal-advice",
    number: 15,
    title: "Informational Notice; No Legal Advice",
    severity: "info",
  },
];

const severityColors = {
  critical: "bg-red-500",
  high: "bg-amber-500",
  medium: "bg-blue-500",
  info: "bg-emerald-500",
};

export function TableOfContents() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = tocSections.map((section) => document.getElementById(section.id));

      // Find active section
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(tocSections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
    setIsExpanded(false);
  };

  return (
    <>
      {/* Mobile Toggle Bar - Fixed at top on mobile/tablet */}
      <div className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-sm xl:hidden print:hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "flex w-full items-center justify-between py-4",
              "text-sm font-medium text-neutral-300"
            )}
            aria-expanded={isExpanded}
          >
            <span className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Contents
              </span>
              {activeSection && (
                <>
                  <span className="text-neutral-600">|</span>
                  <span className="text-white">
                    {tocSections.find((s) => s.id === activeSection)?.number}.{" "}
                    {tocSections.find((s) => s.id === activeSection)?.title}
                  </span>
                </>
              )}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          {/* Mobile Expanded Menu */}
          {isExpanded && (
            <div className="border-t border-neutral-800 py-4">
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {tocSections.map((section) => (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition",
                        activeSection === section.id
                          ? "bg-neutral-800 text-white"
                          : "text-neutral-400 hover:bg-neutral-800/50 hover:text-white"
                      )}
                    >
                      <span
                        className={cn(
                          "h-2 w-2 shrink-0 rounded-full",
                          severityColors[section.severity]
                        )}
                        aria-hidden="true"
                      />
                      <span className="font-mono text-xs text-neutral-500">
                        {section.number.toString().padStart(2, "0")}
                      </span>
                      <span className="truncate">{section.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Sidebar TOC for desktop - renders on the right side
export function TableOfContentsSidebar() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = tocSections.map((section) => document.getElementById(section.id));

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(tocSections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav aria-label="Table of contents" className="sticky top-8 hidden xl:block print:hidden">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">
          On this page
        </p>
        <ul className="space-y-1">
          {tocSections.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "group flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition",
                  activeSection === section.id
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:bg-neutral-800/50 hover:text-white"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full transition-transform group-hover:scale-125",
                    severityColors[section.severity]
                  )}
                  aria-hidden="true"
                />
                <span className="font-mono text-[10px] text-neutral-500">
                  {section.number.toString().padStart(2, "0")}
                </span>
                <span className="truncate text-xs">{section.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
