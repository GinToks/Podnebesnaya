"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useCatalogStore } from "@/store/catalogStore";
import { usePromoBannerStore } from "@/store/promoBannerStore";

export default function BannersTab({ products }: { products: any[] }) {
  const { banners, addBanner, updateBanner, deleteBanner, fetchBanners } = usePromoBannerStore();
  const { updateProduct } = useCatalogStore();
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  return (
          <>
            <div className="mb-8">
              <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">
                Промо-баннеры
              </h1>
              <p className="text-sm text-ink-muted mt-1">
                Управление баннерами акций. Выберите товары для применения скидки.
              </p>
            </div>

            <div className="mb-6 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                Новый баннер
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Заголовок</label>
                  <input id="banner-title" className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" placeholder="Весенняя коллекция" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Подзаголовок</label>
                  <input id="banner-subtitle" className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" placeholder="Скидка 20% на все свечи с ароматом сакуры" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Дата окончания</label>
                  <input id="banner-enddate" type="datetime-local" className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Скидка (%)</label>
                  <input id="banner-discount" type="number" min="0" max="100" defaultValue="0" className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Цвет фона</label>
                  <input id="banner-bgcolor" type="color" defaultValue="#E8B4B8" className="w-full h-10 rounded bg-mist border border-mist cursor-pointer" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Цвет текста</label>
                  <input id="banner-textcolor" type="color" defaultValue="#3D2B1F" className="w-full h-10 rounded bg-mist border border-mist cursor-pointer" />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-ink-muted mb-1.5">Выберите товары для применения скидки</label>
                <div className="max-h-48 overflow-y-auto border border-mist rounded-lg p-2 space-y-1">
                  {products.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-mist/50 cursor-pointer">
                      <input type="checkbox" className="banner-product-check rounded border-mist" value={p.id} />
                      <span className="text-sm text-ink">{p.name}</span>
                      <span className="text-xs text-ink-muted ml-auto">{p.price.toLocaleString("ru-RU")} ₽</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={async () => {
                    const title = (document.getElementById("banner-title") as HTMLInputElement)?.value;
                    const subtitle = (document.getElementById("banner-subtitle") as HTMLInputElement)?.value;
                    const endDate = (document.getElementById("banner-enddate") as HTMLInputElement)?.value;
                    const discount = Number((document.getElementById("banner-discount") as HTMLInputElement)?.value || 0);
                    const bgColor = (document.getElementById("banner-bgcolor") as HTMLInputElement)?.value || "#E8B4B8";
                    const textColor = (document.getElementById("banner-textcolor") as HTMLInputElement)?.value || "#3D2B1F";
                    if (!title) { alert("Введите заголовок баннера"); return; }
                    if (!endDate) { alert("Укажите дату окончания"); return; }
                    const checked = Array.from(document.querySelectorAll(".banner-product-check:checked")).map((el) => (el as HTMLInputElement).value);
                    if (editingBannerId) {
                      updateBanner(editingBannerId, {
                        title,
                        subtitle: subtitle || "",
                        endDate: new Date(endDate).toISOString(),
                        bgColor,
                        textColor,
                        discount,
                        selectedProductIds: checked,
                      });
                      // Update product offers
                      if (discount > 0) {
                        for (const pid of checked) {
                          const product = products.find((p) => p.id === pid);
                          if (product) {
                            const origPrice = product.originalPrice || product.price;
                            const newPrice = Math.round(origPrice * (1 - discount / 100));
                            await updateProduct(pid, { offer: { label: `-${discount}%`, active: true }, originalPrice: origPrice, price: newPrice });
                          }
                        }
                      }
                      setEditingBannerId(null);
                    } else {
                    const checked = Array.from(document.querySelectorAll(".banner-product-check:checked")).map((el) => (el as HTMLInputElement).value);
                      addBanner({
                        title,
                        subtitle: subtitle || "",
                        endDate: new Date(endDate).toISOString(),
                        bgColor,
                        textColor,
                        active: true,
                        discount,
                        selectedProductIds: checked,
                        link: "#catalog",
                        linkText: "Смотреть",
                      });
                      if (discount > 0) {
                        for (const pid of checked) {
                          const product = products.find((p) => p.id === pid);
                          if (product) {
                            const origPrice = product.originalPrice || product.price;
                            const newPrice = Math.round(origPrice * (1 - discount / 100));
                            await updateProduct(pid, { offer: { label: `-${discount}%`, active: true }, originalPrice: origPrice, price: newPrice });
                          }
                        }
                      }
                    }
                    (document.getElementById("banner-title") as HTMLInputElement).value = "";
                    (document.getElementById("banner-subtitle") as HTMLInputElement).value = "";
                    (document.getElementById("banner-enddate") as HTMLInputElement).value = "";
                  }}
                  className="px-6 py-2.5 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors"
                >
                  {editingBannerId ? "Сохранить изменения" : "Создать баннер"}
                </button>
                {editingBannerId && (
                  <button
                    onClick={() => {
                      setEditingBannerId(null);
                      (document.getElementById("banner-title") as HTMLInputElement).value = "";
                      (document.getElementById("banner-subtitle") as HTMLInputElement).value = "";
                      (document.getElementById("banner-enddate") as HTMLInputElement).value = "";
                      (document.getElementById("banner-discount") as HTMLInputElement).value = "0";
                    }}
                    className="px-6 py-2.5 rounded-full border border-mist text-ink text-xs font-medium tracking-wide uppercase hover:bg-mist transition-colors"
                  >
                    Отмена
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {banners.length === 0 ? (
                <p className="text-ink-muted text-sm text-center py-8">Баннеров пока нет.</p>
              ) : (
                banners.map((banner) => (
                  <div key={banner.id} className="p-4 bg-bg-elevated border border-mist rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: banner.bgColor }} />
                        <h3 className="font-medium text-ink">{banner.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${banner.active ? "bg-olive/20 text-olive" : "bg-mist text-ink-muted"}`}>
                          {banner.active ? "Активен" : "Отключён"}
                        </span>
                      </div>
                      <p className="text-sm text-ink-muted">{banner.subtitle}</p>
                      <p className="text-xs text-ink-muted mt-1">
                        До: {new Date(banner.endDate).toLocaleString("ru-RU")}
                        {banner.discount ? ` · Скидка: ${banner.discount}%` : ""}
                        {banner.selectedProductIds?.length ? ` · Товаров: ${banner.selectedProductIds.length}` : ""}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingBannerId(banner.id);
                          (document.getElementById("banner-title") as HTMLInputElement).value = banner.title;
                          (document.getElementById("banner-subtitle") as HTMLInputElement).value = banner.subtitle;
                          (document.getElementById("banner-enddate") as HTMLInputElement).value = new Date(banner.endDate).toISOString().slice(0, 16);
                          (document.getElementById("banner-discount") as HTMLInputElement).value = String(banner.discount || 0);
                          (document.getElementById("banner-bgcolor") as HTMLInputElement).value = banner.bgColor;
                          (document.getElementById("banner-textcolor") as HTMLInputElement).value = banner.textColor;
                          // Check the selected products
                          document.querySelectorAll(".banner-product-check").forEach((el) => {
                            (el as HTMLInputElement).checked = banner.selectedProductIds?.includes((el as HTMLInputElement).value) || false;
                          });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-3 py-1.5 rounded-full border border-mist text-ink text-xs font-medium hover:bg-mist transition-colors"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={async () => {
                          if (banner.active && banner.selectedProductIds && banner.discount && banner.discount > 0) {
                            for (const pid of banner.selectedProductIds) {
                              const product = products.find((p) => p.id === pid);
                              if (product && product.originalPrice) {
                                await updateProduct(pid, { price: product.originalPrice, originalPrice: undefined, offer: undefined, discountPercent: undefined });
                              }
                            }
                          } else if (!banner.active && banner.selectedProductIds && banner.discount && banner.discount > 0) {
                            for (const pid of banner.selectedProductIds) {
                              const product = products.find((p) => p.id === pid);
                              if (product) {
                                const origPrice = product.originalPrice || product.price;
                                const newPrice = Math.round(origPrice * (1 - (banner.discount || 0) / 100));
                                await updateProduct(pid, { offer: { label: `-${banner.discount}%`, active: true }, originalPrice: origPrice, price: newPrice, discountPercent: banner.discount });
                              }
                            }
                          }
                          updateBanner(banner.id, { active: !banner.active });
                        }}
                        className="px-3 py-1.5 rounded-full border border-mist text-ink text-xs font-medium hover:bg-mist transition-colors"
                      >
                        {banner.active ? "Отключить" : "Включить"}
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm("Удалить баннер?")) {
                            // Restore original prices for products in this banner
                            if (banner.selectedProductIds && banner.discount && banner.discount > 0) {
                              for (const pid of banner.selectedProductIds) {
                                const product = products.find((p) => p.id === pid);
                                if (product && product.originalPrice) {
                                  await updateProduct(pid, { price: product.originalPrice, originalPrice: undefined, offer: undefined });
                                }
                              }
                            }
                            deleteBanner(banner.id);
                          }
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
