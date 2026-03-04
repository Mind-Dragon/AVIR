import Link from "next/link";
import Image from "next/image";

/** Navigation links in footer (first column) */
const FOOTER_NAV_LINKS = [
  { text: "Home", href: "/" },
  { text: "Services", href: "/services" },
  { text: "Brands", href: "/brands" },
  { text: "Exciting Products", href: "/exciting-new-products" },
  { text: "Portfolio", href: "/portfolio" },
  { text: "About", href: "/about-avir" },
  { text: "Careers", href: "/careers" },
  { text: "Contact", href: "/contact" },
] as const;

/** Services links in footer (second column) */
const FOOTER_SERVICES = [
  { text: "Home Cinema", href: "/services#home-cinema" },
  { text: "Automation", href: "/services#automation" },
  { text: "Lighting", href: "/services#lighting" },
  { text: "Shading", href: "/services#shading" },
  { text: "Music", href: "/services#music" },
  { text: "Security", href: "/services#security" },
  { text: "Networking", href: "/services#networking" },
] as const;

/** Cities served — from index.html footer */
const FOOTER_CITIES = [
  { text: "Banning", href: "/city/banning" },
  { text: "Beaumont", href: "/city/beaumont" },
  { text: "Bermuda Dunes", href: "/city/bermuda-dunes" },
  { text: "Big Bear", href: "/city/big-bear" },
  { text: "Cathedral City", href: "/city/cathedral-city" },
  { text: "Coachella", href: "/city/coachella" },
  { text: "Idyllwild", href: "/city/idyllwild" },
  { text: "Indian Wells", href: "/city/indian-wells" },
  { text: "Indio", href: "/city/indio" },
  { text: "Joshua Tree", href: "/city/joshua-tree" },
  { text: "La Quinta", href: "/city/la-quinta" },
  { text: "Lake Arrowhead", href: "/city/lake-arrowhead" },
  { text: "Moreno Valley", href: "/city/moreno-valley" },
  { text: "Murrieta", href: "/city/murrieta" },
  { text: "Palm Desert", href: "/city/palm-desert" },
  { text: "Palm Springs", href: "/city/palm-springs" },
  { text: "Rancho Mirage", href: "/city/rancho-mirage" },
  { text: "Redlands", href: "/city/redlands" },
  { text: "Riverside", href: "/city/riverside" },
  { text: "San Bernardino", href: "/city/san-bernardino" },
  { text: "Temecula", href: "/city/temecula" },
  { text: "Thermal", href: "/city/thermal" },
  { text: "Thousand Palms", href: "/city/thousand-palms" },
  { text: "Yucaipa", href: "/city/yucaipa" },
  { text: "Yucca Valley", href: "/city/yucca-valley" },
] as const;

export default function Footer() {
  return (
    <footer className="section-footer" data-wf-class="section footer">
      {/* Decorative swish element */}
      <div className="footer__swish" data-wf-class="footer__swish" aria-hidden="true" />

      {/* Main footer content */}
      <div className="footer__container" data-wf-class="container footer__container">
        {/* Left column — contact info */}
        <div className="footer__left-wrap" data-wf-class="footer__left-wrap">
          <h2 className="footer__heading" data-wf-class="footer__heading">
            Engage the experts
          </h2>
          <p>
            AVIR operates within the Coachella Valley region, providing
            exclusive smart automation services for residential and commercial
            properties.
          </p>
          <h3 className="footer__heading lower" data-wf-class="footer__heading lower">
            Call
          </h3>
          <h4 className="footer__contact-info" data-wf-class="footer__contact-info">
            760.779.0881
          </h4>
          <h3 className="footer__heading lower" data-wf-class="footer__heading lower">
            Visit our Showroom
          </h3>
          <h4 className="footer__contact-info" data-wf-class="footer__contact-info">
            41905 Boardwalk, Suite X
            <br />
            Palm Desert, CA 92211
          </h4>
        </div>

        {/* Navigation column */}
        <div className="footer__nav-wrap" data-wf-class="footer__nav-wrap">
          <h4 className="footer__nav-header" data-wf-class="footer__nav-header">
            Navigation
          </h4>
          {FOOTER_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link is--footer"
              data-wf-class="nav-link is--footer"
            >
              {link.text}
            </Link>
          ))}
        </div>

        {/* Services column */}
        <div className="footer__nav-wrap last" data-wf-class="footer__nav-wrap last">
          <h4 className="footer__nav-header" data-wf-class="footer__nav-header">
            Services
          </h4>
          {FOOTER_SERVICES.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="nav-link is--footer"
              data-wf-class="nav-link is--footer"
            >
              {service.text}
            </Link>
          ))}
        </div>
      </div>

      {/* Exciting Products CTA + Cities */}
      <div className="footer__container" style={{ marginTop: "40px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", width: "100%", gap: "40px" }}>
          {/* Exciting Products box */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            <div className="footer__cta" data-wf-class="footer__cta">
              <h3>Exciting Products</h3>
              <p className="footer-cta-para" data-wf-class="footer-cta-para">
                Browse some of the most exclusive products we can bring to your
                next technology installation.
              </p>
              <Link
                href="/exciting-new-products"
                className="button is--outline is--dark"
                data-wf-class="button is--outline is--dark w-button"
              >
                Find out more
              </Link>
            </div>
          </div>

          {/* Cities served */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            <div
              className="footer-cities-heading"
              data-wf-class="footer-cities-heading"
            >
              Proudly serving the entire Coachella Valley and surrounding areas:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px" }}>
              {FOOTER_CITIES.map((city) => (
                <Link
                  key={city.href}
                  href={city.href}
                  className="footer-cities-link"
                  data-wf-class="footer-cities-link"
                >
                  {city.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar: copyright + credit */}
      <div className="footer-bottom" data-wf-class="container footer-bottom">
        <div className="footer-bottom-text" data-wf-class="footer-bottom-text">
          Copyright &copy; 2023. All rights reserved.
        </div>
        <a
          href="https://www.dunclyde.com/"
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="footer-dunclyde-link"
          data-wf-class="footer-dunclyde-link w-inline-block"
        >
          <span className="footer-dunclyde-text dark" data-wf-class="footer-dunclyde-text dark">
            Website by
          </span>
          <Image
            src="/assets/cdn.prod.website-files.com/5dee5ff86a04c463ac5126f1/5e5d861373b92cc146460ff9_Full Logo in white.svg"
            width={60}
            height={13}
            alt="Dunclyde"
            className="dunclyde-logo-dark"
          />
        </a>
      </div>
    </footer>
  );
}
