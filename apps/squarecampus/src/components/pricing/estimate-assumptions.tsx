"use client";

import type { calculateFixedEstimate } from "@fairhelm/squarecampus-content/pricing";
import { pricingPolicy } from "@fairhelm/squarecampus-content/pricing";
import { Button } from "@fairhelm/ui/components/button";
import { Info } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { formatAic, formatInr, formatInrRatio } from "@/lib/pricing-estimate";

const BottomSheet = dynamic(() => import("@fairhelm/ui/components/bottom-sheet"), { ssr: false });
type FixedEstimate = ReturnType<typeof calculateFixedEstimate>;

function AssumptionCopy({ fixed }: { fixed: FixedEstimate }) {
  return (
    <div className="pricing-assumptions">
      <p className="pricing-assumptions-intro">
        {fixed.monthlyIncludedMilliAic > 0
          ? `AIC uses a shared institution-wide pool of ${formatAic(fixed.monthlyIncludedMilliAic)} AIC each month. Included credits expire monthly.`
          : "This plan includes no monthly AIC; AIC is bought as prepaid credits."}{" "}
        Purchased AIC carries forward. Validity and cancellation terms are on your order form.
      </p>
      <ul>
        <li>
          This estimate assumes the same enrolment, plan and optional services at renewal. Renewal
          rates are sent in writing at least {pricingPolicy.renewal.minimumNoticeDays} days before
          the renewal date.
        </li>
        <li>
          Your <strong>{formatInr(fixed.annualLicencePaise)}</strong> annual licence equals{" "}
          <strong>{formatInrRatio(fixed.annualLicencePaise, 12)}</strong> per month. Billing is
          annual. Monthly and per-student equivalents are rounded for display.
        </li>
        <li>Additional usage and scoped work are separate. GST is shown as a domestic estimate.</li>
        {fixed.prepaidAic.totalPaise > 0 && (
          <li>
            Selected prepaid AIC costs{" "}
            <strong>{formatInr(fixed.prepaidAic.totalPaise)} once</strong>. They are included in the
            purchase-year amount. Renewal does not automatically buy credits again.
          </li>
        )}
        <li>
          Android + iOS branding is included in Enterprise. On Growth it costs{" "}
          <strong>{formatInr(pricingPolicy.addOns.whiteLabelAndroidAndIosOncePaise)} once</strong>,
          in the year first purchased. Existing branding carries across ordinary renewals and plan
          changes.
        </li>
      </ul>
    </div>
  );
}

export function EstimateAssumptions({ fixed }: { fixed: FixedEstimate }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  return (
    <>
      <Button
        type="button"
        variant="link"
        className="pricing-assumptions-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setMounted(true);
          setOpen(true);
        }}
      >
        <Info aria-hidden data-icon="inline-start" />
        Estimate assumptions
      </Button>
      <div className="pricing-assumptions-print" data-md-include>
        <h3>Estimate assumptions</h3>
        <AssumptionCopy fixed={fixed} />
      </div>
      <noscript>
        <AssumptionCopy fixed={fixed} />
      </noscript>
      {mounted && (
        <BottomSheet
          open={open}
          onOpenChange={setOpen}
          title="Estimate assumptions"
          closeLabel="Close estimate assumptions"
          className="pricing-assumptions-sheet"
        >
          <AssumptionCopy fixed={fixed} />
        </BottomSheet>
      )}
    </>
  );
}
