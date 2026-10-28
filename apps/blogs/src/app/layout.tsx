import { SkipLink } from "@fairhelm/ui/components/skip-link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fairhelm/ui/fonts.css";
import { BLOGS_ORIGIN, SQUARECAMPUS_ORIGIN, FAIRHELM_ORIGIN } from "@fairhelm/config/urls";
import { ThemeScript } from "@fairhelm/ui/components/theme-script";
import { ThemeToggle } from "@fairhelm/ui/components/theme-toggle";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/brand/fairhelm-logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  metadataBase: new URL(BLOGS_ORIGIN),
  title: { default: "Fairhelm Journal", template: "%s | Fairhelm Journal" },
  description:
    "Practical guides to school operations, data engineering, decision systems and governance from Fairhelm Systems and SquareCampus.",
  alternates: {
    canonical: `${BLOGS_ORIGIN}/`,
    types: {
      "application/rss+xml": [{ url: `${BLOGS_ORIGIN}/feed.xml`, title: "Fairhelm Journal" }],
    },
  },
  openGraph: {
    type: "website",
    siteName: "Fairhelm Journal",
    locale: "en_IN",
    url: `${BLOGS_ORIGIN}/`,
    images: [{ url: "/brand/fairhelm-og.png", width: 1200, height: 630, alt: "Fairhelm Journal" }],
  },
  twitter: { card: "summary_large_image", images: ["/brand/fairhelm-og.png"] },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en-IN"
      className="dark scroll-smooth"
      data-theme="dark"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <noscript>
          <style>
            {
              ".reveal-root,.reveal-stagger [data-reveal-item]{opacity:1!important;transform:none!important}"
            }
          </style>
        </noscript>
      </head>
      <body className="antialiased">
        <SkipLink />
        <div className="page-shell">
          <Header />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Organization",
                    "@id": `${SQUARECAMPUS_ORIGIN}/#org`,
                    name: "SquareCampus",
                    url: `${SQUARECAMPUS_ORIGIN}/`,
                    logo: `${SQUARECAMPUS_ORIGIN}/brand/squarecampus.png`,
                  },
                  {
                    "@type": "Organization",
                    "@id": `${FAIRHELM_ORIGIN}/#org`,
                    name: "Fairhelm Systems",
                    url: `${FAIRHELM_ORIGIN}/`,
                  },
                  {
                    "@type": "WebSite",
                    "@id": `${BLOGS_ORIGIN}/#website`,
                    name: "Fairhelm Journal",
                    url: `${BLOGS_ORIGIN}/`,
                    publisher: { "@id": `${FAIRHELM_ORIGIN}/#org` },
                    inLanguage: "en-IN",
                  },
                ],
              }),
            }}
          />
          {children}
          <Footer />
        </div>
        <ThemeToggle />
      </body>
    </html>
  );
}
