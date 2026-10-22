import { SkipLink } from "@fairhelm/ui/components/skip-link";
import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Sora } from "next/font/google";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { JsonLd } from "@/components/site/json-ld";
import { ThemeScript } from "@fairhelm/ui/components/theme-script";
import { ThemeToggle } from "@fairhelm/ui/components/theme-toggle";
import { ogImage } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { siteGraph } from "@/lib/structured-data";
import "./globals.css";

// The family type system, shared with squarecampus.com: Sora for headings,
// IBM Plex Sans for body copy, IBM Plex Mono for eyebrows and labels.
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const defaultTitle = `${siteConfig.name} | ${siteConfig.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  category: "technology",
  referrer: "origin-when-cross-origin",
  alternates: { canonical: siteConfig.url },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/brand/fairhelm-logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: defaultTitle,
    description: siteConfig.description,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: siteConfig.description,
    images: [ogImage.url],
  },
  robots: { index: true, follow: true },
  other: {
    "ai-content-declaration": absoluteUrl("/ai/"),
    "geo.region": "IN-KA",
    "geo.placename": siteConfig.address.locality,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${sora.variable} ${plexSans.variable} ${plexMono.variable} dark scroll-smooth`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <noscript>
          <style>
            {
              ".reveal-root,.reveal-stagger [data-reveal-item],.viz-reveal{opacity:1!important;transform:none!important}"
            }
          </style>
        </noscript>
        {/*
          Pointer to the machine-readable company summary. `rel="describedby"`
          is the relation the llms.txt convention uses: /llms.txt describes
          this site without claiming to be an alternate representation of the
          page — `rel="alternate"` is reserved for the per-page Markdown,
          emitted through `alternates.types` in metadata.
        */}
        <link rel="describedby" href="/llms.txt" />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <div className="page-shell">
          {/*
            One entity graph on every page: the company (#org), this site
            (#website) and the SquareCampus product entity as published on
            squarecampus.com, with the relationship stated explicitly.
          */}
          <JsonLd data={siteGraph} />
          <SkipLink />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main tabIndex={-1} id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <ThemeToggle />
        </div>
      </body>
    </html>
  );
}
