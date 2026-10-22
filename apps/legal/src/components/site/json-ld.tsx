type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD is generated exclusively from local, static objects.
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON is serialized from trusted local constants and escapes opening angle brackets.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
