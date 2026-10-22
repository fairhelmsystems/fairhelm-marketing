import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { DataField } from "@/components/site/data-field";
import { buttonVariants } from "@fairhelm/ui/components/button";
import { cn } from "@fairhelm/ui/lib/utils";

export default function NotFound() {
  return (
    <section className="hero-bleed relative isolate overflow-hidden py-24 sm:py-36">
      <div aria-hidden="true" className="hero-grid absolute inset-0 -z-10 opacity-45" />
      <DataField className="-z-10" />
      <Container className="relative max-w-3xl text-center">
        <p className="eyebrow">404 · Route not found</p>
        <h1 className="display-1 mt-5">This path is outside the system.</h1>
        <p className="lead mx-auto mt-5 max-w-xl">
          The page may have moved, or the address may be incomplete. Return to the canonical
          Fairhelm Systems site.
        </p>
        <Link href="/" className={cn(buttonVariants({ size: "lg" }), "mt-8")}>
          Return home
          <ArrowRight data-icon="inline-end" />
        </Link>
      </Container>
    </section>
  );
}
