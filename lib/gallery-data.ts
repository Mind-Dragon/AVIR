/**
 * Gallery data utilities — HEI-252
 *
 * Reads extracted gallery data from data/gallery-data.json and maps
 * CDN image URLs to local asset paths under /assets/.
 */

import galleryDataJson from "@/data/gallery-data.json";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface GalleryImage {
  /** Local path for <img src> (thumbnail / grid) */
  src: string;
  /** sizes attribute for responsive images */
  sizes: string;
  /** Alt text */
  alt: string;
  /** Full-resolution image for lightbox */
  lightboxSrc: string;
  /** Whether to lazy-load */
  loading: "lazy" | "eager";
}

export interface GalleryPageData {
  slug: string;
  title: string;
  tagline: string;
  images: GalleryImage[];
}

export interface PortfolioItem {
  href: string;
  src: string;
  sizes: string;
  alt: string;
  title: string;
}

export interface PortfolioPageData {
  title: string;
  items: PortfolioItem[];
}

/* ------------------------------------------------------------------ */
/*  URL → local path conversion                                        */
/* ------------------------------------------------------------------ */

/**
 * Convert a CDN URL to a local /assets/ path.
 * On Vercel the assets are not downloaded (prebuild skips), so return
 * the original CDN URL which next/image can serve via remotePatterns.
 */
function cdnToLocal(url: string): string {
  if (!url || !url.startsWith("http")) return url;
  if (process.env.VERCEL) return url;
  try {
    const parsed = new URL(url);
    const decodedPath = decodeURIComponent(parsed.pathname);
    return `/assets/${parsed.hostname}${decodedPath}`;
  } catch {
    return url;
  }
}

/* ------------------------------------------------------------------ */
/*  Data access                                                        */
/* ------------------------------------------------------------------ */

const GALLERY_SLUGS = ["commercial", "home-cinema", "lifestyle"] as const;
export type GallerySlug = (typeof GALLERY_SLUGS)[number];

/** Get data for a single gallery category page */
export function getGalleryData(slug: string): GalleryPageData | null {
  const raw = galleryDataJson[slug as keyof typeof galleryDataJson];
  if (!raw || !("images" in raw)) return null;

  const rawGallery = raw as {
    title: string;
    tagline: string;
    images: Array<{
      src: string;
      srcset: string;
      sizes: string;
      alt: string;
      lightboxUrl: string;
      loading: string;
    }>;
  };

  return {
    slug,
    title: rawGallery.title,
    tagline: rawGallery.tagline || "",
    images: rawGallery.images.map((img) => ({
      src: cdnToLocal(img.src),
      sizes: img.sizes || "",
      alt: img.alt || "",
      lightboxSrc: cdnToLocal(img.lightboxUrl || img.src),
      loading: (img.loading as "lazy" | "eager") || "lazy",
    })),
  };
}

/** Get data for the portfolio index page */
export function getPortfolioData(): PortfolioPageData {
  const raw = galleryDataJson.portfolio;
  return {
    title: raw.title,
    items: raw.items.map((item) => ({
      href: item.href,
      src: cdnToLocal(item.src),
      sizes: item.sizes || "",
      alt: item.alt || "",
      title: item.title,
    })),
  };
}

/** All valid gallery slugs for generateStaticParams */
export function getAllGallerySlugs(): string[] {
  return [...GALLERY_SLUGS];
}
