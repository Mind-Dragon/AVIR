import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Service Request | AVIR",
  description:
    "Are you an existing client and need one of our technicians to stop by your home or business? Fill out the form to schedule a visit.",
  alternates: { canonical: canonicalUrl("/service-request") },
  openGraph: {
    title: "Service Request | AVIR",
    description:
      "Are you an existing client and need one of our technicians to stop by your home or business? Fill out the form to schedule a visit.",
    url: canonicalUrl("/service-request"),
  },
};

export default function ServiceRequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
