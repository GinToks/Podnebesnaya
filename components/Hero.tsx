"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useThemeStore } from "@/store/themeStore";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import QuizModal from "@/components/QuizModal";

export default function Hero() {
  const cartCount = useCartStore((state) => state.totalQuantity());
  const toggle = useCartStore((state) => state.toggle);
  const [mounted, setMounted] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const season = useThemeStore((state) => state.season);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 200]);
  const y2 = useTransform(scrollY, [0, 300], [0, -150]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative py-16 sm:py-20 lg:py-24">
      {/* Decorative bamboo branches */}
      <motion.div style={{ y: y1 }} className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none opacity-50">
        <svg viewBox="0 0 60 800" fill="none" className="h-full w-full">
          <path d="M30 0 Q25 100 30 200 Q35 300 28 400 Q22 500 30 600 Q38 700 30 800" stroke="#7A9A6E" strokeWidth="3" fill="none" />
          <path d="M30 100 Q10 90 5 80" stroke="#7A9A6E" strokeWidth="1.5" fill="none" />
          <path d="M30 250 Q50 240 55 230" stroke="#7A9A6E" strokeWidth="1.5" fill="none" />
          <path d="M30 400 Q10 390 5 380" stroke="#7A9A6E" strokeWidth="1.5" fill="none" />
          <path d="M30 550 Q50 540 55 530" stroke="#7A9A6E" strokeWidth="1.5" fill="none" />
          <path d="M30 700 Q10 690 5 680" stroke="#7A9A6E" strokeWidth="1.5" fill="none" />
        </svg>
      </motion.div>
      <motion.div style={{ y: y2 }} className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none opacity-50">
        <svg viewBox="0 0 60 800" fill="none" className="h-full w-full">
          <path d="M30 0 Q35 100 30 200 Q25 300 32 400 Q38 500 30 600 Q22 700 30 800" stroke="#7A9A6E" strokeWidth="3" fill="none" />
          <path d="M30 150 Q50 140 55 130" stroke="#7A9A6E" strokeWidth="1.5" fill="none" />
          <path d="M30 300 Q10 290 5 280" stroke="#7A9A6E" strokeWidth="1.5" fill="none" />
          <path d="M30 450 Q50 440 55 430" stroke="#7A9A6E" strokeWidth="1.5" fill="none" />
          <path d="M30 600 Q10 590 5 580" stroke="#7A9A6E" strokeWidth="1.5" fill="none" />
          <path d="M30 750 Q50 740 55 730" stroke="#7A9A6E" strokeWidth="1.5" fill="none" />
        </svg>
      </motion.div>

      {/* Falling seasonal particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-petal-fall"
            style={{
              left: `${10 + (i * 12) % 80}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${6 + (i % 4) * 0.5}s`,
            }}
          >
            {season === "spring" && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 0 Q8 3 6 6 Q4 3 6 0Z" fill="#F8A8C0" opacity="0.7" />
                <path d="M6 6 Q9 8 6 12 Q3 8 6 6Z" fill="#E888A0" opacity="0.5" />
              </svg>
            )}
            {season === "summer" && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1 Q10 3 9 6 Q8 9 6 10 Q4 9 3 6 Q2 3 6 1Z" fill="#4AA86E" opacity="0.7" />
                <path d="M6 1 Q6 5 6 10" stroke="#3A985E" strokeWidth="0.5" opacity="0.5" />
              </svg>
            )}
            {season === "autumn" && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 0 Q8.5 1.5 9.5 4 Q10.5 7 8.5 9.5 Q7 11.5 6 12 Q5 11.5 3.5 9.5 Q1.5 7 2.5 4 Q3.5 1.5 6 0Z" fill="#D46A28" opacity="0.7" />
                <path d="M6 0 Q6 6 6 12" stroke="#C45A18" strokeWidth="0.5" opacity="0.5" />
              </svg>
            )}
            {season === "winter" && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <line x1="6" y1="1" x2="6" y2="11" stroke="#6BA3D9" strokeWidth="1" opacity="0.7" />
                <line x1="1" y1="6" x2="11" y2="6" stroke="#6BA3D9" strokeWidth="1" opacity="0.7" />
                <line x1="2.5" y1="2.5" x2="9.5" y2="9.5" stroke="#6BA3D9" strokeWidth="0.8" opacity="0.6" />
                <line x1="9.5" y1="2.5" x2="2.5" y2="9.5" stroke="#6BA3D9" strokeWidth="0.8" opacity="0.6" />
                <circle cx="6" cy="6" r="1.2" fill="#88B8F0" opacity="0.8" />
              </svg>
            )}
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block py-1 px-3 rounded-full border border-sakura text-sakura-dark text-[11px] font-semibold uppercase tracking-widest mb-4">
              Новая коллекция
            </span>
            <motion.h1
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              className="serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-[0.12em] leading-tight mt-6 mb-6 text-ink"
            >
              Тихая гармония
            </motion.h1>
            <motion.p
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-lg text-ink-muted max-w-lg leading-relaxed mb-10"
            >
              Соединение азиатской философии и ароматов. Каждая свеча — это минутка тишины, огня и тумана. Вдохновлено красотой сакуры и спокойствием дзен-садов.
            </motion.p>
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              viewport={{ once: true }}
              className="flex items-center gap-3"
            >
              <Link
                href="#catalog"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-olive text-bg text-sm font-medium tracking-wide uppercase rounded-full hover:bg-olive-hover transition-colors"
              >
                Открыть коллекцию <ChevronRight size={16} />
              </Link>
              <button
                onClick={toggle}
                className="flex items-center gap-2 px-6 py-3.5 border border-sakura text-ink text-sm font-medium tracking-wide rounded-full hover:bg-sakura/20 transition-colors"
              >
                Корзина
                <span className={`text-[10px] ${mounted && cartCount === 0 ? "hidden" : "inline-block"}`}>
                  {mounted ? cartCount : 0}
                </span>
              </button>
              <button
                onClick={() => setQuizOpen(true)}
                className="flex items-center gap-2 px-6 py-3.5 border border-olive text-ink text-sm font-medium tracking-wide rounded-full hover:bg-olive/10 transition-colors"
              >
                Подобрать аромат
              </button>
            </motion.div>
          </div>
          <div className="relative h-64 sm:h-80 lg:h-96 flex items-center justify-center">
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-sakura/30 shadow-lg">
              <Image
                src="/IMG_7265.PNG"
                alt="Поднебесная - японская эстетика"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    <QuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
    </section>
  );
}