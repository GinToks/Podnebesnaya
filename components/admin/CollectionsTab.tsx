"use client";

import { useCollectionStore } from "@/store/collectionStore";
import type { Product } from "@/data/products";

export default function CollectionsTab({ products }: { products: Product[] }) {
  const { collections, addCollection, updateCollection, deleteCollection } = useCollectionStore();
  return (
          <>
            <div className="mb-8">
              <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">
                Сезонные коллекции
              </h1>
              <p className="text-sm text-ink-muted mt-1">
                Управление сезонными коллекциями товаров.
              </p>
            </div>

            <div className="mb-6 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                Новая коллекция
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Название</label>
                  <input id="col-name" className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" placeholder="Весна: Цветение сакуры" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Сезон</label>
                  <select id="col-season" className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors">
                    <option value="spring">Весна</option>
                    <option value="summer">Лето</option>
                    <option value="autumn">Осень</option>
                    <option value="winter">Зима</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Описание</label>
                  <textarea id="col-desc" rows={2} className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" placeholder="Нежные цветочные ароматы для весеннего настроения" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Дата начала</label>
                  <input id="col-start" type="date" className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Дата окончания</label>
                  <input id="col-end" type="date" className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-ink-muted mb-1.5">Выберите товары коллекции</label>
                <div className="max-h-48 overflow-y-auto border border-mist rounded-lg p-2 space-y-1">
                  {products.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-mist/50 cursor-pointer">
                      <input type="checkbox" className="col-product-check rounded border-mist" value={p.id} />
                      <span className="text-sm text-ink">{p.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => {
                    const name = (document.getElementById("col-name") as HTMLInputElement)?.value;
                    const season = (document.getElementById("col-season") as HTMLSelectElement)?.value as "spring" | "summer" | "autumn" | "winter";
                    const desc = (document.getElementById("col-desc") as HTMLTextAreaElement)?.value;
                    const start = (document.getElementById("col-start") as HTMLInputElement)?.value;
                    const end = (document.getElementById("col-end") as HTMLInputElement)?.value;
                    if (!name || !start || !end) { alert("Заполните название и даты"); return; }
                    const checked = Array.from(document.querySelectorAll(".col-product-check:checked")).map((el) => (el as HTMLInputElement).value);
                    addCollection({
                      name,
                      description: desc || "",
                      season,
                      productIds: checked,
                      active: true,
                      startDate: new Date(start).toISOString(),
                      endDate: new Date(end).toISOString(),
                    });
                    (document.getElementById("col-name") as HTMLInputElement).value = "";
                    (document.getElementById("col-desc") as HTMLTextAreaElement).value = "";
                  }}
                  className="px-6 py-2.5 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors"
                >
                  Создать коллекцию
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {collections.length === 0 ? (
                <p className="text-ink-muted text-sm text-center py-8">Коллекций пока нет.</p>
              ) : (
                collections.map((col) => (
                  <div key={col.id} className="p-4 bg-bg-elevated border border-mist rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-ink">{col.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${col.active ? "bg-olive/20 text-olive" : "bg-mist text-ink-muted"}`}>
                          {col.active ? "Активна" : "Отключена"}
                        </span>
                      </div>
                      <p className="text-sm text-ink-muted">{col.description}</p>
                      <p className="text-xs text-ink-muted mt-1">
                        {col.season} · {col.productIds.length} товаров · {new Date(col.startDate).toLocaleDateString("ru-RU")} — {new Date(col.endDate).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateCollection(col.id, { active: !col.active })}
                        className="px-3 py-1.5 rounded-full border border-mist text-ink text-xs font-medium hover:bg-mist transition-colors"
                      >
                        {col.active ? "Отключить" : "Включить"}
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Удалить коллекцию?")) deleteCollection(col.id);
                        }}
                        className="px-3 py-1.5 rounded-full border border-accent text-accent text-xs font-medium hover:bg-accent hover:text-bg transition-colors"
                      >
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
