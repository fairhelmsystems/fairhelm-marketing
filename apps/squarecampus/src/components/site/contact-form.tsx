"use client";

import {siteHref} from "@fairhelm/config/urls";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { enquiryTypes, type FormIntent, formCopy, sourceTags } from "@/content/demo-intents";
import { buildEnquiryPayload, foundingPartnerFields } from "@/lib/demo-enquiry";
import { cn } from "@fairhelm/ui/lib/utils";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { HumanCheck, type HumanCheckResult } from "./human-check";

type DemoFormState = {
  enquiryType: string;
  name: string;
  email: string;
  phone: string;
  institution: string;
  role: string;
  campusCount: string;
  currentSystem: string;
  primaryPain: string;
  message: string;
  consent: boolean;
  website: string;
  // Founding-partner diagnosis answers. Only posted for a founding-partner
  // enquiry (see `buildPayload`).
  bottleneck: string;
  executiveSponsor: string;
  pilotUnit: string;
  timeSensitivity: string;
  successMeasure: string;
};

const initialState: DemoFormState = {
  enquiryType: "Guided platform demo",
  name: "",
  email: "",
  phone: "",
  institution: "",
  role: "",
  campusCount: "",
  currentSystem: "",
  primaryPain: "",
  message: "",
  consent: false,
  website: "",
  bottleneck: "",
  executiveSponsor: "",
  pilotUnit: "",
  timeSensitivity: "",
  successMeasure: "",
};

const FOUNDING_PARTNER_ENQUIRY = enquiryTypes["founding-partner"];

const roleOptions = [
  "Trustee / Director",
  "Principal / Head of School",
  "Administrator / Registrar",
  "Finance / Accounts",
  "IT / Systems",
  "Other",
] as const;

const campusCountOptions = ["1 campus", "2–5 campuses", "6–15 campuses", "15+ campuses"] as const;

/**
 * Pain points, written so one list serves a school and a multi-school
 * university group. The exception-shaped options (reconciliation, ownership,
 * approvals) are the ones a founding pilot can actually be scoped around.
 */
const primaryPainOptions = [
  "Payment-to-ERP reconciliation exceptions",
  "Admissions-to-enrolment visibility",
  "Cross-department workflow ownership",
  "Approvals and decision latency",
  "Multi-campus or multi-school governance",
  "Fragmented reporting across systems",
  "Parent and guardian communication overload",
  "Compliance and audit readiness",
  "Other",
] as const;

const timeSensitivityOptions = [
  "Blocking us now",
  "Before the next admissions cycle",
  "This academic year",
  "Exploring, no fixed date",
] as const;

// Shared with the enquiry regression tests; preserves the intake payload schema.
const buildPayload = buildEnquiryPayload;

// Static export: the site has no server of its own, so the form posts to an
// external intake endpoint configured at build time via
// NEXT_PUBLIC_CONTACT_ENDPOINT. Production builds fail without it (see
// next.config.ts) — there is deliberately no silent mailto fallback. The one
// sanctioned interim state is NEXT_PUBLIC_CONTACT_FORM_MODE=email: the form
// visibly tells the visitor that submitting opens a pre-filled email draft.
const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;
const EMAIL_DRAFT_MODE = !CONTACT_ENDPOINT && process.env.NEXT_PUBLIC_CONTACT_FORM_MODE === "email";
const CONTACT_EMAIL = "contact@squarecampus.com";

/**
 * The human check sits beside the intake endpoint on the same function, so it
 * is derived rather than configured: a second environment variable would be a
 * second thing to get wrong at deploy time, and one that points somewhere else
 * would be worse than none. If the endpoint is not the shape we expect, the
 * check is skipped here — and the intake function is the thing that decides
 * whether a submission without a pass token is accepted, so skipping it in the
 * browser cannot be used to get past it.
 */
const CHALLENGE_ENDPOINT = CONTACT_ENDPOINT?.endsWith("/contact")
  ? `${CONTACT_ENDPOINT.slice(0, -"/contact".length)}/challenge`
  : undefined;

