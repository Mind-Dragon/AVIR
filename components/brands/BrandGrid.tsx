import Image from "next/image";

interface BrandItem {
  productImg: string;
  logoImg: string;
  link: string;
}

interface BrandGridProps {
  brands: BrandItem[];
}

export default function BrandGrid({ brands }: BrandGridProps) {
  return (
    <div className="partner__grid" data-wf-class="w-dyn-items">
      {brands.map((brand, index) => (
        <div
          key={index}
          className="partner__item"
          data-wf-class="partner__item w-dyn-item"
        >
          <div className="partner__product-image">
            {brand.productImg && (
              <Image
                src={brand.productImg}
                alt=""
                width={400}
                height={300}
                className="partner__product-img"
                data-wf-class="partner__product-img"
              />
            )}
          </div>
          <div className="partner__bottom">
            <div className="partner__logo">
              {brand.logoImg && (
                <Image
                  src={brand.logoImg}
                  alt=""
                  width={120}
                  height={40}
                  className="partner__logo-img"
                  data-wf-class="partner__logo-img"
                />
              )}
            </div>
            {brand.link && (
              <a
                href={brand.link}
                target="_blank"
                rel="noopener noreferrer"
                className="partner__link"
                data-wf-class="partner__link w-inline-block"
              >
                Visit Site<span className="partner__arrow">→</span>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
