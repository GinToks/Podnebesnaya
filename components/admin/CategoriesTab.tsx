"use client";

import { useCategoryStore } from "@/store/categoryStore";

export default function CategoriesTab() {
  const { categories, addCategory, deleteCategory } = useCategoryStore();
  return (
    <>
      <div className="mb-8">
        <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">Управление категориями</h1>
        <p className="text-sm text-ink-muted mt-1">Добавляйте, редактируйте и удаляйте категории товаров.</p>
      </div>
      <div className="mb-6 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
        <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">Новая категория</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-ink-muted mb-1.5">Название</label>
            <input id="new-cat-label" className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" placeholder="Например: Цитрусовые" />
          </div>
          <div className="w-24">
            <label className="block text-xs font-medium text-ink-muted mb-1.5">Цвет</label>
            <input id="new-cat-color" type="color" defaultValue="#6B8A5E" className="w-full h-10 rounded bg-mist border border-mist cursor-pointer" />
          </div>
          <button
            onClick={() => {
              const labelInput = document.getElementById("new-cat-label") as HTMLInputElement;
              const colorInput = document.getElementById("new-cat-color") as HTMLInputElement;
              if (labelInput?.value) {
                addCategory({ label: labelInput.value, color: colorInput?.value || "#6B8A5E" });
                labelInput.value = "";
              }
            }}
            className="px-5 py-2.5 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors"
          >Добавить</button>
        </div>
      </div>
      <div className="rounded-xl border border-mist bg-bg-elevated overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-mist bg-mist/30">
              <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Цвет</th>
              <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">Название</th>
              <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px]">ID</th>
              <th className="px-4 py-3 font-medium text-ink-muted uppercase tracking-wider text-[11px] text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-mist/30 transition-colors">
                <td className="px-4 py-3"><div className="w-6 h-6 rounded-full" style={{ backgroundColor: cat.color }} /></td>
                <td className="px-4 py-3 text-ink font-medium">{cat.label}</td>
                <td className="px-4 py-3 text-ink-muted text-xs font-mono">{cat.id}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => { if (window.confirm("Удалить категорию?")) deleteCategory(cat.id); }} className="text-xs text-accent hover:underline">Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
