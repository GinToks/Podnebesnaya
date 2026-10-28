import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson, ORDERS_FILE } from "@/lib/storage";

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

export async function GET() {
  const orders = await readJson<Order[]>(ORDERS_FILE, []);
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const orders = await readJson<Order[]>(ORDERS_FILE, []);
  const newOrder: Order = {
    ...body,
    id: `ORD-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  orders.unshift(newOrder);
  await writeJson(ORDERS_FILE, orders);
  return NextResponse.json(newOrder, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  const orders = await readJson<Order[]>(ORDERS_FILE, []);
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  orders[idx].status = status;
  await writeJson(ORDERS_FILE, orders);
  return NextResponse.json(orders[idx]);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const orders = await readJson<Order[]>(ORDERS_FILE, []);
  const filtered = orders.filter((o) => o.id !== id);
  await writeJson(ORDERS_FILE, filtered);
  return NextResponse.json({ success: true });
}
