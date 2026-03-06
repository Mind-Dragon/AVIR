import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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

      {/* Full-width Hero Image */}
      {data.storyImage && (
        <section className="about-hero" data-wf-class="section extra--padding">
          <Image
            src={data.storyImage.src}
            alt={data.storyImage.alt}
            width={3800}
            height={2000}
            priority
            className="about-hero__image"
          />

          {/* Overlay: CTA + Spinning Logo */}
          <div className="about-hero__overlay">
            <div className="about-hero__overlay-inner">
              <Link href="/services" className="button is--with-icon about-hero__cta">
                <span className="button__text cta">View our Services</span>
                <span className="button__circle" />
                <span className="button__line" />
                <span className="button__arrow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 7.06 12.71"
                    width="15"
                    height="15"
                  >
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      strokeMiterlimit={10}
                      points="0.35 0.35 6.35 6.35 0.35 12.35"
                    />
                  </svg>
                </span>
              </Link>

              {/* Spinning AVIR logo */}
              <div className="about-hero__spinning-logo" aria-hidden="true">
                <Image
                  src="/images/avir-logo.svg"
                  alt=""
                  width={80}
                  height={80}
                  className="about-hero__spinning-logo-img"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Our Story + Our Ethos — two-column layout */}
      <section className="section-content" data-wf-class="section">
        <div className="page-container">
          <div className="col-wrapper">
            <div className="col-50">
              <h2 className="section__heading">Our Story</h2>
              <div className="about-story__content">
                {data.storyParagraphs.map((para, i) => (
                  <p key={i} className="about-story__para">
                    {para}
                  </p>
                ))}
              </div>
            </div>
            <div className="col-50">
              <h2 className="section__heading">Our Ethos</h2>
              <div className="ethos__wrap">
                <p className="ethos__text">{data.ethosText}</p>
              </div>
            </div>
          </div>
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

            {data.processSections.map((section, idx) => (
              <div
                key={section.name}
                className={`col-wrapper process ${idx % 2 === 0 ? "is--reverse" : ""}`}
              >
                {section.image && (
                  <div className="col-40">
                    <Image
                      src={section.image.src}
                      alt={section.image.alt}
                      width={800}
                      height={600}
                      className="process__image"
                    />
                  </div>
                )}
                <div className="col-60 is--vertical-middle">
                  <h3 className="process__item-title">{section.name}</h3>
                  <p className="process__item-text">{section.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Working with Partners */}
      {data.partnerSections.length > 0 && (
        <section
          className="section-content section-partners"
          data-wf-class="section partners"
        >
          <div className="page-container">
            <h2 className="section__heading">Working with Partners</h2>
            <div className="partners__grid partners__grid--stacked">
              {data.partnerSections.map((partner, idx) => (
                <div
                  key={partner.name}
                  className={`col-wrapper partners ${idx % 2 === 0 ? "is--reverse" : ""}`}
                >
                  {partner.image && (
                    <div className="col-40">
                      <Image
                        src={partner.image.src}
                        alt={partner.image.alt}
                        width={800}
                        height={600}
                        className="partner__image"
                      />
                    </div>
                  )}
                  <div className="col-60 is--vertical-middle">
                    <h3 className="partner-type__title">{partner.name}</h3>
                    <p className="partner-type__text">{partner.description}</p>
                  </div>
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
