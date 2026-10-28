import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { Product } from "@/data/products";
import { useToastStore } from "@/store/toastStore";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  toggle: () => void;
  open: () => void;
  close: () => void;
  clear: () => void;
  totalPrice: () => number;
  totalQuantity: () => number;
  applyPromo: (discount: number, type: "percent" | "fixed") => number;
}

const sanitizeItems = (items: CartItem[]): CartItem[] =>
  items.filter((item): item is CartItem => !!item.product && !!item.product.id);

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        isOpen: false,
        addItem: (product, quantity = 1) => {
          const items = sanitizeItems(get().items);
          const existing = items.find((i) => i.product.id === product.id);
          if (existing) {
            const newQty = existing.quantity + quantity;
            if (newQty > product.stock) {
              useToastStore.getState().addToast({
                type: "error",
                title: "Недостаточно на складе",
                message: `Осталось всего ${product.stock} шт.`,
              });
              return;
            }
            set({
              items: items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: newQty } : i
              ),
            });
          } else {
            if (quantity > product.stock) {
              useToastStore.getState().addToast({
                type: "error",
                title: "Недостаточно на складе",
                message: `Осталось всего ${product.stock} шт.`,
              });
              return;
            }
            set({ items: [...items, { product, quantity }] });
          }
          useToastStore.getState().addToast({
            type: "success",
            title: "Добавлено в корзину",
            message: product.name,
          });
        },
        removeItem: (id) => {
          const items = sanitizeItems(get().items);
          set({ items: items.filter((i) => i.product.id !== id) });
        },
        setQuantity: (id, quantity) => {
          if (quantity <= 0) {
            get().removeItem(id);
            return;
          }
          const items = sanitizeItems(get().items);
          const item = items.find((i) => i.product.id === id);
          if (item && quantity > item.product.stock) {
            useToastStore.getState().addToast({
              type: "error",
              title: "Недостаточно на складе",
              message: `Осталось всего ${item.product.stock} шт.`,
            });
            return;
          }
          set({
            items: items.map((i) =>
              i.product.id === id ? { ...i, quantity } : i
            ),
          });
        },
        toggle: () => set((state) => ({ isOpen: !state.isOpen })),
        open: () => set({ isOpen: true }),
        close: () => set({ isOpen: false }),
        clear: () => set({ items: [] }),
        totalPrice: () =>
          sanitizeItems(get().items).reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          ),
        totalQuantity: () =>
          sanitizeItems(get().items).reduce((sum, item) => sum + item.quantity, 0),
        applyPromo: (discount, type) => {
          const subtotal = get().totalPrice();
          if (type === "percent") return subtotal - (subtotal * discount) / 100;
          return subtotal - discount;
        },
      }),
      {
        name: "podnebesnaya-cart",
        partialize: (state) => ({ items: sanitizeItems(state.items) }),
      }
    )
  )
);
