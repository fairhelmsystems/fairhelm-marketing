import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { Container } from "@/components/site/container";
import { DataField } from "@/components/site/data-field";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { CTAGroup } from "@fairhelm/ui/components/marketing";
import { cn } from "@fairhelm/ui/lib/utils";

type Cta = { label: string; href: string };

/**
 * Page opener. Text on the left, a product visual on the right; on phones
 * the visual follows the copy. `highlight` picks the phrase in `title` that
 * takes the brand gradient. `bullets` are the short proof points under the
 * calls to action. `visualLabel` is the caption under the visual — every
 * visual on this site is illustrative and says so.
 */
export function Hero({
  eyebrow,
  title,
  highlight,
  description,
  primary,
  secondary,
  bullets,
  children,
  visualLabel = "Illustrative preview using sample data",
  compact = false,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description: string;
  primary?: Cta;
  secondary?: Cta;
  bullets?: readonly string[];
  children?: ReactNode;
  visualLabel?: string | null;
  compact?: boolean;
}) {
  const renderTitle = () => {
    if (!highlight || !title.includes(highlight)) return title;
    const [before, after] = title.split(highlight);
    return (
      <>
        {before}
        <span className="text-gradient">{highlight}</span>
        {after}
      </>
    );
  };

  return (
    <section className="hero-bleed relative isolate overflow-hidden">
      <div aria-hidden="true" className="hero-grid absolute inset-0 -z-10 opacity-45" />
      <div aria-hidden="true" className="hero-glow absolute inset-x-0 top-0 -z-10 h-[36rem]" />
      <DataField className="-z-10" />
      <Container
        className={cn(
          "relative grid items-center gap-10 pt-10 pb-12 sm:gap-12 sm:pt-16 sm:pb-16 lg:gap-14 lg:pt-20 lg:pb-24",
          children && !compact ? "lg:grid-cols-[1.08fr_0.92fr]" : "max-w-4xl"
        )}
      >
        <div className="hero-enter flex flex-col gap-5 sm:gap-6">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display-1">{renderTitle()}</h1>
          <p className="lead max-w-2xl text-pretty">{description}</p>
          {primary || secondary ? (
            <CTAGroup className="flex-col items-stretch pt-1 sm:flex-row sm:items-center">
              {primary ? (
                <ButtonLink href={primary.href} label={primary.label} variant="cta" />
              ) : null}
              {secondary ? (
                <ButtonLink href={secondary.href} label={secondary.label} variant="secondary" />
              ) : null}
            </CTAGroup>
          ) : null}
          {bullets?.length ? (
            <ul className="mt-1 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-2.5 text-sm leading-6 text-muted-foreground"
                >
                  <Check aria-hidden="true" className="mt-1.5 size-3.5 shrink-0 text-teal" />
                  {bullet}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {children && !compact ? (
          <div className="hero-visual relative w-full min-w-0 lg:justify-self-end">
            {children}
            {visualLabel ? (
              <p data-md-skip className="mt-4 flex justify-center lg:justify-start">
                <span className="chip">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-teal" />
                  {visualLabel}
                </span>
              </p>
            ) : null}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
