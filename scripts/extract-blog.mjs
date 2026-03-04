#!/usr/bin/env node

/**
 * Blog Post Extractor for avir.com — HEI-242
 *
 * Reads the scraped HTML files from data/pages/ for all blog-post URLs,
 * extracts structured content (title, date, author, body HTML, images),
 * downloads blog images to public/assets/blog/, and produces:
 *
 *   data/blog/<slug>.json        — structured JSON per post
 *   data/blog-index.json         — index of all posts with metadata
 *   public/assets/blog/           — downloaded blog images
 *
 * Depends on: HEI-239 (urls.json), HEI-240 (scraped pages)
 */

import * as cheerio from "cheerio";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  statSync,
} from "node:fs";
import { resolve, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const URLS_PATH = resolve(ROOT, "data", "urls.json");
const PAGES_DIR = resolve(ROOT, "data", "pages");
const BLOG_DIR = resolve(ROOT, "data", "blog");
const BLOG_INDEX_PATH = resolve(ROOT, "data", "blog-index.json");
const BLOG_ASSETS_DIR = resolve(ROOT, "public", "assets", "blog");
const ASSET_MAP_PATH = resolve(ROOT, "data", "asset-map.json");

const MAX_CONCURRENT_DOWNLOADS = 10;
const FETCH_TIMEOUT_MS = 30000;
const MAX_RETRIES = 2;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Derive the slug used by the scraper for a given URL.
 * e.g. "https://www.avir.com/post/some-title" -> "post--some-title"
 */
function urlToSlug(url) {
  const path = new URL(url).pathname;
  if (path === "/" || path === "") return "index";
  return path.replace(/^\/+|\/+$/g, "").replace(/\//g, "--");
}

/**
 * Derive a clean blog slug from the URL path.
 * e.g. "https://www.avir.com/post/some-title" -> "some-title"
 */
function urlToBlogSlug(url) {
  const path = new URL(url).pathname;
  return path.replace(/^\/post\//, "").replace(/^\/+|\/+$/g, "");
}

/**
 * Fetch a URL with timeout and retries.
 * Returns a Buffer or null on failure.
 */
async function fetchBuffer(url, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    let timer;
    try {
      const controller = new AbortController();
      timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; AVIRBlogBot/1.0; +https://github.com/Mind-Dragon/AVIR)",
          Accept: "*/*",
        },
        redirect: "follow",
      });
      if (!res.ok) {
        clearTimeout(timer);
        if (attempt < retries) {
          await sleep(1000 * (attempt + 1));
          continue;
        }
        console.warn(`  [${res.status}] ${url}`);
        return null;
      }
      const arrayBuf = await res.arrayBuffer();
      clearTimeout(timer);
      return Buffer.from(arrayBuf);
    } catch (err) {
      if (timer) clearTimeout(timer);
      if (attempt < retries) {
        await sleep(1000 * (attempt + 1));
        continue;
      }
      console.warn(`  [FAIL] ${url}: ${err.message}`);
      return null;
    }
  }
  return null;
}

/**
 * Process items with bounded concurrency.
 */
async function mapWithConcurrency(items, concurrency, fn) {
  const results = [];
  let idx = 0;

  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i], i);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker()
  );
  await Promise.all(workers);
  return results;
}

/**
 * Generate a clean, filesystem-safe image filename from a CDN URL.
 * e.g. "https://cdn.prod.website-files.com/.../685ccd72edbc4f_Screenshot%202025.png"
 *      -> "685ccd72edbc4f-screenshot-2025.png"
 */
function cdnUrlToCleanFilename(url, blogSlug, index) {
  try {
    const parsed = new URL(url);
    const pathParts = decodeURIComponent(parsed.pathname).split("/");
    const filename = pathParts[pathParts.length - 1] || `image-${index}`;

    // Clean up the filename: lowercase, replace spaces/special chars
    const cleaned = filename
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9._-]/g, "");

    // Ensure it has an extension
    const ext = extname(cleaned);
    if (!ext) {
      return `${blogSlug}-${index}.png`;
    }

    return cleaned;
  } catch {
    return `${blogSlug}-image-${index}.png`;
  }
}

/* ------------------------------------------------------------------ */
/*  Blog Content Extraction                                            */
/* ------------------------------------------------------------------ */

/**
 * Extract structured blog post content from a Webflow HTML page.
 *
 * @param {import('cheerio').CheerioAPI} $ - Parsed cheerio document
 * @param {string} url - The original page URL
 * @returns {object} Extracted blog post data
 */
