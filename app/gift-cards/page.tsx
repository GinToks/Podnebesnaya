"use client";
import { useState } from "react";
import { useGiftCardStore } from "@/store/giftCardStore";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import { Gift, CreditCard, Check } from "lucide-react";

const PRESET_AMOUNTS = [1000, 2000, 3000, 5000];

export default function GiftCardsPage() {
  const { addCard } = useGiftCardStore();
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();
  const [amount, setAmount] = useState(2000);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const handleCreate = () => {
    if (!recipientName || !recipientEmail) {
      addToast({ type: "error", title: "Заполните имя и email получателя" });
      return;
    }
    const code = addCard({
      amount,
      balance: amount,
      recipientName,
      recipientEmail,
      message,
      active: true,
    });
    setCreatedCode(code);
    addToast({ type: "success", title: "Подарочный сертификат создан", message: `Код: ${code}` });
  };

  return (
    <section className="py-20 sm:py-28 lg:py-36 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="serif text-3xl sm:text-4xl font-light tracking-[0.1em] text-ink mb-8">
          Подарочные сертификаты
        </h1>

        {createdCode ? (
          <div className="max-w-lg mx-auto text-center p-8 bg-bg-elevated border border-mist rounded-2xl">
            <Check size={48} className="mx-auto text-olive mb-4" />
            <h2 className="serif text-2xl font-light text-ink mb-2">Сертификат создан!</h2>
            <p className="text-ink-muted mb-4">Код сертификата:</p>
            <div className="bg-mist px-6 py-3 rounded-lg font-mono text-lg text-ink mb-4">
              {createdCode}
            </div>
            <p className="text-sm text-ink-muted mb-6">
              Сертификат на сумму {amount.toLocaleString("ru-RU")} ₽ отправлен на {recipientEmail}
            </p>
            <button
              onClick={() => setCreatedCode(null)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-olive text-bg text-sm font-medium tracking-wide uppercase rounded-full hover:bg-olive-hover transition-colors"
            >
              Создать ещё
            </button>
          </div>
        ) : (
          <div className="max-w-lg mx-auto p-8 bg-bg-elevated border border-mist rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Gift size={24} className="text-sakura-dark" />
              <h2 className="serif text-xl font-light text-ink">Создать сертификат</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1.5">Сумма</label>
                <div className="flex gap-2">
                  {PRESET_AMOUNTS.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAmount(a)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        amount === a
                          ? "bg-olive text-bg border-olive"
                          : "bg-bg-elevated text-ink border-mist hover:border-sky"
                      }`}
                    >
                      {a.toLocaleString("ru-RU")} ₽
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1.5">Имя получателя</label>
                <input
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors"
                  placeholder="Имя"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1.5">Email получателя</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1.5">Поздравление (необязательно)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors"
                  placeholder="С наилучшими пожеланиями..."
                />
              </div>

              <button
                onClick={handleCreate}
                className="w-full py-3 rounded-full bg-accent text-bg text-sm font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard size={18} /> Создать сертификат
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}