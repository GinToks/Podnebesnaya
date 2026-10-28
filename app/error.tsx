"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="serif text-3xl font-light text-ink mb-3">Что-то пошло не так</h1>
      <p className="text-sm text-ink-muted mb-6 max-w-md">
        Произошла непредвиденная ошибка. Попробуйте обновить страницу или вернуться на главную.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-full bg-accent text-bg text-sm font-medium"
        >
          Попробовать снова
        </button>
        <Link href="/" className="px-5 py-2.5 rounded-full border border-mist text-ink text-sm font-medium">
          На главную
        </Link>
      </div>
    </div>
  );
}
