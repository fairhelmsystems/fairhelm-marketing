"use client";
import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
export function ContentTabs({
  items,
  label,
  defaultValue,
}: {
  items: readonly {
    value: string;
    label: string;
    count: number;
    content: ReactNode;
    icon?: ReactNode;
  }[];
  label: string;
  defaultValue: string;
}) {
  return (
    <Tabs defaultValue={defaultValue} className="w-full gap-8">
      <div className="min-w-0 max-w-full overflow-x-auto pb-2">
        <TabsList
          aria-label={label}
          variant="line"
          className="h-auto min-w-max gap-2 border-b border-(--line) pb-3 group-data-[orientation=horizontal]/tabs:h-auto"
        >
          {items.map((item) => (
            <TabsTrigger key={item.value} value={item.value} className="min-h-11 gap-3 px-4">
              {item.icon ? <span aria-hidden>{item.icon}</span> : null}
              {item.label}
              <span className="rounded-full border border-(--line) px-2 py-0.5 font-mono text-xs">
                {item.count}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {items.map((item) => (
        <TabsContent key={item.value} value={item.value} className="w-full" keepMounted>
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
