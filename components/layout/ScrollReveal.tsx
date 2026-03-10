"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * SSR-safe scroll-triggered reveal wrapper.
 *
 * On the server (and first client paint) the children render at full opacity
 * so nothing is ever invisible in a no-JS / SSR state.  Once hydrated on the
 * client we enable the entrance animation via `whileInView`.
 */
export default function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  /* Before hydration: render children with no animation wrapper */
  if (!isClient) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
