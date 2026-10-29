"use client";
import { useEffect, useState } from "react";

export default function BambooDecor() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Left bamboo branch */}
      <svg
        viewBox="0 0 80 1200"
        fill="none"
        className="absolute left-0 top-0 h-full w-20 opacity-20"
        preserveAspectRatio="xMinYMin slice"
      >
        <path d="M40 0 Q35 100 40 200 Q45 300 38 400 Q32 500 40 600 Q48 700 40 800 Q35 900 40 1000 Q45 1100 40 1200" stroke="var(--color-bamboo)" strokeWidth="4" fill="none" />
        <path d="M40 150 Q20 140 15 120" stroke="var(--color-bamboo)" strokeWidth="2" fill="none" />
        <path d="M40 300 Q60 290 65 270" stroke="var(--color-bamboo)" strokeWidth="2" fill="none" />
        <path d="M40 450 Q20 440 15 420" stroke="var(--color-bamboo)" strokeWidth="2" fill="none" />
        <path d="M40 600 Q60 590 65 570" stroke="var(--color-bamboo)" strokeWidth="2" fill="none" />
        <path d="M40 750 Q20 740 15 720" stroke="var(--color-bamboo)" strokeWidth="2" fill="none" />
        <path d="M40 900 Q60 890 65 870" stroke="var(--color-bamboo)" strokeWidth="2" fill="none" />
        <path d="M40 1050 Q20 1040 15 1020" stroke="var(--color-bamboo)" strokeWidth="2" fill="none" />
        {/* Bamboo nodes */}
        <ellipse cx="40" cy="200" rx="6" ry="3" fill="var(--color-bamboo)" opacity="0.3" />
        <ellipse cx="40" cy="400" rx="6" ry="3" fill="var(--color-bamboo)" opacity="0.3" />
        <ellipse cx="40" cy="600" rx="6" ry="3" fill="var(--color-bamboo)" opacity="0.3" />
        <ellipse cx="40" cy="800" rx="6" ry="3" fill="var(--color-bamboo)" opacity="0.3" />
        <ellipse cx="40" cy="1000" rx="6" ry="3" fill="var(--color-bamboo)" opacity="0.3" />
      </svg>

      {/* Right bamboo branch */}
      <svg
        viewBox="0 0 80 1200"
        fill="none"
        className="absolute right-0 top-0 h-full w-20 opacity-20"
        preserveAspectRatio="xMaxYMin slice"
      >
        <path d="M40 0 Q45 100 40 200 Q35 300 42 400 Q48 500 40 600 Q32 700 40 800 Q45 900 40 1000 Q35 1100 40 1200" stroke="var(--color-bamboo)" strokeWidth="4" fill="none" />
        <path d="M40 100 Q60 90 65 70" stroke="var(--color-bamboo)" strokeWidth="2" fill="none" />
        <path d="M40 250 Q20 240 15 220" stroke="var(--color-bamboo)" strokeWidth="2" fill="none" />
        <path d="M40 400 Q60 390 65 370" stroke="var(--color-bamboo)" strokeWidth="2" fill="none" />
        <path d="M40 550 Q20 540 15 520" stroke="var(--color-bamboo)" strokeWidth="2" fill="none" />
        <path d="M40 700 Q60 690 65 670" stroke="var(--color-bamboo)" strokeWidth="2" fill="none" />
        <path d="M40 850 Q20 840 15 820" stroke="var(--color-bamboo)" strokeWidth="2" fill="none" />
        <path d="M40 1000 Q60 990 65 970" stroke="var(--color-bamboo)" strokeWidth="2" fill="none" />
        <path d="M40 1150 Q20 1140 15 1120" stroke="var(--color-bamboo)" strokeWidth="2" fill="none" />
        <ellipse cx="40" cy="200" rx="6" ry="3" fill="var(--color-bamboo)" opacity="0.3" />
        <ellipse cx="40" cy="400" rx="6" ry="3" fill="var(--color-bamboo)" opacity="0.3" />
        <ellipse cx="40" cy="600" rx="6" ry="3" fill="var(--color-bamboo)" opacity="0.3" />
        <ellipse cx="40" cy="800" rx="6" ry="3" fill="var(--color-bamboo)" opacity="0.3" />
        <ellipse cx="40" cy="1000" rx="6" ry="3" fill="var(--color-bamboo)" opacity="0.3" />
      </svg>
    </div>
  );
}