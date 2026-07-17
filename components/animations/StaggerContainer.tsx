"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, viewportOnce } from "@/lib/motionVariants";

type StaggerContainerProps = {
  children: ReactNode;
  className?: string;
};

export function StaggerContainer({
  children,
  className,
}: StaggerContainerProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  );
}
