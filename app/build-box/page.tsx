"use client";

import { useEffect, useState } from "react";
import { useCatalogStore } from "@/store/catalogStore";
import { useCartStore } from "@/store/cartStore";
import { usePromoStore } from "@/store/promoStore";
import { useToastStore } from "@/store/toastStore";
import Link from "next/link";
import Image from "next/image";

export default function BuildBoxPage() {
  const { products, fetchProducts } = useCatalogStore();
  const { addItem, open } = useCartStore();
  const { codes, addCode, getCode } = usePromoStore();
  const { addToast } = useToastStore();
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
    if (!getCode("BOX3")) {
      addCode({
        code: "BOX3",
        type: "percent",
        value: 15,
        maxUses: 999999,
        active: true,
        label: "Скидка 15% на бокс из 3 свечей",
      });
    }
  }, [fetchProducts, getCode, addCode]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
  };

  const handleAdd = () => {
    if (selected.length !== 3) {
      addToast({ type: "error", title: "Выберите 3 свечи", message: "В боксе должно быть ровно 3 товара" });
      return;
    }
    const chosen = products.filter((p) => selected.includes(p.id));
    for (const p of chosen) addItem(p, 1);
    open();
    addToast({ type: "success", title: "Бокс добавлен", message: "Используйте промокод BOX3 для скидки 15%" });
  };

  const total = products
    .filter((p) => selected.includes(p.id))
    .reduce((s, p) => s + p.price, 0);

  return (
    <main className="min-h-screen bg-bg text-ink px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-sm text-accent hover:underline">← На главную</Link>
        <h1 className="serif text-3xl font-light tracking-[0.1em] mt-4 mb-2">Собери свой бокс</h1>
        <p className="text-sm text-ink-muted mb-6">
          Выберите 3 свечи — получите скидку 15% по промокоду BOX3. Выбрано: {selected.length}/3
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {products.map((p) => {
            const isSel = selected.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                className={`text-left rounded-xl border p-3 transition ${isSel ? "border-accent ring-2 ring-accent/30" : "border-mist"}`}
              >
                <div className="relative aspect-square mb-2 rounded-lg overflow-hidden bg-mist">
                  {p.images?.[0]?.url && (
                    <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />
                  )}
                </div>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-ink-muted">{p.price.toLocaleString("ru-RU")} ₽</p>
              </button>
            );
          })}
        </div>

        <div className="sticky bottom-4 bg-bg-elevated border border-mist rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-sm">Итого без скидки: {total.toLocaleString("ru-RU")} ₽</p>
            <p className="text-xs text-accent">С промокодом BOX3: {Math.round(total * 0.85).toLocaleString("ru-RU")} ₽</p>
          </div>
          <button
            onClick={handleAdd}
            disabled={selected.length !== 3}
            className="px-6 py-2.5 rounded-full bg-accent text-bg text-sm font-medium disabled:opacity-50"
          >
            Добавить бокс в корзину
          </button>
        </div>
      </div>
    </main>
  );
}
