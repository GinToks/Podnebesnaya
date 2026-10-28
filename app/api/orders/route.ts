import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderSchema, orderStatusSchema } from "@/lib/validations";

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
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders.map(parseOrder));
}

function parseOrder(o: any) {
  return {
    ...o,
    items: JSON.parse(o.items),
    createdAt: o.createdAt.toISOString(),
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const order = await prisma.order.create({
    data: {
      id: `ORD-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerAddress: data.customerAddress,
      items: JSON.stringify(data.items),
      totalPrice: data.totalPrice,
      status: "new",
    },
  });
  return NextResponse.json(parseOrder(order), { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const parsed = orderStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id, status } = parsed.data;
  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json(parseOrder(order));
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.order.delete({ where: { id } });
  return NextResponse.json({ success: true });
}