import type { Metadata } from "next";
import { getAboutData } from "@/lib/page-data";
import FooterCTA from "@/components/layout/FooterCTA";
import TeamGrid from "@/components/about/TeamGrid";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About AVIR",
  description:
    "Serving the West Coast, Based in Coachella Valley, AVIR provides elite smart environment solutions for high-end residential and commercial projects.",
  alternates: { canonical: canonicalUrl("/about-avir") },
  openGraph: {
    title: "About AVIR",
    description:
      "Serving the West Coast, Based in Coachella Valley, AVIR provides elite smart environment solutions for high-end residential and commercial projects.",
    url: canonicalUrl("/about-avir"),
  },
};

export default function AboutPage() {
  const data = getAboutData();

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

      {/* Our Story */}
      <section className="section-content" data-wf-class="section">
        <div className="page-container">
          <h2 className="section__heading">Our Story</h2>
          <div className="about-story__content">
            {data.storyParagraphs.map((para, i) => (
              <p key={i} className="about-story__para">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Our Ethos */}
      <section className="section-content section-ethos" data-wf-class="section">
        <div className="page-container">
          <h2 className="section__heading">Our Ethos</h2>
          <p className="ethos__text">{data.ethosText}</p>
        </div>
      </section>

      {/* Meet the Team */}
      <section
        className="section-content section-meet-the-team"
        data-wf-class="section meet-the-team"
      >
        <div className="page-container">
          <h2 className="section__heading">Meet the team</h2>
          <TeamGrid members={data.teamMembers} />
        </div>
      </section>

      {/* Our Processes */}
      {data.processSections.length > 0 && (
        <section
          className="section-content section-process"
          data-wf-class="section process"
        >
          <div className="page-container">
            <div
              className="section-heading-outline"
              data-wf-class="section-heading outline"
            >
              Processes
            </div>
            <h2 className="section__heading">Our Processes</h2>

            {data.processSections.map((section) => (
              <div key={section.name} className="process__item">
                <h3 className="process__item-title">{section.name}</h3>
                <p className="process__item-text">{section.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Working with Partners */}
      {data.partnerTypes.length > 0 && (
        <section
          className="section-content section-partners"
          data-wf-class="section partners"
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
      )}

      {/* Footer CTA */}
      <FooterCTA />
    </>
  );
}
