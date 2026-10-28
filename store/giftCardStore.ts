import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GiftCard {
  id: string;
  code: string;
  amount: number;
  balance: number;
  recipientName: string;
  recipientEmail: string;
  message: string;
  createdAt: string;
  expiresAt?: string;
  active: boolean;
}

interface GiftCardState {
  cards: GiftCard[];
  addCard: (card: Omit<GiftCard, "id" | "code" | "createdAt">) => string;
  useCard: (code: string, amount: number) => boolean;
  getCard: (code: string) => GiftCard | undefined;
  deactivateCard: (code: string) => void;
  totalCards: () => number;
}

export const useGiftCardStore = create<GiftCardState>()(
  persist(
    (set, get) => ({
      cards: [],
      addCard: (card) => {
        const id = `gc-${Date.now()}`;
        const code = `GIFT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const newCard: GiftCard = {
          ...card,
          id,
          code,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ cards: [...state.cards, newCard] }));
        return code;
      },
      useCard: (code, amount) => {
        const card = get().cards.find((c) => c.code === code && c.active);
        if (!card || card.balance < amount) return false;
        set((state) => ({
          cards: state.cards.map((c) =>
            c.code === code ? { ...c, balance: c.balance - amount } : c
          ),
        }));
        return true;
      },
      getCard: (code) => get().cards.find((c) => c.code === code),
      deactivateCard: (code) =>
        set((state) => ({
          cards: state.cards.map((c) =>
            c.code === code ? { ...c, active: false } : c
          ),
        })),
      totalCards: () => get().cards.length,
    }),
    { name: "podnebesnaya-gift-cards" }
  )
);