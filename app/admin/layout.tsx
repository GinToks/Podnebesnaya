"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { ShieldOff, ArrowLeft } from "lucide-react";

const NAV = [
  { key: "catalog", label: "Каталог", href: "/admin/catalog" },
  { key: "orders", label: "Заказы", href: "/admin/orders" },
  { key: "users", label: "Пользователи", href: "/admin/users" },
  { key: "promos", label: "Промокоды", href: "/admin/promos" },
  { key: "banners", label: "Баннеры", href: "/admin/banners" },
  { key: "collections", label: "Коллекции", href: "/admin/collections" },
  { key: "scent-calendar", label: "Аромат дня", href: "/admin/scent-calendar" },
  { key: "gift-sets", label: "Подарочные наборы", href: "/admin/gift-sets" },
  { key: "giftcards", label: "Подарочные карты", href: "/admin/giftcards" },
  { key: "categories", label: "Категории", href: "/admin/categories" },
  { key: "analytics", label: "Аналитика", href: "/admin/analytics" },
  { key: "settings", label: "Настройки", href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, logout, checkAuth } = useAdminAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/admin/login") checkAuth();
  }, [checkAuth, pathname]);

  useEffect(() => {
    if (pathname !== "/admin/login" && !isLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка…</div>;
  }
  if (!isAuthenticated) return null;

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
            <Link href="/" className="hover:accent-text transition-colors">
              На сайт <ArrowLeft size={16} strokeWidth={2} />
            </Link>
            <button onClick={logout} className="flex items-center gap-1.5 text-accent hover:underline transition-colors">
              Выйти <ShieldOff size={16} strokeWidth={2} />
            </button>
          </nav>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-2 flex gap-2 border-b border-mist overflow-x-auto">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
                pathname?.startsWith(item.href)
                  ? "border-accent text-accent"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">{children}</div>
    </div>
  );
}