"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingCart, Trash2, ArrowRight, Check, Flame, Tag, Loader2, Gift } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { usePromoStore } from "@/store/promoStore";
import { useOrderStore } from "@/store/orderStore";
import { useCatalogStore } from "@/store/catalogStore";
import { useToastStore } from "@/store/toastStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const orderSchema = z.object({
  name: z.string().min(2, "Укажите ваше имя"),
  email: z.string().email("Введите корректный email"),
  address: z.string().min(5, "Укажите адрес доставки"),
});

type OrderForm = z.infer<typeof orderSchema>;

export default function CartDrawer() {
  const { items, isOpen, close, removeItem, setQuantity, clear, totalPrice, totalQuantity } =
    useCartStore();
  const { codes, applyCode, incrementUses } = usePromoStore();
  const { addOrder } = useOrderStore();
  const { products, updateProduct } = useCatalogStore();
  const { addToast } = useToastStore();
  const [submitted, setSubmitted] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; type: "percent" | "fixed" } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cartTimer, setCartTimer] = useState<number | null>(null);
  const [giftWrap, setGiftWrap] = useState(false);
  useEffect(() => {
    if (items.length > 0 && !cartTimer) {
      setCartTimer(15 * 60); // 15 minutes
    }
    if (items.length === 0) {
      setCartTimer(null);
    }
  }, [items.length]);

  useEffect(() => {
    if (cartTimer === null || cartTimer <= 0) return;
    const interval = setInterval(() => {
      setCartTimer((prev) => {
        if (prev === null || prev <= 1) return null;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cartTimer]);

  const form = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: { name: "", email: "", address: "" },
  });

  const subtotal = totalPrice();
  const giftWrapCost = giftWrap ? 200 : 0;
  const discountedPrice = appliedPromo
    ? appliedPromo.type === "percent"
      ? subtotal - (subtotal * appliedPromo.discount) / 100
      : Math.max(0, subtotal - appliedPromo.discount)
    : subtotal;
  const finalPrice = discountedPrice + giftWrapCost;

  const onSubmit = async (data: OrderForm) => {
    setSubmitting(true);
    // Create order
    const created = await addOrder({
      customerName: data.name,
      customerEmail: data.email,
      customerAddress: data.address,
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
      })),
      totalPrice: finalPrice,
    });
    if (created?.notification && !created.notification.sent) {
      console.error("Order notification failed:", created.notification.error);
      addToast({ type: "error", title: "Уведомление не отправлено", message: created.notification.error || "Неизвестная ошибка" });
    }
    // Decrement stock handled server-side in /api/orders
    if (appliedPromo) {
      incrementUses(appliedPromo.code);
    }
    clear();
    setSubmitted(true);
    setSubmitting(false);
    addToast({
      type: "success",
      title: "Заказ оформлен",
      message: `Спасибо, ${data.name}! Мы свяжемся с вами.${created?.notification?.sent ? " Уведомление отправлено (chat " + (created?.notification?.chatId || "?") + ")." : created?.notification?.error ? " (Уведомление: " + created.notification.error + ")" : ""}`,
    });
  };

  const applyPromo = () => {
    const code = codes.find((c) => c.code.toUpperCase() === promoCode.toUpperCase().trim());
    if (!code) {
      addToast({ type: "error", title: "Промокод не найден" });
      return;
    }
    const applied = applyCode(code.code);
    if (!applied) {
      addToast({ type: "error", title: "Промокод недоступен или закончился" });
      return;
    }
    setAppliedPromo({
      code: applied.code,
      discount: applied.value,
      type: applied.type,
    });
    addToast({
      type: "success",
      title: "Промокод применён",
      message: applied.type === "percent" ? `−${applied.value}%` : `−${applied.value} ₽`,
    });
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 220 }}
          className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-[460px] bg-bg border-l border-mist shadow-2xl flex flex-col"
          aria-label="Корзина"
        >
          <div className="p-6 border-b border-mist flex items-center justify-between">
            <h2 className="serif text-xl font-light tracking-[0.08em] text-ink flex items-center gap-2">
              <ShoppingCart size={20} strokeWidth={2} />
              Корзина
            </h2>
            <button
              onClick={close}
              className="p-2 rounded-full hover:bg-mist-strong transition-colors"
              aria-label="Закрыть корзину"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mx-auto mb-4">
                  <Check size={24} strokeWidth={3} />
                </div>
                <motion.h3
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 10 }}
                  className="serif text-xl font-light text-ink mb-2"
                >
                  Заказ оформлен
                </motion.h3>
                <p className="text-sm text-ink-muted">
                  Спасибо. Мы свяжемся с вами в ближайшее время.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    close();
                  }}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent text-bg text-sm font-medium hover:bg-accent-hover transition-colors"
                >
                  Новый заказ <ArrowRight size={16} />
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-ink-muted text-sm">Ваша корзина пуста</p>
                <button
                  onClick={close}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                >
                  Посмотреть коллекцию <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <>
                {items.length > 0 && (
                  <div className="mb-6 p-4 rounded-lg border border-sky/30 bg-olive/5">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag size={16} strokeWidth={1.5} className="text-accent" />
                      <span className="text-xs font-medium text-accent uppercase tracking-wider">
                        Промокод
                      </span>
                    </div>
                    <input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="ВВЕДИТЕ ПРОМОКОД"
                      className="w-full px-3 py-2 rounded bg-bg border border-sky/40 text-[11px] font-medium uppercase focus:border-sky outline-none transition-colors"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={applyPromo}
                        disabled={!promoCode}
                        className="flex-1 py-2 rounded text-[10px] font-bold uppercase bg-accent text-bg hover:bg-accent-hover transition-colors"
                      >
                        Применить
                      </button>
                      {appliedPromo && (
                        <button
                          onClick={removePromo}
                          className="px-2 py-2 rounded text-[10px] font-bold uppercase text-accent hover:bg-olive/20 transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    {appliedPromo && (
                      <p className="mt-3 text-[10px] text-accent font-medium">
                        Скидка: {appliedPromo.type === "percent" ? `-${appliedPromo.discount}%` : `-${appliedPromo.discount} ₽`}
                      </p>
                    )}
                  </div>
                )}
                <div className="space-y-5">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      className="flex gap-4 items-start"
                    >
                      <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-mist flex items-center justify-center">
                        <Flame size={20} strokeWidth={2} className="text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="text-sm font-medium text-ink truncate">
                            {item.product.name}
                          </h4>
                          <span className="text-sm text-ink-muted">
                            {item.product.price.toLocaleString("ru-RU")} ₽
                          </span>
                        </div>
                        <p className="text-xs text-ink-muted line-clamp-2">
                          {item.product.description}
                        </p>
                        <div className="mt-3 flex items-center gap-3">
                          <button
                            onClick={() => setQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-mist flex items-center justify-center text-[10px] font-bold text-ink hover:bg-mist-strong transition-colors"
                            aria-label="Уменьшить количество"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-xs font-medium text-ink">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-mist flex items-center justify-center text-[10px] font-bold text-ink hover:bg-mist-strong transition-colors"
                            aria-label="Увеличить количество"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="ml-auto p-1.5 text-ink-muted hover:text-accent transition-colors"
                            aria-label="Удалить из корзину"
                          >
                            <Trash2 size={16} strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {cartTimer !== null && cartTimer > 0 && (
                  <div className="mb-4 p-3 bg-sakura/20 border border-sakura rounded-xl flex items-center gap-2">
                    <span className="text-xs text-ink-muted">Товары зарезервированы:</span>
                    <span className="font-mono text-sm font-bold text-accent">
                      {Math.floor(cartTimer / 60)}:{(cartTimer % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                )}
                <div className="mt-4 flex items-center gap-3 p-3 bg-mist/50 rounded-xl">
                  <input
                    type="checkbox"
                    id="gift-wrap"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                    className="rounded border-mist text-accent focus:ring-accent"
                  />
                  <label htmlFor="gift-wrap" className="text-sm text-ink cursor-pointer flex-1">
                    Подарочная упаковка (+200 ₽)
                  </label>
                  <Gift size={18} className="text-sakura-dark" />
                </div>
                <div className="mt-4 border-t border-mist pt-4">
                  <div className="flex justify-between mb-2 text-sm text-ink-muted">
                    <span>Итого</span>
                    <span>{finalPrice.toLocaleString("ru-RU")} ₽</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between mb-2 text-sm text-accent font-medium">
                      <span>Скидка ({appliedPromo.code})</span>
                      <span>-{(subtotal - discountedPrice).toLocaleString("ru-RU")} ₽</span>
                    </div>
                  )}
                  <div className="flex justify-between mb-6 text-base font-medium text-ink">
                    <span>К оплате</span>
                    <span>{finalPrice.toLocaleString("ru-RU")} ₽</span>
                  </div>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-ink-muted mb-1">
                        Имя
                      </label>
                      <input
                        {...form.register("name")}
                        className="w-full px-3 py-2 rounded bg-mist border border-mist text-sm text-ink focus:border-sky outline-none transition-colors placeholder:text-ink-muted"
                        placeholder="Иван"
                      />
                      {form.formState.errors.name && (
                        <p className="text-xs text-accent mt-1">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ink-muted mb-1">
                        Email
                      </label>
                      <input
                        {...form.register("email")}
                        className="w-full px-3 py-2 rounded bg-mist border border-mist text-sm text-ink focus:border-sky outline-none transition-colors placeholder:text-ink-muted"
                        type="email"
                        placeholder="ivan@example.com"
                      />
                      {form.formState.errors.email && (
                        <p className="text-xs text-accent mt-1">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ink-muted mb-1">
                        Адрес доставки
                      </label>
                      <input
                        {...form.register("address")}
                        className="w-full px-3 py-2 rounded bg-mist border border-mist text-sm text-ink focus:border-sky outline-none transition-colors placeholder:text-ink-muted"
                        placeholder="г. Москва, ул. Примерная, д. 1"
                      />
                      {form.formState.errors.address && (
                        <p className="text-xs text-accent mt-1">
                          {form.formState.errors.address.message}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={form.formState.isSubmitting || submitting || items.length === 0}
                      className="w-full py-3.5 rounded-full bg-accent text-bg text-sm font-medium tracking-wide uppercase hover:bg-accent-hover disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <Loader2 size={16} strokeWidth={2} className="animate-spin" />
                      ) : (
                        <ArrowRight size={16} strokeWidth={2.5} />
                      )}
                      Оформить заказ
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
          <div className="border-t border-mist p-6 text-center">
            <p className="text-xs text-ink-muted">
              В корзине {totalQuantity()} позиций
            </p>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
