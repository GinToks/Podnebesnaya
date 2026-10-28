import { prisma } from "@/lib/prisma";

const PASSWORD_KEY = "admin_password";

async function ensureTable() {
  try {
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "AdminSetting" ("key" TEXT NOT NULL PRIMARY KEY, "value" TEXT NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
  } catch {}
}

export async function getStoredPassword(): Promise<string> {
  try {
    await ensureTable();
    const row = await prisma.adminSetting.findUnique({ where: { key: PASSWORD_KEY } });
    if (row?.value) return row.value.trim();
  } catch {}
  // Fallback to file (local dev) then env
  try {
    const fs = await import("fs");
    const path = await import("path");
    const PASSWORD_FILE = path.join(process.cwd(), "data", "admin-password.txt");
    if (fs.existsSync(PASSWORD_FILE)) {
      const v = fs.readFileSync(PASSWORD_FILE, "utf-8").trim();
      if (v) return v;
    }
  } catch {}
  return process.env.ADMIN_PASSWORD || "admin123";
}

export async function setStoredPassword(newPassword: string): Promise<void> {
  await ensureTable();
  await prisma.adminSetting.upsert({
    where: { key: PASSWORD_KEY },
    update: { value: newPassword.trim() },
    create: { key: PASSWORD_KEY, value: newPassword.trim() },
  });
}
