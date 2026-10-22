import type { ReactNode } from "react";
import { Container } from "./container";

export type DocumentContentsLink = { label: string; href: string };

export function LegalReadingLayout({
  contents,
  children,
}: {
  contents: readonly DocumentContentsLink[];
  children: ReactNode;
}) {
  return (
    <section className="section px-4 sm:px-6 lg:px-8" data-legal-reading-layout>
      <Container className="grid max-w-6xl gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-14">
        <aside className="min-w-0 self-start lg:sticky lg:top-28">
          <nav aria-label="Document sections">
            <p className="eyebrow">On this page</p>
            <div className="no-scrollbar mt-4 flex gap-1 overflow-x-auto pb-1 lg:max-h-[calc(100dvh-9rem)] lg:flex-col lg:overflow-y-auto lg:overscroll-contain">
              {contents.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="shrink-0 rounded-full border border-border px-3 py-2 text-xs whitespace-nowrap text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground focus-visible:outline-2 focus-visible:outline-(--brand) lg:rounded-lg lg:border-transparent lg:text-sm lg:whitespace-normal lg:hover:bg-accent"
                >
                  <span className="mr-2 font-mono text-[0.62rem] text-(--brand)">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        </aside>
        <article className="min-w-0 text-[0.95rem] leading-7 text-muted-foreground">
          {children}
        </article>
      </Container>
    </section>
  );
}
