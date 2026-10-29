"use client";
import { useState } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useCatalogStore } from "@/store/catalogStore";
import Link from "next/link";

const scentCategories = [
  { id: "woody", label: "Древесные", color: "#6B8A5E", icon: "🌲", description: "Кедр, сандал, пачули — тёплые и глубокие ароматы" },
  { id: "floral", label: "Цветочные", color: "#E8B4B8", icon: "🌸", description: "Роза, жасмин, пион — нежные и романтичные" },
  { id: "spicy", label: "Пряные", color: "#C41E3A", icon: "🌶️", description: "Корица, гвоздика, кардамон — тёплые и согревающие" },
  { id: "fresh", label: "Свежие", color: "#2E5C8A", icon: "🌊", description: "Цитрус, мята, океан — лёгкие и бодрящие" },
];

export default function ScentMap() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const { products } = useCatalogStore();
  const [active, setActive] = useState<string | null>(null);

  const activeCategory = scentCategories.find((c) => c.id === active);
  const filteredProducts = active ? products.filter((p) => p.category === active) : [];

  return (
    <section ref={ref} className="py-24 bg-bg-elevated/60 relative overflow-hidden">
      <m.div style={{ y }} className="absolute inset-0 pointer-events-none z-0 opacity-10">
        <svg viewBox="0 0 1440 400" fill="none" className="w-full h-full">
          <path d="M0 180 Q360 80 720 180 Q1080 280 1440 180" stroke="#2E5C8A" strokeWidth="2" fill="none" />
          <path d="M0 280 Q360 180 720 280 Q1080 380 1440 280" stroke="#E8B4B8" strokeWidth="1.5" fill="none" />
          <circle cx="400" cy="200" r="60" fill="#2E5C8A" opacity="0.15" />
          <circle cx="1000" cy="180" r="45" fill="#E8B4B8" opacity="0.15" />
        </svg>
      </m.div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 rounded-full border border-sakura text-sakura-dark text-[11px] font-semibold uppercase tracking-widest mb-4">
            Навигация
          </span>
          <h2 className="serif text-3xl sm:text-4xl font-light tracking-[0.1em] text-ink">
            Карта ароматов
          </h2>
          <p className="text-ink-muted mt-2 max-w-lg mx-auto">
            Выберите семейство ароматов, чтобы найти подходящие свечи
          </p>
        </div>

        {/* Scent category buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {scentCategories.map((cat) => (
            <m.button
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActive(active === cat.id ? null : cat.id)}
              className={`p-6 rounded-2xl border-2 transition-all text-center ${
                active === cat.id
                  ? "border-accent bg-accent/10 shadow-lg"
                  : "border-mist bg-bg-elevated hover:border-sky"
              }`}
            >
              <span className="text-3xl mb-2 block">{cat.icon}</span>
              <h3 className="serif text-lg font-light text-ink">{cat.label}</h3>
              <p className="text-xs text-ink-muted mt-1">{cat.description}</p>
              <span className="text-xs text-ink-muted mt-2 block">
                {products.filter((p) => p.category === cat.id).length} товаров
              </span>
            </m.button>
          ))}
        </div>

        {/* Filtered products */}
        {active && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="p-4 bg-bg border border-mist rounded-xl hover:border-accent transition-colors"
              >
                <h4 className="serif text-sm font-light text-ink">{product.name}</h4>
                <p className="text-xs text-ink-muted mt-1">{product.price.toLocaleString("ru-RU")} ₽</p>
              </Link>
            ))}
            {filteredProducts.length === 0 && (
              <p className="text-ink-muted text-sm col-span-full text-center py-8">
                Товаров в этой категории пока нет
              </p>
            )}
          </m.div>
        )}
      </div>
    </section>
  );
}