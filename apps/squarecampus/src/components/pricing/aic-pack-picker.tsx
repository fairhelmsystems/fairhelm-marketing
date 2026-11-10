"use client";

import {
  aicVolumeBands,
  calculateAicPurchase,
  maxAicPurchaseCredits,
  pricingPolicy,
} from "@fairhelm/squarecampus-content/pricing";
import { Checkbox } from "@fairhelm/ui/components/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@fairhelm/ui/components/field";
import { InfoPopover } from "@fairhelm/ui/components/info-popover";
import { QuantityField } from "@/components/pricing/quantity-field";
import { formatInr, formatInrRatio } from "@/lib/pricing-estimate";

export function AicPurchasePicker({
  credits,
  error,
  onChange,
}: {
  credits: string;
  error?: string;
  onChange: (credits: string) => void;
}) {
  const purchase = error ? null : calculateAicPurchase(Number(credits));
  const enabled = credits !== "0";
  const minimum = pricingPolicy.aic.minimumPurchaseCredits;
  return (
    <FieldSet id="aic-packs">
      <FieldLegend>Buy the AIC you need</FieldLegend>
      <Field orientation="horizontal">
        <Checkbox
          id="pricing-buy-aic"
          aria-labelledby="pricing-buy-aic-label"
          checked={enabled}
          onCheckedChange={(checked) => onChange(checked ? String(minimum) : "0")}
        />
        <FieldContent>
          <FieldLabel id="pricing-buy-aic-label" htmlFor="pricing-buy-aic">
            Add prepaid AIC
          </FieldLabel>
          <FieldDescription>
            Choose at least {minimum.toLocaleString("en-IN")} whole AIC. Graduated discounts apply
            to each purchase. GST is additional.
          </FieldDescription>
        </FieldContent>
      </Field>
      {enabled && (
        <QuantityField
          id="pricing-prepaid-aic"
          label="Extra prepaid AIC"
          value={credits}
          minimum={minimum}
          maximum={maxAicPurchaseCredits}
          initialMaximum={250000}
          hint={`Minimum purchase ${minimum.toLocaleString("en-IN")} whole AIC. Edit the quantity or clear Add prepaid AIC to remove the purchase.`}
          error={error}
          onChange={onChange}
          onCommit={(raw) => {
            if (raw === "" || (Number(raw) >= 0 && Number(raw) < minimum))
              onChange(String(minimum));
          }}
        />
      )}
      {purchase && purchase.credits > 0 && (
        <dl className="pricing-aic-purchase-summary" data-testid="aic-purchase-price">
          <div>
            <dt>Prepaid purchase before GST</dt>
            <dd>{formatInr(purchase.totalPaise)}</dd>
          </div>
          <div>
            <dt>Effective price per AIC</dt>
            <dd>{formatInrRatio(purchase.totalPaise, purchase.credits)}</dd>
          </div>
        </dl>
      )}
      <InfoPopover id="aic-volume-rates" label="View AIC volume discounts">
        <p>Each rate applies only to credits inside that band of the same prepaid purchase.</p>
        <table className="aic-volume-table">
          <thead>
            <tr>
              <th>AIC in your purchase</th>
              <th>Rate per AIC</th>
            </tr>
          </thead>
          <tbody>
            {aicVolumeBands.map((band, index) => {
              const from = index === 0 ? 1 : (aicVolumeBands[index - 1].upTo ?? 0) + 1;
              return (
                <tr key={from}>
                  <td>
                    {from.toLocaleString("en-IN")}
                    {band.upTo === null ? "+" : ` to ${band.upTo.toLocaleString("en-IN")}`}
                  </td>
                  <td>{formatInr(band.unitPricePaise)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p>
          Minimum purchase {pricingPolicy.aic.minimumPurchaseCredits.toLocaleString("en-IN")} AIC.
          Included credits expire monthly. Purchased credits carry forward. Purchase validity and
          cancellation terms require confirmation.
        </p>
      </InfoPopover>
      <a className="aic-examples-link" href="#aic-examples">
        What uses AIC?
      </a>
    </FieldSet>
  );
}
