import {
  fairhelmLegalPaths,
  LEGAL_ORIGIN,
  legalUrl,
  squarecampusLegalPaths,
} from "@fairhelm/config/urls";
import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${LEGAL_ORIGIN}/` },
    { url: legalUrl("fairhelm") },
    { url: legalUrl("squarecampus") },
    ...fairhelmLegalPaths
      .filter((slug) => slug !== "legal")
      .map((slug) => ({ url: legalUrl("fairhelm", slug) })),
    ...squarecampusLegalPaths
      .filter((slug) => slug !== "competitor-notice")
      .map((slug) => ({ url: legalUrl("squarecampus", slug) })),
  ];
}
