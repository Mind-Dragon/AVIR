#!/usr/bin/env node

/**
 * Template Classifier for avir.com — HEI-243
 *
 * Analyzes scraped pages (data/pages/*.html + *.json) and data/site-map.json
 * to identify all distinct layout templates and document their component
 * breakdown (header/nav, hero, content zones, footer).
 *
 * Output:
 *   data/templates.json — template catalog with component breakdown for Phase 2
 */

import * as cheerio from "cheerio";
import {
  readFileSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PAGES_DIR = resolve(ROOT, "data", "pages");
const SITEMAP_PATH = resolve(ROOT, "data", "site-map.json");
const OUTPUT_PATH = resolve(ROOT, "data", "templates.json");

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/** Get unique class names from a set of elements matching a selector. */
function getUniqueClasses($, selector) {
  const classes = [];
  $(selector).each((_, el) => {
    const cls = $(el).attr("class") || "";
    if (cls.trim() && !classes.includes(cls.trim())) {
      classes.push(cls.trim());
    }
  });
  return classes;
}

/* ------------------------------------------------------------------ */
/*  Navigation Analysis                                               */
/* ------------------------------------------------------------------ */

function analyzeNavigation($) {
  const nav = {
    wrapperClass: "",
    navBarClass: "",
    logoClass: "",
    linkClasses: [],
    dropdownClasses: [],
    mobileMenuClasses: [],
    links: [],
  };

  // Main nav wrapper (Webflow pattern: .hero-wrap contains nav)
  const $heroWrap = $(".hero-wrap").first();
  if ($heroWrap.length) {
    nav.wrapperClass = "hero-wrap";
  }

  // Nav bar
  const $nav = $("nav, .nav").first();
  if ($nav.length) {
    nav.navBarClass = ($nav.attr("class") || "").trim();
  }

  // Logo
  const $logo = $(".nav__site-logo, [class*='site-logo']").first();
  if ($logo.length) {
    nav.logoClass = ($logo.attr("class") || "").trim();
  }

  // Desktop nav links (exclude footer links)
  const $desktopLinks = $(".nav-link, .nav__link-wrap a").filter((_, el) => {
    const cls = $(el).attr("class") || "";
    return !cls.includes("is--footer");
  });
  const linkClasses = new Set();
  $desktopLinks.each((_, el) => {
    const cls = $(el).attr("class") || "";
    if (cls.trim()) linkClasses.add(cls.trim());
  });
  nav.linkClasses = [...linkClasses];

  // Dropdown menus
  const $dropdowns = $(".nav__dropdown, [class*='nav__dropdown']");
  const dropdownClasses = new Set();
  $dropdowns.each((_, el) => {
    const cls = $(el).attr("class") || "";
    if (cls.trim()) dropdownClasses.add(cls.trim());
  });
  nav.dropdownClasses = [...dropdownClasses];

  // Mobile menu
  const $mobile = $("[class*='mobile__nav'], [class*='mobile__dd']");
  const mobileClasses = new Set();
  $mobile.each((_, el) => {
    const cls = $(el).attr("class") || "";
    if (cls.trim()) mobileClasses.add(cls.trim());
  });
  nav.mobileMenuClasses = [...mobileClasses];

  // Extract actual nav links
  const $navLinks = $("nav a[href], .nav a[href]");
  const seen = new Set();
  $navLinks.each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, " ");
    const href = $(el).attr("href") || "";
    if (
      text &&
      href &&
      !href.startsWith("#") &&
      !href.startsWith("javascript:") &&
      !seen.has(href)
    ) {
      seen.add(href);
      nav.links.push({ text, href });
    }
  });

  return nav;
}

/* ------------------------------------------------------------------ */
/*  Hero / Title Section Analysis                                     */
/* ------------------------------------------------------------------ */

