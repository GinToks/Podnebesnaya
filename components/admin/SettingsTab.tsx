"use client";

import { useCatalogStore } from "@/store/catalogStore";
import { useOrderStore } from "@/store/orderStore";
import { usePromoStore } from "@/store/promoStore";
import { usePromoBannerStore } from "@/store/promoBannerStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useHeroImageStore } from "@/store/heroImageStore";
import { useThemeStore, seasonThemes } from "@/store/themeStore";
import { compressImage } from "@/lib/imageCompression";
import Image from "next/image";

import { useEffect, useState } from "react";

export default function SettingsTab() {
  const { products } = useCatalogStore();
  const { orders } = useOrderStore();
  const { codes } = usePromoStore();
  const { banners } = usePromoBannerStore();
  const { categories } = useCategoryStore();
  const { imageUrl: heroImageUrl, setImage: setHeroImage, clearImage: clearHeroImage } = useHeroImageStore();
  const { season, setSeason } = useThemeStore();
  const [tgToken, setTgToken] = useState("");
  const [tgChatId, setTgChatId] = useState("");
  const [waNumber, setWaNumber] = useState("");
  const [messengerStatus, setMessengerStatus] = useState("");
  useEffect(() => {
    fetch("/api/settings/messenger").then((r) => r.json()).then((s) => {
      setTgToken(s.tgToken || "");
      setTgChatId(s.tgChatId || "");
      setWaNumber(s.waNumber || "");
    }).catch(() => {});
  }, []);
  return (
<div>
            <div className="mb-8">
            <div className="mb-8">
              <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">
                Настройки сайта
              </h1>
              <p className="text-sm text-ink-muted mt-1">
                Управление изображением в Hero-секции, бэкап данных и другие настройки.
              </p>
            </div>

            <div className="mb-8 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                Бэкап и восстановление
              </h2>
              <p className="text-sm text-ink-muted mb-4">
                Экспорт всех данных (товары, заказы, промокоды, баннеры, категории) в JSON-файл. Импорт из файла восстановит данные.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const data = {
                      products: products,
                      orders: orders,
                      promos: codes,
                      banners: banners,
                      categories: categories,
                      heroImage: heroImageUrl,
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `podnebesnaya-backup-${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-5 py-2.5 rounded-full bg-olive text-bg text-xs font-medium tracking-wide uppercase hover:bg-olive-hover transition-colors"
                >
                  Экспорт данных
                </button>
                <label className="px-5 py-2.5 rounded-full border border-accent text-accent text-xs font-medium tracking-wide uppercase hover:bg-accent hover:text-bg transition-colors cursor-pointer">
                  Импорт данных
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        try {
                          const data = JSON.parse(ev.target?.result as string);
                          if (data.products) localStorage.setItem("podnebesnaya-catalog", JSON.stringify(data.products));
                          if (data.orders) localStorage.setItem("podnebesnaya-orders", JSON.stringify(data.orders));
                          if (data.promos) localStorage.setItem("podnebesnaya-promos", JSON.stringify(data.promos));
                          if (data.banners) { for (const b of data.banners) { fetch("/api/banners", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }); } }
                          if (data.categories) localStorage.setItem("podnebesnaya-categories", JSON.stringify(data.categories));
                          if (data.heroImage) localStorage.setItem("podnebesnaya-hero-image", JSON.stringify(data.heroImage));
                          alert("Данные успешно импортированы. Перезагрузите страницу.");
                        } catch (err) {
                          alert("Ошибка при импорте данных");
                        }
                      };
                      reader.readAsText(file);
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="mb-8 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                Тема оформления (сезон)
              </h2>
              <p className="text-sm text-ink-muted mb-4">
                Выберите сезонную цветовую палитру для сайта.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(["spring", "summer", "autumn", "winter"] as const).map((s) => {
                  const theme = seasonThemes[s];
                  return (
                    <button
                      key={s}
                      onClick={() => setSeason(s)}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${season === s ? "border-accent bg-accent/10 shadow-lg" : "border-mist bg-bg-elevated hover:border-sky"}`}
                    >
                      <span className="text-2xl mb-1 block">{theme.emoji}</span>
                      <span className="text-sm font-medium text-ink">{theme.name}</span>
                      <div className="flex gap-1 justify-center mt-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.olive }} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.sky }} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.bg }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-8 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                Изображение Hero-секции
              </h2>
              <p className="text-sm text-ink-muted mt-1">
                Управление изображением в Hero-секции и другими настройками.
              </p>
            </div>

            <div className="mb-8 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                Изображение Hero-секции
              </h2>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-64 h-40 rounded-xl overflow-hidden border border-mist bg-mist flex items-center justify-center">
                  {heroImageUrl ? (
                    <Image src={heroImageUrl} alt="Hero" width={256} height={160} loading="lazy" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-ink-muted text-sm">Нет изображения</span>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">
                      Загрузить новое изображение
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        compressImage(file, 400, 0.5).then((result) => {
                          setHeroImage(result);
                        }).catch(() => {
                          alert("Не удалось загрузить изображение");
                        });
                      }}
                      className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors"
                    />
                    <p className="text-[10px] text-ink-muted mt-1">
                      Выберите файл изображения (JPG, PNG, WebP). Изображение будет сохранено в браузере.
                    </p>
                  </div>
                  <button
                    onClick={clearHeroImage}
                    className="px-4 py-2 rounded-full border border-accent text-accent text-xs font-medium tracking-wide uppercase hover:bg-accent hover:text-bg transition-colors"
                  >
                    Сбросить на стандартное
                  </button>
                </div>
              </div>
            </div>
          </div>

            <div className="mb-8 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                Интеграция с мессенджерами
              </h2>
              <p className="text-sm text-ink-muted mb-4">
                Настройте уведомления о новых заказах в Telegram и WhatsApp.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Telegram Bot Token</label>
                  <input id="tg-token" value={tgToken} onChange={(e) => setTgToken(e.target.value)} className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Telegram Chat ID</label>
                  <input id="tg-chatid" value={tgChatId} onChange={(e) => setTgChatId(e.target.value)} className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" placeholder="-1001234567890" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">WhatsApp номер</label>
                  <input id="wa-number" value={waNumber} onChange={(e) => setWaNumber(e.target.value)} className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" placeholder="+7 999 123-45-67" />
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/settings/messenger", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ tgToken, tgChatId, waNumber }),
                        });
                        if (res.ok) alert("Настройки сохранены");
                        else alert("Не удалось сохранить");
                      } catch {
                        alert("Ошибка сети");
                      }
                    }}
                    className="px-5 py-2.5 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors"
                  >
                    Сохранить настройки
                  </button>
                  <button
                    onClick={async () => {
                      setMessengerStatus("Проверка...");
                      try {
                        const res = await fetch("/api/settings/messenger/test", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ tgToken, tgChatId }),
                        });
                        const data = await res.json();
                        if (data.success) {
                          setMessengerStatus(`✅ ${data.message}`);
                        } else {
                          setMessengerStatus(`❌ ${data.error || "Ошибка"}`);
                        }
                      } catch {
                        setMessengerStatus("❌ Ошибка сети");
                      }
                    }}
                    className="px-5 py-2.5 rounded-full border border-accent text-accent text-xs font-medium tracking-wide uppercase hover:bg-accent hover:text-bg transition-colors"
                  >
                    Проверить подключение
                  </button>
                </div>
                {messengerStatus && (
                  <p className="text-sm text-ink-muted mt-2">{messengerStatus}</p>
                )}

              </div>
            </div>

            <div className="mb-8 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                Смена пароля администратора
              </h2>
              <p className="text-sm text-ink-muted mb-4">
                Измените пароль для входа в админ-панель.
              </p>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Текущий пароль</label>
                  <input id="cp-current" type="password" className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Новый пароль</label>
                  <input id="cp-new" type="password" className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Подтвердите новый пароль</label>
                  <input id="cp-confirm" type="password" className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" />
                </div>
                <button
                  onClick={async () => {
                    const current = (document.getElementById("cp-current") as HTMLInputElement)?.value;
                    const newPass = (document.getElementById("cp-new") as HTMLInputElement)?.value;
                    const confirm = (document.getElementById("cp-confirm") as HTMLInputElement)?.value;
                    if (!current || !newPass || !confirm) { alert("Заполните все поля"); return; }
                    if (newPass !== confirm) { alert("Пароли не совпадают"); return; }
                    if (newPass.length < 6) { alert("Пароль должен быть не менее 6 символов"); return; }
                    try {
                      const res = await fetch("/api/auth/change-password", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ currentPassword: current, newPassword: newPass }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        alert("Пароль успешно изменён");
                        (document.getElementById("cp-current") as HTMLInputElement).value = "";
                        (document.getElementById("cp-new") as HTMLInputElement).value = "";
                        (document.getElementById("cp-confirm") as HTMLInputElement).value = "";
                      } else {
                        alert(data.error || "Ошибка смены пароля");
                      }
                    } catch {
                      alert("Ошибка сети");
                    }
                  }}
                  className="px-5 py-2.5 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors"
                >
                  Сменить пароль
                </button>
              </div>
            </div>

            <div className="mb-8 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
              <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                Rate Limiting (защита от брутфорса)
              </h2>
              <p className="text-sm text-ink-muted mb-4">
                Ограничение количества попыток входа в админку. После 5 неудачных попыток — блокировка на 15 минут.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-olive" />
                <span className="text-sm text-ink">Активен (5 попыток / 15 мин блокировка)</span>
              </div>
            </div>

          </div>

  );
}
