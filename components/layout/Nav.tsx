"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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

/** Dropdown: "Exciting Products" group */
const EXCITING_DROPDOWN = {
  label: "Exciting Products",
  items: [
    { text: "Exciting Products", href: "/exciting-new-products", position: "first" as const },
    { text: "Blog", href: "/blog", position: "last" as const },
  ],
};

/** Dropdown: "Contact" group */
const CONTACT_DROPDOWN = {
  label: "Contact",
  items: [
    { text: "Contact Us", href: "/contact", position: "first" as const },
    { text: "Careers", href: "/careers", position: "last" as const },
  ],
};

/** All mobile links in order */
const MOBILE_LINKS = [
  { text: "Home", href: "/" },
  { text: "Services", href: "/services" },
  { text: "Brands", href: "/brands" },
  { text: "Portfolio", href: "/portfolio" },
  { text: "About", href: "/about-avir" },
  { text: "Exciting Products", href: "/exciting-new-products" },
  { text: "Blog", href: "/blog" },
  { text: "Careers", href: "/careers" },
  { text: "Contact", href: "/contact" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function isDropdownActive(
  pathname: string,
  items: ReadonlyArray<{ href: string }>
): boolean {
  return items.some((item) => isActive(pathname, item.href));
}

interface NavDropdownProps {
  label: string;
  items: ReadonlyArray<{
    text: string;
    href: string;
    position: "first" | "last";
  }>;
  pathname: string;
}

function NavDropdown({ label, items, pathname }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const dropdownActive = isDropdownActive(pathname, items);

  return (
    <div
      ref={dropdownRef}
      className="nav__dropdown"
      data-wf-class="nav__dropdown w-dropdown"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`nav-link is--dropdown${dropdownActive ? " is--active" : ""}`}
        data-wf-class="nav-link is--dropdown w-dropdown-toggle"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
        aria-expanded={open}
      >
        <span className="dd-icon" aria-hidden="true" />
        <span className="nav-link__text">{label}</span>
      </button>
      <nav
        className={`nav__dropdown-list${open ? " is--open" : ""}`}
        data-wf-class="nav__dropdown-list w-dropdown-list"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link in-dropdown ${item.position}${isActive(pathname, item.href) ? " is--active" : ""}`}
            data-wf-class={`nav-link in-dropdown ${item.position} w-dropdown-link`}
            onClick={() => setOpen(false)}
          >
            {item.text}
          </Link>
        ))}
      </nav>
    </div>
  );
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

        {/* Exciting Products dropdown */}
        <NavDropdown
          label={EXCITING_DROPDOWN.label}
          items={EXCITING_DROPDOWN.items}
          pathname={pathname}
        />

        {/* Contact dropdown */}
        <NavDropdown
          label={CONTACT_DROPDOWN.label}
          items={CONTACT_DROPDOWN.items}
          pathname={pathname}
        />
      </div>
    </div>
  );
}
