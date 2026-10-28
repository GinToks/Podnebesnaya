export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin" />
        <p className="text-ink-muted text-sm">Загрузка...</p>
      </div>
    </div>
  );
}
