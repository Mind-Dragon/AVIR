import fs from "fs";
import path from "path";

interface AssetEntry {
  originalUrl: string;
  localPath: string;
  type: string;
  format: string;
  fileSize: number;
  width: number;
  height: number;
  referencedBy: string[];
}

interface AssetMap {
  metadata: {
    generatedAt: string;
    totalAssets: number;
    totalDownloaded: number;
    totalFailed: number;
    pagesProcessed: number;
    breakdown: Record<string, number>;
  };
  assets: AssetEntry[];
  failed: unknown[];
}

// Use fs.readFileSync instead of static import to prevent webpack from
// bundling the 1MB asset-map.json into the Lambda — reads at runtime instead.
let _assetMap: AssetMap | null = null;
function getAssetMap(): AssetMap {
  if (_assetMap) return _assetMap;
  const filePath = path.join(process.cwd(), "data", "asset-map.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  _assetMap = JSON.parse(raw) as AssetMap;
  return _assetMap;
}

/** Lookup table: CDN URL → local path (prefixed with /) */
let _urlToLocal: Record<string, string> | null = null;
function getUrlToLocal(): Record<string, string> {
  if (_urlToLocal) return _urlToLocal;
  const assetMap = getAssetMap();
  _urlToLocal = {};
  for (const asset of assetMap.assets) {
    // localPath is "public/assets/..." — strip "public" so Next.js serves from /assets/
    // Percent-encode each path segment to handle spaces and special characters
    _urlToLocal[asset.originalUrl] =
      "/" +
      asset.localPath
        .replace(/^\/public\//, "")
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");
  }
  return _urlToLocal;
}

/**
 * Resolve a CDN asset URL to its local path in /public/assets/.
 * Returns the original URL if no local mapping exists.
 */
export function resolveAsset(cdnUrl: string): string {
  if (!cdnUrl) return "";
  return getUrlToLocal()[cdnUrl] ?? cdnUrl;
}

/**
 * Get dimensions for a mapped asset, if available.
 */
export function getAssetDimensions(
  cdnUrl: string
): { width: number; height: number } | null {
  const assetMap = getAssetMap();
  const entry = assetMap.assets.find((a) => a.originalUrl === cdnUrl);
  if (entry && entry.width > 0 && entry.height > 0) {
    return { width: entry.width, height: entry.height };
  }
  return null;
}
