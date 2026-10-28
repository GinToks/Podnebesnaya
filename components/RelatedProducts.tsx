"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";

interface RelatedProductsProps {
  products: Product[];
  excludeId: string;
}

export default function RelatedProducts({
  products,
  excludeId,
}: RelatedProductsProps) {
  const related = products.filter((p) => p.id !== excludeId).slice(0, 4);

  return (
    <section className="py-20 border-t border-mist">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="serif text-2xl font-light tracking-[0.1em] text-ink mb-8">
          Вам также может понравиться
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((product) => (
            <motion.div
              key={product.id}
              whileInView={{ y: [20, 0], opacity: [0, 1], transition: { duration: 0.6 } }}
              initial={{ y: 20, opacity: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="card-blue-border bg-bg-elevated p-6 flex flex-col h-full cursor-pointer"
            >
              <Link href={`/product/${product.id}`} className="block">
                <div className="h-40 rounded-lg overflow-hidden mb-4 bg-mist flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                    <defs>
                      <linearGradient id={`rel-grad-${product.id}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={product.accent} stopOpacity="0.55" />
                        <stop offset="100%" stopColor={product.accent} stopOpacity="0.12" />
                      </linearGradient>
                    </defs>
                    <rect width="200" height="200" rx="16" fill={`url(#rel-grad-${product.id})`} />
                    <path d="M 100 160 L 100 100 Q 115 70 100 40 Q 85 70 100 100 L 100 160" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                    <path d="M 86 122 Q 100 94 114 122" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
                  </svg>
                </div>
                <h3 className="serif text-lg font-light tracking-[0.06em] text-ink mb-1">{product.name}</h3>
                <p className="text-sm text-ink-muted mb-3">{product.description}</p>
                <span className="text-sm font-medium text-ink">
                  {product.price.toLocaleString("ru-RU")} ₽
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
