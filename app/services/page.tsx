import type { Metadata } from "next";
import { getServicesData } from "@/lib/page-data";
import FooterCTA from "@/components/layout/FooterCTA";
import ServiceItem from "@/components/services/ServiceItem";
import VipSection from "@/components/services/VipSection";

export const metadata: Metadata = {
  title: "Services | AVIR",
  description:
    "We offer an array of specialty services custom-tailored to your needs. From individual rooms to large-scale commercial buildings, we ensure quality each step of the way.",
};

export default function ServicesPage() {
  const data = getServicesData();

  return (
    <>
      {/* Title Section */}
      <section className="section-title" data-wf-class="section title">
        <div className="title__bg" data-wf-class="title__bg" />
        <div className="page-container">
          <div className="col-wrapper">
            <div className="col-50">
              <h1 className="page-title" data-wf-class="page-title">
                {data.title}
              </h1>
            </div>
            <div className="col-50 title-right" data-wf-class="col-50 title-right">
              <p>{data.subtitle}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-nav */}
      <section
        className="section-sub-nav is--hidden"
        data-wf-class="section sub-nav is--hidden"
      >
        <div className="page-container">
          <span className="sub-nav__label">Jump to</span>
          <a href="#services" className="sub-nav__link">
            Services
          </a>
          <a href="#support" className="sub-nav__link">
            Support
          </a>
        </div>
      </section>

      {/* Service Listings */}
      <section id="services" className="section-services" data-wf-class="section services">
        <div className="page-container">
          {data.services.map((service, index) => (
            <ServiceItem
              key={service.slug}
              name={service.name}
              description={service.description}
              image={service.image}
              slug={service.slug}
              reverse={index % 2 !== 0}
            />
          ))}
        </div>
      </section>

      {/* VIP Support Section */}
      <section id="support" className="section-support" data-wf-class="section support">
        <VipSection items={data.vipItems} />
      </section>

      {/* Footer CTA */}
      <FooterCTA />
    </>
  );
}
