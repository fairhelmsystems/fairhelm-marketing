import type { Metadata } from "next";
import { blogHref, blogUrl } from "@fairhelm/config/urls";
import { RedirectStub } from "@/components/site/redirect-stub";
export const metadata: Metadata = {
  title: "Blog has moved",
  robots: { index: false, follow: true },
  alternates: { canonical: blogUrl("/") },
};
export default function BlogRedirect() {
  return <RedirectStub to={blogHref("/")} label="SquareCampus Blog" />;
}
