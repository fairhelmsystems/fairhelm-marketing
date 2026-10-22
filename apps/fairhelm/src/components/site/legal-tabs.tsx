"use client";

import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@fairhelm/ui/components/tabs";
import { siteConfig } from "@/lib/site-config";

export function LegalTabs({ current }: { current: string }) {
  return (
    <Tabs value={current} className="min-w-max gap-0">
      <TabsList
        aria-label="Legal and governance pages"
        variant="line"
        className="h-auto min-w-max justify-start gap-1 rounded-none bg-transparent p-0"
      >
        {siteConfig.legalNavigation.map((item) => (
          <TabsTrigger
            key={item.href}
            value={item.href}
            nativeButton={false}
            render={<Link href={item.href} />}
            className="h-11 flex-none px-3 text-xs data-active:text-[color:var(--brand-ink)] sm:px-4 sm:text-sm"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
