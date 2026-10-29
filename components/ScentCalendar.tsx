"use client";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { useScentCalendarStore } from "@/store/scentCalendarStore";
import { useCatalogStore } from "@/store/catalogStore";

export default function ScentCalendar() {
  const { getScent } = useScentCalendarStore();
  const { products, fetchProducts: seed } = useCatalogStore();
  useEffect(() => { seed(); }, [seed]);

  const today = new Date().toISOString().slice(0, 10);
  const productId = getScent(today);
  let product = productId ? products.find((p) => p.id === productId) : undefined;
  if (!product && products.length > 0) {
    const start = new Date(new Date().getFullYear(), 0, 0).getTime();
    const dayOfYear = Math.floor((Date.now() - start) / 86400000);
    product = products[dayOfYear % products.length];
  }
  if (!product) return null;

  return (
    <section className="py-12 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-bg-elevated border border-mist rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-xl overflow-hidden border border-mist bg-mist flex-shrink-0">
            {product.images?.[0]?.url ? (
              <Image src={product.images[0].url} alt={product.name} width={96} height={96} loading="lazy" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-mist" />
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-sakura-dark mb-1">
              <Sparkles size={12} /> Аромат дня
            </span>
            <h3 className="serif text-xl font-light tracking-[0.08em] text-ink">{product.name}</h3>
            <p className="text-sm text-ink-muted mt-1">{product.description}</p>
          </div>
          <Link
            href="#catalog"
            className="px-5 py-2.5 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors"
          >
            Смотреть
          </Link>
        </div>
      </div>
    </section>
  );
}
