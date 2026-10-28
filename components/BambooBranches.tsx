"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface BambooBranchesProps {
  opacity?: number;
  side?: "both" | "left" | "right";
}

export default function BambooBranches({ opacity = 0.15, side = "both" }: BambooBranchesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <motion.div ref={ref} style={{ y }} className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {(side === "both" || side === "left") && (
        <svg
          viewBox="0 0 60 400"
          fill="none"
          className="absolute left-0 top-0 h-full w-16"
          style={{ opacity }}
          preserveAspectRatio="xMinYMin slice"
        >
          <path d="M30 0 Q25 50 30 100 Q35 150 28 200 Q22 250 30 300 Q38 350 30 400" stroke="#7A9A6E" strokeWidth="3" fill="none" />
          <path d="M30 60 Q15 50 10 35" stroke="#7A9A6E" strokeWidth="1.5" fill="none" />
          <path d="M30 140 Q45 130 50 110" stroke="#7A9A6E" strokeWidth="1.5" fill="none" />
          <path d="M30 220 Q15 210 10 190" stroke="#7A9A6E" strokeWidth="1.5" fill="none" />
          <path d="M30 300 Q45 290 50 270" stroke="#7A9A6E" strokeWidth="1.5" fill="none" />
          <path d="M30 380 Q15 370 10 350" stroke="#7A9A6E" strokeWidth="1.5" fill="none" />
          <ellipse cx="30" cy="100" rx="5" ry="2.5" fill="#7A9A6E" opacity="0.4" />
          <ellipse cx="30" cy="200" rx="5" ry="2.5" fill="#7A9A6E" opacity="0.4" />
          <ellipse cx="30" cy="300" rx="5" ry="2.5" fill="#7A9A6E" opacity="0.4" />
        </svg>
      )}
      {(side === "both" || side === "right") && (
        <svg
          viewBox="0 0 60 400"
          fill="none"
          className="absolute right-0 top-0 h-full w-16"
          style={{ opacity }}
          preserveAspectRatio="xMaxYMin slice"
        >
          <path d="M30 0 Q35 50 30 100 Q25 150 32 200 Q38 250 30 300 Q22 350 30 400" stroke="#7A9A6E" strokeWidth="3" fill="none" />
          <path d="M30 40 Q50 30 55 10" stroke="#7A9A6E" strokeWidth="1.5" fill="none" />
          <path d="M30 120 Q10 110 5 90" stroke="#7A9A6E" strokeWidth="1.5" fill="none" />
          <path d="M30 200 Q50 190 55 170" stroke="#7A9A6E" strokeWidth="1.5" fill="none" />
          <path d="M30 280 Q10 270 5 250" stroke="#7A9A6E" strokeWidth="1.5" fill="none" />
          <path d="M30 360 Q50 350 55 330" stroke="#7A9A6E" strokeWidth="1.5" fill="none" />
          <ellipse cx="30" cy="100" rx="5" ry="2.5" fill="#7A9A6E" opacity="0.4" />
          <ellipse cx="30" cy="200" rx="5" ry="2.5" fill="#7A9A6E" opacity="0.4" />
          <ellipse cx="30" cy="300" rx="5" ry="2.5" fill="#7A9A6E" opacity="0.4" />
        </svg>
      )}
    </motion.div>
  );
}