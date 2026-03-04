#!/usr/bin/env node

/**
 * Page Scraper for avir.com — HEI-240
 *
 * Fetches full HTML for every URL in data/urls.json, extracts structured
 * content (title, meta, headings, body text, nav, footer, template type),
 * and saves raw HTML + extracted JSON to data/pages/.
 * Also builds data/site-map.json.
 *
 * Output:
 *   data/pages/<slug>.html   — raw HTML per page
 *   data/pages/<slug>.json   — extracted content per page
 *   data/site-map.json       — URL -> template type, title, key content sections
 */

import * as cheerio from "cheerio";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const URLS_PATH = resolve(ROOT, "data", "urls.json");
const PAGES_DIR = resolve(ROOT, "data", "pages");
const SITEMAP_PATH = resolve(ROOT, "data", "site-map.json");

const MAX_CONCURRENT = 5;
const REQUEST_DELAY_MS = 400;
const MAX_RETRIES = 2;
const FETCH_TIMEOUT_MS = 20000;

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Derive a filesystem-safe slug from a URL path.
 * e.g. "https://www.avir.com/post/some-title" -> "post--some-title"
 *      "https://www.avir.com/" -> "index"
 */
function urlToSlug(url) {
  const path = new URL(url).pathname;
  if (path === "/" || path === "") return "index";
  // Remove leading/trailing slashes, replace remaining slashes with "--"
  return path
    .replace(/^\/+|\/+$/g, "")
    .replace(/\//g, "--");
}

/** Fetch a page with timeout and retries */
async function fetchPage(url, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    let timer;
    try {
      const controller = new AbortController();
      timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; AVIRCrawler/1.0; +https://github.com/Mind-Dragon/AVIR)",
          Accept: "text/html,application/xhtml+xml",
        },
        redirect: "follow",
      });
      if (!res.ok) {
        clearTimeout(timer);
        console.warn(`  [${res.status}] ${url}`);
        return null;
      }
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("text/html")) {
        clearTimeout(timer);
        console.warn(`  [NOT HTML] ${url}`);
        return null;
      }
      const text = await res.text();
      clearTimeout(timer);
      return text;
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

/* ------------------------------------------------------------------ */
/*  Content Extraction                                                */
/* ------------------------------------------------------------------ */

/**
 * Extract structured content from HTML.
 * Returns an object with: title, metaDescription, ogImage, headings,
 * bodyText, navigation, footer, and contentSections.
 */
function extractContent(html, url) {
  const $ = cheerio.load(html);

  // --- Title ---
  const title =
    $("title").first().text().trim() ||
    $('meta[property="og:title"]').attr("content")?.trim() ||
    "";

  // --- Meta description ---
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[property="og:description"]').attr("content")?.trim() ||
    "";

  // --- OG image ---
  const ogImage =
    $('meta[property="og:image"]').attr("content")?.trim() || "";

  // --- Canonical URL ---
  const canonical =
    $('link[rel="canonical"]').attr("href")?.trim() || "";

  // --- Headings (h1–h6 with hierarchy) ---
  const headings = [];
  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const tag = $(el).prop("tagName").toLowerCase();
    const text = $(el).text().trim().replace(/\s+/g, " ");
    if (text) {
      headings.push({ level: parseInt(tag[1], 10), text });
    }
  });

  // --- Body text ---
  // Remove scripts, styles, nav, footer, and hidden elements before extracting
  const $body = $("body").clone();
  $body.find("script, style, noscript, iframe, svg").remove();

  // Extract body text from main content area (skip nav/footer for body text)
  const $mainContent = $body.clone();
  $mainContent.find("nav, header, footer, [role='navigation'], [role='banner'], [role='contentinfo']").remove();
  const bodyText = $mainContent
    .text()
    .replace(/\s+/g, " ")
    .trim();

  // --- Navigation structure ---
  const navigation = extractNavigation($);

  // --- Footer ---
  const footer = extractFooter($);

  // --- Content sections ---
  const contentSections = extractContentSections($);

  return {
    url,
    title,
    metaDescription,
    ogImage,
    canonical,
    headings,
    bodyText,
    navigation,
    footer,
    contentSections,
  };
}

/**
 * Extract navigation structure: top-level and nested nav links.
 */
