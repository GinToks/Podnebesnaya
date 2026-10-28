"use client";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";

export default function WishlistPage() {
  const { items, clear, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  const handleAddAll = () => {
    items.forEach((product) => addItem(product));
    addToast({ type: "success", title: "Все товары добавлены в корзину" });
  };

  return (
    <section className="py-20 sm:py-28 lg:py-36 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="serif text-3xl sm:text-4xl font-light tracking-[0.1em] text-ink">
            Избранное
          </h1>
          {items.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={handleAddAll}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-olive text-bg text-sm font-medium tracking-wide uppercase rounded-full hover:bg-olive-hover transition-colors"
              >
                <ShoppingCart size={16} /> В корзину всё
              </button>
              <button
                onClick={clear}
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-accent text-accent text-sm font-medium tracking-wide uppercase rounded-full hover:bg-accent hover:text-bg transition-colors"
              >
                Очистить
              </button>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="mx-auto text-ink-muted mb-4" />
            <p className="text-ink-muted text-lg mb-4">В избранном пока ничего нет</p>
            <Link
              href="/#catalog"
              className="inline-flex items-center gap-2 text-accent font-medium hover:underline"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} onQuickView={() => {}} />
                <button
                  onClick={() => removeItem(product.id)}
                  className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-bg-elevated border border-mist flex items-center justify-center text-accent hover:bg-accent hover:text-bg transition-colors"
                  aria-label="Удалить из избранного"
                >
                  <Heart size={14} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}