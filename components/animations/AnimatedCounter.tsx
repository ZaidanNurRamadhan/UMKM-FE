"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type AnimatedCounterProps = {
  value: string;
  className?: string;
};

function parseCounterValue(value: string) {
  const match = value.match(/^(\d+)(.*)$/);

  if (!match) {
    return null;
  }

  return {
    target: Number(match[1]),
    suffix: match[2] ?? "",
  };
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.7 });
  const reduceMotion = useReducedMotion();
  const parsed = useMemo(() => parseCounterValue(value), [value]);
  const [displayValue, setDisplayValue] = useState(
    parsed ? `0${parsed.suffix}` : value,
  );

  useEffect(() => {
    if (!isInView || !parsed) {
      return;
    }

    if (reduceMotion) {
      return;
    }

    let frameId = 0;
    const duration = 850;
    const startTime = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(parsed.target * eased);

      setDisplayValue(`${current}${parsed.suffix}`);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [isInView, parsed, reduceMotion, value]);

  return (
    <span ref={ref} className={className}>
      {reduceMotion ? value : displayValue}
    </span>
  );
}
