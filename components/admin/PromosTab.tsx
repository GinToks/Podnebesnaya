"use client";

import { useState } from "react";
import { Plus, Save, X } from "lucide-react";
import { usePromoStore } from "@/store/promoStore";

export default function PromosTab() {
  const { codes, addCode, updateCode, deleteCode } = usePromoStore();
  const [promoForm, setPromoForm] = useState({
    code: "",
    type: "percent" as "percent" | "fixed",
    value: 0,
    maxUses: 1,
    label: "",
    active: true,
  });
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState<string | null>(null);
  return (
          <>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">
                  Промокоды
                </h1>
                <p className="text-sm text-ink-muted mt-1">
                  Управляйте скидками и отслеживайте их использование.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingPromo(null);
                  setPromoForm({
                    code: "",
                    type: "percent",
                    value: 0,
                    maxUses: 1,
                    label: "",
                    active: true,
                  });
                  setShowPromoForm(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors"
              >
                <Plus size={16} strokeWidth={2.5} /> Добавить промокод
              </button>
            </div>

            {showPromoForm && (
              <div className="mb-6 p-6 bg-bg border border-mist rounded-xl shadow-sm">
                <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">
                  {editingPromo ? "Редактирование промокода" : "Новый промокод"}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">Код</label>
                    <input
                      value={promoForm.code}
                      onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                      disabled={!!editingPromo}
                      className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink focus:border-sky outline-none transition-colors disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">Описание</label>
                    <input
                      value={promoForm.label}
                      onChange={(e) => setPromoForm({ ...promoForm, label: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink focus:border-sky outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">Тип</label>
                    <select
                      value={promoForm.type}
                      onChange={(e) => setPromoForm({ ...promoForm, type: e.target.value as "percent" | "fixed" })}
                      className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink focus:border-sky outline-none transition-colors"
                    >
                      <option value="percent">Процент</option>
                      <option value="fixed">Фиксированная сумма</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">Значение</label>
                    <input
                      type="number"
                      value={promoForm.value}
                      onChange={(e) => setPromoForm({ ...promoForm, value: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink focus:border-sky outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1.5">Максимум применений</label>
                    <input
                      type="number"
                      value={promoForm.maxUses}
                      onChange={(e) => setPromoForm({ ...promoForm, maxUses: Number(e.target.value) || 1 })}
                      className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink focus:border-sky outline-none transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input
                      type="checkbox"
                      checked={promoForm.active}
                      onChange={(e) => setPromoForm({ ...promoForm, active: e.target.checked })}
                      className="rounded border-mist text-accent focus:ring-accent"
                    />
                    <span className="text-xs text-ink-muted">Активен</span>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      if (!promoForm.code || !promoForm.value) return;
                      if (editingPromo) {
                        updateCode(editingPromo, {
                          type: promoForm.type,
                          value: promoForm.value,
                          maxUses: promoForm.maxUses,
                          label: promoForm.label || (promoForm.type === "percent" ? `Скидка ${promoForm.value}%` : `Скидка ${promoForm.value} ₽`),
                          active: promoForm.active,
                        });
                      } else {
                        addCode({
                          code: promoForm.code.toUpperCase(),
                          type: promoForm.type,
                          value: promoForm.value,
                          maxUses: promoForm.maxUses,
                          label: promoForm.label || (promoForm.type === "percent" ? `Скидка ${promoForm.value}%` : `Скидка ${promoForm.value} ₽`),
                          active: promoForm.active,
                        });
                      }
                      setShowPromoForm(false);
                      setEditingPromo(null);
                    }}
                    className="px-6 py-2.5 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors flex items-center gap-2"
                  >
                    <Save size={16} strokeWidth={2.5} /> Сохранить
                  </button>
                  <button
                    onClick={() => {
                      setShowPromoForm(false);
                      setEditingPromo(null);
                    }}
                    className="px-6 py-2.5 rounded-full border border-mist bg-bg text-ink text-xs font-medium tracking-wide uppercase hover:bg-mist-strong-strong transition-colors flex items-center gap-2"
                  >
                    <X size={16} strokeWidth={2.5} /> Отмена
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-mist bg-bg overflow-x-auto shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-mist bg-mist">
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Код</th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Описание</th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Тип / Значение</th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Применений</th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Статус</th>
                    <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px] text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist/50">
                  {codes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-ink-muted text-sm">
                        Промокодов пока нет.
                      </td>
                    </tr>
                  ) : (
                    codes.map((code, idx) => {
                      const isExhausted = code.usedCount >= code.maxUses;
                      const isExpired =
                        code.expiresAt && new Date(code.expiresAt) < new Date();
                      return (
                        <tr key={`${code.code}-${idx}`} className="hover:bg-mist/30 transition-colors group">
                          <td className="px-4 py-4 font-mono text-sm text-ink">
                            {code.code}
                          </td>
                          <td className="px-4 py-4 text-ink-muted text-sm">{code.label}</td>
                          <td className="px-4 py-4 text-sm text-ink-muted">
                            {code.type === "percent"
                              ? `−${code.value}%`
                              : `−${code.value} ₽`}
                          </td>
                          <td className="px-4 py-4 text-sm text-ink-muted">
                            {code.usedCount} / {code.maxUses}
                          </td>
                          <td className="px-4 py-4">
                            {!code.active ? (
                              <span className="text-xs text-ink-muted">Отключён</span>
                            ) : isExhausted ? (
                              <span className="text-xs text-accent font-medium">Закончился</span>
                            ) : isExpired ? (
                              <span className="text-xs text-accent font-medium">Просрочен</span>
                            ) : (
                              <span className="text-xs text-accent font-medium">Активен</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button
                              onClick={() => {
                                const active = window.confirm(
                                  code.active
                                    ? "Отключить промокод?"
                                    : "Включить промокод?"
                                );
                                if (active !== undefined) {
                                  updateCode(code.code, { active: !code.active });
                                }
                              }}
                              className="text-xs text-accent hover:underline mr-3"
                            >
                              {code.active ? "Отключить" : "Включить"}
                            </button>
                            <button
                              onClick={() => {
                                setEditingPromo(code.code);
                                setPromoForm({
                                  code: code.code,
                                  type: code.type,
                                  value: code.value,
                                  maxUses: code.maxUses,
                                  label: code.label,
                                  active: code.active,
                                });
                                setShowPromoForm(true);
                              }}
                              className="text-xs text-accent hover:underline mr-3"
                            >
                              Править
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm("Удалить промокод?")) {
                                  deleteCode(code.code);
                                }
                              }}
                              className="text-xs text-accent hover:underline"
                            >
                              Удалить
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
              <div className="border-t border-mist p-4 text-[11px] text-ink-muted">
                Когда промокод заканчивается (достигает лимита применений), покупатель видит сообщение:
                «Просим прощения, но промокод закончился. Новый можно найти в наших соцсетях.»
              </div>
            </div>
          </>
  );
}
