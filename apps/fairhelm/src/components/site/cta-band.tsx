import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { CTAGroup, FeaturePanel, SectionHeader } from "@fairhelm/ui/components/marketing";
import { Container } from "@/components/site/container";
import { siteConfig } from "@/lib/site-config";

export function CtaBand({
  eyebrow = "Next move",
  title = "Bring operational clarity to the systems that matter.",
  description = "Talk to Fairhelm Systems about SquareCampus, a reliable data foundation, or a command surface your leadership can trust.",
  label = "Start a conversation",
  href = "/contact/",
  secondaryLabel = "Visit squarecampus.com",
  secondaryHref = siteConfig.product.url,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  label?: string;
  href?: string;
  secondaryLabel?: string | null;
  secondaryHref?: string;
}) {
  return (
    <section className="section pt-4 sm:pt-8 lg:pt-10">
      <Container>
        <FeaturePanel tone="strong" className="relative overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <SectionHeader eyebrow={eyebrow} title={title} body={description} />
            <CTAGroup className="flex-col items-stretch sm:flex-row lg:flex-col lg:items-end">
              <ButtonLink href={href} label={label} variant="cta" />
              {secondaryLabel ? (
                <ButtonLink href={secondaryHref} label={secondaryLabel} variant="secondary" />
              ) : null}
            </CTAGroup>
          </div>
        </FeaturePanel>
      </Container>
    </section>
  );
}
