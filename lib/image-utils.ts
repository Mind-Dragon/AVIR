/**
 * Check whether a URL points to an SVG file.
 *
 * Next.js `Image` cannot optimise remote SVGs served via `/_next/image`,
 * so callers should fall back to a native `<img>` for these sources.
 */
export function isSvg(src: string): boolean {
  try {
    const pathname = new URL(src, "https://placeholder.invalid").pathname;
    return pathname.toLowerCase().endsWith(".svg");
  } catch {
    return src.toLowerCase().endsWith(".svg");
  }
}
