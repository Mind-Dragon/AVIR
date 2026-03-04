#!/usr/bin/env node

/**
 * CDN Asset Downloader for avir.com — HEI-241
 *
 * Fetches every page listed in data/urls.json, extracts asset URLs
 * (images, fonts, videos, CSS background-images), downloads them to
 * public/assets/ mirroring the CDN path structure, and writes
 * data/asset-map.json with original-URL-to-local-path mappings + metadata.
 *
 * Output:
 *   - public/assets/   (downloaded files)
 *   - data/asset-map.json
 */

import * as cheerio from "cheerio";
import { imageSize } from "image-size";
import {
  writeFileSync,
  mkdirSync,
  existsSync,
  readFileSync,
  statSync,
} from "node:fs";
import { resolve, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const URLS_PATH = resolve(ROOT, "data", "urls.json");
const PAGES_DIR = resolve(ROOT, "data", "pages");
const ASSETS_DIR = resolve(ROOT, "public", "assets");
const OUTPUT_PATH = resolve(ROOT, "data", "asset-map.json");

const MAX_CONCURRENT_PAGES = 5;
const MAX_CONCURRENT_DOWNLOADS = 10;
const REQUEST_DELAY_MS = 200;
const FETCH_TIMEOUT_MS = 30000;
const MAX_RETRIES = 2;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Fetch with timeout and retries.
 * Returns { buffer, contentType } or null on failure.
 */
async function fetchWithRetry(url, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    let timer;
    try {
      const controller = new AbortController();
      timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; AVIRAssetBot/1.0; +https://github.com/Mind-Dragon/AVIR)",
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
      return {
        buffer: Buffer.from(arrayBuf),
        contentType: res.headers.get("content-type") || "",
      };
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
 * Fetch a page's HTML — prefers local scraped files from data/pages/
 * when available, otherwise fetches live.
 */
async function fetchPageHtml(url) {
  // Try local scraped file first (from HEI-240)
  if (existsSync(PAGES_DIR)) {
    const slug = new URL(url).pathname.replace(/\//g, "_") || "_root";
    const localPath = resolve(PAGES_DIR, `${slug}.html`);
    if (existsSync(localPath)) {
      return readFileSync(localPath, "utf-8");
    }
  }

  // Fall back to live fetch
  const result = await fetchWithRetry(url);
  if (!result) return null;
  const contentType = result.contentType;
  if (!contentType.includes("text/html")) return null;
  return result.buffer.toString("utf-8");
}

/* ------------------------------------------------------------------ */
/*  Asset URL extraction                                               */
/* ------------------------------------------------------------------ */

/** Resolve a potentially relative URL against a base, return absolute or null */
function resolveUrl(href, base) {
  if (!href || href.startsWith("data:") || href.startsWith("javascript:")) {
    return null;
  }
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

/** Check if a URL points to a downloadable asset (image, font, video) */
function isAssetUrl(url) {
  // Skip inline data URIs and anchors
  if (!url || url.startsWith("data:") || url.startsWith("#")) return false;

  try {
    const parsed = new URL(url);
    const path = parsed.pathname.toLowerCase();

    // Image extensions
    if (
      /\.(jpg|jpeg|png|gif|svg|webp|ico|avif|bmp|tiff?)$/i.test(path)
    ) {
      return true;
    }
    // Font extensions
    if (/\.(woff2?|ttf|eot|otf)$/i.test(path)) return true;
    // Video extensions
    if (/\.(mp4|webm|mov|avi|ogv)$/i.test(path)) return true;

    // Webflow CDN images often lack extensions — check domain + known patterns
    if (
      parsed.hostname === "cdn.prod.website-files.com" &&
      !path.endsWith(".css") &&
      !path.endsWith(".js")
    ) {
      // Webflow CDN files with hex IDs are typically images
      if (/\/[a-f0-9]{24,}_/.test(path)) return true;
    }

    return false;
  } catch {
    return false;
  }
}

/** Classify an asset by its likely type */
function classifyAsset(url) {
  const path = new URL(url).pathname.toLowerCase();
  if (/\.(woff2?|ttf|eot|otf)$/i.test(path)) return "font";
  if (/\.(mp4|webm|mov|avi|ogv)$/i.test(path)) return "video";
  return "image";
}

/**
 * Extract all asset URLs from a page's HTML.
 * Returns a Set of absolute URLs.
 */
function extractAssetUrls(html, pageUrl) {
  const $ = cheerio.load(html);
  const assets = new Set();

  // 1. <img src> and <img srcset>
  $("img[src]").each((_, el) => {
    const src = resolveUrl($(el).attr("src"), pageUrl);
    if (src && isAssetUrl(src)) assets.add(src);
  });
  $("img[srcset]").each((_, el) => {
    const srcset = $(el).attr("srcset") || "";
    for (const entry of srcset.split(",")) {
      const parts = entry.trim().split(/\s+/);
      if (parts[0]) {
        const src = resolveUrl(parts[0], pageUrl);
        if (src && isAssetUrl(src)) assets.add(src);
      }
    }
  });
  // Also handle data-src / data-srcset (lazy loading)
  $("[data-src]").each((_, el) => {
    const src = resolveUrl($(el).attr("data-src"), pageUrl);
    if (src && isAssetUrl(src)) assets.add(src);
  });
  $("[data-srcset]").each((_, el) => {
    const srcset = $(el).attr("data-srcset") || "";
    for (const entry of srcset.split(",")) {
      const parts = entry.trim().split(/\s+/);
      if (parts[0]) {
        const src = resolveUrl(parts[0], pageUrl);
        if (src && isAssetUrl(src)) assets.add(src);
      }
    }
  });

  // 2. <video src>, <video poster>, <source src>
  $("video[src]").each((_, el) => {
    const src = resolveUrl($(el).attr("src"), pageUrl);
    if (src && isAssetUrl(src)) assets.add(src);
  });
  $("video[poster]").each((_, el) => {
    const src = resolveUrl($(el).attr("poster"), pageUrl);
    if (src && isAssetUrl(src)) assets.add(src);
  });
  $("source[src]").each((_, el) => {
    const src = resolveUrl($(el).attr("src"), pageUrl);
    if (src && isAssetUrl(src)) assets.add(src);
  });

  // 3. <link> — favicons, apple-touch-icon, etc.
  $('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').each(
    (_, el) => {
      const href = resolveUrl($(el).attr("href"), pageUrl);
      if (href && isAssetUrl(href)) assets.add(href);
    }
  );

  // 4. <meta property="og:image"> and <meta name="twitter:image">
  $(
    'meta[property="og:image"], meta[name="twitter:image"], meta[property="og:video"]'
  ).each((_, el) => {
    const content = resolveUrl($(el).attr("content"), pageUrl);
    if (content && isAssetUrl(content)) assets.add(content);
  });

  // 5. Inline style background-image: url(...)
  $("[style]").each((_, el) => {
    const style = $(el).attr("style") || "";
    const urlMatches = style.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi);
    for (const match of urlMatches) {
      const src = resolveUrl(match[1], pageUrl);
      if (src && isAssetUrl(src)) assets.add(src);
    }
  });

  // 6. <style> blocks — background-image and @font-face
  $("style").each((_, el) => {
    const css = $(el).text() || "";
    extractCssAssets(css, pageUrl, assets);
  });

  return assets;
}

/** Extract asset URLs from CSS text (font-face src, background-image) */
function extractCssAssets(css, baseUrl, assets) {
  const urlMatches = css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi);
  for (const match of urlMatches) {
    const src = resolveUrl(match[1], baseUrl);
    if (src && isAssetUrl(src)) assets.add(src);
  }
}

/* ------------------------------------------------------------------ */
/*  CDN path → local path mapping                                      */
/* ------------------------------------------------------------------ */

/**
 * Convert a CDN URL to a local file path under public/assets/.
 * Mirrors the CDN structure: domain/path
 */
function cdnUrlToLocalPath(url) {
  const parsed = new URL(url);
  // Decode percent-encoded characters for cleaner filenames
  const decodedPath = decodeURIComponent(parsed.pathname);
  // Remove leading slash, combine hostname + path
  const relativePath = `${parsed.hostname}${decodedPath}`;
  return resolve(ASSETS_DIR, relativePath);
}

/* ------------------------------------------------------------------ */
/*  Download + metadata                                                */
/* ------------------------------------------------------------------ */

/**
 * Detect image dimensions from a buffer.
 * Returns { width, height } or null.
 */
function getImageDimensions(buffer, filePath) {
  try {
    const result = imageSize(buffer);
    if (result && result.width && result.height) {
      return { width: result.width, height: result.height };
    }
  } catch {
    // SVGs / corrupt files may fail — that's fine
  }
  return null;
}

/** Guess the file format from URL or content-type */
function guessFormat(url, contentType) {
  const ext = extname(new URL(url).pathname).replace(/^\./, "").toLowerCase();
  if (ext) return ext;

  // Fall back to content-type
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return "jpg";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("gif")) return "gif";
  if (contentType.includes("svg")) return "svg";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("mp4")) return "mp4";
  if (contentType.includes("webm")) return "webm";
  if (contentType.includes("woff2")) return "woff2";
  if (contentType.includes("woff")) return "woff";
  if (contentType.includes("ttf") || contentType.includes("truetype"))
    return "ttf";
  if (contentType.includes("opentype")) return "otf";

  return "bin";
}

/**
 * Download a single asset, save to disk, return metadata entry.
 */
async function downloadAsset(url) {
  const localPath = cdnUrlToLocalPath(url);
  const relativePath = localPath.replace(ROOT + "/", "");

  // Skip if already downloaded
  if (existsSync(localPath)) {
    try {
      const stat = statSync(localPath);
      const buffer = readFileSync(localPath);
      const type = classifyAsset(url);
      const format = guessFormat(url, "");
      const entry = {
        originalUrl: url,
        localPath: relativePath,
        type,
        format,
        fileSize: stat.size,
      };
      if (type === "image") {
        const dims = getImageDimensions(buffer, localPath);
        if (dims) {
          entry.width = dims.width;
          entry.height = dims.height;
        }
      }
      return entry;
    } catch {
      // Re-download if read fails
    }
  }

  const result = await fetchWithRetry(url);
  if (!result) {
    return {
      originalUrl: url,
      localPath: relativePath,
      type: classifyAsset(url),
      error: "download_failed",
    };
  }

  // Ensure directory exists
  mkdirSync(dirname(localPath), { recursive: true });
  writeFileSync(localPath, result.buffer);

  const type = classifyAsset(url);
  const format = guessFormat(url, result.contentType);
  const entry = {
    originalUrl: url,
    localPath: relativePath,
    type,
    format,
    fileSize: result.buffer.length,
  };

  if (type === "image") {
    const dims = getImageDimensions(result.buffer, localPath);
    if (dims) {
      entry.width = dims.width;
      entry.height = dims.height;
    }
  }

  return entry;
}

/* ------------------------------------------------------------------ */
/*  Linked CSS processing                                              */
/* ------------------------------------------------------------------ */

/**
 * Fetch linked stylesheets from HTML and extract font/image asset URLs.
 */
async function extractLinkedCssAssets(html, pageUrl) {
  const $ = cheerio.load(html);
  const assets = new Set();
  const cssLinks = [];

  $('link[rel="stylesheet"][href]').each((_, el) => {
    const href = resolveUrl($(el).attr("href"), pageUrl);
    if (href) cssLinks.push(href);
  });

  for (const cssUrl of cssLinks) {
    try {
      const result = await fetchWithRetry(cssUrl);
      if (!result) continue;
      const cssText = result.buffer.toString("utf-8");
      extractCssAssets(cssText, cssUrl, assets);
    } catch {
      // Skip failed CSS fetches
    }
  }

  return assets;
}

/* ------------------------------------------------------------------ */
/*  Concurrency helper                                                 */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  console.log("=== AVIR CDN Asset Downloader (HEI-241) ===\n");

  // Step 0: Load URLs
  if (!existsSync(URLS_PATH)) {
    console.error("ERROR: data/urls.json not found. Run the crawl first (HEI-239).");
    process.exit(1);
  }
  const urlsData = JSON.parse(readFileSync(URLS_PATH, "utf-8"));
  const pageUrls = urlsData.urls.map((entry) => entry.url);
  console.log(`Loaded ${pageUrls.length} page URLs from data/urls.json\n`);

  // Step 1: Fetch all pages and extract asset URLs
  console.log("--- Phase 1: Extracting asset URLs from all pages ---\n");
  const allAssets = new Set();
  /** @type {Map<string, Set<string>>} asset URL → set of page URLs that reference it */
  const assetSources = new Map();
  let pagesProcessed = 0;
  let pagesFailed = 0;

  await mapWithConcurrency(pageUrls, MAX_CONCURRENT_PAGES, async (pageUrl) => {
    const html = await fetchPageHtml(pageUrl);
    if (!html) {
      pagesFailed++;
      console.warn(`  [SKIP] ${pageUrl} (fetch failed)`);
      return;
    }

    // Extract from HTML
    const pageAssets = extractAssetUrls(html, pageUrl);

    // Extract from linked stylesheets
    const cssAssets = await extractLinkedCssAssets(html, pageUrl);
    for (const a of cssAssets) pageAssets.add(a);

    for (const assetUrl of pageAssets) {
      allAssets.add(assetUrl);
      if (!assetSources.has(assetUrl)) {
        assetSources.set(assetUrl, new Set());
      }
      assetSources.get(assetUrl).add(pageUrl);
    }

    pagesProcessed++;
    if (pagesProcessed % 20 === 0) {
      console.log(
        `  Pages: ${pagesProcessed}/${pageUrls.length} | Assets found: ${allAssets.size}`
      );
    }
    await sleep(REQUEST_DELAY_MS);
  });

  console.log(
    `\nExtraction complete: ${pagesProcessed} pages processed, ${pagesFailed} failed`
  );
  console.log(`Total unique assets: ${allAssets.size}\n`);

  // Classify assets
  const assetsByType = { image: 0, font: 0, video: 0 };
  for (const url of allAssets) {
    assetsByType[classifyAsset(url)]++;
  }
  console.log("Asset breakdown:");
  for (const [type, count] of Object.entries(assetsByType)) {
    console.log(`  ${type}: ${count}`);
  }
  console.log();

  // Step 2: Download all assets
  console.log("--- Phase 2: Downloading assets ---\n");
  mkdirSync(ASSETS_DIR, { recursive: true });

  const assetList = [...allAssets];
  let downloaded = 0;
  let downloadFailed = 0;

  const assetEntries = await mapWithConcurrency(
    assetList,
    MAX_CONCURRENT_DOWNLOADS,
    async (assetUrl, idx) => {
      const entry = await downloadAsset(assetUrl);
      if (entry.error) {
        downloadFailed++;
      } else {
        downloaded++;
      }
      if ((downloaded + downloadFailed) % 50 === 0) {
        console.log(
          `  Downloaded: ${downloaded} | Failed: ${downloadFailed} | Total: ${downloaded + downloadFailed}/${assetList.length}`
        );
      }
      return entry;
    }
  );

  console.log(
    `\nDownload complete: ${downloaded} succeeded, ${downloadFailed} failed\n`
  );

  // Step 3: Build asset-map.json
  console.log("--- Phase 3: Building asset-map.json ---\n");

  const assetMap = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalAssets: assetEntries.length,
      totalDownloaded: downloaded,
      totalFailed: downloadFailed,
      pagesProcessed,
      breakdown: assetsByType,
    },
    assets: assetEntries
      .filter((e) => !e.error)
      .sort((a, b) => a.originalUrl.localeCompare(b.originalUrl))
      .map((entry) => ({
        ...entry,
        referencedBy: [...(assetSources.get(entry.originalUrl) || [])],
      })),
    failed: assetEntries
      .filter((e) => e.error)
      .map((e) => ({ url: e.originalUrl, error: e.error })),
  };

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(assetMap, null, 2) + "\n");

  console.log(`Asset map written to: ${OUTPUT_PATH}`);
  console.log(`Assets directory: ${ASSETS_DIR}`);
  console.log(`\n=== Done ===`);
}

main().catch((err) => {
  console.error("Asset download failed:", err);
  process.exit(1);
});
