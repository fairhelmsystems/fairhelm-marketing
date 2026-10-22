"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@fairhelm/ui/components/accordion";
import { faqCategories, faqs } from "@/content/faq";
import { cn } from "@fairhelm/ui/lib/utils";

export function FaqExplorer() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((faq) => {
      const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
      const matchesQuery =
        !q || faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                activeCategory === category.id
                  ? "border-transparent bg-foreground text-background"
                  : "border-(--line) bg-(--surface) text-muted-foreground hover:text-foreground"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
        <label className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search questions"
            className="h-11 w-full rounded-full border border-(--line) bg-(--surface) pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-(--line-strong)"
          />
        </label>
      </div>

      {filtered.length ? (
        <Accordion className="surface-panel rounded-[1.6rem] px-6">
          {filtered.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="py-5 text-left font-display text-base tracking-[-0.02em] hover:no-underline sm:text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="max-w-3xl text-base leading-7 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="surface-panel rounded-[1.6rem] p-8 text-center">
          <p className="font-display text-xl tracking-[-0.03em]">No matching questions.</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Try a different search, or email{" "}
            <a
              href="mailto:contact@squarecampus.com"
              className="text-foreground underline underline-offset-4"
            >
              contact@squarecampus.com
            </a>{" "}
            — we reply within one business day.
          </p>
        </div>
      )}
    </div>
  );
}
