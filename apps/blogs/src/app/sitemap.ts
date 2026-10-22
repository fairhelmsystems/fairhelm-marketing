import { getInsights } from "@fairhelm/fairhelm-content/insights";
import type { MetadataRoute } from "next";
import { blogPosts } from "@fairhelm/squarecampus-content/blog/posts";
import { canonicalUrl } from "@/lib/seo";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const latest = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date))[0]?.date;
  return [
    { url: canonicalUrl("/"), ...(latest ? { lastModified: latest } : {}) },
    { url: canonicalUrl("/fairhelm/") },
    { url: canonicalUrl("/squarecampus/") },
    ...getInsights().map((post) => ({ url: canonicalUrl(post.path), lastModified: post.date })),
    ...blogPosts.map((post) => ({ url: canonicalUrl(`/${post.slug}`), lastModified: post.date })),
  ];
}
