import { LEGAL_ORIGIN } from "@fairhelm/config/urls";
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

  metadataBase: new URL(LEGAL_ORIGIN),
  title: { default: "Fairhelm Legal", template: "%s | Fairhelm Legal" },
  description: "Policies, terms and disclosures from Fairhelm Systems and SquareCampus.",
  alternates: { canonical: `${LEGAL_ORIGIN}/` },
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
          brand="Fairhelm Legal"
          brandMarkSrc="/brand/fairhelm-logo.svg"
          items={[
            { label: "All documents", href: "/" },
            { label: "Fairhelm Systems", href: "/fairhelm/" },
            { label: "SquareCampus", href: "/squarecampus/" },
          ]}
          footer={<Footer />}
        >
          {children}
        </PublicationFrame>
      </body>
    </html>
  );
}
