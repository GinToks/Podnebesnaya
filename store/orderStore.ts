import { create } from "zustand";
import type { Product } from "@/data/products";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  items: OrderItem[];
  totalPrice: number;
  status: "new" | "processing" | "completed" | "cancelled";
  createdAt: string;
}

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  addOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => Promise<any>;
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  getOrder: (id: string) => Order | undefined;
}

export const useOrderStore = create<OrderState>()((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const orders = await res.json();
      set({ orders, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },
  addOrder: async (order) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error("Failed to create order");
    const newOrder = await res.json();
    set((state) => ({ orders: [newOrder, ...state.orders] }));
    if (newOrder.notification && !newOrder.notification.sent) {
      console.error("Order notification failed:", newOrder.notification.error);
    }
    return newOrder;
  },
  updateOrderStatus: async (id, status) => {
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) throw new Error("Failed to update order");
    const updated = await res.json();
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? updated : o)),
    }));
  },
  deleteOrder: async (id) => {
    const res = await fetch("/api/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("Failed to delete order");
    set((state) => ({ orders: state.orders.filter((o) => o.id !== id) }));
  },
  getOrder: (id) => get().orders.find((o) => o.id === id),
}));
