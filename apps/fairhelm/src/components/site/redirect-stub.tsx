"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Client-side safety net for moved routes on the static export.
 * The real 301s live in the CloudFront Function (private infrastructure runbook);
 * this covers local previews and any origin reached without the edge.
 */
export function RedirectStub({ to, label }: { to: string; label: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(to);
  }, [router, to]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="surface-panel rounded-3xl p-8 text-center">
        <p className="section-kicker">This page has moved</p>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Taking you to{" "}
          <Link href={to} className="font-medium text-foreground underline underline-offset-4">
            {label}
          </Link>
          …
        </p>
      </div>
    </main>
  );
}
