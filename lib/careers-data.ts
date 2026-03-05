import { readFileSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data", "pages");

export interface CareerPosition {
  title: string;
  slug: string;
  description: string;
  url: string;
}

export interface CareersIndexData {
  title: string;
  metaDescription: string;
  subtitle: string;
  bodyDescription: string;
  emailContact: string;
  imageAlt: string;
  imageSrc: string;
  positions: CareerPosition[];
}

export interface CareerDetailData {
  title: string;
  slug: string;
  metaDescription: string;
  jobDescription: string;
  applyHeading: string;
  applyText: string;
}

function readPageJson(filename: string): Record<string, unknown> {
  const raw = readFileSync(join(DATA_DIR, filename), "utf-8");
  return JSON.parse(raw) as Record<string, unknown>;
}

export function getCareersIndexData(): CareersIndexData {
  const data = readPageJson("careers.json");

  const contentSections = data.contentSections as Array<{
    identifier: string;
    heading: string;
    preview: string;
  }>;


  // Load the two detail pages to get position data
  const positions: CareerPosition[] = [];

  for (const file of [
    "careers--assistant-technician.json",
    "careers--integration-technician.json",
  ]) {
    const detail = readPageJson(file);
    const detailSections = detail.contentSections as Array<{
      identifier: string;
      heading: string;
      preview: string;
    }>;
    const detailTitle =
      detailSections.find((s) => s.identifier === "section title")?.heading ||
      "";
    const detailDesc =
      detailSections.find((s) => s.identifier === "section" && !s.heading)
        ?.preview || "";
    const rawSlug = detail.slug as string; // e.g. "careers--assistant-technician"
    const slug = rawSlug.replace("careers--", "");

    positions.push({
      title: detailTitle,
      slug,
      description:
        detailDesc.length > 150
          ? detailDesc.substring(0, 150).trim() + "..."
          : detailDesc,
      url: `/careers/${slug}`,
    });
  }

  // Use the short description from the index page's Open Positions section for each position
  const openPositionsSection = contentSections.find(
    (s) => s.identifier === "section" && s.heading === "Open Positions"
  );

  if (openPositionsSection) {
    // Parse position descriptions from the preview text
    const preview = openPositionsSection.preview;
    for (const pos of positions) {
      const titleIdx = preview.indexOf(pos.title);
      if (titleIdx >= 0) {
        const afterTitle = preview.substring(titleIdx + pos.title.length);
        const nextTitle = positions.find(
          (p) => p.title !== pos.title && afterTitle.indexOf(p.title) >= 0
        );
        const endIdx = nextTitle
          ? afterTitle.indexOf(nextTitle.title)
          : afterTitle.indexOf("More Information");
        if (endIdx > 0) {
          const desc = afterTitle
            .substring(0, endIdx)
            .replace("More Information", "")
            .trim();
          if (desc) {
            pos.description = desc;
          }
        }
      }
    }
  }

  return {
    title: data.title as string,
    metaDescription: data.metaDescription as string,
    subtitle:
      "Are you a team player? Do you love new technology? If so, we'd like to meet you!\nSubmit your resume below.",
    bodyDescription:
      "Whether you're just getting started in the field, moving from another industry, or are the best at what you do, apply and see if you have what it takes to join the AVIR team.\n\nInterested in an unlisted position at AVIR? Let us know.",
    emailContact: "careers@avir.com",
    imageAlt:
      "Someone from AVIR drawing out an interior design plan for a new installation.",
    imageSrc:
      "/assets/cdn.prod.website-files.com/61aeaa63fc373a25c198ab33/627aabcf9bd322c34ba5291b_Careers shutterstock writing 250510.jpg",
    positions,
  };
}

const VALID_SLUGS = ["assistant-technician", "integration-technician"] as const;
export type CareerSlug = (typeof VALID_SLUGS)[number];

export function isValidCareerSlug(slug: string): slug is CareerSlug {
  return (VALID_SLUGS as readonly string[]).includes(slug);
}

export function getCareerDetailData(slug: CareerSlug): CareerDetailData {
  const data = readPageJson(`careers--${slug}.json`);

  const contentSections = data.contentSections as Array<{
    identifier: string;
    heading: string;
    preview: string;
  }>;

  const titleSection = contentSections.find(
    (s) => s.identifier === "section title"
  );
  const descSection = contentSections.find(
    (s) => s.identifier === "section" && !s.heading
  );
  const bodyText = data.bodyText as string;

  // Extract the full job description from bodyText
  // It's between the title and "Apply" section
  const title = titleSection?.heading || "";
  let jobDescription = descSection?.preview || "";

  // Get the full description from bodyText
  // Use lastIndexOf to skip the modal header "Apply for <title>" which appears first
  const titleIdx = bodyText.lastIndexOf(title);
  if (titleIdx >= 0) {
    const afterTitle = bodyText.substring(titleIdx + title.length);
    const applyIdx = afterTitle.indexOf("ApplyApply");
    if (applyIdx > 0) {
      jobDescription = afterTitle.substring(0, applyIdx).trim();
    }
  }

  return {
    title,
    slug,
    metaDescription: (data.metaDescription as string) || `${title} - AVIR Careers`,
    jobDescription,
    applyHeading: "Apply",
    applyText: "Apply online for this position now.",
  };
}

export function getAllCareerSlugs(): CareerSlug[] {
  return [...VALID_SLUGS];
}
