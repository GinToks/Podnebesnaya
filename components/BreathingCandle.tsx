"use client";

export default function BreathingCandle({ className = "" }: { className?: string }) {
  return (
    <div className={`breathing-candle relative ${className}`}>
      <svg viewBox="0 0 60 100" fill="none" className="w-full h-full overflow-visible">
        <ellipse cx="30" cy="34" rx="16" ry="12" className="candle-glow" fill="#E8B4B8" />
        <g className="candle-wax">
          <rect x="22" y="60" width="16" height="35" rx="3" fill="#F5F0E8" stroke="#B89B5E" strokeWidth="1" />
          <rect x="24" y="62" width="12" height="31" rx="2" fill="#E8E0D5" />
        </g>
        <line x1="30" y1="60" x2="30" y2="50" stroke="#3D2B1F" strokeWidth="1.5" strokeLinecap="round" />
        <g className="candle-flame">
          <path d="M30 50 Q24 38 26 28 Q30 20 30 15 Q30 20 34 28 Q36 38 30 50Z" fill="#E8B4B8" opacity="0.55" />
          <path d="M30 50 Q26 40 27 32 Q30 25 30 22 Q30 25 33 32 Q34 40 30 50Z" fill="#D4949A" opacity="0.75" />
          <path d="M30 50 Q28 42 29 36 Q30 30 30 28 Q30 30 31 36 Q32 42 30 50Z" fill="#F5F0E8" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
}
