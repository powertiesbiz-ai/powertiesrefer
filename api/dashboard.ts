import type { VercelRequest, VercelResponse } from "@vercel/node";
import { callN8n } from "./_n8n.js";
import { verifyToken } from "./_token.js";

/** POST /api/dashboard - verify the magic-link token, then load the member's numbers from n8n. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }
  const body = (req.body || {}) as Record<string, unknown>;
  const secret = process.env.PTR_TOKEN_SECRET || "";
  const verified = verifyToken(body.token, secret);
  if (!verified) {
    return res.status(401).json({ error: "That dashboard link is not valid or has expired. Request a fresh one below." });
  }
  try {
    const { status, body: n8nBody } = await callN8n("/ptr-dashboard", { email: verified.email });
    if (status === 404) {
      return res.status(404).json({ error: "We could not find a member with that email. Request a fresh link below." });
    }
    if (status >= 200 && status < 300 && n8nBody && typeof n8nBody === "object") {
      return res.status(200).json(n8nBody);
    }
    return res.status(502).json({ error: "Your dashboard did not load. Please try again in a moment." });
  } catch {
    return res.status(502).json({ error: "Your dashboard did not load. Please try again in a moment." });
  }
}
