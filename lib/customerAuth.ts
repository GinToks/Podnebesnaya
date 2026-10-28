import crypto from "crypto";

const SECRET = process.env.CUSTOMER_AUTH_SECRET || "podnebesnaya-customer-secret-change-me";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const computed = crypto.scryptSync(password, salt, 64).toString("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(computed, "hex"));
  } catch {
    return false;
  }
}

export function createSessionToken(email: string): string {
  const payload = `${email}:${Date.now()}`;
  const b64 = Buffer.from(payload).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(b64).digest("base64url");
  return `${b64}.${sig}`;
}

export function verifySessionToken(token: string): string | null {
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  const expected = crypto.createHmac("sha256", SECRET).update(b64).digest("base64url");
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  const payload = Buffer.from(b64, "base64url").toString();
  const [email, ts] = payload.split(":");
  if (!email || !ts) return null;
  const age = Date.now() - Number(ts);
  if (age > 30 * 24 * 60 * 60 * 1000) return null;
  return email;
}
