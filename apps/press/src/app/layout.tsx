import { PRESS_ORIGIN } from "@fairhelm/config/urls";
import { PublicationFrame } from "@fairhelm/ui/components/publication-frame";
import type { Metadata } from "next";
import "@fairhelm/ui/fonts.css";
import type { ReactNode } from "react";
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
      className="dark scroll-smooth"
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
