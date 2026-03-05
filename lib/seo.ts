/**
 * Shared SEO utilities — base URL, default OG image, JSON-LD helpers.
 * Used across all page metadata and structured data.
 */

import fs from "node:fs";
import path from "node:path";

/** Canonical base — falls back to production URL */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.avir.com";

/** AVIR logo — local asset path (SVG) */
export const AVIR_LOGO_PATH = "/images/avir-logo.svg";

/** AVIR logo — absolute URL for JSON-LD / external consumers */
export const AVIR_LOGO_SVG = `${SITE_URL}${AVIR_LOGO_PATH}`;

/** Default OG image — local asset path (raster) */
export const DEFAULT_OG_IMAGE_PATH =
  "/assets/cdn.prod.website-files.com/61aeaa63fc373a25c198ab33/622dcbe20434a82a5cb8e04b_BH15%20Optimized-p-1600.jpeg";

/** Original CDN URL for the default OG image (used as fallback when local asset is unavailable, e.g. on Vercel) */
export const DEFAULT_OG_IMAGE_CDN =
  "https://cdn.prod.website-files.com/61aeaa63fc373a25c198ab33/622dcbe20434a82a5cb8e04b_BH15%20Optimized-p-1600.jpeg";

/**
 * Resolve the default OG image URL.
 * Returns the local public path when the downloaded asset exists on disk,
 * otherwise falls back to the original CDN URL.
 * This ensures images render correctly on Vercel where prebuild-assets
 * skips downloading the 571 MB asset bundle.
 */
export function resolveDefaultOgImage(): string {
  const decodedPath = decodeURIComponent(DEFAULT_OG_IMAGE_PATH);
  const absPath = path.join(process.cwd(), "public", decodedPath);
  if (fs.existsSync(absPath)) {
    return DEFAULT_OG_IMAGE_PATH;
  }
  return DEFAULT_OG_IMAGE_CDN;
}

/**
 * Resolve the absolute default OG image URL (for metadata / JSON-LD).
 * Uses the local path on the site URL when assets exist on disk,
 * otherwise returns the CDN URL directly.
 */
export function resolveDefaultOgImageAbsolute(): string {
  const decodedPath = decodeURIComponent(DEFAULT_OG_IMAGE_PATH);
  const absPath = path.join(process.cwd(), "public", decodedPath);
  if (fs.existsSync(absPath)) {
    return `${SITE_URL}${DEFAULT_OG_IMAGE_PATH}`;
  }
  return DEFAULT_OG_IMAGE_CDN;
}

/** Default OG image — absolute URL for JSON-LD / external consumers
 * @deprecated Use resolveDefaultOgImageAbsolute() for runtime resolution */
export const DEFAULT_OG_IMAGE = `${SITE_URL}${DEFAULT_OG_IMAGE_PATH}`;

/** Build an absolute canonical URL from a relative path */
export function canonicalUrl(path: string): string {
  // Ensure leading slash, strip trailing slash
  let clean = path.startsWith("/") ? path : `/${path}`;
  if (clean !== "/") clean = clean.replace(/\/+$/, "");
  return `${SITE_URL}${clean === "/" ? "" : clean}`;
}

/* ------------------------------------------------------------------ */
/*  Shared JSON-LD fragments                                           */
/* ------------------------------------------------------------------ */

export const AVIR_ORGANIZATION = {
  "@type": "Organization" as const,
  name: "AVIR",
  url: "https://www.avir.com",
  logo: AVIR_LOGO_SVG,
  telephone: "+17607790881",
  address: {
    "@type": "PostalAddress" as const,
    streetAddress: "41905 Boardwalk, Suite X",
    addressLocality: "Palm Desert",
    addressRegion: "CA",
    postalCode: "92211",
    addressCountry: "US",
  },
  sameAs: [] as string[],
};

export const AVIR_LOCAL_BUSINESS = {
  "@context": "https://schema.org" as const,
  "@type": "LocalBusiness" as const,
  name: "AVIR",
  description:
    "Luxury smart home solutions — audio, video, automation, lighting, shading, and home cinema.",
  url: "https://www.avir.com",
  telephone: "+17607790881",
  image: AVIR_LOGO_SVG,
  address: AVIR_ORGANIZATION.address,
  areaServed: {
    "@type": "Place" as const,
    name: "Coachella Valley, California",
  },
};
