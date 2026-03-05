import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";
import assetMapData from "@/data/asset-map.json";

/* ------------------------------------------------------------------ */
/*  Asset-map lookup                                                   */
/* ------------------------------------------------------------------ */

interface AssetEntry {
  originalUrl: string;
  localPath: string;
}

const urlToLocal: Record<string, string> = {};
for (const asset of (assetMapData as unknown as { assets: AssetEntry[] }).assets) {
  // localPath is "public/assets/..." — strip "public" so Next.js serves from /assets/
  // Percent-encode each path segment to handle spaces and special characters
  urlToLocal[asset.originalUrl] = "/" + asset.localPath.replace(/^public\//, "").split("/").map(segment => encodeURIComponent(segment)).join("/");
}

/**
 * Resolve CDN URL → local /public/assets/ path.
 * On Vercel the assets are not downloaded (prebuild skips), so fall back to
 * the original CDN URL which next/image can serve via remotePatterns.
 */
export function resolveAsset(cdnUrl: string): string {
  if (!cdnUrl) return "";
  if (process.env.VERCEL) return cdnUrl;
  return urlToLocal[cdnUrl] ?? cdnUrl;
}

/* ------------------------------------------------------------------ */
/*  HTML loading helpers                                               */
/* ------------------------------------------------------------------ */

function loadPageHtml(slug: string): cheerio.CheerioAPI {
  const htmlPath = path.join(process.cwd(), "data", "pages", `${slug}.html`);
  const html = fs.readFileSync(htmlPath, "utf-8");
  return cheerio.load(html);
}

/* ------------------------------------------------------------------ */
/*  Services page data                                                 */
/* ------------------------------------------------------------------ */

export interface ServiceItem {
  name: string;
  description: string;
  image: string;
  slug: string;
}

export interface VipItem {
  name: string;
  description: string;
}

export interface ServicesPageData {
  title: string;
  subtitle: string;
  services: ServiceItem[];
  vipItems: VipItem[];
}

export function getServicesData(): ServicesPageData {
  const $ = loadPageHtml("services");

  const title = $(".section.title .page-title").text().trim();
  const subtitle = $(".section.title p").first().text().trim();

  const services: ServiceItem[] = [];
  $(".w-dyn-list")
    .first()
    .find("[role=listitem]")
    .each((_i, el) => {
      const name = $(el).find("h3").text().trim();
      const description = $(el).find("p").text().trim();
      const img = $(el).find("img").first().attr("src") || "";
      const slug = name.toLowerCase().replace(/\s+/g, "-");
      services.push({ name, description, image: resolveAsset(img), slug });
    });

  const vipItems: VipItem[] = [];
  $("h3").each((_i, el) => {
    const parentClass = $(el).parent().attr("class") || "";
    if (parentClass.includes("col-60 is--vertical-middle")) {
      vipItems.push({
        name: $(el).text().trim(),
        description: $(el).parent().find("p").text().trim(),
      });
    }
  });

  return { title, subtitle, services, vipItems };
}

/* ------------------------------------------------------------------ */
/*  Brands page data                                                   */
/* ------------------------------------------------------------------ */

export interface BrandItem {
  productImg: string;
  logoImg: string;
  link: string;
}

export interface BrandsPageData {
  title: string;
  subtitle: string;
  brands: BrandItem[];
}

export function getBrandsData(): BrandsPageData {
  const $ = loadPageHtml("brands");

  const title = $(".section.title .page-title").text().trim();
  const subtitle = $(".section.title p").first().text().trim();

  const brands: BrandItem[] = [];
  $(".partner__item").each((_i, el) => {
    const allImgs: string[] = [];
    $(el)
      .find("img")
      .each((_j, img) => {
        allImgs.push($(img).attr("src") || "");
      });
    const link =
      $(el).find("a[target=_blank]").attr("href") || "";
    brands.push({
      productImg: resolveAsset(allImgs[0] || ""),
      logoImg: resolveAsset(allImgs[1] || ""),
      link,
    });
  });

  return { title, subtitle, brands };
}

/* ------------------------------------------------------------------ */
/*  About page data                                                    */
/* ------------------------------------------------------------------ */

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

export interface AboutImage {
  src: string;
  alt: string;
}

export interface PartnerSection {
  name: string;
  description: string;
  image: AboutImage | null;
}

export interface AboutPageData {
  title: string;
  subtitle: string;
  storyParagraphs: string[];
  storyImage: AboutImage | null;
  ethosText: string;
  teamMembers: TeamMember[];
  processSections: ProcessSection[];
  partnerSections: PartnerSection[];
}

export function getAboutData(): AboutPageData {
  const $ = loadPageHtml("about-avir");

  const title = $(".section.title .page-title").text().trim();
  const subtitle = $(".section.title p").first().text().trim();

  // Our Story section - extract paragraphs
  const storySection = $("h2")
    .filter((_i, el) => $(el).text().trim() === "Our Story")
    .first()
    .parent();
  const storyParagraphs: string[] = [];
  storySection.find("p").each((_i, el) => {
    const text = $(el).text().trim();
    if (text) storyParagraphs.push(text);
  });

  // Ethos
  const ethosSection = $("h2")
    .filter((_i, el) => $(el).text().trim() === "Our Ethos")
    .first()
    .parent();
  const ethosText = ethosSection.find("p").first().text().trim();

  // Team members
  const teamMembers: TeamMember[] = [];
  $(".team__item").each((_i, el) => {
    const name = $(el).find("h3").text().trim();
    let role = "";
    $(el)
      .children()
      .each((_j, child) => {
        const tag = $(child).prop("tagName");
        if (
          tag === "DIV" &&
          !$(child).find("h3").length &&
          !$(child).find("p").length
        ) {
          role = $(child).text().trim();
        }
      });
    const bio = $(el).find("p").last().text().trim();
    teamMembers.push({ name, role, bio });
  });

  // Our Story hero image (full-bleed photo)
  const storyImg = $(".image-rounded.full-height").first();
  const storyImage: AboutImage | null = storyImg.length
    ? { src: resolveAsset(storyImg.attr("src") || ""), alt: storyImg.attr("alt") || "" }
    : null;

  // Process sections and partner types from the about page
  const processSections: ProcessSection[] = [];
  const partnerSections: PartnerSection[] = [];

  $("h3").each((_i, el) => {
    const text = $(el).text().trim();
    if (text === "For Residences" || text === "For Commercial Projects") {
      const colWrapper = $(el).closest(".col-wrapper");
      const processImg = colWrapper.find("img.process__image").first();
      const processImage: AboutImage | null = processImg.length
        ? { src: resolveAsset(processImg.attr("src") || ""), alt: processImg.attr("alt") || "" }
        : null;
      const parentDiv = $(el).parent();
      processSections.push({
        name: text,
        description: parentDiv.find("p").text().trim(),
        image: processImage,
      });
    }
    if (
      text === "Interior Designers" ||
      text === "Architects" ||
      text === "Builders"
    ) {
      // Walk up to the .col-wrapper.partners row and find the image
      const colWrapper = $(el).closest(".col-wrapper");
      const img = colWrapper.find("img.partner__image").first();
      const partnerImage: AboutImage | null = img.length
        ? { src: resolveAsset(img.attr("src") || ""), alt: img.attr("alt") || "" }
        : null;
      const parentDiv = $(el).parent();
      partnerSections.push({
        name: text,
        description: parentDiv.find("p").text().trim(),
        image: partnerImage,
      });
    }
  });

  return { title, subtitle, storyParagraphs, storyImage, ethosText, teamMembers, processSections, partnerSections };
}

/* ------------------------------------------------------------------ */
/*  Processes page data                                                */
/* ------------------------------------------------------------------ */

export interface ProcessSection {
  name: string;
  description: string;
  image?: AboutImage | null;
}

export interface PartnerType {
  name: string;
  description: string;
}

export interface ProcessesPageData {
  title: string;
  subtitle: string;
  processSections: ProcessSection[];
  partnerTypes: PartnerType[];
}

export function getProcessesData(): ProcessesPageData {
  const $ = loadPageHtml("processes");

  const title = $(".section.title .page-title").text().trim();
  const subtitle = $(".section.title p").first().text().trim();

  const processSections: ProcessSection[] = [];
  const partnerTypes: PartnerType[] = [];

  $("h3").each((_i, el) => {
    const text = $(el).text().trim();
    if (text === "For Residences" || text === "For Commercial Projects") {
      const parentDiv = $(el).parent();
      processSections.push({
        name: text,
        description: parentDiv.find("p").text().trim(),
      });
    }
    if (
      text === "Interior Designers" ||
      text === "Architects" ||
      text === "Builders"
    ) {
      const parentDiv = $(el).parent();
      partnerTypes.push({
        name: text,
        description: parentDiv.find("p").text().trim(),
      });
    }
  });

  return { title, subtitle, processSections, partnerTypes };
}

/* ------------------------------------------------------------------ */
/*  Exciting Products page data                                        */
/* ------------------------------------------------------------------ */

export interface ProductItem {
  title: string;
  description: string;
  logoImg: string;
  productImg: string;
}

export interface ExcitingProductsPageData {
  title: string;
  subtitle: string;
  products: ProductItem[];
}

export function getExcitingProductsData(): ExcitingProductsPageData {
  const $ = loadPageHtml("exciting-new-products");

  const title = $(".section.title .page-title").text().trim();
  const subtitle = $(".section.title p").first().text().trim();

  const products: ProductItem[] = [];
  $(".exciting__item").each((_i, el) => {
    const itemTitle = $(el).find("h3").first().text().trim();
    const description = $(el).find("p").first().text().trim();
    const allImgs: string[] = [];
    $(el)
      .find("img")
      .each((_j, img) => {
        allImgs.push($(img).attr("src") || "");
      });
    // First img = logo SVG, second = product photo
    products.push({
      title: itemTitle,
      description,
      logoImg: resolveAsset(allImgs[0] || ""),
      productImg: resolveAsset(allImgs[1] || ""),
    });
  });

  return { title, subtitle, products };
}
