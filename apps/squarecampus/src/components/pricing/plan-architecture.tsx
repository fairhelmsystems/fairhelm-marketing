"use client";

import {
  calculateLicence,
  pricingPolicy,
  type recommendPlan,
} from "@fairhelm/squarecampus-content/pricing";
import { Button } from "@fairhelm/ui/components/button";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { Badge } from "@fairhelm/ui/components/badge";
import { planIcons } from "@/components/pricing/plan-icons";
import type { PlanId } from "@/content/commercial";
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
                <span className="pricing-plan-selected">Selected</span>
              ) : null}
            </div>
            <div className="pricing-plan-cost">
              <p className="pricing-plan-price">
                {licence ? formatInr(licence.annualLicencePaise) : "Enter a valid count"}
              </p>
              <p className="type-support">
                {licence && students
                  ? `${formatInrRatio(licence.annualLicencePaise, students)} per student/year. Billed annually.`
                  : "Annual licence, excluding GST."}
              </p>
            </div>
            <p className="type-support pricing-plan-purpose">{plan.suitedFor}</p>
            <dl className="pricing-plan-facts">
              <div>
                <dt>AIC each month</dt>
                <dd>{formatAic(pricingPolicy.plans[plan.id].monthlyIncludedMilliAic)}</dd>
              </div>
              <div>
                <dt>Communication credits/month</dt>
                <dd>
                  {students === null
                    ? "—"
                    : (
                        students * pricingPolicy.communication.monthlyCreditsPerStudent[plan.id]
                      ).toLocaleString("en-IN")}
                </dd>
              </div>
              <div>
                <dt>Optional Entra SSO</dt>
                <dd>
                  {plan.id === "enterprise" ? (
                    <Badge variant="secondary">SSO included</Badge>
                  ) : (
                    `${formatInr(pricingPolicy.addOns.entraSsoAnnualPaise[plan.id])}/year`
                  )}
                </dd>
              </div>
              {projection && (
                <div data-testid={`projection-${plan.id}`}>
                  <dt>Purchase-year estimate</dt>
                  <dd>
                    {!projection.fixed.eligible
                      ? "Selected services unavailable"
                      : projection.firstYearExpectedPaise === null
                        ? "Incomplete price"
                        : formatInr(projection.firstYearExpectedPaise)}
                  </dd>
                </div>
              )}
            </dl>
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
          </article>
        );
      })}
    </div>
  );
}
