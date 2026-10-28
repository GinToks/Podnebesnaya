"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Flame, Cloud, Moon } from "lucide-react";

const symbols = [
  {
    icon: Flame,
    label: "Огонь",
    text: "Жизненная сила и тепло, которое зажигает внутри.",
  },
  {
    icon: Cloud,
    label: "Туман",
    text: "Граница между реальностью и мечтой, лёгкость бытия.",
  },
  {
    icon: Moon,
    label: "Тишина",
    text: "Мгновение, когда можно услышать себя.",
  },
];

export default function Philosophy() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  return (
    <section id="philosophy" ref={ref} className="py-24 bg-bg-elevated/60 relative overflow-hidden">
      {/* Parallax background */}
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none z-0 opacity-10">
        <svg viewBox="0 0 1440 400" fill="none" className="w-full h-full">
          <path d="M0 200 Q360 100 720 200 Q1080 300 1440 200" stroke="#6B8A5E" strokeWidth="2" fill="none" />
          <path d="M0 250 Q360 150 720 250 Q1080 350 1440 250" stroke="#E8B4B8" strokeWidth="1.5" fill="none" />
          <circle cx="200" cy="180" r="40" fill="#E8B4B8" opacity="0.3" />
          <circle cx="720" cy="200" r="60" fill="#6B8A5E" opacity="0.2" />
          <circle cx="1200" cy="170" r="35" fill="#2E5C8A" opacity="0.2" />
        </svg>
      </motion.div>
      {/* Sakura petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-petal-fall"
            style={{
              left: `${(i * 13 + 7) % 95}%`,
              top: `${-10 - (i * 4) % 20}%`,
              animationDelay: `${(i * 0.9) % 7}s`,
              animationDuration: `${7 + (i % 3) * 2}s`,
            }}
          >
            <svg width={12 + (i % 4) * 3} height={12 + (i % 4) * 3} viewBox="0 0 14 14" fill="none">
              <path d="M7 0 Q9 3.5 7 7 Q5 3.5 7 0Z" fill="#E8B4B8" opacity="0.7" />
              <path d="M7 7 Q10 9.5 7 14 Q4 9.5 7 7Z" fill="#D4949A" opacity="0.5" />
            </svg>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-20">
          <span className="inline-block py-1 px-3 rounded-full border border-sakura text-sakura-dark text-[11px] font-semibold uppercase tracking-widest mb-4">
            Философия
          </span>
          <motion.h2
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 14 }}
            viewport={{ once: true }}
            className="serif text-3xl sm:text-4xl font-light tracking-[0.1em] mt-4 mb-6 text-ink"
          >
            Между огнём и туманом
          </motion.h2>
          <motion.p
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 14 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            viewport={{ once: true }}
            className="text-ink-muted leading-relaxed"
          >
            Мы верим, что аромат способен перенести в другое состояние. Поднебесная — это свечи, созданные в духе азиатской философии: спокойствие, внимание к детали и уважение к природе.
          </motion.p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {symbols.map((symbol, idx) => {
            const colorClasses = [
              "bg-olive/10 text-olive group-hover:bg-olive group-hover:text-bg",
              "bg-sakura/20 text-sakura-dark group-hover:bg-sakura-dark group-hover:text-bg",
              "bg-sky/10 text-sky group-hover:bg-sky group-hover:text-bg",
            ];
            const colorClass = colorClasses[idx % colorClasses.length];
            return (
              <motion.div
                key={symbol.label}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
                initial={{ opacity: 0, y: 14 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-4 p-8 rounded-xl border border-mist bg-bg-elevated group hover:border-sakura transition-colors"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${colorClass} transition-colors`}>
                  <symbol.icon size={24} strokeWidth={2} />
                </div>
                <h3 className="serif text-xl font-light tracking-[0.08em] text-ink">
                  {symbol.label}
                </h3>
                <p className="text-sm text-ink-muted text-center leading-relaxed max-w-xs">
                  {symbol.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}