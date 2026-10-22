// LEGAL: substantive changes to this document require legal sign-off.

import { Separator } from "@fairhelm/ui/components/separator";
import { EntityIdentity, LegalSection, LegalShell } from "@/components/legal/legal-shell";
import { PageSchema } from "@/components/site/page-schema";

const contents = [
  { label: "Company & Contracting Entity", href: "#company-entity" },
  { label: "Description of the Service", href: "#service-description" },
  { label: "Account Registration and Security", href: "#account-security" },
  { label: "License and Permitted Use", href: "#license" },
  { label: "Subscription, Fees, and Billing", href: "#billing" },
  { label: "Data Ownership and Rights", href: "#data-ownership" },
  { label: "Privacy and Data Protection", href: "#privacy-data" },
  { label: "Security & Data Protection Reference", href: "#security-reference" },
  { label: "Service Availability and Maintenance", href: "#availability" },
  { label: "Prohibited Conduct", href: "#prohibited-conduct" },
  { label: "Term, Suspension, and Termination", href: "#termination" },
  { label: "Intellectual Property", href: "#intellectual-property" },
  { label: "Disclaimers", href: "#disclaimers" },
  { label: "Limitation of Liability", href: "#liability" },
  { label: "Changes to the Terms", href: "#changes" },
  { label: "Governing Law and Jurisdiction", href: "#governing-law" },
  { label: "Indemnification", href: "#indemnification" },
  { label: "Security Incident Response", href: "#security-incident" },
  { label: "Competitor Access Prohibition", href: "#competitor-access" },
  { label: "Contact Information", href: "#contact" },
];

