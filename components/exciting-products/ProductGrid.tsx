"use client";

import { useState, useCallback, useRef } from "react";
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent, index: number) => {
      if (touchStart.current) {
        const dx = e.changedTouches[0].clientX - touchStart.current.x;
        const dy = e.changedTouches[0].clientY - touchStart.current.y;
        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) return;
      }
      e.preventDefault();
      setActiveIndex((prev) => (prev === index ? null : index));
    },
    [],
  );

  return (
    <div className="exciting__grid" data-wf-class="exciting__grid">
      {products.map((product, index) => (
        <div
          key={index}
          className={`exciting__item${activeIndex === index ? " is--active" : ""}`}
          data-wf-class="exciting__item"
          onTouchStart={handleTouchStart}
          onTouchEnd={(e) => handleTouchEnd(e, index)}
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

          {/* Logo badge – bottom-left pill */}
          {product.logoImg && (
            <div className="exciting__logo" data-wf-class="exciting__logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.logoImg}
                alt={`${product.title} logo`}
                className="exciting__logo-img"
                data-wf-class="exciting__logo-img"
              />
            </div>
          )}

          {/* Info overlay on hover / tap */}
          <div
            className="exciting__info-wrap"
            data-wf-class="exciting__info-wrap"
          >
            {product.logoImg && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={product.logoImg}
                alt={`${product.title} logo`}
                className="exciting__overlay-logo"
              />
            )}
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
