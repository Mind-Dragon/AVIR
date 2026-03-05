import type { Metadata } from "next";
import { getProcessesData } from "@/lib/page-data";
import FooterCTA from "@/components/layout/FooterCTA";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Processes | AVIR",
  description: "Working with us is as easy as it gets.",
  alternates: { canonical: canonicalUrl("/processes") },
  openGraph: {
    title: "Processes | AVIR",
    description: "Working with us is as easy as it gets.",
    url: canonicalUrl("/processes"),
  },
};

export default function ProcessesPage() {
  const data = getProcessesData();

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

      {/* Process Sections */}
      {data.processSections.map((section) => (
        <section
          key={section.name}
          className="section-content section-process-detail"
          data-wf-class="section is--hidden"
        >
          <div className="page-container">
            <h3 className="process__item-title">{section.name}</h3>
            <p className="process__item-text">{section.description}</p>
          </div>
        </section>
      ))}

      {/* Working with Partners */}
      <section
        className="section-content section-partners"
        data-wf-class="section"
      >
        <div className="page-container">
          <h2 className="section__heading">Working with Partners</h2>
          <div className="partners__grid">
            {data.partnerTypes.map((partner) => (
              <div key={partner.name} className="partner-type__item">
                <h3 className="partner-type__title">{partner.name}</h3>
                <p className="partner-type__text">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <FooterCTA />
    </>
  );
}
