"use client";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { X, ChevronRight, ShoppingCart, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useCatalogStore } from "@/store/catalogStore";
import { useCartStore } from "@/store/cartStore";
import { useQuizStore, computeRecommendations } from "@/store/quizStore";
import type { Product } from "@/data/products";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuizModal({ isOpen, onClose }: QuizModalProps) {
  const { questions, settings } = useQuizStore();
  const products = useCatalogStore((s) => s.products);
  const { addItem } = useCartStore();
  const [step, setStep] = useState<"welcome" | "quiz" | "result">("welcome");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      setStep("welcome");
      setCurrent(0);
      setAnswers({});
      setAddedIds({});
    }
  }, [isOpen]);

  const recommended = useMemo(
    () => computeRecommendations(answers, questions, products, 4),
    [answers, questions, products]
  );

  const handleAnswer = (optionId: string) => {
    const q = questions[current];
    if (!q) return;
    const nextAnswers = { ...answers, [q.id]: optionId };
    setAnswers(nextAnswers);
    if (current + 1 >= questions.length) {
      setStep("result");
    } else {
      setCurrent(current + 1);
    }
  };

  const handleAdd = (product: Product) => {
    addItem(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const handleRestart = () => {
    setStep("welcome");
    setCurrent(0);
    setAnswers({});
    setAddedIds({});
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <m.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-bg-elevated border border-sky rounded-xl shadow-2xl p-6 sm:p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-mist-strong transition-colors"
              aria-label="Закрыть квиз"
            >
              <X size={20} strokeWidth={2} />
            </button>

            {step === "welcome" && (
              <div className="text-center py-6">
                <h2 className="serif text-3xl sm:text-4xl font-light tracking-[0.1em] text-ink mb-4">
                  {settings.welcomeTitle}
                </h2>
                <p className="text-ink-muted max-w-md mx-auto mb-8 leading-relaxed">
                  {settings.welcomeText}
                </p>
                <button
                  onClick={() => setStep("quiz")}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-olive text-bg text-sm font-medium tracking-wide uppercase rounded-full hover:bg-olive-hover transition-colors"
                >
                  Начать квиз <ChevronRight size={16} />
                </button>
              </div>
            )}

            {step === "quiz" && questions[current] && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs text-ink-muted uppercase tracking-widest">
                    Вопрос {current + 1} из {questions.length}
                  </span>
                  <div className="flex gap-1">
                    {questions.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 w-6 rounded-full transition-colors ${
                          i <= current ? "bg-olive" : "bg-mist"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <h3 className="serif text-2xl font-light tracking-[0.08em] text-ink mb-6">
                  {questions[current].title}
                </h3>
                <div className="grid gap-3">
                  {questions[current].options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswer(opt.id)}
                      className="text-left px-5 py-4 rounded-xl border border-mist bg-bg hover:border-olive hover:bg-mist/40 transition-colors text-ink"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
                {current > 0 && (
                  <button
                    onClick={() => setCurrent(current - 1)}
                    className="mt-6 text-xs text-ink-muted hover:text-ink transition-colors"
                  >
                    ← Назад
                  </button>
                )}
              </div>
            )}

            {step === "result" && (
              <div>
                <h2 className="serif text-2xl sm:text-3xl font-light tracking-[0.1em] text-ink mb-2">
                  {settings.resultTitle}
                </h2>
                <p className="text-sm text-ink-muted mb-6">{settings.resultText}</p>
                {recommended.length === 0 ? (
                  <p className="text-ink-muted text-sm">Рекомендаций пока нет.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {recommended.map((product) => (
                      <div
                        key={product.id}
                        className="p-4 rounded-xl border border-mist bg-bg flex flex-col gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex-shrink-0"
                            style={{ backgroundColor: product.accent }}
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-ink truncate">{product.name}</p>
                            <p className="text-xs text-ink-muted truncate">
                              {product.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="serif text-lg font-light text-ink">
                            {product.price.toLocaleString("ru-RU")} ₽
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAdd(product)}
                            disabled={product.stock <= 0}
                            className={`flex-1 py-2.5 rounded-full flex items-center justify-center gap-2 text-xs font-medium tracking-wide uppercase transition-all disabled:opacity-40 ${
                              addedIds[product.id]
                                ? "bg-olive text-bg"
                                : "bg-accent text-bg hover:bg-accent-hover"
                            }`}
                          >
                            <ShoppingCart size={14} strokeWidth={2.5} />
                            {addedIds[product.id] ? "В корзине" : "В корзину"}
                          </button>
                          <Link
                            href={`/product/${product.id}`}
                            onClick={onClose}
                            className="px-3 py-2.5 rounded-full border border-mist text-ink text-xs font-medium hover:bg-mist transition-colors"
                          >
                            Подробнее
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-8 flex gap-3 justify-center">
                  <button
                    onClick={handleRestart}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-mist text-ink text-xs font-medium tracking-wide uppercase hover:bg-mist transition-colors"
                  >
                    <RotateCcw size={14} /> Пройти снова
                  </button>
                  <button
                    onClick={onClose}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-olive text-bg text-xs font-medium tracking-wide uppercase hover:bg-olive-hover transition-colors"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            )}
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
