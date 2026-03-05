import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { CITIES } from "@/lib/cities";
import { getAllPosts } from "@/lib/blog";
import { getAllGallerySlugs } from "@/lib/gallery-data";
import { getAllCareerSlugs } from "@/lib/careers-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  /* ------------------------------------------------------------------ */
  /*  Core pages — priority 1.0                                          */
  /* ------------------------------------------------------------------ */

  const corePages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/about-avir`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/brands`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/portfolio`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/processes`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/exciting-new-products`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/careers`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/commercial-form`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/residential-form`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/service-request`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  /* ------------------------------------------------------------------ */
  /*  City pages — priority 0.9, monthly                                 */
  /* ------------------------------------------------------------------ */

  const cityPages: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: `${SITE_URL}/city/${city.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  /* ------------------------------------------------------------------ */
  /*  Blog posts — priority 0.8, weekly                                  */
  /* ------------------------------------------------------------------ */

  const posts = getAllPosts();
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/post/${post.slug}`,
    lastModified: post.dateISO || now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  /* ------------------------------------------------------------------ */
  /*  Gallery pages — priority 0.7                                       */
  /* ------------------------------------------------------------------ */

  const gallerySlugs = getAllGallerySlugs();
  const galleryPages: MetadataRoute.Sitemap = gallerySlugs.map((slug) => ({
    url: `${SITE_URL}/galleries/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  /* ------------------------------------------------------------------ */
  /*  Career detail pages — priority 0.6                                 */
  /* ------------------------------------------------------------------ */

  const careerSlugs = getAllCareerSlugs();
  const careerPages: MetadataRoute.Sitemap = careerSlugs.map((slug) => ({
    url: `${SITE_URL}/careers/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...corePages,
    ...cityPages,
    ...blogPages,
    ...galleryPages,
    ...careerPages,
  ];
}
