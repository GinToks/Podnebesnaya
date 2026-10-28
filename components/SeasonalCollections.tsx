"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useEffect } from "react";
import { useCollectionStore } from "@/store/collectionStore";
import { useCatalogStore } from "@/store/catalogStore";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

const seasonColors: Record<string, string> = {
  spring: "#E8B4B8",
  summer: "#6B8A5E",
  autumn: "#B89B5E",
  winter: "#2E5C8A",
};

const seasonLabels: Record<string, string> = {
  spring: "Весна",
  summer: "Лето",
  autumn: "Осень",
  winter: "Зима",
};

export default function SeasonalCollections() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const { getActiveCollections, seed } = useCollectionStore();
  const { products } = useCatalogStore();
  useEffect(() => { seed(); }, [seed]);
  const collections = getActiveCollections();

  if (collections.length === 0) return null;

  return (
    <section ref={ref} className="py-24 bg-bg-elevated/60 relative overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none z-0 opacity-10">
        <svg viewBox="0 0 1440 400" fill="none" className="w-full h-full">
          <path d="M0 150 Q360 50 720 150 Q1080 250 1440 150" stroke="#E8B4B8" strokeWidth="2" fill="none" />
          <path d="M0 300 Q360 200 720 300 Q1080 400 1440 300" stroke="#6B8A5E" strokeWidth="1.5" fill="none" />
          <circle cx="300" cy="180" r="50" fill="#B89B5E" opacity="0.2" />
          <circle cx="900" cy="220" r="40" fill="#E8B4B8" opacity="0.2" />
        </svg>
      </motion.div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 rounded-full border border-sakura text-sakura-dark text-[11px] font-semibold uppercase tracking-widest mb-4">
            Коллекции
          </span>
          <h2 className="serif text-3xl sm:text-4xl font-light tracking-[0.1em] text-ink">
            Сезонные коллекции
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => {
            const collectionProducts = products.filter((p) => collection.productIds.includes(p.id));
            return (
              <motion.div
                key={collection.id}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                className="card-sakura-border bg-bg-elevated p-6 flex flex-col group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: seasonColors[collection.season] }}
                  />
                  <span className="text-xs font-medium text-ink-muted uppercase tracking-wider">
                    {seasonLabels[collection.season]}
                  </span>
                </div>
                <h3 className="serif text-xl font-light tracking-[0.08em] text-ink mb-2">
                  {collection.name}
                </h3>
                <p className="text-sm text-ink-muted mb-4 flex-1">{collection.description}</p>
                {collectionProducts.length > 0 && (
                  <div className="flex -space-x-2 mb-4">
                    {collectionProducts.slice(0, 4).map((p) => (
                      <div key={p.id} className="w-10 h-10 rounded-full border-2 border-bg-elevated overflow-hidden">
                        {p.images?.[0]?.url ? (
                          <Image src={p.images[0].url} alt={p.name} width={40} height={40} loading="lazy" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-mist" />
                        )}
                      </div>
                    ))}
                    {collectionProducts.length > 4 && (
                      <div className="w-10 h-10 rounded-full border-2 border-bg-elevated bg-mist flex items-center justify-center text-xs text-ink-muted">
                        +{collectionProducts.length - 4}
                      </div>
                    )}
                  </div>
                )}
                <Link
                  href="#catalog"
                  className="inline-flex items-center gap-1 text-sm text-accent font-medium hover:underline"
                >
                  Смотреть коллекцию <ChevronRight size={14} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}