import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "AVIR | Luxury Smart Home Solutions",
  description:
    "AVIR provides elite audiovisual, automation, lighting, shading, and home cinema solutions for high-end residential and commercial projects in the Coachella Valley and beyond.",
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
        {/* Spacer for fixed nav: 97px desktop, 60px mobile */}
        <div className="pt-[97px] max-md:pt-[60px]" />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
