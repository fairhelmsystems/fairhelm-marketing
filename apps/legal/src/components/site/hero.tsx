import { SectionShell } from "@fairhelm/ui/components/section-shell";
export function Hero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <SectionShell eyebrow={eyebrow} title={title} body={description} as="h1" titleSize="page">
      {null}
    </SectionShell>
  );
}
