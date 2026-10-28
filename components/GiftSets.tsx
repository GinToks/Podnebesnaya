"use client";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Gift, ShoppingCart } from "lucide-react";
import { useGiftSetStore } from "@/store/giftSetStore";
import { useCatalogStore } from "@/store/catalogStore";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import type { Product } from "@/data/products";

export default function GiftSets() {
  const { sets, getActiveSets } = useGiftSetStore();
  const { seed: seedCatalog } = useCatalogStore();
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();
  useEffect(() => { seedCatalog(); }, [seedCatalog]);

  const activeSets = getActiveSets();
  if (activeSets.length === 0) return null;

  const addToCart = (gs: any) => {
    const product: Product = {
      id: `giftset-${gs.id}`,
      name: gs.name,
      description: gs.description,
      fullDescription: gs.description,
      notes: { top: [], middle: [], base: [] },
      price: gs.price,
      category: "fresh",
      legend: "",
      accent: "#C41E3A",
      images: gs.image ? [{ id: "main", url: gs.image, alt: gs.name }] : [],
      stock: 999,
    };
    addItem(product, 1);
  };

  return (
    <section className="py-24 bg-bg-elevated/60 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 rounded-full border border-sakura text-sakura-dark text-[11px] font-semibold uppercase tracking-widest mb-4">
            Подарки
          </span>
          <h2 className="serif text-3xl sm:text-4xl font-light tracking-[0.1em] text-ink">
            Подарочные наборы
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeSets.map((gs) => (
            <div key={gs.id} className="card-sakura-border bg-bg-elevated p-6 flex flex-col">
              <div className="w-full h-40 rounded-xl overflow-hidden border border-mist bg-mist mb-4">
                {gs.image ? (
                  <Image src={gs.image} alt={gs.name} width={320} height={160} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Gift size={32} className="text-ink-muted" />
                  </div>
                )}
              </div>
              <h3 className="serif text-xl font-light tracking-[0.08em] text-ink mb-2">{gs.name}</h3>
              <p className="text-sm text-ink-muted mb-4 flex-1">{gs.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="serif text-2xl font-light text-ink">{gs.price.toLocaleString("ru-RU")} ₽</span>
                <button
                  onClick={() => addToCart(gs)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors"
                >
                  <ShoppingCart size={14} /> В корзину
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
