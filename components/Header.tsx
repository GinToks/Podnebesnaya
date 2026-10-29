"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { Menu, X, ShoppingCart, Heart, ArrowLeft, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import WishlistModal from "@/components/WishlistModal";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "#catalog", label: "Коллекция" },
  { href: "/surprise-box", label: "Сюрприз-бокс" },
  { href: "/subscription", label: "Подписка" },
  { href: "#philosophy", label: "Философия" },
];

export default function Header() {
  const { toggle } = useCartStore();
  const count = useCartStore((state) => state.totalQuantity());
  const wishlistCount = useWishlistStore((state) => state.totalItems());
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const isAdmin = useAdminAuthStore((state) => state.isAuthenticated);
  const checkAuth = useAdminAuthStore((state) => state.checkAuth);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const cabinetHref = isAdmin ? "/admin" : "/account";
  const cabinetLabel = isAdmin ? "Админ" : "Кабинет";

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  return (
    <header className="relative z-20">
      <div className="sticky top-0 w-full bg-bg/90 backdrop-blur border-b border-mist">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex shrink-0 items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-sakura-dark">
                <path d="M14 2 Q16 6 14 10 Q12 6 14 2Z" fill="currentColor" opacity="0.8" />
                <path d="M14 10 Q17 13 14 16 Q11 13 14 10Z" fill="currentColor" opacity="0.6" />
                <path d="M14 16 Q17 19 14 22 Q11 19 14 16Z" fill="currentColor" opacity="0.8" />
                <path d="M10 8 Q12 11 10 14 Q8 11 10 8Z" fill="currentColor" opacity="0.5" />
                <path d="M18 8 Q20 11 18 14 Q16 11 18 8Z" fill="currentColor" opacity="0.5" />
                <circle cx="14" cy="14" r="2" fill="#B89B5E" />
              </svg>
              <span className="serif text-2xl font-light tracking-[0.18em] text-ink">
                Поднебесная
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide uppercase text-ink-muted">
              {isHome ? (
                navLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                ))
              ) : (
                <Link
                  href="/"
                  className="hover:text-accent transition-colors flex items-center gap-1"
                >
                  <ArrowLeft size={16} strokeWidth={2} /> На главную
                </Link>
              )}
              <Link
                href={cabinetHref}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-mist transition-colors"
                aria-label="Личный кабинет"
              >
                <User size={18} strokeWidth={2} />
                <span className="hidden md:block text-xs font-semibold">{cabinetLabel}</span>
              </Link>
              <button
                onClick={() => setWishlistOpen(true)}
                className="flex items-center gap-2 relative p-2 rounded-full hover:bg-mist transition-colors"
                aria-label="Избранное"
              >
                <Heart size={18} strokeWidth={2} />
                <span className="hidden md:block text-xs font-semibold">
                  Избранное
                </span>
                <span
                  className={`absolute -top-1 -right-1 min-w-[1.2rem] h-[1.2rem] rounded-full bg-sakura-dark text-bg text-[10px] font-bold flex items-center justify-center ${
                    mounted && wishlistCount === 0 ? "hidden" : "block"
                  }`}
                >
                  {mounted ? wishlistCount : 0}
                </span>
              </button>
              <button
                onClick={toggle}
                className="flex items-center gap-2 relative p-2 rounded-full hover:bg-mist transition-colors"
                aria-label="Корзина"
              >
                <m.span
                  key={count}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="inline-flex"
                >
                  <ShoppingCart size={18} strokeWidth={2} />
                </m.span>
                <span className="hidden md:block text-xs font-semibold">
                  Корзина
                </span>
                <span
                  className={`absolute -top-1 -right-1 min-w-[1.2rem] h-[1.2rem] rounded-full bg-accent text-bg text-[10px] font-bold flex items-center justify-center ${
                    mounted && count === 0 ? "hidden" : "block"
                  }`}
                >
                  {mounted ? count : 0}
                </span>
              </button>

            </nav>
            <button
              className="md:hidden p-2 rounded-full hover:bg-mist transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
            >
              {mobileOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <m.div
              initial={{ opacity: 0, translateY: -10 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -10 }}
              className="md:hidden absolute left-0 right-0 top-20 bg-bg/95 backdrop-blur border-b border-mist"
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col gap-4 border-t border-mist pt-6">
                  {isHome ? (
                    navLinks.map((link, index) => (
                      <Link
                        key={index}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-3 text-sm font-medium tracking-wide uppercase text-ink hover:text-accent transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))
                  ) : (
                    <Link
                      href="/"
                      onClick={() => setMobileOpen(false)}
                      className="block py-3 text-sm font-medium tracking-wide uppercase text-ink hover:text-accent transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft size={16} strokeWidth={2} /> На главную
                    </Link>
                  )}
                  <button
                    onClick={() => { setMobileOpen(false); setWishlistOpen(true); }}
                    className="block py-3 text-sm font-medium tracking-wide uppercase text-ink hover:text-accent transition-colors flex items-center justify-between w-full text-left"
                  >
                    Избранное
                    <span
                      className={`inline-block min-w-[1.2rem] h-[1.2rem] rounded-full bg-sakura-dark text-bg text-[10px] font-bold flex items-center justify-center ${
                        mounted && wishlistCount === 0 ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      {mounted ? wishlistCount : 0}
                    </span>
                  </button>
                  <button
                    onClick={toggle}
                    className="block py-3 text-sm font-medium tracking-wide uppercase text-ink hover:text-accent transition-colors flex items-center justify-between"
                    aria-label="Корзина"
                  >
                    Корзина
                    <span
                      className={`inline-block min-w-[1.2rem] h-[1.2rem] rounded-full bg-accent text-bg text-[10px] font-bold flex items-center justify-center ${
                        mounted && count === 0 ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      {mounted ? count : 0}
                    </span>
                  </button>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
      <WishlistModal isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
    </header>
  );
}


