import { PRESS_ORIGIN } from "@fairhelm/config/urls";
import { PublicationFrame } from "@fairhelm/ui/components/publication-frame";
import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Sora } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import "./globals.css";

const bodyFont = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

// Every `font-display` element renders at the default 400 (no weight class
// anywhere sets Sora heavier), so only 400 is loaded — 500/600 were two
// unused font files on every page.
const displayFont = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/brand/fairhelm-logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  metadataBase: new URL(PRESS_ORIGIN),
  title: { default: "Fairhelm Press", template: "%s | Fairhelm Press" },
  description: "Official company and product facts, brand assets and media contacts.",
  alternates: { canonical: `${PRESS_ORIGIN}/` },
  robots: { index: true, follow: true },
};
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${bodyFont.variable} ${monoFont.variable} ${displayFont.variable} dark scroll-smooth`}
      data-theme="dark"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="antialiased">
        <PublicationFrame
          brand="Fairhelm Press"
          brandMarkSrc="/brand/fairhelm-logo.svg"
          items={[
            { label: "Company newsroom", href: "/" },
            { label: "SquareCampus press", href: "/squarecampus/" },
          ]}
          footer={<Footer />}
        >
          {children}
        </PublicationFrame>
      </body>
    </html>
  );
}
