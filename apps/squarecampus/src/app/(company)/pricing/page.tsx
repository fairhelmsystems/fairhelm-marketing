import { DatabaseBackup, FlaskConical, Rocket, ShieldCheck } from "lucide-react";
import { planIds, pricingPolicy } from "@fairhelm/squarecampus-content/pricing";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { InfoPopover } from "@fairhelm/ui/components/info-popover";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { EnterpriseValue } from "@/components/pricing/enterprise-value";
import { AicWalkthrough } from "@/components/pricing/aic-walkthrough";
import { PlanMatrix } from "@/components/pricing/plan-matrix";
import { PricingFaqExplorer } from "@/components/pricing/pricing-faq-explorer";
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
              <p>{corePlatform.futureFeatures}</p>
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
        <EnterpriseValue />
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
                <dd>Priced by category and destination; the rate is on your order form</dd>
              </div>
            </dl>
            <details data-md-include>
              <summary>Recipient counts and shared usage</summary>
              <p>
                A long or Unicode SMS may use several billable segments per recipient. At 1,000
                students, the monthly pool can fund recipient emails of {emailExamples} when used
                entirely for email. SMS and email draw from that same pool. WhatsApp is priced by
                category and destination and confirmed on your order form.
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
                <dt>Starter monthly pool</dt>
                <dd>None included; buy prepaid AIC</dd>
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
        mobileDisclosure="Institutional pilots"
        id="pilot"
        title="Evaluate with an agreed scope."
        className="pricing-evaluation"
      >
        <div className="pricing-evaluation-grid">
          <article className="pricing-evaluation-card">
            <FlaskConical aria-hidden className="pricing-evaluation-icon" />
            <h3>{launchPilot.name}</h3>
            <p>{launchPilot.summary}</p>
            <p>{launchPilot.eligibility}</p>
            <details data-md-include>
              <summary>Launch pilot scope and terms</summary>
              {[
                launchPilot.geography,
                launchPilot.scope,
                launchPilot.boundaries,
                launchPilot.pricing,
              ].map((fact) => (
                <p key={fact}>{fact}</p>
              ))}
            </details>
            <ButtonLink
              href={launchPilot.enquiryHref}
              label="Request launch-pilot review"
              variant="secondary"
              className="pricing-evaluation-action"
            />
          </article>
          <article id="founding" className="pricing-evaluation-card">
            <Rocket aria-hidden className="pricing-evaluation-icon" />
            <h3>{foundingProgramme.name}</h3>
            <p>{foundingProgramme.pilot.paidNote}</p>
            <p>Access runs {foundingProgramme.pilot.window} from the agreed activation date.</p>
            <details data-md-include>
              <summary>Founding pilot scope and renewal</summary>
              <p>
                {foundingProgramme.positionsStatement} {foundingProgramme.nature}
              </p>
              <p>
                Renewal is optional at standard annual pricing, with no automatic credit for the
                pilot fee. {launchPilot.separation}
              </p>
            </details>
            <ButtonLink
              href="/launch-partners/"
              label="Review the founding pilot"
              variant="secondary"
              className="pricing-evaluation-action"
            />
          </article>
        </div>
      </SectionShell>
      <SectionShell
        mobileDisclosure="Security and data"
        id="baseline"
        title="Security and institutional data."
        className="pricing-evaluation"
      >
        <div className="pricing-evaluation-grid">
          <article className="pricing-evaluation-card">
            <ShieldCheck aria-hidden className="pricing-evaluation-icon" />
            <h3>Security safeguards</h3>
            <p>{securityBaseline}</p>
          </article>
          <article className="pricing-evaluation-card">
            <DatabaseBackup aria-hidden className="pricing-evaluation-icon" />
            <h3>Data ownership and export</h3>
            <p>{dataPortability}</p>
          </article>
        </div>
      </SectionShell>
      <SectionShell
        mobileDisclosure="Pricing questions"
        id="procurement-faq"
        title="Before you decide."
      >
        <PricingFaqExplorer />
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
