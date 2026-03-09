"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  SVG icons extracted from the original Webflow source (avir.com)   */
/* ------------------------------------------------------------------ */

function AutomationIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 61.651 66.229"
      className={className}
    >
      <path
        fill="currentColor"
        d="M10.803,32.301L0,43.104l3.182,3.182,10.803-10.803c.822-.821,2.158-.821,2.98,0l11.393,11.392,3.182-3.182-11.393-11.392c-2.575-2.576-6.768-2.576-9.344,0Z"
      />
      <path
        fill="currentColor"
        d="M27.22,51.183l-11.655-11.655-3.182,3.182,11.655,11.655c1.215,1.216,2.812,1.823,4.409,1.823s3.193-.607,4.409-1.823l11.066-11.066-3.182-3.182-11.066,11.066c-.655,.655-1.799,.655-2.454,0Z"
      />
      <path
        fill="currentColor"
        d="M33.989,.659c-.879-.879-2.304-.879-3.182,0L2.97,28.496l3.182,3.182L32.398,5.432l24.753,24.753v31.544H6.811v-10.081H2.311v12.331c0,1.243,1.007,2.25,2.25,2.25H59.401c1.243,0,2.25-1.007,2.25-2.25V29.253c0-.597-.237-1.169-.659-1.591L33.989,.659Z"
      />
    </svg>
  );
}

function SoundVisionIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 49.588 77.521"
      className={className}
    >
      <path
        fill="currentColor"
        d="M2.25,77.521H47.338c1.242,0,2.25-1.007,2.25-2.25V2.25c0-1.243-1.008-2.25-2.25-2.25H2.25C1.008,0,0,1.007,0,2.25V75.271c0,1.243,1.008,2.25,2.25,2.25ZM4.5,4.5H45.088V73.021H4.5V4.5Z"
      />
      <path
        fill="currentColor"
        d="M24.794,12.258c-9.618,0-17.442,7.825-17.442,17.442s7.824,17.442,17.442,17.442,17.442-7.825,17.442-17.442-7.824-17.442-17.442-17.442Zm0,30.385c-7.137,0-12.942-5.806-12.942-12.942s5.806-12.942,12.942-12.942,12.942,5.806,12.942,12.942-5.806,12.942-12.942,12.942Z"
      />
      <path
        fill="currentColor"
        d="M24.794,23.102c-3.639,0-6.599,2.96-6.599,6.599s2.96,6.599,6.599,6.599,6.599-2.96,6.599-6.599-2.96-6.599-6.599-6.599Zm0,8.697c-1.157,0-2.099-.941-2.099-2.099s.941-2.099,2.099-2.099,2.099,.941,2.099,2.099-.941,2.099-2.099,2.099Z"
      />
    </svg>
  );
}

function ShadingIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60.146 82.856"
      className={className}
    >
      <path
        fill="currentColor"
        d="M57.896,0H2.25C1.007,0,0,1.007,0,2.25V80.606c0,1.242,1.007,2.25,2.25,2.25H57.896c1.243,0,2.25-1.008,2.25-2.25V2.25c0-1.243-1.007-2.25-2.25-2.25Zm-2.25,5.82h-23.163v-1.32h23.163v1.32Zm-27.663,10.502v1.502H4.5v-1.502H27.982ZM4.5,11.822v-1.502H27.982v1.502H4.5Zm23.482,10.502v1.502H4.5v-1.502H27.982Zm0,6.002v1.502H4.5v-1.502H27.982Zm0,6.002v30.284H4.5v-30.284H27.982Zm4.5,0h23.163v30.284h-23.163v-30.284Zm0-4.5v-1.502h23.163v1.502h-23.163Zm0-6.002v-1.502h23.163v1.502h-23.163Zm0-6.002v-1.502h23.163v1.502h-23.163Zm0-6.002v-1.502h23.163v1.502h-23.163Zm-4.5-7.322v1.32H4.5v-1.32H27.982ZM4.5,69.112H27.982v9.244H4.5v-9.244Zm27.982,9.244v-9.244h23.163v9.244h-23.163Z"
      />
    </svg>
  );
}

function LightingIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 66.967 87.012"
      className={className}
    >
      <path
        fill="currentColor"
        d="M66.707,29.321c-1.001-7.975-4.854-15.395-10.914-20.812C48.698,2.165,39.154-.859,29.62,.212,14.437,1.915,2.086,14.157,.254,29.32c-1.599,13.222,4.436,25.744,15.747,32.68,2.541,1.559,4.119,4.577,4.119,7.879v14.884c0,1.242,1.008,2.25,2.25,2.25h22.228c1.242,0,2.25-1.007,2.25-2.25v-14.884c0-3.302,1.579-6.32,4.12-7.879,10.133-6.213,16.112-16.999,15.998-28.854-.013-1.265-.097-2.552-.251-3.826h-.008Zm-18.091,28.843c-3.866,2.37-6.268,6.859-6.268,11.715v12.634H24.62v-12.634c0-4.855-2.401-9.345-6.268-11.715-9.793-6.005-15.016-16.85-13.632-28.304C6.306,16.745,16.988,6.157,30.122,4.683c8.392-.938,16.441,1.609,22.671,7.18,6.148,5.497,9.674,13.375,9.674,21.614h0c0,10.145-5.162,19.357-13.852,24.686Z"
      />
    </svg>
  );
}

function CinemaIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 84.5 55.368"
      className={className}
    >
      <path
        fill="currentColor"
        d="M83.289,6.001c-.745-.388-1.643-.328-2.33,.152l-16.726,11.712c.009-.226,.013-.452,.013-.679C64.247,7.71,56.537,0,47.06,0c-6.389,0-11.975,3.504-14.937,8.692C29.162,3.504,23.576,0,17.187,0,7.71,0,0,7.71,0,17.187c0,8.853,6.208,15.944,14.5,17.039v17.93c0,1.242,1.006,2.249,2.249,2.25l44,.028h.001c.597,0,1.168-.237,1.59-.658,.422-.422,.66-.995,.66-1.592v-7.53l18.129,10.415c.347,.199,.734,.299,1.121,.299,.389,0,.778-.101,1.127-.303,.695-.402,1.123-1.145,1.123-1.947V7.997c0-.839-.467-1.608-1.211-1.996Zm-3.289,43.229l-18.129-10.415c-.695-.4-1.552-.399-2.248,.004-.695,.402-1.123,1.145-1.123,1.947v9.167l-39.5-.026v-17.783c0-1.242-1.007-2.25-2.25-2.25-6.869,0-12.25-5.573-12.25-12.687,0-6.996,5.691-12.687,12.687-12.687s12.687,5.691,12.687,12.687c0,1.243,1.007,2.25,2.25,2.25s2.25-1.007,2.25-2.25c0-6.996,5.691-12.687,12.687-12.687s12.687,5.691,12.687,12.687c0,1.713-.335,3.375-.996,4.938-.391,.924-.123,1.995,.657,2.626,.781,.631,1.884,.669,2.706,.094l17.887-12.525V49.23Z"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Service panel data                                                */
/* ------------------------------------------------------------------ */

