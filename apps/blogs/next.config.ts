import path from "node:path";
import type { NextConfig } from "next";
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  transpilePackages: [
    "@fairhelm/ui",
    "@fairhelm/squarecampus-content",
    "@fairhelm/config",
    "@fairhelm/fairhelm-content",
  ],
  turbopack: { root: path.resolve(import.meta.dirname, "../..") },
};
export default config;
