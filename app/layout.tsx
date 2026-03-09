import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import NavSpacer from "@/components/layout/NavSpacer";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import { SITE_URL, resolveDefaultOgImageAbsolute } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AVIR | Luxury Smart Home Solutions",
    template: "%s",
  },
  description:
    "AVIR provides elite audiovisual, automation, lighting, shading, and home cinema solutions for high-end residential and commercial projects in the Coachella Valley and beyond.",
  openGraph: {
    type: "website",
    siteName: "AVIR",
    locale: "en_US",
    images: [{ url: resolveDefaultOgImageAbsolute(), alt: "AVIR" }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Manrope from Google Fonts — weights 300-700 matching avir.com */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Termina from Adobe Typekit — used for nav links, buttons, headings */}
        <link rel="stylesheet" href="https://use.typekit.net/dqw5qdb.css" />
      </head>
      <body className="font-manrope antialiased">
        <Nav />
        <NavSpacer />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
