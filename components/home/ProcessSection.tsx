"use client";

import { useRef, useEffect } from "react";

/** Process steps from index.json / index.html */
const PROCESS_STEPS = [
  {
    heading: "Design Specialists",
    desc: "We all need someone to help us dream. An AVIR design specialist can help you do just that, showing you the best new products available and helping create a vision for your home.",
  },
  {
    heading: "Proposal",
    desc: "Included in the process from the very beginning, our proposal department works with our design specialists to offer you an inspirational balance of aesthetics and technical foresight, using the finest electronic products in the world.",
  },
  {
    heading: "Engineering",
    desc: "Our engineering team is the logistical backbone of AVIR, providing drawings, specs, and calculations to the rest of the AVIR team while also working closely with your contractor, designer and architect.",
  },
  {
    heading: "Installation",
    desc: "Our installation team is thorough and precise. They work off of detailed drawings from our engineering department to install all of our fine products and calibrate them to function at their highest level.",
  },
  {
    heading: "Project ManAgement",
    desc: "Facilitating communication between AVIR and the other industry professionals involved in your project, our project management team ensures that the vision of our design team is executed in the field and held to AVIR\u2019s high standard of quality.",
  },
  {
    heading: "Programming",
    desc: "Our team of world-class programmers ensure that our systems are elegantly intuitive, so that your experience with your new system is natural and effortless.",
  },
  {
    heading: "Service",
    desc: "Our service team is what truly makes your experience with AVIR special. We offer the highest level of customer service and support seven days a week. We are always available to you with white glove service for repairs and upgrades, to get the most out of our installations for many years to come.",
  },
] as const;

function ProcessStep({
  heading,
  desc,
  index,
}: {
  heading: string;
  desc: string;
  index: number;
}) {
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
    <div
      ref={ref}
      className="dept__item"
      style={{ transitionDelay: `${index * 0.08}s` }}
    >
      <div className="dept__line" />
      <div className="dept__heading-wrap">
        <h3 className="dept__heading">{heading}</h3>
      </div>
      <p className="dept__para">{desc}</p>
    </div>
  );
}

export default function ProcessSection() {
  return (
    <section
      className="section bg-shade process-home"
      id="departments"
      data-wf-class="section bg-shade process-home"
    >
      <div className="container">
        {/* Outline heading pair */}
        <div className="outline-title-wrap">
          <div className="section-heading outline">Process</div>
          <h2 className="section-heading">Our Process</h2>
        </div>

        {/* Steps — matches avir.com dept__item layout */}
        <div className="process-home__grid">
          {PROCESS_STEPS.map((step, i) => (
            <ProcessStep
              key={step.heading}
              heading={step.heading}
              desc={step.desc}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
