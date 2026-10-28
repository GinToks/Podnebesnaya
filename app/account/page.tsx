"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AccountPage() {
  const [user, setUser] = useState<{ email: string; name: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<any[]>([]);

  const loadMe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/customer/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
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
    const url = mode === "login" ? "/api/customer/login" : "/api/customer/register";
    const body = mode === "login" ? { email, password } : { email, password, name };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Ошибка"); return; }
    await loadMe();
  };

  const logout = async () => {
    await fetch("/api/customer/me", { method: "DELETE" });
    setUser(null);
    setOrders([]);
  };

  if (loading) return <main className="min-h-screen bg-bg text-ink flex items-center justify-center">Загрузка…</main>;

  if (!user) {
    return (
      <main className="min-h-screen bg-bg text-ink px-4 py-10">
        <div className="max-w-md mx-auto">
          <Link href="/" className="text-sm text-accent hover:underline">← На главную</Link>
          <h1 className="serif text-3xl font-light tracking-[0.1em] mt-4 mb-6">
            {mode === "login" ? "Вход" : "Регистрация"}
          </h1>
          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Имя"
                className="w-full px-3 py-2 rounded bg-mist border border-mist text-sm text-ink"
              />
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-3 py-2 rounded bg-mist border border-mist text-sm text-ink"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль (от 6 символов)"
              required
              className="w-full px-3 py-2 rounded bg-mist border border-mist text-sm text-ink"
            />
            {error && <p className="text-sm text-accent">{error}</p>}
            <button type="submit" className="w-full py-2 rounded-full bg-accent text-bg text-sm font-medium">
              {mode === "login" ? "Войти" : "Зарегистрироваться"}
            </button>
          </form>
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="mt-4 text-sm text-accent hover:underline"
          >
            {mode === "login" ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-ink px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-accent hover:underline">← На главную</Link>
        <div className="flex items-center justify-between mt-4 mb-6">
          <h1 className="serif text-3xl font-light tracking-[0.1em]">Личный кабинет</h1>
          <button onClick={logout} className="text-sm text-accent hover:underline">Выйти</button>
        </div>
        <p className="text-sm text-ink-muted mb-6">{user.name || user.email}</p>
        <h2 className="text-lg font-medium mb-3">Мои заказы</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-ink-muted">Заказов пока нет.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="border border-mist rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm text-ink">{o.id}</span>
                  <span className="text-xs text-ink-muted">{new Date(o.createdAt).toLocaleDateString("ru-RU")}</span>
                </div>
                <p className="text-sm text-ink-muted">Сумма: {o.totalPrice.toLocaleString("ru-RU")} ₽</p>
                {o.trackingNumber && (
                  <p className="text-sm text-ink-muted">Трек: {o.trackingNumber}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
