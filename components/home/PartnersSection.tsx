"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const PARTNER_TYPES = [
  { text: "Interior Designers", href: "/processes#interior-designers" },
  { text: "Architects", href: "/processes#architects" },
  { text: "Builders", href: "/processes#builders" },
] as const;

export default function PartnersSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is--visible");
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section partners-section" data-wf-class="section">
      <div className="container" ref={ref}>
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
              src="/assets/cdn.prod.website-files.com/61aeaa63fc373a25c198ab33/627031527309863b09abc49b_Shutterstock Partners Pic 220502.jpg"
              alt="Professional Partners"
              width={1600}
              height={1057}
              sizes="100vw"
              className="propart__image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
