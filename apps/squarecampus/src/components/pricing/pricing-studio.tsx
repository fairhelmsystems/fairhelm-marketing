"use client";

import { Copy, Printer } from "lucide-react";
import { useEffect, useReducer, useState } from "react";
import {
  planIds,
  calculateLicence,
  pricingPolicy,
  publicEstimateTax,
  publicDataEventsApiPricing,
} from "@fairhelm/squarecampus-content/pricing";
import { Button } from "@fairhelm/ui/components/button";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { Checkbox } from "@fairhelm/ui/components/checkbox";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@fairhelm/ui/components/field";
import { ResponsiveDisclosure } from "@fairhelm/ui/components/responsive-disclosure";
import { InfoPopover } from "@fairhelm/ui/components/info-popover";
import { Input } from "@fairhelm/ui/components/input";
import { ToggleGroup, ToggleGroupItem } from "@fairhelm/ui/components/toggle-group";
import { PlanArchitecture } from "@/components/pricing/plan-architecture";
import { AicPurchasePicker } from "@/components/pricing/aic-pack-picker";
import { QuantityField } from "@/components/pricing/quantity-field";
import { EstimateAssumptions } from "@/components/pricing/estimate-assumptions";
import { planIcons } from "@/components/pricing/plan-icons";
import type { PlanId } from "@/content/commercial";
import { WHITE_LABEL_NOTE } from "@/content/pricing";
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
  const status = recommendation?.status;
  const incompatibleAddOns = selected?.fixed.unavailableAddOns ?? [];
  const incompatibilityMessage = incompatibleAddOns.length
    ? `${incompatibleAddOns.map((addOn) => (addOn === "sso" ? "Microsoft Entra SSO" : "White-label apps")).join(" and ")} require Growth or Enterprise. Choose a compatible plan or deselect the add-on.`
    : "";
  const canQuote = Boolean(selected?.fixed.eligible);
  const apiPriceMissing = selected?.fixed.annualDataEventsApiPaise === null;
  const apiAnnualPrice = publicDataEventsApiPricing.annualDataEventsApiPaise[selectedPlan];
  const apiPlanWindow = publicDataEventsApiPricing.slidingWindows[selectedPlan];

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
        "Saved selections were adapted to the current controls. Review all quantities before sharing."
      );
  }, []);

  const changeNotice = selected
    ? `${planName} selected. ${incompatibilityMessage || (apiPriceMissing ? "API fee is unconfigured. Known subtotal only." : "Annual subscription estimate updated.")} ${status === "incomplete_usage_pricing" ? "Additional usage pricing is incomplete." : ""} ${selected.apiCapacity.status === "insufficient" ? "This plan does not meet your stated API peak." : ""}`
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
                      ? "Includes selected prepaid AIC. GST is additional."
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
                  const licence =
                    estimate.students === null ? null : calculateLicence(plan, estimate.students);
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
                        {licence ? formatInr(licence.annualLicencePaise) : "Check enrolment"}
                        <small>licence / year</small>
                        {plan === "enterprise" && <small>SSO included</small>}
                      </span>
                    </ToggleGroupItem>
                  );
                })}
              </ToggleGroup>
            </FieldSet>
            <ResponsiveDisclosure label="Add optional services">
              <FieldSet>
                <FieldLegend>Optional services</FieldLegend>
                <FieldGroup className="pricing-service-options">
                  <Field orientation="horizontal">
                    <FieldLabel
                      htmlFor="pricing-api"
                      className="pricing-service-card"
                      data-selected={Boolean(state.inputs.dataEventsApi)}
                    >
                      <Checkbox
                        id="pricing-api"
                        aria-labelledby="pricing-api-label"
                        checked={Boolean(state.inputs.dataEventsApi)}
                        onCheckedChange={(dataEventsApi) => setInputs({ dataEventsApi })}
                        aria-describedby="pricing-api-help"
                      />
                      <span className="pricing-service-copy">
                        <span id="pricing-api-label" className="pricing-service-name">
                          {apiAnnualPrice === null
                            ? "Include Data & Events API interest"
                            : "Data & Events API"}
                          <span className="pricing-option-price">
                            {apiAnnualPrice === null
                              ? "Annual price pending"
                              : `${formatInr(apiAnnualPrice)}/year`}
                          </span>
                        </span>
                        <span id="pricing-api-help" className="pricing-service-description">
                          {apiPlanWindow
                            ? `${apiPlanWindow.requests.toLocaleString("en-IN")} requests per rolling ${apiPlanWindow.windowSeconds}-second window.`
                            : "Throughput requires confirmation."}
                        </span>
                      </span>
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <FieldLabel
                      htmlFor="pricing-sso"
                      className="pricing-service-card"
                      data-selected={state.inputs.sso}
                    >
                      <Checkbox
                        id="pricing-sso"
                        aria-labelledby="pricing-sso-label"
                        checked={state.inputs.sso}
                        onCheckedChange={(sso) => setInputs({ sso })}
                        aria-describedby="pricing-sso-help"
                      />
                      <span className="pricing-service-copy">
                        <span id="pricing-sso-label" className="pricing-service-name">
                          Microsoft Entra SSO
                          <span className="pricing-option-price">
                            {pricingPolicy.addOns.entraSsoAnnualPaise[selectedPlan] === 0
                              ? "Included"
                              : `${formatInr(pricingPolicy.addOns.entraSsoAnnualPaise[selectedPlan])}/year`}
                          </span>
                        </span>
                        <span id="pricing-sso-help" className="pricing-service-description">
                          {selectedPlan === "enterprise"
                            ? "Optional activation. Same price either way."
                            : "Optional. Bring your own Microsoft licences."}
                        </span>
                      </span>
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal" className="pricing-service-wide">
                    <FieldLabel
                      htmlFor="pricing-branding"
                      className="pricing-service-card"
                      data-selected={state.inputs.whiteLabel}
                    >
                      <Checkbox
                        id="pricing-branding"
                        aria-labelledby="pricing-branding-label"
                        checked={state.inputs.whiteLabel}
                        onCheckedChange={(whiteLabel) => setInputs({ whiteLabel })}
                        aria-describedby="pricing-branding-help"
                      />
                      <span className="pricing-service-copy">
                        <span id="pricing-branding-label" className="pricing-service-name">
                          White-label Android and iOS apps
                          <span className="pricing-option-price">
                            {pricingPolicy.addOns.whiteLabelIncludedPlans.includes(selectedPlan)
                              ? "Included"
                              : `${formatInr(pricingPolicy.addOns.whiteLabelAndroidAndIosOncePaise)} once`}
                          </span>
                        </span>
                        <span id="pricing-branding-help" className="pricing-service-description">
                          Included in Enterprise. Available on Growth.
                        </span>
                      </span>
                    </FieldLabel>
                  </Field>
                </FieldGroup>
                <InfoPopover id="pricing-service-requirements" label="Service requirements">
                  <p>
                    <strong>Data &amp; Events API.</strong> Same supported resources and events on
                    every plan. Exports and first-party apps are included independently. SSO is
                    optional.
                  </p>
                  <p>
                    <strong>Microsoft Entra SSO.</strong> Optional on every plan. Included in the
                    Enterprise licence, with the same Enterprise price either way. Bring your own
                    Entra tenant and Microsoft licences. Technical onboarding applies.
                  </p>
                  <p>{WHITE_LABEL_NOTE}</p>
                </InfoPopover>
              </FieldSet>
            </ResponsiveDisclosure>
          </FieldGroup>
          <details
            className="pricing-usage-inputs"
            id="pricing-usage-inputs"
            data-md-include
            suppressHydrationWarning
          >
            <summary>Add usage and prepaid AIC</summary>
            <FieldGroup className="mt-6">
              <AicPurchasePicker
                credits={state.inputs.prepaidAicCredits}
                error={estimate.errors.prepaidAicCredits}
                onChange={(prepaidAicCredits) => setInputs({ prepaidAicCredits })}
              />
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
                    ? "Includes selected prepaid AIC. GST and custom services are separate."
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
                    {planName} does not meet your stated API peak. Choose a plan with sufficient
                    capacity or discuss a custom scope.
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
                    <dt>Monthly included AIC</dt>
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
      <div className="pricing-estimate-tools">
        <p id="volume">
          Standard managed cloud. Prices exclude applicable GST.{" "}
          <a href="/pricing-policy.json" className="pricing-policy-link">
            Read the pricing policy
          </a>
        </p>
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
          Interactive estimates need JavaScript. The public pricing policy, plan inclusions and FAQs
          remain available. You can also book a demo to discuss your institution.
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
            projections={estimate.usage.communication ? recommendation?.candidates : undefined}
          />
        </ResponsiveDisclosure>
      </div>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );
}
