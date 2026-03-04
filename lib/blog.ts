import fs from "fs";
import path from "path";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface BlogImage {
  originalUrl: string;
  localPath: string;
  alt: string;
  isHero: boolean;
}

export interface HeroImage {
  originalUrl: string;
  localPath: string;
}

export interface BlogPost {
  slug: string;
  url: string;
  title: string;
  date: string;
  dateISO: string;
  author: string;
  metaDescription: string;
  heroImage: HeroImage;
  ogImage: string | null;
  bodyHtml: string;
  bodyText: string;
  images: BlogImage[];
  videos: string[];
  extractedAt: string;
}

export interface BlogIndexEntry {
  slug: string;
  url: string;
  title: string;
  date: string;
  dateISO: string;
  author: string;
  metaDescription: string;
  heroImage: HeroImage;
  imageCount: number;
  videoCount: number;
  excerpt: string;
}

export interface BlogIndex {
  metadata: {
    extractedAt: string;
    totalPosts: number;
    totalImages: number;
    imagesDownloaded: number;
    failures: number;
  };
  posts: BlogIndexEntry[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Resolve a blog image URL.
 * If a local file exists in public/, use the relative public path;
 * otherwise fall back to the original CDN URL.
 */
/** Placeholder when no hero image is available (inline data URI to avoid gitignore) */
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500'%3E%3Crect width='800' height='500' fill='%23ede4dd'/%3E%3Ctext x='400' y='250' font-family='sans-serif' font-size='24' fill='%23604e44' text-anchor='middle' dominant-baseline='middle'%3EAVIR%3C/text%3E%3C/svg%3E";

export function resolveImageUrl(img: HeroImage | null): string {
  if (!img) return PLACEHOLDER_IMAGE;
  if (img.localPath) {
    // localPath is stored as "public/assets/blog/…" — strip "public" prefix
    const publicPath = img.localPath.replace(/^public\//, "/");
    const absPath = path.join(process.cwd(), "public", publicPath);
    if (fs.existsSync(absPath)) {
      return publicPath;
    }
  }
  return img.originalUrl;
}

/**
 * Rewrite image src attributes in bodyHtml so they point to local assets
 * when available, otherwise keep the original CDN URL.
 */
export function rewriteBodyImages(
  bodyHtml: string,
  images: BlogImage[]
): string {
  let html = bodyHtml;
  for (const img of images) {
    if (img.isHero) continue; // hero handled separately
    const localPublicPath = img.localPath.replace(/^public\//, "/");
    const absPath = path.join(process.cwd(), "public", localPublicPath);
    if (fs.existsSync(absPath)) {
      html = html.split(img.originalUrl).join(localPublicPath);
    }
    // If local file doesn't exist, keep original CDN URL — no change needed
  }
  return html;
}

/* ------------------------------------------------------------------ */
/*  Data loaders                                                       */
/* ------------------------------------------------------------------ */

let _indexCache: BlogIndex | null = null;

export function getBlogIndex(): BlogIndex {
  if (_indexCache) return _indexCache;
  const raw = fs.readFileSync(
    path.join(DATA_DIR, "blog-index.json"),
    "utf-8"
  );
  _indexCache = JSON.parse(raw) as BlogIndex;
  return _indexCache;
}

export function getAllPosts(): BlogIndexEntry[] {
  return getBlogIndex().posts;
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

const _postCache = new Map<string, BlogPost>();

export function getPostBySlug(slug: string): BlogPost | null {
  if (_postCache.has(slug)) return _postCache.get(slug)!;
  const filePath = path.join(DATA_DIR, "blog", `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const post = JSON.parse(raw) as BlogPost;
  _postCache.set(slug, post);
  return post;
}
