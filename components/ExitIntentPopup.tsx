"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { X, Gift } from "lucide-react";
import Link from "next/link";

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed) {
        setShow(true);
        setDismissed(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [dismissed]);

  return (
    <AnimatePresence>
      {show && (
        <>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShow(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <m.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-8 bg-bg-elevated border border-sakura rounded-2xl shadow-2xl"
          >
            <button
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-mist transition-colors"
            >
              <X size={20} />
            </button>
            <div className="text-center">
              <Gift size={48} className="mx-auto text-sakura-dark mb-4" />
              <h2 className="serif text-2xl font-light text-ink mb-2">
                Подождите!
              </h2>
              <p className="text-ink-muted mb-6">
                Получите скидку 10% на первый заказ. Используйте промокод{" "}
                <span className="font-mono font-bold text-accent">WELCOME10</span>
              </p>
              <Link
                href="/#catalog"
                onClick={() => setShow(false)}
                className="inline-flex items-center justify-center px-8 py-3.5 bg-olive text-bg text-sm font-medium tracking-wide uppercase rounded-full hover:bg-olive-hover transition-colors"
              >
                В каталог
              </Link>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}