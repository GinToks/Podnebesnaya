import { create } from "zustand";

export interface AdminGiftCard {
  code: string;
  initialAmount: number;
  balance: number;
  createdAt: string;
}

interface State {
  cards: AdminGiftCard[];
  isLoading: boolean;
  fetch: () => Promise<void>;
  create: (amount: number, code?: string) => Promise<AdminGiftCard | null>;
}

export const useAdminGiftCardStore = create<State>()((set, get) => ({
  cards: [],
  isLoading: false,
  fetch: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/gift-cards");
      if (!res.ok) throw new Error("fail");
      const data = await res.json();
      set({ cards: Array.isArray(data) ? data : [], isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
  create: async (amount, code) => {
    try {
      const res = await fetch("/api/gift-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, code: code || undefined }),
      });
      if (!res.ok) return null;
      const card = await res.json();
      set((s) => ({ cards: [card, ...s.cards] }));
      return card;
    } catch {
      return null;
    }
  },
}));