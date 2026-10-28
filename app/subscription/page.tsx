"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Repeat, ShoppingCart, Sparkles, Check } from "lucide-react";
import Header from "@/components/Header";
import PromoBanner from "@/components/PromoBanner";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { useToastStore } from "@/store/toastStore";

interface Tier {
  months: number;
  pricePerMonth: number;
  description: string;
  badge?: string;
  popular?: boolean;
}

const BASE_PRICE = 1990;

const tiers: Tier[] = [
  {
    months: 1,
    pricePerMonth: 1990,
    description: "Попробуйте ритм: одна авторская свеча каждый месяц, чтобы начать путь.",
  },
  {
    months: 3,
    pricePerMonth: 1790,
    description: "Три месяца уюта — три уникальных аромата для разных настроений.",
    badge: "−10%",
  },
  {
    months: 6,
    pricePerMonth: 1690,
    description: "Полгода гармонии: сезонная коллекция ароматов для дома и души.",
    badge: "−15%",
    popular: true,
  },
  {
    months: 12,
    pricePerMonth: 1490,
    description: "Годовой ритуал: двенадцать свечей — полный круг ароматов Поднебесной.",
    badge: "−25%",
  },
];

export default function SubscriptionPage() {
  const { addToast } = useToastStore();
  const [subscribed, setSubscribed] = useState<number | null>(null);

  const handleSubscribe = (tier: Tier) => {
    const total = tier.pricePerMonth * tier.months;
    setSubscribed(tier.months);
    setTimeout(() => setSubscribed(null), 1500);
    addToast({
      type: "success",
      title: "Подписка оформлена",
      message: `${tier.months} ${tier.months === 1 ? "месяц" : "месяца"} — ${total.toLocaleString("ru-RU")} ₽`,
    });
  };

  const monthLabel = (m: number) =>
    m === 1 ? "месяц" : m < 5 ? "месяца" : "месяцев";

  return (
    <div className="relative z-10">
      <PromoBanner />
      <Header />
      <main>
        <section className="py-16 sm:py-24 lg:py-32 relative z-10 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/#catalog"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent mb-8 hover:underline transition-colors"
            >
              ← В каталог
            </Link>

            <div className="text-center mb-12">
              <span className="inline-block py-1 px-3 rounded-full border border-sakura text-sakura-dark text-[11px] font-semibold uppercase tracking-widest mb-4">
                Подписка
              </span>
              <h1 className="serif text-4xl sm:text-5xl font-light tracking-[0.1em] leading-tight text-ink mb-4">
                Ежемесячная доставка свечей
              </h1>
              <p className="text-lg text-ink-muted leading-relaxed max-w-2xl mx-auto">
                Каждый месяц — новая авторская свеча у вашей двери. Выбирайте
                срок подписки и экономьте на каждом заказе.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tiers.map((tier) => {
                const total = tier.pricePerMonth * tier.months;
                const originalTotal = BASE_PRICE * tier.months;
                const savings = originalTotal - total;
                return (
                  <motion.div
                    key={tier.months}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={`relative flex flex-col p-6 bg-bg-elevated border rounded-2xl transition-colors ${
                      tier.popular
                        ? "border-accent shadow-lg"
                        : "border-mist hover:border-sky"
                    }`}
                  >
                    {tier.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-bg text-[10px] font-bold uppercase tracking-widest">
                        Популярный
                      </span>
                    )}
                    {tier.badge && (
                      <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-sakura text-sakura-dark text-[10px] font-bold">
                        {tier.badge}
                      </span>
                    )}

                    <div className="mb-4">
                      <p className="serif text-2xl font-light text-ink">
                        {tier.months} {monthLabel(tier.months)}
                      </p>
                    </div>

                    <div className="mb-4 flex items-baseline gap-1">
                      <span className="serif text-4xl font-light text-ink">
                        {tier.pricePerMonth.toLocaleString("ru-RU")} ₽
                      </span>
                      <span className="text-xs text-ink-muted">/мес</span>
                    </div>

                    <div className="mb-2 text-sm text-ink-muted">
                      Итого:{" "}
                      <span className="font-medium text-ink">
                        {total.toLocaleString("ru-RU")} ₽
                      </span>
                    </div>

                    {savings > 0 ? (
                      <div className="mb-4 text-sm text-olive font-medium">
                        Экономия {savings.toLocaleString("ru-RU")} ₽
                      </div>
                    ) : (
                      <div className="mb-4 h-5" />
                    )}

                    <p className="text-sm text-ink-muted leading-relaxed mb-6 flex-1">
                      {tier.description}
                    </p>

                    <button
                      onClick={() => handleSubscribe(tier)}
                      disabled={subscribed === tier.months}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-bg text-sm font-medium tracking-wide uppercase hover:bg-accent-hover disabled:opacity-60 transition-colors shadow-sm"
                    >
                      {subscribed === tier.months ? (
                        <>
                          <Check size={16} strokeWidth={2} />
                          Оформлено
                        </>
                      ) : (
                        <>
                          <Repeat size={16} strokeWidth={2} />
                          Подписаться
                        </>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-12 max-w-2xl mx-auto p-6 bg-mist/50 rounded-xl text-sm text-ink-muted">
              <div className="flex items-start gap-3">
                <Sparkles size={18} className="text-gold mt-0.5 shrink-0" />
                <p>
                  Подписку можно отменить в любой момент. Доставка осуществляется
                  один раз в месяц, ароматы подбираются индивидуально с учётом
                  ваших предпочтений.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <CartDrawer />
      <Footer />
    </div>
  );
}