export default function TermsOfServicePage() {
  return (
    <>
      <PageSchema
        name="Terms of Service"
        description="The terms governing use of SquareCampus by institutions, including account security, competitor access restrictions and the order form that governs commercial terms."
        path="/squarecampus/terms-of-service"
      />
      <LegalShell
        title="Terms of Service"
        current="/terms-of-service/"
        contents={contents}
        description="The rules, rights, and responsibilities that govern your access to SquareCampus."
      >
        <div className="space-y-10">
          <LegalSection title="1. Company & Contracting Entity" id="company-entity">
            <EntityIdentity documentNoun="these Terms" />
            <p>
              These Terms form a binding agreement between Fairhelm Systems (OPC) Private Limited
              and the Institution or individual User accessing the Service. If you are accepting
              these Terms on behalf of an Institution, you confirm that you have the authority to
              bind that Institution.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                The Institution is the entity subscribing to SquareCampus ("Institution"); and
              </li>
              <li>
                Individuals who access the Service under that Institution's account are considered
                "Users."
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="2. Description of the Service" id="service-description">
            <p>
              SquareCampus is a SaaS platform for schools, colleges, and other educational
              institutions to manage admissions, attendance, grades, examinations, fees,
              communication, and related academic workflows.
            </p>
            <p>
              We may evolve, update, or retire features from time to time to keep the Service modern
              and secure.
            </p>
          </LegalSection>

          {/* Enhanced Section 3 */}
          <LegalSection title="3. Account Registration and Security" id="account-security">
            <p className="font-medium text-foreground">3.1 General Requirements</p>
            <p>Institutions and Users agree to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Provide accurate and complete registration information;</li>
              <li>
                Keep login credentials confidential and not share them beyond authorised personnel;
              </li>
              <li>
                Ensure only authorised staff, teachers, and students have access to their designated
                accounts;
              </li>
              <li>
                Promptly notify SquareCampus of unauthorised access, misuse, or security incidents.
              </li>
            </ul>

            <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
              <p className="font-medium text-red-800 dark:text-red-200">
                3.2 Credential Sharing Prohibition
              </p>
              <p className="mt-2 text-sm">
                Institutions and Users expressly agree that login credentials, API keys, access
                tokens, and any other authentication mechanisms are strictly confidential and may
                not be shared with:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                <li>
                  Any individual or entity outside the Institution's authorised personnel roster;
                </li>
                <li>Competitors, as defined in Section 19 of these Terms;</li>
                <li>
                  Third-party consultants, vendors, or service providers without SquareCampus's
                  prior written consent;
                </li>
                <li>
                  Any person or entity for purposes of competitive intelligence, reverse
                  engineering, or product evaluation.
                </li>
              </ul>
            </div>

            <p className="mt-6 font-medium text-foreground">3.3 Liability for Credential Misuse</p>
            <p>
              The Institution shall be fully liable for any and all activities conducted through
              credentials issued to the Institution, regardless of whether such activities were
              authorised. This includes, without limitation:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Data access, export, or manipulation;</li>
              <li>Feature usage and API calls;</li>
              <li>System configuration changes;</li>
              <li>Any violations of these Terms committed using Institution credentials.</li>
            </ul>

            <p className="mt-6 font-medium text-foreground">3.4 Audit Rights</p>
            <p>
              SquareCampus reserves the right to audit credential usage patterns and may require
              Institutions to provide documentation regarding credential distribution and access
              controls upon reasonable notice. Failure to comply with audit requests may result in
              immediate suspension of service.
            </p>

            <p className="mt-4 text-sm text-muted-foreground">
              Institutions are responsible for all activity within their organisation account.
              Violations of this Section may result in immediate termination and legal action as
              described in Section 19.
            </p>
          </LegalSection>

          <LegalSection title="4. License and Permitted Use" id="license">
            <p>
              Subject to these Terms and any applicable order form, SquareCampus grants Institutions
              a limited, revocable, non-exclusive, non-transferable, and non-sublicensable license
              to use the Service for internal educational and administrative purposes.
            </p>
            <p>Unless expressly permitted, you must not:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Copy, modify, or derive works from the Service;</li>
              <li>Reverse engineer or attempt to extract the platform source code;</li>
              <li>Resell or re-distribute the Service outside your Institution;</li>
              <li>Use the Service to build a competing product;</li>
              <li>Circumvent usage limits, quotas, or licensing restrictions; or</li>
              <li>Use the Service in violation of applicable laws or regulations.</li>
            </ul>
          </LegalSection>

          <LegalSection title="5. Subscription, Fees, and Billing" id="billing">
            <p>
              Access is provided on a subscription basis. Pricing, billing frequency, and modules
              are defined in the relevant proposal or order form.
            </p>
            <p>Unless otherwise agreed:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Fees are payable in advance per billing period;</li>
              <li>Add-ons or overages may be billed pro-rata for the remaining period;</li>
              <li>
                Fees are non-refundable except where required by law or stated in an order form.
              </li>
            </ul>
            <p>Non-payment may result in suspension or termination of Service access.</p>
          </LegalSection>

          <LegalSection title="6. Data Ownership and Rights" id="data-ownership">
            <p>Subject to these Terms:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                The Institution retains ownership of data uploaded or generated through the Service;
              </li>
              <li>
                SquareCampus retains rights over the platform, metadata, usage stats, and anonymised
                data.
              </li>
            </ul>
            <p>
              Institutions may request export of their data during an active subscription in a
              reasonable format, subject to feasibility and applicable fees.
            </p>
          </LegalSection>

          <LegalSection title="7. Privacy and Data Protection" id="privacy-data">
            <p>
              SquareCampus processes personal data according to its Privacy Policy, which forms part
              of these Terms.
            </p>
            <p>
              We strive to comply with applicable Indian data protection laws, including the IT Act,
              2000, and the DPDP Act, 2023.
            </p>
            <p>
              SquareCampus service data is hosted and processed in India. We do not transfer or
              store customer data outside India.
            </p>
            <p>We pledge to keep data within the borders of India, no excuses or compromises.</p>
            <p>
              Institutions remain responsible for obtaining any consents required for processing
              student, staff, or parent data.
            </p>
          </LegalSection>

          <LegalSection title="8. Security & Data Protection Reference" id="security-reference">
            <p>
              A summary of our security program, data residency, encryption, and audit practices is
              available at{" "}
              <a href="https://squarecampus.com/security/" className="text-foreground">
                https://squarecampus.com/security
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection title="9. Service Availability and Maintenance" id="availability">
            <p>
              We aim to offer a reliable Service but cannot guarantee uninterrupted or error-free
              operation.
            </p>
            <p>
              Scheduled maintenance or emergency work may temporarily affect availability; we will
              provide notice where possible.
            </p>
          </LegalSection>

          <LegalSection title="10. Prohibited Conduct" id="prohibited-conduct">
            <p>
              You must not use the Service to store, share, or process content that is unlawful,
              harmful, defamatory, obscene, or otherwise objectionable.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Infringe third-party rights, including IP or privacy rights;</li>
              <li>Introduce malware, viruses, or any malicious payload;</li>
              <li>Engage in conduct described in the Acceptable Use Policy.</li>
            </ul>
          </LegalSection>

          <LegalSection title="11. Term, Suspension, and Termination" id="termination">
            <p>
              These Terms remain effective until the Institution's subscription ends or the
              Agreement is terminated.
            </p>
            <p>SquareCampus may suspend or terminate if:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Fees are unpaid;</li>
              <li>Material breach occurs and is uncured;</li>
              <li>Law or government order requires suspension;</li>
              <li>Usage poses security, legal, or operational risk to others.</li>
            </ul>
            <p>
              After termination, access ceases and data may be retained for a limited period for
              legal, accounting, or backup reasons, after which it will be deleted or anonymised.
            </p>
          </LegalSection>

          <LegalSection title="12. Intellectual Property" id="intellectual-property">
            <p>
              All rights to the Service, interfaces, documentation, and technology belong to
              SquareCampus or its licensors.
            </p>
            <p>
              Nothing in these Terms grants you ownership of SquareCampus trademarks, logos, or
              software.
            </p>
          </LegalSection>

          <LegalSection title="13. Disclaimers" id="disclaimers">
            <p>The Service is provided "as is" and "as available."</p>
            <p>
              To the fullest extent permitted by law, SquareCampus disclaims express, implied,
              statutory, and other warranties, including merchantability and fitness for a
              particular purpose.
            </p>
          </LegalSection>

          <LegalSection title="14. Limitation of Liability" id="liability">
            <p>
              SquareCampus shall not be liable for indirect, incidental, consequential, special,
              exemplary, or punitive damages, or loss of profits, data, or goodwill arising out of
              the Service.
            </p>
            <p>
              Where liability cannot be excluded, our aggregate liability is capped at the
              subscription fees paid in the preceding twelve months.
            </p>
          </LegalSection>

          <LegalSection title="15. Changes to the Terms" id="changes">
            <p>
              We may update these Terms from time to time, and we may provide additional notice of
              material changes.
            </p>
            <p>Your continued use after changes means you accept the revised Terms.</p>
          </LegalSection>

          <LegalSection title="16. Governing Law and Jurisdiction" id="governing-law">
            <p>These Terms are governed by Indian law, without regard to conflict of law rules.</p>
            <p>
              Subject to mandatory requirements, the courts in Bengaluru, Karnataka, India have
              exclusive jurisdiction over disputes.
            </p>
          </LegalSection>

          {/* New Section 17 */}
          <LegalSection title="17. Indemnification" id="indemnification">
            <p className="font-medium text-foreground">17.1 Institution Indemnification</p>
            <p>
              The Institution shall defend, indemnify, and hold harmless SquareCampus, Fairhelm
              Systems (OPC) Private Limited, and their respective officers, directors, employees,
              and agents from and against any and all claims, damages, losses, liabilities, costs,
              and expenses (including reasonable attorneys' fees) arising from or related to:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                The Institution's breach of these Terms, including but not limited to the credential
                sharing prohibitions in Section 3 and competitor access prohibitions in Section 19;
              </li>
              <li>The Institution's violation of applicable laws or regulations;</li>
              <li>Any third-party claims arising from the Institution's use of the Service;</li>
              <li>
                The Institution's failure to maintain adequate security over credentials and access
                controls;
              </li>
              <li>
                Any unauthorised access facilitated by the Institution's personnel, whether
                intentional or negligent.
              </li>
            </ul>

            <p className="mt-6 font-medium text-foreground">17.2 SquareCampus Indemnification</p>
            <p>
              SquareCampus shall defend, indemnify, and hold harmless the Institution from claims
              alleging that the Service infringes valid intellectual property rights, provided the
              Institution:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Promptly notifies SquareCampus of such claims;</li>
              <li>Provides reasonable cooperation in the defence;</li>
              <li>Allows SquareCampus sole control of the defence and settlement.</li>
            </ul>
          </LegalSection>

          {/* New Section 18 */}
          <LegalSection title="18. Security Incident Response" id="security-incident">
            <p className="font-medium text-foreground">18.1 Institution Response Obligations</p>
            <p>
              Upon discovering or being notified of any security incident involving the Service,
              including but not limited to credential compromise, unauthorised access, or suspected
              competitor infiltration, the Institution shall:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Immediately notify SquareCampus at{" "}
                <a href="mailto:security@squarecampus.com" className="text-foreground">
                  security@squarecampus.com
                </a>
              </li>
              <li>Preserve all relevant logs, communications, and evidence;</li>
              <li>Cooperate fully with SquareCampus's investigation;</li>
              <li>Implement any remedial measures requested by SquareCampus;</li>
              <li>Provide written incident reports within 48 hours of discovery.</li>
            </ul>

            <p className="mt-6 font-medium text-foreground">18.2 SquareCampus Response</p>
            <p>
              SquareCampus shall respond to confirmed security incidents in accordance with our
              Security Policy and may:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Immediately suspend or revoke compromised credentials;</li>
              <li>Implement additional security controls;</li>
              <li>Require credential rotation across affected accounts;</li>
              <li>Pursue legal remedies as appropriate.</li>
            </ul>

            <p className="mt-6 font-medium text-foreground">18.3 Evidence Preservation</p>
            <p>
              Both parties agree to preserve all evidence related to security incidents for a
              minimum of seven (7) years or as required by applicable law, whichever is longer. This
              includes access logs, communications, and any documentation related to the incident.
            </p>
          </LegalSection>

          {/* New Section 19 */}
          <LegalSection title="19. Competitor Access Prohibition" id="competitor-access">
            <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                CRITICAL: This section establishes strict prohibitions on competitor access.
                Violations may result in suspension or termination and legal action as appropriate.
                See our{" "}
                <a href="/squarecampus/competitor-notice/" className="underline">
                  Competitor Notice
                </a>{" "}
                for additional context and public notice.
              </p>
            </div>

            <p className="font-medium text-foreground">19.1 Definitions</p>
            <p>For purposes of this Section, "Competitor" means:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Any entity that develops, markets, sells, or distributes software or services that
                compete with SquareCampus, including but not limited to school management systems,
                student information systems, learning management systems, or educational
                administration platforms;
              </li>
              <li>Any entity that has announced intent to enter such markets;</li>
              <li>Any employee, contractor, agent, or representative of such entities;</li>
              <li>
                Any entity conducting competitive intelligence or product evaluation on behalf of a
                competing entity.
              </li>
            </ul>

            <p className="mt-6 font-medium text-foreground">19.2 Absolute Prohibition</p>
            <p>The Institution expressly agrees that it shall not, under any circumstances:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Provide, share, or make available any credentials, access tokens, or authentication
                mechanisms to any Competitor;
              </li>
              <li>
                Permit any Competitor to access the Service through the Institution's account;
              </li>
              <li>
                Share screenshots, recordings, documentation, or any visual or textual
                representation of the Service with Competitors;
              </li>
              <li>
                Describe Service features, functionality, pricing, or implementation details to
                Competitors;
              </li>
              <li>
                Assist Competitors in any manner in understanding, replicating, or competing with
                the Service.
              </li>
            </ul>

            <p className="mt-6 font-medium text-foreground">19.3 Mandatory Disclosure</p>
            <p>The Institution shall immediately notify SquareCampus if:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Any Competitor requests access to or information about the Service;</li>
              <li>
                The Institution becomes aware of any current or former employee sharing credentials
                or information with Competitors;
              </li>
              <li>
                The Institution is evaluating competing products and such evaluation may involve
                comparative analysis with SquareCampus.
              </li>
            </ul>

            <p className="mt-6 font-medium text-foreground">19.4 Enhanced Liquidated Damages</p>
            <p>
              In addition to all other remedies available at law or equity, the Institution
              acknowledges that violations of this Section cause substantial harm to SquareCampus
              that is difficult to quantify. Accordingly, the Institution agrees to pay liquidated
              damages as follows:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Credential Sharing with Competitor:</strong> ₹50,00,000 (Fifty Lakh Indian
                Rupees) per incident;
              </li>
              <li>
                <strong>Permitting Competitor Access:</strong> ₹75,00,000 (Seventy-Five Lakh Indian
                Rupees) per incident;
              </li>
              <li>
                <strong>Sharing Documentation or Screenshots:</strong> ₹25,00,000 (Twenty-Five Lakh
                Indian Rupees) per incident;
              </li>
              <li>
                <strong>Failure to Report Known Violations:</strong> ₹10,00,000 (Ten Lakh Indian
                Rupees) per incident.
              </li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              These amounts represent the parties' reasonable estimate of actual damages and are not
              intended as a penalty. SquareCampus reserves the right to pursue actual damages where
              they exceed these amounts.
            </p>
          </LegalSection>

          <LegalSection title="20. Contact Information" id="contact">
            <p>If you have questions about these Terms, contact:</p>
            <p>
              <strong>Fairhelm Systems (OPC) Private Limited</strong>
              <br />
              Email: <a href="mailto:support@squarecampus.com">support@squarecampus.com</a>
              <br />
              Security: <a href="mailto:security@squarecampus.com">security@squarecampus.com</a>
              <br />
              Legal: <a href="mailto:legal@squarecampus.com">legal@squarecampus.com</a>
              <br />
              Website:{" "}
              <a href="https://squarecampus.com" target="_blank" rel="noopener noreferrer">
                https://squarecampus.com
              </a>
            </p>
          </LegalSection>
        </div>

        <Separator className="mt-10" />
        <p className="text-xs text-muted-foreground">
          This Terms of Service page is for informational purposes and does not constitute legal
          advice. Institutions should consult counsel to ensure compliance with applicable laws.
        </p>
      </LegalShell>
    </>
  );
}
