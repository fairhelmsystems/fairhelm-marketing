import {
  calculateAicPurchase,
  calculateFixedEstimate,
  calculateLicence,
  noAddOns,
  pricingPolicy,
} from "@fairhelm/squarecampus-content/pricing";
import { commercialScope } from "@/content/commercial";
import { formatInr } from "@/lib/pricing-estimate";

const STUDENTS = 1200;

/** List-rate reference for an institution using the additional monthly pools. */
export function EnterpriseValue() {
  const { plans, communication, addOns } = pricingPolicy;
  const premiumPaise =
    calculateLicence("enterprise", STUDENTS).annualLicencePaise -
    calculateLicence("pro", STUDENTS).annualLicencePaise;
  const growth = calculateFixedEstimate("pro", STUDENTS, {
    ...noAddOns,
    sso: true,
    whiteLabel: true,
  });
  const enterprise = calculateFixedEstimate("enterprise", STUDENTS, {
    ...noAddOns,
    sso: true,
    whiteLabel: true,
  });
  const brandingPaise = growth.newBrandingPaise - enterprise.newBrandingPaise;
  const extraAic =
    ((plans.enterprise.monthlyIncludedMilliAic - plans.pro.monthlyIncludedMilliAic) / 1000) * 12;
  const aicPaise = calculateAicPurchase(extraAic).totalPaise;
  const extraCredits =
    (communication.monthlyCreditsPerStudent.enterprise -
      communication.monthlyCreditsPerStudent.pro) *
    STUDENTS *
    12;
  const creditsPaise = extraCredits * communication.purchasedCreditPaise;
  const ssoPaise = growth.annualSsoPaise - enterprise.annualSsoPaise;
  const recurringValuePaise = aicPaise + creditsPaise + ssoPaise;
  const rows = [
    {
      label: "Extra AEGIS AI Credits",
      detail: `${extraAic.toLocaleString("en-IN")} AIC across 12 monthly grants, valued as one prepaid purchase at published bands`,
      paise: aicPaise,
    },
    {
      label: "White-label Android and iOS apps",
      detail: "One-time setup included, valued for a first branding purchase",
      paise: brandingPaise,
    },
    {
      label: "Extra communication credits",
      detail: `${extraCredits.toLocaleString("en-IN")} credits across 12 monthly grants, at the purchased-credit rate`,
      paise: creditsPaise,
    },
    {
      label: "Microsoft Entra SSO",
      detail: "Included annually. Optional activation",
      paise: ssoPaise,
    },
  ];
  return (
    <div className="enterprise-value surface-panel-strong mt-8 rounded-[var(--radius-panel-lg)] p-6 sm:p-8">
      <h3 className="type-card-title">What Enterprise adds, in rupees.</h3>
      <p className="type-support mt-2">
        At {STUDENTS.toLocaleString("en-IN")} students, the Enterprise annual licence premium over
        Growth is <strong>{formatInr(premiumPaise)}</strong>, before GST. This list-rate reference
        assumes you need first-time branding and use the additional monthly pools.
      </p>
      <dl className="pricing-line-items mt-4">
        {rows.map(({ label, detail, paise }) => (
          <div key={label}>
            <dt>
              {label}
              <span className="type-support block">{detail}</span>
            </dt>
            <dd>{formatInr(paise)}</dd>
          </div>
        ))}
        <div>
          <dt>First-year included value at list rates</dt>
          <dd data-testid="enterprise-first-year-value">
            <strong>{formatInr(recurringValuePaise + brandingPaise)}</strong>
          </dd>
        </div>
        <div>
          <dt>Recurring included value at list rates</dt>
          <dd data-testid="enterprise-recurring-value">
            <strong>{formatInr(recurringValuePaise)}</strong>
          </dd>
        </div>
      </dl>
      <p className="type-support mt-4">
        The optional Data &amp; Events API costs{" "}
        {formatInr(addOns.annualDataEventsApiPaise.enterprise)}/year on Enterprise at{" "}
        {pricingPolicy.dataEventsApi.slidingWindows.enterprise.requests.toLocaleString("en-IN")}{" "}
        RPM, and {formatInr(addOns.annualDataEventsApiPaise.pro)}/year on Growth at{" "}
        {pricingPolicy.dataEventsApi.slidingWindows.pro.requests.toLocaleString("en-IN")} RPM.{" "}
        {commercialScope.customAegisDashboards} Included AIC expires each month, so its value
        depends on use.
      </p>
    </div>
  );
}
