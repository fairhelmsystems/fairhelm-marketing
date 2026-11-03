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
    // Legal documents keep their reviewed structure (label line above the
    // heading): the Terms Markdown is hash-checked by scripts/check-build.ts.
    <SectionShell
      eyebrow={eyebrow}
      eyebrowPlacement="above"
      title={title}
      body={description}
      as="h1"
      titleSize="page"
    >
      {null}
    </SectionShell>
  );
}
