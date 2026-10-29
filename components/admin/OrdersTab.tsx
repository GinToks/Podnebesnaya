"use client";

import type { Order } from "@/store/orderStore";

interface Props {
  orderSearch: string;
  setOrderSearch: (v: string) => void;
  orderStatusFilter: string;
  setOrderStatusFilter: (v: string) => void;
  filteredOrders: Order[];
  statusLabels: Record<string, string>;
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  setSelectedOrder: (o: Order | null) => void;
}

export default function OrdersTab({
  orderSearch,
  setOrderSearch,
  orderStatusFilter,
  setOrderStatusFilter,
  filteredOrders,
  statusLabels,
  updateOrderStatus,
  deleteOrder,
  setSelectedOrder,
}: Props) {
  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">Заказы</h1>
          <p className="text-sm text-ink-muted mt-1">Все оформленные заказы с данными клиентов и составом.</p>
        </div>
        <button
          type="button"
          onClick={async () => {
            try {
              const res = await fetch("/api/orders?limit=100000");
              const data = await res.json();
              const orders = Array.isArray(data) ? data : data.items || [];
              const header = ["Номер", "Дата", "Клиент", "Email", "Телефон", "Адрес", "Сумма", "Статус"].join(";");
              const rows = orders.map((o: Order) => [
                o.id,
                o.createdAt,
                `"${(o.customerName || "").replace(/"/g, '""')}"`,
                o.customerEmail,
                o.customerPhone || "",
                `"${(o.customerAddress || "").replace(/"/g, '""')}"`,
                o.totalPrice,
                o.status,
              ].join(";"));
              const csv = [header, ...rows].join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            } catch (e) {
              alert("Не удалось экспортировать заказы");
            }
          }}
          className="px-4 py-2 rounded-lg border border-mist text-ink text-sm hover:bg-mist transition-colors"
        >
          Экспорт CSV
        </button>
      </div>
      <div className="rounded-xl border border-mist bg-bg overflow-x-auto shadow-sm">
        <div className="p-3 flex flex-col sm:flex-row gap-3 border-b border-mist">
          <input
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            placeholder="Поиск по номеру, имени, email, телефону"
            className="flex-1 px-3 py-2 rounded bg-mist border border-mist text-sm text-ink"
          />
          <select
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            className="px-3 py-2 rounded bg-mist border border-mist text-sm text-ink"
          >
            <option value="all">Все статусы</option>
            <option value="new">Новый</option>
            <option value="processing">В обработке</option>
            <option value="completed">Выполнен</option>
            <option value="cancelled">Отменён</option>
          </select>
        </div>
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
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-muted text-sm">Заказов пока нет.</td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-mist/30 transition-colors group">
                  <td className="px-4 py-4">
                    <p className="font-medium text-ink">{order.id}</p>
                    <p className="text-xs text-ink-muted">{new Date(order.createdAt).toLocaleString("ru-RU")}</p>
                  </td>
                  <td className="px-4 py-4 text-ink-muted">
                    <p className="font-medium text-ink">{order.customerName}</p>
                    <p className="text-xs text-ink-muted">{order.customerEmail}</p>
                    {order.customerPhone && <p className="text-xs text-ink-muted">📞 {order.customerPhone}</p>}
                    {order.contactMethod && <p className="text-xs text-ink-muted">Связь: {order.contactMethod === "whatsapp" ? "WhatsApp" : order.contactMethod === "max" ? "Max" : "Telegram"}</p>}
                    <p className="text-xs text-ink-muted">{order.customerAddress}</p>
                  </td>
                  <td className="px-4 py-4 text-ink-muted">{order.totalPrice.toLocaleString("ru-RU")} ₽</td>
                  <td className="px-4 py-4">
                    <select
                      value={order.status}
                      onChange={async (e) => await updateOrderStatus(order.id, e.target.value as "new" | "processing" | "completed" | "cancelled")}
                      className="px-2 py-1 rounded bg-mist border border-mist text-[11px] text-ink outline-none focus:border-sky"
                    >
                      {["new", "processing", "completed", "cancelled"].map((s) => (
                        <option key={s} value={s}>{statusLabels[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={() => setSelectedOrder(order)} className="text-xs text-accent hover:underline mr-3" title="Подробнее">Подробнее</button>
                    <button onClick={async () => await deleteOrder(order.id)} className="text-xs text-accent hover:underline" title="Удалить заказ">Удалить</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
