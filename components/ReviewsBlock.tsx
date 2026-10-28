"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export default function ReviewsBlock({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [productId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, authorName: name, rating, text }),
      });
      if (res.ok) {
        setName("");
        setText("");
        setRating(5);
        await load();
      }
    } catch {}
    setSubmitting(false);
  };

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div className="space-y-6">
      {reviews.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <span className="font-medium text-ink">{avg.toFixed(1)}</span>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} className={i < Math.round(avg) ? "fill-accent text-accent" : "text-mist"} />
            ))}
          </div>
          <span>({reviews.length})</span>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-ink-muted">Загрузка отзывов…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-ink-muted">Отзывов пока нет. Будьте первым!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="border border-mist rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-ink text-sm">{r.authorName}</span>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className={i < r.rating ? "fill-accent text-accent" : "text-mist"} />
                  ))}
                </div>
                <span className="text-xs text-ink-muted ml-auto">{new Date(r.createdAt).toLocaleDateString("ru-RU")}</span>
              </div>
              <p className="text-sm text-ink-muted">{r.text}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="border border-mist rounded-lg p-4 space-y-3">
        <h4 className="text-sm font-medium text-ink">Оставить отзыв</h4>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ваше имя"
          className="w-full px-3 py-2 rounded bg-mist border border-mist text-sm text-ink"
          required
        />
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setRating(i + 1)}
              className="p-1"
            >
              <Star size={18} className={i < rating ? "fill-accent text-accent" : "text-mist"} />
            </button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ваш отзыв"
          rows={3}
          className="w-full px-3 py-2 rounded bg-mist border border-mist text-sm text-ink"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase disabled:opacity-50"
        >
          Отправить
        </button>
      </form>
    </div>
  );
}
