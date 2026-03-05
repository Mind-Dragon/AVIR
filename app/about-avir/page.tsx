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
      <section
        className="section-content section-process"
        data-wf-class="section process"
      >
        <div className="page-container">
          <div className="section-heading-outline" data-wf-class="section-heading outline">
            Processes
          </div>
          <h2 className="section__heading">Our Processes</h2>

          <div className="process__item">
            <h3 className="process__item-title">For Residences</h3>
            <p className="process__item-text">
              Our process is simple and designed for maximum creativity. Our
              design specialists walk through every square foot of the house,
              getting ideas and distilling your vision into something actionable.
              After the consultation, our engineering team provides a draft that
              details the plan moving forward, along with a near-exact price
              estimation. Once the environments and technology are seamlessly
              integrated into the home, we provide training for homeowners and
              staff. Finally, you become a partner with AVIR, giving you access
              to things like our Welcome + Turndown service and our Hibernation
              service. Additionally, you receive on-demand product maintenance
              and call-out services.
            </p>
            <p className="process__callout">
              Our process is simple and designed for maximum creativity.
            </p>
            <p className="process__callout">
              AVIR provides the simplest interfaces and the best products
            </p>
          </div>

          <div className="process__item">
            <h3 className="process__item-title">For Commercial Projects</h3>
            <p className="process__item-text">
              AVIR provides the simplest interfaces and the best products. We
              offer consultation and drafting with near-exact price estimates for
              our commercial projects and builders. This provides project clarity
              and allows for accurate budget projections on the client-facing
              side. Our installation is fast and easily integrated with new
              builds, ensuring project deadlines are met in a timely manner.
              Additionally, we provide interface training for all direct users,
              perfect for hospitals and places of worship that utilize a
              volunteer force. Finally, we provide long-term service for every
              AVIR installation, including call-outs and routine maintenance
              needs.
            </p>
          </div>
        </div>
      </section>

      {/* Working with Partners */}
      <section
        className="section-content section-partners"
        data-wf-class="section partners"
      >
        <div className="page-container">
          <h2 className="section__heading">Working with Partners</h2>
          <div className="partners__grid">
            <div className="partner-type__item">
              <h3 className="partner-type__title">Interior Designers</h3>
              <p className="partner-type__text">
                Interior designers work with AVIR when they want the best
                technology, seamlessly employed. Elegant tech solutions exist and
                AVIR ensures beauty and utility in all of our work. We provide
                lighting, shades, custom theater seating and AV furniture, custom
                finishes for all hardware, plus slimline and minimalistic
                options.
              </p>
            </div>
            <div className="partner-type__item">
              <h3 className="partner-type__title">Architects</h3>
              <p className="partner-type__text">
                Detailed and accurate - the architect&apos;s dream. AVIR&apos;s
                team of engineers ensures compatibility, forward-thinking, and
                detailed drawings for even the most meticulous architect. We
                regularly design around specifications that achieve
                mathematically correct acoustics and matching aesthetics for
                every room.
              </p>
            </div>
            <div className="partner-type__item">
              <h3 className="partner-type__title">Builders</h3>
              <p className="partner-type__text">
                AVIR doesn&apos;t just create smart environments, we add untold
                value to luxury homes and commercial properties. World-class
                builders don&apos;t choose us because of our tech, they choose us
                because of our team and our commitment to excellence. From
                turnkey luxury estates to upgradeable demo systems, world-class
                builders choose us because of our team and demonstrated history
                of excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <FooterCTA />
    </>
  );
}
