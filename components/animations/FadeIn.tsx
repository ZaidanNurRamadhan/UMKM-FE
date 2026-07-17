"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  fadeInLeft,
  fadeInRight,
  fadeInUp,
  viewportOnce,
} from "@/lib/motionVariants";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
};

export function FadeIn({
  children,
  className,
  direction = "up",
  delay = 0,
}: FadeInProps) {
  const reduceMotion = useReducedMotion();
  const variants =
    direction === "left"
      ? fadeInLeft
      : direction === "right"
        ? fadeInRight
        : fadeInUp;

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
