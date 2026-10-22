import type { Metadata } from "next";
import { blogHref, blogUrl } from "@fairhelm/config/urls";
import { RedirectStub } from "@/components/site/redirect-stub";
export const metadata: Metadata = {
  title: "Insights have moved",
  robots: { index: false, follow: true },
  alternates: { canonical: blogUrl("/fairhelm/") },
};
export default function Page() {
  return <RedirectStub to={blogHref("/fairhelm/")} label="Fairhelm insights" />;
}
