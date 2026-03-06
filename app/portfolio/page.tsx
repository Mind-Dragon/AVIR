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
        <div className="title__content">
          <div className="title__left">
            <h1 className="page-title">{data.title}</h1>
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
                  <div className="portfolio__image-wrap">
                    <Image
                      src={item.src}
                      sizes={item.sizes || "(max-width: 479px) 92vw, (max-width: 767px) 95vw, (max-width: 991px) 90vw, 25vw"}
                      alt={item.alt || item.title}
                      width={800}
                      height={600}
                      className="portfolio__cover-image"
                    />
                    <span className="button is--with-icon">
                      <span className="button__text">See Gallery</span>
                      <span className="button__circle" aria-hidden="true" />
                      <span className="button__line" aria-hidden="true" />
                      <span className="button__arrow" aria-hidden="true">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 7.06 12.71"
                          width="15"
                          height="15"
                        >
                          <polyline
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            points="0.35 0.35 6.35 6.35 0.35 12.35"
                          />
                        </svg>
                      </span>
                    </span>
                  </div>
                  <h3 className="portfolio__title">{item.title}</h3>
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
