import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LoyaltyTransaction {
  id: string;
  type: "earn" | "spend";
  amount: number;
  description: string;
  date: string;
}

interface LoyaltyState {
  points: number;
  transactions: LoyaltyTransaction[];
  earnPoints: (amount: number, description: string) => void;
  spendPoints: (amount: number, description: string) => boolean;
  getBalance: () => number;
}

export const useLoyaltyStore = create<LoyaltyState>()(
  persist(
    (set, get) => ({
      points: 0,
      transactions: [],
      earnPoints: (amount, description) => {
        const transaction: LoyaltyTransaction = {
          id: `lt-${Date.now()}`,
          type: "earn",
          amount,
          description,
          date: new Date().toISOString(),
        };
        set((state) => ({
          points: state.points + amount,
          transactions: [transaction, ...state.transactions],
        }));
      },
      spendPoints: (amount, description) => {
        if (get().points < amount) return false;
        const transaction: LoyaltyTransaction = {
          id: `lt-${Date.now()}`,
          type: "spend",
          amount,
          description,
          date: new Date().toISOString(),
        };
        set((state) => ({
          points: state.points - amount,
          transactions: [transaction, ...state.transactions],
        }));
        return true;
      },
      getBalance: () => get().points,
    }),
    { name: "podnebesnaya-loyalty" }
  )
);