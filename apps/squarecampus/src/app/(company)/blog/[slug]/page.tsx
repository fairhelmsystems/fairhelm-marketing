import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts, blogPostBySlug } from "@fairhelm/squarecampus-content/blog/posts";
import { blogHref, blogUrl } from "@fairhelm/config/urls";
import { RedirectStub } from "@/components/site/redirect-stub";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: "Article has moved",
    robots: { index: false, follow: true },
    alternates: { canonical: blogUrl(`/${slug}`) },
  };
}
export default async function BlogRedirect({ params }: Props) {
  const { slug } = await params;
  const post = blogPostBySlug(slug);
  if (!post) notFound();
  return <RedirectStub to={blogHref(`/${slug}`)} label={post.title} />;
}
