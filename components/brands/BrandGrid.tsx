import Image from "next/image";

interface BrandItem {
  logoImg: string;
  link: string;
}

interface BrandGridProps {
  brands: BrandItem[];
}

function isSvg(src: string): boolean {
  try {
    const pathname = new URL(src, "https://placeholder.invalid").pathname;
    return pathname.toLowerCase().endsWith(".svg");
  } catch {
    return src.toLowerCase().endsWith(".svg");
  }
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
          <div className="partner__logo">
            {brand.logoImg &&
              (isSvg(brand.logoImg) ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={brand.logoImg}
                  alt=""
                  width={200}
                  height={60}
                  className="partner__logo-img"
                  data-wf-class="partner__logo-img"
                  loading="lazy"
                />
              ) : (
                <Image
                  src={brand.logoImg}
                  alt=""
                  width={200}
                  height={60}
                  className="partner__logo-img"
                  data-wf-class="partner__logo-img"
                />
              ))}
          </div>
          {brand.link && (
            <a
              href={brand.link}
              target="_blank"
              rel="noopener noreferrer"
              className="partner__link"
              data-wf-class="partner__link w-inline-block"
            >
              Visit Site
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
