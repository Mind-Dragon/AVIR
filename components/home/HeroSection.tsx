"use client";

import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="home-hero" data-wf-class="home-hero">
      {/* Dark architectural photo background */}
      <div className="home-hero__bg" aria-hidden="true">
        <Image
          src="https://assets-global.website-files.com/61aeaa63fc373a25c198ab33/61af1a8c1ac62e0e34a96fce_home-hero-bg-p-1600.jpeg"
          alt=""
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
          sizes="100vw"
        />
        <div className="home-hero__overlay" aria-hidden="true" />
      </div>

      {/* Hero content */}
      <div className="home-hero__content">
        <div className="home-hero__text-wrap">
          <div className="home-hero__eyebrow">DESIGNED FOR THE DISCERNING</div>
          <h1 className="home-hero__heading">LUXURY SMART HOME SOLUTIONS</h1>
          <p className="home-hero__sub">
            Seamless technology. Elevated living. Every system — audio, video,
            lighting, security, automation — designed to disappear into your space.
          </p>
          <Link href="/portfolio" className="button is--hero-cta">
            VIEW OUR PORTFOLIO
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll__wrap" aria-hidden="true">
        <div className="hero-scroll__dot" />
      </div>
    </section>
  );
}
