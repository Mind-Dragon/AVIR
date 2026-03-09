import Image from "next/image";
import Link from "next/link";

export interface PartnerLogo {
  logoImg: string;
  link: string;
}

const PARTNER_TYPES = [
  { text: "Interior Designers", href: "/processes#interior-designers" },
  { text: "Architects", href: "/processes#architects" },
  { text: "Builders", href: "/processes#builders" },
] as const;

export default function PartnersSection({ logos = [] }: { logos?: PartnerLogo[] }) {
  return (
    <section className="section partners-section" data-wf-class="section">
      <div className="container">
        {/* Outline heading pair */}
        <div className="outline-title-wrap">
          <div className="section-heading outline">Building</div>
          <h2 className="section-heading">Professional Partners</h2>
        </div>

        <p className="large-para is--keep-left">
          AVIR works with homeowners and professional partners alike.
        </p>

        <div className="propart__wrap">
          {/* Partner type links */}
          <div className="propart__names">
            {PARTNER_TYPES.map((partner) => (
              <Link
                key={partner.href}
                href={partner.href}
                className="propart__item w-inline-block"
              >
                <div>{partner.text}</div>
                <div className="propart__line" />
              </Link>
            ))}
          </div>

          {/* Partner image */}
          <div className="propart__image-wrap">
            <Image
              src="https://cdn.prod.website-files.com/61aeaa63fc373a25c198ab33/627031527309863b09abc49b_Shutterstock%20Partners%20Pic%20220502.jpg"
              alt="Professional Partners"
              width={1600}
              height={1057}
              sizes="(max-width: 768px) 100vw, 60vw"
              className="propart__image"
            />
          </div>
        </div>

        {/* Brand partner logos grid */}
        {logos.length > 0 && (
          <div className="partner-logos__grid">
            {logos.map((logo, i) => (
              <a
                key={i}
                href={logo.link || "#"}
                target={logo.link ? "_blank" : undefined}
                rel={logo.link ? "noopener noreferrer" : undefined}
                className="partner-logos__item"
              >
                {logo.logoImg && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={logo.logoImg}
                    alt=""
                    width={140}
                    height={50}
                    className="partner-logos__img"
                    loading="eager"
                  />
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
