"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [display, setDisplay] = useState(0);
  const hasAnimatedRef = useRef(false);

  const match = value.match(/(\d+)/);
  const numeric = match ? parseInt(match[1], 10) : 0;
  const suffix = value.replace(String(numeric), "");

  useEffect(() => {
    if (!isInView || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    // Небольшая задержка, чтобы анимация началась после появления родительского блока
    const timer = setTimeout(() => {
      const controls = animate(0, numeric, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (v) => setDisplay(Math.round(v)),
      });

      return () => controls.stop();
    }, 400);

    return () => clearTimeout(timer);
  }, [isInView, numeric]);

  return (
    <span ref={ref} className={`inline-block ${className ?? ""}`}>
      {display}
      {suffix}
    </span>
  );
}
