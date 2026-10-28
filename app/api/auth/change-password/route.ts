import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PASSWORD_FILE = path.join(process.cwd(), "data", "admin-password.txt");

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ success: false, error: "Заполните все поля" }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ success: false, error: "Пароль должен быть не менее 6 символов" }, { status: 400 });
  }

  // Get current password
  let currentStoredPassword = process.env.ADMIN_PASSWORD || "admin123";
  try {
    if (fs.existsSync(PASSWORD_FILE)) {
      currentStoredPassword = fs.readFileSync(PASSWORD_FILE, "utf-8").trim();
    }
  } catch {}

  if (currentPassword !== currentStoredPassword) {
    return NextResponse.json({ success: false, error: "Текущий пароль неверный" }, { status: 401 });
  }

  // Save new password
  try {
    const dir = path.dirname(PASSWORD_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(PASSWORD_FILE, newPassword.trim(), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Не удалось сохранить пароль" }, { status: 500 });
  }
}