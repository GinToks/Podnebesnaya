import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderSchema, orderStatusSchema } from "@/lib/validations";
import { rateLimit, getRateLimitKey } from "@/lib/rateLimit";

async function ensureMessengerSettingsTable() {
  try {
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "AdminSetting" ("key" TEXT NOT NULL PRIMARY KEY, "value" TEXT NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
  } catch {}
}

async function ensureOrderColumns() {
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "phone" TEXT`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "contactMethod" TEXT`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "trackingNumber" TEXT`);
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

export async function GET(req: NextRequest) {
  await ensureOrderColumns();
  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit"));
  const offset = Number(url.searchParams.get("offset") || "0");
  const hasPagination = Number.isFinite(limit) && limit > 0;

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    skip: hasPagination ? Math.max(0, offset) : undefined,
    take: hasPagination ? limit : undefined,
  });
  const parsed = orders.map(parseOrder);

  if (hasPagination) {
    const total = await prisma.order.count();
    return NextResponse.json({ items: parsed, total, limit, offset: Math.max(0, offset) });
  }
  return NextResponse.json(parsed);
}

function parseOrder(o: Record<string, unknown>) {
  return {
    ...o,
    customerPhone: o.phone ?? o.customerPhone ?? null,
    items: JSON.parse(String(o.items)),
    createdAt: new Date(String(o.createdAt)).toISOString(),
  };
}

export async function POST(req: NextRequest) {
  if (!(await rateLimit(getRateLimitKey(req, "orders"), 10, 60000))) {
    return NextResponse.json({ error: "Слишком много запросов" }, { status: 429 });
  }
  const body = await req.json();
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  await ensureOrderColumns();
  const data = parsed.data;

  // Compute totalPrice server-side from DB prices (ignore client-supplied total)
  const productIds = data.items.map((i) => i.productId);
  const dbProducts = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const priceMap = new Map(dbProducts.map((p) => [p.id, p.price]));
  let totalPrice = 0;
  const normalizedItems = data.items.map((item) => {
    const price = priceMap.get(item.productId) ?? item.price;
    totalPrice += price * item.quantity;
    return { ...item, price };
  });
  data.items = normalizedItems;

  const order = await prisma.order.create({
    data: {
      id: `ORD-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerAddress: data.customerAddress,
      phone: data.customerPhone,
      contactMethod: data.contactMethod,
      items: JSON.stringify(data.items),
      totalPrice: totalPrice,
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
  let notificationSent = false;
  let notificationError = "";
  let settings = { tgToken: "", tgChatId: "", waNumber: "" };
  try {
    await ensureMessengerSettingsTable();
    const row = await prisma.adminSetting.findUnique({ where: { key: "messenger_settings" } });
    settings = { tgToken: "", tgChatId: "", waNumber: "" };
    if (row?.value) {
      try { settings = { ...settings, ...JSON.parse(row.value) }; } catch {}
    } else {
      notificationError = "Настройки не найдены в БД";
    }

    const itemsText = data.items.map((i: { productName?: string; quantity?: number; price?: number }) => `• ${i.productName} x${i.quantity} — ${i.price} ₽`).join("\n");
    const contactLabel = data.contactMethod === "whatsapp" ? "WhatsApp" : data.contactMethod === "max" ? "Max" : "Telegram";
    const message = `🛒 Новый заказ ${order.id}\nКлиент: ${data.customerName}\nТелефон: ${data.customerPhone || "—"}\nСвязь: ${contactLabel}\nEmail: ${data.customerEmail}\nАдрес: ${data.customerAddress}\n\nТовары:\n${itemsText}\n\nИтого: ${totalPrice} ₽`;

    if (settings.tgToken && settings.tgChatId) {
      const tgRes = await fetch(`https://api.telegram.org/bot${settings.tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: settings.tgChatId, text: message }),
      });
      const tgData = await tgRes.json().catch(() => ({}));
      if (tgData.ok) {
        notificationSent = true;
      } else {
        notificationError = tgData.description || "Ошибка Telegram";
        console.error("Telegram notify failed:", tgData);
      }

      if (notificationSent && lowStock.length > 0) {
        const alertText = `⚠️ Низкий остаток:\n${lowStock.map((p) => `• ${p.name}: ${p.stock} шт.`).join("\n")}`;
        await fetch(`https://api.telegram.org/bot${settings.tgToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: settings.tgChatId, text: alertText }),
        }).catch(() => {});
      }
    } else {
      notificationError = notificationError || "Токен или Chat ID не настроены";
    }
  } catch (e) {
    notificationError = String(e);
    console.error("Notification error:", e);
  }

  return NextResponse.json({ ...parseOrder(order), notification: { sent: notificationSent, error: notificationError, chatId: settings.tgChatId } }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = orderStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id, status, trackingNumber } = parsed.data;
  const data: Record<string, unknown> = { status };
  if (trackingNumber !== undefined) data.trackingNumber = trackingNumber || null;
  const order = await prisma.order.update({
    where: { id },
    data,
  });
  return NextResponse.json(parseOrder(order));
}

export async function DELETE(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.order.delete({ where: { id } });
  return NextResponse.json({ success: true });
}