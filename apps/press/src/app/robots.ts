import { PRESS_ORIGIN } from "@fairhelm/config/urls";
import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${PRESS_ORIGIN}/sitemap.xml` };
}
