import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secretKey = process.env.YOOKASSA_SECRET_KEY;
  if (!shopId || !secretKey) {
    return NextResponse.json({ error: "Payment not configured" }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const amount = Number(body.amount);
  if (!amount || amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

  const idempotenceKey = crypto.randomUUID();
  const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");

  const res = await fetch("https://api.yookassa.ru/v3/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotence-Key": idempotenceKey,
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: { value: amount.toFixed(2), currency: "RUB" },
      capture: true,
      confirmation: { type: "redirect", return_url: body.returnUrl || `${process.env.NEXT_PUBLIC_SITE_URL || "https://podnebesnaya.ru"}/` },
      description: body.description || "Заказ Podnebesnaya",
      metadata: { orderId: body.orderId || "" },
    }),
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data.description || "Payment error" }, { status: 500 });
  return NextResponse.json({ paymentId: data.id, confirmationUrl: data.confirmation?.confirmation_url });
}
