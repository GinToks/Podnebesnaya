"use client";

import { useState } from "react";
import Link from "next/link";

export default function TrackPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    if (!orderId.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("fail");
      const orders = await res.json();
      const found = orders.find((o: any) => o.id === orderId.trim());
      if (!found) setError("Заказ не найден");
      else setOrder(found);
    } catch {
      setError("Не удалось загрузить данные");
    }
    setLoading(false);
  };

  const statusLabels: Record<string, string> = {
    new: "Новый",
    processing: "В обработке",
    completed: "Выполнен",
    cancelled: "Отменён",
  };

  return (
    <main className="min-h-screen bg-bg text-ink px-4 py-10">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="text-sm text-accent hover:underline">← На главную</Link>
        <h1 className="serif text-3xl font-light tracking-[0.1em] mt-4 mb-6">Отследить заказ</h1>
        <div className="flex gap-2 mb-6">
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Номер заказа (ORD-...)"
            className="flex-1 px-3 py-2 rounded bg-mist border border-mist text-sm text-ink"
          />
          <button
            onClick={lookup}
            disabled={loading}
            className="px-5 py-2 rounded-full bg-accent text-bg text-sm font-medium disabled:opacity-50"
          >
            Найти
          </button>
        </div>
        {error && <p className="text-sm text-accent mb-4">{error}</p>}
        {order && (
          <div className="border border-mist rounded-xl p-5 space-y-3">
            <p className="font-medium text-ink">{order.id}</p>
            <p className="text-sm text-ink-muted">Статус: {statusLabels[order.status] || order.status}</p>
            {order.trackingNumber && (
              <p className="text-sm text-ink-muted">Трек-номер: <span className="font-mono text-ink">{order.trackingNumber}</span></p>
            )}
            <p className="text-sm text-ink-muted">Сумма: {order.totalPrice.toLocaleString("ru-RU")} ₽</p>
            <p className="text-xs text-ink-muted">{new Date(order.createdAt).toLocaleString("ru-RU")}</p>
          </div>
        )}
      </div>
    </main>
  );
}
