"use client";

import { Check, Copy, Download, Key, Lock, Mail, Shield } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { createBreadcrumbSchema, createWebPageSchema, SEO_CONFIG } from "@/lib/seo";
import { cn } from "@fairhelm/ui/lib/utils";

const pgpKeyData = {
  email: "security@squarecampus.com",
  keyId: "0x61C5208E",
  fingerprint: "5258 EF81 53BA A48E 9C97  A545 6B78 F402 61C5 208E",
  created: "2026-01-17",
  expires: "2028-01-17",
  algorithm: "RSA 4096-bit",
  downloadUrl: "/squarecampus-security.asc",
  publicKey: `-----BEGIN PGP PUBLIC KEY BLOCK-----

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
w6YBetF5h8rgimZ+rZUg6RVJKA==
=G5SA
-----END PGP PUBLIC KEY BLOCK-----`,
};

const useCases = [
  {
    icon: Shield,
    title: "Security vulnerability reports",
    body: "Report security issues privately and securely. We take responsible disclosure seriously.",
  },
  {
    icon: Lock,
    title: "Sensitive communications",
    body: "Share confidential information that requires end-to-end encryption.",
  },
  {
    icon: Mail,
    title: "Verify our messages",
    body: "Confirm that emails claiming to be from the SquareCampus security team are authentic.",
  },
] as const;

const verificationSteps = [
  {
    title: "Download the key",
    description: "Download the .asc file or copy the public key block below.",
    code: `curl -O https://squarecampus.com${pgpKeyData.downloadUrl}`,
  },
  {
    title: "Import into your keyring",
    code: "gpg --import squarecampus-security.asc",
  },
  {
    title: "Verify the fingerprint",
    description: `Ensure it matches: ${pgpKeyData.fingerprint}`,
  },
  {
    title: "Encrypt your message",
    code: `gpg --encrypt --armor -r ${pgpKeyData.email} message.txt`,
  },
] as const;

const securityNotes = [
  "Always verify the fingerprint through a separate channel before trusting this key.",
  "We will never ask for passwords, tokens, or sensitive credentials via email.",
  "For security vulnerabilities, email security@squarecampus.com with your encrypted report.",
  "This key is rotated periodically. Check this page for the latest version.",
] as const;

function getTruncatedKey(fullKey: string): string {
  const lines = fullKey.split("\n");
  const headerLine = lines[0];
  const footerLine = lines[lines.length - 1];
  const keyLines = lines.slice(1, -1).filter((l) => l.trim());

  if (keyLines.length <= 8) return fullKey;

  return [
    headerLine,
    "",
    ...keyLines.slice(0, 3),
    `... (${keyLines.length - 6} more lines) ...`,
    ...keyLines.slice(-3),
    "",
    footerLine,
  ].join("\n");
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    createWebPageSchema({
      name: "PGP Public Key | SquareCampus",
      description:
        "SquareCampus PGP public key for secure communications, vulnerability reports, and message verification.",
      url: `${SEO_CONFIG.baseUrl}/pgp`,
    }),
    createBreadcrumbSchema([
      { name: "Home", url: SEO_CONFIG.baseUrl },
      { name: "Security", url: `${SEO_CONFIG.baseUrl}/security` },
      { name: "PGP Key", url: `${SEO_CONFIG.baseUrl}/pgp` },
    ]),
  ],
};

