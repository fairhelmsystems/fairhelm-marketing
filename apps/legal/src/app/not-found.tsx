import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="type-page-title">Page not found</h1>
      <p className="type-body mt-5">This document is not available at this address.</p>
      <Link className="mt-6 inline-block underline" href="/">
        Return to Fairhelm Legal
      </Link>
    </main>
  );
}
