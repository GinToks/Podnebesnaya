"use client";
import { AnimatePresence, motion } from "framer-motion";
import { X, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import Image from "next/image";
import Link from "next/link";

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WishlistModal({ isOpen, onClose }: WishlistModalProps) {
  const { items, removeItem, clear } = useWishlistStore();
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  const handleAddToCart = (product: any) => {
    addItem(product);
    addToast({ type: "success", title: "Добавлено в корзину", message: product.name });
  };

  const handleAddAll = () => {
    items.forEach((product) => addItem(product));
    addToast({ type: "success", title: "Все товары добавлены в корзину" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-bg-elevated shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-mist">
              <h2 className="serif text-xl font-light tracking-[0.1em] text-ink flex items-center gap-2">
                <Heart size={20} className="text-sakura-dark" /> Избранное
              </h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-mist transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <Heart size={48} className="mx-auto text-ink-muted mb-4" />
                  <p className="text-ink-muted text-lg mb-4">В избранном пока ничего нет</p>
                  <Link
                    href="/#catalog"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 text-accent font-medium hover:underline"
                  >
                    Перейти в каталог
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((product) => (
                    <div
                      key={product.id}
                      className="flex gap-4 p-3 bg-bg border border-mist rounded-xl"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-mist flex-shrink-0">
                        {product.images?.[0]?.url ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            width={64}
                            height={64}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Heart size={20} className="text-ink-muted" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="serif text-sm font-light text-ink truncate">{product.name}</h3>
                        <p className="text-xs text-ink-muted truncate">{product.description}</p>
                        <p className="text-sm font-medium text-ink mt-1">
                          {product.price.toLocaleString("ru-RU")} ₽
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="p-1.5 rounded-full bg-olive text-bg hover:bg-olive-hover transition-colors"
                          aria-label="Добавить в корзину"
                        >
                          <ShoppingCart size={14} />
                        </button>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="p-1.5 rounded-full border border-mist text-ink-muted hover:text-accent hover:border-accent transition-colors"
                          aria-label="Удалить"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-mist">
                <div className="flex gap-3">
                  <button
                    onClick={handleAddAll}
                    className="flex-1 py-3 rounded-full bg-olive text-bg text-sm font-medium tracking-wide uppercase hover:bg-olive-hover transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} /> Все в корзину
                  </button>
                  <button
                    onClick={clear}
                    className="px-6 py-3 rounded-full border border-accent text-accent text-sm font-medium tracking-wide uppercase hover:bg-accent hover:text-bg transition-colors"
                  >
                    Очистить
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}