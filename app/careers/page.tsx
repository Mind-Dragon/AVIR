import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FooterCTA from "@/components/layout/FooterCTA";
import { getCareersIndexData } from "@/lib/careers-data";
import { canonicalUrl } from "@/lib/seo";

const data = getCareersIndexData();

export const metadata: Metadata = {
  title: `${data.title} | AVIR`,
  description: data.metaDescription || "Work with us.",
  alternates: { canonical: canonicalUrl("/careers") },
  openGraph: {
    title: `${data.title} | AVIR`,
    description: data.metaDescription || "Work with us.",
    url: canonicalUrl("/careers"),
  },
};

export default function CareersPage() {
  return (
    <>
      {/* Hero / Title Section */}
      <div className="section-title" data-wf-class="section title">
        <div className="title__bg" aria-hidden="true" />
        <div className="container">
          <div className="col-wrapper">
            <div className="col-50">
              <h1 className="page-title">{data.title}</h1>
            </div>
            <div className="col-50 title-right">
              <p>
                Are you a team player? Do you love new technology? If so,
                we&apos;d like to meet you!
                <br />
                Submit your resume below.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description + Image Section */}
      <div className="section" data-wf-class="section">
        <div className="container">
          <div className="col-wrapper">
            <div className="col-50 is--vertical-middle is--spaced-below">
              <p>
                Whether you&apos;re just getting started in the field, moving
                from another industry, or are the best at what you do, apply and
                see if you have what it takes to join the AVIR team.
                <br />
                <span style={{ display: "inline-block", width: 0, height: 0 }}>
                  &zwj;
                </span>
                <br />
                Interested in an unlisted position at AVIR? Let us know.
              </p>
              <a href="mailto:careers@avir.com" className="careers__email-link">
                {data.emailContact}
              </a>
            </div>
            <div className="col-50">
              <Image
                src={data.imageSrc}
                alt={data.imageAlt}
                width={1080}
                height={720}
                sizes="(max-width: 479px) 92vw, (max-width: 767px) 95vw, (max-width: 991px) 44vw, 41vw"
                className="process__image"
                data-wf-class="process__image"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Open Positions Section */}
      <div className="section" data-wf-class="section">
        <div className="container">
          <h2>Open Positions</h2>
          <div
            className="careers__wrapper"
            data-wf-class="careers__wrapper w-dyn-list"
          >
            <div
              role="list"
              className="careers__list"
              data-wf-class="careers__list w-dyn-items"
            >
              {data.positions.map((position) => (
                <div
                  key={position.slug}
                  role="listitem"
                  className="careers__item"
                  data-wf-class="careers__item w-dyn-item"
                >
                  <Link
                    href={position.url}
                    className="careers__link"
                    data-wf-class="careers__link w-inline-block"
                  >
                    <h3>{position.title}</h3>
                    <p className="is--spaced-around">{position.description}</p>
                    <div
                      className="button is--outline"
                      data-wf-class="button is--outline"
                    >
                      More Information
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <FooterCTA />
    </>
  );
}
