"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Токен не указан");
      return;
    }
    fetch(`/api/customer/verify?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Ошибка");
        setStatus("ok");
        setMessage(`Email ${data.email} подтверждён`);
      })
      .catch((e) => {
        setStatus("error");
        setMessage(e.message);
      });
  }, [searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        {status === "loading" && <p>Проверка…</p>}
        {status === "ok" && <p className="text-green-600">{message}</p>}
        {status === "error" && <p className="text-red-600">{message}</p>}
      </div>
    </main>
  );
}
