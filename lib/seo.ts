/**
 * Shared SEO utilities — base URL, default OG image, JSON-LD helpers.
 * Used across all page metadata and structured data.
 */

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

/** Default OG image — absolute URL for JSON-LD / external consumers */
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
