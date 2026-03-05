#!/usr/bin/env node

/**
 * Prebuild Asset Downloader — HEI-253
 *
 * Reads data/asset-map.json and downloads all mapped assets to public/assets/.
 * Designed to run as a Vercel prebuild step so assets are available at build time
 * without committing 571 MB of binaries to the repository.
 *
 * Usage:
 *   node scripts/prebuild-assets.mjs
 */

import {
  writeFileSync,
  mkdirSync,
  existsSync,
  readFileSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ASSET_MAP_PATH = resolve(ROOT, "data", "asset-map.json");

const MAX_CONCURRENT = 50;
const FETCH_TIMEOUT_MS = 15_000;
const MAX_RETRIES = 1;
const GLOBAL_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes max for entire script

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

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
  console.log("=== AVIR Prebuild Asset Downloader (HEI-253) ===");
  console.log(`  CWD: ${process.cwd()}`);
  console.log(`  ROOT: ${ROOT}\n`);

  // Global timeout to prevent Vercel build from hanging
  const globalTimer = setTimeout(() => {
    console.warn("\nGlobal timeout reached — stopping downloads.");
    process.exit(0); // exit cleanly so next build still runs
  }, GLOBAL_TIMEOUT_MS);

  if (!existsSync(ASSET_MAP_PATH)) {
    console.warn("WARNING: data/asset-map.json not found — skipping asset download.");
    clearTimeout(globalTimer);
    return;
  }

  const assetMap = JSON.parse(readFileSync(ASSET_MAP_PATH, "utf-8"));
  const assets = assetMap.assets || [];
  console.log(`Found ${assets.length} assets in asset-map.json\n`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  await mapWithConcurrency(assets, MAX_CONCURRENT, async (asset) => {
    const localPath = resolve(ROOT, asset.localPath);

    // Skip if already downloaded
    if (existsSync(localPath)) {
      skipped++;
      return;
    }

    const buf = await fetchWithRetry(asset.originalUrl);
    if (!buf) {
      failed++;
      console.warn(`  [FAIL] ${asset.originalUrl}`);
      return;
    }

    mkdirSync(dirname(localPath), { recursive: true });
    writeFileSync(localPath, buf);
    downloaded++;

    if ((downloaded + failed) % 100 === 0) {
      console.log(
        `  Progress: ${downloaded} downloaded, ${failed} failed, ${skipped} skipped / ${assets.length} total`
      );
    }
  });

  console.log(`\n=== Done ===`);
  console.log(
    `  Downloaded: ${downloaded} | Skipped (cached): ${skipped} | Failed: ${failed} / ${assets.length} total`
  );

  clearTimeout(globalTimer);

  if (failed > 0) {
    console.warn(`\nWARNING: ${failed} assets failed to download.`);
  }
}

main().catch((err) => {
  console.error("Prebuild asset download failed (non-fatal):", err);
  // Exit cleanly so the Next.js build still proceeds
  process.exit(0);
});
