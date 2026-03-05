/**
 * Shared SEO utilities — base URL, default OG image, JSON-LD helpers.
 * Used across all page metadata and structured data.
 */

/** Canonical base — falls back to production URL */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.avir.com";

/** AVIR logo (SVG — used in JSON-LD where SVG is acceptable) */
export const AVIR_LOGO_SVG =
  "https://cdn.prod.website-files.com/61aeaa63fc373a25c198ab33/6375d62b597feaaa92009bc5_AVIR%20logo%20website%20Final.svg";

/** Default OG image (raster — required by Facebook, Twitter/X, LinkedIn) */
export const DEFAULT_OG_IMAGE =
  "https://cdn.prod.website-files.com/61aeaa63fc373a25c198ab33/622dcbe20434a82a5cb8e04b_BH15%20Optimized-p-1600.jpeg";

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
