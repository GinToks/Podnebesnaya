"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gift, ShoppingCart, Sparkles, PackageOpen } from "lucide-react";
import Header from "@/components/Header";
import PromoBanner from "@/components/PromoBanner";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { useCatalogStore } from "@/store/catalogStore";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import type { Product } from "@/data/products";

const SURPRISE_PRICE = 9900;
const INDIVIDUAL_ESTIMATE = 13500;

export default function SurpriseBoxPage() {
  const { products, fetchProducts } = useCatalogStore();
  const { addItem, open } = useCartStore();
  const { addToast } = useToastStore();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleBuy = () => {
    const pool = products.filter((p: Product) => (p.stock ?? 0) > 0);
    if (pool.length < 3) {
      addToast({ type: "error", title: "Недостаточно товаров для сюрприза" });
      return;
    }
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, 3);
    chosen.forEach((p) => addItem(p, 1));
    open();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    addToast({
      type: "success",
      title: "Сюрприз-бокс добавлен",
      message: "3 случайные свечи уже в корзине",
    });
  };

  return (
    <div className="relative z-10">
      <PromoBanner />
      <Header />
      <main>
        <section className="py-16 sm:py-24 lg:py-32 relative z-10 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/#catalog"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent mb-8 hover:underline transition-colors"
            >
              ← В каталог
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative flex items-center justify-center"
              >
                <div className="relative w-80 h-80 sm:w-96 sm:h-96">
                  <div className="absolute inset-0 rounded-full bg-sakura/30 blur-3xl animate-pulse-slow" />
                  <svg viewBox="0 0 200 200" className="relative w-full h-full drop-shadow-xl animate-float">
                    <defs>
                      <linearGradient id="boxGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#E8B4B8" />
                        <stop offset="100%" stopColor="#D4949A" />
                      </linearGradient>
                      <linearGradient id="lidGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#B89B5E" />
                        <stop offset="100%" stopColor="#A08550" />
                      </linearGradient>
                    </defs>
                    <rect x="30" y="80" width="140" height="90" rx="12" fill="url(#boxGrad)" stroke="#C41E3A" strokeWidth="1.5" opacity="0.95" />
                    <rect x="24" y="62" width="152" height="24" rx="8" fill="url(#lidGrad)" />
                    <rect x="92" y="62" width="16" height="108" fill="#C41E3A" opacity="0.35" />
                    <rect x="24" y="70" width="152" height="8" fill="#C41E3A" opacity="0.35" />
                    <circle cx="100" cy="56" r="10" fill="#C41E3A" />
                    <path d="M100 56 Q85 40 70 50 Q85 52 100 56" fill="#E8B4B8" />
                    <path d="M100 56 Q115 40 130 50 Q115 52 100 56" fill="#E8B4B8" />
                    <text x="100" y="140" textAnchor="middle" fontSize="46" fontWeight="300" fill="#3D2B1F" opacity="0.85" fontFamily="serif">
                      ?
                    </text>
                  </svg>
                  <Sparkles className="absolute -top-2 -right-2 text-gold animate-pulse" size={28} />
                  <Sparkles className="absolute bottom-4 -left-4 text-sakura-dark animate-pulse" size={22} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="inline-block py-1 px-3 rounded-full border border-sakura text-sakura-dark text-[11px] font-semibold uppercase tracking-widest mb-4">
                  Сюрприз
                </span>
                <h1 className="serif text-4xl sm:text-5xl font-light tracking-[0.1em] leading-tight text-ink mb-6">
                  Сюрприз-бокс
                </h1>
                <p className="text-lg text-ink-muted leading-relaxed mb-8 max-w-xl">
                  Мистическая коробочка с тремя случайными авторскими свечами.
                  Вы не знаете, какие ароматы попадутся — именно в этом и магия.
                  Каждый бокс уникален, как и ваш вечер.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 p-4 bg-bg-elevated border border-mist rounded-xl">
                    <PackageOpen size={20} className="text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-ink">Что внутри</p>
                      <p className="text-sm text-ink-muted">3 случайные свечи из коллекции «Поднебесная»</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-bg-elevated border border-mist rounded-xl">
                    <Gift size={20} className="text-sakura-dark mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-ink">Уникальность</p>
                      <p className="text-sm text-ink-muted">Комбинация собирается случайно при каждом заказе</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-bg-elevated border border-mist rounded-xl">
                    <Sparkles size={20} className="text-gold mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-ink">Выгода</p>
                      <p className="text-sm text-ink-muted">
                        Обычная цена трёх свечей ~{INDIVIDUAL_ESTIMATE.toLocaleString("ru-RU")} ₽
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-8 flex items-baseline gap-3">
                  <span className="serif text-ink-muted text-xl line-through">
                    {INDIVIDUAL_ESTIMATE.toLocaleString("ru-RU")} ₽
                  </span>
                  <span className="serif text-4xl font-light text-ink">
                    {SURPRISE_PRICE.toLocaleString("ru-RU")} ₽
                  </span>
                  <span className="text-xs text-ink-muted">за 3 свечи</span>
                </div>

                <button
                  onClick={handleBuy}
                  disabled={added}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-accent text-bg text-sm font-medium tracking-wide uppercase hover:bg-accent-hover disabled:opacity-60 transition-colors shadow-lg"
                >
                  <ShoppingCart size={18} strokeWidth={2} />
                  {added ? "Добавлено!" : "Купить сюрприз-бокс"}
                </button>

                <p className="text-xs text-ink-muted mt-4">
                  Нажимая кнопку, вы добавляете 3 случайные свечи в корзину по специальной цене.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <CartDrawer />
      <Footer />
    </div>
  );
}