function extractBlogPost($, url) {
  const blogSlug = urlToBlogSlug(url);

  // --- Title ---
  // Primary: .page-title h1 in the hero section
  // Fallback: first h1 in .w-richtext, then <title> tag
  const title =
    $(".page-title").first().text().trim() ||
    $(".w-richtext h1").first().text().trim() ||
    $("title").first().text().trim() ||
    "";

  // --- Date ---
  // Structure: .blog-page__info contains two .blog-page__infotext divs
  // First: "Posted on", Second: the actual date string
  let date = "";
  const infoTexts = [];
  $(".blog-page__infotext").each((_, el) => {
    infoTexts.push($(el).text().trim());
  });
  if (infoTexts.length >= 2) {
    date = infoTexts[1]; // e.g. "June 25, 2025"
  } else if (infoTexts.length === 1 && !infoTexts[0].match(/^Posted on/i)) {
    date = infoTexts[0];
  }

  // Try to parse to ISO date
  let dateISO = "";
  if (date) {
    try {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        dateISO = parsed.toISOString().split("T")[0]; // YYYY-MM-DD
      }
    } catch {
      // Keep raw string only
    }
  }

  // --- Author ---
  // AVIR blog posts don't have an explicit author field in the CMS
  const author = "";

  // --- Hero / Featured Image ---
  // The .title__bg element has a background-image CSS inline style
  let heroImage = "";
  const titleBgStyle = $(".title__bg").attr("style") || "";
  const bgMatch = titleBgStyle.match(/url\(\s*["']?([^"')]+)["']?\s*\)/);
  if (bgMatch) {
    heroImage = bgMatch[1];
  }

  // --- OG Image ---
  const ogImage =
    $('meta[property="og:image"]').attr("content")?.trim() || "";

  // --- Meta Description ---
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[property="og:description"]').attr("content")?.trim() ||
    "";

  // --- Body Content (Rich Text) ---
  const $richtext = $(".w-richtext").first();
  let bodyHtml = "";
  let bodyText = "";

  if ($richtext.length) {
    // Build clean HTML by keeping only content before the boilerplate footer
    bodyHtml = extractCleanBodyHtml($, $richtext);

    // Extract plain text from the clean HTML
    if (bodyHtml) {
      const $clean = cheerio.load(`<div>${bodyHtml}</div>`);
      bodyText = $clean("div").text().replace(/\s+/g, " ").trim();
    }
  }

  // --- Embedded Images ---
  // Collect all images from the rich text content
  const images = [];
  $richtext.find("figure.w-richtext-figure-type-image img[src]").each(
    (i, el) => {
      const src = $(el).attr("src") || "";
      const alt = $(el).attr("alt") || "";
      if (src && !src.startsWith("data:")) {
        images.push({ src, alt, index: i });
      }
    }
  );

  // Also include the hero image if present and not already in the list
  if (heroImage && !images.some((img) => img.src === heroImage)) {
    images.unshift({ src: heroImage, alt: title, index: -1, isHero: true });
  }

  // --- Embedded Videos ---
  const videos = [];
  $richtext.find("figure.w-richtext-figure-type-video iframe[src]").each(
    (_, el) => {
      const src = $(el).attr("src") || "";
      const videoTitle = $(el).attr("title") || "";
      if (src) {
        videos.push({ src, title: videoTitle });
      }
    }
  );

  return {
    slug: blogSlug,
    url,
    title,
    date,
    dateISO,
    author,
    metaDescription,
    heroImage,
    ogImage,
    bodyHtml,
    bodyText,
    images,
    videos,
  };
}

/**
 * Extract clean body HTML from the rich text element, stripping
 * the boilerplate footer (contact block, services list, city list)
 * that appears at the end of every AVIR blog post.
 *
 * Instead of mutating the DOM (which can cause cheerio issues with
 * cloned elements), we build the clean HTML by serializing only the
 * children before the boilerplate cut point.
 *
 * @param {import('cheerio').CheerioAPI} $ - Cheerio root instance
 * @param {import('cheerio').Cheerio} $richtext - The .w-richtext element
 * @returns {string} Clean body HTML
 */
