"use client";

import { useState } from "react";

export default function SentryExamplePage() {
  const [status, setStatus] = useState("");

  const throwClient = () => {
    setStatus("Бросаем ошибку клиента...");
    throw new Error("Sentry test error from client");
  };

  const triggerServer = async () => {
    setStatus("Запрос к серверу...");
    try {
      await fetch("/api/sentry-test");
      setStatus("Сервер ответил без ошибки");
    } catch {
      setStatus("Сетевая ошибка");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Sentry Test</h1>
      <button
        className="px-4 py-2 rounded bg-red-600 text-white"
        onClick={throwClient}
      >
        Throw client error
      </button>
      <button
        className="px-4 py-2 rounded bg-red-800 text-white"
        onClick={triggerServer}
      >
        Trigger server error
      </button>
      {status && <p className="text-sm text-ink-muted">{status}</p>}
    </main>
  );
}
