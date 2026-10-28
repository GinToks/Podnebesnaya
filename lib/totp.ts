import crypto from "crypto";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Decode(str: string): Buffer {
  const cleaned = str.toUpperCase().replace(/=+$/, "").replace(/\s/g, "");
  let bits = "";
  for (const c of cleaned) {
    const val = BASE32_ALPHABET.indexOf(c);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
  }
  return Buffer.from(bytes);
}

export function generateSecret(length = 20): string {
  const buf = crypto.randomBytes(length);
  let bits = "";
  for (const b of buf) bits += b.toString(2).padStart(8, "0");
  let out = "";
  for (let i = 0; i + 5 <= bits.length; i += 5) {
    out += BASE32_ALPHABET[parseInt(bits.slice(i, i + 5), 2)];
  }
  return out;
}

export function totpCode(secret: string, counter: number): string {
  const key = base32Decode(secret);
  const buf = Buffer.alloc(8);
  // big-endian 64-bit counter
  let c = counter;
  for (let i = 7; i >= 0; i--) {
    buf[i] = c & 0xff;
    c = Math.floor(c / 256);
  }
  const hmac = crypto.createHmac("sha1", key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return (code % 1000000).toString().padStart(6, "0");
}

export function verifyTotp(secret: string, code: string, window = 1): boolean {
  const now = Math.floor(Date.now() / 1000 / 30);
  for (let i = -window; i <= window; i++) {
    if (totpCode(secret, now + i) === code.trim()) return true;
  }
  return false;
}

export function otpAuthUrl(secret: string, account = "admin", issuer = "Podnebesnaya"): string {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&digits=6&period=30`;
}