function analyzeHeroSection($, templateType) {
  const hero = {
    pattern: "",
    classes: [],
    hasVideo: false,
    hasImage: false,
    hasScrollAnimation: false,
    headingClasses: [],
    subheadingClasses: [],
  };

  if (templateType === "home") {
    // Home page has unique full-screen video hero with scroll animation
    const $videoWrap = $(".hero-video__wrapper, [class*='hero-video']");
    const $scrollWrap = $(
      ".home-hero__content-scroll-wrap, [class*='home-hero']"
    );
    hero.pattern = "full-screen-video-hero";
    hero.hasVideo = $videoWrap.length > 0;
    hero.hasScrollAnimation = $scrollWrap.length > 0;
    hero.classes = [
      ...getUniqueClasses($, "[class*='hero-video']"),
      ...getUniqueClasses($, "[class*='home-hero']"),
    ];

    const $heroHeadings = $(
      ".home-hero__content-wrap h1, .home-hero__content-wrap h2, [class*='hero-content__heading']"
    );
    const headingClasses = new Set();
    $heroHeadings.each((_, el) => {
      const cls = $(el).attr("class") || "";
      if (cls.trim()) headingClasses.add(cls.trim());
    });
    hero.headingClasses = [...headingClasses];
  } else if (templateType === "legacy") {
    // Old home page has image-based hero with swish animation
    hero.pattern = "image-hero-with-swish";
    hero.hasImage = true;
    hero.classes = getUniqueClasses($, ".section.hero-top, [class*='hero__swish'], [class*='hero__text-wrap']");
    const $headings = $(".hero__title, [class*='hero__title']");
    const headingClasses = new Set();
    $headings.each((_, el) => {
      const cls = $(el).attr("class") || "";
      if (cls.trim()) headingClasses.add(cls.trim());
    });
    hero.headingClasses = [...headingClasses];
  } else {
    // Most other pages use "section title" pattern
    const $titleSection = $(".section.title, section.title").first();
    if ($titleSection.length) {
      hero.pattern = "title-section";
      hero.classes = [($titleSection.attr("class") || "").trim()];

      // Check for background image in title section
      const $titleBg = $titleSection.find(".title__bg, [class*='title__bg']");
      hero.hasImage = $titleBg.length > 0;
      if ($titleBg.length) {
        const bgClass = ($titleBg.attr("class") || "").trim();
        hero.classes.push(bgClass);
      }

      // Title heading patterns
      const $titleHeadings = $titleSection.find("h1, h2, h3");
      const headingClasses = new Set();
      $titleHeadings.each((_, el) => {
        const cls = $(el).attr("class") || "";
        if (cls.trim()) headingClasses.add(cls.trim());
      });
      hero.headingClasses = [...headingClasses];

      // Right-side content (split layout)
      const $rightCol = $titleSection.find(
        ".col-50.title-right, [class*='title-right']"
      );
      if ($rightCol.length) {
        hero.classes.push("col-50 title-right");
      }
    } else {
      // Contact forms and some pages have no explicit title section
      hero.pattern = "none";
    }
  }

  return hero;
}

/* ------------------------------------------------------------------ */
/*  Content Zone Analysis                                             */
/* ------------------------------------------------------------------ */

