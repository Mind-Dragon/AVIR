import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FooterCTA from "@/components/layout/FooterCTA";
import CareerApplicationForm from "@/components/careers/CareerApplicationForm";
import {
  getAllCareerSlugs,
  getCareerDetailData,
  isValidCareerSlug,
} from "@/lib/careers-data";
import { canonicalUrl } from "@/lib/seo";

interface CareerDetailPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllCareerSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: CareerDetailPageProps): Metadata {
  if (!isValidCareerSlug(params.slug)) {
    return { title: "Not Found" };
  }
  const data = getCareerDetailData(params.slug);
  const description = data.metaDescription || `${data.title} - AVIR Careers`;
  return {
    title: `${data.title} — AVIR Careers`,
    description,
    alternates: { canonical: canonicalUrl(`/careers/${params.slug}`) },
    openGraph: {
      title: `${data.title} — AVIR Careers`,
      description,
      url: canonicalUrl(`/careers/${params.slug}`),
    },
  };
}

export default function CareerDetailPage({ params }: CareerDetailPageProps) {
  if (!isValidCareerSlug(params.slug)) {
    notFound();
  }

  const data = getCareerDetailData(params.slug);

  return (
    <>
      {/* Title Section */}
      <div className="section-title" data-wf-class="section title">
        <div className="container">
          <h1>{data.title}</h1>
        </div>
      </div>

      {/* Job Description Section */}
      <div className="section" data-wf-class="section">
        <div className="container">
          <div className="w-richtext" data-wf-class="w-richtext">
            <p>{data.jobDescription}</p>
          </div>
        </div>
      </div>

      {/* Apply Section + Modal (client component) */}
      <CareerApplicationForm positionTitle={data.title} />

      {/* Footer CTA */}
      <FooterCTA />
    </>
  );
}
