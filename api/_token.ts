import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Dashboard magic-link tokens.
 * Format: base64url(email) + "." + exp + "." + sig
 * where exp is a unix timestamp in seconds and
 * sig = HMAC-SHA256 hex of `${email}.${exp}` keyed by PTR_TOKEN_SECRET.
 */

export function signToken(email: string, secret: string, expSeconds: number): string {
  const sig = createHmac("sha256", secret).update(`${email}.${expSeconds}`).digest("hex");
  const emailPart = Buffer.from(email, "utf8").toString("base64url");
  return `${emailPart}.${expSeconds}.${sig}`;
}

export function verifyToken(
  token: unknown,
  secret: string,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): { email: string } | null {
  if (typeof token !== "string" || !secret) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [emailPart, expPart, sig] = parts;
  const exp = Number(expPart);
  if (!Number.isFinite(exp) || exp < nowSeconds) return null;
  let email: string;
  try {
    email = Buffer.from(emailPart, "base64url").toString("utf8");
  } catch {
    return null;
  }
  if (!email || !email.includes("@")) return null;
  const expected = createHmac("sha256", secret).update(`${email}.${expPart}`).digest("hex");
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return { email };
}
