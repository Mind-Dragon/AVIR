"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export interface PortfolioPreviewItem {
  href: string;
  src: string;
  sizes: string;
  alt: string;
  title: string;
}

const revealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function PortfolioPreview({
  items,
}: {
  items: PortfolioPreviewItem[];
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (items.length === 0) return null;

  const Wrap = isClient ? motion.div : "div";
  const PWrap = isClient ? motion.p : "p";
  const wrapProps = isClient
    ? {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.2 },
        variants: revealVariants,
      }
    : {};

  return (
    <section className="section portfolio-preview-section">
      <div className="container">
        <Wrap className="outline-title-wrap" {...wrapProps}>
          <div className="section-heading outline">Gallery</div>
          <h2 className="section-heading">Portfolio</h2>
        </Wrap>

        <PWrap className="large-para is--keep-left" {...wrapProps}>
          Browse a small sample of some of our favorite projects.
        </PWrap>

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
