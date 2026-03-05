import Image from "next/image";

interface ProductItem {
  title: string;
  description: string;
  logoImg: string;
  productImg: string;
}

interface ProductGridProps {
  products: ProductItem[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="exciting__grid" data-wf-class="exciting__grid">
      {products.map((product, index) => (
        <div
          key={index}
          className="exciting__item"
          data-wf-class="exciting__item"
        >
          {/* Product background image */}
          {product.productImg && (
            <Image
              src={product.productImg}
              alt={product.title}
              width={600}
              height={400}
              className="exciting__product-img"
              data-wf-class="exciting__product-img"
            />
          )}

          {/* Logo overlay */}
          <div className="exciting__logo" data-wf-class="exciting__logo">
            {product.logoImg && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={product.logoImg}
                alt={`${product.title} logo`}
                width={120}
                height={50}
                className="exciting__logo-img"
                data-wf-class="exciting__logo-img"
                loading="lazy"
              />
            )}
          </div>

          {/* Info overlay on hover */}
          <div
            className="exciting__info-wrap"
            data-wf-class="exciting__info-wrap"
          >
            <h3 className="exciting__title" data-wf-class="exciting__title">
              {product.title}
            </h3>
            <p className="exciting__para" data-wf-class="exciting__para">
              {product.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
