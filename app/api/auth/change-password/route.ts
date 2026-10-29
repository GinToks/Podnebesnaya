import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import { getStoredPassword, setStoredPassword } from "@/lib/adminPassword";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  // Require authenticated admin
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ success: false, error: "Не авторизован" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ success: false, error: "Заполните все поля" }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ success: false, error: "Пароль должен быть не менее 6 символов" }, { status: 400 });
  }

  const currentStored = await getStoredPassword();
  const a = Buffer.from(currentPassword);
  const b = Buffer.from(currentStored);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ success: false, error: "Текущий пароль неверный" }, { status: 401 });
  }

  try {
    await setStoredPassword(newPassword);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Не удалось сохранить пароль" }, { status: 500 });
  }
}
