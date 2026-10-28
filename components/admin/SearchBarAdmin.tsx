export default function SearchBarAdmin({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative w-64">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск по товарам…"
        className="w-full px-3 py-2 rounded bg-mist border border-mist text-sm text-ink focus:border-sky outline-none transition-colors placeholder:text-ink-muted"
      />
    </div>
  );
}
