import Link from "next/link";
export default function NotFound() {
  return (
    <main tabIndex={-1} id="main-content" className="mx-auto min-h-[60vh] max-w-3xl px-6 py-24">
      <h1 className="type-page-title">Article not found</h1>
      <p className="mt-5 text-muted-foreground">This article is unavailable.</p>
      <Link className="mt-6 inline-block underline" href="/">
        Browse published articles
      </Link>
    </main>
  );
}
