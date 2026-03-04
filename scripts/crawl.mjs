#!/usr/bin/env node

/**
 * BFS Crawler for avir.com — HEI-239
 *
 * Discovers all URLs on avir.com using:
 *   1. Exa API for broad domain-wide URL discovery
 *   2. BFS HTTP crawling to follow every internal link from the homepage
 *
 * Output: data/urls.json
 */

import Exa from "exa-js";
import * as cheerio from "cheerio";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUTPUT_PATH = resolve(ROOT, "data", "urls.json");

const SEED_URL = "https://www.avir.com";
const DOMAIN = "avir.com";
const MAX_CONCURRENT = 5;
const REQUEST_DELAY_MS = 300;
const MAX_RETRIES = 2;
const FETCH_TIMEOUT_MS = 15000;

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/** Normalise a URL: strip trailing slash, fragment, and lowercase host */
function normaliseUrl(raw) {
  try {
    const u = new URL(raw);
    // Only keep http(s)
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    // Strip fragment
    u.hash = "";
    // Remove common tracking params
    u.searchParams.delete("utm_source");
    u.searchParams.delete("utm_medium");
    u.searchParams.delete("utm_campaign");
    u.searchParams.delete("utm_term");
    u.searchParams.delete("utm_content");
    u.searchParams.delete("fbclid");
    u.searchParams.delete("gclid");
    // Lowercase hostname
    let href = u.href;
    // Strip trailing slash for consistency (except root)
    if (href.endsWith("/") && u.pathname !== "/") {
      href = href.slice(0, -1);
    }
    return href;
  } catch {
    return null;
  }
}

/** Check whether a URL belongs to avir.com (any subdomain) */
function isInternal(url) {
  try {
    const host = new URL(url).hostname;
    return host === DOMAIN || host.endsWith(`.${DOMAIN}`);
  } catch {
    return false;
  }
}

/** Skip URLs pointing to binary assets or mailto/tel links */
function isPageUrl(url) {
  const skip = /\.(jpg|jpeg|png|gif|svg|webp|ico|pdf|zip|mp4|mp3|mov|avi|woff|woff2|ttf|eot|css|js)(\?.*)?$/i;
  return !skip.test(url);
}

/** Classify a page based on its URL path (tuned to avir.com structure) */
function classifyPage(url) {
  const path = new URL(url).pathname.toLowerCase();

  if (path === "/" || path === "") return "home";

  // Blog / posts
  if (/^\/post\//.test(path)) return "blog-post";
  if (/^\/blog\/?$/.test(path)) return "blog-index";

  // City / location pages
  if (/^\/city\//.test(path)) return "city";

  // Galleries
  if (/^\/galleries(\/|$)/.test(path)) return "gallery";

  // Portfolio
  if (/^\/portfolio(\/|$)/.test(path)) return "gallery";

  // Careers
  if (/^\/careers(\/|$)/.test(path)) return "careers";

  // Contact & forms
  if (/^\/(contact|commercial-form|residential-form|service-request)(\/|$)/.test(path))
    return "contact";

  // About
  if (/^\/(about|about-avir)(\/|$)/.test(path)) return "about";

  // Services
  if (/^\/(services)(\/|$)/.test(path)) return "services";

  // Brands
  if (/^\/brands(\/|$)/.test(path)) return "brands";

  // Processes
  if (/^\/processes(\/|$)/.test(path)) return "process";

  // Legal
  if (/^\/(privacy|terms|legal|disclaimer)(\/|$)/.test(path)) return "legal";

  // Product / service category pages
  if (/^\/(home-cinema|automation|lighting|shading|music|security|networking|audio|video|theater|theatre)(\/|$)/i.test(path))
    return "product";

  // Catch-all for old/misc pages
  if (/^\/old-home(\/|$)/.test(path)) return "legacy";
  if (/^\/exciting-new-products(\/|$)/.test(path)) return "product";

  return "page";
}

/** Fetch a page with timeout and retries */
async function fetchPage(url, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; AVIRCrawler/1.0; +https://github.com/Mind-Dragon/AVIR)",
          Accept: "text/html,application/xhtml+xml",
        },
        redirect: "follow",
      });
      clearTimeout(timer);
      if (!res.ok) {
        console.warn(`  [${res.status}] ${url}`);
        return null;
      }
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("text/html")) return null;
      return await res.text();
    } catch (err) {
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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Extract title and all internal links from HTML */
function parsePage(html, baseUrl) {
  const $ = cheerio.load(html);
  const title =
    $("title").first().text().trim() ||
    $('meta[property="og:title"]').attr("content")?.trim() ||
    "";

  const links = new Set();
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    const resolved = normaliseUrl(new URL(href, baseUrl).href);
    if (resolved && isInternal(resolved) && isPageUrl(resolved)) {
      links.add(resolved);
    }
  });

  return { title, links: [...links] };
}

