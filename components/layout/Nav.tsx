"use client";

import { useState, useCallback, useEffect, useRef, forwardRef } from "react";
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

/** Dropdown: "Exciting Products" with sub-items */
const EXCITING_DROPDOWN = {
  text: "Exciting Products",
  items: [
    { text: "Exciting Products", href: "/exciting-new-products" },
    { text: "Blog", href: "/blog" },
  ],
} as const;

/** Dropdown: "Contact" with sub-items */
const CONTACT_DROPDOWN = {
  text: "Contact",
  items: [
    { text: "Contact Us", href: "/contact" },
    { text: "Careers", href: "/careers" },
  ],
} as const;

/** Flat mobile links (non-dropdown items) */
const MOBILE_FLAT_LINKS = [
  { text: "Home", href: "/" },
  { text: "Services", href: "/services" },
  { text: "Brands", href: "/brands" },
  { text: "Portfolio", href: "/portfolio" },
  { text: "About", href: "/about-avir" },
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

/** Nav height in px — used as scroll threshold for transparent → solid transition */
const NAV_HEIGHT = 97;

export default function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = pathname === "/";

  // Track whether user has scrolled past the hero on the homepage
  const [isScrolled, setIsScrolled] = useState(false);

  // Desktop hover dropdown state
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<string | null>(
    null
  );

  // Mobile accordion state
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(
    null
  );

  // Refs for closing desktop dropdown on outside click
  const excitingRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Toggle nav solid/transparent based on scroll position on homepage
  useEffect(() => {
    if (!isHome) {
      setIsScrolled(false);
      return;
    }

    function handleScroll() {
      const threshold = window.innerHeight - NAV_HEIGHT;
      setIsScrolled(window.scrollY > threshold);
    }

    handleScroll(); // check on mount
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const toggleMobileAccordion = useCallback((key: string) => {
    setOpenMobileAccordion((prev) => (prev === key ? null : key));
  }, []);

  // Close mobile menu and accordions on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenMobileAccordion(null);
    setOpenDesktopDropdown(null);
  }, [pathname]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        openDesktopDropdown &&
        excitingRef.current &&
        !excitingRef.current.contains(e.target as Node) &&
        contactRef.current &&
        !contactRef.current.contains(e.target as Node)
      ) {
        setOpenDesktopDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDesktopDropdown]);

  return (
    <div
      className={`nav${isHome && !isScrolled ? " nav--transparent" : ""}`}
      data-wf-class="nav"
    >
      {/* Logo */}
      <Link
        href="/"
        className="nav__site-logo"
        data-wf-class="nav__site-logo w-inline-block"
        aria-label="AVIR Home"
      >
        <Image
          src="/images/avir-logo.svg"
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
            &#9662;
          </span>
          <span>Menu</span>
        </button>
        <nav
          className={`mobile__dd${mobileOpen ? " is--open" : ""}`}
          data-wf-class="mobile__dd w-dropdown-list"
        >
          {/* Flat mobile links */}
          {MOBILE_FLAT_LINKS.map((link) => (
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

          {/* Mobile accordion: Exciting Products */}
          <MobileAccordion
            label={EXCITING_DROPDOWN.text}
            items={EXCITING_DROPDOWN.items}
            isOpen={openMobileAccordion === "exciting"}
            onToggle={() => toggleMobileAccordion("exciting")}
            isGroupActive={isDropdownActive(pathname, EXCITING_DROPDOWN.items)}
            pathname={pathname}
            onLinkClick={() => setMobileOpen(false)}
          />

          {/* Mobile accordion: Contact */}
          <MobileAccordion
            label={CONTACT_DROPDOWN.text}
            items={CONTACT_DROPDOWN.items}
            isOpen={openMobileAccordion === "contact"}
            onToggle={() => toggleMobileAccordion("contact")}
            isGroupActive={isDropdownActive(pathname, CONTACT_DROPDOWN.items)}
            pathname={pathname}
            onLinkClick={() => setMobileOpen(false)}
          />
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
        <DesktopDropdown
          ref={excitingRef}
          label={EXCITING_DROPDOWN.text}
          items={EXCITING_DROPDOWN.items}
          isOpen={openDesktopDropdown === "exciting"}
          onMouseEnter={() => setOpenDesktopDropdown("exciting")}
          onMouseLeave={() => setOpenDesktopDropdown(null)}
          isGroupActive={isDropdownActive(pathname, EXCITING_DROPDOWN.items)}
          pathname={pathname}
        />

        {/* Contact dropdown */}
        <DesktopDropdown
          ref={contactRef}
          label={CONTACT_DROPDOWN.text}
          items={CONTACT_DROPDOWN.items}
          isOpen={openDesktopDropdown === "contact"}
          onMouseEnter={() => setOpenDesktopDropdown("contact")}
          onMouseLeave={() => setOpenDesktopDropdown(null)}
          isGroupActive={isDropdownActive(pathname, CONTACT_DROPDOWN.items)}
          pathname={pathname}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Desktop dropdown sub-component                                     */
/* ------------------------------------------------------------------ */

interface DesktopDropdownProps {
  label: string;
  items: ReadonlyArray<{ text: string; href: string }>;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isGroupActive: boolean;
  pathname: string;
}

const DesktopDropdown = forwardRef<HTMLDivElement, DesktopDropdownProps>(
  function DesktopDropdown(
    { label, items, isOpen, onMouseEnter, onMouseLeave, isGroupActive, pathname },
    ref
  ) {
    return (
      <div
        ref={ref}
        className="nav__dropdown"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <button
          type="button"
          className={`nav-link is--dropdown${isGroupActive ? " is--active" : ""}`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="nav-link__text">{label}</span>
          <span className="dd-icon" aria-hidden="true" />
        </button>
        <div
          className={`nav__dropdown-list${isOpen ? " is--open" : ""}`}
          role="menu"
        >
          {items.map((item, idx) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link in-dropdown${idx === 0 ? " first" : ""}${idx === items.length - 1 ? " last" : ""}${isActive(pathname, item.href) ? " is--active" : ""}`}
              role="menuitem"
            >
              {item.text}
            </Link>
          ))}
        </div>
      </div>
    );
  }
);

/* ------------------------------------------------------------------ */
/*  Mobile accordion sub-component                                     */
/* ------------------------------------------------------------------ */

interface MobileAccordionProps {
  label: string;
  items: ReadonlyArray<{ text: string; href: string }>;
  isOpen: boolean;
  onToggle: () => void;
  isGroupActive: boolean;
  pathname: string;
  onLinkClick: () => void;
}

function MobileAccordion({
  label,
  items,
  isOpen,
  onToggle,
  isGroupActive,
  pathname,
  onLinkClick,
}: MobileAccordionProps) {
  return (
    <div className="mobile-accordion">
      <button
        type="button"
        className={`nav-link-mobile mobile-accordion__toggle${isGroupActive ? " is--active" : ""}`}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{label}</span>
        <span
          className={`mobile-accordion__icon${isOpen ? " is--open" : ""}`}
          aria-hidden="true"
        >
          &#9662;
        </span>
      </button>
      {isOpen && (
        <div className="mobile-accordion__items">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link-mobile mobile-accordion__link${isActive(pathname, item.href) ? " is--active" : ""}`}
              onClick={onLinkClick}
            >
              {item.text}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
