"use client";
import Link from "next/link";
import { Mail, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-mist bg-bg-elevated">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col items-center md:text-left gap-2">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none" className="text-sakura-dark">
                <path d="M14 2 Q16 6 14 10 Q12 6 14 2Z" fill="currentColor" opacity="0.8" />
                <path d="M14 10 Q17 13 14 16 Q11 13 14 10Z" fill="currentColor" opacity="0.6" />
                <path d="M14 16 Q17 19 14 22 Q11 19 14 16Z" fill="currentColor" opacity="0.8" />
                <circle cx="14" cy="14" r="2" fill="#B89B5E" />
              </svg>
              <span className="serif text-xl font-light tracking-[0.18em] text-ink">
                Поднебесная
              </span>
            </div>
            <p className="text-sm text-ink-muted">
              Авторские ароматические свечи
            </p>
          </div>
          <nav className="flex gap-6 text-sm text-ink-muted">
            <Link href="#" className="hover:text-accent transition-colors">
              О нас
            </Link>
            <Link href="#" className="hover:text-accent transition-colors">
              Доставка
            </Link>
            <Link href="#" className="hover:text-accent transition-colors">
              Контакты
            </Link>
          </nav>
          <div className="flex items-center gap-4 text-ink-muted">
            <a href="#" aria-label="Почта" className="hover:text-accent transition-colors">
              <Mail size={18} strokeWidth={1.5} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-accent transition-colors">
              <Instagram size={18} strokeWidth={1.5} />
            </a>
            <a href="#" aria-label="Telegram" className="hover:text-accent transition-colors">
              <Twitter size={18} strokeWidth={1.5} />
            </a>
          </div>
        </div>
        <div className="mt-12 border-t border-mist pt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-xs text-ink-muted">
            © Поднебесная. Все права защищены.
          </p>
          <p className="text-xs text-ink-muted">
            Ароматические свечи — товар с открытым пламенем. Используйте с осторожностью.
          </p>
        </div>
      </div>
    </footer>
  );
}