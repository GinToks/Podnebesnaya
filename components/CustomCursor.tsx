"use client";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const leave = () => setVisible(false);
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-transform duration-75"
      style={{ left: pos.x - 12, top: pos.y - 12 }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 1 Q16 6 12 12 Q8 6 12 1Z"
          fill="var(--color-accent, #6B8A5E)"
          stroke="#ffffff"
          strokeWidth="1.2"
          opacity="0.95"
        />
        <path
          d="M12 12 Q17 15 12 23 Q7 15 12 12Z"
          fill="var(--color-accent-hover, #5A7A4E)"
          stroke="#ffffff"
          strokeWidth="1.2"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
