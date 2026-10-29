"use client";
import { useEffect, useState } from "react";
import { useThemeStore } from "@/store/themeStore";

function SpringPetal({ size, opacity }: { size: number; opacity: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M7 0 Q9 3.5 7 7 Q5 3.5 7 0Z" fill="#F8A8C0" opacity={opacity} />
      <path d="M7 7 Q10 9.5 7 14 Q4 9.5 7 7Z" fill="#E888A0" opacity={opacity * 0.7} />
    </svg>
  );
}

function SummerLeaf({ size, opacity }: { size: number; opacity: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M7 1 Q12 4 11 8 Q10 12 7 13 Q4 12 3 8 Q2 4 7 1Z" fill="#4AA86E" opacity={opacity} />
      <path d="M7 1 Q7 7 7 13" stroke="#3A985E" strokeWidth="0.5" opacity={opacity * 0.6} />
    </svg>
  );
}

function AutumnLeaf({ size, opacity }: { size: number; opacity: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M7 0 Q10 2 11 5 Q12 8 10 11 Q8 13 7 14 Q6 13 4 11 Q2 8 3 5 Q4 2 7 0Z" fill="#D46A28" opacity={opacity} />
      <path d="M7 0 Q7 7 7 14" stroke="#C45A18" strokeWidth="0.5" opacity={opacity * 0.6} />
      <path d="M7 4 Q5 6 3 7" stroke="#C45A18" strokeWidth="0.4" opacity={opacity * 0.4} />
      <path d="M7 4 Q9 6 11 7" stroke="#C45A18" strokeWidth="0.4" opacity={opacity * 0.4} />
    </svg>
  );
}

function WinterSnowflake({ size, opacity }: { size: number; opacity: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <line x1="7" y1="1" x2="7" y2="13" stroke="#6BA3D9" strokeWidth="1" opacity={opacity} />
      <line x1="1" y1="7" x2="13" y2="7" stroke="#6BA3D9" strokeWidth="1" opacity={opacity} />
      <line x1="3" y1="3" x2="11" y2="11" stroke="#6BA3D9" strokeWidth="0.8" opacity={opacity * 0.8} />
      <line x1="11" y1="3" x2="3" y2="11" stroke="#6BA3D9" strokeWidth="0.8" opacity={opacity * 0.8} />
      <circle cx="7" cy="7" r="1.5" fill="#88B8F0" opacity={opacity} />
    </svg>
  );
}

const particleComponents: Record<string, React.ComponentType<{ size: number; opacity: number }>> = {
  spring: SpringPetal,
  summer: SummerLeaf,
  autumn: AutumnLeaf,
  winter: WinterSnowflake,
};

export default function SakuraPetals() {
  const [mounted, setMounted] = useState(false);
  const season = useThemeStore((state) => state.season);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const Particle = particleComponents[season] || SpringPetal;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {[...Array(20)].map((_, i) => {
        const size = 10 + (i % 5) * 4;
        const opacity = 0.3 + (i % 4) * 0.15;
        return (
          <div
            key={i}
            className="absolute animate-petal-fall"
            style={{
              left: `${(i * 7 + 3) % 95}%`,
              top: `${-15 - (i * 3) % 25}%`,
              animationDelay: `${(i * 0.7) % 10}s`,
              animationDuration: `${7 + (i % 5) * 1.5}s`,
            }}
          >
            <Particle size={size} opacity={opacity} />
          </div>
        );
      })}
    </div>
  );
}