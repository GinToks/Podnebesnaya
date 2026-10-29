"use client";
import { useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { useToastStore } from "@/store/toastStore";

const typeIcons: Record<string, React.ReactNode> = {
  success: <CheckCircle size={18} strokeWidth={2.5} />,
  error: <AlertCircle size={18} strokeWidth={2.5} />,
  info: <Info size={18} strokeWidth={2.5} />,
};

const typeColors: Record<string, string> = {
  success: "bg-accent/10 text-accent border-accent/30",
  error: "bg-accent/10 text-accent border-accent/30",
  info: "bg-[#B89B5E]/10 text-gold border-sky/30",
};

export default function Toast() {
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (toasts.length > 0) {
        removeToast(toasts[0].id);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [toasts, removeToast]);

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <m.div
            key={toast.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[280px] ${
              typeColors[toast.type]
            }`}
          >
            <div className="flex-shrink-0">{typeIcons[toast.type]}</div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">{toast.title}</h4>
              {toast.message && (
                <p className="text-[11px] opacity-80 mt-0.5">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 p-1 hover:opacity-70 transition-opacity"
              aria-label="Закрыть уведомление"
            >
              <span className="text-[10px]">✕</span>
            </button>
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
