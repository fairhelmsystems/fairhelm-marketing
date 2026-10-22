import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { LaunchPilotNote } from "@/components/site/launch-pilot-note";
import { CTAGroup, Eyebrow, TrustNote } from "@fairhelm/ui/components/marketing";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { FOUNDING_PARTNER_DEMO_HREF, foundingPartners } from "@/content/founding-partners";
import { ctaLabels } from "@/content/site-content";

const { home } = foundingPartners;

/**
 * Homepage Founding Institutional Partner invitation.
 *
 * Deliberately compact (audit SC-009): the homepage prioritises the standard
 * product evaluation, so the programme gets one panel — what it is, who it is
 * for, and a route to the full terms on /launch-partners/, where the benefits,
 * path and diagnosis form live. The `#founding-partners` anchor is kept for
 * existing links.
 */
export function FoundingPartnerSection() {
  return (
    // scroll-mt: the header is sticky, so without it the section heading lands
    // underneath the header when someone follows /#founding-partners.
    <SectionShell id="founding-partners" className="scroll-mt-24">
      <Reveal>
        <div className="surface-panel rounded-[var(--radius-panel-lg)] p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_auto] lg:items-center lg:gap-12">
            <div>
              <Eyebrow>{home.eyebrow}</Eyebrow>
              <h2 className="type-card-title mt-3 text-[color:var(--foreground)]">
                {home.heading}
              </h2>
              <p className="type-support mt-3 max-w-3xl">{home.lead}</p>
              <TrustNote className="mt-4">{home.ctaNote}</TrustNote>
            </div>
            <CTAGroup className="lg:flex-col lg:items-stretch">
              <ButtonLink
                href={foundingPartners.href}
                label="See the programme terms"
                variant="secondary"
                className="w-full justify-center sm:w-auto"
              />
              <ButtonLink
                href={FOUNDING_PARTNER_DEMO_HREF}
                label={ctaLabels.foundingPartner}
                variant="ghost"
                className="w-full justify-center sm:w-auto"
              />
            </CTAGroup>
          </div>
        </div>
      </Reveal>
      <LaunchPilotNote />
    </SectionShell>
  );
}
