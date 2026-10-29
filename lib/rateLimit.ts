// Rate limiter with optional persistent backend (Upstash Redis) and in-memory fallback.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

let upstashEnabled =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

// Cache Ratelimit instances per (max, window) config
const ratelimitCache = new Map<string, any>();

async function getUpstashRatelimit(maxRequests: number, windowMs: number) {
  if (!upstashEnabled) return null;
  const key = `${maxRequests}:${windowMs}`;
  if (ratelimitCache.has(key)) return ratelimitCache.get(key);
  try {
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    const rl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(maxRequests, `${Math.ceil(windowMs / 1000)} s`),
      analytics: false,
    });
    ratelimitCache.set(key, rl);
    return rl;
  } catch {
    upstashEnabled = false;
    return null;
  }
}

export async function rateLimit(
  key: string,
  maxRequests: number = 60,
  windowMs: number = 60000
): Promise<boolean> {
  const rl = await getUpstashRatelimit(maxRequests, windowMs);
  if (rl) {
    try {
      const res = await rl.limit(key);
      return res.success;
    } catch {
      // fall through to in-memory
    }
  }

  const now = Date.now();
  if (rateLimitMap.size > 10000) {
    for (const [k, v] of rateLimitMap) {
      if (now > v.resetAt) rateLimitMap.delete(k);
    }
  }
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) {
    return false;
  }
  entry.count += 1;
  return true;
}

export function getRateLimitKey(req: Request, prefix: string = ""): string {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  return `${prefix}:${ip}`;
}
