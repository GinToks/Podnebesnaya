import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderSchema, orderStatusSchema } from "@/lib/validations";

async function ensureMessengerSettingsTable() {
  try {
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "AdminSetting" ("key" TEXT NOT NULL PRIMARY KEY, "value" TEXT NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
  } catch {}
}


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

  // Inventory: decrement stock
  const lowStock: { name: string; stock: number }[] = [];
  for (const item of data.items) {
    try {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        await prisma.product.update({ where: { id: item.productId }, data: { stock: newStock } });
        if (newStock <= 3) {
          lowStock.push({ name: product.name, stock: newStock });
        }
      }
    } catch {}
  }

  // Notifications
  try {
    await ensureMessengerSettingsTable();
    const row = await prisma.adminSetting.findUnique({ where: { key: "messenger_settings" } });
    let settings = { tgToken: "", tgChatId: "", waNumber: "" };
    if (row?.value) {
      try { settings = { ...settings, ...JSON.parse(row.value) }; } catch {}
    }

    const itemsText = data.items.map((i: any) => `• ${i.productName} x${i.quantity} — ${i.price * i.quantity} ₽`).join("\n");
    const message = `🛒 Новый заказ ${order.id}\nКлиент: ${data.customerName}\nEmail: ${data.customerEmail}\nАдрес: ${data.customerAddress}\n\nТовары:\n${itemsText}\n\nИтого: ${data.totalPrice} ₽`;

    if (settings.tgToken && settings.tgChatId) {
      await fetch(`https://api.telegram.org/bot${settings.tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: settings.tgChatId, text: message }),
      }).catch(() => {});

      if (lowStock.length > 0) {
        const alertText = `⚠️ Низкий остаток:\n${lowStock.map((p) => `• ${p.name}: ${p.stock} шт.`).join("\n")}`;
        await fetch(`https://api.telegram.org/bot${settings.tgToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: settings.tgChatId, text: alertText }),
        }).catch(() => {});
      }
    }

    // WhatsApp: server-side auto-send not available without Cloud API; store link in response
  } catch {}

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