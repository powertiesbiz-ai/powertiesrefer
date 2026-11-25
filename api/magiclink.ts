import type { VercelRequest, VercelResponse } from "@vercel/node";
import { callN8n } from "./_n8n.js";

/**
 * POST /api/magiclink - ask n8n to email a dashboard link.
 * Always answers 200 { ok: true } so the response never reveals
 * whether an email is in the program.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }
  const body = (req.body || {}) as Record<string, unknown>;
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (email) {
    try {
      await callN8n("/ptr-magiclink", { email });
    } catch {
      // Deliberately swallowed: the client always sees the same answer.
    }
  }
  return res.status(200).json({ ok: true });
}
