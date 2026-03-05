import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Residential Form | AVIR",
  description:
    "Are you planning a home remodel or currently building your new home? Fill out the form and we will call you back at your convenience.",
  alternates: { canonical: canonicalUrl("/residential-form") },
  openGraph: {
    title: "Residential Form | AVIR",
    description:
      "Are you planning a home remodel or currently building your new home? Fill out the form and we will call you back at your convenience.",
    url: canonicalUrl("/residential-form"),
  },
};

export default function ResidentialFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
