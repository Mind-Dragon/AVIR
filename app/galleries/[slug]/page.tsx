import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import FooterCTA from "@/components/layout/FooterCTA";
import { getGalleryData, getAllGallerySlugs } from "@/lib/gallery-data";

/* ------------------------------------------------------------------ */
/*  Static generation                                                  */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return getAllGallerySlugs().map((slug) => ({ slug }));
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

interface PageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const data = getGalleryData(params.slug);
  if (!data) return {};
  return {
    title: `${data.title} Gallery | AVIR`,
    description:
      data.tagline ||
      `Browse AVIR's ${data.title.toLowerCase()} gallery — luxury smart home installations.`,
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function GalleryPage({ params }: PageProps) {
  const data = getGalleryData(params.slug);
  if (!data) notFound();

  return (
    <>
      {/* Title section — split layout matching Webflow "section title" */}
      <section className="section-title">
        <div className="title__bg" />
        <div className="title__content">
          <div className="title__left">
            <h1 className="page-title">{data.title}</h1>
          </div>
          {data.tagline && (
            <div className="title__right">
              <p className="page-subtitle">{data.tagline}</p>
            </div>
          )}
        </div>
      </section>

      {/* Gallery grid */}
      <section className="section gallery-section">
        <div className="gallery__container">
          <GalleryGrid images={data.images} />

          {/* Back to galleries link */}
          <div className="gallery__back-wrap">
            <Link href="/portfolio" className="button is--outline is--dark">
              <span className="button__icon-left" aria-hidden="true">
                &larr;
              </span>
              Back to Galleries
            </Link>
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
