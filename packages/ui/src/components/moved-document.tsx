import Link from "next/link";
export function MovedDocument({ href, landmark = true }: { href: string; landmark?: boolean }) {
  const Tag = landmark ? "main" : "div";
  return (
    <Tag
      id={landmark ? "main-content" : undefined}
      tabIndex={landmark ? -1 : undefined}
      className="mx-auto min-h-[60vh] max-w-3xl px-6 py-24"
    >
      <h1 className="type-page-title">This document has moved.</h1>
      <p className="mt-6 type-body text-muted-foreground">
        Policies and press resources now have a dedicated home.
      </p>
      <Link href={href} className="mt-6 inline-block underline">
        Open the current document →
      </Link>
    </Tag>
  );
}
