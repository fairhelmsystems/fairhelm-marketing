"use client";

import { Copy, Printer } from "lucide-react";
import { useEffect, useReducer, useState } from "react";
import {
  planIds,
  pricingPolicy,
  publicEstimateTax,
  publicDataEventsApiPricing,
} from "@fairhelm/squarecampus-content/pricing";
import { Button } from "@fairhelm/ui/components/button";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { Checkbox } from "@fairhelm/ui/components/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@fairhelm/ui/components/field";
import { ResponsiveDisclosure } from "@fairhelm/ui/components/responsive-disclosure";
import { Input } from "@fairhelm/ui/components/input";
import { ToggleGroup, ToggleGroupItem } from "@fairhelm/ui/components/toggle-group";
import { PlanArchitecture } from "@/components/pricing/plan-architecture";
import { AicPurchasePicker } from "@/components/pricing/aic-pack-picker";
import { QuantityField } from "@/components/pricing/quantity-field";
import { EstimateAssumptions } from "@/components/pricing/estimate-assumptions";
import { planIcons } from "@/components/pricing/plan-icons";
import { mobileAppPublishing, type PlanId } from "@/content/commercial";
import {
  decodeEstimate,
  encodeEstimate,
  formatAic,
  formatInr,
  formatInrRatio,
  getStudioEstimate,
  initialStudioState,
  studioReducer,
  type StudioInputs,
} from "@/lib/pricing-estimate";

