import assetMapData from "@/data/asset-map.json";

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

const assetMap = assetMapData as unknown as AssetMap;

/** Lookup table: CDN URL → local path (prefixed with /) */
const urlToLocal: Record<string, string> = {};
for (const asset of assetMap.assets) {
  // localPath is "public/assets/..." — strip "public" so Next.js serves from /assets/
  // Percent-encode each path segment to handle spaces and special characters
  urlToLocal[asset.originalUrl] = "/" + asset.localPath.replace(/^public\//, "").split("/").map(segment => encodeURIComponent(segment)).join("/");
}

/**
 * Resolve a CDN asset URL to its local path in /public/assets/.
 * Returns the original URL if no local mapping exists.
 */
export function resolveAsset(cdnUrl: string): string {
  if (!cdnUrl) return "";
  return urlToLocal[cdnUrl] ?? cdnUrl;
}

/**
 * Get dimensions for a mapped asset, if available.
 */
export function getAssetDimensions(
  cdnUrl: string
): { width: number; height: number } | null {
  const entry = assetMap.assets.find((a) => a.originalUrl === cdnUrl);
  if (entry && entry.width > 0 && entry.height > 0) {
    return { width: entry.width, height: entry.height };
  }
  return null;
}