function extractCleanBodyHtml($, $richtext) {
  const children = $richtext.children().toArray();

  // Find the index where the boilerplate footer begins
  let cutIndex = children.length;
  for (let i = 0; i < children.length; i++) {
    const text = $(children[i]).text().trim();
    if (
      text.match(/if you are interested in scheduling/i) ||
      text.match(/^Services:$/i) ||
      text.match(/^Proudly serving the entire/i)
    ) {
      cutIndex = i;
      break;
    }
  }

  // Build HTML from children before the cut point
  let cleanHtml = "";
  for (let i = 0; i < cutIndex; i++) {
    cleanHtml += $.html(children[i]);
  }

  // Strip trailing empty paragraphs (zero-width joiners, nbsp, whitespace)
  while (
    cleanHtml.match(
      /<p>\s*(<\/p>|‍<\/p>|\u200B<\/p>|\u00A0<\/p>|&nbsp;<\/p>)\s*$/
    )
  ) {
    cleanHtml = cleanHtml.replace(
      /<p>\s*(<\/p>|‍<\/p>|\u200B<\/p>|\u00A0<\/p>|&nbsp;<\/p>)\s*$/,
      ""
    );
  }

  return cleanHtml.trimEnd();
}

/* ------------------------------------------------------------------ */
/*  Image Downloading                                                  */
/* ------------------------------------------------------------------ */

/**
 * Download blog images to public/assets/blog/ and return the mapping
 * of original CDN URL to local path.
 *
 * @param {Map<string, {blogSlug: string, index: number}>} imageMap
 *        CDN URL -> { blogSlug, index }
 * @returns {Map<string, string>} CDN URL -> local relative path
 */
