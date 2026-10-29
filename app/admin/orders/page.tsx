"use client";

import { useEffect, useState } from "react";
import { useOrderStore } from "@/store/orderStore";
import OrdersTab from "@/components/admin/OrdersTab";

export default function AdminOrdersPage() {
  const { orders, fetchOrders, updateOrderStatus, deleteOrder } = useOrderStore();
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((o) => {
    const q = orderSearch.toLowerCase();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      (o.customerPhone || "").toLowerCase().includes(q);
    const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusLabels: Record<string, string> = {
    new: "Новый",
    processing: "В обработке",
    completed: "Завершён",
    cancelled: "Отменён",
  };

  return (
    <OrdersTab
      orderSearch={orderSearch}
      setOrderSearch={setOrderSearch}
      orderStatusFilter={orderStatusFilter}
      setOrderStatusFilter={setOrderStatusFilter}
      filteredOrders={filteredOrders}
      statusLabels={statusLabels}
      updateOrderStatus={updateOrderStatus}
      deleteOrder={deleteOrder}
      setSelectedOrder={setSelectedOrder}
    />
  );
}