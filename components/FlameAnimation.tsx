"use client";
import { m } from "framer-motion";

export default function FlameAnimation({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 60 100" fill="none" className="w-full h-full">
        {/* Candle body */}
        <rect x="22" y="60" width="16" height="35" rx="3" fill="#F5F0E8" stroke="#B89B5E" strokeWidth="1" />
        <rect x="24" y="62" width="12" height="31" rx="2" fill="#E8E0D5" />
        {/* Wick */}
        <line x1="30" y1="60" x2="30" y2="50" stroke="#3D2B1F" strokeWidth="1.5" strokeLinecap="round" />
        {/* Flame */}
        <m.g
          animate={{
            scaleY: [1, 1.15, 0.95, 1.1, 1],
            scaleX: [1, 0.9, 1.05, 0.95, 1],
            y: [0, -2, 1, -1, 0],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "30px", originY: "50px" }}
        >
          {/* Outer flame */}
          <m.path
            d="M30 50 Q24 38 26 28 Q30 20 30 15 Q30 20 34 28 Q36 38 30 50Z"
            fill="#E8B4B8"
            opacity={0.6}
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Middle flame */}
          <m.path
            d="M30 50 Q26 40 27 32 Q30 25 30 22 Q30 25 33 32 Q34 40 30 50Z"
            fill="#D4949A"
            opacity={0.8}
            animate={{ opacity: [0.7, 0.9, 0.7] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          {/* Inner flame */}
          <m.path
            d="M30 50 Q28 42 29 36 Q30 30 30 28 Q30 30 31 36 Q32 42 30 50Z"
            fill="#F5F0E8"
            opacity={0.9}
          />
          {/* Glow */}
          <m.circle
            cx="30"
            cy="35"
            r="12"
            fill="#E8B4B8"
            opacity={0.15}
            animate={{ r: [10, 14, 10], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </m.g>
      </svg>
    </div>
  );
}