async function downloadBlogImages(imageMap) {
  mkdirSync(BLOG_ASSETS_DIR, { recursive: true });

  // Load existing asset-map if available (to reuse already-downloaded files)
  let existingAssets = new Map();
  if (existsSync(ASSET_MAP_PATH)) {
    try {
      const assetMapData = JSON.parse(readFileSync(ASSET_MAP_PATH, "utf-8"));
      for (const asset of assetMapData.assets || []) {
        existingAssets.set(asset.originalUrl, asset.localPath);
      }
    } catch {
      // Ignore parse errors
    }
  }

  const entries = [...imageMap.entries()];
  const localPaths = new Map();
  let downloaded = 0;
  let reused = 0;
  let failed = 0;

  await mapWithConcurrency(entries, MAX_CONCURRENT_DOWNLOADS, async ([cdnUrl, meta]) => {
    const cleanName = cdnUrlToCleanFilename(cdnUrl, meta.blogSlug, meta.index);
    const localPath = resolve(BLOG_ASSETS_DIR, cleanName);
    const relativePath = `public/assets/blog/${cleanName}`;

    // Check if already downloaded to blog assets
    if (existsSync(localPath)) {
      localPaths.set(cdnUrl, relativePath);
      reused++;
      return;
    }

    // Check if already downloaded by HEI-241 asset downloader
    const existingPath = existingAssets.get(cdnUrl);
    if (existingPath) {
      const existingFullPath = resolve(ROOT, existingPath);
      if (existsSync(existingFullPath)) {
        // Copy from existing location
        const buffer = readFileSync(existingFullPath);
        mkdirSync(dirname(localPath), { recursive: true });
        writeFileSync(localPath, buffer);
        localPaths.set(cdnUrl, relativePath);
        reused++;
        return;
      }
    }

    // Download fresh
    const buffer = await fetchBuffer(cdnUrl);
    if (buffer) {
      mkdirSync(dirname(localPath), { recursive: true });
      writeFileSync(localPath, buffer);
      localPaths.set(cdnUrl, relativePath);
      downloaded++;
    } else {
      console.warn(`  [SKIP] Failed to download: ${cdnUrl}`);
      failed++;
    }
  });

  console.log(
    `  Images: ${downloaded} downloaded, ${reused} reused, ${failed} failed`
  );
  return localPaths;
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  console.log("=== AVIR Blog Post Extractor (HEI-242) ===\n");

  // Step 0: Validate prerequisites
  if (!existsSync(URLS_PATH)) {
    console.error("ERROR: data/urls.json not found. Run the BFS crawl first (HEI-239).");
    process.exit(1);
  }
  if (!existsSync(PAGES_DIR)) {
    console.error("ERROR: data/pages/ not found. Run the page scraper first (HEI-240).");
    process.exit(1);
  }

  // Step 1: Identify all blog post URLs
  const urlsData = JSON.parse(readFileSync(URLS_PATH, "utf-8"));
  const blogUrls = urlsData.urls.filter((entry) => entry.type === "blog-post");
  console.log(`Found ${blogUrls.length} blog post URLs in data/urls.json\n`);

  // Step 2: Extract blog post content from scraped HTML
  console.log("--- Phase 1: Extracting blog post content ---\n");
  mkdirSync(BLOG_DIR, { recursive: true });

  const posts = [];
  const failures = [];
  /** @type {Map<string, {blogSlug: string, index: number}>} */
  const allImages = new Map();

  for (const entry of blogUrls) {
    const scraperSlug = urlToSlug(entry.url);
    const htmlPath = resolve(PAGES_DIR, `${scraperSlug}.html`);

    if (!existsSync(htmlPath)) {
      console.warn(`  [MISSING] ${entry.url} — no scraped HTML at ${scraperSlug}.html`);
      failures.push({ url: entry.url, slug: scraperSlug, reason: "missing HTML file" });
      continue;
    }

    const html = readFileSync(htmlPath, "utf-8");
    const $ = cheerio.load(html);
    const post = extractBlogPost($, entry.url);

    // Collect images for batch download
    for (const img of post.images) {
      if (!allImages.has(img.src)) {
        allImages.set(img.src, {
          blogSlug: post.slug,
          index: img.index >= 0 ? img.index : 0,
        });
      }
    }

    posts.push(post);
  }

  console.log(`Extracted ${posts.length} blog posts (${failures.length} failures)\n`);

  // Step 3: Download blog images
  console.log(`--- Phase 2: Downloading ${allImages.size} blog images ---\n`);
  const imagePaths = await downloadBlogImages(allImages);

  // Step 4: Finalize post data with local image paths and save
  console.log("\n--- Phase 3: Saving blog post JSON files ---\n");

  for (const post of posts) {
    // Map CDN image URLs to local paths
    const localImages = post.images.map((img) => ({
      originalUrl: img.src,
      localPath: imagePaths.get(img.src) || null,
      alt: img.alt,
      isHero: img.isHero || false,
    }));

    const heroLocalPath = post.heroImage
      ? imagePaths.get(post.heroImage) || null
      : null;

    const postData = {
      slug: post.slug,
      url: post.url,
      title: post.title,
      date: post.date,
      dateISO: post.dateISO,
      author: post.author,
      metaDescription: post.metaDescription,
      heroImage: {
        originalUrl: post.heroImage || null,
        localPath: heroLocalPath,
      },
      ogImage: post.ogImage || null,
      bodyHtml: post.bodyHtml,
      bodyText: post.bodyText,
      images: localImages,
      videos: post.videos,
      extractedAt: new Date().toISOString(),
    };

    const jsonPath = resolve(BLOG_DIR, `${post.slug}.json`);
    writeFileSync(jsonPath, JSON.stringify(postData, null, 2) + "\n");
  }

  console.log(`Saved ${posts.length} blog post JSON files to data/blog/\n`);

  // Step 5: Build blog-index.json
  console.log("--- Phase 4: Building blog-index.json ---\n");

  // Sort by date (newest first)
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.dateISO && b.dateISO) return b.dateISO.localeCompare(a.dateISO);
    if (a.dateISO) return -1;
    if (b.dateISO) return 1;
    return a.slug.localeCompare(b.slug);
  });

  const blogIndex = {
    metadata: {
      extractedAt: new Date().toISOString(),
      totalPosts: posts.length,
      totalImages: allImages.size,
      imagesDownloaded: imagePaths.size,
      failures: failures.length,
    },
    posts: sortedPosts.map((post) => ({
      slug: post.slug,
      url: post.url,
      title: post.title,
      date: post.date,
      dateISO: post.dateISO,
      author: post.author,
      metaDescription: post.metaDescription,
      heroImage: post.heroImage
        ? {
            originalUrl: post.heroImage,
            localPath: imagePaths.get(post.heroImage) || null,
          }
        : null,
      imageCount: post.images.length,
      videoCount: post.videos.length,
      excerpt:
        post.bodyText.length > 300
          ? post.bodyText.slice(0, 300).replace(/\s+\S*$/, "") + "..."
          : post.bodyText,
    })),
    failures,
  };

  writeFileSync(BLOG_INDEX_PATH, JSON.stringify(blogIndex, null, 2) + "\n");

  // Step 6: Summary
  console.log("=== Extraction complete ===\n");
  console.log(`Blog posts extracted: ${posts.length}`);
  console.log(`Failures: ${failures.length}`);
  console.log(`Total images: ${allImages.size}`);
  console.log(`Images downloaded/mapped: ${imagePaths.size}`);
  console.log(`Output: data/blog/ (${posts.length} JSON files)`);
  console.log(`Index: data/blog-index.json`);
  console.log(`Assets: public/assets/blog/`);

  if (failures.length > 0) {
    console.log("\nFailed posts:");
    for (const f of failures) {
      console.log(`  ${f.url} — ${f.reason}`);
    }
  }
}

main().catch((err) => {
  console.error("Blog extraction failed:", err);
  process.exit(1);
});
