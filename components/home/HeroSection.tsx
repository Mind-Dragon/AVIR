"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";

/** Service panels shown in the hero scroll area */
const HERO_SERVICES = [
  {
    heading: "Automation",
    desc: "Automation is the backbone of any smart system.",
    btn: "More on Automation",
    href: "/services#automation",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61.651 66.229" className="hero-anim-icon__svg">
        <path
          fill="currentColor"
          d="M10.803,32.301L0,43.104l3.182,3.182,10.803-10.803c.822-.821,2.158-.821,2.98,0l11.393,11.392,3.182-3.182-11.393-11.392c-2.57-2.569-6.774-2.569-9.344,0Z"
        />
        <path
          fill="currentColor"
          d="M40.29,32.301l-10.803,10.803,3.182,3.182,10.803-10.803c.822-.821,2.158-.821,2.98,0l11.393,11.392,3.806-3.182-11.393-11.392c-2.57-2.569-6.774-2.569-9.344,0Z"
        />
        <path
          fill="currentColor"
          d="M25.547,17.06L14.743,27.863l3.182,3.182,10.803-10.803c.822-.822,2.158-.822,2.98,0l11.393,11.392,3.182-3.182-11.393-11.392c-2.57-2.569-6.774-2.569-9.344,0Z"
        />
      </svg>
    ),
  },
  {
    heading: "Sound &\u00a0Vision",
    desc: "All of your media, in every room, at the highest quality.",
    btn: "More on media",
    href: "/services#music",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66.229 66.229" className="hero-anim-icon__svg">
        <circle fill="none" stroke="currentColor" strokeWidth="2" cx="33.114" cy="33.114" r="32.114" />
        <circle fill="currentColor" cx="33.114" cy="33.114" r="8" />
      </svg>
    ),
  },
  {
    heading: "shading",
    desc: "Tame harsh sunlight into a soft pleasing glow.",
    btn: "More on Shading",
    href: "/services#shading",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 66" className="hero-anim-icon__svg">
        <line x1="0" y1="8" x2="66" y2="8" stroke="currentColor" strokeWidth="1.5" />
        <line x1="0" y1="24" x2="66" y2="24" stroke="currentColor" strokeWidth="1.5" />
        <line x1="0" y1="40" x2="66" y2="40" stroke="currentColor" strokeWidth="1.5" />
        <line x1="0" y1="56" x2="66" y2="56" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    heading: "Lighting",
    desc: "Transform the light in your space to suit your mood.",
    btn: "More on Lighting",
    href: "/services#lighting",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 66" className="hero-anim-icon__svg">
        <circle fill="none" stroke="currentColor" strokeWidth="1.5" cx="33" cy="33" r="20" />
        <line x1="33" y1="0" x2="33" y2="12" stroke="currentColor" strokeWidth="1.5" />
        <line x1="33" y1="54" x2="33" y2="66" stroke="currentColor" strokeWidth="1.5" />
        <line x1="0" y1="33" x2="12" y2="33" stroke="currentColor" strokeWidth="1.5" />
        <line x1="54" y1="33" x2="66" y2="33" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    heading: "Home Cinema",
    desc: "Our home theaters rival even the best commercial cinemas.",
    btn: "More on Home Cinema",
    href: "/services#home-cinema",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 44" className="hero-anim-icon__svg">
        <rect fill="none" stroke="currentColor" strokeWidth="1.5" x="1" y="1" width="64" height="38" rx="2" />
        <line x1="20" y1="42" x2="46" y2="42" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
] as const;

export default function HeroSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const index = Math.round(scrollTop / itemHeight);
      setActiveIndex(index);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="hero-video__wrapper" data-wf-class="hero-video__wrapper">
      {/* Background video */}
      <div className="hero-video__bg">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video__element"
          poster="/assets/cdn.prod.website-files.com/61aeaa63fc373a25c198ab33/627031527309863b09abc49b_Shutterstock Partners Pic 220502.jpg"
        >
          <source src="/videos/hero/hero.webm" type="video/webm" />
          <source src="/videos/hero/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Dark grain overlay */}
      <div className="grain darken-overlay-new" aria-hidden="true" />

      {/* Scrollable content panels */}
      <div className="home-hero__content-scroll-wrap">
        <div className="home-hero__content-wrap" ref={scrollRef}>
          {/* First panel: headline */}
          <div className="home-hero__content-item first">
            <h2 className="hero-content__heading top">
              LUXURY SMART HOME SOLUTIONS
            </h2>
            <h2 className="hero-content__heading top-bottom">
              DESIGNED FOR THE DISCERNING
            </h2>
            <p className="hero-content__subheadline">
              AVIR designs, installs, and services intelligent home technology
              systems for the most discerning clientele
            </p>
            <Link href="/portfolio" className="button is--hero-cta">
              VIEW OUR PORTFOLIO
            </Link>
            <div className="home-hero__scroll-text">
              ↓ Scroll here for more info
            </div>
          </div>

          {/* Service panels */}
          {HERO_SERVICES.map((service, i) => (
            <div
              key={service.heading}
              className={`home-hero__content-item${i === HERO_SERVICES.length - 1 ? " last" : ""}`}
            >
              <div className="hero-anim-icon">{service.icon}</div>
              <div className="hero-content__middle-wrap">
                <h2 className="hero-content__heading">{service.heading}</h2>
                <p className="hero-content__desc">{service.desc}</p>
              </div>
              <Link href={service.href} className="button is--outline">
                {service.btn}
              </Link>
            </div>
          ))}
        </div>

        {/* Scroll indicator dots */}
        <div className="hero-scroll__dots" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`hero-scroll__dot${activeIndex === i ? " is--active" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
