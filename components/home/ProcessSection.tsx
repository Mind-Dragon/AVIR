"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

/* ------------------------------------------------------------------ */
/*  Framer Motion variants for staggered reveal                       */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const paraVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const sectionRevealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Animated process step                                              */
/* ------------------------------------------------------------------ */

function ProcessStep({
  heading,
  desc,
}: {
  heading: string;
  desc: string;
}) {
  return (
    <motion.div className="dept__item" variants={itemVariants}>
      <motion.div
        className="dept__line"
        variants={lineVariants}
        style={{ transformOrigin: "0%" }}
      />
      <motion.div className="dept__heading-wrap" variants={itemVariants}>
        <h3 className="dept__heading">{heading}</h3>
      </motion.div>
      <motion.p className="dept__para" variants={paraVariants}>
        {desc}
      </motion.p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Static fallback for SSR (no animation, fully visible)              */
/* ------------------------------------------------------------------ */

function ProcessStepStatic({
  heading,
  desc,
}: {
  heading: string;
  desc: string;
}) {
  return (
    <div className="dept__item">
      <div className="dept__line" />
      <div className="dept__heading-wrap">
        <h3 className="dept__heading">{heading}</h3>
      </div>
      <p className="dept__para">{desc}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function ProcessSection() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section
      className="section bg-shade process-home"
      id="departments"
      data-wf-class="section bg-shade process-home"
    >
      <div className="container">
        {isClient ? (
          <>
            {/* Outline heading pair — fades in with section */}
            <motion.div
              className="outline-title-wrap"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={sectionRevealVariants}
            >
              <div className="section-heading outline">Process</div>
              <h2 className="section-heading">Our Process</h2>
            </motion.div>

            {/* Staggered process steps */}
            <motion.div
              className="process-home__grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {PROCESS_STEPS.map((step) => (
                <ProcessStep
                  key={step.heading}
                  heading={step.heading}
                  desc={step.desc}
                />
              ))}
            </motion.div>
          </>
        ) : (
          <>
            {/* SSR fallback — fully visible */}
            <div className="outline-title-wrap">
              <div className="section-heading outline">Process</div>
              <h2 className="section-heading">Our Process</h2>
            </div>
            <div className="process-home__grid">
              {PROCESS_STEPS.map((step) => (
                <ProcessStepStatic
                  key={step.heading}
                  heading={step.heading}
                  desc={step.desc}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
