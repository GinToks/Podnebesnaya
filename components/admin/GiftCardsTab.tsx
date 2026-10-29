"use client";

import { useEffect, useState } from "react";
import { useAdminGiftCardStore } from "@/store/adminGiftCardStore";

export default function GiftCardsTab() {
  const { cards, isLoading, fetch, create } = useAdminGiftCardStore();
  const [gcCode, setGcCode] = useState("");
  const [gcAmount, setGcAmount] = useState("");

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <>
      <div className="mb-8">
        <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">Подарочные карты</h1>
        <p className="text-sm text-ink-muted mt-1">Создание и управление подарочными сертификатами.</p>
      </div>
      <div className="mb-6 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
        <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">Новая карта</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">Код (необязательно)</label>
            <input value={gcCode} onChange={(e) => setGcCode(e.target.value)} className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm" placeholder="GC-XXXXXX" />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">Сумма (₽)</label>
            <input type="number" value={gcAmount} onChange={(e) => setGcAmount(e.target.value)} className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm" placeholder="1000" />
          </div>
          <div className="flex items-end">
            <button
              onClick={async () => {
                const amt = Number(gcAmount);
                if (!amt || amt <= 0) { alert("Укажите сумму"); return; }
                const card = await create(amt, gcCode || undefined);
                if (!card) { alert("Ошибка создания"); return; }
                setGcAmount("");
                setGcCode("");
              }}
              className="px-6 py-2.5 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase"
            >
              Создать
            </button>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-mist bg-bg overflow-x-auto shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-mist bg-mist">
              <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Код</th>
              <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Начальная сумма</th>
              <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Баланс</th>
              <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Дата</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist/50">
            {isLoading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-ink-muted text-sm">Загрузка...</td></tr>
            ) : cards.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-ink-muted text-sm">Карт пока нет.</td></tr>
            ) : (
              cards.map((c) => (
                <tr key={c.code}>
                  <td className="px-4 py-4 font-medium text-ink">{c.code}</td>
                  <td className="px-4 py-4 text-ink-muted">{c.initialAmount.toLocaleString("ru-RU")} ₽</td>
                  <td className="px-4 py-4 text-ink-muted">{c.balance.toLocaleString("ru-RU")} ₽</td>
                  <td className="px-4 py-4 text-ink-muted text-xs">{new Date(c.createdAt).toLocaleString("ru-RU")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}