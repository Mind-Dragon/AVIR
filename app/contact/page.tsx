import type { Metadata } from "next";
import Link from "next/link";
import FooterCTA from "@/components/layout/FooterCTA";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact | AVIR",
  description:
    "We want to hear from you. Give us a call, send us an email or fill out one of the contact forms below.",
  alternates: { canonical: canonicalUrl("/contact") },
  openGraph: {
    title: "Contact | AVIR",
    description:
      "We want to hear from you. Give us a call, send us an email or fill out one of the contact forms below.",
    url: canonicalUrl("/contact"),
  },
};

/* ------------------------------------------------------------------ */
/*  Data for the three CTA cards                                       */
/* ------------------------------------------------------------------ */

interface ContactCard {
  title: string;
  description: string;
  href: string;
  buttonText: string;
  phone: string | null;
  isLast?: boolean;
}

const CONTACT_CARDS: ContactCard[] = [
  {
    title: "Residential Projects",
    description:
      "We partner with home owners and project managers to bring your luxury home to the next level.",
    href: "/residential-form",
    buttonText: "Get Started now",
    phone: "760.779.0881",
  },
  {
    title: "Commercial Projects",
    description:
      "We partner with builders, business owners, and corporations to create custom automation spaces of the highest standard.",
    href: "/commercial-form",
    buttonText: "Get Started now",
    phone: "760.779.0881",
  },
  {
    title: "Service Call",
    description:
      "Are you a current client? Did a power outage cause a service interruption? Is your television not turning on? Unable to control your Air Conditioning thermostat? We can help you with all of that and more. Please click below to tell us more:",
    href: "/service-request",
    buttonText: "Book a service Call",
    phone: null,
    isLast: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function ContactPageJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact AVIR",
    description:
      "We want to hear from you. Give us a call, send us an email or fill out one of the contact forms below.",
    url: "https://www.avir.com/contact",
    mainEntity: {
      "@type": "LocalBusiness",
      name: "AVIR",
      telephone: "+17607790881",
      address: {
        "@type": "PostalAddress",
        streetAddress: "41905 Boardwalk, Suite X",
        addressLocality: "Palm Desert",
        addressRegion: "CA",
        postalCode: "92211",
        addressCountry: "US",
      },
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function ContactPage() {
  return (
    <>
      <ContactPageJsonLd />
      {/* Title section */}
      <section className="section title" data-wf-class="section title">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 20px 40px" }}>
          <h1 className="page-title" data-wf-class="page-title">
            Contact
          </h1>
          <p style={{ maxWidth: "50ch", marginTop: "16px", fontSize: "18px" }}>
            We want to hear from you. Give us a call, send us an email or fill
            out one of the contact forms below.
          </p>
        </div>
      </section>

      {/* Location + CTA cards */}
      <section className="section" data-wf-class="section">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px 80px" }}>
          {/* Location info */}
          <div className="contact__info-row" style={{ display: "flex", flexWrap: "wrap", gap: "40px", marginBottom: "60px" }}>
            <div style={{ flex: "1", minWidth: "250px" }}>
              <h3 style={{ fontFamily: "termina, sans-serif", textTransform: "uppercase", fontSize: "14px", marginBottom: "12px" }}>
                Location
              </h3>
              <p>
                AVIR operates within the Coachella Valley region, and serves
                Southern California.
              </p>
            </div>
            <div style={{ flex: "1", minWidth: "250px" }}>
              <h3 style={{ fontFamily: "termina, sans-serif", textTransform: "uppercase", fontSize: "14px", marginBottom: "12px" }}>
                Visit the showroom
              </h3>
              <p>
                41905 Boardwalk, Suite X
                <br />
                Palm Desert, CA 92211
              </p>
            </div>
          </div>

          {/* CTA cards */}
          <div className="contact__cards" style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
            {CONTACT_CARDS.map((card) => (
              <div
                key={card.href}
                className={`contact__cta${card.isLast ? " last" : ""}`}
                data-wf-class={`contact__cta${card.isLast ? " last" : ""}`}
                style={{
                  flex: "1",
                  minWidth: "280px",
                  backgroundColor: "var(--off-black)",
                  color: "var(--white-sand)",
                  borderRadius: "20px",
                  padding: "40px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3
                  style={{
                    fontFamily: "termina, sans-serif",
                    textTransform: "uppercase",
                    fontSize: "16px",
                    marginBottom: "16px",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  className="contact__cta-text"
                  data-wf-class="contact__cta-text"
                  style={{ flex: "1", marginBottom: "24px", opacity: 0.85 }}
                >
                  {card.description}
                </p>
                <div className="contact__cta-bottom" data-wf-class="contact__cta-bottom">
                  <Link
                    href={card.href}
                    className="button is--outline"
                    data-wf-class="button is--outline w-button"
                  >
                    {card.buttonText}
                  </Link>
                  {card.phone && (
                    <p style={{ marginTop: "12px", fontSize: "14px", opacity: 0.7 }}>
                      Or Call {card.phone}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterCTA />
    </>
  );
}