function analyzeContentZones($, templateType) {
  const zones = [];

  // Get all section-like elements between hero and footer
  const $sections = $(
    "section, .section, div[class*='section']"
  );

  $sections.each((_, el) => {
    const $section = $(el);
    const cls = ($section.attr("class") || "").trim();
    const id = ($section.attr("id") || "").trim();

    // Skip nav wrapper, footer, and title/hero sections (analyzed separately)
    if (
      cls.includes("footer") ||
      cls.includes("hero-video") ||
      cls.includes("home-hero") ||
      cls === "section title" ||
      cls.includes("hero-top")
    ) {
      return;
    }

    // Determine zone type based on classes and content
    const heading =
      $section.find("h1, h2, h3").first().text().trim().replace(/\s+/g, " ") ||
      "";
    const hasForm = $section.find("form, .w-form").length > 0;
    const hasGallery =
      $section.find(
        ".w-dyn-list, [class*='gallery'], [class*='lightbox']"
      ).length > 0;
    const hasRichText =
      $section.find(".w-richtext, .rich-text-block").length > 0;
    const hasCTA =
      $section.find("[class*='cta'], [class*='button']").length > 0;
    const hasCards =
      $section.find(
        ".w-dyn-item, [class*='card'], [class*='listing']"
      ).length > 0;
    const hasOutlineTitle =
      $section.find("[class*='outline-title'], .section-heading.outline")
        .length > 0 || cls.includes("outline");
    const hasSubNav =
      cls.includes("sub-nav") ||
      $section.find("[class*='sub-nav'], [class*='tab']").length > 0;

    let zoneType = "content";
    if (hasForm) zoneType = "form";
    else if (hasGallery) zoneType = "gallery-grid";
    else if (hasRichText) zoneType = "rich-text";
    else if (hasOutlineTitle) zoneType = "outline-heading";
    else if (hasSubNav) zoneType = "tabbed-content";
    else if (hasCards) zoneType = "card-listing";
    else if (hasCTA) zoneType = "cta";
    else if (cls.includes("meet-the-team")) zoneType = "team-grid";
    else if (cls.includes("process")) zoneType = "process-steps";
    else if (cls.includes("partners")) zoneType = "partner-logos";
    else if (cls.includes("lander")) zoneType = "lander-content";
    else if (cls.includes("vip")) zoneType = "feature-highlight";
    else if (cls.includes("bg-shade")) zoneType = "shaded-section";
    else if (cls.includes("scroller-section")) zoneType = "scroll-animated";

    zones.push({
      class: cls,
      id: id || undefined,
      type: zoneType,
      heading: heading || undefined,
    });
  });

  // Deduplicate zones by class (keep unique patterns)
  const uniqueZones = [];
  const seenClasses = new Set();
  for (const zone of zones) {
    if (!seenClasses.has(zone.class)) {
      seenClasses.add(zone.class);
      uniqueZones.push(zone);
    }
  }

  return uniqueZones;
}

/* ------------------------------------------------------------------ */
/*  Footer Analysis                                                   */
/* ------------------------------------------------------------------ */

function analyzeFooter($) {
  const footer = {
    sectionClass: "",
    ctaBlock: null,
    hasSwish: false,
    containerClass: "",
    navWrapClasses: [],
    linkClass: "",
    copyrightText: "",
    socialLinks: [],
  };

  // Footer section wrapper
  const $footerSection = $(".section.footer, section.footer").first();
  if ($footerSection.length) {
    footer.sectionClass = ($footerSection.attr("class") || "").trim();
  }

  // Footer CTA block ("Engage the experts" / "Exciting Products")
  const $ctaWrap = $(".footer-cta__wrap, [class*='footer-cta']").first();
  if ($ctaWrap.length) {
    const ctaHeading =
      $ctaWrap.find("h2, h3, h4").first().text().trim() || "";
    const ctaText =
      $ctaWrap.find("p, [class*='cta-para']").first().text().trim() || "";
    const ctaButtonText =
      $ctaWrap.find("a, button").first().text().trim() || "";
    footer.ctaBlock = {
      class: ($ctaWrap.attr("class") || "").trim(),
      heading: ctaHeading,
      text: ctaText,
      buttonText: ctaButtonText,
    };
  }

  // Lander-specific CTA (city pages)
  const $landerCta = $(".lander__cta, [class*='lander__cta']").first();
  if ($landerCta.length && !footer.ctaBlock) {
    const landerHeading =
      $landerCta.find("h2, h3, h4").first().text().trim() || "";
    footer.ctaBlock = {
      class: ($landerCta.attr("class") || "").trim(),
      heading: landerHeading,
      isLanderVariant: true,
    };
  }

  // Swish animation element
  footer.hasSwish = $(".footer__swish, [class*='footer__swish']").length > 0;

  // Footer container
  const $container = $(
    ".container.footer__container, [class*='footer__container']"
  ).first();
  if ($container.length) {
    footer.containerClass = ($container.attr("class") || "").trim();
  }

  // Footer nav columns
  const $navWraps = $("[class*='footer__nav-wrap']");
  const navClasses = new Set();
  $navWraps.each((_, el) => {
    const cls = $(el).attr("class") || "";
    if (cls.trim()) navClasses.add(cls.trim());
  });
  footer.navWrapClasses = [...navClasses];

  // Footer link style
  const $footerLink = $(".nav-link.is--footer").first();
  if ($footerLink.length) {
    footer.linkClass = ($footerLink.attr("class") || "").trim();
  }

  // Copyright text
  const $copyright = $(
    "[class*='copyright'], [class*='legal'], .footer__left-wrap"
  ).first();
  if ($copyright.length) {
    const text = $copyright.text().trim().replace(/\s+/g, " ");
    // Extract just the copyright portion
    const match = text.match(/((?:\u00a9|Copyright|All Rights).*)/i);
    footer.copyrightText = match ? match[1].trim() : "";
  }

  // Social links
  const $socialLinks = $(
    "[class*='social'] a, [class*='footer'] a[href*='facebook'], [class*='footer'] a[href*='instagram'], [class*='footer'] a[href*='linkedin'], [class*='footer'] a[href*='twitter'], [class*='footer'] a[href*='youtube']"
  );
  const socialSeen = new Set();
  $socialLinks.each((_, el) => {
    const href = $(el).attr("href") || "";
    if (href && !socialSeen.has(href)) {
      socialSeen.add(href);
      footer.socialLinks.push(href);
    }
  });

  return footer;
}

