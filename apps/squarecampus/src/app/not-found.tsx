import type { Metadata } from "next";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main tabIndex={-1} id="main-content" className="flex min-h-[62vh] items-center justify-center px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-[6rem] leading-none tracking-[-0.08em] text-foreground/15 sm:text-[9rem]">
            Oops!
          </p>
          <p className="section-kicker mt-2">404</p>
          <h1 className="mt-5 font-display text-3xl tracking-[-0.05em] sm:text-4xl">
            Class dismissed on this page!
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-muted-foreground">
            The link may have moved when we reorganized the site. Everything about the platform,
            rollout, and security is still one click away.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/" label="Back to home" />
            <ButtonLink href="/platform" label="Explore the platform" variant="secondary" />
            <ButtonLink href="/demo" label="Book a demo" variant="secondary" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