const SERVICES = [
  {
    name: "Automation",
    Icon: AutomationIcon,
    wider: false,
  },
  {
    name: "Sound \u00a0& Vision",
    Icon: SoundVisionIcon,
    wider: false,
  },
  {
    name: "Shading",
    Icon: ShadingIcon,
    wider: false,
  },
  {
    name: "Lighting",
    Icon: LightingIcon,
    wider: true,
  },
  {
    name: "Home Cinema",
    Icon: CinemaIcon,
    wider: true,
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Panel animation variants                                          */
/* ------------------------------------------------------------------ */

const panelVariants = {
  hidden: { opacity: 0, y: -60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
  exit: {
    opacity: 0,
    y: 60,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Intro panel (shown before any service)                            */
/* ------------------------------------------------------------------ */

function IntroPanel() {
  return (
    <motion.div
      key="intro"
      className="scroller-hero__panel"
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h2 className="scroller-hero__heading scroller-hero__heading--top">
        LUXURY SMART HOME SOLUTIONS
      </h2>
      <h2 className="scroller-hero__heading scroller-hero__heading--bottom">
        DESIGNED FOR THE DISCERNING
      </h2>
      <div className="scroller-hero__scroll-text">
        &darr; Scroll here for more info
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Service panel                                                     */
/* ------------------------------------------------------------------ */

function ServicePanel({
  name,
  Icon,
  wider,
}: {
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
  wider: boolean;
}) {
  return (
    <motion.div
      key={name}
      className="scroller-hero__panel"
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div
        className={`scroller-hero__icon${wider ? " scroller-hero__icon--wider" : ""}`}
      >
        <Icon className="scroller-hero__svg" />
      </div>
      <h2 className="scroller-hero__service-name">{name}</h2>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export default function ScrollerHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* Scroll progress across the entire wrapper (6 x 100vh) */
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  /*
   * Map scroll progress to an active panel index:
   *   0 = intro, 1-5 = services
   * Each panel occupies 1/6 of the total scroll distance.
   * We use a continuous value from useTransform and discretise it.
   */
  const rawIndex = useTransform(scrollYProgress, [0, 1], [0, 6]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = rawIndex.on("change", (v: number) => {
      /* Clamp to 0-5, rounding down so the panel shows for the
         full 100vh section it occupies */
      const idx = Math.min(5, Math.max(0, Math.floor(v)));
      setActiveIndex(idx);
    });
    return unsubscribe;
  }, [rawIndex]);

  /* ---- Mobile: simplified fade-in-on-scroll layout ---- */
  if (isMobile) {
    return (
      <section className="scroller-hero--mobile">
        {/* Hero video */}
        <div className="scroller-hero__video-wrap">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="scroller-hero__video"
            poster="/video/hero-poster.jpg"
          >
            <source src="/video/hero.webm" type="video/webm" />
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
          <div className="scroller-hero__overlay" aria-hidden="true" />
          <div className="scroller-hero__panel scroller-hero__panel--mobile-intro">
            <h2 className="scroller-hero__heading scroller-hero__heading--top">
              LUXURY SMART HOME SOLUTIONS
            </h2>
            <h2 className="scroller-hero__heading scroller-hero__heading--bottom">
              DESIGNED FOR THE DISCERNING
            </h2>
          </div>
        </div>

        {/* Service panels as simple stacked cards on mobile */}
        <div className="scroller-hero__mobile-services">
          {SERVICES.map(({ name, Icon, wider }) => (
            <div key={name} className="scroller-hero__mobile-card">
              <div
                className={`scroller-hero__icon${wider ? " scroller-hero__icon--wider" : ""}`}
              >
                <Icon className="scroller-hero__svg" />
              </div>
              <h2 className="scroller-hero__service-name">{name}</h2>
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ---- Desktop: scroll-jacking layout ---- */
  return (
    <div ref={wrapperRef} className="scroller-hero">
      {/* Sticky inner hero — stays pinned while user scrolls through 6 x 100vh */}
      <div className="scroller-hero__sticky">
        {/* Video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="scroller-hero__video"
          poster="/video/hero-poster.jpg"
        >
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>

        {/* Dark grain overlay */}
        <div className="scroller-hero__overlay" aria-hidden="true" />

        {/* Content overlay — AnimatePresence swaps panels */}
        <div className="scroller-hero__content">
          <AnimatePresence mode="wait">
            {activeIndex === 0 ? (
              <IntroPanel key="intro" />
            ) : (
              <ServicePanel
                key={SERVICES[activeIndex - 1].name}
                name={SERVICES[activeIndex - 1].name}
                Icon={SERVICES[activeIndex - 1].Icon}
                wider={SERVICES[activeIndex - 1].wider}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
