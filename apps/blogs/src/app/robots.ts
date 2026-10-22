import type { MetadataRoute } from "next";
import { BLOGS_ORIGIN } from "@fairhelm/config/urls";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${BLOGS_ORIGIN}/sitemap.xml` };
}
