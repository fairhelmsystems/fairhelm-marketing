import { launchPilot } from "@/content/commercial";
import { ButtonLink } from "@fairhelm/ui/components/button-link";

/** A clear route to the launch programme without changing founding terms. */
export function LaunchPilotNote() {
  return (
    <aside
      aria-label={launchPilot.name}
      className="surface-quiet mt-6 rounded-[var(--radius-panel)] p-6 sm:p-8"
    >
      <p className="eyebrow">A separate launch programme</p>
      <h2 className="type-card-title mt-3">{launchPilot.name}</h2>
      <p className="type-support mt-3">{launchPilot.summary}</p>
      <p className="type-support mt-3">{launchPilot.separation}</p>
      <ButtonLink
        href={launchPilot.href}
        label="Review launch-pilot eligibility"
        variant="link"
        className="mt-3"
      />
    </aside>
  );
}
