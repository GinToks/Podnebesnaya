"use client";

interface ScentEntry { date: string; productId: string; }

interface Props {
  products: { id: string; name: string }[];
  scentDate: string;
  setScentDate: (v: string) => void;
  scentProductId: string;
  setScentProductId: (v: string) => void;
  scentEntries: ScentEntry[];
  setScent: (date: string, productId: string) => void;
  removeScent: (date: string) => void;
}

export default function ScentCalendarTab({ products, scentDate, setScentDate, scentProductId, setScentProductId, scentEntries, setScent, removeScent }: Props) {
  return (
    <>
      <div className="mb-8">
        <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">Аромат дня</h1>
        <p className="text-sm text-ink-muted mt-1">Назначьте товар «ароматом дня» на конкретную дату.</p>
      </div>
      <div className="mb-6 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
        <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">Новая запись</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">Дата</label>
            <input type="date" value={scentDate} onChange={(e) => setScentDate(e.target.value)} className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">Товар</label>
            <select value={scentProductId} onChange={(e) => setScentProductId(e.target.value)} className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors">
              <option value="">Выберите товар</option>
              {products.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button onClick={() => {
            if (!scentDate || !scentProductId) { alert("Выберите дату и товар"); return; }
            setScent(scentDate, scentProductId);
            setScentDate(""); setScentProductId("");
          }} className="px-6 py-2.5 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors">
            Сохранить
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {scentEntries.length === 0 ? (
          <p className="text-ink-muted text-sm text-center py-8">Записей пока нет.</p>
        ) : (
          scentEntries.map((e) => {
            const p = products.find((prod) => prod.id === e.productId);
            return (
              <div key={e.date} className="p-4 bg-bg-elevated border border-mist rounded-xl shadow-sm flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-ink">{e.date}</p>
                  <p className="text-sm text-ink-muted">{p ? p.name : e.productId}</p>
                </div>
                <button onClick={() => removeScent(e.date)} className="px-3 py-1.5 rounded-full border border-accent text-accent text-xs font-medium hover:bg-accent hover:text-bg transition-colors">Удалить</button>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
