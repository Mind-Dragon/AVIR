"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** Navigation link data from templates.json sharedComponents.navigation */
const NAV_LINKS = [
  { text: "Home", href: "/" },
  { text: "Services", href: "/services" },
  { text: "Brands", href: "/brands" },
  { text: "Portfolio", href: "/portfolio" },
  { text: "About", href: "/about-avir" },
] as const;

/** Dropdown: "Exciting Products" — single link, no sub-items in top nav per avir.com */
const EXCITING_LINK = { text: "Exciting Products", href: "/exciting-new-products" } as const;

/** Contact link — single link per avir.com (Blog & Careers stay in footer only) */
const CONTACT_LINK = { text: "Contact", href: "/contact" } as const;

/** All mobile links in order — matches avir.com top-level nav */
const MOBILE_LINKS = [
  { text: "Home", href: "/" },
  { text: "Services", href: "/services" },
  { text: "Brands", href: "/brands" },
  { text: "Portfolio", href: "/portfolio" },
  { text: "About", href: "/about-avir" },
  { text: "Exciting Products", href: "/exciting-new-products" },
  { text: "Contact", href: "/contact" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="nav" data-wf-class="nav">
      {/* Logo */}
      <Link
        href="/"
        className="nav__site-logo"
        data-wf-class="nav__site-logo w-inline-block"
        aria-label="AVIR Home"
      >
        <Image
          src="/assets/cdn.prod.website-files.com/61aeaa63fc373a25c198ab33/6375d62b597feaaa92009bc5_AVIR logo website Final.svg"
          alt="AVIR"
          width={100}
          height={22}
          className="nav__site-logo-inner"
          data-wf-class="nav__site-logo-inner"
          priority
        />
      </Link>

      {/* Mobile hamburger */}
      <div className="mobile__nav" data-wf-class="mobile__nav w-dropdown">
        <button
          className="mobile__nav-toggle"
          data-wf-class="mobile__nav-toggle w-dropdown-toggle"
          onClick={toggleMobile}
          aria-expanded={mobileOpen}
          aria-label="Toggle mobile menu"
          type="button"
        >
          <span
            className="mobile__nav-icon"
            data-wf-class="mobile__nav-icon w-icon-dropdown-toggle"
            aria-hidden="true"
          >
            ▾
          </span>
          <span>Menu</span>
        </button>
        <nav
          className={`mobile__dd${mobileOpen ? " is--open" : ""}`}
          data-wf-class="mobile__dd w-dropdown-list"
        >
          {MOBILE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link-mobile${isActive(pathname, link.href) ? " is--active" : ""}`}
              data-wf-class="nav-link-mobile w-dropdown-link"
              onClick={() => setMobileOpen(false)}
            >
              {link.text}
            </Link>
          ))}
        </nav>
      </div>

      {/* Desktop navigation links */}
      <div className="nav__link-wrap" data-wf-class="nav__link-wrap">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link${isActive(pathname, link.href) ? " is--active" : ""}`}
            data-wf-class="nav-link"
          >
            {link.text}
          </Link>
        ))}

        {/* Exciting Products — flat link per avir.com */}
        <Link
          href={EXCITING_LINK.href}
          className={`nav-link${isActive(pathname, EXCITING_LINK.href) ? " is--active" : ""}`}
          data-wf-class="nav-link"
        >
          {EXCITING_LINK.text}
        </Link>

        {/* Contact — flat link per avir.com */}
        <Link
          href={CONTACT_LINK.href}
          className={`nav-link${isActive(pathname, CONTACT_LINK.href) ? " is--active" : ""}`}
          data-wf-class="nav-link"
        >
          {CONTACT_LINK.text}
        </Link>
      </div>
    </div>
  );
}
