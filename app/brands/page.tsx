import type { Metadata } from "next";
import { getBrandsData } from "@/lib/page-data";
import FooterCTA from "@/components/layout/FooterCTA";
import BrandGrid from "@/components/brands/BrandGrid";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Brands | AVIR",
  description:
    "AVIR cultivates exclusive partnerships to secure only the best products for our solutions.",
  alternates: { canonical: canonicalUrl("/brands") },
  openGraph: {
    title: "Brands | AVIR",
    description:
      "AVIR cultivates exclusive partnerships to secure only the best products for our solutions.",
    url: canonicalUrl("/brands"),
  },
};

export default function BrandsPage() {
  const data = getBrandsData();

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

      {/* Brand Partners Grid */}
      <section className="section-content" data-wf-class="section">
        <div className="page-container">
          <BrandGrid brands={data.brands} />
        </div>
      </section>

      {/* Footer CTA */}
      <FooterCTA />
    </>
  );
}
