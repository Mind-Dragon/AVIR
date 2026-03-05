import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import ServicesShowcase from "@/components/home/ServicesShowcase";
import ProcessSection from "@/components/home/ProcessSection";
import PartnersSection from "@/components/home/PartnersSection";
import FooterCTA from "@/components/layout/FooterCTA";
import { canonicalUrl, AVIR_LOCAL_BUSINESS, AVIR_ORGANIZATION } from "@/lib/seo";
import { getBrandsData } from "@/lib/page-data";

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

  // Load brand logos for the partners section
  const { brands } = getBrandsData();
  const partnerLogos = brands
    .filter((b) => b.logoImg)
    .map((b) => ({ logoImg: b.logoImg, link: b.link }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <ServicesShowcase />
      <ProcessSection />
      <PartnersSection logos={partnerLogos} />
      <FooterCTA />
    </>
  );
}
