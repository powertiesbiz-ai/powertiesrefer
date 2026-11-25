import type { VercelRequest, VercelResponse } from "@vercel/node";
import { callN8n } from "./_n8n.js";

/** POST /api/signup - validate, then forward to the n8n ptr-signup webhook. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }
  const body = (req.body || {}) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const cashtag = typeof body.cashtag === "string" ? body.cashtag.trim() : "";
  const discord = typeof body.discord === "string" ? body.discord.trim() : "";
  const referredBy = typeof body.referredBy === "string" ? body.referredBy.trim() : "";
  const agreed = body.agreed === true;

  if (!name) return res.status(400).json({ error: "Please enter your name." });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "Please enter a valid email address." });
  if (!cashtag) return res.status(400).json({ error: "Please enter your Cash App $cashtag. It is required to be paid." });
  if (!agreed) return res.status(400).json({ error: "Please read the rules and check the box to agree." });

  try {
    const { status, body: n8nBody } = await callN8n("/ptr-signup", {
      name,
      email,
      cashtag,
      discord,
      referredBy,
    });
    if (status >= 200 && status < 300 && n8nBody && typeof n8nBody === "object") {
      return res.status(200).json(n8nBody);
    }
    return res
      .status(status >= 400 && status < 600 ? status : 502)
      .json({ error: "Sign-up did not go through. Please try again in a moment." });
  } catch {
    return res.status(502).json({ error: "Sign-up did not go through. Please try again in a moment." });
  }
}
