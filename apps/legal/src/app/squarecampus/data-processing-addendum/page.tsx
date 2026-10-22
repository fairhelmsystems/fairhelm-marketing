// LEGAL: substantive changes to this document require legal sign-off.

import { Separator } from "@fairhelm/ui/components/separator";
import { EntityIdentity, LegalSection, LegalShell } from "@/components/legal/legal-shell";
import { PageSchema } from "@/components/site/page-schema";

const contents = [
  { label: "Company & Scope", href: "#company-scope" },
  { label: "Subject Matter and Duration", href: "#subject-duration" },
  { label: "Roles of the Parties", href: "#roles" },
  { label: "Categories of Data and Data Subjects", href: "#categories" },
  { label: "Processor Obligations", href: "#processor-obligations" },
  { label: "Controller Obligations", href: "#controller-obligations" },
  { label: "Security Measures", href: "#security-measures" },
  { label: "Sub-processors", href: "#subprocessors" },
  { label: "Data Subject Requests", href: "#data-requests" },
  { label: "Data Breach Notification", href: "#breach" },
  { label: "Data Retention and Deletion", href: "#retention" },
  { label: "Priority and Conflicts", href: "#priority" },
  { label: "Governing Law", href: "#governing-law" },
];

export default function DataProcessingAddendumPage() {
  return (
    <>
      <PageSchema
        name="Data Processing Addendum"
        description="The SquareCampus data processing addendum: roles, processing purposes, sub-processors, security measures, and return or deletion of institutional data."
        path="/squarecampus/data-processing-addendum"
      />
      <LegalShell
        title="Data Processing Addendum"
        current="/data-processing-addendum/"
        contents={contents}
        description="Details about how SquareCampus processes Institution data on behalf of our customers."
      >
        <div className="space-y-10">
          <LegalSection title="1. Company & Scope" id="company-scope">
            <EntityIdentity documentNoun="this DPA" />
            <p>
              This Data Processing Addendum ("DPA") forms part of the agreement between Fairhelm
              Systems (OPC) Private Limited and the Institution when referenced in an order form or
              contract.
            </p>
          </LegalSection>

          <LegalSection title="2. Subject Matter and Duration" id="subject-duration">
            <p>
              This DPA governs SquareCampus's processing of personal data on behalf of the
              Institution while providing the SquareCampus Service. The duration of this DPA matches
              the Institution's subscription or the underlying agreement, unless otherwise required
              by law.
            </p>
          </LegalSection>

          <LegalSection title="3. Roles of the Parties" id="roles">
            <p>
              The Institution determines the purposes and means of processing personal data and acts
              as the Controller; Fairhelm Systems (OPC) Private Limited processes personal data
              solely on behalf of the Institution as the Processor.
            </p>
          </LegalSection>

          <LegalSection title="4. Categories of Data and Data Subjects" id="categories">
            <p>
              The data processed depends on the Institution's configuration and usage and may
              include:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Student data (names, contact details, academic records, attendance, photos);</li>
              <li>Staff and teacher data (roles, timetables, salary metadata if stored);</li>
              <li>Parent/guardian information (contacts, relationship to students);</li>
              <li>Institutional administrative and billing data;</li>
              <li>Technical and usage logs associated with user accounts.</li>
            </ul>
            <p className="text-sm text-muted-foreground/80">
              Data subjects may include students, parents/guardians, teachers, staff, and other
              authorised users of the Service.
            </p>
          </LegalSection>

          <LegalSection title="5. Processor Obligations" id="processor-obligations">
            <p>SquareCampus shall:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Process data only on documented instructions from the Institution;</li>
              <li>Ensure authorised personnel are subject to confidentiality obligations;</li>
              <li>Implement appropriate technical and organisational security measures;</li>
              <li>Notify the Institution without undue delay upon discovering a data breach;</li>
              <li>
                Assist the Institution with subject requests or regulator interactions when
                requested;
              </li>
              <li>
                Provide information to demonstrate compliance and allow for audits under reasonable
                conditions.
              </li>
            </ul>
          </LegalSection>

          {/* Expanded Section 6 */}
          <LegalSection title="6. Controller Obligations" id="controller-obligations">
            <p className="font-medium text-foreground">6.1 General Obligations</p>
            <p>The Institution shall:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Ensure it has rights, consents, and legal bases for supplying personal data;</li>
              <li>Remain responsible for the accuracy and legality of the data submitted;</li>
              <li>
                Comply with applicable data protection obligations, including notices to subjects;
              </li>
              <li>
                Not instruct SquareCampus to process data in a manner that violates applicable law.
              </li>
            </ul>

            <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
              <p className="font-medium text-amber-800 dark:text-amber-200">
                6.2 Access Control Requirements
              </p>
              <p className="mt-3 text-sm">
                The Institution shall implement and maintain robust access controls including:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                <li>
                  <strong>Role-Based Access:</strong> Implement role-based access controls ensuring
                  users can only access data necessary for their legitimate job functions.
                </li>
                <li>
                  <strong>Access Reviews:</strong> Conduct periodic reviews (at minimum quarterly)
                  of user access privileges and promptly revoke access for terminated or transferred
                  personnel.
                </li>
                <li>
                  <strong>Audit Logging:</strong> Maintain internal records of who has been granted
                  access to the Service and the business justification for such access.
                </li>
                <li>
                  <strong>Segregation of Duties:</strong> Implement appropriate segregation of
                  duties to prevent any single individual from having excessive access to sensitive
                  data or administrative functions.
                </li>
              </ul>
            </div>

            <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
              <p className="font-medium text-red-800 dark:text-red-200">6.3 Credential Security</p>
              <p className="mt-3 text-sm">
                The Institution shall ensure the security of all credentials including:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                <li>
                  <strong>Unique Credentials:</strong> Ensuring each authorised user has unique
                  login credentials that are not shared with any other person.
                </li>
                <li>
                  <strong>Secure Storage:</strong> Storing credentials securely and not in plain
                  text, shared documents, or unsecured locations.
                </li>
                <li>
                  <strong>Credential Rotation:</strong> Implementing credential rotation policies
                  and immediately rotating credentials upon any suspected compromise.
                </li>
                <li>
                  <strong>Prohibition on Sharing:</strong> Enforcing strict prohibitions on
                  credential sharing with any person or entity outside the Institution's authorised
                  personnel, including but not limited to competitors, consultants, and vendors.
                </li>
                <li>
                  <strong>Third-Party Access:</strong> Not providing credentials or access to any
                  third party without SquareCampus's prior written consent, particularly to entities
                  that compete with SquareCampus.
                </li>
              </ul>
            </div>

            <p className="mt-6 font-medium text-foreground">6.4 Incident Response Duties</p>
            <p>
              The Institution shall promptly notify SquareCampus of any security incident including:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Any known or suspected credential compromise or unauthorised access;</li>
              <li>Any attempt by competitors to gain access to the Institution's account;</li>
              <li>Any data breach affecting data processed through the Service;</li>
              <li>
                Any regulatory inquiry or legal process related to data processed by SquareCampus;
              </li>
              <li>
                Any employee termination where there is reason to believe credentials may have been
                compromised or shared inappropriately.
              </li>
            </ul>

            <p className="mt-6 font-medium text-foreground">
              6.5 Cooperation with Security Measures
            </p>
            <p>The Institution agrees to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Cooperate with SquareCampus's security audits and investigations when requested;
              </li>
              <li>Implement any security recommendations provided by SquareCampus;</li>
              <li>
                Provide documentation regarding access controls and credential management upon
                reasonable request;
              </li>
              <li>
                Accept temporary service suspension if SquareCampus identifies security concerns
                requiring immediate remediation.
              </li>
            </ul>

            <p className="mt-4 text-sm text-muted-foreground">
              Violations of these Controller Obligations may constitute a material breach of the
              Terms of Service. See the{" "}
              <a
                href="/squarecampus/terms-of-service/#account-security"
                className="text-foreground underline"
              >
                Terms of Service Section 3
              </a>{" "}
              and{" "}
              <a href="/squarecampus/competitor-notice/" className="text-foreground underline">
                Competitor Notice
              </a>{" "}
              for additional information on security requirements and enforcement.
            </p>
          </LegalSection>

          <LegalSection title="7. Security Measures" id="security-measures">
            <p>
              SquareCampus maintains administrative, technical, and organisational safeguards
              appropriate to the nature of the data and the risks presented by processing, including
              access controls, encryption in transit and at rest, monitoring, and backup procedures.
            </p>
            <p>
              SquareCampus service data is hosted and processed in India. We do not transfer or
              store customer data outside India.
            </p>
            <p>We pledge to keep data within the borders of India, no excuses or compromises.</p>
          </LegalSection>

          <LegalSection title="8. Sub-processors" id="subprocessors">
            <p>
              The Institution authorises SquareCampus to engage sub-processors such as cloud hosts,
              SMS/email gateways, and backup providers.
            </p>
            <p>A current list of sub-processors is available upon request.</p>
            <p>SquareCampus shall:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Impose data protection obligations on sub-processors comparable to this DPA;</li>
              <li>
                Remain responsible for sub-processor acts and omissions as if performed by
                SquareCampus.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="9. Data Subject Requests" id="data-requests">
            <p>
              If SquareCampus receives a data subject request, we will direct the request to the
              Institution, unless we are authorised or legally required to respond directly.
            </p>
            <p>
              SquareCampus will assist the Institution in fulfilling requests such as access,
              correction, or deletion, subject to technical feasibility and the Institution's
              instructions.
            </p>
          </LegalSection>

          <LegalSection title="10. Data Breach Notification" id="breach">
            <p>In the event of a personal data breach under this DPA, SquareCampus shall:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Notify the Institution without undue delay after becoming aware of the breach;
              </li>
              <li>
                Share information reasonably available to support the Institution's regulatory or
                notification obligations.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="11. Data Retention and Deletion" id="retention">
            <p>Upon termination of the subscription or upon written request, SquareCampus shall:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Delete or anonymise personal data processed on behalf of the Institution; or</li>
              <li>Return the data in a reasonable format where export functionality is agreed.</li>
            </ul>
            <p>
              SquareCampus may retain data where required by law, dispute resolution, or backup
              purposes, after which it will be deleted or anonymised.
            </p>
          </LegalSection>

          <LegalSection title="12. Priority and Conflicts" id="priority">
            <p>
              In the event of a conflict between this DPA and the main agreement or Terms of
              Service, this DPA governs data processing obligations.
            </p>
          </LegalSection>

          <LegalSection title="13. Governing Law" id="governing-law">
            <p>
              This DPA is governed by Indian law. Disputes are subject to the jurisdiction
              provisions of the main agreement, typically the courts of Bengaluru, Karnataka, India.
            </p>
          </LegalSection>
        </div>

        <Separator className="mt-10" />
        <p className="text-xs text-muted-foreground">
          This Data Processing Addendum describes data processing obligations and should be reviewed
          by legal counsel to ensure compliance with applicable law.
        </p>
      </LegalShell>
    </>
  );
}
