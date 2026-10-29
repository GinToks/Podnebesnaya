import { SignJWT, jwtVerify } from "jose";

if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  console.warn("[security] JWT_SECRET is not set in production; falling back to ADMIN_PASSWORD. Set JWT_SECRET for stronger security.");
}
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || "change-me-in-production"
);

const COOKIE_NAME = "admin_token";
const MAX_AGE = 60 * 60 * 24; // 24 hours

export async function createToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export { COOKIE_NAME, MAX_AGE };