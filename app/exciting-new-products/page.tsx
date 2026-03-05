import type { Metadata } from "next";
import { getExcitingProductsData } from "@/lib/page-data";
import FooterCTA from "@/components/layout/FooterCTA";
import ProductGrid from "@/components/exciting-products/ProductGrid";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Exciting New Products | AVIR",
  description:
    "Browse some of the most exclusive products we can bring to your next technology installation.",
  alternates: { canonical: canonicalUrl("/exciting-new-products") },
  openGraph: {
    title: "Exciting New Products | AVIR",
    description:
      "Browse some of the most exclusive products we can bring to your next technology installation.",
    url: canonicalUrl("/exciting-new-products"),
  },
};

export default function ExcitingProductsPage() {
  const data = getExcitingProductsData();

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

      {/* Products Grid */}
      <section className="section-content" data-wf-class="section">
        <div className="page-container">
          <p className="exciting__tap-hint">
            → Tap on a picture for more information
          </p>
          <ProductGrid products={data.products} />
        </div>
      </section>

      {/* Footer CTA */}
      <FooterCTA />
    </>
  );
}
