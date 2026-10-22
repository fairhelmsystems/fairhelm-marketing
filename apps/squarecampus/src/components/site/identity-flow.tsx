import { ArrowRight, Building2, ShieldCheck } from "lucide-react";
import type { ElementType } from "react";
import { OperationalBadge } from "@fairhelm/ui/components/marketing";

/**
 * Identity flow for institutional single sign-on (Microsoft Entra ID, from
 * all plans, subject to quotation and technical onboarding).
 *
 * The whole point of the diagram is the boundary: the institution's own tenant
 * answers "who is this person", and SquareCampus answers "what may they do".
 * So it renders as two labelled zones rather than one flat chain — native
 * HTML/CSS, ordered lists, no image, readable at every width.
 */

type Zone = {
  icon: ElementType;
  label: string;
  caption: string;
  steps: readonly string[];
};

const tenantZone: Zone = {
  icon: Building2,
  label: "Your Microsoft environment",
  caption: "Stays under your administration",
  steps: [
    "Your administrator approves SquareCampus in your Microsoft Entra ID tenant.",
    "Staff sign in with their existing institutional Microsoft accounts.",
    "Your MFA, Conditional Access and user-assignment policies continue to apply.",
  ],
};

const squarecampusZone: Zone = {
  icon: ShieldCheck,
  label: "SquareCampus authorisation",
  caption: "Governed inside the School OS",
  steps: [
    "SquareCampus validates that the sign-in came from your approved tenant.",
    "It resolves the person's institution membership and campus scope.",
    "It applies role, record and workflow permissions defined in SquareCampus.",
    "A secure SquareCampus session is issued.",
  ],
};

function ZonePanel({ zone, tone }: { zone: Zone; tone: "quiet" | "raised" }) {
  return (
    <section
      className={
        tone === "quiet"
          ? "surface-quiet rounded-[var(--radius-panel)] p-6"
          : "surface-panel rounded-[var(--radius-panel)] p-6"
      }
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-tint)]">
          <zone.icon aria-hidden className="size-4 text-[color:var(--brand)]" />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-[color:var(--foreground)]">{zone.label}</h3>
          <p className="type-caption mt-0.5">{zone.caption}</p>
        </div>
      </div>

      <ol className="mt-5 space-y-3">
        {zone.steps.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span aria-hidden className="type-caption mt-0.5 shrink-0 text-[color:var(--brand)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="type-support">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function IdentityFlow() {
  return (
    <div>
      <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr] lg:gap-3">
        <ZonePanel zone={tenantZone} tone="quiet" />

        <div aria-hidden className="flex items-center justify-center lg:px-1">
          <span className="inline-flex size-9 items-center justify-center rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface)]">
            <ArrowRight className="size-4 rotate-90 text-[color:var(--muted-foreground)] lg:rotate-0" />
          </span>
        </div>

        <ZonePanel zone={squarecampusZone} tone="raised" />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
        <OperationalBadge tone="brand">Available separately on any plan</OperationalBadge>
        <p className="type-support">
          Microsoft Entra ID verifies who the user is. SquareCampus determines what the user may
          access and perform. Single sign-on is chosen by the institution, never required.
        </p>
      </div>
    </div>
  );
}
