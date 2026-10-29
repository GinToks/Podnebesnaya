"use client";

import { compressImage } from "@/lib/imageCompression";
import { useCategoryStore } from "@/store/categoryStore";
import type { ScentCategory, Product } from "@/data/products";
import SearchBarAdmin from "@/components/admin/SearchBarAdmin";
import { Plus, Check, Save, X } from "lucide-react";
import Image from "next/image";

export default function CatalogTab({ ctx }: { ctx: any }) {
  const { products, filteredProducts, adminSearch, setAdminSearch, editingId, setEditingId, draft, setDraft, newOfferLabel, setNewOfferLabel, startAdd, startEdit, saveDraft, deleteProduct, updateProduct, addProduct, reorderProducts, seed, selectedProducts, setSelectedProducts, draggedId, setDraggedId, handleDelete } = ctx;
  const { categories } = useCategoryStore();
  return (
          <>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">
                  Управление каталогом
                </h1>
                <p className="text-sm text-ink-muted mt-1">
                  Редактируйте товары, цены и промо-предложения. Изменения видны на сайте сразу.
                </p>
              {products.some((p: Product) => (p.stock ?? 0) <= 3) && (
                <div className="mt-3 p-3 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-sm">
                  <p className="font-medium mb-1">⚠️ Низкий остаток:</p>
                  <ul className="list-disc list-inside text-xs">
                    {products.filter((p: Product) => (p.stock ?? 0) <= 3).map((p: Product) => (
                      <li key={p.id}>{p.name} — {p.stock ?? 0} шт.</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
              <div className="flex items-center gap-2">
                <SearchBarAdmin value={adminSearch} onChange={setAdminSearch} />
                <button
                  onClick={startAdd}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors"
                >
                  <Plus size={16} strokeWidth={2.5} /> Добавить товар
                </button>
                <button
                  onClick={seed}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-mist bg-bg text-ink text-xs font-medium tracking-wide uppercase hover:bg-mist-strong-strong transition-colors"
                >
                  Загрузить образцы
                </button>
              </div>
            </div>

            {editingId && (
              <div className="mb-8 p-6 bg-bg border border-mist rounded-xl shadow-sm">
                <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                  {editingId === "new" ? "Новый товар" : "Редактирование"}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">
                      Название
                    </label>
                    <input
                      value={draft.name ?? ""}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink focus:border-sky outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">
                      Цена (₽)
                    </label>
                    <input
                      type="number"
                      value={draft.price ?? ""}
                      onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink focus:border-sky outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">
                      Себестоимость (₽)
                    </label>
                    <input
                      type="number"
                      value={draft.costPrice ?? ""}
                      onChange={(e) => setDraft({ ...draft, costPrice: e.target.value === "" ? undefined : Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink focus:border-sky outline-none transition-colors"
                    />
                    {draft.price && draft.costPrice != null && (
                      <p className="text-xs text-ink-muted mt-1">
                        Маржа: {Math.round(((draft.price - draft.costPrice) / draft.price) * 100)}%
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">
                      Категория
                    </label>
                    <select
                      value={draft.category ?? "fresh"}
                      onChange={(e) => setDraft({ ...draft, category: e.target.value as ScentCategory })}
                      className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink focus:border-sky outline-none transition-colors"
                    >
                      {categories.map((c: { id: string; label: string }) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">
                      Остаток
                    </label>
                    <input
                      type="number"
                      value={draft.stock ?? ""}
                      onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink focus:border-sky outline-none transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">
                      Краткое описание
                    </label>
                    <textarea
                      value={draft.description ?? ""}
                      onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink focus:border-sky outline-none transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">
                      Полное описание (страница товара)
                    </label>
                    <textarea
                      value={draft.fullDescription ?? ""}
                      onChange={(e) => setDraft({ ...draft, fullDescription: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink focus:border-sky outline-none transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">
                      Легенда / история
                    </label>
                    <textarea
                      value={draft.legend ?? ""}
                      onChange={(e) => setDraft({ ...draft, legend: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink focus:border-sky outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">
                      Фото товара
                    </label>
                    <div className="flex items-center gap-4">
                      {draft.images?.[0]?.url && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-mist bg-mist flex-shrink-0">
                          <Image src={draft.images[0].url} alt="" width={64} height={64} loading="lazy" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            compressImage(file, 400, 0.5).then((result) => {
                              setDraft({
                                ...draft,
                                images: [
                                  {
                                    id: draft.images?.[0]?.id || `img-${Date.now()}`,
                                    url: result,
                                    alt: draft.images?.[0]?.alt || draft.name || "",
                                  },
                                ],
                              });
                            }).catch(() => {
                              alert("Не удалось загрузить изображение");
                            });
                          }}
                          className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors"
                        />
                        <p className="text-[10px] text-ink-muted mt-1">
                          Выберите файл изображения (JPG, PNG, WebP). Изображение будет сохранено в браузере.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">
                      Скидка на товар (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={draft.discountPercent ?? 0}
                      onChange={(e) => {
                        const discount = Number(e.target.value) || 0;
                        setDraft({ ...draft, discountPercent: discount });
                        if (discount > 0 && draft.price) {
                          const origPrice = draft.originalPrice || draft.price;
                          setDraft({ ...draft, discountPercent: discount, originalPrice: origPrice, price: Math.round(origPrice * (1 - discount / 100)) });
                        } else if (discount === 0 && draft.originalPrice) {
                          setDraft({ ...draft, discountPercent: 0, price: draft.originalPrice, originalPrice: undefined });
                        }
                      }}
                      className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors"
                      placeholder="0"
                    />
                    <p className="text-[10px] text-ink-muted mt-1">
                      При вводе скидки цена автоматически пересчитывается. Оригинальная цена сохраняется.
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={!!newOfferLabel}
                        onChange={(e) => {
                          if (!e.target.checked) setNewOfferLabel("");
                        }}
                        className="rounded border-mist text-accent focus:ring-accent"
                      />
                      <span className="text-xs text-ink-muted">Активное промо-предложение</span>
                    </div>
                    <input
                      value={newOfferLabel}
                      onChange={(e) => setNewOfferLabel(e.target.value)}
                      placeholder="Напр. Хит сезона"
                      className="w-full md:w-64 px-3 py-2 rounded bg-mist border border-mist text-ink focus:border-sky outline-none transition-colors"
                    />
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={saveDraft}
                    disabled={!draft.name || !draft.description}
                    className="px-6 py-2.5 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase hover:bg-accent-hover disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    <Save size={16} strokeWidth={2.5} /> Сохранить
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setDraft({});
                      setNewOfferLabel("");
                    }}
                    className="px-6 py-2.5 rounded-full border border-mist bg-bg text-ink text-xs font-medium tracking-wide uppercase hover:bg-mist-strong-strong transition-colors flex items-center gap-2"
                  >
                    <X size={16} strokeWidth={2.5} /> Отмена
                  </button>
                </div>
              </div>
            )}

            {selectedProducts.length > 0 && (
              <div className="mb-4 p-4 bg-mist/50 border border-mist rounded-xl flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-ink">Выбрано: {selectedProducts.length}</span>
                <button onClick={async () => { for (const id of selectedProducts) { await deleteProduct(id); } setSelectedProducts([]); }} className="px-4 py-1.5 rounded-full bg-accent text-bg text-xs font-medium uppercase hover:bg-accent-hover transition-colors">Удалить выбранные</button>
                <button onClick={() => setSelectedProducts([])} className="px-4 py-1.5 rounded-full border border-mist text-ink text-xs font-medium uppercase hover:bg-mist transition-colors">Снять выделение</button>
              </div>
            )}

            <div className="rounded-xl border border-mist bg-bg overflow-x-auto shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-mist bg-mist">
                    <th className="px-4 py-3 w-10"><input type="checkbox" onChange={(e) => { if (e.target.checked) setSelectedProducts(filteredProducts.map((p: Product) => p.id)); else setSelectedProducts([]); }} checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0} className="rounded border-mist" /></th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Товар</th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Цена</th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Остаток</th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Промо</th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px] text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist/50">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-ink-muted text-sm">
                        Товары не найдены.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product: Product) => (
                      <tr key={product.id} draggable onDragStart={() => setDraggedId(product.id)} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (draggedId && draggedId !== product.id) { reorderProducts(draggedId, product.id); setDraggedId(null); } }} className="hover:bg-mist/30 transition-colors group cursor-move">
                        <td className="px-4 py-4"><input type="checkbox" checked={selectedProducts.includes(product.id)} onChange={(e) => { if (e.target.checked) setSelectedProducts([...selectedProducts, product.id]); else setSelectedProducts(selectedProducts.filter((id: string) => id !== product.id)); }} className="rounded border-mist" /></td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: product.accent }} />
                            <div>
                              <p className="font-medium text-ink truncate max-w-xs">{product.name}</p>
                              <p className="text-xs text-ink-muted truncate max-w-xs">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-ink-muted">
                          {product.price.toLocaleString("ru-RU")} ₽
                          {product.costPrice != null && (
                            <div className="text-[10px] text-ink-muted/70">
                              себест. {product.costPrice.toLocaleString("ru-RU")} ₽ · маржа {Math.round(((product.price - product.costPrice) / product.price) * 100)}%
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-ink-muted">
                          {product.stock}
                        </td>
                        <td className="px-4 py-4">
                          {product.offer?.active ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-bold border border-accent/30">
                              <Check size={12} strokeWidth={2} />
                              {product.offer.label}
                            </span>
                          ) : (
                            <span className="text-xs text-ink-muted">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() => startEdit(product)}
                            className="text-xs text-accent hover:underline mr-3"
                            title="Редактировать"
                          >
                            Править
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-xs text-accent hover:underline"
                            title="Удалить"
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
  );
}
