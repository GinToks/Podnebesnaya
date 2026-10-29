"use client";

import { useEffect, useState } from "react";
import { X, Search } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  emailVerified: boolean;
  subscriptionActive: boolean;
  subscriptionMonths: number | null;
  subscriptionUntil: string | null;
  ordersCount: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: { productName: string; quantity: number; price: number }[];
}

type SortKey = "email" | "name" | "createdAt" | "ordersCount" | "subscription";

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [subFilter, setSubFilter] = useState<"all" | "active" | "none">("all");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/customers");
      if (res.ok) setUsers(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoadingOrders(true);
    fetch("/api/orders")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.items || [];
        setOrders(arr.filter((o: Order) => o.customerEmail === selected.email));
      })
      .finally(() => setLoadingOrders(false));
  }, [selected]);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    if (q && !(u.email.toLowerCase().includes(q) || (u.name || "").toLowerCase().includes(q))) return false;
    if (subFilter === "active" && !u.subscriptionActive) return false;
    if (subFilter === "none" && u.subscriptionActive) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let va: any, vb: any;
    switch (sortKey) {
      case "email": va = a.email; vb = b.email; break;
      case "name": va = a.name || ""; vb = b.name || ""; break;
      case "createdAt": va = new Date(a.createdAt).getTime(); vb = new Date(b.createdAt).getTime(); break;
      case "ordersCount": va = a.ordersCount; vb = b.ordersCount; break;
      case "subscription": va = a.subscriptionActive ? 1 : 0; vb = b.subscriptionActive ? 1 : 0; break;
      default: va = a.createdAt; vb = b.createdAt;
    }
    if (va < vb) return sortDir === "asc" ? -1 : 1;
    if (va > vb) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const PAGE_SIZE = 15;
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageUsers = sorted.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">Пользователи</h1>
        <p className="text-sm text-ink-muted mt-1">Список зарегистрированных покупателей.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по email или имени"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-mist bg-bg-elevated text-sm"
          />
        </div>
        <select
          value={subFilter}
          onChange={(e) => { setSubFilter(e.target.value as any); setPage(0); }}
          className="px-3 py-2 rounded-xl border border-mist bg-bg-elevated text-sm"
        >
          <option value="all">Все</option>
          <option value="active">С подпиской</option>
          <option value="none">Без подписки</option>
        </select>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="px-3 py-2 rounded-xl border border-mist bg-bg-elevated text-sm"
        >
          <option value="createdAt">По дате</option>
          <option value="email">По email</option>
          <option value="name">По имени</option>
          <option value="ordersCount">По заказам</option>
          <option value="subscription">По подписке</option>
        </select>
        <button
          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          className="px-3 py-2 rounded-xl border border-mist bg-bg-elevated text-sm"
        >
          {sortDir === "asc" ? "↑" : "↓"}
        </button>
      </div>

      {loading ? (
        <p className="text-ink-muted">Загрузка...</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-bg-elevated border border-mist rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mist text-left text-ink-muted">
                <th className="p-3 cursor-pointer" onClick={() => toggleSort("email")}>Email</th>
                <th className="p-3 cursor-pointer" onClick={() => toggleSort("name")}>Имя</th>
                <th className="p-3 cursor-pointer" onClick={() => toggleSort("createdAt")}>Регистрация</th>
                <th className="p-3 cursor-pointer" onClick={() => toggleSort("ordersCount")}>Заказы</th>
                <th className="p-3 cursor-pointer" onClick={() => toggleSort("subscription")}>Подписка</th>
                <th className="p-3">Действия</th>
              </tr>
            </thead>
            <tbody>
              {pageUsers.map((u) => (
                <tr key={u.id} className="border-b border-mist last:border-0 hover:bg-mist/30">
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.name || "—"}</td>
                  <td className="p-3">{new Date(u.createdAt).toLocaleDateString("ru-RU")}</td>
                  <td className="p-3">{u.ordersCount}</td>
                  <td className="p-3">
                    {u.subscriptionActive ? (
                      <span className="text-green-600 text-xs">Активна{u.subscriptionUntil ? ` до ${new Date(u.subscriptionUntil).toLocaleDateString("ru-RU")}` : ""}</span>
                    ) : (
                      <span className="text-ink-muted text-xs">Нет</span>
                    )}
                  </td>
                  <td className="p-3">
                    <button onClick={() => setSelected(u)} className="text-accent hover:underline text-xs">
                      Подробнее
                    </button>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-ink-muted">Нет пользователей</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {sorted.length > PAGE_SIZE && (
          <div className="flex items-center justify-between mt-4 text-sm">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="px-3 py-1.5 rounded border border-mist text-ink disabled:opacity-40"
            >
              Назад
            </button>
            <span className="text-ink-muted">
              Стр. {safePage + 1} из {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              className="px-3 py-1.5 rounded border border-mist text-ink disabled:opacity-40"
            >
              Вперёд
            </button>
          </div>
        )}
        </>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-bg-elevated rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink">Пользователь</h2>
              <button onClick={() => setSelected(null)} className="text-ink-muted hover:text-ink">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-sm mb-6">
              <p><span className="text-ink-muted">ID:</span> {selected.id}</p>
              <p><span className="text-ink-muted">Email:</span> {selected.email}</p>
              <p><span className="text-ink-muted">Имя:</span> {selected.name || "—"}</p>
              <p><span className="text-ink-muted">Регистрация:</span> {new Date(selected.createdAt).toLocaleString("ru-RU")}</p>
              <p><span className="text-ink-muted">Email подтверждён:</span> {selected.emailVerified ? "Да" : "Нет"}</p>
              <p><span className="text-ink-muted">Заказов:</span> {selected.ordersCount}</p>
              <p>
                <span className="text-ink-muted">Подписка:</span>{" "}
                {selected.subscriptionActive
                  ? `Активна (${selected.subscriptionMonths ?? "?"} мес.) до ${selected.subscriptionUntil ? new Date(selected.subscriptionUntil).toLocaleDateString("ru-RU") : "—"}`
                  : "Нет"}
              </p>
            </div>
            <h3 className="serif text-lg font-light tracking-[0.08em] text-ink mb-3">Заказы</h3>
            {loadingOrders ? (
              <p className="text-ink-muted text-sm">Загрузка...</p>
            ) : orders.length === 0 ? (
              <p className="text-ink-muted text-sm">Заказов нет</p>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="border border-mist rounded-xl p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">{o.id}</span>
                      <span className="text-ink-muted">{new Date(o.createdAt).toLocaleDateString("ru-RU")}</span>
                    </div>
                    <div className="text-ink-muted mt-1">Статус: {o.status} · {o.totalPrice} ₽</div>
                    <ul className="mt-2 text-xs text-ink-muted">
                      {o.items.map((it, i) => (
                        <li key={i}>{it.productName} × {it.quantity}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
