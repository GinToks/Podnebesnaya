"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { Shield, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const login = useAdminAuthStore((state) => state.login);
  const isBlocked = useAdminAuthStore((state) => state.isBlocked);
  const getRemainingBlockTime = useAdminAuthStore((state) => state.getRemainingBlockTime);
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isBlocked()) {
      setError(true);
      setTimeout(() => setError(false), 3000);
      return;
    }
    if (login(password)) {
      router.push("/admin");
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg relative z-10">
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-8 bg-bg border border-mist rounded-xl shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col items-center gap-2 mb-8">
          <Shield size={32} strokeWidth={2} className="text-accent" />
          <h2 className="serif text-2xl font-light tracking-[0.1em] text-ink">
            Админ-панель
          </h2>
          <p className="text-sm text-ink-muted">Вход для управления каталогом</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink/80 mb-1.5">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded bg-mist border border-mist text-ink focus:border-sky outline-none transition-colors placeholder:text-ink/50"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="text-xs text-accent">Неверный пароль</p>
          )}
          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-accent text-bg text-sm font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors disabled:opacity-60"
            disabled={!password}
          >
            Войти <Lock size={16} strokeWidth={2} />
          </button>
        </div>
      </motion.form>
    </div>
  );
}
