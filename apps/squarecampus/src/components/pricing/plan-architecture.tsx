"use client";

import {
  calculateLicence,
  pricingPolicy,
  type recommendPlan,
} from "@fairhelm/squarecampus-content/pricing";
import { Button } from "@fairhelm/ui/components/button";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { RetentionPointer } from "@/components/pricing/retention-pointer";
import { planIcons } from "@/components/pricing/plan-icons";
import { corePlatform, type PlanId } from "@/content/commercial";
import { plans } from "@/content/pricing";
import { formatAic, formatInr, formatInrRatio } from "@/lib/pricing-estimate";

export function PlanArchitecture({
  students = 1200,
  selectedPlan,
  onSelect,
  projections,
}: {
  students?: number | null;
  selectedPlan?: PlanId;
  onSelect?: (plan: PlanId) => void;
  projections?: ReturnType<typeof recommendPlan>["candidates"];
}) {
  return (
    <div className="pricing-plan-grid">
      {plans.map((plan) => {
        const Icon = planIcons[plan.id];
        const licence = students === null ? null : calculateLicence(plan.id, students);
        const projection = projections?.find((candidate) => candidate.plan === plan.id);
        return (
          <article
            id={`plan-${plan.id}`}
            key={plan.id}
            className="pricing-plan"
            data-plan={plan.id}
            data-selected={selectedPlan === plan.id}
          >
            <div className="pricing-plan-heading">
              <h3 className="pricing-plan-name">
                <Icon aria-hidden className="size-6" />
                {plan.name}
              </h3>
              {selectedPlan === plan.id ? (
                <span>Selected</span>
              ) : plan.id === "enterprise" ? (
                <span>SSO included</span>
              ) : null}
            </div>
            <p className="pricing-plan-price">
              {licence ? formatInr(licence.annualLicencePaise) : "Enter a valid count"}
            </p>
            <p className="type-support">
              {licence && students
                ? `${formatInrRatio(licence.annualLicencePaise, students)} per student/year. Billed annually.`
                : "Annual licence, excluding GST."}
            </p>
            <p className="pricing-plan-pool">
              {formatAic(pricingPolicy.plans[plan.id].monthlyIncludedMilliAic)} draft AIC/month
            </p>
            <p className="type-support pricing-plan-sso">
              {plan.id === "enterprise"
                ? "Microsoft Entra SSO included. Activate it if your institution needs it."
                : `Optional Microsoft Entra SSO ${formatInr(pricingPolicy.addOns.entraSsoAnnualPaise[plan.id])}/year.`}
            </p>
            <p className="type-support">{plan.suitedFor}</p>
            {projection && (
              <div className="type-support" data-testid={`projection-${plan.id}`}>
                <p>
                  Conditional purchase-year spend{" "}
                  <strong>
                    {!projection.fixed.eligible
                      ? "Selected services unavailable"
                      : projection.firstYearExpectedPaise === null
                        ? "Incomplete price"
                        : formatInr(projection.firstYearExpectedPaise)}
                  </strong>
                </p>
                {projection.aic?.forecast && (
                  <p>
                    Purchased AIC left{" "}
                    <strong>{formatAic(projection.aic.forecast.closingPurchasedMilliAic)}</strong>
                  </p>
                )}
              </div>
            )}
            <p className="type-support pricing-plan-scope">
              {plan.id === "starter"
                ? "Zero included AIC is proposed. Migration is separately quoted."
                : "Shared tenant AI pool, pending confirmation. Best-effort migration included."}
            </p>
            {onSelect ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => onSelect(plan.id)}
                aria-pressed={selectedPlan === plan.id}
              >
                Choose {plan.name}
              </Button>
            ) : (
              <ButtonLink href={plan.cta.href} label={plan.cta.label} variant="secondary" />
            )}
            <details data-md-include>
              <summary>Included in {plan.name}</summary>
              <section aria-label={`${plan.name} plan details`}>
                <p>{corePlatform.included}</p>
                <p>{corePlatform.multiCampus}</p>
                <ul>
                  {plan.capabilities.map((capability) => (
                    <li key={capability}>{capability}</li>
                  ))}
                </ul>
                <p>{corePlatform.availability}</p>
                <RetentionPointer />
              </section>
            </details>
          </article>
        );
      })}
    </div>
  );
}
