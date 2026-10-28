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
import OrdersTab from "@/components/admin/OrdersTab";
import GiftCardsTab from "@/components/admin/GiftCardsTab";
import ScentCalendarTab from "@/components/admin/ScentCalendarTab";
import CategoriesTab from "@/components/admin/CategoriesTab";
import GiftSetsTab from "@/components/admin/GiftSetsTab";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import QuizTab from "@/components/admin/QuizTab";
import PromosTab from "@/components/admin/PromosTab";
import BannersTab from "@/components/admin/BannersTab";
import CollectionsTab from "@/components/admin/CollectionsTab";
import SettingsTab from "@/components/admin/SettingsTab";
import CatalogTab from "@/components/admin/CatalogTab";
import { motion, AnimatePresence } from "framer-motion";
import type { Product, ScentCategory } from "@/data/products";

type AdminTab = "catalog" | "orders" | "promos" | "banners" | "collections" | "categories" | "quiz" | "analytics" | "settings" | "scent-calendar" | "gift-sets" | "giftcards";

export default function AdminPage() {
  const { isAuthenticated, isLoading, logout, checkAuth } = useAdminAuthStore();
  const router = useRouter();
  const { products, addProduct, updateProduct, deleteProduct, fetchProducts: seed, reorderProducts } =
    useCatalogStore();
  const { orders, addOrder, updateOrderStatus, deleteOrder } = useOrderStore();
  const filteredOrders = orders.filter((o) => {
    const q = orderSearch.toLowerCase();
    const matchesSearch = !q || o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q) || (o.customerPhone || "").toLowerCase().includes(q);
    const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });
  const { codes, addCode, updateCode, deleteCode } = usePromoStore();
  const { banners, addBanner, updateBanner, deleteBanner, fetchBanners } = usePromoBannerStore();
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
  const [tgToken, setTgToken] = useState("");
  const [tgChatId, setTgChatId] = useState("");
  const [waNumber, setWaNumber] = useState("");
  const [giftCards, setGiftCards] = useState<any[]>([]);
  const [gcAmount, setGcAmount] = useState("");
  const [gcCode, setGcCode] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [messengerStatus, setMessengerStatus] = useState("");

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
      fetchBanners();
      fetch("/api/gift-cards").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setGiftCards(d); }).catch(() => {});
      // Load messenger settings
      fetch("/api/settings/messenger").then((r) => r.json()).then((s) => {
        setTgToken(s.tgToken || "");
        setTgChatId(s.tgChatId || "");
        setWaNumber(s.waNumber || "");
      }).catch(() => {});
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
      costPrice: draft.costPrice ?? undefined,
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

  const ctx = {
    products, filteredProducts, adminSearch, setAdminSearch, editingId, setEditingId,
    draft, setDraft, newOfferLabel, setNewOfferLabel, startAdd, startEdit, saveDraft,
    deleteProduct, updateProduct, addProduct, reorderProducts, seed, selectedProducts,
    setSelectedProducts, draggedId, setDraggedId, handleDelete,
  };

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
          <div className="flex-1 flex gap-2 border-b border-mist pb-2 overflow-x-auto">
            {[
              { key: "catalog", label: "Каталог" },
              { key: "orders", label: "Заказы" },
              { key: "promos", label: "Промокоды" },
              { key: "banners", label: "Баннеры" },
              { key: "collections", label: "Коллекции" },
              { key: "scent-calendar", label: "Аромат дня" },
              { key: "gift-sets", label: "Подарочные наборы" },
              { key: "giftcards", label: "Подарочные карты" },
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
        {tab === "catalog" && <CatalogTab ctx={ctx} />}

{/* PROMOS TAB */}
        {tab === "promos" && <PromosTab />}

{/* QUIZ TAB */}
        {tab === "quiz" && <QuizTab />}

{/* ANALYTICS TAB */}
        {tab === "analytics" && <AnalyticsTab />}

{/* BANNERS TAB */}
        {tab === "banners" && <BannersTab products={products} />}

{/* COLLECTIONS TAB */}
        {tab === "collections" && <CollectionsTab products={products} />}

{/* GIFT SETS TAB */}
        {tab === "gift-sets" && <GiftSetsTab products={products} />}

{tab === "categories" && <CategoriesTab />}

{/* SETTINGS TAB */}
        {tab === "settings" && <SettingsTab />}

      </div>
      </div>

  );
}




