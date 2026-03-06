import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import FooterCTA from "@/components/layout/FooterCTA";
import { getPortfolioData } from "@/lib/gallery-data";
import { canonicalUrl } from "@/lib/seo";

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "Portfolio | AVIR",
  description:
    "Browse a small sample of some of our favorite projects.",
  alternates: { canonical: canonicalUrl("/portfolio") },
  openGraph: {
    title: "Portfolio | AVIR",
    description:
      "Browse a small sample of some of our favorite projects.",
    url: canonicalUrl("/portfolio"),
  },
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PortfolioPage() {
  const data = getPortfolioData();

  return (
    <>
      {/* Title section */}
      <section className="section-title">
        <div className="title__bg" />
        <div className="page-container">
          <div className="col-wrapper">
            <div className="col-50">
              <h1 className="page-title is--nowrap">{data.title}</h1>
            </div>
            <div className="col-50 title-right is--centered">
              <p>Browse a small sample of some of our favorite projects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio gallery cards */}
      <section className="section portfolio-section">
        <div className="portfolio__container">
          <div className="portfolio__list">
            {data.items.map((item) => (
              <div key={item.href} className="portfolio__item">
                <Link href={item.href} className="portfolio__inner">
                  <Image
                    src={item.src}
                    sizes={item.sizes || "(max-width: 479px) 92vw, (max-width: 767px) 95vw, (max-width: 991px) 90vw, 25vw"}
                    alt={item.alt || item.title}
                    width={800}
                    height={600}
                    className="portfolio__cover-image"
                  />
                  <h3 className="portfolio__title">{item.title}</h3>
                  <span className="button is--with-icon">
                    See Gallery
                    <span className="button__icon" aria-hidden="true">
                      &rarr;
                    </span>
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="section footer-cta-section">
        <div className="container">
          <FooterCTA variant="standard" />
        </div>
      </section>
    </>
  );
}
