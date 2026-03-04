"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

interface LightboxProps {
  images: Array<{
    src: string;
    alt: string;
  }>;
  initialIndex: number;
  onClose: () => void;
}

/**
 * Fullscreen lightbox/modal viewer for gallery images — HEI-252
 *
 * Matches the Webflow w-lightbox behavior:
 * - Click image → open fullscreen overlay
 * - Left/right arrows or swipe to navigate
 * - Click backdrop or × to close
 * - Escape key to close
 */
export default function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const image = images[currentIndex];
  const closeRef = useRef<HTMLButtonElement>(null);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          goNext();
          break;
        case "ArrowLeft":
          goPrev();
          break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goNext, goPrev]);

  // Prevent body scroll when lightbox is open; focus close button on mount
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        ref={closeRef}
        className="lightbox__close"
        onClick={onClose}
        aria-label="Close lightbox"
        type="button"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Previous button */}
      {images.length > 1 && (
        <button
          className="lightbox__nav lightbox__nav--prev"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          aria-label="Previous image"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div
        className="lightbox__image-wrap"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image.src}
          alt={image.alt || `Gallery image ${currentIndex + 1}`}
          fill
          sizes="100vw"
          className="lightbox__image"
          priority
        />
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          className="lightbox__nav lightbox__nav--next"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          aria-label="Next image"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <div className="lightbox__counter">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
