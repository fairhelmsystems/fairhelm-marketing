import { planIds, pricingPolicy } from "@fairhelm/squarecampus-content/pricing";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { DetailsFaq } from "@fairhelm/ui/components/details-faq";
import { InfoPopover } from "@fairhelm/ui/components/info-popover";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { AicWalkthrough } from "@/components/pricing/aic-walkthrough";
import { PlanMatrix } from "@/components/pricing/plan-matrix";
import { PricingStudio } from "@/components/pricing/pricing-studio";
import { ScopedCostGrid } from "@/components/pricing/scoped-cost-grid";
import {
  corePlatform,
  communicationAllowance,
  aicCommercial,
  dataEventsApi,
  dataPortability,
  foundingProgramme,
  launchPilot,
  securityBaseline,
} from "@/content/commercial";
import { pricingFaqs } from "@/content/pricing";
import { formatInr } from "@/lib/pricing-estimate";

export default function PricingPage() {
  const emailExamples = planIds
    .map((plan) => {
      const emails =
        (1000 *
          pricingPolicy.communication.monthlyCreditsPerStudent[plan] *
          pricingPolicy.communication.subcreditsPerCredit) /
        pricingPolicy.communication.recipientEmailSubcredits;
      return `${emails.toLocaleString("en-IN")} on ${pricingPolicy.plans[plan].name}`;
    })
    .join(", ");
  return (
    <main tabIndex={-1} id="main-content" className="pricing-page">
      <SectionShell className="pricing-hero">
        <div className="pricing-hero-grid">
          <div>
            <h1>
              <span className="pricing-title-phrase">Your school.</span>{" "}
              <span className="pricing-title-phrase">One annual price.</span>
            </h1>
            <p>Your annual subscription in INR. See the price before the demo.</p>
          </div>
          <div className="pricing-hero-actions">
            <ButtonLink href="#pricing-studio" label="Calculate pricing" variant="cta" />
            <ButtonLink href="/demo/" label="Book a demo" variant="secondary" />
          </div>
          <div className="pricing-promise">
            <InfoPopover id="pricing-feature-access" label={corePlatform.accessLabel}>
              <p>
                <strong>{corePlatform.promise}</strong>
              </p>
              <p>{corePlatform.included}</p>
              <p>{dataEventsApi.qualification}</p>
            </InfoPopover>
            <p className="pricing-promise-note">{dataEventsApi.optionalServicesNotice}</p>
          </div>
        </div>
      </SectionShell>
      <SectionShell className="pricing-studio-section">
        <PricingStudio />
      </SectionShell>
      <SectionShell
        mobileDisclosure="Plan inclusions"
        id="enterprise-adds"
        title="Same access. Clear allowances."
      >
        <PlanMatrix />
        <p className="type-support mt-6">
          AIC allowances are tenant-wide monthly pools. Additional quantity limits and service-depth
          commitments require approval before publication.
        </p>
      </SectionShell>
      <SectionShell
        mobileDisclosure="Included and optional services"
        id="scoped-separately"
        title={dataEventsApi.principle}
        body={dataEventsApi.summary}
      >
        <p className="type-support mb-6">
          {dataEventsApi.catalogue} {dataEventsApi.availability}
        </p>
        <ScopedCostGrid />
        <p id="proposal" className="type-support mt-6">
          Custom integrations, institution-specific documents, private deployment and custom SLAs
          receive a separate written scope. Public rates cover the standard managed-cloud
          subscription.
        </p>
      </SectionShell>
      <SectionShell
        mobileDisclosure="AI and communication credits"
        id="usage"
        title="Two wallets. Clearly accounted."
      >
        <div className="pricing-wallets">
          <article>
            <h3>Shared communication credits</h3>
            <p>
              {communicationAllowance} Credits are shared across authorised senders and channels.
              Included credits reset at the contractual monthly cycle; purchased balances carry
              forward.
            </p>
            <dl>
              <div>
                <dt>Extra purchased credit</dt>
                <dd>{formatInr(pricingPolicy.communication.purchasedCreditPaise)}</dd>
              </div>
              <div>
                <dt>One billable SMS recipient segment</dt>
                <dd>1 credit</dd>
              </div>
              <div>
                <dt>Three recipient emails</dt>
                <dd>1 credit</dd>
              </div>
              <div>
                <dt>WhatsApp</dt>
                <dd>Category and destination tariff pending</dd>
              </div>
            </dl>
            <details data-md-include>
              <summary>Recipient counts and shared usage</summary>
              <p>
                A long or Unicode SMS may use several billable segments per recipient. At 1,000
                students, the monthly pool can fund recipient emails of {emailExamples} when used
                entirely for email. SMS, email and eligible WhatsApp traffic draw from that same
                pool. WhatsApp weights require an approved category and destination rate card.
              </p>
              <p>
                Central SquareCampus email transport uses platform sender configuration. It needs no
                customer mailbox or paid mailbox per sender. Administrator opt-in and a spend cap
                are required for paid automatic overage. Essential security and recovery
                notifications need a separately defined policy.
              </p>
            </details>
          </article>
          <article>
            <h3>AEGIS AI Credits (AIC)</h3>
            <p>
              Authorised staff share a tenant-wide AI consumption pool. Staff accounts have no
              separate per-staff licence charge. AIC usage varies with the operation.
            </p>
            <dl>
              <div>
                <dt>Starter draft pool</dt>
                <dd>0 AIC/month, proposed</dd>
              </div>
              <div>
                <dt>Growth monthly pool</dt>
                <dd>
                  {(pricingPolicy.plans.pro.monthlyIncludedMilliAic / 1000).toLocaleString("en-IN")}{" "}
                  AIC/month
                </dd>
              </div>
              <div>
                <dt>Enterprise monthly pool</dt>
                <dd>
                  {(pricingPolicy.plans.enterprise.monthlyIncludedMilliAic / 1000).toLocaleString(
                    "en-IN"
                  )}{" "}
                  AIC/month
                </dd>
              </div>
              <div>
                <dt>Minimum prepaid purchase</dt>
                <dd>
                  {pricingPolicy.aic.minimumPurchaseCredits.toLocaleString("en-IN")} AIC for{" "}
                  {formatInr(
                    pricingPolicy.aic.minimumPurchaseCredits *
                      pricingPolicy.aic.volumeBands[0].unitPricePaise
                  )}{" "}
                  + GST
                </dd>
              </div>
            </dl>
            <details data-md-include>
              <summary>How AI credits work</summary>
              <p>{aicCommercial.wallet}</p>
            </details>
            <p>{aicCommercial.operations}</p>
            <p>
              <a href="#aic-packs" className="underline underline-offset-4">
                Calculate a custom AIC purchase
              </a>
            </p>
          </article>
        </div>
        <AicWalkthrough />
      </SectionShell>
      <SectionShell
        mobileDisclosure="Pilot, security and data"
        id="pilot"
        title="Evaluate with an agreed scope."
      >
        <details className="pricing-programme" data-md-include>
          <summary>{launchPilot.name}</summary>
          {[
            launchPilot.summary,
            launchPilot.eligibility,
            launchPilot.geography,
            launchPilot.scope,
            launchPilot.boundaries,
            launchPilot.pricing,
            launchPilot.separation,
          ].map((fact) => (
            <p key={fact}>{fact}</p>
          ))}
          <ButtonLink
            href={launchPilot.enquiryHref}
            label="Request launch-pilot review"
            variant="secondary"
          />
        </details>
        <details className="pricing-programme" data-md-include>
          <summary>{foundingProgramme.name}</summary>
          <p>
            {foundingProgramme.positionsStatement} {foundingProgramme.nature}
          </p>
          <p>{foundingProgramme.pilot.paidNote}</p>
          <p>
            Founding pilots run for {foundingProgramme.pilot.window}, with the choice to convert,
            extend or stop.
          </p>
          <ButtonLink
            href="/launch-partners/"
            label="Review founding partnerships"
            variant="secondary"
          />
        </details>
        <div id="baseline" className="pricing-baseline">
          <h3>Security and institutional data</h3>
          <p>{securityBaseline}</p>
          <p>{dataPortability}</p>
        </div>
      </SectionShell>
      <SectionShell
        mobileDisclosure="Pricing questions"
        id="procurement-faq"
        title="Before you decide."
      >
        <DetailsFaq items={pricingFaqs} className="pricing-faq" />
      </SectionShell>
      <SectionShell id="request-proposal" className="pricing-close">
        <div className="pricing-close-row">
          <h2 className="type-section-title">See SquareCampus at work.</h2>
          <ButtonLink href="/demo/" label="Book a demo" variant="cta" />
        </div>
      </SectionShell>
    </main>
  );
}
