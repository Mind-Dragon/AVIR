import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FooterCTA from "@/components/layout/FooterCTA";
import {
  CITIES,
  CITY_SERVICES,
  CLIENT_LOCATIONS,
  getCityBySlug,
} from "@/lib/cities";

/* ---------- Static generation ---------- */

export function generateStaticParams(): Array<{ slug: string }> {
  return CITIES.map((city) => ({ slug: city.slug }));
}

/* ---------- Per-page metadata ---------- */

interface CityPageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: CityPageProps): Metadata {
  const city = getCityBySlug(params.slug);
  if (!city) return {};

  return {
    title: `Audio Video & Smart Home Services in ${city.name} | AVIR`,
    description: `AVIR provides luxury smart home solutions in ${city.name} — home cinema, automation, lighting, shading, music, security & networking. Call (760) 779-0881.`,
    alternates: {
      canonical: `/city/${city.slug}`,
    },
  };
}

/* ---------- JSON-LD structured data ---------- */

function LocalBusinessJsonLd({ cityName }: { cityName: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "AVIR",
    description: `Luxury smart home solutions in ${cityName} — audio, video, automation, lighting, shading, and home cinema.`,
    url: "https://www.avir.com",
    telephone: "+17607790881",
    address: {
      "@type": "PostalAddress",
      streetAddress: "41905 Boardwalk, Suite X",
      addressLocality: "Palm Desert",
      addressRegion: "CA",
      postalCode: "92211",
      addressCountry: "US",
    },
    areaServed: {
      "@type": "City",
      name: cityName,
    },
    image:
      "https://cdn.prod.website-files.com/61aeaa63fc373a25c198ab33/6375d62b597feaaa92009bc5_AVIR%20logo%20website%20Final.svg",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* ---------- Page sections ---------- */

/** Split-layout hero: city name left, intro copy right */
function HeroSection({ cityName }: { cityName: string }) {
  return (
    <div className="section title">
      <div className="title__bg" />
      <div className="container">
        <div className="col-wrapper">
          <div className="col-50">
            <h1 className="page-title">{cityName}</h1>
          </div>
          <div className="col-50 title-right">
            <div className="lander__intro">
              AVIR has been a part of the Coachella Valley community for the
              last 33 years. We are a factory authorized and trained designer and
              installer of the finest audio, home theater, lighting control,
              motorized shading, network, and home automation equipment
              in&nbsp;{cityName}.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Full-width showcase image */
function LanderImageSection() {
  return (
    <div className="section lander-image">
      <div className="container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://cdn.prod.website-files.com/61aeaa63fc373a25c198ab33/622dcbe20434a82a5cb8e04b_BH15%20Optimized-p-1600.jpeg"
          alt="A large commercial private club set in the mountains of California, with comprehensive audio and video systems installed by AVIR."
          width={1600}
          height={1057}
          className="lander__hero-image"
          loading="eager"
        />
      </div>
    </div>
  );
}

/** Relationship & service quality paragraph */
function IntroSection() {
  return (
    <div className="section no-top-padding">
      <div className="container">
        <div className="lander__info-box">
          <div className="lander__text">
            AVIR builds relationships by designing smart systems that are easy to
            use, implementing them with the industry&apos;s best trained and most
            committed staff, and supporting them with &ldquo;white glove&rdquo;
            service to assure value and enjoyment for years to come. By
            maintaining strong relationships with leading designers, architects,
            and builders, we have consistently proven our ability to engineer and
            install a wide range of systems for different needs and budgets.
          </div>
        </div>
      </div>
    </div>
  );
}

/** Two-column services list */
function ServicesSection({ cityName }: { cityName: string }) {
  const mid = Math.ceil(CITY_SERVICES.length / 2);
  const leftServices = CITY_SERVICES.slice(0, mid);
  const rightServices = CITY_SERVICES.slice(mid);

  return (
    <div className="section">
      <div className="container">
        <div className="lander__heading">
          <h2>
            <span className="is--inline">Audio Video Services in </span>
            <span className="is--inline">{cityName}</span>
          </h2>
        </div>
        <div className="col-wrapper">
          <div className="col-50">
            <ul role="list" className="lander__list">
              {leftServices.map((service) => (
                <li key={service} className="lander__list-item">
                  <div className="lander__list-line" />
                  <div>{service}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-50">
            <ul role="list" className="lander__list second">
              {rightServices.map((service) => (
                <li key={service} className="lander__list-item">
                  <div className="lander__list-line" />
                  <div>{service}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/** "Best AV Integration" dark content block */
function BestAvSection() {
  return (
    <div className="section">
      <div className="container is--all-centered is--dark-container">
        <h2 className="is--small-spaced-below">
          The Best Audio Video Integration Company In The Coachella Valley
        </h2>
        <div className="lander__intro">
          AVIR&apos;s &lsquo;One Touch Simplicity&rsquo; lets you indulge in
          luxury with a single touch of a button or voice command. Imagine that
          with just a single touch or voice command the lights dim, the shades
          close, the TV turns on and your favorite movie begins. Intuitive and
          minimalistic control interface design is the core of what we have to
          offer.{" "}
          <strong>
            You&apos;ll wish you&apos;d have found us a long time ago.
          </strong>
        </div>
      </div>
    </div>
  );
}

/** City grid + notable client list */
function CitiesListSection({ currentSlug }: { currentSlug: string }) {
  return (
    <div className="section">
      <div className="container">
        <div className="col-wrapper">
          <div className="col-50">
            <h3>Below is a list of cities we serve:</h3>
            <div className="all-cities__list-wrapper">
              <div role="list" className="all-cities__list">
                {CITIES.map((city) => (
                  <div
                    key={city.slug}
                    role="listitem"
                    className="all-cities__item"
                  >
                    <Link
                      href={`/city/${city.slug}`}
                      className={`all-cities__link${city.slug === currentSlug ? " is--current" : ""}`}
                      {...(city.slug === currentSlug
                        ? { "aria-current": "page" as const }
                        : {})}
                    >
                      <div>{city.name}</div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-50">
            <div className="lander__clients">
              <p>We have clients in: (alphabetical order)</p>
              <p className="lander__clients-list">
                {CLIENT_LOCATIONS.join(", ")}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main page component ---------- */

export default function CityPage({ params }: CityPageProps) {
  const city = getCityBySlug(params.slug);
  if (!city) notFound();

  return (
    <>
      <LocalBusinessJsonLd cityName={city.name} />
      <HeroSection cityName={city.name} />
      <LanderImageSection />
      <IntroSection />
      <ServicesSection cityName={city.name} />
      <BestAvSection />
      <CitiesListSection currentSlug={city.slug} />
      <FooterCTA variant="lander" />
    </>
  );
}
