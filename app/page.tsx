import HeroSection from "@/components/home/HeroSection";
import ServicesShowcase from "@/components/home/ServicesShowcase";
import ProcessSection from "@/components/home/ProcessSection";
import PartnersSection from "@/components/home/PartnersSection";
import FooterCTA from "@/components/layout/FooterCTA";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesShowcase />
      <ProcessSection />
      <PartnersSection />
      <FooterCTA />
    </>
  );
}
