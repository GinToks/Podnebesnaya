"use client";

import { useState } from "react";
import { useGiftSetStore } from "@/store/giftSetStore";
import { compressImage } from "@/lib/imageCompression";

export default function GiftSetsTab({ products }: { products: { id: string; name: string }[] }) {
  const { sets: giftSets, addSet: addGiftSet, updateSet: updateGiftSet, deleteSet: deleteGiftSet } = useGiftSetStore();
  const [giftSetImage, setGiftSetImage] = useState("");

  return (
    <>
      <div className="mb-8">
        <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">Подарочные наборы</h1>
        <p className="text-sm text-ink-muted mt-1">Создавайте наборы товаров для продажи.</p>
      </div>
      <div className="mb-6 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
        <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">Новый набор</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">Название</label>
            <input id="gs-name" className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" placeholder="Весенний набор" />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">Цена</label>
            <input id="gs-price" type="number" className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" placeholder="5000" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-ink-muted mb-1.5">Описание</label>
            <textarea id="gs-desc" rows={2} className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" placeholder="Описание набора" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-ink-muted mb-1.5">Изображение</label>
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              compressImage(file, 400, 0.6).then((result) => setGiftSetImage(result)).catch(() => alert("Не удалось загрузить изображение"));
            }} className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm" />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-xs font-medium text-ink-muted mb-1.5">Товары набора</label>
          <div className="max-h-48 overflow-y-auto border border-mist rounded-lg p-2 space-y-1">
            {products.map((p) => (
              <label key={p.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-mist/50 cursor-pointer">
                <input type="checkbox" className="gs-product-check rounded border-mist" value={p.id} />
                <span className="text-sm text-ink">{p.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <button onClick={() => {
            const name = (document.getElementById("gs-name") as HTMLInputElement)?.value;
            const desc = (document.getElementById("gs-desc") as HTMLTextAreaElement)?.value;
            const price = Number((document.getElementById("gs-price") as HTMLInputElement)?.value || 0);
            if (!name) { alert("Введите название"); return; }
            const checked = Array.from(document.querySelectorAll(".gs-product-check:checked")).map((el) => (el as HTMLInputElement).value);
            addGiftSet({ name, description: desc || "", productIds: checked, price, image: giftSetImage, active: true });
            (document.getElementById("gs-name") as HTMLInputElement).value = "";
            (document.getElementById("gs-desc") as HTMLTextAreaElement).value = "";
            (document.getElementById("gs-price") as HTMLInputElement).value = "";
            setGiftSetImage("");
            document.querySelectorAll(".gs-product-check").forEach((el) => { (el as HTMLInputElement).checked = false; });
          }} className="px-6 py-2.5 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors">
            Создать набор
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {giftSets.length === 0 ? (
          <p className="text-ink-muted text-sm text-center py-8">Наборов пока нет.</p>
        ) : (
          giftSets.map((gs) => (
            <div key={gs.id} className="p-4 bg-bg-elevated border border-mist rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-ink">{gs.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${gs.active ? "bg-olive/20 text-olive" : "bg-mist text-ink-muted"}`}>
                    {gs.active ? "Активен" : "Отключён"}
                  </span>
                </div>
                <p className="text-sm text-ink-muted">{gs.description}</p>
                <p className="text-xs text-ink-muted mt-1">{gs.productIds.length} товаров · {gs.price.toLocaleString("ru-RU")} ₽</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateGiftSet(gs.id, { active: !gs.active })} className="px-3 py-1.5 rounded-full border border-mist text-ink text-xs font-medium hover:bg-mist transition-colors">
                  {gs.active ? "Отключить" : "Включить"}
                </button>
                <button onClick={() => { if (window.confirm("Удалить набор?")) deleteGiftSet(gs.id); }} className="px-3 py-1.5 rounded-full border border-accent text-accent text-xs font-medium hover:bg-accent hover:text-bg transition-colors">
                  Удалить
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
