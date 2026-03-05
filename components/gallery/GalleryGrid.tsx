"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "./Lightbox";
import type { GalleryImage } from "@/lib/gallery-data";

interface GalleryGridProps {
  images: GalleryImage[];
}

/**
 * Masonry-style gallery grid — HEI-252
 *
 * Replicates the Webflow gallery layout:
 * - Items display in a flex-wrap grid
 * - Every 3rd item spans full width (`.gallery__item:nth-child(3n)`)
 * - Clicking an image opens the lightbox
 */
export default function GalleryGrid({ images }: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const lightboxImages = images.map((img) => ({
    src: img.lightboxSrc,
    alt: img.alt,
  }));

  return (
    <>
      <div className="gallery__list" role="list">
        {images.map((image, index) => (
          <div key={index} className="gallery__item" role="listitem">
            <button
              type="button"
              className="gallery__link"
              onClick={() => setLightboxIndex(index)}
              aria-label={image.alt || `View gallery image ${index + 1}`}
            >
              <Image
                src={image.src}
                sizes={image.sizes || "(max-width: 479px) 86vw, (max-width: 767px) 92vw, (max-width: 991px) 87vw, 69vw"}
                alt={image.alt || `Gallery image ${index + 1}`}
                width={800}
                height={600}
                loading={index < 6 ? "eager" : "lazy"}
                className="gallery__image"
              />
            </button>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
