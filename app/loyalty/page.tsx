"use client";
import { useLoyaltyStore } from "@/store/loyaltyStore";
import { Star, TrendingUp, TrendingDown, Gift } from "lucide-react";

export default function LoyaltyPage() {
  const { points, transactions } = useLoyaltyStore();

  return (
    <section className="py-20 sm:py-28 lg:py-36 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="serif text-3xl sm:text-4xl font-light tracking-[0.1em] text-ink mb-8">
          Программа лояльности
        </h1>

        {/* Balance card */}
        <div className="max-w-md mx-auto mb-12 p-8 bg-bg-elevated border border-mist rounded-2xl text-center">
          <Star size={40} className="mx-auto text-gold mb-4" />
          <p className="text-ink-muted text-sm mb-2">Ваш баланс баллов</p>
          <p className="serif text-5xl font-light text-ink mb-2">{points}</p>
          <p className="text-xs text-ink-muted">
            1 балл = 1 ₽ скидки при следующей покупке
          </p>
        </div>

        {/* How it works */}
        <div className="max-w-2xl mx-auto mb-12 p-6 bg-mist/50 rounded-xl">
          <h2 className="serif text-xl font-light text-ink mb-4">Как это работает</h2>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li className="flex items-start gap-2">
              <TrendingUp size={16} className="text-olive mt-0.5 flex-shrink-0" />
              <span>За каждую покупку вы получаете 5% от суммы заказа в баллах</span>
            </li>
            <li className="flex items-start gap-2">
              <Gift size={16} className="text-sakura-dark mt-0.5 flex-shrink-0" />
              <span>Баллы можно использовать как скидку при оформлении заказа</span>
            </li>
            <li className="flex items-start gap-2">
              <Star size={16} className="text-gold mt-0.5 flex-shrink-0" />
              <span>Баллы не сгорают и накапливаются бессрочно</span>
            </li>
          </ul>
        </div>

        {/* Transaction history */}
        <div className="max-w-2xl mx-auto">
          <h2 className="serif text-2xl font-light text-ink mb-6">История операций</h2>
          {transactions.length === 0 ? (
            <p className="text-ink-muted text-center py-8">Операций пока нет</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 bg-bg-elevated border border-mist rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    {tx.type === "earn" ? (
                      <TrendingUp size={18} className="text-olive" />
                    ) : (
                      <TrendingDown size={18} className="text-accent" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-ink">{tx.description}</p>
                      <p className="text-xs text-ink-muted">
                        {new Date(tx.date).toLocaleString("ru-RU")}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-mono text-sm font-bold ${
                      tx.type === "earn" ? "text-olive" : "text-accent"
                    }`}
                  >
                    {tx.type === "earn" ? "+" : "-"}{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}