/* ------------------------------------------------------------------ */
/*  Full Template Analysis (per page)                                 */
/* ------------------------------------------------------------------ */

function analyzeTemplate($, pageJson) {
  const templateType = pageJson.templateType;

  return {
    navigation: analyzeNavigation($),
    hero: analyzeHeroSection($, templateType),
    contentZones: analyzeContentZones($, templateType),
    footer: analyzeFooter($),
  };
}

/* ------------------------------------------------------------------ */
/*  Main                                                              */
/* ------------------------------------------------------------------ */

function main() {
  console.log("=== AVIR Template Classifier (HEI-243) ===\n");

  // Step 0: Load site-map
  if (!existsSync(SITEMAP_PATH)) {
    console.error(
      `ERROR: ${SITEMAP_PATH} not found. Run the page scraper first (HEI-240).`
    );
    process.exit(1);
  }

  const siteMap = JSON.parse(readFileSync(SITEMAP_PATH, "utf-8"));
  console.log(`Loaded site-map with ${siteMap.metadata.totalPages} pages\n`);

  // Step 1: Group pages by template type
  const pagesByType = {};
  for (const page of siteMap.pages) {
    const type = page.templateType;
    if (!pagesByType[type]) pagesByType[type] = [];
    pagesByType[type].push(page);
  }

  console.log(
    `Found ${Object.keys(pagesByType).length} template types: ${Object.keys(pagesByType).join(", ")}\n`
  );

  // Step 2: For each template type, analyze a representative page in detail
  const templates = {};

  for (const [type, pages] of Object.entries(pagesByType)) {
    console.log(
      `Analyzing template: ${type} (${pages.length} page${pages.length > 1 ? "s" : ""})`
    );

    // Pick the representative page (first one, or the main/index page if available)
    const representative = pages[0];
    const slug = representative.slug;

    const htmlPath = resolve(PAGES_DIR, `${slug}.html`);
    const jsonPath = resolve(PAGES_DIR, `${slug}.json`);

    if (!existsSync(htmlPath) || !existsSync(jsonPath)) {
      console.warn(
        `  WARNING: Missing files for ${slug}, skipping detailed analysis`
      );
      templates[type] = {
        name: type,
        pageCount: pages.length,
        representativePage: representative.url,
        pages: pages.map((p) => ({ url: p.url, slug: p.slug, title: p.title })),
        components: null,
      };
      continue;
    }

    const html = readFileSync(htmlPath, "utf-8");
    const pageJson = JSON.parse(readFileSync(jsonPath, "utf-8"));
    const $ = cheerio.load(html);

    // Analyze the template layout
    const analysis = analyzeTemplate($, pageJson);

    // If there are multiple pages of this type, also check a second one
    // to detect variation within the type
    let hasVariations = false;
    let variationNotes = [];

    if (pages.length > 1) {
      const secondSlug = pages[1].slug;
      const secondHtmlPath = resolve(PAGES_DIR, `${secondSlug}.html`);
      if (existsSync(secondHtmlPath)) {
        const secondHtml = readFileSync(secondHtmlPath, "utf-8");
        const $second = cheerio.load(secondHtml);
        const secondZones = analyzeContentZones($second, type);
        const firstZoneTypes = analysis.contentZones
          .map((z) => z.type)
          .sort()
          .join(",");
        const secondZoneTypes = secondZones
          .map((z) => z.type)
          .sort()
          .join(",");
        if (firstZoneTypes !== secondZoneTypes) {
          hasVariations = true;
          variationNotes.push(
            `Content zone layout differs between pages (e.g., ${representative.slug} vs ${secondSlug})`
          );
        }
      }
    }

    // Check for sub-types within the template category
    let subTypes = [];
    if (type === "careers") {
      subTypes = [
        { name: "careers-index", description: "Main careers listing page", slugPattern: "careers" },
        { name: "careers-detail", description: "Individual job posting", slugPattern: "careers--*" },
      ];
    } else if (type === "contact") {
      subTypes = [
        { name: "contact-hub", description: "Main contact page with links to all forms", slugPattern: "contact" },
        { name: "contact-form", description: "Individual form page (residential, commercial, service)", slugPattern: "*-form, service-request" },
      ];
    } else if (type === "gallery") {
      const hasPortfolio = pages.some((p) => p.slug === "portfolio");
      if (hasPortfolio) {
        subTypes = [
          { name: "portfolio-index", description: "Main portfolio page with category grid", slugPattern: "portfolio" },
          { name: "gallery-category", description: "Category-specific gallery page", slugPattern: "galleries--*" },
        ];
      }
    }

    templates[type] = {
      name: type,
      description: getTemplateDescription(type),
      pageCount: pages.length,
      representativePage: representative.url,
      pages: pages.map((p) => ({ url: p.url, slug: p.slug, title: p.title })),
      subTypes: subTypes.length > 0 ? subTypes : undefined,
      hasVariations,
      variationNotes: variationNotes.length > 0 ? variationNotes : undefined,
      components: {
        navigation: {
          pattern: "shared-global-nav",
          description:
            "Fixed top navigation bar shared across all pages. Includes logo, desktop links, dropdown menus (Portfolio > gallery sub-pages), and hamburger mobile menu.",
          wrapper: analysis.navigation.wrapperClass || "hero-wrap",
          navBar: analysis.navigation.navBarClass,
          logo: analysis.navigation.logoClass,
          desktopLinkClasses: analysis.navigation.linkClasses,
          dropdownClasses: analysis.navigation.dropdownClasses,
          mobileMenuClasses: analysis.navigation.mobileMenuClasses,
          links: analysis.navigation.links,
        },
        hero: {
          pattern: analysis.hero.pattern,
          description: getHeroDescription(type, analysis.hero),
          classes: analysis.hero.classes,
          hasVideo: analysis.hero.hasVideo || undefined,
          hasImage: analysis.hero.hasImage || undefined,
          hasScrollAnimation: analysis.hero.hasScrollAnimation || undefined,
          headingClasses:
            analysis.hero.headingClasses.length > 0
              ? analysis.hero.headingClasses
              : undefined,
        },
        contentZones: analysis.contentZones,
        footer: {
          pattern: "shared-global-footer",
          description:
            "Shared footer across all pages. Includes CTA block, decorative swish, multi-column nav links, contact info, and social links.",
          sectionClass: analysis.footer.sectionClass,
          ctaBlock: analysis.footer.ctaBlock,
          hasSwish: analysis.footer.hasSwish,
          containerClass: analysis.footer.containerClass,
          navWrapClasses: analysis.footer.navWrapClasses,
          linkClass: analysis.footer.linkClass,
          copyrightText: analysis.footer.copyrightText || undefined,
          socialLinks:
            analysis.footer.socialLinks.length > 0
              ? analysis.footer.socialLinks
              : undefined,
        },
      },
    };
  }

  // Step 3: Build shared components summary
  const sharedComponents = {
    navigation: {
      description:
        "Global navigation bar present on all pages. Built on Webflow's w-nav pattern.",
      wrapper: "hero-wrap",
      navBar: "nav",
      logo: "nav__site-logo w-inline-block",
      desktopLinks: "nav-link, nav__link-wrap",
      dropdowns: "nav__dropdown w-dropdown",
      mobileMenu: "mobile__nav w-dropdown, mobile__dd w-dropdown-list",
      links: templates[Object.keys(templates)[0]]?.components?.navigation
        ?.links || [],
    },
    footerCTA: {
      description:
        'CTA section above footer. Standard version shows "Engage the experts" heading with "Exciting Products" sub-section. City/lander pages use a scheduling variant.',
      standardClass: "footer-cta__wrap",
      landerClass: "lander__cta",
    },
    footer: {
      description:
        "Global footer with decorative swish element, multi-column navigation, contact info, social links, and copyright.",
      sectionClass: "section footer",
      swish: "footer__swish",
      container: "container footer__container",
      navColumns: [
        "footer__nav-wrap",
        "footer__nav-wrap last",
      ],
      linkClass: "nav-link is--footer",
    },
  };

  // Step 4: Write output
  const output = {
    metadata: {
      generatedAt: new Date().toISOString(),
      sourceFile: "data/site-map.json",
      totalPages: siteMap.metadata.totalPages,
      totalTemplates: Object.keys(templates).length,
      typeBreakdown: siteMap.metadata.typeBreakdown,
    },
    sharedComponents,
    templates,
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n");

  // Step 5: Summary
  console.log(`\n=== Classification complete ===`);
  console.log(`Templates identified: ${Object.keys(templates).length}`);
  console.log(`Output: ${OUTPUT_PATH}`);
  console.log(`\nTemplate breakdown:`);
  for (const [type, tmpl] of Object.entries(templates).sort(
    (a, b) => b[1].pageCount - a[1].pageCount
  )) {
    const subs = tmpl.subTypes
      ? ` (sub-types: ${tmpl.subTypes.map((s) => s.name).join(", ")})`
      : "";
    console.log(`  ${type}: ${tmpl.pageCount} pages${subs}`);
  }
}

/* ------------------------------------------------------------------ */
/*  Template Descriptions                                             */
/* ------------------------------------------------------------------ */

function getTemplateDescription(type) {
  const descriptions = {
    home: "Homepage with full-screen video hero, scroll-animated service showcases (Automation, Sound & Vision, Shading, Lighting), process overview, and partner logos.",
    about:
      "About page with title/hero section, company story, team member grid, process overview, partner logos, and CTA.",
    "blog-index":
      "Blog listing page with title section and dynamic collection list of blog post cards with thumbnails, dates, and excerpts.",
    "blog-post":
      "Individual blog post with title section (background image), rich text article body, and related posts.",
    brands:
      "Brand partnerships page with title section and logo grid / brand listing of partner companies.",
    careers:
      "Careers section with two sub-types: index page listing open positions, and individual job detail pages with description and application form.",
    city: "City/location landing pages (25 cities in Coachella Valley). SEO-focused with city name title, service description, city list grid, and scheduling CTA.",
    contact:
      "Contact section with hub page linking to specific forms, plus individual form pages for residential, commercial, and service requests.",
    gallery:
      "Portfolio/gallery section with main portfolio index showing category grid, plus individual category galleries (Commercial, Home Cinema, Lifestyle) with lightbox image grids.",
    product:
      "Product showcase page with title section and featured product cards/details (e.g., Sony CLED Video Wall).",
    process:
      "Process page detailing residential, commercial, and partner workflows with tabbed/hidden sections for each track.",
    services:
      "Services page with sub-navigation tabs for service categories (Home Cinema, Multi-Room Audio, etc.), service detail listings, VIP treatment section.",
    legacy:
      "Legacy/old homepage design with image-based hero, swish animation. Can be excluded from migration.",
  };
  return descriptions[type] || `${type} template`;
}

function getHeroDescription(type, hero) {
  const descriptions = {
    "full-screen-video-hero":
      "Full-screen background video with overlaid scroll-animated content panels showcasing service categories (Automation, Sound & Vision, Shading, Lighting).",
    "image-hero-with-swish":
      "Image-based hero with decorative swish SVG overlay and text wrap. Legacy design pattern.",
    "title-section":
      "Split-layout title section with left-aligned heading and right-side background image or decorative element.",
    none: "No dedicated hero section. Content begins immediately after navigation.",
  };
  return descriptions[hero.pattern] || `${hero.pattern} hero pattern`;
}

main();
