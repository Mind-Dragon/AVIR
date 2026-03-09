"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface PortfolioPreviewItem {
  href: string;
  src: string;
  sizes: string;
  alt: string;
  title: string;
}

export default function PortfolioPreview({
  items,
}: {
  items: PortfolioPreviewItem[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="section portfolio-preview-section">
      <div
        className={`container${visible ? " is--visible" : ""}`}
        ref={ref}
      >
        <div className="outline-title-wrap">
          <div className="section-heading outline">Gallery</div>
          <h2 className="section-heading">Portfolio</h2>
        </div>

        <p className="large-para is--keep-left">
          Browse a small sample of some of our favorite projects.
        </p>

        <div className="portfolio-preview__grid">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="portfolio-preview__card"
            >
              <div className="portfolio-preview__image-wrap">
                <Image
                  src={item.src}
                  alt={item.alt || item.title}
                  width={800}
                  height={600}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="portfolio-preview__image"
                />
              </div>
              <h3 className="portfolio-preview__title">{item.title}</h3>
            </Link>
          ))}
        </div>

        <div className="portfolio-preview__cta">
          <Link href="/portfolio" className="button is--outline is--dark">
            View Full Portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}
