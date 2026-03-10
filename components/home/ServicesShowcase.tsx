"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/** Service sections data matching the Webflow scroller-section layout */
const SERVICES = [
  {
    heading: "Automation",
    para: "Automation is the backbone of any smart system.",
    btn: "More on Automation",
    href: "/services#automation",
    sectionClass: "section scroller-section first",
  },
  {
    heading: "Sound &\u00a0Vision",
    para: "All of your media, in every room, at the highest quality.",
    btn: "More on media",
    href: "/services#music",
    sectionClass: "section scroller-section",
  },
  {
    heading: "shading",
    para: "Tame harsh sunlight into a soft pleasing glow.",
    btn: "More on Shading",
    href: "/services#shading",
    sectionClass: "section scroller-section",
  },
  {
    heading: "Lighting",
    para: "Transform the light in your space to suit your mood.",
    btn: "More on Lighting",
    href: "/services#lighting",
    sectionClass: "section scroller-section",
  },
  {
    heading: "Home Cinema",
    para: "Our home theaters rival even the best commercial cinemas.",
    btn: "More on Home Cinema",
    href: "/services#home-cinema",
    sectionClass: "section scroller-section-extended",
  },
] as const;

const revealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

function ServiceCard({
  heading,
  para,
  btn,
  href,
  animated,
}: {
  heading: string;
  para: string;
  btn: string;
  href: string;
  animated: boolean;
}) {
  if (animated) {
    return (
      <motion.div
        className="scroller__card"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={revealVariants}
      >
        <div className="scroller__content">
          <h2 className="scroller__heading">{heading}</h2>
          <p className="scroller__para">{para}</p>
          <Link href={href} className="button is--outline is--dark">
            {btn}
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="scroller__card">
      <div className="scroller__content">
        <h2 className="scroller__heading">{heading}</h2>
        <p className="scroller__para">{para}</p>
        <Link href={href} className="button is--outline is--dark">
          {btn}
        </Link>
      </div>
    </div>
  );
}

export default function ServicesShowcase() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="services-showcase">
      {SERVICES.map((service) => (
        <section
          key={service.heading}
          className={service.sectionClass}
          data-wf-class={service.sectionClass}
        >
          <div className="container">
            <ServiceCard
              heading={service.heading}
              para={service.para}
              btn={service.btn}
              href={service.href}
              animated={isClient}
            />
          </div>
        </section>
      ))}
    </div>
  );
}
