export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { SEO_CONFIG } from "@/lib/seo";

/**
 * Web app manifest: gives Android/Chrome a real home-screen icon, name, and
 * splash colors instead of a screenshot. iOS uses app/apple-icon.png. Colors
 * track the light default theme so the launch splash matches the page.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SquareCampus — School OS for India",
    short_name: "SquareCampus",
    description: SEO_CONFIG.defaultDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#020305",
    theme_color: "#020305",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
