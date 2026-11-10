"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { pricingPolicy } from "@fairhelm/squarecampus-content/pricing";
import { Input } from "@fairhelm/ui/components/input";
import { Field, FieldDescription, FieldError, FieldLabel } from "@fairhelm/ui/components/field";
import { quantitySliderMaximum } from "@/lib/pricing-estimate";

const compactQuantity = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function QuantityField({
  id,
  label,
  value,
  hint,
  error,
  minimum = 0,
  maximum = pricingPolicy.validation.maxMonthlyQuantity,
  initialMaximum = 10000,
  sliderId = `${id}-range`,
  onChange,
  onCommit,
}: {
  id: string;
  label: string;
  value: string;
  hint?: string;
  error?: string;
  minimum?: number;
  maximum?: number;
  initialMaximum?: number;
  sliderId?: string;
  onChange: (value: string) => void;
  onCommit?: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const numberLabel = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const lastSliderValue = useRef<string | null>(null);
  const numericValue = value !== "" && !error ? Number(value) : null;
  const [sliderMaximum, setSliderMaximum] = useState(() =>
    quantitySliderMaximum(numericValue, initialMaximum, maximum)
  );
  const sliderValue = Math.min(sliderMaximum, numericValue ?? minimum);
  const sliderFill = ((sliderValue - minimum) / (sliderMaximum - minimum)) * 100;
  const step = "1";
  const ticks = [
    minimum,
    Math.floor(sliderMaximum / 4),
    Math.floor(sliderMaximum / 2),
    sliderMaximum,
  ];
  const displayedValue =
    numericValue === null
      ? value || "Not set"
      : numericValue.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const description = `${id}-help${error ? ` ${id}-error` : ""}`;

  useEffect(() => {
    if (lastSliderValue.current !== value)
      setSliderMaximum(quantitySliderMaximum(numericValue, initialMaximum, maximum));
    lastSliderValue.current = null;
  }, [value, numericValue, initialMaximum, maximum]);

  useEffect(() => {
    if (editing) {
      input.current?.focus();
      input.current?.select();
    } else if (restoreFocus.current) {
      restoreFocus.current = false;
      numberLabel.current?.focus();
    }
  }, [editing]);

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="pricing-quantity-row">
        <div className="pricing-quantity-scale">
          <input
            id={sliderId}
            type="range"
            min={minimum}
            max={sliderMaximum}
            step={step}
            value={sliderValue}
            className="pricing-range"
            style={
              {
                "--pricing-range-fill": `${sliderFill}%`,
              } as CSSProperties
            }
            list={`${sliderId}-ticks`}
            aria-label={`Adjust ${label.toLowerCase()}`}
            aria-describedby={description}
            aria-invalid={Boolean(error)}
            aria-valuetext={value === "" ? "Not set" : displayedValue}
            aria-valuenow={sliderValue}
            aria-valuemin={minimum}
            aria-valuemax={sliderMaximum}
            onChange={(event) => {
              lastSliderValue.current = event.target.value;
              onChange(event.target.value);
            }}
          />
          <datalist id={`${sliderId}-ticks`}>
            {ticks.map((count) => (
              <option key={count} value={count} />
            ))}
          </datalist>
          <div className="pricing-range-ticks" aria-hidden="true">
            {ticks.map((count) => (
              <span
                key={count}
                title={count.toLocaleString("en-IN")}
                style={{
                  left: `${((count - minimum) / (sliderMaximum - minimum)) * 100}%`,
                }}
              >
                {sliderMaximum > 10000
                  ? compactQuantity.format(count)
                  : count.toLocaleString("en-IN")}
              </span>
            ))}
          </div>
        </div>
        {editing ? (
          <Input
            ref={input}
            id={id}
            name={id}
            type="number"
            min={minimum}
            max={maximum}
            step={step}
            inputMode="numeric"
            value={value}
            onChange={(event) => {
              lastSliderValue.current = null;
              onChange(event.target.value);
            }}
            onBlur={() => {
              onCommit?.(value);
              setEditing(false);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                restoreFocus.current = true;
                event.currentTarget.blur();
              }
            }}
            autoComplete="off"
            aria-invalid={Boolean(error)}
            aria-describedby={description}
            className="h-12"
          />
        ) : (
          <button
            ref={numberLabel}
            id={id}
            type="button"
            className="pricing-number-label"
            aria-label={`Edit ${label.toLowerCase()}, ${displayedValue}`}
            aria-invalid={Boolean(error)}
            aria-describedby={description}
            onClick={() => setEditing(true)}
            title={`Click to edit ${label.toLowerCase()}`}
          >
            {displayedValue}
          </button>
        )}
      </div>
      <FieldDescription id={`${id}-help`}>
        {hint ?? "Enter a monthly quantity. Leave blank to skip this forecast."}
      </FieldDescription>
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </Field>
  );
}
