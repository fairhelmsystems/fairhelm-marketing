"use client";

import { cn } from "@fairhelm/ui/lib/utils";
import { Clock, FileText, Globe, Shield } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const documentMetadata = {
  documentId: "COMP-NOTICE-2026-001",
  version: "1.1",
  effectiveDate: "January 22, 2026",
  lastUpdated: "January 22, 2026",
  nextReview: "January 22, 2027",
  jurisdiction: "India (Karnataka for courts where applicable)",
  governingLaw:
    "Information Technology Act, 2000; Digital Personal Data Protection Act, 2023; applicable IP statutes; and the penal code in force (IPC 1860/BNS 2023).",
  legalEntity: "Fairhelm Systems (OPC) Private Limited",
};

const relatedDocuments = [
  { title: "Terms of Service", href: "/squarecampus/terms-of-service" },
  { title: "Privacy Policy", href: "/squarecampus/privacy-policy" },
  { title: "Acceptable Use Policy", href: "/squarecampus/acceptable-use" },
  { title: "Data Processing Addendum", href: "/squarecampus/data-processing-addendum" },
  { title: "Security Posture", href: "https://squarecampus.com/security/" },
];

const contactInfo = [
  { label: "Legitimate Evaluation", email: "sales@squarecampus.com" },
  { label: "Legal Matters", email: "legal@squarecampus.com" },
  { label: "Security Incidents", email: "security@squarecampus.com" },
  { label: "Whistleblower Reports", email: "whistleblower@squarecampus.com" },
  { label: "General Support", email: "support@squarecampus.com" },
];

export function EvidenceFooter() {
  const [timestamp, setTimestamp] = useState<string>("");

  useEffect(() => {
    setTimestamp(new Date().toISOString());
  }, []);

  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 py-12 sm:py-16 print:bg-white print:text-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Document Authentication */}
        <div className="mb-12 border-b border-neutral-800 pb-12">
          <h2 className="mb-8 flex items-center gap-3 text-lg font-semibold text-white">
            <Shield className="h-5 w-5 text-neutral-400" aria-hidden="true" />
            Document Authentication
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                Document ID
              </div>
              <p className="font-mono text-sm text-white">{documentMetadata.documentId}</p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                Version
              </div>
              <p className="text-sm text-white">{documentMetadata.version}</p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                Effective Date
              </div>
              <p className="text-sm text-white">{documentMetadata.effectiveDate}</p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                Jurisdiction
              </div>
              <p className="text-sm text-white">{documentMetadata.jurisdiction}</p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
              Relevant Indian Law (Non-Exhaustive)
            </div>
            <p className="text-sm text-neutral-300">{documentMetadata.governingLaw}</p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
                Legal Entity
              </div>
              <p className="text-sm text-white">{documentMetadata.legalEntity}</p>
              <p className="mt-1 text-xs text-neutral-500">Trading as SquareCampus</p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
                Access Timestamp
              </div>
              <p className="font-mono text-xs text-neutral-300">{timestamp || "Loading..."}</p>
              <p className="mt-1 text-xs text-neutral-500 print:hidden">
                (Auto-populated on print)
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-12 border-b border-neutral-800 pb-12">
          <h2 className="mb-6 text-lg font-semibold text-white">Contact Information</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contactInfo.map((contact) => (
              <div
                key={contact.email}
                className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4"
              >
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                  {contact.label}
                </p>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-sm text-teal-400 hover:text-teal-300 hover:underline"
                >
                  {contact.email}
                </a>
              </div>
            ))}
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                Website
              </p>
              <a
                href="https://squarecampus.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-teal-400 hover:text-teal-300 hover:underline"
              >
                https://squarecampus.com
              </a>
            </div>
          </div>
        </div>

        {/* Related Documents */}
        <div className="mb-12 border-b border-neutral-800 pb-12">
          <h2 className="mb-6 text-lg font-semibold text-white">Related Legal Documents</h2>
          <div className="flex flex-wrap gap-3">
            {relatedDocuments.map((doc) => (
              <Link
                key={doc.href}
                href={doc.href}
                className={cn(
                  "rounded-full border border-neutral-700 px-4 py-2 text-sm text-neutral-300",
                  "transition hover:border-neutral-500 hover:text-white"
                )}
              >
                {doc.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Legal Disclaimers */}
        <div className="space-y-4 text-xs text-neutral-500">
          <div>
            <strong className="text-neutral-400">Public Notice:</strong> This page is intended to
            provide actual notice to competitors and their agents. It does not create a contract or
            grant any rights without explicit written agreement.
          </div>
          <div>
            <strong className="text-neutral-400">Reservation of Rights:</strong> Fairhelm Systems
            OPC expressly reserves all legal and equitable rights and remedies. No delay or omission
            is a waiver.
          </div>
          <div>
            <strong className="text-neutral-400">No Legal Advice:</strong> This notice does not
            constitute legal advice. Consult qualified legal counsel regarding your specific
            situation.
          </div>
          <div>
            <strong className="text-neutral-400">Jurisdiction:</strong> This notice is governed by
            Indian law. Subject to mandatory requirements, courts in Bengaluru, Karnataka, India
            have jurisdiction.
          </div>
          <div>
            <strong className="text-neutral-400">Amendments:</strong> Fairhelm Systems (OPC) Private
            Limited may update this notice without prior notification. Check the &quot;Last
            Updated&quot; date for current version.
          </div>
          <div>
            <strong className="text-neutral-400">Severability:</strong> If any provision is deemed
            unenforceable, remaining provisions remain in full force and effect.
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-neutral-800 pt-8 text-center">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} Fairhelm Systems (OPC) Private Limited. All rights
            reserved.
          </p>
          <p className="mt-1 text-xs text-neutral-600">
            SquareCampus™ is a trademark (registration pending) of Fairhelm Systems (OPC) Private
            Limited.
          </p>
          <p className="mt-2 text-xs text-neutral-600">
            This notice may be distributed freely to inform competitors of legal obligations.
          </p>
          <p className="mt-1 text-xs text-neutral-600">
            Last updated: {documentMetadata.lastUpdated}
          </p>
        </div>
      </div>
    </footer>
  );
}
