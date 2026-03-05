/** Typed city data for all 25 AVIR city landing pages.
 *  Content extracted from data/pages/city--{slug}.json files. */

export interface CityData {
  /** URL slug, e.g. "banning" */
  slug: string;
  /** Display name, e.g. "Banning" */
  name: string;
  /** Original canonical URL */
  canonicalUrl: string;
}

/** Services offered — identical across all city pages */
export const CITY_SERVICES = [
  "Custom Home Cinema/Media Room",
  "Lighting, Incl. Artwork Features",
  "Audiophile Music Systems",
  "Security System & Monitoring",
  "Networking/Home Office",
  "Automation & Control",
  "Motorized Window Shades",
  "Multi Room Audio Streaming",
  "Surveillance Camera/CCTV",
] as const;

/** Notable client locations — shared across all city pages */
export const CLIENT_LOCATIONS = [
  "Bighorn Golf Club",
  "Desert Island Country Club",
  "Hideaway Golf Club",
  "Madison Country Club",
  "The Quarry at La Quinta",
  "The Reserve Club",
  "SilverRock Resort",
  "The Thermal Club",
  "Thunderbird Country Club",
  "Tradition Golf Club",
  "The Vintage",
] as const;

/** All 25 city entries — derived from data/site-map.json and data/pages/city--*.json */
export const CITIES: CityData[] = [
  { slug: "banning", name: "Banning", canonicalUrl: "https://www.avir.com/city/banning" },
  { slug: "beaumont", name: "Beaumont", canonicalUrl: "https://www.avir.com/city/beaumont" },
  { slug: "bermuda-dunes", name: "Bermuda Dunes", canonicalUrl: "https://www.avir.com/city/bermuda-dunes" },
  { slug: "big-bear", name: "Big Bear", canonicalUrl: "https://www.avir.com/city/big-bear" },
  { slug: "cathedral-city", name: "Cathedral City", canonicalUrl: "https://www.avir.com/city/cathedral-city" },
  { slug: "coachella", name: "Coachella", canonicalUrl: "https://www.avir.com/city/coachella" },
  { slug: "idyllwild", name: "Idyllwild", canonicalUrl: "https://www.avir.com/city/idyllwild" },
  { slug: "indian-wells", name: "Indian Wells", canonicalUrl: "https://www.avir.com/city/indian-wells" },
  { slug: "indio", name: "Indio", canonicalUrl: "https://www.avir.com/city/indio" },
  { slug: "joshua-tree", name: "Joshua Tree", canonicalUrl: "https://www.avir.com/city/joshua-tree" },
  { slug: "la-quinta", name: "La Quinta", canonicalUrl: "https://www.avir.com/city/la-quinta" },
  { slug: "lake-arrowhead", name: "Lake Arrowhead", canonicalUrl: "https://www.avir.com/city/lake-arrowhead" },
  { slug: "moreno-valley", name: "Moreno Valley", canonicalUrl: "https://www.avir.com/city/moreno-valley" },
  { slug: "murrieta", name: "Murrieta", canonicalUrl: "https://www.avir.com/city/murrieta" },
  { slug: "palm-desert", name: "Palm Desert", canonicalUrl: "https://www.avir.com/city/palm-desert" },
  { slug: "palm-springs", name: "Palm Springs", canonicalUrl: "https://www.avir.com/city/palm-springs" },
  { slug: "rancho-mirage", name: "Rancho Mirage", canonicalUrl: "https://www.avir.com/city/rancho-mirage" },
  { slug: "redlands", name: "Redlands", canonicalUrl: "https://www.avir.com/city/redlands" },
  { slug: "riverside", name: "Riverside", canonicalUrl: "https://www.avir.com/city/riverside" },
  { slug: "san-bernardino", name: "San Bernardino", canonicalUrl: "https://www.avir.com/city/san-bernardino" },
  { slug: "temecula", name: "Temecula", canonicalUrl: "https://www.avir.com/city/temecula" },
  { slug: "thermal", name: "Thermal", canonicalUrl: "https://www.avir.com/city/thermal" },
  { slug: "thousand-palms", name: "Thousand Palms", canonicalUrl: "https://www.avir.com/city/thousand-palms" },
  { slug: "yucaipa", name: "Yucaipa", canonicalUrl: "https://www.avir.com/city/yucaipa" },
  { slug: "yucca-valley", name: "Yucca Valley", canonicalUrl: "https://www.avir.com/city/yucca-valley" },
];

/** Look up a city by slug. Returns undefined if not found. */
export function getCityBySlug(slug: string): CityData | undefined {
  return CITIES.find((c) => c.slug === slug);
}
