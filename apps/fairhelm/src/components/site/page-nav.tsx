import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";

export type PageNavItem = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
};

/**
 * "Where next" pager at the end of an inner page: two routes a reader is
 * most likely to want after this one, so the site reads as a sequence rather
 * than a set of dead ends.
 */
export function PageNav({ items }: { items: readonly PageNavItem[] }) {
  return (
    <section aria-label="Continue reading" className="border-t border-border">
      <Container className="py-10 sm:py-12">
        <p className="eyebrow">Continue</p>
        <Reveal stagger className="mt-4 grid gap-3 sm:grid-cols-2">
          {items.map((item) => {
            const external = /^https?:/.test(item.href);
            const inner = (
              <>
                <span className="min-w-0">
                  <span className="eyebrow block text-[0.6rem]">{item.eyebrow}</span>
                  <span className="display-3 mt-2 block">{item.title}</span>
                  <span className="mt-1.5 block text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover/card:translate-x-0.5 group-hover/card:text-[color:var(--brand-ink)]"
                />
              </>
            );
            const classes =
              "group/card flex items-start justify-between gap-6 surface-panel rounded-[var(--radius-panel)] p-5 sm:p-6";
            return external ? (
              <a key={item.href} href={item.href} data-slot="card" className={classes}>
                {inner}
              </a>
            ) : (
              <Link key={item.href} href={item.href} data-slot="card" className={classes}>
                {inner}
              </Link>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