function extractNavigation($) {
  const navItems = [];

  // Look for nav elements, Webflow nav components, or role="navigation"
  const $nav = $('nav, [role="navigation"], .nav-menu, .w-nav-menu').first();

  if ($nav.length) {
    $nav.find("a[href]").each((_, el) => {
      const text = $(el).text().trim().replace(/\s+/g, " ");
      const href = $(el).attr("href") || "";
      if (text && href && !href.startsWith("#") && !href.startsWith("javascript:")) {
        navItems.push({ text, href });
      }
    });
  }

  // Deduplicate by href
  const seen = new Set();
  return navItems.filter((item) => {
    if (seen.has(item.href)) return false;
    seen.add(item.href);
    return true;
  });
}

/**
 * Extract footer content: links, text, and structure.
 */
function extractFooter($) {
  const $footer = $('footer, [role="contentinfo"], .footer-section, .footer').first();
  if (!$footer.length) return { text: "", links: [] };

  const links = [];
  $footer.find("a[href]").each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, " ");
    const href = $(el).attr("href") || "";
    if (text && href) {
      links.push({ text, href });
    }
  });

  // Deduplicate footer links by href
  const seen = new Set();
  const uniqueLinks = links.filter((item) => {
    if (seen.has(item.href)) return false;
    seen.add(item.href);
    return true;
  });

  const text = $footer
    .clone()
    .find("script, style")
    .remove()
    .end()
    .text()
    .replace(/\s+/g, " ")
    .trim();

  return { text, links: uniqueLinks };
}

/**
 * Identify key content sections on the page.
 * Looks for common Webflow section patterns and semantic elements.
 */
function extractContentSections($) {
  const sections = [];

  // Look for section elements and Webflow section classes
  $("section, .section, [class*='section'], [class*='hero'], [class*='cta']").each(
    (_, el) => {
      const $section = $(el);
      // Get section identifier from class or id
      const className = $section.attr("class") || "";
      const id = $section.attr("id") || "";
      const identifier = id || className.split(/\s+/).slice(0, 3).join(" ");

      // Get heading within section
      const sectionHeading =
        $section.find("h1, h2, h3").first().text().trim().replace(/\s+/g, " ") || "";

      // Get section text (truncated for site-map readability)
      const $clone = $section.clone();
      $clone.find("script, style, nav, footer").remove();
      const sectionText = $clone.text().replace(/\s+/g, " ").trim();
      const preview = sectionText.length > 300
        ? sectionText.slice(0, 300) + "..."
        : sectionText;

      if (sectionHeading || preview.length > 20) {
        sections.push({
          identifier: identifier.trim(),
          heading: sectionHeading,
          preview,
        });
      }
    }
  );

  return sections;
}

/* ------------------------------------------------------------------ */
/*  Template Type Refinement                                          */
/* ------------------------------------------------------------------ */

/**
 * Refine the template type by analyzing actual page content.
 * The BFS crawl already classified URLs by path; this verifies and
 * refines based on actual DOM structure.
 */
function refineTemplateType(existingType, extracted, $) {
  // Start with the BFS classification
  let type = existingType || "page";

  // Verify / refine based on content signals
  const url = extracted.url.toLowerCase();
  const hasGalleryGrid =
    $(".w-dyn-list, .gallery-grid, [class*='gallery'], [class*='portfolio']").length > 0;
  const hasBlogContent =
    $(".w-richtext, .rich-text-block, [class*='blog-content'], [class*='post-body']").length > 0;
  const hasForm =
    $("form, .w-form, [class*='form']").length > 0;

  // Refine "page" catch-all
  if (type === "page") {
    if (hasGalleryGrid) type = "gallery";
    else if (hasBlogContent) type = "blog-post";
    else if (hasForm && (url.includes("contact") || url.includes("form"))) type = "contact";
    else if (url.includes("service") || url.includes("process")) type = "services";
  }

  // Add sub-classification for blog posts
  if (type === "blog-post" && !hasBlogContent) {
    // Might be a blog index page rather than a post
    if ($(".w-dyn-list, .collection-list, [class*='blog-list']").length > 0) {
      type = "blog-index";
    }
  }

  return type;
}

/* ------------------------------------------------------------------ */
/*  Main                                                              */
/* ------------------------------------------------------------------ */

