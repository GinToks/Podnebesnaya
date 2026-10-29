"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface User { email: string; name: string | null; emailVerified?: boolean }
interface OrderItem { productId: string; productName: string; quantity: number; price: number }
interface Order { id: string; status: string; totalPrice: number; createdAt: string; items: OrderItem[]; customerAddress: string; trackingNumber?: string }

const STATUS_LABELS: Record<string, string> = {
  new: "Новый",
  processing: "В обработке",
  completed: "Выполнен",
  cancelled: "Отменён",
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [resending, setResending] = useState(false);

  const loadMe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/customer/me");
      if (res.ok) {
        const data = await res.json();
        setUser({ email: data.email, name: data.name, emailVerified: data.emailVerified });
        const oRes = await fetch("/api/customer/orders");
        if (oRes.ok) setOrders(await oRes.json());
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => { loadMe(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    const url = mode === "login" ? "/api/customer/login" : "/api/customer/register";
    const body = mode === "login" ? { email, password } : { email, password, name };
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Ошибка"); return; }
    if (mode === "register") {
      setInfo("Регистрация успешна. Проверьте email для подтверждения.");
    }
    await loadMe();
  };

  const logout = async () => {
    await fetch("/api/customer/me", { method: "DELETE" });
    setUser(null);
    setOrders([]);
  };

  const resend = async () => {
    setResending(true);
    try {
      const res = await fetch("/api/customer/resend-verify", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка");
      setInfo(data.alreadyVerified ? "Email уже подтверждён" : "Письмо отправлено повторно");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    }
    setResending(false);
  };

  if (loading) return <main className="min-h-screen bg-bg text-ink flex items-center justify-center">Загрузка…</main>;

  if (!user) {
    return (
      <main className="min-h-screen bg-bg text-ink flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-bg-elevated border border-mist rounded-2xl p-8 shadow-sm">
          <h1 className="serif text-2xl font-light tracking-[0.1em] text-ink mb-6 text-center">
            {mode === "login" ? "Вход" : "Регистрация"}
          </h1>
          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs text-ink-muted mb-1.5">Имя</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm" />
              </div>
            )}
            <div>
              <label className="block text-xs text-ink-muted mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm" />
            </div>
            <div>
              <label className="block text-xs text-ink-muted mb-1.5">Пароль</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm" />
            </div>
            {error && <p className="text-sm text-accent">{error}</p>}
            {info && <p className="text-sm text-olive">{info}</p>}
            <button type="submit" className="w-full py-2.5 rounded-lg bg-sage text-white text-sm font-medium hover:bg-sage-dark transition-colors">
              {mode === "login" ? "Войти" : "Зарегистрироваться"}
            </button>
          </form>
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setInfo(""); }} className="mt-4 w-full text-sm text-ink-muted hover:text-ink transition-colors">
            {mode === "login" ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
          </button>
          <Link href="/" className="block mt-4 text-center text-xs text-ink-muted hover:text-ink">На главную</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-ink px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">Личный кабинет</h1>
            <p className="text-sm text-ink-muted mt-1">{user.email}</p>
          </div>
          <button onClick={logout} className="px-4 py-2 rounded-lg border border-mist text-ink text-sm hover:bg-mist transition-colors">Выйти</button>
        </div>

        {!user.emailVerified && (
          <div className="mb-6 p-4 bg-gold/10 border border-gold/30 rounded-xl flex items-center justify-between gap-4">
            <p className="text-sm text-ink">Email не подтверждён. Проверьте почту.</p>
            <button onClick={resend} disabled={resending} className="px-3 py-1.5 rounded-lg bg-gold text-white text-xs font-medium disabled:opacity-50">
              {resending ? "Отправка…" : "Отправить повторно"}
            </button>
          </div>
        )}
        {info && <p className="mb-4 text-sm text-olive">{info}</p>}

        <div className="mb-8 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
          <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">Профиль</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div><span className="text-ink-muted">Имя:</span> <span className="text-ink">{user.name || "—"}</span></div>
            <div><span className="text-ink-muted">Email:</span> <span className="text-ink">{user.email}</span></div>
            <div><span className="text-ink-muted">Статус email:</span> <span className={user.emailVerified ? "text-olive" : "text-accent"}>{user.emailVerified ? "Подтверждён" : "Не подтверждён"}</span></div>
          </div>
        </div>

        <div className="p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
          <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">История заказов</h2>
          {orders.length === 0 ? (
            <p className="text-ink-muted text-sm">Заказов пока нет.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-mist rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-ink">{order.id}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-mist text-ink">{STATUS_LABELS[order.status] || order.status}</span>
                  </div>
                  <p className="text-xs text-ink-muted mb-2">{new Date(order.createdAt).toLocaleString("ru-RU")} · {order.totalPrice.toLocaleString("ru-RU")} ₽</p>
                  <ul className="text-sm text-ink space-y-1">
                    {order.items.map((item, i) => (
                      <li key={i}>{item.productName} × {item.quantity} — {(item.price * item.quantity).toLocaleString("ru-RU")} ₽</li>
                    ))}
                  </ul>
                  {order.trackingNumber && <p className="mt-2 text-xs text-ink-muted">Трек-номер: {order.trackingNumber}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
        <Link href="/" className="inline-block mt-8 text-sm text-ink-muted hover:text-ink">На главную</Link>
      </div>
    </main>
  );
}
