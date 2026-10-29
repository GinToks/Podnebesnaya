"use client";
import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { X, ShoppingCart, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import type { Product } from "@/data/products";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function QuickViewModal({
  isOpen,
  onClose,
  product,
}: QuickViewModalProps) {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

    if (!product || !product.notes) { return null; }

  const notes = [
    ...(product.notes.top || []),
    ...(product.notes.middle || []),
    ...(product.notes.base || []),
  ];

  return (
    <AnimatePresence>
      {isOpen ? (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <m.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 bg-bg-elevated border border-sky rounded-xl shadow-2xl flex flex-col gap-6"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-mist-strong transition-colors"
              aria-label="Закрыть просмотр"
            >
              <X size={20} strokeWidth={2} />
            </button>
            <div className="flex-shrink-0 w-full h-56 rounded-lg overflow-hidden bg-mist border border-mist flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                <defs>
                  <linearGradient id={`qv-grad-${product.id}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={product.accent} stopOpacity="0.55" />
                    <stop offset="100%" stopColor={product.accent} stopOpacity="0.12" />
                  </linearGradient>
                </defs>
                <rect width="200" height="200" rx="16" fill={`url(#qv-grad-${product.id})`} />
                <path d="M 100 160 L 100 100 Q 115 70 100 40 Q 85 70 100 100 L 100 160" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                <path d="M 86 122 Q 100 94 114 122" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
              </svg>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              {product.offer?.active && (
                <span className="inline-block py-1 px-3 rounded-full border border-sky/50 text-accent text-[11px] font-semibold uppercase tracking-widest mb-3">
                  {product.offer.label}
                </span>
              )}
              <m.h1
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 10 }}
                viewport={{ once: true }}
                className="serif text-2xl sm:text-3xl font-light tracking-[0.08em] leading-tight text-ink mb-2"
              >
                {product.name}
              </m.h1>
              <m.p
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-base text-ink-muted leading-relaxed mb-4 max-w-md"
              >
                {product.description}
              </m.p>
              <div className="space-y-3 mb-8">
                {notes.map((note) => (
                  <span
                    key={note}
                    className="px-3 py-1 rounded-full border border-sky/40 text-accent text-[11px] font-medium uppercase tracking-wider"
                  >
                    {note}
                  </span>
                ))}
              </div>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="serif text-2xl font-light text-ink">
                  {product.originalPrice && product.originalPrice !== product.price && (
                    <span className="serif text-lg font-light text-ink-muted line-through mr-2">
                      {product.originalPrice.toLocaleString("ru-RU")} ₽
                    </span>
                  )}
                  {product.price.toLocaleString("ru-RU")} ₽
                </span>
                <span className="text-xs text-ink-muted">за штуку</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  disabled={quantity <= 1 || product.stock <= 0}
                  className="w-10 h-10 rounded-full border border-mist flex items-center justify-center text-sm font-bold text-ink hover:bg-mist-strong disabled:opacity-40 transition-colors"
                >
                  <Minus size={16} strokeWidth={2} />
                </button>
                <span className="w-8 text-center text-sm font-medium text-ink">
                  {quantity}
                </span>
                <button
                  onClick={() => {
                    if (product.stock > 0 && quantity < product.stock) {
                      setQuantity((q) => q + 1);
                    }
                  }}
                  disabled={quantity >= product.stock || product.stock <= 0}
                  className="w-10 h-10 rounded-full border border-mist flex items-center justify-center text-sm font-bold text-ink hover:bg-mist-strong disabled:opacity-40 transition-colors"
                >
                  <Plus size={16} strokeWidth={2} />
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={product.stock <= 0 || added}
                className={`mt-6 w-full py-3.5 rounded-full flex items-center justify-center gap-2 font-medium text-sm tracking-wide uppercase transition-all disabled:opacity-40 ${
                  added ? "bg-olive text-bg" : "bg-accent text-bg hover:bg-accent-hover"
                }`}
              >
                {added ? (
                  <>
                    <ShoppingCart size={16} strokeWidth={2.5} /> В корзине
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} strokeWidth={2.5} />
                    {product.stock <= 0 ? "Нет в наличии" : "В корзину"}
                  </>
                )}
              </button>
              {product.stock <= 0 && (
                <p className="mt-3 text-xs text-accent text-center">
                  Товар закончился на складе
                </p>
              )}
              <p className="mt-4 text-xs text-ink-muted text-center">
                Остаток: {product.stock} шт.
              </p>
              <Link
                href={`/product/${product.id}`}
                className="mt-3 text-xs text-accent underline underline-offset-4 hover:text-accent-hover transition-colors"
              >
                Подробнее о товаре →
              </Link>
            </div>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
