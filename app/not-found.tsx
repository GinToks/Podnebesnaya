"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative z-10">
      <div className="text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="serif text-8xl sm:text-9xl font-light text-sakura-dark mb-4">
            404
          </h1>
          <p className="serif text-2xl sm:text-3xl font-light text-ink mb-2">
            Страница не найдена
          </p>
          <p className="text-ink-muted max-w-md mx-auto mb-8">
            Похоже, эта страница улетела вместе с лепестками сакуры. Но не волнуйтесь — мы поможем вам вернуться.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-olive text-bg text-sm font-medium tracking-wide uppercase rounded-full hover:bg-olive-hover transition-colors"
            >
              <Home size={16} /> На главную
            </Link>
            <Link
              href="/#catalog"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-sakura text-ink text-sm font-medium tracking-wide uppercase rounded-full hover:bg-sakura/20 transition-colors"
            >
              <Search size={16} /> В каталог
            </Link>
          </div>
        </motion.div>

        {/* Decorative sakura branch */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-20">
          <svg viewBox="0 0 1440 200" fill="none" className="w-full">
            <path d="M0 200 Q200 120 400 160 Q600 100 800 140 Q1000 80 1200 130 Q1350 90 1440 120" stroke="#7A9A6E" strokeWidth="2" fill="none" />
            <circle cx="200" cy="140" r="6" fill="#E8B4B8" opacity="0.6" />
            <circle cx="400" cy="150" r="5" fill="#E8B4B8" opacity="0.5" />
            <circle cx="600" cy="110" r="7" fill="#E8B4B8" opacity="0.6" />
            <circle cx="800" cy="130" r="5" fill="#E8B4B8" opacity="0.5" />
            <circle cx="1000" cy="90" r="6" fill="#E8B4B8" opacity="0.6" />
            <circle cx="1200" cy="120" r="5" fill="#E8B4B8" opacity="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}