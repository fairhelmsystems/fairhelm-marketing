// LEGAL: substantive changes to this document require legal sign-off.

import { Separator } from "@fairhelm/ui/components/separator";
import { EntityIdentity, LegalSection, LegalShell } from "@/components/legal/legal-shell";
import { PageSchema } from "@/components/site/page-schema";

const contents = [
  { label: "Company & Scope", href: "#company-scope" },
  { label: "Scope and Purpose", href: "#scope-purpose" },
  { label: "Permitted Use", href: "#permitted-use" },
  { label: "Prohibited Conduct", href: "#prohibited-conduct" },
  { label: "Security, Enforcement, and Reporting", href: "#security-enforcement" },
];

export default function AcceptableUsePage() {
  return (
    <>
      <PageSchema
        name="Acceptable Use Policy"
        description="What constitutes acceptable and prohibited use of SquareCampus, including automated access, security testing and competitor access restrictions."
        path="/squarecampus/acceptable-use"
      />
      <LegalShell
        title="Acceptable Use Policy"
        current="/acceptable-use/"
        contents={contents}
        description="SquareCampus exists to help institutions operate safely while keeping misuse or disruption out of the system."
      >
        <div className="space-y-10">
          <LegalSection title="1. Company & Scope" id="company-scope">
            <EntityIdentity documentNoun="this Policy" />
            <p>
              These guidelines apply to everyone who accesses SquareCampus, including institutions,
              staff, teachers, parents, and students.
            </p>
          </LegalSection>

          <LegalSection title="2. Scope and Purpose" id="scope-purpose">
            <p>
              The Service must be used for its intended academic and administrative purposes while
              respecting laws, institutional rules, and the rights of other users.
            </p>
            <p>
              We expect decisions made on the platform to be grounded in the academic mission of the
              institution, and we retain the right to remediate any behaviour that compromises the
              platform or the people it serves.
            </p>
          </LegalSection>

          <LegalSection title="3. Permitted Use" id="permitted-use">
            <p>Use SquareCampus to:</p>
            <ul className="list-disc pl-5">
              <li>
                Organise student information, attendance, grades, timetables, billing, and
                communications.
              </li>
              <li>
                Automate notifications, approvals, and workflows needed for day-to-day institutional
                operations.
              </li>
              <li>
                Keep account credentials secure, and share access only with authorised staff or
                students in accordance with institutional policies.
              </li>
              <li>Submit accurate data and cooperate with our support team if issues arise.</li>
            </ul>
          </LegalSection>

          {/* Expanded Section 4 */}
          <LegalSection title="4. Prohibited Conduct" id="prohibited-conduct">
            <p className="font-medium text-foreground">4.1 General Prohibitions</p>
            <p>You must not use the Service to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Store or share unlawful, obscene, defamatory, harassing, or infringing content.
              </li>
              <li>
                Reverse engineer, attack, overload, or otherwise interfere with the platform or its
                infrastructure.
              </li>
              <li>Circumvent security safeguards, access controls, or audit mechanisms.</li>
              <li>Share credentials with unauthorised third parties.</li>
              <li>Gain unauthorised access to another account or impersonate another user.</li>
              <li>
                Use the platform for mass spamming, scraping data without consent, or distributing
                malware.
              </li>
              <li>
                Host non-educational or unrelated products that compromise performance or violate
                the security of SquareCampus.
              </li>
              <li>
                Misuse AI features, including attempting to extract sensitive data, bypass
                safeguards, or automate decisions without institutional approval.
              </li>
            </ul>

            <div className="mt-8 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
              <p className="font-medium text-red-800 dark:text-red-200">
                4.2 Competitive Intelligence and Industrial Espionage
              </p>
              <p className="mt-3 text-sm">
                The following activities are strictly prohibited and constitute grounds for
                immediate termination and legal action:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                <li>
                  <strong>Accessing Service for Competitive Analysis:</strong> Using any account to
                  evaluate, benchmark, or analyse the Service for the purpose of developing,
                  improving, or marketing competing products or services.
                </li>
                <li>
                  <strong>Feature Documentation:</strong> Systematically documenting, cataloging, or
                  recording Service features, user interfaces, workflows, or functionality for
                  competitive purposes.
                </li>
                <li>
                  <strong>Price Intelligence:</strong> Accessing the Service to gather pricing
                  information, discount structures, or commercial terms for competitive advantage.
                </li>
                <li>
                  <strong>Technical Intelligence:</strong> Attempting to determine, reverse
                  engineer, or document the technical architecture, algorithms, data structures, or
                  implementation details of the Service.
                </li>
                <li>
                  <strong>User Experience Research:</strong> Conducting unauthorised user experience
                  research, usability testing, or interface analysis for competitive purposes.
                </li>
              </ul>
            </div>

            <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
              <p className="font-medium text-amber-800 dark:text-amber-200">
                4.3 Credential and Access Violations
              </p>
              <p className="mt-3 text-sm">
                The following credential-related activities are prohibited:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                <li>
                  <strong>Credential Sharing:</strong> Sharing login credentials, API keys, access
                  tokens, or any authentication mechanism with any person not explicitly authorised
                  by the Institution's administrator.
                </li>
                <li>
                  <strong>Credential Transfer:</strong> Transferring, selling, or providing
                  credentials to third parties, including but not limited to competitors,
                  consultants, or vendors without SquareCampus's prior written consent.
                </li>
                <li>
                  <strong>Multi-party Access:</strong> Allowing multiple individuals to access the
                  Service using a single set of credentials.
                </li>
                <li>
                  <strong>Credential Retention:</strong> Retaining access credentials after
                  termination of employment, contract, or authorisation.
                </li>
                <li>
                  <strong>Access Provision to Competitors:</strong> Providing any form of access,
                  direct or indirect, to individuals or entities that compete with SquareCampus or
                  are employed by, contracted to, or affiliated with competing entities.
                </li>
              </ul>
            </div>

            <p className="mt-6 font-medium text-foreground">4.4 Specific Prohibited Actions</p>
            <p>Without limiting the foregoing, the following specific actions are prohibited:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Taking screenshots, recordings, or other visual captures of the Service for
                distribution to competitors.
              </li>
              <li>
                Exporting data, reports, or any output from the Service for competitive analysis or
                to assist competing entities.
              </li>
              <li>
                Discussing, describing, or otherwise communicating Service features, pricing, or
                capabilities to competitors or their representatives.
              </li>
              <li>
                Participating in "demo sharing" arrangements where access is provided to parties
                outside the authorised Institution.
              </li>
              <li>
                Using anonymising technologies (VPNs, proxies, Tor) to obscure the identity or
                affiliation of users accessing the Service.
              </li>
            </ul>

            <p className="mt-6 font-medium text-foreground">4.5 Enforcement</p>
            <p>Violations of this Section 4 may result in:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Immediate suspension or termination of access without refund;</li>
              <li>Pursuit of civil remedies including injunctive relief and damages;</li>
              <li>Referral to law enforcement authorities where criminal conduct is suspected;</li>
              <li>
                Notification to industry associations and regulatory bodies where appropriate;
              </li>
              <li>Notifications to affected parties where legally required.</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              For detailed information on legal consequences and enforcement procedures, see our{" "}
              <a href="/squarecampus/competitor-notice/" className="text-foreground underline">
                Competitor Notice
              </a>{" "}
              and{" "}
              <a
                href="/squarecampus/terms-of-service/#competitor-access"
                className="text-foreground underline"
              >
                Terms of Service Section 19
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection title="5. Security, Enforcement, and Reporting" id="security-enforcement">
            <p>
              We may suspend or terminate access if we observe activities that threaten the Service,
              violate applicable laws, or place an undue burden on the platform. Institutions remain
              responsible for the conduct of their users.
            </p>
            <p>
              Please report suspected abuse to{" "}
              <a href="mailto:support@squarecampus.com" className="text-foreground">
                support@squarecampus.com
              </a>{" "}
              and security vulnerabilities to{" "}
              <a href="mailto:security@squarecampus.com" className="text-foreground">
                security@squarecampus.com
              </a>{" "}
              so we can act swiftly.
            </p>
            <p>
              We welcome good-faith security research and responsible disclosure. If you report a
              vulnerability responsibly and do not exploit it, we will not pursue action against
              you.
            </p>
          </LegalSection>
        </div>

        <Separator className="mt-10" />
        <p className="text-xs text-muted-foreground">
          This Acceptable Use Policy is part of the SquareCampus Terms of Service and does not
          replace any legal agreement between you and SquareCampus.
        </p>
      </LegalShell>
    </>
  );
}
