import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { workflows } from "@/content/workflows";
import { cn } from "@fairhelm/ui/lib/utils";
import { Reveal } from "@fairhelm/ui/components/reveal";

/**
 * The everyday workflows as cards: the task, what the team gets, and a
 * crawlable link to the solution page for the same task (content/workflows.ts).
 */
export function WorkflowCards({ className }: { className?: string }) {
  return (
    <Reveal staggerChildren className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {workflows.map((item) => (
        <article
          key={item.id}
          data-reveal-item
          className="surface-panel flex flex-col rounded-[1.6rem] p-6"
        >
          <h3 className="font-display text-xl tracking-[-0.03em] text-foreground">{item.title}</h3>
          <dl className="mt-4 grid flex-1 content-start gap-3 text-sm leading-6">
            <div>
              <dt className="font-medium text-foreground">The work</dt>
              <dd className="mt-0.5 text-muted-foreground">{item.task}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">The result</dt>
              <dd className="mt-0.5 text-muted-foreground">{item.result}</dd>
            </div>
          </dl>
          <Link
            href={item.href}
            className="group/link mt-5 inline-flex items-center gap-1.5 self-start text-sm font-medium text-(--brand-ink) underline-offset-4 hover:underline"
          >
            {item.linkLabel}
            <ArrowRight
              aria-hidden
              className="size-3.5 transition-transform group-hover/link:translate-x-0.5"
            />
          </Link>
        </article>
      ))}
    </Reveal>
  );
}