export default function PGPPage() {
  const [copied, setCopied] = useState(false);
  const [showFullKey, setShowFullKey] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pgpKeyData.publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <main tabIndex={-1} id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <SectionShell className="pt-12 sm:pt-16">
        <Reveal className="max-w-3xl space-y-6">
          <p className="section-kicker inline-flex items-center gap-2">
            <Key className="size-3.5" />
            Secure communication
          </p>
          <h1 className="font-display text-4xl leading-none tracking-[-0.06em] sm:text-5xl lg:text-6xl">
            PGP public key.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            Use this key to send encrypted messages to our security team or verify communications
            from SquareCampus.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2 lg:grid-cols-4">
            {[
              ["Email", pgpKeyData.email],
              ["Algorithm", pgpKeyData.algorithm],
              ["Created", pgpKeyData.created],
              ["Expires", pgpKeyData.expires],
            ].map(([label, value]) => (
              <div key={label} className="surface-panel overflow-hidden rounded-[1.2rem] p-4">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
                  {label}
                </p>
                <p className="mt-2 truncate font-mono text-sm text-foreground" title={value}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell className="pt-0">
        <Reveal className="surface-panel-strong rounded-[1.8rem] p-6 lg:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[linear-gradient(135deg,var(--brand-soft),transparent_70%)] p-2.5">
              <Shield className="size-4 text-(--brand)" />
            </div>
            <div>
              <h2 className="font-display text-xl tracking-[-0.03em]">Key fingerprint</h2>
              <p className="text-xs text-muted-foreground">Always verify before trusting</p>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto rounded-[1.2rem] border border-(--line) bg-(--surface) p-4">
            <code className="whitespace-nowrap font-mono text-sm text-(--brand)">
              {pgpKeyData.fingerprint}
            </code>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Key ID: <span className="font-mono">{pgpKeyData.keyId}</span>
          </p>
        </Reveal>
      </SectionShell>

      <SectionShell eyebrow="When to use this key" className="pt-0">
        <Reveal staggerChildren className="grid gap-4 sm:grid-cols-3">
          {useCases.map((useCase) => (
            <article
              key={useCase.title}
              data-reveal-item
              className="surface-panel rounded-[1.6rem] p-6"
            >
              <useCase.icon className="size-5 text-(--brand)" />
              <h2 className="mt-5 font-display text-xl tracking-[-0.03em]">{useCase.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{useCase.body}</p>
            </article>
          ))}
        </Reveal>
      </SectionShell>

      <SectionShell eyebrow="Public key" className="pt-0">
        <Reveal>
          <div className="mb-4 flex flex-wrap gap-2">
            <a
              href={pgpKeyData.downloadUrl}
              download="squarecampus-security.asc"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              <Download className="size-4" />
              Download .asc
            </a>
            <button
              type="button"
              onClick={copyToClipboard}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors",
                copied
                  ? "border-transparent bg-(--brand-soft) text-foreground"
                  : "border-(--line) bg-(--surface) text-muted-foreground hover:text-foreground"
              )}
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied!" : "Copy key"}
            </button>
          </div>
          <div className="surface-panel overflow-hidden rounded-[1.6rem]">
            <pre className="overflow-x-auto p-6 font-mono text-xs leading-relaxed text-muted-foreground">
              {showFullKey ? pgpKeyData.publicKey : getTruncatedKey(pgpKeyData.publicKey)}
            </pre>
            <div className="border-t border-(--line) px-6 py-3">
              <button
                type="button"
                onClick={() => setShowFullKey(!showFullKey)}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {showFullKey ? "Show less" : "Show full key"}
              </button>
            </div>
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell eyebrow="How to use" className="pt-0">
        <Reveal staggerChildren className="grid gap-3">
          {verificationSteps.map((step, index) => (
            <article
              key={step.title}
              data-reveal-item
              className="surface-panel rounded-[1.4rem] p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-xs text-background">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg tracking-[-0.02em]">{step.title}</h3>
                  {"description" in step && step.description ? (
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                  ) : null}
                  {"code" in step && step.code ? (
                    <code className="mt-3 block overflow-x-auto whitespace-nowrap rounded-[1rem] border border-(--line) bg-(--surface-strong) px-4 py-3 font-mono text-xs text-(--brand)">
                      {step.code}
                    </code>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </Reveal>
      </SectionShell>

      <SectionShell className="pb-22 pt-0">
        <Reveal className="surface-panel-strong rounded-[1.8rem] p-6 lg:p-8">
          <h3 className="font-display text-xl tracking-[-0.03em]">Important security notes</h3>
          <ul className="mt-4 grid gap-3">
            {securityNotes.map((note) => (
              <li
                key={note}
                className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-(--amber)" />
                {note}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/security" label="Security overview" variant="secondary" />
            <ButtonLink href="/infrastructure" label="Infrastructure" variant="secondary" />
            <ButtonLink href="mailto:security@squarecampus.com" label="Contact security team" />
          </div>
        </Reveal>
      </SectionShell>
    </main>
  );
}
