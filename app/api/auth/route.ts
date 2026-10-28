import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createToken, COOKIE_NAME, MAX_AGE } from "@/lib/auth";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const PASSWORD_FILE = path.join(process.cwd(), "data", "admin-password.txt");
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000;

function getStoredPassword(): string {
  try {
    if (fs.existsSync(PASSWORD_FILE)) {
      return fs.readFileSync(PASSWORD_FILE, "utf-8").trim();
    }
  } catch {}
  return ADMIN_PASSWORD;
}

const attempts = new Map<string, { count: number; blockedUntil: number }>();

function getClientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const now = Date.now();

  const rl = attempts.get(ip) || { count: 0, blockedUntil: 0 };
  if (rl.blockedUntil > now) {
    return NextResponse.json(
      { success: false, blocked: true, remainingMs: rl.blockedUntil - now },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const password = body.password || "";

  if (password === getStoredPassword()) {
    attempts.delete(ip);
    const token = await createToken();
    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });
    return res;
  }

  rl.count += 1;
  if (rl.count >= MAX_ATTEMPTS) {
    rl.blockedUntil = now + BLOCK_DURATION;
  }
  attempts.set(ip, rl);

  return NextResponse.json(
    { success: false, attempts: rl.count, maxAttempts: MAX_ATTEMPTS },
    { status: 401 }
  );
}