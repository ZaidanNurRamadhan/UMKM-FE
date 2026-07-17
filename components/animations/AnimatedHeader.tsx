"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";

type AnimatedHeaderProps = {
  children: ReactNode;
};

export function AnimatedHeader({ children }: AnimatedHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 12);
  });

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: -18 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 shadow-md shadow-black/8 backdrop-blur dark:bg-[#10150f]/95 dark:shadow-black/30"
          : "bg-white/90 shadow-sm backdrop-blur-sm dark:bg-[#10150f]/90"
      }`}
    >
      {children}
    </motion.header>
  );
}