async function main() {
  console.log("=== AVIR.com Page Scraper (HEI-240) ===\n");

  // Step 0: Load URLs
  if (!existsSync(URLS_PATH)) {
    console.error(`ERROR: ${URLS_PATH} not found. Run the BFS crawl first (HEI-239).`);
    process.exit(1);
  }

  const urlData = JSON.parse(readFileSync(URLS_PATH, "utf-8"));
  const urls = urlData.urls;
  console.log(`Loaded ${urls.length} URLs from ${URLS_PATH}\n`);

  // Step 1: Create output directory
  mkdirSync(PAGES_DIR, { recursive: true });

  const siteMap = [];
  const failures = [];
  let processed = 0;

  // Step 2: Process URLs in batches
  for (let i = 0; i < urls.length; i += MAX_CONCURRENT) {
    const batch = urls.slice(i, i + MAX_CONCURRENT);
    const promises = batch.map(async (entry) => {
      const { url, type: existingType } = entry;
      const slug = urlToSlug(url);

      const html = await fetchPage(url);
      if (!html) {
        failures.push({ url, slug, reason: "fetch failed" });
        return;
      }

      // Save raw HTML
      const htmlPath = resolve(PAGES_DIR, `${slug}.html`);
      writeFileSync(htmlPath, html);

      // Extract content
      const $ = cheerio.load(html);
      const extracted = extractContent(html, url);

      // Refine template type
      const templateType = refineTemplateType(existingType, extracted, $);

      // Build page JSON
      const pageData = {
        url,
        slug,
        templateType,
        title: extracted.title,
        metaDescription: extracted.metaDescription,
        ogImage: extracted.ogImage,
        canonical: extracted.canonical,
        headings: extracted.headings,
        bodyText: extracted.bodyText,
        navigation: extracted.navigation,
        footer: extracted.footer,
        contentSections: extracted.contentSections,
        scrapedAt: new Date().toISOString(),
      };

      // Save extracted JSON
      const jsonPath = resolve(PAGES_DIR, `${slug}.json`);
      writeFileSync(jsonPath, JSON.stringify(pageData, null, 2) + "\n");

      // Build site-map entry
      siteMap.push({
        url,
        slug,
        templateType,
        title: extracted.title,
        metaDescription: extracted.metaDescription,
        contentSections: extracted.contentSections.map((s) => ({
          heading: s.heading,
          identifier: s.identifier,
        })),
      });
    });

    await Promise.all(promises);
    processed += batch.length;

    if (processed % 10 === 0 || processed === urls.length) {
      console.log(
        `  Processed: ${processed}/${urls.length} | Failures: ${failures.length}`
      );
    }

    await sleep(REQUEST_DELAY_MS);
  }

  // Step 3: Build site-map.json
  // Sort by URL for stable output
  siteMap.sort((a, b) => a.url.localeCompare(b.url));

  // Compute template type breakdown
  const typeBreakdown = {};
  for (const entry of siteMap) {
    typeBreakdown[entry.templateType] =
      (typeBreakdown[entry.templateType] || 0) + 1;
  }

  const siteMapOutput = {
    metadata: {
      scrapeDate: new Date().toISOString(),
      totalPages: siteMap.length,
      failedPages: failures.length,
      typeBreakdown,
    },
    pages: siteMap,
    failures,
  };

  writeFileSync(SITEMAP_PATH, JSON.stringify(siteMapOutput, null, 2) + "\n");

  // Step 4: Summary
  console.log(`\n=== Scrape complete ===`);
  console.log(`Pages scraped: ${siteMap.length}`);
  console.log(`Failures: ${failures.length}`);
  console.log(`Output: ${PAGES_DIR}`);
  console.log(`Site map: ${SITEMAP_PATH}`);
  console.log(`\nTemplate type breakdown:`);
  for (const [type, count] of Object.entries(typeBreakdown).sort(
    (a, b) => b[1] - a[1]
  )) {
    console.log(`  ${type}: ${count}`);
  }

  if (failures.length > 0) {
    console.log(`\nFailed URLs:`);
    for (const f of failures) {
      console.log(`  ${f.url} — ${f.reason}`);
    }
  }
}

main().catch((err) => {
  console.error("Scrape failed:", err);
  process.exit(1);
});