function buildEmailDraft(state: DemoFormState) {
  const subject = `${state.enquiryType} — ${state.institution || state.name}`;
  const founding =
    state.enquiryType === FOUNDING_PARTNER_ENQUIRY
      ? foundingPartnerFields.map(([key, label]) => state[key] && `${label}: ${state[key]}`)
      : [];
  const body = [
    `Enquiry type: ${state.enquiryType}`,
    `Name: ${state.name}`,
    `Email: ${state.email}`,
    `Phone: ${state.phone}`,
    `Role: ${state.role}`,
    `Institution / group: ${state.institution}`,
    `Campuses: ${state.campusCount}`,
    state.currentSystem && `Current system: ${state.currentSystem}`,
    state.primaryPain && `Primary pain point: ${state.primaryPain}`,
    ...founding,
    "",
    state.message,
  ]
    .filter(Boolean)
    .join("\n");

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

type SubmitStatus = "idle" | "verifying" | "submitting" | "success" | "error" | "draft";

/**
 * The three steps. Each one asks for what a person can answer without
 * looking anything up, and the required fields are front-loaded so the
 * optional ones never block the request.
 */
const steps = [
  { id: "about", label: "About you", hint: "Who to reply to" },
  { id: "institution", label: "Institution", hint: "Scale and role" },
  { id: "focus", label: "Focus", hint: "What to cover" },
] as const;

type StepIndex = 0 | 1 | 2;
const LAST_STEP: StepIndex = 2;

/** Field-level messages. Native validity is the source of truth; these are the words. */
function validationMessage(control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  const v = control.validity;
  if (v.valueMissing) {
    return control.type === "radio"
      ? "Choose one to continue."
      : control.type === "checkbox"
        ? "Please confirm to continue."
        : "This one is needed to reply to you.";
  }
  if (v.typeMismatch && control.type === "email") {
    return "That does not look like an email address.";
  }
  if (v.typeMismatch || v.patternMismatch) {
    return "Please check this value.";
  }
  return control.validationMessage || "Please check this value.";
}

const fieldClassName =
  "h-12 w-full rounded-xl border border-(--line-strong) bg-(--surface-raised) px-4 text-[0.95rem] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus:border-(--brand) focus:ring-4 focus:ring-(--brand-tint) aria-invalid:border-(--state-critical) aria-invalid:ring-4 aria-invalid:ring-(--state-critical-soft)";

const labelClassName = "mb-1.5 block text-sm font-medium text-foreground";

/** Choice chip: a native radio, visually a pill. `has-checked` styles the label. */
const chipClassName =
  "group/chip relative flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-(--line-strong) bg-(--surface-raised) px-4 py-2 text-sm leading-5 text-foreground transition-[border-color,background-color,box-shadow,color] hover:border-(--brand) has-checked:border-(--brand) has-checked:bg-(--brand) has-checked:text-white has-checked:shadow-[0_8px_24px_-10px_var(--brand)] has-focus-visible:ring-4 has-focus-visible:ring-(--brand-tint)";

function Field({
  id,
  label,
  optional = false,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClassName}>
        {label}
        {optional ? (
          <span className="ml-1.5 font-normal text-muted-foreground">Optional</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-(--state-critical)" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ChoiceGroup({
  name,
  legend,
  options,
  value,
  onChange,
  required = false,
  optional = false,
  error,
  columns = "wrap",
}: {
  name: keyof DemoFormState;
  legend: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  optional?: boolean;
  error?: string;
  columns?: "wrap" | "segmented";
}) {
  const errorId = useId();
  return (
    <fieldset
      aria-describedby={error ? errorId : undefined}
      aria-invalid={error ? true : undefined}
    >
      <legend className={labelClassName}>
        {legend}
        {optional ? (
          <span className="ml-1.5 font-normal text-muted-foreground">Optional</span>
        ) : null}
      </legend>
      <div
        className={cn(columns === "segmented" ? "grid grid-cols-2 gap-2" : "flex flex-wrap gap-2")}
      >
        {options.map((option) => (
          <label
            key={option}
            className={cn(
              chipClassName,
              columns === "segmented" && "justify-center px-3 text-center"
            )}
          >
            <input
              type="radio"
              name={name}
              value={option}
              required={required}
              checked={value === option}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            <Check
              aria-hidden
              className="size-3.5 shrink-0 scale-0 opacity-0 transition-[transform,opacity] group-has-checked/chip:scale-100 group-has-checked/chip:opacity-100"
            />
            <span className={cn(columns === "segmented" && "-ml-5.5 group-has-checked/chip:ml-0")}>
              {option}
            </span>
          </label>
        ))}
      </div>
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-(--state-critical)" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

function StepRail({ current, onJump }: { current: StepIndex; onJump: (step: StepIndex) => void }) {
  return (
    <ol className="flex items-start gap-2 sm:gap-3" aria-label="Request steps">
      {steps.map((step, index) => {
        const state = index < current ? "done" : index === current ? "current" : "todo";
        const label = (
          <>
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-[0.7rem] transition-colors",
                state === "done" && "border-(--brand) bg-(--brand) text-white",
                state === "current" &&
                  "border-(--brand) bg-(--surface-raised) text-(--brand-ink) ring-4 ring-(--brand-tint)",
                state === "todo" &&
                  "border-(--line-strong) bg-(--surface-raised) text-muted-foreground"
              )}
            >
              {state === "done" ? <Check aria-hidden className="size-3.5" /> : index + 1}
            </span>
            <span className="min-w-0">
              <span
                className={cn(
                  // truncate, not nowrap: a nowrap label gave the rail a 342px
                  // minimum width, wider than the form panel on a 375px phone.
                  "block truncate text-sm font-medium",
                  state === "todo" ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {step.label}
              </span>
              <span className="hidden whitespace-nowrap text-xs text-muted-foreground lg:block">
                {step.hint}
              </span>
            </span>
          </>
        );
        return (
          <li
            key={step.id}
            className={cn("flex min-w-0 flex-1 items-start gap-2", index > 0 && "sm:gap-3")}
            aria-current={state === "current" ? "step" : undefined}
          >
            {index > 0 ? (
              <span
                aria-hidden
                className={cn(
                  "mt-3.5 h-px w-4 shrink-0 sm:w-6",
                  index <= current ? "bg-(--brand)" : "bg-(--line-strong)"
                )}
              />
            ) : null}
            {state === "done" ? (
              <button
                type="button"
                onClick={() => onJump(index as StepIndex)}
                className="flex min-w-0 items-start gap-2 rounded-lg text-left hover:opacity-80"
              >
                {label}
              </button>
            ) : (
              <span className="flex min-w-0 items-start gap-2">{label}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/**
 * One enquiry form, used by the dedicated demo and founding-partner journeys. The journey is fixed by the page
 * (`intent`), never by a query string or a choice inside the form, so each
 * page has one heading and one purpose (see content/demo-intents.ts).
 */
export function ContactForm({ intent = "demo" }: { intent?: FormIntent }) {
  const [state, setState] = useState<DemoFormState>({
    ...initialState,
    enquiryType: enquiryTypes[intent],
  });
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [step, setStep] = useState<StepIndex>(0);
  const [errors, setErrors] = useState<Partial<Record<keyof DemoFormState, string>>>({});
  const [announcement, setAnnouncement] = useState("");
  const [checking, setChecking] = useState(false);
  const mountedRef = useRef(true);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousStepRef = useRef(step);
  const ids = useId();
  const isFoundingPartner = state.enquiryType === FOUNDING_PARTNER_ENQUIRY;
  const intentCopy = formCopy[intent];

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Moving between steps: announce, and put focus on the first control of
  // the new step. Not on first render — that would steal focus on page load.
  useEffect(() => {
    // Compare the actual step, so Strict Mode effect replay cannot focus or
    // scroll the form on mount and override navigation to a section anchor.
    if (previousStepRef.current === step) return;
    previousStepRef.current = step;
    setAnnouncement(`Step ${step + 1} of ${steps.length}: ${steps[step].label}`);
    const first = panelRef.current?.querySelector<HTMLElement>(
      "input:not([type=hidden]):not(.sr-only), select, textarea, label:has(input.sr-only) input"
    );
    first?.focus({ preventScroll: true });
    panelRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [step]);

  const set = <K extends keyof DemoFormState>(key: K, value: DemoFormState[K]) => {
    setState((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  /** Validate only the controls rendered in the current step. */
  const validateStep = () => {
    const panel = panelRef.current;
    if (!panel) {
      return true;
    }
    const controls = Array.from(
      panel.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        "input, select, textarea"
      )
    );
    const next: Partial<Record<keyof DemoFormState, string>> = {};
    let firstInvalid: HTMLElement | null = null;
    for (const control of controls) {
      if (control.validity.valid) {
        continue;
      }
      const key = control.name as keyof DemoFormState;
      if (!next[key]) {
        next[key] = validationMessage(control);
        firstInvalid ??= control;
      }
    }
    setErrors(next);
    if (firstInvalid) {
      firstInvalid.focus({ preventScroll: true });
      return false;
    }
    return true;
  };

  const goTo = (next: StepIndex) => {
    setErrors({});
    setStep(next);
  };

  const submit = () => {
    // Honeypot: bots fill the hidden field, humans never see it.
    if (state.website) {
      setStatus("success");
      toast.success("Your request has been sent.");
      setState({ ...initialState, enquiryType: enquiryTypes[intent] });
      return;
    }

    if (EMAIL_DRAFT_MODE) {
      // Explicit interim mode: the UI already tells the visitor that
      // submitting opens a pre-filled email draft.
      window.location.href = buildEmailDraft(state);
      setStatus("draft");
      toast.success("Email draft opened — send it from your mail app to complete the request.");
      return;
    }

    if (!CONTACT_ENDPOINT) {
      // Dev-only path: production builds cannot reach here (build fails
      // without an endpoint or the explicit email mode). Surface loudly.
      setStatus("error");
      toast.error(
        `Form endpoint is not configured (NEXT_PUBLIC_CONTACT_ENDPOINT). Email us at ${CONTACT_EMAIL}.`
      );
      return;
    }

    // Everything the visitor typed is valid. The only thing left is the human
    // check, which is why it opens here rather than sitting in the form as one
    // more step to clear on the way down: nobody reading the page is asked to
    // prove anything, and no board is rendered for a form that was never sent.
    if (!CHALLENGE_ENDPOINT) {
      void submitToIntake();
      return;
    }
    setStatus("verifying");
    setChecking(true);
  };

  /** The actual POST. Carries a pass token when the check issued one. */
  const submitToIntake = async (humanToken?: string) => {
    setStatus("submitting");

    try {
      const response = await fetch(CONTACT_ENDPOINT as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // The intent also rides along in `source`, which the intake function
        // has always stored, so a founding-partner enquiry is distinguishable
        // even before the handler's field allowlist is redeployed.
        body: JSON.stringify({
          ...buildPayload(state),
          source: sourceTags[intent],
          ...(humanToken ? { humanToken } : {}),
        }),
      });

      if (!response.ok) {
        if (mountedRef.current) setStatus("error");
        if (response.status === 429) {
          toast.error("Too many requests from this connection. Please try again in an hour.");
        } else {
          toast.error(`Unable to submit right now. You can email us at ${CONTACT_EMAIL}.`);
        }
        return;
      }

      toast.success("Your request has been sent. We reply within one business day.");
      if (mountedRef.current) {
        setStatus("success");
      }
    } catch (error) {
      console.error(error);
      if (mountedRef.current) setStatus("error");
      toast.error(`Unable to submit right now. You can email us at ${CONTACT_EMAIL}.`);
    }
  };

  const handleCheckResult = (result: HumanCheckResult) => {
    setChecking(false);
    if (result.kind === "cancel") {
      // Nothing typed is lost; the form is exactly where they left it.
      setStatus("idle");
      return;
    }
    void submitToIntake(result.kind === "pass" ? result.token : undefined);
  };

  // One handler for Enter and for the buttons: Continue on the early steps,
  // the real submit on the last. `noValidate` on the form keeps the browser
  // from trying to focus a required control that is not on screen.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateStep()) {
      return;
    }
    if (step < LAST_STEP) {
      goTo((step + 1) as StepIndex);
      return;
    }
    submit();
  };

  if (status === "success" || status === "draft") {
    return (
      <>
        <Toaster position="top-right" richColors />
        <div
          className="rounded-[1.4rem] border border-(--line) bg-(--surface-raised) p-6 sm:p-8"
          role="status"
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-(--state-ok-soft) text-(--state-ok)">
            <Check aria-hidden className="size-5" />
          </span>
          <h3 className="type-card-title mt-5 text-foreground">
            {status === "draft" ? "Email draft opened" : "Request received"}
          </h3>
          <p className="type-support mt-2 max-w-md">
            {status === "draft"
              ? "Send it from your mail app to complete the request. We reply within one business day."
              : intentCopy.successNote}
          </p>
          <div className="mt-6 text-sm text-muted-foreground">
            Something to add?{" "}
            <ButtonLink
              href={`mailto:${CONTACT_EMAIL}`}
              label="Email the team"
              variant="ghost"
              className="min-h-0 border-none px-0 py-0 align-baseline"
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Toaster lives with the form (the only surface that fires toasts), so
          sonner ships on /demo instead of every page in the root layout. */}
      <Toaster position="top-right" richColors />
      {checking && CHALLENGE_ENDPOINT ? (
        <HumanCheck endpoint={CHALLENGE_ENDPOINT} onResolve={handleCheckResult} />
      ) : null}
      <form onSubmit={handleSubmit} noValidate className="grid gap-6">
        <StepRail current={step} onJump={goTo} />
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>

        <div
          key={step}
          ref={panelRef}
          className="grid gap-5 animate-in fade-in slide-in-from-right-2 duration-300 motion-reduce:animate-none"
        >
          {step === 0 ? (
            <>
              <Field id={`${ids}-name`} label="Your name" error={errors.name}>
                <input
                  id={`${ids}-name`}
                  name="name"
                  required
                  autoComplete="name"
                  className={fieldClassName}
                  placeholder="Full name"
                  value={state.name}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? `${ids}-name-error` : undefined}
                  onChange={(event) => set("name", event.target.value)}
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field id={`${ids}-email`} label="Work email" error={errors.email}>
                  <input
                    id={`${ids}-email`}
                    name="email"
                    required
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    className={fieldClassName}
                    placeholder="you@institution.edu.in"
                    value={state.email}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? `${ids}-email-error` : undefined}
                    onChange={(event) => set("email", event.target.value)}
                  />
                </Field>
                <Field id={`${ids}-phone`} label="Phone" error={errors.phone} optional>
                  <input
                    id={`${ids}-phone`}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    className={fieldClassName}
                    placeholder="+91"
                    value={state.phone}
                    aria-invalid={errors.phone ? true : undefined}
                    aria-describedby={errors.phone ? `${ids}-phone-error` : undefined}
                    onChange={(event) => set("phone", event.target.value)}
                  />
                </Field>
              </div>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <Field
                id={`${ids}-institution`}
                label="Institution or group"
                error={errors.institution}
              >
                <input
                  id={`${ids}-institution`}
                  name="institution"
                  required
                  autoComplete="organization"
                  className={fieldClassName}
                  placeholder="Institution or group name"
                  value={state.institution}
                  aria-invalid={errors.institution ? true : undefined}
                  aria-describedby={errors.institution ? `${ids}-institution-error` : undefined}
                  onChange={(event) => set("institution", event.target.value)}
                />
              </Field>

              <ChoiceGroup
                name="campusCount"
                legend="How many campuses?"
                options={campusCountOptions}
                value={state.campusCount}
                onChange={(value) => set("campusCount", value)}
                required
                error={errors.campusCount}
                columns="segmented"
              />

              <ChoiceGroup
                name="role"
                legend="Your role"
                options={roleOptions}
                value={state.role}
                onChange={(value) => set("role", value)}
                required
                error={errors.role}
              />

              <Field id={`${ids}-current-system`} label="What runs the institution today?" optional>
                <input
                  id={`${ids}-current-system`}
                  name="currentSystem"
                  autoComplete="off"
                  className={fieldClassName}
                  placeholder="An ERP name, spreadsheets, or a mix"
                  value={state.currentSystem}
                  onChange={(event) => set("currentSystem", event.target.value)}
                />
              </Field>
            </>
          ) : null}

          {step === 2 ? (
            <>
              {/* What the visitor has told us so far, so the last step feels
                  like a confirmation rather than another form. */}
              <dl className="flex flex-wrap gap-x-5 gap-y-1.5 rounded-xl bg-(--surface-sunken) px-4 py-3 text-sm">
                {[
                  ["Request", state.enquiryType],
                  ["Institution", state.institution],
                  ["Scale", state.campusCount],
                  ["Role", state.role],
                ].map(([term, value]) => (
                  <div key={term} className="flex gap-1.5">
                    <dt className="text-muted-foreground">{term}</dt>
                    <dd className="font-medium text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>

              <ChoiceGroup
                name="primaryPain"
                legend="Where does it hurt most?"
                options={primaryPainOptions}
                value={state.primaryPain}
                onChange={(value) => set("primaryPain", value)}
                optional
              />

              {isFoundingPartner ? (
                <div className="grid gap-5 rounded-2xl border border-(--line) bg-(--surface-sunken) p-4 sm:p-5">
                  <p className="text-sm leading-6 text-muted-foreground">
                    The diagnosis is only as good as the bottleneck. Anything you can answer here
                    makes the first conversation shorter and more concrete. All optional.
                  </p>
                  <Field id={`${ids}-bottleneck`} label="The operational bottleneck" optional>
                    <textarea
                      id={`${ids}-bottleneck`}
                      name="bottleneck"
                      rows={3}
                      className={cn(fieldClassName, "h-auto resize-y py-3")}
                      placeholder="Where visibility arrives late, ownership becomes unclear, or staff rebuild the same truth by hand."
                      value={state.bottleneck}
                      onChange={(event) => set("bottleneck", event.target.value)}
                    />
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id={`${ids}-pilot-unit`} label="Intended pilot unit" optional>
                      <input
                        id={`${ids}-pilot-unit`}
                        name="pilotUnit"
                        autoComplete="off"
                        className={fieldClassName}
                        placeholder="One campus, school, department or workflow"
                        value={state.pilotUnit}
                        onChange={(event) => set("pilotUnit", event.target.value)}
                      />
                    </Field>
                    <Field id={`${ids}-sponsor`} label="Accountable executive sponsor" optional>
                      <input
                        id={`${ids}-sponsor`}
                        name="executiveSponsor"
                        autoComplete="off"
                        className={fieldClassName}
                        placeholder="Name and role, or 'to be confirmed'"
                        value={state.executiveSponsor}
                        onChange={(event) => set("executiveSponsor", event.target.value)}
                      />
                    </Field>
                  </div>
                  <ChoiceGroup
                    name="timeSensitivity"
                    legend="Time sensitivity"
                    options={timeSensitivityOptions}
                    value={state.timeSensitivity}
                    onChange={(value) => set("timeSensitivity", value)}
                    optional
                  />
                  <Field id={`${ids}-success`} label="What would count as success" optional>
                    <input
                      id={`${ids}-success`}
                      name="successMeasure"
                      autoComplete="off"
                      className={fieldClassName}
                      placeholder="One measure you would judge the pilot on"
                      value={state.successMeasure}
                      onChange={(event) => set("successMeasure", event.target.value)}
                    />
                  </Field>
                </div>
              ) : null}

              <Field id={`${ids}-message`} label="Anything the session should focus on?" optional>
                <textarea
                  id={`${ids}-message`}
                  name="message"
                  rows={3}
                  className={cn(fieldClassName, "h-auto resize-y py-3")}
                  placeholder="Current stack, timelines, or the one workflow you want to see."
                  value={state.message}
                  onChange={(event) => set("message", event.target.value)}
                />
              </Field>

              <div>
                <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    checked={state.consent}
                    aria-invalid={errors.consent ? true : undefined}
                    onChange={(event) => set("consent", event.target.checked)}
                    className="mt-1 size-4 shrink-0 accent-(--brand)"
                  />
                  <span>
                    SquareCampus may contact me about this request and process the details above as
                    described in the{" "}
                    <a
                      href={siteHref("squarecampus", "/privacy-policy/")}
                      className="underline underline-offset-2 hover:text-foreground"
                    >
                      privacy policy
                    </a>
                    .
                  </span>
                </label>
                {errors.consent ? (
                  <p className="mt-1.5 text-sm text-(--state-critical)" role="alert">
                    {errors.consent}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}
        </div>

        {/* Honeypot field — visually hidden and skipped by keyboard users. */}
        <input
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          placeholder="Website"
          value={state.website}
          onChange={(event) => set("website", event.target.value)}
        />

        <div className="flex flex-col-reverse gap-3 border-t border-(--line) pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => goTo((step - 1) as StepIndex)}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-foreground transition-colors hover:bg-(--surface-muted)"
              >
                <ArrowLeft aria-hidden className="size-4" />
                Back
              </button>
            ) : null}
            <p aria-live="polite" className="max-w-sm text-sm leading-5 text-muted-foreground">
              {status === "error"
                ? `Submission failed. Email us at ${CONTACT_EMAIL} and we will pick it up.`
                : step === LAST_STEP
                  ? EMAIL_DRAFT_MODE
                    ? `Submitting opens a pre-filled email draft to ${CONTACT_EMAIL} — nothing is sent until you hit send.`
                    : intentCopy.idleNote
                  : `Step ${step + 1} of ${steps.length}`}
            </p>
          </div>
          <button
            type="submit"
            disabled={status === "submitting" || status === "verifying"}
            className={cn(
              "group/button inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-60",
              step === LAST_STEP
                ? "cta-button text-white"
                : "bg-foreground text-background hover:opacity-92 active:opacity-85"
            )}
          >
            {status === "submitting" || status === "verifying"
              ? "Sending…"
              : step === LAST_STEP
                ? EMAIL_DRAFT_MODE
                  ? intentCopy.emailSubmitLabel
                  : intentCopy.submitLabel
                : "Continue"}
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-300 group-hover/button:translate-x-0.5"
            />
          </button>
        </div>
      </form>
    </>
  );
}
