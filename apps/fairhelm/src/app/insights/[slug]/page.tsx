import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getInsights, getInsight } from "@fairhelm/fairhelm-content/insights";
import { blogHref, blogUrl } from "@fairhelm/config/urls";
import { RedirectStub } from "@/components/site/redirect-stub";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return getInsights().map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: "Article has moved",
    robots: { index: false, follow: true },
    alternates: { canonical: blogUrl(`/fairhelm/${slug}/`) },
  };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = getInsight(slug);
  if (!post) notFound();
  return <RedirectStub to={blogHref(post.path)} label={post.title} />;
}
