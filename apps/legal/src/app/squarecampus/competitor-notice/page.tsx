import type { Metadata } from "next";
import {
  BulletList,
  EvidenceFooter,
  ExampleBox,
  ExpandableSection,
  Hero,
  InfoBox,
  NoticeSection,
  Paragraph,
  ReportingCTA,
  ShareActions,
  Strong,
  SubHeading,
  TableOfContents,
  TableOfContentsSidebar,
  WarningBox,
} from "@/components/competitor-notice";
import "@/styles/competitor-notice-print.css";

const linkClassName = "text-teal-300 hover:underline";

// LEGAL: substantive changes to this notice require legal sign-off. This page is a legal
// artifact, not marketing: it stays noindex and out of customer-facing
// navigation, reachable only by direct link.
export const metadata: Metadata = {
  title: "Notice to Competitors",
  description:
    "Public legal notice regarding unauthorized access or misuse of SquareCampus. This notice is intended to provide actual notice and preserve remedies under Indian law.",
  alternates: {
    canonical: "https://legal.fairhelmsystems.com/squarecampus/competitor-notice/",
  },
  openGraph: {
    title: "Notice to Competitors | SquareCampus",
    description: "Public legal notice regarding unauthorized access or misuse of SquareCampus.",
    type: "website",
    url: "https://legal.fairhelmsystems.com/squarecampus/competitor-notice/",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function CompetitorNoticePage() {
  return (
    <>
      {/* Skip to content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to main content
      </a>

      <main tabIndex={-1} id="main-content" className="dark min-h-screen bg-neutral-950">
        <Hero />
        <ShareActions />
        <TableOfContents />

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-[1fr_280px]">
            {/* Main Content */}
            <div className="space-y-12">
              <NoticeSection
                id="notice-purpose"
                number={1}
                title="Purpose and Scope of Notice"
                severity="critical"
              >
                <Paragraph>
                  Fairhelm Systems (OPC) Private Limited (trading as SquareCampus) issues this
                  public legal notice to competitors, their employees, contractors, agents, and
                  anyone seeking access to SquareCampus. Unauthorized access, credential
                  solicitation, or misuse of non-public information is prohibited.
                </Paragraph>
                <Paragraph>
                  This notice is informational and intended to provide actual notice. It does not
                  create a contract, grant access rights, or modify any existing agreement.
                </Paragraph>

                <SubHeading>Who this applies to</SubHeading>
                <BulletList
                  type="default"
                  items={[
                    "Competitors and prospective competitors",
                    "Sales, marketing, product, and research teams",
                    "Third-party consultants, contractors, and agents",
                    "Anyone attempting to obtain non-public SquareCampus information",
                  ]}
                />
              </NoticeSection>

              <NoticeSection
                id="prohibited-conduct"
                number={2}
                title="Prohibited Conduct"
                severity="critical"
              >
                <Paragraph>
                  The following activities are prohibited. Conducting or directing these activities
                  may expose individuals and organizations to legal action.
                </Paragraph>

                <ExpandableSection title="A. Credential Solicitation" defaultExpanded>
                  <Paragraph>
                    Requesting, encouraging, or accepting SquareCampus credentials, access tokens,
                    or administrative permissions from any person.
                  </Paragraph>
                  <BulletList
                    type="x"
                    items={[
                      "Asking customers to share logins, screenshots, or exports",
                      "Requesting administrative or support access under false pretenses",
                      "Using a customer account to inspect non-public features",
                    ]}
                  />
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold text-neutral-300">Examples:</p>
                    <ExampleBox type="violation">
                      "Can you share your login so we can compare features?"
                    </ExampleBox>
                    <ExampleBox type="violation">
                      "Send us screenshots of your SquareCampus dashboard."
                    </ExampleBox>
                  </div>
                </ExpandableSection>

                <ExpandableSection title="B. Misrepresentation or Impersonation">
                  <Paragraph>
                    Misrepresenting identity, affiliation, or purpose to obtain access or
                    information.
                  </Paragraph>
                  <BulletList
                    type="x"
                    items={[
                      "Posing as a school, parent, or partner to obtain a demo",
                      "Using a shell company or alias to hide competitive intent",
                      "Having third parties request access on your behalf",
                    ]}
                  />
                </ExpandableSection>

                <ExpandableSection title="C. Scraping, Probing, or Automated Access">
                  <Paragraph>
                    Using automated tools or scripts to discover, extract, or infer non-public data.
                  </Paragraph>
                  <BulletList
                    type="x"
                    items={[
                      "Scraping pages, APIs, or assets beyond public content",
                      "Enumerating endpoints, probing for vulnerabilities, or brute-forcing",
                      "Bypassing access controls or rate limits",
                    ]}
                  />
                </ExpandableSection>

                <ExpandableSection title="D. Reverse Engineering Beyond Lawful Limits">
                  <Paragraph>
                    Attempting to decompile, reverse engineer, or analyze SquareCampus in ways not
                    permitted by law or by an explicit written agreement.
                  </Paragraph>
                  <BulletList
                    type="x"
                    items={[
                      "Decompiling client software or analyzing proprietary code",
                      "Inferring database schemas or internal architecture inference",
                      "Reconstructing non-public workflows from network traffic",
                    ]}
                  />
                </ExpandableSection>

                <ExpandableSection title="E. Induced Disclosure or Breach of Confidence">
                  <Paragraph>
                    Inducing employees, customers, or vendors to disclose confidential or
                    proprietary information.
                  </Paragraph>
                  <BulletList
                    type="x"
                    items={[
                      "Offering incentives for non-public details",
                      "Requesting contract, pricing, or roadmap details",
                      "Soliciting customer lists or implementation specifics",
                    ]}
                  />
                </ExpandableSection>

                <ExpandableSection title="F. Social Engineering and Impersonation">
                  <Paragraph>
                    Manipulating or pressuring people to bypass normal authorization processes.
                  </Paragraph>
                  <BulletList
                    type="x"
                    items={[
                      "Pretending to be support or compliance personnel",
                      "Creating urgency to extract information",
                      "Using social media or events to elicit confidential details",
                    ]}
                  />
                </ExpandableSection>
              </NoticeSection>

              <NoticeSection
                id="permitted-conduct"
                number={3}
                title="Permitted Competitive Conduct"
                severity="info"
              >
                <InfoBox variant="green">
                  <SubHeading>Fair Competition is Welcome</SubHeading>
                  <Paragraph>
                    We support legitimate and ethical competition. The following activities are
                    generally acceptable:
                  </Paragraph>
                  <BulletList
                    type="check"
                    items={[
                      "Publicly available information from squarecampus.com",
                      "Independent marketing comparisons based on public materials",
                      "RFP responses or procurement processes conducted transparently",
                      "Authorized demos or evaluations through our official channels",
                      "Independent analysis that does not involve unauthorized access",
                    ]}
                  />
                </InfoBox>
                <Paragraph>
                  If you are unsure whether a planned activity is acceptable, contact us at{" "}
                  <a className={linkClassName} href="mailto:legal@squarecampus.com">
                    legal@squarecampus.com
                  </a>
                  .
                </Paragraph>
              </NoticeSection>

              <NoticeSection
                id="legal-basis"
                number={4}
                title="Legal Basis (India)"
                severity="critical"
              >
                <Paragraph>
                  This notice is grounded in Indian law. The references below are non-exhaustive and
                  apply as amended from time to time.
                </Paragraph>

                <SubHeading>Key statutes and authorities</SubHeading>
                <ul className="my-4 space-y-2 text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span
                      className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-500"
                      aria-hidden="true"
                    />
                    <span>
                      <a
                        className={linkClassName}
                        href="https://www.indiacode.nic.in/handle/123456789/15442?view_type=browse"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Information Technology Act, 2000 (as amended)
                      </a>
                      : Sections 43, 66, 66B, 66C, and 66D address unauthorized access, computer
                      related offences, receipt of stolen computer resources, identity theft, and
                      cheating by personation using computer resources.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span
                      className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-500"
                      aria-hidden="true"
                    />
                    <span>
                      <a
                        className={linkClassName}
                        href="https://www.indiacode.nic.in/handle/123456789/22037?view_type=browse"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Digital Personal Data Protection Act, 2023
                      </a>
                      : establishes obligations for handling personal data and creates the Data
                      Protection Board of India.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span
                      className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-500"
                      aria-hidden="true"
                    />
                    <span>
                      <a
                        className={linkClassName}
                        href="https://www.indiacode.nic.in/handle/123456789/12850?view_type=browse"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Indian Penal Code, 1860
                      </a>{" "}
                      and{" "}
                      <a
                        className={linkClassName}
                        href="https://www.indiacode.nic.in/handle/123456789/21420?view_type=browse"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Bharatiya Nyaya Sanhita, 2023
                      </a>
                      : the penal code in force at the time of conduct may apply to cheating,
                      criminal breach of trust, mischief, and related offences.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span
                      className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-500"
                      aria-hidden="true"
                    />
                    <span>
                      <a
                        className={linkClassName}
                        href="https://www.indiacode.nic.in/handle/123456789/1367?view_type=browse"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Copyright Act, 1957
                      </a>{" "}
                      /{" "}
                      <a
                        className={linkClassName}
                        href="https://www.indiacode.nic.in/handle/123456789/1993?view_type=browse"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Trade Marks Act, 1999
                      </a>{" "}
                      /{" "}
                      <a
                        className={linkClassName}
                        href="https://www.indiacode.nic.in/handle/123456789/1392?view_type=browse"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Patents Act, 1970
                      </a>
                      : protect SquareCampus intellectual property where applicable.
                    </span>
                  </li>
                </ul>

                <InfoBox variant="blue">
                  <Paragraph>
                    India does not have a standalone trade secrets statute. Confidential information
                    is protected through contracts and breach of confidence principles under Indian
                    law.
                  </Paragraph>
                </InfoBox>
              </NoticeSection>

              <NoticeSection
                id="potential-remedies"
                number={5}
                title="Potential Remedies"
                severity="high"
              >
                <Paragraph>
                  Where violations occur, we may pursue remedies available under law, subject to
                  facts and legal process.
                </Paragraph>
                <SubHeading>Civil Remedies</SubHeading>
                <BulletList
                  type="default"
                  items={[
                    "Injunctive relief to stop access or use",
                    "Compensation and damages determined by a court",
                    "Account of profits and delivery up of infringing materials",
                    "Orders for preservation of evidence and forensic examination",
                    "Recovery of costs where permitted by law",
                  ]}
                />

                <SubHeading>Criminal and Regulatory Routes</SubHeading>
                <BulletList
                  type="default"
                  items={[
                    "Criminal complaints under applicable provisions of the IT Act",
                    "Notifications to regulators or authorities where legally required",
                    "Customer and partner notifications for security and compliance",
                  ]}
                />
              </NoticeSection>

              <NoticeSection
                id="criminal-exposure"
                number={6}
                title="Criminal Law Exposure (Where Applicable)"
                severity="critical"
              >
                <WarningBox title="Criminal Liability Warning" severity="critical">
                  <Paragraph>
                    Unauthorized access and related conduct may constitute criminal offences. We may
                    file complaints and cooperate with law enforcement where appropriate.
                  </Paragraph>
                </WarningBox>

                <SubHeading>Information Technology Act, 2000</SubHeading>

                <ExpandableSection title="Section 66: Computer Related Offences">
                  <BulletList
                    type="default"
                    items={[
                      "Applies when acts in Section 43 are done dishonestly or fraudulently",
                      "Punishable with imprisonment and/or fine as prescribed by law",
                      "May cover unauthorized access using stolen or induced credentials",
                    ]}
                  />
                </ExpandableSection>

                <ExpandableSection title="Section 66B: Receiving Stolen Computer Resource">
                  <BulletList
                    type="default"
                    items={[
                      "Receiving or retaining data obtained through unauthorized access",
                      "Punishable with imprisonment and/or fine as prescribed by law",
                      "Applies to both accessor and downstream recipients",
                    ]}
                  />
                </ExpandableSection>

                <ExpandableSection title="Section 66C: Identity Theft">
                  <BulletList
                    type="default"
                    items={[
                      "Fraudulent use of another person's electronic identity",
                      "Punishable with imprisonment and/or fine as prescribed by law",
                      "Applies to impersonation and fake account creation",
                    ]}
                  />
                </ExpandableSection>

                <ExpandableSection title="Section 66D: Cheating by Personation">
                  <BulletList
                    type="default"
                    items={[
                      "Cheating by personation using computer resources",
                      "Punishable with imprisonment and/or fine as prescribed by law",
                      "Applies to misrepresentation to gain access or data",
                    ]}
                  />
                </ExpandableSection>

                <SubHeading>Penal Code in Force</SubHeading>
                <Paragraph>
                  The penal code in force at the time of conduct (currently the Bharatiya Nyaya
                  Sanhita, 2023, which replaces the Indian Penal Code, 1860 and has an enforcement
                  date of July 1, 2024 as per India Code) may apply to offences such as cheating,
                  criminal breach of trust, and mischief, depending on facts.
                </Paragraph>
              </NoticeSection>

              <NoticeSection
                id="regulatory-notifications"
                number={7}
                title="Regulatory and Industry Notifications"
                severity="high"
              >
                <Paragraph>
                  Where required by law or necessary to protect customers, we may notify regulators
                  and relevant organizations.
                </Paragraph>

                <SubHeading>Government and Regulatory Authorities</SubHeading>
                <ul className="my-4 space-y-2 text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span
                      className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-500"
                      aria-hidden="true"
                    />
                    <span>
                      <a
                        className={linkClassName}
                        href="https://www.indiacode.nic.in/handle/123456789/22037?view_type=browse"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Data Protection Board of India (DPDP Act 2023)
                      </a>{" "}
                      notifications may be made as applicable to personal data incidents.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span
                      className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-500"
                      aria-hidden="true"
                    />
                    <span>
                      <a
                        className={linkClassName}
                        href="https://www.meity.gov.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ministry of Electronics and Information Technology (MeitY)
                      </a>{" "}
                      and other competent authorities, where legally required.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span
                      className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-500"
                      aria-hidden="true"
                    />
                    <span>
                      <a
                        className={linkClassName}
                        href="https://www.cert-in.org.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        CERT-In
                      </a>{" "}
                      notifications may be made for qualifying cyber incidents.
                    </span>
                  </li>
                </ul>

                <SubHeading>Industry Bodies (Discretionary)</SubHeading>
                <ul className="my-4 space-y-2 text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span
                      className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-500"
                      aria-hidden="true"
                    />
                    <span>
                      <a
                        className={linkClassName}
                        href="https://nasscom.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        NASSCOM
                      </a>{" "}
                      and{" "}
                      <a
                        className={linkClassName}
                        href="https://www.iamai.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        IAMAI
                      </a>{" "}
                      may be notified where their codes of conduct apply; any action is at their
                      discretion.
                    </span>
                  </li>
                </ul>
              </NoticeSection>

              <NoticeSection
                id="evidence-preservation"
                number={8}
                title="Evidence Preservation and Monitoring"
                severity="info"
              >
                <Paragraph>
                  We collect and preserve security logs in the ordinary course of business to
                  protect our platform and customers and to comply with legal obligations.
                </Paragraph>

                <SubHeading>Examples of data retained</SubHeading>
                <BulletList
                  type="default"
                  items={[
                    "Access timestamps, IP addresses, and session identifiers",
                    "Authentication and authorization events",
                    "API activity, rate limiting, and anomaly detections",
                    "Security alerts, incident response records, and support communications",
                  ]}
                />

                <SubHeading>Retention and integrity</SubHeading>
                <BulletList
                  type="default"
                  items={[
                    "Retention periods depend on legal requirements and business needs",
                    "Logs may be preserved under legal hold when incidents are suspected",
                    "Chain-of-custody practices may be used for evidentiary purposes",
                  ]}
                />
              </NoticeSection>

              <NoticeSection
                id="individual-responsibility"
                number={9}
                title="Individual Responsibility"
                severity="high"
              >
                <WarningBox title="Personal Exposure" severity="warning">
                  <Paragraph>
                    Individuals who participate in unauthorized access or misuse may face personal
                    civil or criminal exposure. Corporate affiliation does not immunize individuals
                    from legal process.
                  </Paragraph>
                </WarningBox>

                <SubHeading>Roles that commonly create exposure</SubHeading>
                <BulletList
                  type="default"
                  items={[
                    "Sales representatives soliciting access or screenshots",
                    "Marketing or research staff directing deceptive inquiries",
                    "Product teams requesting reverse engineering or scraping",
                    "Executives approving or benefiting from unauthorized access",
                    "Consultants or contractors acting on behalf of a competitor",
                  ]}
                />
              </NoticeSection>

              <NoticeSection
                id="proper-evaluation"
                number={10}
                title="Proper Evaluation Channels"
                severity="info"
              >
                <InfoBox variant="green">
                  <Strong>We support fair and transparent evaluation.</Strong>
                </InfoBox>

                <SubHeading>Step 1: Honest Contact</SubHeading>
                <BulletList
                  type="default"
                  items={[
                    "Email: sales@squarecampus.com",
                    'Subject: "Competitor Evaluation Request"',
                    "Disclose your company name and competing products",
                    "Describe the scope and purpose of the evaluation",
                  ]}
                />

                <SubHeading>Step 2: NDA (if appropriate)</SubHeading>
                <BulletList
                  type="default"
                  items={[
                    "We may require a mutual NDA before sharing non-public information",
                    "Scope, duration, and permitted use will be clearly documented",
                  ]}
                />

                <SubHeading>Step 3: Controlled Demonstration</SubHeading>
                <BulletList
                  type="default"
                  items={[
                    "A time-limited demo environment (no customer data)",
                    "Access supervised by a SquareCampus representative",
                    "Documented limitations on use and disclosure",
                  ]}
                />

                <SubHeading>What we will not provide</SubHeading>
                <BulletList
                  type="x"
                  items={[
                    "Access to customer production environments",
                    "Customer contact lists or confidential pricing",
                    "Source code, internal architecture diagrams, or private APIs",
                    "Unsupervised or indefinite access",
                  ]}
                />
              </NoticeSection>

              <NoticeSection
                id="voluntary-disclosure"
                number={11}
                title="Voluntary Disclosure and Mitigation"
                severity="high"
              >
                <Paragraph>
                  If you believe you have engaged in prohibited conduct, prompt disclosure may be
                  considered in any resolution. This does not waive any rights or remedies.
                </Paragraph>

                <SubHeading>Recommended steps</SubHeading>
                <BulletList
                  type="default"
                  items={[
                    "Cease any further access or use immediately",
                    "Preserve relevant evidence and avoid further dissemination",
                    "Notify us at legal@squarecampus.com with a factual description",
                  ]}
                />

                <InfoBox variant="teal">
                  <Paragraph>
                    Voluntary disclosure does not guarantee leniency. We evaluate responses based on
                    facts, scope, and legal obligations.
                  </Paragraph>
                </InfoBox>
              </NoticeSection>

              <NoticeSection
                id="confidential-reporting"
                number={12}
                title="Confidential Reporting"
                severity="info"
              >
                <Paragraph>
                  If you have information about unethical competitive practices, you may report it
                  confidentially.
                </Paragraph>
                <BulletList
                  type="default"
                  items={[
                    "Email: whistleblower@squarecampus.com",
                    "Encrypted communications supported (PGP key at squarecampus.com/pgp)",
                    "Anonymous tips are accepted; include verifiable details",
                  ]}
                />
                <Paragraph>
                  We handle reports discreetly and to the extent permitted by law. Any rewards are
                  discretionary and subject to legal constraints.
                </Paragraph>
              </NoticeSection>

              <NoticeSection
                id="no-waiver"
                number={13}
                title="No Waiver; Reservation of Rights"
                severity="info"
              >
                <Paragraph>
                  Fairhelm Systems (OPC) Private Limited reserves all rights and remedies. Any delay
                  or failure to enforce a right is not a waiver of that right or any other.
                </Paragraph>
              </NoticeSection>

              <NoticeSection
                id="governing-law"
                number={14}
                title="Governing Law and Jurisdiction"
                severity="info"
              >
                <Paragraph>
                  This notice is governed by Indian law. Subject to mandatory requirements, courts
                  in Bengaluru, Karnataka, India have jurisdiction.
                </Paragraph>
              </NoticeSection>

              <NoticeSection
                id="no-legal-advice"
                number={15}
                title="Informational Notice; No Legal Advice"
                severity="info"
              >
                <Paragraph>
                  This notice is informational and does not constitute legal advice. For legal
                  advice regarding your specific situation, consult qualified counsel.
                </Paragraph>
              </NoticeSection>
            </div>

            {/* Sidebar TOC - Desktop only */}
            <TableOfContentsSidebar />
          </div>
        </div>

        <ReportingCTA />
        <EvidenceFooter />
      </main>
    </>
  );
}
