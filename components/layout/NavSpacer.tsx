"use client";

import { usePathname } from "next/navigation";

/** Spacer for the fixed nav — hidden on homepage where the hero sits behind the nav */
export default function NavSpacer() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <div className="pt-[97px] max-md:pt-[60px]" />;
}
