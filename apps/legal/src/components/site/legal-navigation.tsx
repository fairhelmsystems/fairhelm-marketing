import Link from "next/link";
import { cn } from "@fairhelm/ui/lib/utils";
import { documentPath, documentScopes, type LegalScope } from "@/lib/documents";
import { Container } from "./container";

export function LegalNavBand({
  current,
  scope = "fairhelm",
}: {
  current: string;
  scope?: LegalScope;
}) {
  const collection = documentScopes[scope];
  return (
    <nav
      aria-label={`${collection.name} documents`}
      className="border-y border-border bg-(--surface) px-4 sm:px-6 lg:px-8"
      data-legal-scope={scope}
    >
      <Container className="no-scrollbar flex items-center gap-2 overflow-x-auto py-2">
        <Link
          href={documentPath(scope)}
          className="shrink-0 border-r border-border px-3 py-3 text-xs font-medium text-foreground sm:text-sm"
        >
          {collection.name}
        </Link>
        {collection.documents.map((item) => {
          const active = current === `/${item.slug}/`;
          return (
            <Link
              key={item.slug}
              href={documentPath(scope, item.slug)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-full px-3 py-3 text-xs whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-(--brand) sm:text-sm",
                active
                  ? "bg-(--surface-muted) text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.title}
            </Link>
          );
        })}
      </Container>
    </nav>
  );
}
