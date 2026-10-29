"use client";
import { useState } from "react";
import Link from "next/link";
import { m, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Plus, Check, ExternalLink, Heart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onQuickView,
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const notes = product?.notes ? [...product.notes.top, ...product.notes.middle, ...product.notes.base] : [];
  const inStock = product.stock > 0;
  const reduceMotion = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 220, damping: 24 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 220, damping: 24 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <m.div
      style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileInView={{ y: [40, 0], opacity: [0, 1], scale: [0.95, 1], transition: { duration: 0.6, ease: "easeOut" } }}
      initial={{ y: 40, opacity: 0, scale: 0.95 }}
      viewport={{ once: true }}
      whileHover={reduceMotion ? undefined : { y: -6, scale: 1.02 }}
      className="glass-card card-sakura-border p-4 flex flex-col group cursor-pointer w-full aspect-square"
      onClick={() => onQuickView?.(product)}
    >
      <div className="flex-1 flex flex-col">
        <div className="relative flex-1 rounded-xl overflow-hidden mb-3 bg-mist flex items-center justify-center">
          {product.images?.[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt || product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              loading="lazy"
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full relative">
              <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                <defs>
                  <linearGradient id={`grad-${product.id}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={product.accent} stopOpacity="0.55" />
                    <stop offset="100%" stopColor={product.accent} stopOpacity="0.12" />
                  </linearGradient>
                </defs>
                <rect width="200" height="200" rx="16" fill={`url(#grad-${product.id})`} />
                <path d="M 100 160 L 100 100 Q 115 70 100 40 Q 85 70 100 100 L 100 160" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                <path d="M 86 122 Q 100 94 114 122" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-sakura/20 via-transparent to-transparent" />
            </div>
          )}
          {product.offer?.active && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-olive text-bg text-[9px] font-bold tracking-wide uppercase shadow-sm">
              {product.offer.label}
            </span>
          )}
          {!inStock && (
            <div className="absolute bottom-2 left-2 right-2">
              <span className="inline-block px-2 py-0.5 rounded-full bg-sakura-dark text-bg text-[9px] font-bold tracking-wide uppercase shadow-sm">
                Нет в наличии
              </span>
            </div>
          )}
        </div>
        <m.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            if (inWishlist) removeFromWishlist(product.id);
            else addToWishlist(product);
          }}
          className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-bg-elevated/80 backdrop-blur border border-mist flex items-center justify-center transition-colors"
          aria-label={inWishlist ? "Удалить из избранного" : "Добавить в избранное"}
        >
          <m.span
            key={inWishlist ? "in" : "out"}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Heart size={14} className={inWishlist ? "text-sakura-dark fill-sakura-dark" : "text-ink-muted"} />
          </m.span>
        </m.button>
        <h3 className="serif text-sm font-light tracking-[0.06em] text-ink mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-[10px] text-ink-muted leading-relaxed mb-2 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {product.originalPrice && product.originalPrice !== product.price && (
              <span className="text-[10px] text-ink-muted line-through">
                {product.originalPrice.toLocaleString("ru-RU")} ₽
              </span>
            )}
            <span className="text-xs font-medium text-ink">
              {product.price.toLocaleString("ru-RU")} ₽
            </span>
          </div>
          <m.button
            whileTap={{ scale: 0.92 }}
            onClick={(e) => {
              e.stopPropagation();
              handleAdd();
            }}
            disabled={!inStock || added}
            aria-label={`Добавить в корзину ${product.name}`}
            className={`px-3 py-1 rounded-full flex items-center justify-center gap-1 font-medium text-[10px] tracking-wide transition-all disabled:opacity-40 ${
              added ? "bg-olive text-bg" : "bg-accent text-bg hover:bg-accent-hover"
            }`}
          >
            {added ? <Check size={10} strokeWidth={2.5} /> : <Plus size={10} strokeWidth={2.5} />}
            <span>{!inStock ? "Нет" : added ? "✓" : "В корзину"}</span>
          </m.button>
        </div>
        <Link
          href={`/product/${product.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-[10px] text-sky hover:text-sky-hover transition-colors flex items-center gap-1 mt-1"
        >
          Подробнее <ExternalLink size={8} />
        </Link>
      </div>
    </m.div>
  );
}