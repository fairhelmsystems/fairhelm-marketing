// LEGAL: substantive changes to this document require legal sign-off.

import { company } from "@fairhelm/squarecampus-content/company";
import { Separator } from "@fairhelm/ui/components/separator";
import type { Metadata } from "next";
import { EntityIdentity, LegalSection, LegalShell } from "@/components/legal/legal-shell";
import { PageSchema } from "@/components/site/page-schema";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Cancellation and Refund Policy",
  description:
    "How SquareCampus subscriptions and engagements are cancelled, when fees are refundable, how to request a refund, and how approved refunds are paid.",
  path: "/squarecampus/refund-policy",
  ogDescription: "Cancellation terms, refund eligibility, and how approved refunds are paid.",
});

const contents = [
  { label: "Company & Scope", href: "#company-scope" },
  { label: "Subscription Cancellation", href: "#subscriptions" },
  { label: "Implementation and Services", href: "#services" },
  { label: "How to Request a Cancellation or Refund", href: "#how-to-request" },
  { label: "How Approved Refunds Are Paid", href: "#how-refunds-are-paid" },
  { label: "Disputes", href: "#disputes" },
];

export default function RefundPolicyPage() {
  return (
    <>
      <PageSchema
        name="Cancellation and Refund Policy"
        description="How cancellation, renewal and refunds work for SquareCampus institutional licences and scoped implementation work."
        path="/squarecampus/refund-policy"
      />
      <LegalShell
        title="Cancellation and Refund Policy"
        current="/refund-policy/"
        contents={contents}
        description="How a subscription or engagement is cancelled, what is refundable, and how an approved refund reaches you."
      >
        <div className="space-y-10">
          <LegalSection title="1. Company & Scope" id="company-scope">
            <EntityIdentity documentNoun="this Policy" />
            <p>
              SquareCampus is sold to institutions under signed agreements — subscriptions,
              implementation and rollout work, and data or integration services. There is no
              self-service checkout, and no purchase can be completed on this website.
            </p>
            <p>
              This page states the default position. Where a signed order form, subscription
              agreement, or statement of work sets different cancellation, refund, or termination
              terms, that signed document controls for its subject matter.
            </p>
          </LegalSection>

          <LegalSection title="2. Subscription Cancellation" id="subscriptions">
            <p>
              Subscription terms run for the period stated in the order form and renew only as that
              document provides.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                An Institution may cancel at any time by written notice, effective at the end of the
                current paid term.
              </li>
              <li>
                Notice given at least thirty days before a renewal date stops that renewal. Notice
                given later takes effect at the end of the following term.
              </li>
              <li>
                Fees already paid for the current term are not refunded on cancellation for
                convenience, and the Service remains available until the term ends.
              </li>
              <li>
                Where SquareCampus materially fails to provide the Service and does not remedy the
                failure within a reasonable cure period after written notice, the Institution may
                terminate and receive a pro-rata refund of fees paid for the unserved remainder of
                the term.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="3. Implementation and Services" id="services">
            <p>
              Rollout, implementation, migration, integration, and support engagements are quoted
              and invoiced against a statement of work.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Work billed on a time-and-materials basis is payable for effort delivered up to the
                effective date of cancellation; unearned advances are refunded.
              </li>
              <li>
                Milestone-based work is payable for milestones accepted before cancellation. Amounts
                paid against a milestone that was neither delivered nor accepted are refunded.
              </li>
              <li>
                Non-recoverable third-party costs already committed on the Institution's instruction
                — licences, cloud commitments, hardware — are not refundable, and are itemised in
                the final reconciliation.
              </li>
              <li>
                On termination, customer data is returned or deleted as the applicable agreement and
                the Data Processing Addendum require, regardless of any fee dispute.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="4. How to Request a Cancellation or Refund" id="how-to-request">
            <p>
              Send a written request from an authorised institutional contact to{" "}
              <a href={`mailto:${company.email.general}`}>{company.email.general}</a>, or by post to
              the registered office above. Include the Institution name, the agreement or invoice
              reference, the effective date sought, and the reason.
            </p>
            <p>
              We acknowledge a request within three working days and confirm the outcome, with a
              reconciliation of amounts due or refundable, within fifteen working days of receiving
              the information needed to assess it.
            </p>
          </LegalSection>

          <LegalSection title="5. How Approved Refunds Are Paid" id="how-refunds-are-paid">
            <p>
              Approved refunds are paid to the originating bank account or payment instrument used
              for the original payment, in the currency of the original invoice. We do not issue
              refunds in cash or to a third-party account.
            </p>
            <p>
              Refunds are initiated within seven working days of approval. The time taken for the
              amount to reach the account depends on the Institution's bank or payment provider.
            </p>
            <p>
              Refunds are net of applicable taxes and bank charges, and any credit note is issued in
              accordance with applicable GST rules.
            </p>
          </LegalSection>

          <LegalSection title="6. Disputes" id="disputes">
            <p>
              An Institution that disagrees with a cancellation or refund decision may escalate in
              writing to <a href={`mailto:${company.email.general}`}>{company.email.general}</a>. We
              will review the decision and respond with reasons.
            </p>
            <p>
              This Policy is governed by the laws of India. Subject to mandatory requirements, the
              courts in {company.jurisdiction} have jurisdiction, unless the signed agreement
              provides otherwise.
            </p>
          </LegalSection>
        </div>

        <Separator className="mt-10" />
        <p className="text-xs text-muted-foreground">
          This Policy is intended for transparency and does not constitute legal advice.
          Institutions should consult legal counsel to confirm how it interacts with their own
          procurement rules.
        </p>
      </LegalShell>
    </>
  );
}
