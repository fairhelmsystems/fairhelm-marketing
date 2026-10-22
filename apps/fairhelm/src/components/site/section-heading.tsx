import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionHeader } from "@fairhelm/ui/components/marketing";

/** Company copy adapts to the shared section heading; typography lives in UI. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  number,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  number?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal>
      <SectionHeader
        eyebrow={number ? `${number} · ${eyebrow}` : eyebrow}
        title={title}
        body={description}
        align={align}
        className={className}
      />
    </Reveal>
  );
}
