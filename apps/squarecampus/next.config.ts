import type { NextConfig } from "next";
import path from "node:path";
import { blogHref } from "@fairhelm/config/urls";

/**
 * Static export build for CloudFront + S3 hosting.
 *
 * Everything that used to live in `headers()` / `redirects()` / middleware
 * must now be configured at the edge: a CloudFront Function (redirects +
 * index rewrites) and a Response Headers Policy (CSP, HSTS and the rest of
 * the security header set), both documented in the private infrastructure
 * runbook.
 */
// The demo form posts to an external intake endpoint (the static export has
// no server). A production build without it would ship a broken form, so the
// build fails loudly instead of silently falling back to mailto. The one
// sanctioned interim state is NEXT_PUBLIC_CONTACT_FORM_MODE=email, which
// renders the form in an explicit, user-visible email-draft mode.
if (
  process.env.NODE_ENV === "production" &&
  !process.env.NEXT_PUBLIC_CONTACT_ENDPOINT &&
  process.env.NEXT_PUBLIC_CONTACT_FORM_MODE !== "email"
) {
  throw new Error(
    "NEXT_PUBLIC_CONTACT_ENDPOINT is not set. Production builds require a real form intake " +
      "endpoint (see .env.example), or set NEXT_PUBLIC_CONTACT_FORM_MODE=email to ship the " +
      "explicit email-draft mode until the endpoint exists."
  );
}

const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ["@fairhelm/ui", "@fairhelm/squarecampus-content", "@fairhelm/config"],
  turbopack: { root: path.resolve(import.meta.dirname, "../..") },
  ...(process.env.NODE_ENV === "development"
    ? {
        redirects: async () => [
          { source: "/blog/feed.xml", destination: blogHref("/feed.xml"), permanent: true },
          { source: "/blog/:path*", destination: `${blogHref("/")}:path*`, permanent: true },
        ],
      }
    : {}),
  trailingSlash: true,
  images: {
    // CloudFront serves the exported files directly; there is no image
    // optimizer at request time. Source images are pre-sized in /public.
    unoptimized: true,
  },
};

export default nextConfig;
