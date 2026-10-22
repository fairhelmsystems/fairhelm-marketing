import { PRESS_ORIGIN } from "@fairhelm/config/urls";
import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${PRESS_ORIGIN}/` }];
}
