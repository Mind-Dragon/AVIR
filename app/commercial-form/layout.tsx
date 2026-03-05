import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Commercial Form | AVIR",
  description:
    "Planning an upcoming commercial project? Fill out the form below and we will contact you at your convenience.",
  alternates: { canonical: canonicalUrl("/commercial-form") },
  openGraph: {
    title: "Commercial Form | AVIR",
    description:
      "Planning an upcoming commercial project? Fill out the form below and we will contact you at your convenience.",
    url: canonicalUrl("/commercial-form"),
  },
};

export default function CommercialFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