export function PricingStudio() {
  const [state, dispatch] = useReducer(studioReducer, initialStudioState);
  const [restoreNotice, setRestoreNotice] = useState("");
  const [shareNotice, setShareNotice] = useState("");
  const [shareFallback, setShareFallback] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const estimate = getStudioEstimate(state);
  const { selected, recommendation } = estimate;
  const selectedPlan = selected?.plan ?? state.plan;
  const planName = pricingPolicy.plans[selectedPlan].name;
  const PlanIcon = planIcons[selectedPlan];
  const knownLowestName = recommendation?.plan
    ? pricingPolicy.plans[recommendation.plan].name
    : "Starter";
  const status = recommendation?.status;
  const incompatibleAddOns = selected?.fixed.unavailableAddOns ?? [];
  const incompatibilityMessage = incompatibleAddOns.length
    ? `${incompatibleAddOns.map((addOn) => (addOn === "sso" ? "Microsoft Entra SSO" : "White-label apps")).join(" and ")} require Growth or Enterprise. Choose a compatible plan or deselect the add-on.`
    : "";
  const canQuote = Boolean(selected?.fixed.eligible);
  const apiPriceMissing = selected?.fixed.annualDataEventsApiPaise === null;
  const apiAnnualPrice = publicDataEventsApiPricing.annualDataEventsApiPaise[selectedPlan];
  const apiPlanWindow = publicDataEventsApiPricing.slidingWindows[selectedPlan];
  const apiWindowSeconds = publicDataEventsApiPricing.slidingWindows.starter?.windowSeconds;
  const canEnterApiPeak =
    apiWindowSeconds !== undefined &&
    planIds.every(
      (plan) => publicDataEventsApiPricing.slidingWindows[plan]?.windowSeconds === apiWindowSeconds
    );

  useEffect(() => {
    const restored = decodeEstimate(new URLSearchParams(window.location.search));
    if (restored.state) {
      dispatch({ type: "restore", state: restored.state });
    }
    if (restored.status === "stale")
      setRestoreNotice(
        "Selections restored from an older or incomplete link using current prices. Review the estimate before sharing."
      );
    if (restored.status === "recovered")
      setRestoreNotice(
        "Usable selections restored. Invalid or conflicting values were reset. Review the estimate before sharing."
      );
  }, []);

  const changeNotice = selected
    ? `${planName} selected. ${state.autoRecommend ? "Automatic comparison enabled." : "Manual selection."} ${incompatibilityMessage || (apiPriceMissing ? "API fee is unconfigured. Known subtotal only." : "Annual subscription estimate updated.")} ${status === "incomplete_usage_pricing" ? "Additional usage pricing is incomplete." : ""} ${selected.apiCapacity.status === "insufficient" ? "This plan does not meet your stated API peak." : ""}`
    : "Correct the highlighted inputs to calculate your estimate.";
  useEffect(() => {
    // Announce plan/mode/status changes after editing settles. Price-only slider ticks
    // do not rewrite this message or take focus from the control.
    const timer = window.setTimeout(() => setAnnouncement(changeNotice), 400);
    return () => window.clearTimeout(timer);
  }, [changeNotice]);

  const setInputs = (values: Partial<StudioInputs>) => {
    setShareNotice("");
    setShareFallback("");
    dispatch({ type: "inputs", values });
  };
  const choosePlan = (plan: PlanId) => dispatch({ type: "plan", plan });

  let reason = `${knownLowestName} has the lowest annual subscription for this enrolment. Add expected usage for a more complete comparison.`;
  if (status === "incomplete_usage_pricing")
    reason = `${knownLowestName} has the lowest known fixed commitment. A required usage tariff or wallet policy is unconfigured, so the full comparison is incomplete.`;
  if (status === "estimated_lowest_total")
    reason = `${knownLowestName} has the lowest estimated total for the usage entered, assuming the same demand each month for twelve months.`;
  if (status === "conditional_usage_forecast")
    reason = `${knownLowestName} has the lowest projected spend using the inherited monthly AIC pools and graduated AIC volume rates. This assumes the same demand for 12 months, purchased credits remaining valid through the forecast, and zero opening balance before selected prepaid credits.`;
  if (status === "custom_service_quote_required")
    reason = `${knownLowestName} has the lowest known fixed subscription. Your selected custom service needs a scoped quote before total costs can be compared.`;
  if (status === "incomplete_api_pricing")
    reason =
      "Annual Data & Events API pricing is incomplete. Review the known costs for your selected plan while a total-price recommendation is pending.";
  if (status === "incomplete_api_capacity")
    reason = recommendation?.plan
      ? `${knownLowestName} is the lowest-priced evaluated plan meeting your stated API peak. Other plan limits remain unassessed.`
      : "API throughput fit cannot be established from the configured limits and your stated rolling window. Confirm capacity before choosing a plan.";
  if (status === "unmet_api_capacity")
    reason =
      "No evaluated plan meets your stated API peak. Review capacity needs before choosing a plan.";
  if (state.inputs.dataEventsApi && !estimate.usage.apiPeak)
    reason += " This is a price-based comparison. API capacity fit has not been assessed.";
  if (state.inputs.whiteLabel) reason += " White-label apps require Growth or Enterprise.";
  if (incompatibilityMessage) reason = incompatibilityMessage;

  const share = async () => {
    if (!selected || !canQuote) return;
    const url = new URL("/pricing/", window.location.origin);
    url.search = encodeEstimate(state).toString();
    try {
      await navigator.clipboard.writeText(url.toString());
      setShareNotice("Estimate link copied.");
      setShareFallback("");
    } catch {
      setShareNotice("Copy the estimate link below.");
      setShareFallback(url.toString());
    }
  };

  return (
    <div className="pricing-studio" id="pricing-studio">
      <div className="pricing-studio-heading">
        <h2 className="type-section-title">Price your institution.</h2>
        <p>One annual subscription. Every generally available feature.</p>
      </div>
      {restoreNotice && (
        <p className="pricing-notice" role="status">
          {restoreNotice}
        </p>
      )}
      <div className="pricing-workbench">
        <div className="pricing-controls">
          <FieldGroup>
            <QuantityField
              id="pricing-students"
              sliderId="pricing-enrolment-range"
              label="Enrolled students"
              value={state.inputs.students}
              minimum={pricingPolicy.validation.minStudents}
              maximum={pricingPolicy.validation.maxStudents}
              hint={`100 to ${pricingPolicy.validation.maxStudents.toLocaleString("en-IN")} students. Slider expands.`}
              error={estimate.errors.students}
              onChange={(students) => setInputs({ students })}
            />
            {selected && canQuote && (
              <div className="pricing-mobile-summary">
                <span className="pricing-mobile-plan">
                  <PlanIcon aria-hidden />
                  <b>{planName}</b> {apiPriceMissing ? "known subtotal" : "purchase year"}
                </span>
                <strong>{formatInr(selected.fixed.purchaseYearWithPrepaidPaise)}</strong>
                <span>
                  {apiPriceMissing
                    ? "API fee unconfigured and excluded. GST and usage extra."
                    : selected.fixed.prepaidAic.totalPaise > 0
                      ? "Includes selected prepaid AIC. GST and forecast purchases extra."
                      : "Fixed subtotal excluding GST and additional usage"}
                </span>
                <a href="#live-estimate">Full breakdown</a>
              </div>
            )}
            <FieldSet>
              <FieldLegend>Choose a plan</FieldLegend>
              <ToggleGroup
                aria-label="Choose a plan"
                value={[selectedPlan]}
                variant="outline"
                className="w-full items-stretch"
                onValueChange={(values) =>
                  choosePlan((values[0] as PlanId | undefined) ?? selectedPlan)
                }
              >
                {planIds.map((plan) => {
                  const Icon = planIcons[plan];
                  const candidate = recommendation?.candidates.find(
                    (candidate) => candidate.plan === plan
                  );
                  return (
                    <ToggleGroupItem
                      key={plan}
                      value={plan}
                      aria-label={pricingPolicy.plans[plan].name}
                      className="pricing-plan-choice min-h-12 flex-1"
                    >
                      <span className="pricing-plan-choice-name">
                        <Icon aria-hidden data-icon="inline-start" />
                        {pricingPolicy.plans[plan].name}
                      </span>
                      <span className="pricing-plan-choice-price">
                        {candidate ? formatInr(candidate.fixed.annualLicencePaise) : "Check inputs"}
                        <small>licence / year</small>
                        {plan === "enterprise" && <small>SSO included</small>}
                      </span>
                    </ToggleGroupItem>
                  );
                })}
              </ToggleGroup>
              <Field orientation="horizontal">
                <Checkbox
                  id="pricing-auto"
                  aria-labelledby="pricing-auto-label"
                  checked={state.autoRecommend}
                  onCheckedChange={(checked) => dispatch({ type: "auto", checked })}
                  aria-describedby="pricing-auto-help"
                />
                <FieldContent>
                  <FieldLabel id="pricing-auto-label" htmlFor="pricing-auto">
                    Automatically recommend a plan
                  </FieldLabel>
                  <FieldDescription id="pricing-auto-help">
                    Compare your expected usage and choose the lowest-cost plan that fits. You can
                    switch plans at any time in this estimate.
                  </FieldDescription>
                </FieldContent>
              </Field>
              <p
                className="pricing-recommendation"
                data-testid="recommendation"
                data-status={status ?? "invalid"}
              >
                <strong>
                  {state.autoRecommend ? "Automatic comparison" : `${planName} selected manually`}
                </strong>
                <span className="pricing-recommendation-full">{reason}</span>
                <span className="pricing-recommendation-short">
                  {status === "unmet_api_capacity" ||
                  status === "incomplete_api_capacity" ||
                  status === "conditional_usage_forecast" ||
                  state.inputs.dataEventsApi ? (
                    reason
                  ) : (
                    <>
                      {knownLowestName} has the lowest{" "}
                      {status === "estimated_lowest_total"
                        ? "estimated total at your entered usage."
                        : status === "incomplete_usage_pricing" ||
                            status === "custom_service_quote_required"
                          ? "known fixed subscription. Additional pricing is pending."
                          : "annual subscription for this enrolment."}
                    </>
                  )}
                </span>
              </p>
            </FieldSet>
            <ResponsiveDisclosure label="Add optional services">
              <FieldSet>
                <FieldLegend>Optional services</FieldLegend>
                <Field orientation="horizontal">
                  <Checkbox
                    id="pricing-api"
                    aria-labelledby="pricing-api-label"
                    checked={Boolean(state.inputs.dataEventsApi)}
                    onCheckedChange={(dataEventsApi) => setInputs({ dataEventsApi })}
                    aria-describedby="pricing-api-help"
                  />
                  <FieldContent>
                    <FieldLabel id="pricing-api-label" htmlFor="pricing-api">
                      {apiAnnualPrice === null
                        ? "Include Data & Events API interest"
                        : "Data & Events API"}
                      <span className="pricing-option-price">
                        {apiAnnualPrice === null
                          ? "Annual price pending"
                          : `${formatInr(apiAnnualPrice)}/year`}
                      </span>
                    </FieldLabel>
                    <FieldDescription id="pricing-api-help">
                      {apiPlanWindow
                        ? `${apiPlanWindow.requests.toLocaleString("en-IN")} requests per rolling ${apiPlanWindow.windowSeconds}-second window on ${planName}. `
                        : "Throughput requires confirmation. "}
                      Same supported resources and events on every plan. Exports and first-party
                      apps are included independently. SSO is optional.
                    </FieldDescription>
                  </FieldContent>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox
                    id="pricing-sso"
                    aria-labelledby="pricing-sso-label"
                    checked={state.inputs.sso}
                    onCheckedChange={(sso) => setInputs({ sso })}
                    aria-describedby="pricing-sso-help"
                  />
                  <FieldContent>
                    <FieldLabel id="pricing-sso-label" htmlFor="pricing-sso">
                      Microsoft Entra SSO{" "}
                      <span className="pricing-option-price">
                        {pricingPolicy.addOns.entraSsoAnnualPaise[selectedPlan] === 0
                          ? "Included, optional activation"
                          : `${formatInr(pricingPolicy.addOns.entraSsoAnnualPaise[selectedPlan])}/year`}
                      </span>
                    </FieldLabel>
                    <FieldDescription id="pricing-sso-help">
                      Optional on every plan. Included in the Enterprise licence, with the same
                      Enterprise price either way. Bring your own Entra tenant and Microsoft
                      licences. Technical onboarding applies.
                    </FieldDescription>
                  </FieldContent>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox
                    id="pricing-branding"
                    aria-labelledby="pricing-branding-label"
                    checked={state.inputs.whiteLabel}
                    onCheckedChange={(whiteLabel) => setInputs({ whiteLabel })}
                    aria-describedby="pricing-branding-help"
                  />
                  <FieldContent>
                    <FieldLabel id="pricing-branding-label" htmlFor="pricing-branding">
                      White-label Android and iOS apps{" "}
                      <span>
                        {formatInr(pricingPolicy.addOns.whiteLabelAndroidAndIosOncePaise)} once
                      </span>
                    </FieldLabel>
                    <FieldDescription id="pricing-branding-help">
                      Available on Growth and Enterprise. One combined branding/setup charge.
                      {mobileAppPublishing} Store fees and maintenance scope need confirmation
                      before purchase.
                    </FieldDescription>
                  </FieldContent>
                </Field>
                {state.inputs.whiteLabel && (
                  <Field orientation="horizontal">
                    <Checkbox
                      id="pricing-branding-owned"
                      aria-labelledby="pricing-branding-owned-label"
                      checked={state.inputs.brandingAlreadyPurchased}
                      onCheckedChange={(brandingAlreadyPurchased) =>
                        setInputs({ brandingAlreadyPurchased })
                      }
                    />
                    <FieldLabel id="pricing-branding-owned-label" htmlFor="pricing-branding-owned">
                      We have already purchased app branding
                    </FieldLabel>
                  </Field>
                )}
              </FieldSet>
            </ResponsiveDisclosure>
          </FieldGroup>
          <details className="pricing-usage-inputs" data-md-include>
            <summary>Add expected usage and custom scope</summary>
            <FieldGroup className="mt-6">
              {state.inputs.dataEventsApi && canEnterApiPeak && (
                <QuantityField
                  id="pricing-api-peak"
                  label={`Expected peak external API requests in ${apiWindowSeconds} seconds`}
                  value={state.inputs.apiPeakRequests}
                  maximum={Number.MAX_SAFE_INTEGER}
                  initialMaximum={
                    Math.max(
                      ...planIds.map(
                        (plan) => publicDataEventsApiPricing.slidingWindows[plan]?.requests ?? 0
                      )
                    ) * 2
                  }
                  hint="Optional. Enter the peak within this rolling window, including bursts."
                  error={estimate.errors.apiPeakRequests}
                  onChange={(apiPeakRequests) =>
                    setInputs({
                      apiPeakRequests,
                      apiPeakWindowSeconds: apiPeakRequests === "" ? "" : String(apiWindowSeconds),
                    })
                  }
                />
              )}
              <p className="type-support">
                Forecasts repeat your entered monthly demand for twelve months, starting with no
                purchased communication balance. Blank communication channels count as zero within
                this forecast. Other unentered usage remains outside the estimate.
              </p>
              <QuantityField
                id="pricing-sms"
                label="Billable SMS recipient segments each month"
                value={state.inputs.smsSegments}
                hint="Count each segment for each recipient. Long or Unicode SMS can use multiple segments."
                error={estimate.errors.smsSegments}
                onChange={(smsSegments) => setInputs({ smsSegments })}
              />
              <QuantityField
                id="pricing-emails"
                label="Recipient emails each month"
                value={state.inputs.recipientEmails}
                hint="Count recipients. Sending one email to 300 recipients counts as 300 recipient emails."
                error={estimate.errors.recipientEmails}
                onChange={(recipientEmails) => setInputs({ recipientEmails })}
              />
              <QuantityField
                id="pricing-whatsapp"
                label="WhatsApp recipient messages each month"
                value={state.inputs.whatsappMessages}
                hint="Category and destination tariffs need confirmation. A positive quantity produces an incomplete usage estimate."
                error={estimate.errors.whatsappMessages}
                onChange={(whatsappMessages) => setInputs({ whatsappMessages })}
              />
              <Field orientation="horizontal">
                <Checkbox
                  id="pricing-custom"
                  aria-labelledby="pricing-custom-label"
                  checked={state.inputs.customService}
                  onCheckedChange={(customService) => setInputs({ customService })}
                />
                <FieldContent>
                  <FieldLabel id="pricing-custom-label" htmlFor="pricing-custom">
                    We need a custom service quote
                  </FieldLabel>
                  <FieldDescription>
                    For migration scoping, bespoke integrations, private deployment or a custom SLA.
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
          </details>
        </div>
        <ResponsiveDisclosure label="Full estimate breakdown" className="pricing-full-estimate">
          <aside
            className="pricing-estimate"
            aria-labelledby="live-estimate-heading"
            id="live-estimate"
          >
            <div className="pricing-estimate-heading">
              <h2 id="live-estimate-heading">Live estimate</h2>
              <span>INR / billed annually</span>
            </div>
            {selected && canQuote ? (
              <>
                <p className="pricing-selected-plan" data-testid="selected-plan">
                  <PlanIcon aria-hidden />
                  {planName}
                </p>
                <dl>
                  <div className="pricing-total">
                    <dt>
                      {apiPriceMissing
                        ? "Known purchase-year subtotal"
                        : selected.fixed.prepaidAic.totalPaise > 0
                          ? "Purchase year with prepaid AIC"
                          : "Purchase-year fixed subtotal"}
                    </dt>
                    <dd className="pricing-total-number" data-testid="first-year-total">
                      {formatInr(selected.fixed.purchaseYearWithPrepaidPaise)}
                    </dd>
                  </div>
                </dl>
                <p className="pricing-estimate-caption">
                  {selected.fixed.prepaidAic.totalPaise > 0
                    ? "Includes selected prepaid AIC. Additional forecast purchases, GST and custom services are separate."
                    : "Annual subscription estimate excluding additional usage. GST and custom services are separate."}
                </p>
                <dl className="pricing-line-items pricing-tax-summary">
                  <div>
                    <dt>
                      Estimated GST
                      {publicEstimateTax ? ` (${publicEstimateTax.basisPoints / 100}%)` : ""}
                    </dt>
                    <dd data-testid="purchase-year-gst">
                      {selected.fixed.firstYearTaxPaise === null
                        ? "Unconfigured"
                        : formatInr(selected.fixed.firstYearTaxPaise)}
                    </dd>
                  </div>
                  <div>
                    <dt>Purchase year including estimated GST</dt>
                    <dd data-testid="purchase-year-with-gst">
                      {selected.fixed.firstYearIncludingTaxPaise === null
                        ? "Incomplete price"
                        : formatInr(selected.fixed.firstYearIncludingTaxPaise)}
                    </dd>
                  </div>
                  <div>
                    <dt>Renewal including estimated GST</dt>
                    <dd data-testid="renewal-with-gst">
                      {selected.fixed.renewalIncludingTaxPaise === null
                        ? "Incomplete price"
                        : formatInr(selected.fixed.renewalIncludingTaxPaise)}
                    </dd>
                  </div>
                </dl>
                <p className="pricing-estimate-caption">
                  Domestic estimate. Final tax treatment and the CGST/SGST or IGST split follow your
                  billing details on the invoice.
                </p>
                {apiPriceMissing && (
                  <p className="pricing-estimate-caption" data-testid="api-price-incomplete">
                    Data & Events API interest included. Its annual fee is unconfigured and excluded
                    from both subtotals. This estimate is incomplete.
                  </p>
                )}
                {selected.apiCapacity.status === "insufficient" && (
                  <p
                    className="pricing-estimate-caption"
                    role="status"
                    data-testid="api-capacity-warning"
                  >
                    {planName} does not meet your stated API peak.{" "}
                    {state.autoRecommend
                      ? "No evaluated plan can be recommended for this requirement."
                      : "Manual selection is preserved."}
                  </p>
                )}
                {selected.apiCapacity.status === "unassessed" && (
                  <p className="pricing-estimate-caption" data-testid="api-capacity-warning">
                    API throughput fit is unassessed. Approved limits for your stated rolling window
                    are required.
                  </p>
                )}
                <div className="pricing-estimate-action">
                  <ButtonLink
                    href={`/demo/?${encodeEstimate(state)}`}
                    label="Discuss this estimate"
                    variant="cta"
                  />
                </div>
                <p className="pricing-print-version">
                  SquareCampus pricing estimate for{" "}
                  {selected.fixed.students.toLocaleString("en-IN")} enrolled students. Pricing
                  policy {pricingPolicy.version}.
                </p>
                <dl className="pricing-line-items">
                  <div>
                    <dt>Annual licence</dt>
                    <dd data-testid="annual-licence">
                      {formatInr(selected.fixed.annualLicencePaise)}
                    </dd>
                  </div>
                  <div>
                    <dt>Effective student/year price</dt>
                    <dd>
                      {formatInrRatio(selected.fixed.annualLicencePaise, selected.fixed.students)}
                    </dd>
                  </div>
                </dl>
                {selected.fixed.students > 1000 && (
                  <section className="pricing-slab-details" aria-labelledby="pricing-slabs-heading">
                    <h3 id="pricing-slabs-heading">Progressive slab breakdown</h3>
                    <dl className="pricing-slab-cards">
                      {selected.fixed.slabs
                        .filter((slab) => slab.students > 0)
                        .map((slab) => (
                          <div
                            key={slab.from}
                            className="pricing-slab-card"
                            data-testid="pricing-slab-card"
                          >
                            <dt>
                              <span className="pricing-slab-range">
                                Students {slab.from.toLocaleString("en-IN")} to
                                {(slab.from + slab.students - 1).toLocaleString("en-IN")}
                              </span>
                              <span className="pricing-slab-calculation">
                                <strong>{slab.students.toLocaleString("en-IN")}</strong> ×{" "}
                                <strong>{formatInr(slab.ratePaise)}</strong>
                              </span>
                            </dt>
                            <dd>{formatInr(slab.totalPaise)}</dd>
                          </div>
                        ))}
                    </dl>
                  </section>
                )}
                <dl className="pricing-line-items">
                  {state.inputs.sso && (
                    <div>
                      <dt>Entra SSO each year</dt>
                      <dd>{formatInr(selected.fixed.annualSsoPaise)}</dd>
                    </div>
                  )}
                  {state.inputs.dataEventsApi && (
                    <div>
                      <dt>Data & Events API each year</dt>
                      <dd data-testid="api-annual-price">
                        {selected.fixed.annualDataEventsApiPaise === null
                          ? "Unconfigured, excluded"
                          : formatInr(selected.fixed.annualDataEventsApiPaise)}
                      </dd>
                    </div>
                  )}
                  {state.inputs.whiteLabel && (
                    <div>
                      <dt>
                        {state.inputs.brandingAlreadyPurchased
                          ? "Branding previously purchased"
                          : "Android + iOS branding once"}
                      </dt>
                      <dd>{formatInr(selected.fixed.newBrandingPaise)}</dd>
                    </div>
                  )}
                  {selected.fixed.prepaidAic.credits > 0 && (
                    <div data-testid="selected-aic-purchase">
                      <dt>
                        {selected.fixed.prepaidAic.credits.toLocaleString("en-IN")} prepaid AIC
                      </dt>
                      <dd>{formatInr(selected.fixed.prepaidAic.totalPaise)}</dd>
                    </div>
                  )}
                  <div>
                    <dt>
                      {apiPriceMissing
                        ? "Known recurring subtotal/year"
                        : "Recurring fixed subtotal/year"}
                    </dt>
                    <dd>{formatInr(selected.fixed.recurringFixedPaise)}</dd>
                  </div>
                  <div>
                    <dt>
                      {apiPriceMissing
                        ? "Known comparable renewal/year"
                        : "Comparable annual renewal"}
                    </dt>
                    <dd data-testid="renewal-total">
                      {formatInr(selected.fixed.renewalFixedPaise)}
                    </dd>
                  </div>
                  <div>
                    <dt>Monthly communication credits</dt>
                    <dd>{selected.fixed.monthlyCommunicationCredits.toLocaleString("en-IN")}</dd>
                  </div>
                  <div>
                    <dt>Draft monthly included AIC</dt>
                    <dd>{formatAic(selected.fixed.monthlyIncludedMilliAic)} AIC</dd>
                  </div>
                </dl>
                <EstimateAssumptions fixed={selected.fixed} />
                <div
                  className="pricing-usage-result"
                  data-testid="usage-result"
                  data-empty={
                    estimate.usage.communication === undefined && !state.inputs.customService
                  }
                >
                  <h3>Communication usage forecast</h3>
                  {estimate.usage.communication === undefined ? (
                    <p>
                      No communication forecast entered. Add monthly demand to estimate top-ups.
                    </p>
                  ) : (
                    <dl className="pricing-line-items">
                      {selected.communication && (
                        <div>
                          <dt>Communication top-ups / year</dt>
                          <dd>
                            {selected.communication.totalPaise === null
                              ? "Tariff pending"
                              : formatInr(selected.communication.totalPaise)}
                          </dd>
                        </div>
                      )}
                    </dl>
                  )}
                  {(status === "incomplete_usage_pricing" ||
                    status === "custom_service_quote_required") && (
                    <p>
                      Complete usage or service pricing needs confirmation. The fixed subscription
                      above remains calculable.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <p className="pricing-invalid-quote" data-testid="quote-invalid" role="status">
                {incompatibilityMessage ||
                  "Enter valid quantities to calculate your estimate. Check the highlighted fields beside the controls."}
              </p>
            )}
          </aside>
        </ResponsiveDisclosure>
      </div>
      <ResponsiveDisclosure label="Calculate AIC top-ups" className="pricing-aic-calculator">
        <FieldGroup className="pricing-aic-inputs">
          <AicPurchasePicker
            credits={state.inputs.prepaidAicCredits}
            error={estimate.errors.prepaidAicCredits}
            onChange={(prepaidAicCredits) => setInputs({ prepaidAicCredits })}
          />
          <QuantityField
            id="pricing-aic"
            label="Expected AEGIS AI Credits each month"
            decimal
            value={state.inputs.monthlyAic}
            hint="Enter expected monthly consumption. Included credits expire monthly; purchased credits carry forward. Forecasts use the inherited flat plan allowances."
            error={estimate.errors.monthlyAic}
            onChange={(monthlyAic) => setInputs({ monthlyAic })}
          />
        </FieldGroup>
        {selected && canQuote && selected.aic && (
          <section className="pricing-aic-result" aria-label="AIC top-up forecast">
            <h3>AIC top-up forecast</h3>
            <dl className="pricing-line-items">
              <div>
                <dt>Additional prepaid AIC for 12 months</dt>
                <dd data-testid="aic-top-up-cost">
                  {selected.aic.annualPaise === null
                    ? "Wallet policy unconfigured"
                    : formatInr(selected.aic.annualPaise)}
                </dd>
              </div>
              <div>
                <dt>Draft extra AIC / month</dt>
                <dd>{formatAic(selected.aic.extraMonthlyMilliAic)} AIC</dd>
              </div>
              <div>
                <dt>Estimated GST on additional prepaid AIC</dt>
                <dd data-testid="aic-top-up-gst">
                  {selected.aic.annualTaxPaise === null
                    ? "Unconfigured"
                    : formatInr(selected.aic.annualTaxPaise)}
                </dd>
              </div>
              <div>
                <dt>Additional prepaid AIC including estimated GST</dt>
                <dd data-testid="aic-top-up-with-gst">
                  {selected.aic.annualIncludingTaxPaise === null
                    ? "Incomplete price"
                    : formatInr(selected.aic.annualIncludingTaxPaise)}
                </dd>
              </div>
            </dl>
            {selected.aic?.forecast && (
              <div className="pricing-aic-forecast" data-testid="aic-forecast">
                <p>
                  Conditional purchase-year spend before GST{" "}
                  <strong data-testid="expected-year-spend">
                    {selected.firstYearExpectedPaise === null
                      ? "Incomplete price"
                      : formatInr(selected.firstYearExpectedPaise)}
                  </strong>
                  , including selected prepaid credits and suggested additional purchases.
                </p>
                <p>
                  Conditional projection using the inherited monthly pool. Purchased balance starts
                  at <strong>0 AIC</strong> before selected prepaid credits. Demand repeats for{" "}
                  <strong>12 months</strong>. Purchased credits are assumed valid throughout that
                  horizon; contractual validity is unconfigured.
                </p>
                {selected.aic.forecast.suggested.credits > 0 ? (
                  <p>
                    Suggested additional purchase of{" "}
                    <strong>
                      {selected.aic.forecast.suggested.credits.toLocaleString("en-IN")} AIC
                    </strong>{" "}
                    for <strong>{formatInr(selected.aic.forecast.suggested.totalPaise)}</strong>,
                    using graduated volume rates.
                  </p>
                ) : (
                  <p>
                    Opening and selected prepaid credits cover the projected purchased-credit need.
                  </p>
                )}
                <p>
                  Closing purchased balance{" "}
                  <strong>{formatAic(selected.aic.forecast.closingPurchasedMilliAic)} AIC</strong>.
                </p>
                <details data-md-include>
                  <summary>Monthly AIC projection</summary>
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>Included used</th>
                          <th>Purchased used</th>
                          <th>Purchased left</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selected.aic.forecast.months.map((month) => (
                          <tr key={month.month}>
                            <th scope="row">{month.month}</th>
                            <td>{formatAic(month.includedUsedMilliAic)}</td>
                            <td>{formatAic(month.purchasedUsedMilliAic)}</td>
                            <td>{formatAic(month.closingPurchasedMilliAic)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
                <p>
                  Forecast purchases require separate approval and are additional to the
                  purchase-year amount shown above.
                </p>
              </div>
            )}
          </section>
        )}
      </ResponsiveDisclosure>
      <div className="pricing-estimate-tools">
        <p>Standard managed cloud. Prices exclude applicable GST.</p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={share} disabled={!canQuote}>
            <Copy data-icon="inline-start" />
            Copy estimate link
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => window.print()}
            disabled={!canQuote}
          >
            <Printer data-icon="inline-start" />
            Print / save PDF
          </Button>
        </div>
      </div>
      {shareNotice && (
        <p className="pricing-share-notice" role="status">
          {shareNotice}
        </p>
      )}
      {shareFallback && (
        <Field>
          <FieldLabel htmlFor="pricing-share-url">Estimate link</FieldLabel>
          <Input id="pricing-share-url" value={shareFallback} readOnly />
        </Field>
      )}
      <noscript>
        <p className="pricing-notice">
          Interactive estimates need JavaScript. The published student rates, plan inclusions and
          FAQs below remain available. You can also book a demo to discuss your institution.
        </p>
      </noscript>
      <div id="plans" className="pricing-plans-section">
        <ResponsiveDisclosure label="Compare the three plans">
          <h2 className="type-section-title">Three plans. One School OS.</h2>
          <p id="fit">
            Annual licence prices below use the same{" "}
            {estimate.students?.toLocaleString("en-IN") ?? "validated"} enrolled students. Add-ons
            and additional usage are shown separately above.
          </p>
          <PlanArchitecture
            students={estimate.valid ? estimate.students : null}
            selectedPlan={selectedPlan}
            onSelect={choosePlan}
            projections={
              estimate.usage.monthlyMilliAic !== undefined || estimate.usage.communication
                ? recommendation?.candidates
                : undefined
            }
          />
        </ResponsiveDisclosure>
      </div>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );
}
