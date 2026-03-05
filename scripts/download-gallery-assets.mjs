#!/usr/bin/env node
/**
 * Downloads only gallery-specific images from asset-map.json
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ASSETS_DIR = resolve(ROOT, "public", "assets");

const CONCURRENCY = 15;
const TIMEOUT_MS = 30000;
const MAX_RETRIES = 2;

async function fetchWithRetry(url, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { "User-Agent": "AVIRBot/1.0" },
        redirect: "follow",
      });
      clearTimeout(timer);
      if (!res.ok) {
        if (attempt < retries) continue;
        return null;
      }
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      if (attempt < retries) continue;
      return null;
    }
  }
  return null;
}

function cdnUrlToLocalPath(url) {
  const parsed = new URL(url);
  const decodedPath = decodeURIComponent(parsed.pathname);
  return resolve(ASSETS_DIR, `${parsed.hostname}${decodedPath}`);
}

async function main() {
  // Load gallery data
  const galleryData = JSON.parse(readFileSync(resolve(ROOT, "data/gallery-data.json"), "utf-8"));
  
  // Collect all unique URLs
  const urls = new Set();
  for (const key of ["commercial", "home-cinema", "lifestyle"]) {
    for (const img of galleryData[key].images) {
      if (img.src) urls.add(img.src);
      if (img.lightboxUrl) urls.add(img.lightboxUrl);
      if (img.srcset) {
        for (const entry of img.srcset.split(",")) {
          const u = entry.trim().split(/\s+/)[0];
          if (u && u.startsWith("http")) urls.add(u);
        }
      }
    }
  }
  for (const item of galleryData.portfolio.items) {
    if (item.src) urls.add(item.src);
    if (item.srcset) {
      for (const entry of item.srcset.split(",")) {
        const u = entry.trim().split(/\s+/)[0];
        if (u && u.startsWith("http")) urls.add(u);
      }
    }
  }

  const urlList = [...urls];
  console.log(`Downloading ${urlList.length} gallery images...`);
  
  let downloaded = 0, skipped = 0, failed = 0;
  let idx = 0;

  async function worker() {
    while (idx < urlList.length) {
      const i = idx++;
      const url = urlList[i];
      const localPath = cdnUrlToLocalPath(url);
      
      if (existsSync(localPath)) {
        skipped++;
        continue;
      }
      
      const buf = await fetchWithRetry(url);
      if (buf) {
        mkdirSync(dirname(localPath), { recursive: true });
        writeFileSync(localPath, buf);
        downloaded++;
      } else {
        failed++;
        console.warn(`  FAIL: ${url}`);
      }
      
      if ((downloaded + skipped + failed) % 50 === 0) {
        console.log(`  Progress: ${downloaded + skipped + failed}/${urlList.length} (${downloaded} new, ${skipped} cached, ${failed} failed)`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  console.log(`\nDone! ${downloaded} downloaded, ${skipped} cached, ${failed} failed`);
}

main().catch(console.error);
