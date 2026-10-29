import { NextRequest, NextResponse } from "next/server";
import { createToken, COOKIE_NAME, MAX_AGE } from "@/lib/auth";
import { getStoredPassword } from "@/lib/adminPassword";
import crypto from "crypto";

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000;

const attempts = new Map<string, { count: number; blockedUntil: number }>();

function getClientIp(req: NextRequest): string {
  const nextReq = req as { ip?: string };
  return (
    nextReq.ip ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",").pop()?.trim() ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const now = Date.now();

  // Prune expired blocks to avoid unbounded memory growth
  if (attempts.size > 1000) {
    const nowPrune = Date.now();
    for (const [k, v] of attempts) {
      if (v.blockedUntil > 0 && v.blockedUntil < nowPrune) attempts.delete(k);
    }
    if (attempts.size > 1000) {
      let toDelete = attempts.size - 1000;
      for (const k of attempts.keys()) {
        if (toDelete <= 0) break;
        attempts.delete(k);
        toDelete -= 1;
      }
    }
  }
  const rl = attempts.get(ip) || { count: 0, blockedUntil: 0 };
  if (rl.blockedUntil > now) {
    return NextResponse.json(
      { success: false, blocked: true, remainingMs: rl.blockedUntil - now },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const password = body.password || "";

  const stored = await getStoredPassword();
  const a = Buffer.from(password);
  const b = Buffer.from(stored);
  const passwordOk = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (passwordOk) {
    attempts.delete(ip);
    const token = await createToken();
    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
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
