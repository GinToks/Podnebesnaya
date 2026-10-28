"use client";

import { useOrderStore } from "@/store/orderStore";
import { useCatalogStore } from "@/store/catalogStore";
import { usePromoStore } from "@/store/promoStore";

export default function AnalyticsTab() {
  const { orders } = useOrderStore();
  const { products } = useCatalogStore();
  const { codes } = usePromoStore();

  return (
    <>
      <div className="mb-8">
        <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">Аналитика продаж</h1>
        <p className="text-sm text-ink-muted mt-1">Обзор продаж, выручки и популярных товаров.</p>
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
        <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">Популярные товары</h2>
        {(() => {
          const productSales: Record<string, { name: string; count: number; revenue: number }> = {};
          orders.forEach((order) => {
            order.items.forEach((item) => {
              if (!productSales[item.productId]) productSales[item.productId] = { name: item.productName, count: 0, revenue: 0 };
              productSales[item.productId].count += item.quantity;
              productSales[item.productId].revenue += item.price * item.quantity;
            });
          });
          const sorted = Object.entries(productSales).sort((a, b) => b[1].count - a[1].count).slice(0, 10);
          const maxCount = sorted.length > 0 ? sorted[0][1].count : 1;
          return (
            <div className="space-y-3">
              {sorted.length === 0 && <p className="text-ink-muted text-sm">Заказов пока нет</p>}
              {sorted.map(([id, data]) => (
                <div key={id} className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{data.name}</p>
                    <p className="text-xs text-ink-muted">{data.count} шт. · {data.revenue.toLocaleString("ru-RU")} ₽</p>
                  </div>
                  <div className="w-48 h-4 bg-mist rounded-full overflow-hidden">
                    <div className="h-full bg-olive rounded-full transition-all" style={{ width: `${(data.count / maxCount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
      <div className="mb-8 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
        <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">Статусы заказов</h2>
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
  );
}