/* ------------------------------------------------------------------ */
/*  Exa discovery                                                     */
/* ------------------------------------------------------------------ */

async function discoverWithExa() {
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) {
    console.warn("EXA_API_KEY not set — skipping Exa discovery");
    return [];
  }

  console.log("Discovering URLs via Exa API...");
  const exa = new Exa(apiKey);

  const queries = [
    "site:avir.com",
    "avir.com home cinema automation",
    "avir.com gallery projects portfolio",
    "avir.com blog news articles",
    "avir.com services products solutions",
    "avir.com contact about",
    "avir.com lighting shading security networking",
    "avir.com residential commercial",
    "avir.com audio video theater",
  ];

  const allUrls = new Set();

  for (const query of queries) {
    try {
      const result = await exa.search(query, {
        numResults: 100,
        includeDomains: [DOMAIN, `www.${DOMAIN}`],
        type: "keyword",
      });

      for (const r of result.results || []) {
        const norm = normaliseUrl(r.url);
        if (norm && isInternal(norm) && isPageUrl(norm)) {
          allUrls.add(norm);
        }
      }
      console.log(
        `  Exa query "${query}": ${result.results?.length || 0} results (total unique: ${allUrls.size})`
      );
    } catch (err) {
      console.warn(`  Exa query "${query}" failed: ${err.message}`);
    }
    await sleep(500);
  }

  console.log(`Exa discovery found ${allUrls.size} unique URLs\n`);
  return [...allUrls];
}

/* ------------------------------------------------------------------ */
/*  BFS crawl                                                         */
/* ------------------------------------------------------------------ */

async function bfsCrawl(seedUrls) {
  const visited = new Map(); // url -> { title, type }
  const queue = [];

  // Seed the queue
  const seeds = new Set([normaliseUrl(SEED_URL), ...seedUrls.map(normaliseUrl)].filter(Boolean));
  for (const url of seeds) {
    queue.push(url);
  }

  console.log(`Starting BFS crawl with ${queue.length} seed URLs...\n`);

  let processed = 0;

  while (queue.length > 0) {
    // Process in batches
    const batch = queue.splice(0, MAX_CONCURRENT);
    const promises = batch.map(async (url) => {
      if (visited.has(url)) return;
      visited.set(url, { title: "", type: classifyPage(url) }); // Mark as visited immediately

      const html = await fetchPage(url);
      if (!html) return;

      const { title, links } = parsePage(html, url);
      visited.set(url, { title, type: classifyPage(url) });

      // Add discovered links to queue
      for (const link of links) {
        if (!visited.has(link)) {
          queue.push(link);
        }
      }
    });

    await Promise.all(promises);
    processed += batch.length;

    if (processed % 20 === 0 || queue.length === 0) {
      console.log(
        `  Processed: ${processed} | Visited: ${visited.size} | Queue: ${queue.length}`
      );
    }

    await sleep(REQUEST_DELAY_MS);
  }

  return visited;
}

/* ------------------------------------------------------------------ */
/*  Main                                                              */
/* ------------------------------------------------------------------ */

async function main() {
  console.log("=== AVIR.com BFS Crawler (HEI-239) ===\n");

  // Step 1: Exa discovery
  const exaUrls = await discoverWithExa();

  // Step 2: BFS crawl (seeded with Exa results)
  const visited = await bfsCrawl(exaUrls);

  // Step 3: Build output
  const urls = [];
  for (const [url, { title, type }] of visited.entries()) {
    urls.push({ url, title, type });
  }

  // Sort by URL for stable output
  urls.sort((a, b) => a.url.localeCompare(b.url));

  const output = {
    metadata: {
      crawlDate: new Date().toISOString(),
      seedUrl: SEED_URL,
      totalUrls: urls.length,
      typeBreakdown: {},
    },
    urls,
  };

  // Compute type breakdown
  for (const entry of urls) {
    output.metadata.typeBreakdown[entry.type] =
      (output.metadata.typeBreakdown[entry.type] || 0) + 1;
  }

  // Step 4: Write output
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n");

  console.log(`\n=== Crawl complete ===`);
  console.log(`Total URLs discovered: ${urls.length}`);
  console.log(`Output written to: ${OUTPUT_PATH}`);
  console.log(`\nType breakdown:`);
  for (const [type, count] of Object.entries(output.metadata.typeBreakdown).sort(
    (a, b) => b[1] - a[1]
  )) {
    console.log(`  ${type}: ${count}`);
  }
}

main().catch((err) => {
  console.error("Crawl failed:", err);
  process.exit(1);
});
