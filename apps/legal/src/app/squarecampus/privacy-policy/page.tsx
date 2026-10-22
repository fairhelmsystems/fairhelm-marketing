// LEGAL: substantive changes to this document require legal sign-off.

import { company } from "@fairhelm/squarecampus-content/company";
import { Separator } from "@fairhelm/ui/components/separator";
import { EntityIdentity, LegalSection, LegalShell } from "@/components/legal/legal-shell";
import { PageSchema } from "@/components/site/page-schema";

const contents = [
  { label: "Company & Data Fiduciary", href: "#company-controller" },
  { label: "Information We Collect", href: "#information-collected" },
  { label: "How We Use the Information", href: "#use-of-information" },
  { label: "Legal Basis for Processing", href: "#legal-basis" },
  { label: "Data Sharing and Transfers", href: "#data-sharing" },
  { label: "Data Security", href: "#data-security" },
  { label: "Data Retention", href: "#data-retention" },
  { label: "Your Rights as a Data Principal", href: "#rights" },
  { label: "Cookies and Similar Technologies", href: "#cookies" },
  { label: "Children’s and Student Data", href: "#children" },
  { label: "Grievance Redressal", href: "#grievance" },
  { label: "Changes to This Policy", href: "#changes" },
  { label: "Contact Us", href: "#contact" },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageSchema
        name="Privacy Policy"
        description="How SquareCampus collects, processes, stores and returns institutional and personal data, and the rights available to data principals."
        path="/squarecampus/privacy-policy"
      />
      <LegalShell
        title="Privacy Policy"
        current="/privacy-policy/"
        contents={contents}
        description="How SquareCampus gathers, safeguards, and shares personal data for schools and colleges."
      >
        <div className="space-y-10">
          <LegalSection title="1. Company & Data Fiduciary" id="company-controller">
            <EntityIdentity documentNoun="this Policy" />
            <p>
              This Policy uses the vocabulary of the Digital Personal Data Protection Act, 2023 (the
              "DPDP Act"): a <strong>Data Principal</strong> is the individual the personal data is
              about, a <strong>Data Fiduciary</strong> decides why and how it is processed, and a{" "}
              <strong>Data Processor</strong> processes it on a Fiduciary's instructions.
            </p>
            <p>
              {company.legalNameDisplay} is the Data Fiduciary for its own business operations and
              the SquareCampus website. When processing personal data on behalf of an Institution
              within the Service, the Institution is the Data Fiduciary and{" "}
              {company.legalNameDisplay} acts as its Data Processor, as described in the Data
              Processing Addendum. In that case the Institution's own notice governs its
              relationship with students, guardians and staff.
            </p>
            <p>
              SquareCampus service data is hosted and processed in India. We do not transfer or
              store customer data outside India.
            </p>
            <p>We pledge to keep data within the borders of India, no excuses or compromises.</p>
          </LegalSection>

          <LegalSection title="2. Information We Collect" id="information-collected">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-foreground">2.1 Institution Information</p>
                <p>We may collect or receive details about the Institution, including:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Institution name, type, and registered address;</li>
                  <li>Administrative contacts, emails, and phone numbers;</li>
                  <li>Billing preferences and subscription configurations;</li>
                  <li>Modules, features, and integrations selected by the Institution.</li>
                </ul>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">2.2 User Information</p>
                <p>We receive, process, or store data about individual users, such as:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Names, contact details, roles (student, parent, educator, staff);</li>
                  <li>Authentication records and hashed login credentials;</li>
                  <li>Academic data, attendance, assignments, assessments, and grades;</li>
                  <li>
                    Messages, notifications, and collaboration history generated inside the Service.
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  2.3 Technical and Usage Data
                </p>
                <p>Automatic information we collect includes:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>IP address, device, and browser metadata;</li>
                  <li>Pages, modules, and features accessed with timestamps;</li>
                  <li>Diagnostic logs, error events, and performance telemetry;</li>
                  <li>Cookies or tokens used for authentication and session management.</li>
                </ul>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  2.4 Sensitive Data and Minors
                </p>
                <p>
                  SquareCampus may process information about minors (students) and data that may be
                  considered sensitive (photographs, health records, disciplinary notes) strictly
                  under the Institution's instructions.
                </p>
                <p>
                  Institutions are responsible for obtaining any necessary parental or guardian
                  permissions before submitting such data through the Service.
                </p>
              </div>
            </div>
          </LegalSection>

          <LegalSection title="3. How We Use the Information" id="use-of-information">
            <p>We use the collected data to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Provide, operate, and improve the SquareCampus Service;</li>
              <li>Authenticate users, maintain sessions, and secure accounts;</li>
              <li>Generate attendances, reports, notifications, and academic insights;</li>
              <li>Facilitate communication between teachers, students, and parents;</li>
              <li>Analyse usage patterns for reliability, performance, and product planning;</li>
              <li>Comply with legal obligations and respond to lawful requests;</li>
              <li>Enforce our Terms of Service and detect abuse.</li>
            </ul>
            <p>We do not sell personal data to advertisers or unrelated third parties.</p>
          </LegalSection>

          <LegalSection title="4. Legal Basis for Processing" id="legal-basis">
            <p>
              Our processing is typically governed by performance of an agreement with the
              Institution, consent where appropriate, compliance with legal duties, or legitimate
              interests that do not override individual rights.
            </p>
          </LegalSection>

          <LegalSection title="5. Data Sharing and Transfers" id="data-sharing">
            <p>We may share data with:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Authorised Institution staff as allowed by internal controls;</li>
              <li>Third-party providers acting on our behalf (cloud, messaging, analytics);</li>
              <li>Professional advisers bound by confidentiality obligations;</li>
              <li>Government or law enforcement authorities when required by law.</li>
            </ul>
            <p>
              We may use sub-processors to deliver the Service. A current list of sub-processors is
              available upon request.
            </p>
          </LegalSection>

          <LegalSection title="6. Data Security" id="data-security">
            <p>
              We deploy administrative, technical, and physical measures such as encryption in
              transit and at rest, role-based access controls, infrastructure hardening, monitoring,
              backups, and periodic reviews to limit access to authorised personnel only.
            </p>
            <p>
              No system is 100% secure, but we continually invest in improving our posture and
              respond quickly to incidents.
            </p>
            <p>
              <strong className="text-foreground">Breach notification.</strong> On becoming aware of
              a personal data breach, we intimate each affected Data Principal without delay —
              describing the nature, extent and timing of the breach, its likely consequences, the
              mitigation we are applying, the steps they can take, and where to reach us — and we
              report it to the Data Protection Board of India, followed by a detailed report within
              72 hours as Rule 7 of the DPDP Rules, 2025 requires. Where we act as an Institution's
              Data Processor, we notify the Institution without delay so it can meet its own
              obligation.
            </p>
            <p>
              A summary of our security practices is available at{" "}
              <a href="https://squarecampus.com/security/" className="text-foreground">
                https://squarecampus.com/security
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection title="7. Data Retention" id="data-retention">
            <p>
              Data is retained during active use to provide the Service. After an Institution’s
              subscription ends, we may keep data for a limited period for legal, accounting, or
              backup reasons, after which it will be deleted or anonymised.
            </p>
          </LegalSection>

          <LegalSection title="8. Your Rights as a Data Principal" id="rights">
            <p>
              Where {company.legalNameDisplay} is the Data Fiduciary, the DPDP Act gives you the
              following rights. Requests may be sent to the grievance contact in section 11.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Access</strong> — a summary of the personal data being processed, the
                processing activities, and the identities of other Data Fiduciaries and Processors
                it has been shared with (section 11).
              </li>
              <li>
                <strong>Correction and erasure</strong> — correction, completion, updating, and
                erasure of your personal data (section 12).
              </li>
              <li>
                <strong>Grievance redressal</strong> — a readily available means of raising a
                complaint with us, answered within the period prescribed under the Act, before
                approaching the Data Protection Board of India (section 13).
              </li>
              <li>
                <strong>Nomination</strong> — the right to nominate another individual to exercise
                these rights on your behalf in the event of your death or incapacity (section 14).
              </li>
              <li>
                <strong>Withdrawal of consent</strong> — where processing rests on your consent, you
                may withdraw it at any time, with the same ease as it was given. Withdrawal stops
                further processing for that purpose; it does not undo lawful processing already
                carried out, nor affect records we must retain by law.
              </li>
            </ul>
            <p>
              Where your data sits inside an Institution's deployment, that Institution is the Data
              Fiduciary. Raise the request with the Institution first; we will support it as the
              Institution's Data Processor. We may need to verify your identity, and your authority
              where you act for someone else, before acting on a request.
            </p>
          </LegalSection>

          <LegalSection title="9. Cookies and Similar Technologies" id="cookies">
            <p>
              Cookies and similar identifiers support authentication, session persistence, and
              preference storage. We do not use third-party advertising cookies in the core academic
              and administrative areas.
            </p>
          </LegalSection>

          <LegalSection title="10. Children’s and Student Data" id="children">
            <p>
              Student records are the most sensitive data SquareCampus touches, and a large share of
              them concern children — anyone under eighteen. Section 9 of the DPDP Act requires
              verifiable consent from a parent or lawful guardian before a child's personal data is
              processed, and prohibits tracking, behavioural monitoring, and targeted advertising
              directed at children. Rule 10 of the DPDP Rules, 2025 adds that the consent must be
              genuinely verifiable: due diligence is required to confirm that the person giving it
              is an identifiable adult entitled to act for the child.
            </p>
            <p>
              SquareCampus is provided to Institutions, not directly to children. The Institution
              holds the relationship with students and guardians and is responsible for obtaining
              and recording verifiable parental consent, for managing access on behalf of students,
              and for its own compliance regarding minors. Our role is to process what the
              Institution instructs and to make that instruction boundary enforceable in the
              product.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>We do not sell student, child, or guardian data, or share it for advertising.</li>
              <li>
                We do not track, profile, or behaviourally monitor children, and run no advertising
                technology in the product.
              </li>
              <li>
                We do not use student or child data to train AI models. The AEGIS posture is
                read-only, role-scoped, and audit-backed.
              </li>
              <li>
                We undertake no processing that is likely to have a detrimental effect on the
                well-being of a child.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="11. Grievance Redressal" id="grievance">
            <p>
              Complaints, rights requests, and questions about this Policy should be addressed to
              the {company.grievance.name}, at{" "}
              <a href={`mailto:${company.grievance.email}`}>{company.grievance.email}</a>, or by
              post to the registered office at {company.address.full}.
            </p>
            <p>
              We acknowledge receipt and respond within ninety days, the period prescribed under the
              DPDP Rules, 2025. Most requests are answered well inside it. If a grievance is not
              resolved to your satisfaction, you may complain to the Data Protection Board of India
              directly — no lawyer and no fee are required.
            </p>
          </LegalSection>

          <LegalSection title="12. Changes to This Policy" id="changes">
            <p>
              We may update this Privacy Policy occasionally. Updated versions will appear on this
              page, and we may provide additional notices when appropriate.
            </p>
            <p>
              The DPDP Rules, 2025 were notified on 14 November 2025 and take effect in phases, with
              full compliance required by 13 May 2027. We are building toward that date rather than
              waiting for it, and this Policy will be revised as consent, notice, and rights
              machinery lands in the product.
            </p>
            <p>Continued use after changes means acceptance of the revised policy.</p>
          </LegalSection>

          <LegalSection title="13. Contact Us" id="contact">
            <p>If you have questions or requests, contact:</p>
            <p>
              <strong>{company.legalName}</strong>
              <br />
              Registered office: {company.address.full}
              <br />
              CIN: {company.cin}
              <br />
              GSTIN: {company.gstin}
              <br />
              Email: <a href="mailto:privacy@squarecampus.com">privacy@squarecampus.com</a>
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
          This Privacy Policy is intended for transparency and does not constitute legal advice.
          Institutions should consult legal counsel to confirm compliance with applicable privacy
          laws.
        </p>
      </LegalShell>
    </>
  );
}
