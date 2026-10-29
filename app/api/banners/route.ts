import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { bannerSchema, bannerUpdateSchema } from "@/lib/validations";

const KEY = "promo_banners";

async function ensureTable() {
  try {
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "AdminSetting" ("key" TEXT NOT NULL PRIMARY KEY, "value" TEXT NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
  } catch {}
}

async function readBanners() {
  await ensureTable();
  const row = await prisma.adminSetting.findUnique({ where: { key: KEY } });
  if (!row?.value) {
    // seed default banner once
    const seed = [{
      id: "pb-default",
      title: "Весенняя коллекция",
      subtitle: "Скидка 20% на все свечи с ароматом сакуры",
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      bgColor: "#E8B4B8",
      textColor: "#3D2B1F",
      active: true,
      link: "#catalog",
      linkText: "Смотреть",
    }];
    await writeBanners(seed);
    return seed;
  }
  try { return JSON.parse(row.value); } catch { return []; }
}

async function writeBanners(banners: any[]) {
  await ensureTable();
  await prisma.adminSetting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(banners) },
    create: { key: KEY, value: JSON.stringify(banners) },
  });
}

async function isAdmin() {
  try {
    const c = await cookies();
    const token = c.get("admin_token")?.value;
    if (!token) return false;
    return await verifyToken(token);
  } catch {
    return false;
  }
}

export async function GET() {
  const banners = await readBanners();
  return NextResponse.json(banners);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const parsed = bannerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const banners = await readBanners();
  const id = `pb-${Date.now()}`;
  const banner = { ...parsed.data, id };
  banners.push(banner);
  await writeBanners(banners);
  return NextResponse.json(banner, { status: 201 });
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const parsed = bannerUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { id, ...updates } = parsed.data;
  const banners = await readBanners();
  const idx = banners.findIndex((b: any) => b.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  banners[idx] = { ...banners[idx], ...updates };
  await writeBanners(banners);
  return NextResponse.json(banners[idx]);
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const banners = await readBanners();
  const filtered = banners.filter((b: any) => b.id !== id);
  await writeBanners(filtered);
  return NextResponse.json({ success: true });
}
