"use client";
import { m } from "framer-motion";

export default function LoadingAnimation() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg">
      <m.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <path d="M32 4 Q38 16 32 28 Q26 16 32 4Z" fill="#E8B4B8" opacity="0.8" />
          <path d="M32 28 Q42 36 32 56 Q22 36 32 28Z" fill="#D4949A" opacity="0.6" />
          <circle cx="32" cy="32" r="4" fill="#B89B5E" opacity="0.8" />
        </svg>
      </m.div>
    </div>
  );
}
