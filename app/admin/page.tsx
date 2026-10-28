"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useCatalogStore } from "@/store/catalogStore";
import { useOrderStore } from "@/store/orderStore";
import { usePromoStore } from "@/store/promoStore";
import { usePromoBannerStore } from "@/store/promoBannerStore";
import { useCollectionStore } from "@/store/collectionStore";
import { useScentCalendarStore } from "@/store/scentCalendarStore";
import { useGiftSetStore } from "@/store/giftSetStore";
import { useHeroImageStore } from "@/store/heroImageStore";
import { useThemeStore, seasonThemes } from "@/store/themeStore";
import { compressImage } from "@/lib/imageCompression";
import { useCategoryStore } from "@/store/categoryStore";
import { useQuizStore } from "@/store/quizStore";
import { Plus, Trash2, Save, X, ShieldOff, ArrowLeft, Check, Tag, Scroll, List, Clock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product, ScentCategory } from "@/data/products";

type AdminTab = "catalog" | "orders" | "promos" | "banners" | "collections" | "categories" | "quiz" | "analytics" | "settings" | "scent-calendar" | "gift-sets";

export default function AdminPage() {
  const { isAuthenticated, isLoading, logout, checkAuth } = useAdminAuthStore();
  const router = useRouter();
  const { products, addProduct, updateProduct, deleteProduct, fetchProducts: seed, reorderProducts } =
    useCatalogStore();
  const { orders, addOrder, updateOrderStatus, deleteOrder } = useOrderStore();
  const { codes, addCode, updateCode, deleteCode } = usePromoStore();
  const { banners, addBanner, updateBanner, deleteBanner } = usePromoBannerStore();
  const { collections, addCollection, updateCollection, deleteCollection } = useCollectionStore();
  const { entries: scentEntries, setScent, removeScent } = useScentCalendarStore();
  const { sets: giftSets, addSet: addGiftSet, updateSet: updateGiftSet, deleteSet: deleteGiftSet } = useGiftSetStore();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { questions: quizQuestions, settings: quizSettings, addQuestion: addQuizQuestion, updateQuestion: updateQuizQuestion, deleteQuestion: deleteQuizQuestion, addOption: addQuizOption, updateOption: updateQuizOption, deleteOption: deleteQuizOption, setSettings: setQuizSettings, reset: resetQuiz } = useQuizStore();
  const { imageUrl: heroImageUrl, setImage: setHeroImage, clearImage: clearHeroImage } = useHeroImageStore();
  const { season, setSeason } = useThemeStore();
  const [tab, setTab] = useState<AdminTab>("catalog");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Product> & { id?: string }>({});
  const [newOfferLabel, setNewOfferLabel] = useState("");
  const [promoForm, setPromoForm] = useState({
    code: "",
    type: "percent" as "percent" | "fixed",
    value: 0,
    maxUses: 1,
    label: "",
    active: true,
  });
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState<string | null>(null);
  const [adminSearch, setAdminSearch] = useState("");
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [giftSetImage, setGiftSetImage] = useState("");
  const [scentDate, setScentDate] = useState("");
  const [scentProductId, setScentProductId] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      const { fetchProducts } = useCatalogStore.getState();
      const { fetchOrders } = useOrderStore.getState();
      fetchProducts();
      fetchOrders();
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-ink-muted">Проверка авторизации...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const startAdd = () => {
    setEditingId("new");
    setDraft({
      name: "", description: "", fullDescription: "", price: 0,
      category: "fresh", legend: "", accent: "#C41E3A", stock: 0,
      offer: { label: "", active: false },
      images: [{ id: `img-${Date.now()}`, url: "", alt: "" }],
    });
    setNewOfferLabel("");
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setDraft({ ...product });
    setNewOfferLabel(product.offer?.label ?? "");
  };

  const saveDraft = async () => {
    if (!draft.name || !draft.description || draft.price == null) return;
    const product: Product = {
      id: draft.id ?? "",
      name: draft.name,
      description: draft.description,
      fullDescription: draft.fullDescription ?? "",
      notes: (draft.notes as any) ?? { top: [], middle: [], base: [] },
      price: Number(draft.price) || 0,
      category: (draft.category as ScentCategory) || "fresh",
      legend: draft.legend ?? "",
      accent: draft.accent || "#C41E3A",
      stock: Number(draft.stock) || 0,
      images: (draft.images as any) ?? [{ id: "main", url: "", alt: draft.name ?? "" }],
      offer: newOfferLabel ? { label: newOfferLabel, active: true } : undefined,
      originalPrice: draft.originalPrice,
      discountPercent: draft.discountPercent,
    };
    if (editingId) {
      await updateProduct(editingId, product);
    } else {
      await addProduct(product as Omit<Product, "id">);
    }
    setEditingId(null);
    setDraft({});
    setNewOfferLabel("");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Удалить товар без возможности восстановления?")) {
      await deleteProduct(id);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
    p.description.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const statusLabels: Record<string, string> = {
    new: "Новый",
    processing: "В обработке",
    completed: "Завершён",
    cancelled: "Отменён",
  };

  return (
    <div className="min-h-screen bg-bg text-ink relative z-10">
      <header className="border-b border-mist bg-bg/80 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldOff size={20} strokeWidth={2} className="text-accent" />
            <span className="serif text-xl font-light tracking-[0.1em] text-ink">
              Поднебесная · Админ
            </span>
          </div>
          <nav className="flex items-center gap-4 text-sm font-medium text-ink-muted">
            <Link
              href="/"
              className="hover:accent-text transition-colors"
              onClick={() => logout()}
            >
              На сайт <ArrowLeft size={16} strokeWidth={2} />
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-accent hover:underline transition-colors"
            >
              Выйти <ShieldOff size={16} strokeWidth={2} />
            </button>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 flex gap-2 border-b border-mist pb-2">
            {[
              { key: "catalog", label: "Каталог" },
              { key: "orders", label: "Заказы" },
              { key: "promos", label: "Промокоды" },
              { key: "banners", label: "Баннеры" },
              { key: "collections", label: "Коллекции" },
              { key: "scent-calendar", label: "Аромат дня" },
              { key: "gift-sets", label: "Подарочные наборы" },
              { key: "categories", label: "Категории" },
              { key: "analytics", label: "Аналитика" },
              { key: "settings", label: "Настройки" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key as AdminTab)}
                className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
                  tab === item.key
                    ? "border-accent text-accent"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* CATALOG TAB */}
        {tab === "catalog" && (
          <>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">
                  Управление каталогом
                </h1>
                <p className="text-sm text-ink-muted mt-1">
                  Редактируйте товары, цены и промо-предложения. Изменения видны на сайте сразу.
                </p>
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
                      Категория
                    </label>
                    <select
                      value={draft.category ?? "fresh"}
                      onChange={(e) => setDraft({ ...draft, category: e.target.value as ScentCategory })}
                      className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink focus:border-sky outline-none transition-colors"
                    >
                      {categories.map((c) => (
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

            <div className="rounded-xl border border-mist bg-bg overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-mist bg-mist">
                    <th className="px-4 py-3 w-10"><input type="checkbox" onChange={(e) => { if (e.target.checked) setSelectedProducts(filteredProducts.map((p) => p.id)); else setSelectedProducts([]); }} checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0} className="rounded border-mist" /></th>
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
                    filteredProducts.map((product) => (
                      <tr key={product.id} draggable onDragStart={() => setDraggedId(product.id)} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (draggedId && draggedId !== product.id) { reorderProducts(draggedId, product.id); setDraggedId(null); } }} className="hover:bg-mist/30 transition-colors group cursor-move">
                        <td className="px-4 py-4"><input type="checkbox" checked={selectedProducts.includes(product.id)} onChange={(e) => { if (e.target.checked) setSelectedProducts([...selectedProducts, product.id]); else setSelectedProducts(selectedProducts.filter((id) => id !== product.id)); }} className="rounded border-mist" /></td>
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
        )}

        {/* ORDERS TAB */}
        {tab === "orders" && (
          <>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">
                  Заказы
                </h1>
                <p className="text-sm text-ink-muted mt-1">
                  Все оформленные заказы с данными клиентов и составом.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-mist bg-bg overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-mist bg-mist">
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">№ заказа</th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Клиент</th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Сумма</th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Статус</th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px] text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist/50">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-ink-muted text-sm">
                        Заказов пока нет.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-mist/30 transition-colors group">
                        <td className="px-4 py-4">
                          <p className="font-medium text-ink">{order.id}</p>
                          <p className="text-xs text-ink-muted">
                            {new Date(order.createdAt).toLocaleString("ru-RU")}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-ink-muted">
                          <p className="font-medium text-ink">{order.customerName}</p>
                          <p className="text-xs text-ink-muted">{order.customerEmail}</p>
                          <p className="text-xs text-ink-muted">{order.customerAddress}</p>
                        </td>
                        <td className="px-4 py-4 text-ink-muted">
                          {order.totalPrice.toLocaleString("ru-RU")} ₽
                        </td>
                        <td className="px-4 py-4">
                          <select
                                                      value={order.status}
                                                      onChange={async (e) =>
                                                        await updateOrderStatus(order.id, e.target.value as any)
                                                      }
                                                      className="px-2 py-1 rounded bg-mist border border-mist text-[11px] text-ink outline-none focus:border-sky"
                                                    >
                            {["new", "processing", "completed", "cancelled"].map((s) => (
                              <option key={s} value={s}>
                                {statusLabels[s]}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={async () => await deleteOrder(order.id)}
                            className="text-xs text-accent hover:underline"
                            title="Удалить заказ"
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
        )}

        {/* PROMOS TAB */}
        {tab === "promos" && (
          <>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">
                  Промокоды
                </h1>
                <p className="text-sm text-ink-muted mt-1">
                  Управляйте скидками и отслеживайте их использование.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingPromo(null);
                  setPromoForm({
                    code: "",
                    type: "percent",
                    value: 0,
                    maxUses: 1,
                    label: "",
                    active: true,
                  });
                  setShowPromoForm(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors"
              >
                <Plus size={16} strokeWidth={2.5} /> Добавить промокод
              </button>
            </div>

            {showPromoForm && (
              <div className="mb-6 p-6 bg-bg border border-mist rounded-xl shadow-sm">
                <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                  {editingPromo ? "Редактирование промокода" : "Новый промокод"}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">Код</label>
                    <input
                      value={promoForm.code}
                      onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                      disabled={!!editingPromo}
                      className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink focus:border-sky outline-none transition-colors disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">Описание</label>
                    <input
                      value={promoForm.label}
                      onChange={(e) => setPromoForm({ ...promoForm, label: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink focus:border-sky outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">Тип</label>
                    <select
                      value={promoForm.type}
                      onChange={(e) => setPromoForm({ ...promoForm, type: e.target.value as "percent" | "fixed" })}
                      className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink focus:border-sky outline-none transition-colors"
                    >
                      <option value="percent">Процент</option>
                      <option value="fixed">Фиксированная сумма</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">Значение</label>
                    <input
                      type="number"
                      value={promoForm.value}
                      onChange={(e) => setPromoForm({ ...promoForm, value: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink focus:border-sky outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">Максимум применений</label>
                    <input
                      type="number"
                      value={promoForm.maxUses}
                      onChange={(e) => setPromoForm({ ...promoForm, maxUses: Number(e.target.value) || 1 })}
                      className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink focus:border-sky outline-none transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input
                      type="checkbox"
                      checked={promoForm.active}
                      onChange={(e) => setPromoForm({ ...promoForm, active: e.target.checked })}
                      className="rounded border-mist text-accent focus:ring-accent"
                    />
                    <span className="text-xs text-ink-muted">Активен</span>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      if (!promoForm.code || !promoForm.value) return;
                      if (editingPromo) {
                        updateCode(editingPromo, {
                          type: promoForm.type,
                          value: promoForm.value,
                          maxUses: promoForm.maxUses,
                          label: promoForm.label || (promoForm.type === "percent" ? `Скидка ${promoForm.value}%` : `Скидка ${promoForm.value} ₽`),
                          active: promoForm.active,
                        });
                      } else {
                        addCode({
                          code: promoForm.code.toUpperCase(),
                          type: promoForm.type,
                          value: promoForm.value,
                          maxUses: promoForm.maxUses,
                          label: promoForm.label || (promoForm.type === "percent" ? `Скидка ${promoForm.value}%` : `Скидка ${promoForm.value} ₽`),
                          active: promoForm.active,
                        });
                      }
                      setShowPromoForm(false);
                      setEditingPromo(null);
                    }}
                    className="px-6 py-2.5 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors flex items-center gap-2"
                  >
                    <Save size={16} strokeWidth={2.5} /> Сохранить
                  </button>
                  <button
                    onClick={() => {
                      setShowPromoForm(false);
                      setEditingPromo(null);
                    }}
                    className="px-6 py-2.5 rounded-full border border-mist bg-bg text-ink text-xs font-medium tracking-wide uppercase hover:bg-mist-strong-strong transition-colors flex items-center gap-2"
                  >
                    <X size={16} strokeWidth={2.5} /> Отмена
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-mist bg-bg overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-mist bg-mist">
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Код</th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Описание</th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Тип / Значение</th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Применений</th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Статус</th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px] text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist/50">
                  {codes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-ink-muted text-sm">
                        Промокодов пока нет.
                      </td>
                    </tr>
                  ) : (
                    codes.map((code, idx) => {
                      const isExhausted = code.usedCount >= code.maxUses;
                      const isExpired =
                        code.expiresAt && new Date(code.expiresAt) < new Date();
                      return (
                        <tr key={`${code.code}-${idx}`} className="hover:bg-mist/30 transition-colors group">
                          <td className="px-4 py-4 font-mono text-sm text-ink">
                            {code.code}
                          </td>
                          <td className="px-4 py-4 text-ink-muted text-sm">{code.label}</td>
                          <td className="px-4 py-4 text-sm text-ink-muted">
                            {code.type === "percent"
                              ? `−${code.value}%`
                              : `−${code.value} ₽`}
                          </td>
                          <td className="px-4 py-4 text-sm text-ink-muted">
                            {code.usedCount} / {code.maxUses}
                          </td>
                          <td className="px-4 py-4">
                            {!code.active ? (
                              <span className="text-xs text-ink-muted">Отключён</span>
                            ) : isExhausted ? (
                              <span className="text-xs text-accent font-medium">Закончился</span>
                            ) : isExpired ? (
                              <span className="text-xs text-accent font-medium">Просрочен</span>
                            ) : (
                              <span className="text-xs text-accent font-medium">Активен</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button
                              onClick={() => {
                                const active = window.confirm(
                                  code.active
                                    ? "Отключить промокод?"
                                    : "Включить промокод?"
                                );
                                if (active !== undefined) {
                                  updateCode(code.code, { active: !code.active });
                                }
                              }}
                              className="text-xs text-accent hover:underline mr-3"
                            >
                              {code.active ? "Отключить" : "Включить"}
                            </button>
                            <button
                              onClick={() => {
                                setEditingPromo(code.code);
                                setPromoForm({
                                  code: code.code,
                                  type: code.type,
                                  value: code.value,
                                  maxUses: code.maxUses,
                                  label: code.label,
                                  active: code.active,
                                });
                                setShowPromoForm(true);
                              }}
                              className="text-xs text-accent hover:underline mr-3"
                            >
                              Править
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm("Удалить промокод?")) {
                                  deleteCode(code.code);
                                }
                              }}
                              className="text-xs text-accent hover:underline"
                            >
                              Удалить
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
              <div className="border-t border-mist p-4 text-[11px] text-ink-muted">
                Когда промокод заканчивается (достигает лимита применений), покупатель видит сообщение:
                «Просим прощения, но промокод закончился. Новый можно найти в наших соцсетях.»
              </div>
            </div>
          </>
        )}

        {/* QUIZ TAB */}
        {tab === "quiz" && (
          <>
            <div className="mb-8">
              <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">
                Квиз
              </h1>
              <p className="text-sm text-ink-muted mt-1">
                Редактируйте вопросы, ответы и баллы (категории ароматов).
              </p>
            </div>

            <div className="mb-6 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                Настройки квиза
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Заголовок приветствия</label>
                  <input
                    value={quizSettings.welcomeTitle}
                    onChange={(e) => setQuizSettings({ welcomeTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Текст приветствия</label>
                  <textarea
                    value={quizSettings.welcomeText}
                    onChange={(e) => setQuizSettings({ welcomeText: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Заголовок результата</label>
                  <input
                    value={quizSettings.resultTitle}
                    onChange={(e) => setQuizSettings({ resultTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Текст результата</label>
                  <textarea
                    value={quizSettings.resultText}
                    onChange={(e) => setQuizSettings({ resultText: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => addQuizQuestion({ title: "Новый вопрос", options: [] })}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors"
                >
                  + Вопрос
                </button>
                <button
                  onClick={resetQuiz}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-mist text-ink text-xs font-medium tracking-wide uppercase hover:bg-mist transition-colors"
                >
                  Сбросить
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {quizQuestions.map((q) => (
                <div key={q.id} className="p-6 bg-bg border border-mist rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      value={q.title}
                      onChange={(e) => updateQuizQuestion(q.id, { title: e.target.value })}
                      className="flex-1 px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors"
                    />
                    <button
                      onClick={() => deleteQuizQuestion(q.id)}
                      className="text-xs text-accent hover:underline"
                    >
                      Удалить
                    </button>
                  </div>
                  <div className="space-y-3">
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        className="flex flex-col md:flex-row gap-2 items-start md:items-center p-3 bg-mist/30 rounded-lg"
                      >
                        <input
                          value={opt.text}
                          onChange={(e) => updateQuizOption(q.id, opt.id, { text: e.target.value })}
                          className="flex-1 px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors"
                        />
                        <div className="flex flex-wrap gap-2">
                          {["fresh", "floral", "woody", "spicy"].map((cat) => (
                            <label key={cat} className="flex items-center gap-1 text-xs text-ink-muted">
                              <input
                                type="checkbox"
                                checked={opt.categories.includes(cat as any)}
                                onChange={(e) => {
                                  const cats = e.target.checked
                                    ? [...opt.categories, cat]
                                    : opt.categories.filter((c) => c !== cat);
                                  updateQuizOption(q.id, opt.id, { categories: cats as any });
                                }}
                                className="rounded border-mist"
                              />
                              {cat}
                            </label>
                          ))}
                        </div>
                        <button
                          onClick={() => deleteQuizOption(q.id, opt.id)}
                          className="text-xs text-accent hover:underline"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addQuizOption(q.id, { text: "Новый ответ", categories: [] })}
                    className="mt-3 px-4 py-2 rounded-full border border-mist text-ink text-xs font-medium hover:bg-mist transition-colors"
                  >
                    + Ответ
                  </button>
                </div>
              ))}
              {quizQuestions.length === 0 && (
                <p className="text-ink-muted text-sm text-center py-8">Вопросов пока нет.</p>
              )}
            </div>
          </>
        )}

        {/* ANALYTICS TAB */}
        {tab === "analytics" && (
          <>
            <div className="mb-8">
              <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">
                Аналитика продаж
              </h1>
              <p className="text-sm text-ink-muted mt-1">
                Обзор продаж, выручки и популярных товаров.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
                <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">Всего заказов</p>
                <p className="serif text-3xl font-light text-ink">{orders.length}</p>
              </div>
              <div className="p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
                <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">Выручка</p>
                <p className="serif text-3xl font-light text-ink">{orders.reduce((s, o) => s + o.totalPrice, 0).toLocaleString("ru-RU")} ₽</p>
              </div>
              <div className="p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
                <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">Товаров в каталоге</p>
                <p className="serif text-3xl font-light text-ink">{products.length}</p>
              </div>
              <div className="p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
                <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">Промокодов</p>
                <p className="serif text-3xl font-light text-ink">{codes.length}</p>
              </div>
            </div>

            <div className="mb-8 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                Популярные товары
              </h2>
              {(() => {
                const productSales: Record<string, { name: string; count: number; revenue: number }> = {};
                orders.forEach((order) => {
                  order.items.forEach((item) => {
                    if (!productSales[item.productId]) {
                      productSales[item.productId] = { name: item.productName, count: 0, revenue: 0 };
                    }
                    productSales[item.productId].count += item.quantity;
                    productSales[item.productId].revenue += item.price * item.quantity;
                  });
                });
                const sorted = Object.entries(productSales).sort((a, b) => b[1].count - a[1].count).slice(0, 10);
                const maxCount = sorted.length > 0 ? sorted[0][1].count : 1;
                return (
                  <div className="space-y-3">
                    {sorted.length === 0 && (
                      <p className="text-ink-muted text-sm">Заказов пока нет</p>
                    )}
                    {sorted.map(([id, data]) => (
                      <div key={id} className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ink truncate">{data.name}</p>
                          <p className="text-xs text-ink-muted">{data.count} шт. · {data.revenue.toLocaleString("ru-RU")} ₽</p>
                        </div>
                        <div className="w-48 h-4 bg-mist rounded-full overflow-hidden">
                          <div
                            className="h-full bg-olive rounded-full transition-all"
                            style={{ width: `${(data.count / maxCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="mb-8 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                Статусы заказов
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["new", "processing", "completed", "cancelled"].map((status) => {
                  const count = orders.filter((o) => o.status === status).length;
                  const labels: Record<string, string> = { new: "Новые", processing: "В обработке", completed: "Завершённые", cancelled: "Отменённые" };
                  const colors: Record<string, string> = { new: "bg-sky", processing: "bg-gold", completed: "bg-olive", cancelled: "bg-accent" };
                  return (
                    <div key={status} className="text-center p-4 bg-mist/30 rounded-xl">
                      <div className={`w-3 h-3 rounded-full ${colors[status]} mx-auto mb-2`} />
                      <p className="text-2xl font-bold text-ink">{count}</p>
                      <p className="text-xs text-ink-muted">{labels[status]}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* BANNERS TAB */}
        {tab === "banners" && (
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
        )}
        {/* COLLECTIONS TAB */}
        {tab === "collections" && (
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
        )}

        {/* CATEGORIES TAB */}
        {/* SCENT CALENDAR TAB */}
        {tab === "scent-calendar" && (
          <>
            <div className="mb-8">
              <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">Аромат дня</h1>
              <p className="text-sm text-ink-muted mt-1">Назначьте товар «ароматом дня» на конкретную дату.</p>
            </div>
            <div className="mb-6 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">Новая запись</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Дата</label>
                  <input type="date" value={scentDate} onChange={(e) => setScentDate(e.target.value)} className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Товар</label>
                  <select value={scentProductId} onChange={(e) => setScentProductId(e.target.value)} className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors">
                    <option value="">Выберите товар</option>
                    {products.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <button onClick={() => {
                  if (!scentDate || !scentProductId) { alert("Выберите дату и товар"); return; }
                  setScent(scentDate, scentProductId);
                  setScentDate(""); setScentProductId("");
                }} className="px-6 py-2.5 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors">
                  Сохранить
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {scentEntries.length === 0 ? (
                <p className="text-ink-muted text-sm text-center py-8">Записей пока нет.</p>
              ) : (
                scentEntries.map((e) => {
                  const p = products.find((prod) => prod.id === e.productId);
                  return (
                    <div key={e.date} className="p-4 bg-bg-elevated border border-mist rounded-xl shadow-sm flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-ink">{e.date}</p>
                        <p className="text-sm text-ink-muted">{p ? p.name : e.productId}</p>
                      </div>
                      <button onClick={() => removeScent(e.date)} className="px-3 py-1.5 rounded-full border border-accent text-accent text-xs font-medium hover:bg-accent hover:text-bg transition-colors">Удалить</button>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* GIFT SETS TAB */}
        {tab === "gift-sets" && (
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
        )}
        {tab === "categories" && (
          <>
            <div className="mb-8">
              <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">
                Управление категориями
              </h1>
              <p className="text-sm text-ink-muted mt-1">
                Добавляйте, редактируйте и удаляйте категории товаров.
              </p>
            </div>

            <div className="mb-6 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                Новая категория
              </h2>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Название</label>
                  <input
                    id="new-cat-label"
                    className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors"
                    placeholder="Например: Цитрусовые"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Цвет</label>
                  <input
                    id="new-cat-color"
                    type="color"
                    defaultValue="#6B8A5E"
                    className="w-full h-10 rounded bg-mist border border-mist cursor-pointer"
                  />
                </div>
                <button
                  onClick={() => {
                    const labelInput = document.getElementById("new-cat-label") as HTMLInputElement;
                    const colorInput = document.getElementById("new-cat-color") as HTMLInputElement;
                    if (labelInput?.value) {
                      addCategory({ label: labelInput.value, color: colorInput?.value || "#6B8A5E" });
                      labelInput.value = "";
                    }
                  }}
                  className="px-5 py-2.5 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors"
                >
                  Добавить
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-mist bg-bg-elevated overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-mist bg-mist/30">
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Цвет</th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Название</th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">ID</th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px] text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-mist/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: cat.color }} />
                      </td>
                      <td className="px-4 py-3 text-ink font-medium">{cat.label}</td>
                      <td className="px-4 py-3 text-ink-muted text-xs font-mono">{cat.id}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm("Удалить категорию?")) deleteCategory(cat.id);
                          }}
                          className="text-xs text-accent hover:underline"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* SETTINGS TAB */}
        {tab === "settings" && (<div>
            <div className="mb-8">
            <div className="mb-8">
              <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">
                Настройки сайта
              </h1>
              <p className="text-sm text-ink-muted mt-1">
                Управление изображением в Hero-секции, бэкап данных и другие настройки.
              </p>
            </div>

            <div className="mb-8 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                Бэкап и восстановление
              </h2>
              <p className="text-sm text-ink-muted mb-4">
                Экспорт всех данных (товары, заказы, промокоды, баннеры, категории) в JSON-файл. Импорт из файла восстановит данные.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const data = {
                      products: JSON.parse(localStorage.getItem("podnebesnaya-catalog") || "{}"),
                      orders: JSON.parse(localStorage.getItem("podnebesnaya-orders") || "{}"),
                      promos: JSON.parse(localStorage.getItem("podnebesnaya-promos") || "{}"),
                      banners: JSON.parse(localStorage.getItem("podnebesnaya-promo-banners") || "{}"),
                      categories: JSON.parse(localStorage.getItem("podnebesnaya-categories") || "{}"),
                      heroImage: JSON.parse(localStorage.getItem("podnebesnaya-hero-image") || "{}"),
                      cart: JSON.parse(localStorage.getItem("podnebesnaya-cart") || "{}"),
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `podnebesnaya-backup-${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-5 py-2.5 rounded-full bg-olive text-bg text-xs font-medium tracking-wide uppercase hover:bg-olive-hover transition-colors"
                >
                  Экспорт данных
                </button>
                <label className="px-5 py-2.5 rounded-full border border-accent text-accent text-xs font-medium tracking-wide uppercase hover:bg-accent hover:text-bg transition-colors cursor-pointer">
                  Импорт данных
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        try {
                          const data = JSON.parse(ev.target?.result as string);
                          if (data.products) localStorage.setItem("podnebesnaya-catalog", JSON.stringify(data.products));
                          if (data.orders) localStorage.setItem("podnebesnaya-orders", JSON.stringify(data.orders));
                          if (data.promos) localStorage.setItem("podnebesnaya-promos", JSON.stringify(data.promos));
                          if (data.banners) localStorage.setItem("podnebesnaya-promo-banners", JSON.stringify(data.banners));
                          if (data.categories) localStorage.setItem("podnebesnaya-categories", JSON.stringify(data.categories));
                          if (data.heroImage) localStorage.setItem("podnebesnaya-hero-image", JSON.stringify(data.heroImage));
                          alert("Данные успешно импортированы. Перезагрузите страницу.");
                        } catch (err) {
                          alert("Ошибка при импорте данных");
                        }
                      };
                      reader.readAsText(file);
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="mb-8 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                Тема оформления (сезон)
              </h2>
              <p className="text-sm text-ink-muted mb-4">
                Выберите сезонную цветовую палитру для сайта.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(["spring", "summer", "autumn", "winter"] as const).map((s) => {
                  const theme = seasonThemes[s];
                  return (
                    <button
                      key={s}
                      onClick={() => setSeason(s)}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${season === s ? "border-accent bg-accent/10 shadow-lg" : "border-mist bg-bg-elevated hover:border-sky"}`}
                    >
                      <span className="text-2xl mb-1 block">{theme.emoji}</span>
                      <span className="text-sm font-medium text-ink">{theme.name}</span>
                      <div className="flex gap-1 justify-center mt-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.olive }} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.sky }} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.bg }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-8 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                Изображение Hero-секции
              </h2>
              <p className="text-sm text-ink-muted mt-1">
                Управление изображением в Hero-секции и другими настройками.
              </p>
            </div>

            <div className="mb-8 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                Изображение Hero-секции
              </h2>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-64 h-40 rounded-xl overflow-hidden border border-mist bg-mist flex items-center justify-center">
                  {heroImageUrl ? (
                    <Image src={heroImageUrl} alt="Hero" width={256} height={160} loading="lazy" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-ink-muted text-sm">Нет изображения</span>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">
                      Загрузить новое изображение
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        compressImage(file, 400, 0.5).then((result) => {
                          setHeroImage(result);
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
                  <button
                    onClick={clearHeroImage}
                    className="px-4 py-2 rounded-full border border-accent text-accent text-xs font-medium tracking-wide uppercase hover:bg-accent hover:text-bg transition-colors"
                  >
                    Сбросить на стандартное
                  </button>
                </div>
              </div>
            </div>
          </div>

            <div className="mb-8 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                Интеграция с мессенджерами
              </h2>
              <p className="text-sm text-ink-muted mb-4">
                Настройте уведомления о новых заказах в Telegram и WhatsApp.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Telegram Bot Token</label>
                  <input id="tg-token" className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Telegram Chat ID</label>
                  <input id="tg-chatid" className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" placeholder="-1001234567890" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">WhatsApp номер</label>
                  <input id="wa-number" className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" placeholder="+7 999 123-45-67" />
                </div>
                <button
                  onClick={() => {
                    const tgToken = (document.getElementById("tg-token") as HTMLInputElement)?.value;
                    const tgChatId = (document.getElementById("tg-chatid") as HTMLInputElement)?.value;
                    const waNumber = (document.getElementById("wa-number") as HTMLInputElement)?.value;
                    localStorage.setItem("podnebesnaya-messenger-settings", JSON.stringify({ tgToken, tgChatId, waNumber }));
                    alert("Настройки сохранены");
                  }}
                  className="px-5 py-2.5 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors"
                >
                  Сохранить настройки
                </button>
              </div>
            </div>

            <div className="mb-8 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                Смена пароля администратора
              </h2>
              <p className="text-sm text-ink-muted mb-4">
                Измените пароль для входа в админ-панель.
              </p>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Текущий пароль</label>
                  <input id="cp-current" type="password" className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Новый пароль</label>
                  <input id="cp-new" type="password" className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Подтвердите новый пароль</label>
                  <input id="cp-confirm" type="password" className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" />
                </div>
                <button
                  onClick={async () => {
                    const current = (document.getElementById("cp-current") as HTMLInputElement)?.value;
                    const newPass = (document.getElementById("cp-new") as HTMLInputElement)?.value;
                    const confirm = (document.getElementById("cp-confirm") as HTMLInputElement)?.value;
                    if (!current || !newPass || !confirm) { alert("Заполните все поля"); return; }
                    if (newPass !== confirm) { alert("Пароли не совпадают"); return; }
                    if (newPass.length < 6) { alert("Пароль должен быть не менее 6 символов"); return; }
                    try {
                      const res = await fetch("/api/auth/change-password", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ currentPassword: current, newPassword: newPass }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        alert("Пароль успешно изменён");
                        (document.getElementById("cp-current") as HTMLInputElement).value = "";
                        (document.getElementById("cp-new") as HTMLInputElement).value = "";
                        (document.getElementById("cp-confirm") as HTMLInputElement).value = "";
                      } else {
                        alert(data.error || "Ошибка смены пароля");
                      }
                    } catch {
                      alert("Ошибка сети");
                    }
                  }}
                  className="px-5 py-2.5 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors"
                >
                  Сменить пароль
                </button>
              </div>
            </div>

            <div className="mb-8 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                Rate Limiting (защита от брутфорса)
              </h2>
              <p className="text-sm text-ink-muted mb-4">
                Ограничение количества попыток входа в админку. После 5 неудачных попыток — блокировка на 15 минут.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-olive" />
                <span className="text-sm text-ink">Активен (5 попыток / 15 мин блокировка)</span>
              </div>
            </div>

          </div>)}
      </div>
      </div>

  );
}

function SearchBarAdmin({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative w-64">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск по товарам…"
        className="w-full px-3 py-2 rounded bg-mist border border-mist text-sm text-ink focus:border-sky outline-none transition-colors placeholder:text-ink-muted"
      />
    </div>
  );
}



