import path from "node:path";
import type { NextConfig } from "next";
import { blogHref } from "@fairhelm/config/urls";
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  transpilePackages: ["@fairhelm/ui", "@fairhelm/config", "@fairhelm/fairhelm-content"],
  turbopack: { root: path.resolve(import.meta.dirname, "../..") },
  ...(process.env.NODE_ENV === "development"
    ? {
        redirects: async () => [
          { source: "/insights/feed.xml", destination: blogHref("/feed.xml"), permanent: true },
          {
            source: "/insights/:path*",
            destination: `${blogHref("/fairhelm/")}:path*`,
            permanent: true,
          },
          { source: "/blog/:path*", destination: `${blogHref("/")}:path*`, permanent: true },
        ],
      }
    : {}),
};
export default config;
