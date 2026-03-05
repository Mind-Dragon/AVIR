import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import ServicesShowcase from "@/components/home/ServicesShowcase";
import ProcessSection from "@/components/home/ProcessSection";
import PartnersSection from "@/components/home/PartnersSection";
import FooterCTA from "@/components/layout/FooterCTA";
import { canonicalUrl, AVIR_LOCAL_BUSINESS, AVIR_ORGANIZATION } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AVIR | Luxury Smart Home Solutions",
  description: "Luxury smart home solutions, designed for the discerning.",
  alternates: { canonical: canonicalUrl("/") },
  openGraph: {
    title: "AVIR | Luxury Smart Home Solutions",
    description: "Luxury smart home solutions, designed for the discerning.",
    url: canonicalUrl("/"),
  },
};

export default function Home() {
  const jsonLd = [
    { ...AVIR_LOCAL_BUSINESS },
    { "@context": "https://schema.org", ...AVIR_ORGANIZATION },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <ServicesShowcase />
      <ProcessSection />
      <PartnersSection />
      <FooterCTA />
    </>
  );
}
