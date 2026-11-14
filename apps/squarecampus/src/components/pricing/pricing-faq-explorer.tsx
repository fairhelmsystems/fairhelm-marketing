"use client";

import { DetailsFaq } from "@fairhelm/ui/components/details-faq";
import { cn } from "@fairhelm/ui/lib/utils";
import { Search } from "lucide-react";
import { useState } from "react";
import { pricingFaqCategories, pricingFaqs } from "@/content/pricing";

const categories = Object.entries({ all: "All", ...pricingFaqCategories });

export function PricingFaqExplorer() {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const items = pricingFaqs.filter((faq) => {
    const text = `${faq.question} ${faq.answer}`.toLowerCase();
    return (
      (category === "all" || faq.category === category) &&
      terms.every((term) => text.includes(term))
    );
  });

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative w-full lg:max-w-xs">
          <span className="sr-only">Search pricing FAQs</span>
          <Search
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pricing FAQs"
            className="h-11 w-full rounded-full border border-(--line) bg-(--surface) pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </label>
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Pricing FAQ categories</legend>
          {categories.map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={category === id}
              onClick={() => setCategory(id)}
              className={cn(
                "min-h-11 rounded-full border px-4 py-2 text-sm transition-colors",
                category === id
                  ? "border-transparent bg-foreground text-background"
                  : "border-(--line) bg-(--surface) text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </fieldset>
      </div>
      <p role="status" className={items.length ? "sr-only" : "type-support"}>
        {items.length
          ? `${items.length} ${items.length === 1 ? "question" : "questions"} found.`
          : "No matching questions. Try a different search or category."}
      </p>
      <DetailsFaq items={items} className="pricing-faq" />
    </div>
  );
}
