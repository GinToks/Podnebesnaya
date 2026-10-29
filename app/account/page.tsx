"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Mail, Package, LogOut, CheckCircle2, AlertCircle, Send, ShoppingBag } from "lucide-react";

interface User { email: string; name: string | null; emailVerified?: boolean }
interface OrderItem { productId: string; productName: string; quantity: number; price: number }
interface Order { id: string; status: string; totalPrice: number; createdAt: string; items: OrderItem[]; customerAddress: string; trackingNumber?: string }

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "Новый", color: "bg-sky/20 text-sky" },
  processing: { label: "В обработке", color: "bg-gold/20 text-gold" },
  completed: { label: "Выполнен", color: "bg-olive/20 text-olive" },
  cancelled: { label: "Отменён", color: "bg-accent/20 text-accent" },
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
      setInfo("Регистрация успешна. Добро пожаловать!");
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

  if (loading) {
    return (
      <main className="min-h-screen bg-bg text-ink flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-mist border-t-sage rounded-full animate-spin" />
          <p className="text-sm text-ink-muted">Загрузка…</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-bg text-ink flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-sage to-olive flex items-center justify-center shadow-sm">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">
              {mode === "login" ? "Добро пожаловать" : "Создать аккаунт"}
            </h1>
            <p className="text-sm text-ink-muted mt-2">
              {mode === "login" ? "Войдите в личный кабинет" : "Зарегистрируйтесь для отслеживания заказов"}
            </p>
          </div>

          <div className="bg-bg-elevated border border-mist rounded-2xl shadow-sm overflow-hidden">
            <div className="flex border-b border-mist">
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); setInfo(""); }}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === "login" ? "bg-sage/10 text-sage border-b-2 border-sage" : "text-ink-muted hover:text-ink hover:bg-mist/40"}`}
              >
                Вход
              </button>
              <button
                type="button"
                onClick={() => { setMode("register"); setError(""); setInfo(""); }}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === "register" ? "bg-sage/10 text-sage border-b-2 border-sage" : "text-ink-muted hover:text-ink hover:bg-mist/40"}`}
              >
                Регистрация
              </button>
            </div>

            <form onSubmit={submit} className="p-8 space-y-5">
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Имя</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Как к вам обращаться" className="w-full px-4 py-3 rounded-xl bg-mist/40 border border-mist text-ink text-sm placeholder:text-ink-muted/60 focus:border-sage focus:bg-bg outline-none transition-colors" />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 rounded-xl bg-mist/40 border border-mist text-ink text-sm placeholder:text-ink-muted/60 focus:border-sage focus:bg-bg outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Пароль</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-mist/40 border border-mist text-ink text-sm placeholder:text-ink-muted/60 focus:border-sage focus:bg-bg outline-none transition-colors" />
              </div>
              {error && <div className="flex items-center gap-2 text-sm text-accent"><AlertCircle className="w-4 h-4" />{error}</div>}
              {info && <div className="flex items-center gap-2 text-sm text-olive"><CheckCircle2 className="w-4 h-4" />{info}</div>}
              <button type="submit" className="w-full py-3.5 rounded-xl bg-sage text-white text-sm font-semibold hover:bg-sage-dark transition-colors shadow-sm">
                {mode === "login" ? "Войти" : "Зарегистрироваться"}
              </button>
            </form>
          </div>

          <Link href="/" className="block mt-6 text-center text-xs text-ink-muted hover:text-ink transition-colors">← На главную</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-ink">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sage to-olive flex items-center justify-center text-white text-xl font-light shadow-sm">
              {(user.name || user.email).charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">Личный кабинет</h1>
              <p className="text-sm text-ink-muted">{user.name || "Пользователь"} · {user.email}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-mist text-ink text-sm hover:bg-mist transition-colors self-start sm:self-auto">
            <LogOut className="w-4 h-4" /> Выйти
          </button>
        </div>

        {/* Email verification banner */}
        {!user.emailVerified && (
          <div className="mb-6 p-4 bg-gold/10 border border-gold/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-gold flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-ink">Email не подтверждён</p>
                <p className="text-xs text-ink-muted">Проверьте почту или отправьте письмо повторно.</p>
              </div>
            </div>
            <button onClick={resend} disabled={resending} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-white text-sm font-medium disabled:opacity-50 hover:bg-gold/90 transition-colors">
              <Send className="w-4 h-4" /> {resending ? "Отправка…" : "Отправить повторно"}
            </button>
          </div>
        )}
        {info && <div className="mb-6 flex items-center gap-2 text-sm text-olive"><CheckCircle2 className="w-4 h-4" />{info}</div>}

        {/* Profile card */}
        <div className="mb-8 bg-bg-elevated border border-mist rounded-2xl p-6 shadow-sm">
          <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-sage" /> Профиль
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 bg-mist/30 rounded-xl">
              <p className="text-xs text-ink-muted mb-1">Имя</p>
              <p className="text-sm font-medium text-ink">{user.name || "—"}</p>
            </div>
            <div className="p-4 bg-mist/30 rounded-xl">
              <p className="text-xs text-ink-muted mb-1">Email</p>
              <p className="text-sm font-medium text-ink truncate">{user.email}</p>
            </div>
            <div className="p-4 bg-mist/30 rounded-xl">
              <p className="text-xs text-ink-muted mb-1">Статус email</p>
              <p className={`text-sm font-medium ${user.emailVerified ? "text-olive" : "text-accent"}`}>
                {user.emailVerified ? "Подтверждён" : "Не подтверждён"}
              </p>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-bg-elevated border border-mist rounded-2xl p-6 shadow-sm">
          <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-sage" /> История заказов
          </h2>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-ink-muted/40 mx-auto mb-3" />
              <p className="text-ink-muted text-sm">Заказов пока нет</p>
              <Link href="/#catalog" className="inline-block mt-4 text-sm text-sage hover:underline">Перейти в каталог</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const st = STATUS_LABELS[order.status] || { label: order.status, color: "bg-mist text-ink" };
                return (
                  <div key={order.id} className="border border-mist rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-ink">{order.id}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${st.color}`}>{st.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-ink">{order.totalPrice.toLocaleString("ru-RU")} ₽</span>
                    </div>
                    <p className="text-xs text-ink-muted mb-3">{new Date(order.createdAt).toLocaleString("ru-RU")} · {order.customerAddress}</p>
                    <ul className="text-sm text-ink space-y-1.5">
                      {order.items.map((item, i) => (
                        <li key={i} className="flex justify-between gap-4">
                          <span className="truncate">{item.productName} × {item.quantity}</span>
                          <span className="text-ink-muted flex-shrink-0">{(item.price * item.quantity).toLocaleString("ru-RU")} ₽</span>
                        </li>
                      ))}
                    </ul>
                    {order.trackingNumber && (
                      <div className="mt-3 pt-3 border-t border-mist text-xs text-ink-muted">
                        Трек-номер: <span className="font-mono text-ink">{order.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Link href="/" className="inline-block mt-8 text-sm text-ink-muted hover:text-ink transition-colors">← На главную</Link>
      </div>
    </main>
  );
}
