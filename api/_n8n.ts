/** Shared server-side helper for calling the n8n PTR webhooks. */

export function webhookBase(): string {
  return (process.env.N8N_WEBHOOK_BASE || "https://n8n.powerties.us/webhook").replace(/\/$/, "");
}

export async function callN8n(
  path: string,
  payload: Record<string, unknown>,
): Promise<{ status: number; body: unknown }> {
  const secret = process.env.PTR_WEBHOOK_SECRET || "";
  const resp = await fetch(`${webhookBase()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-ptr-secret": secret,
    },
    body: JSON.stringify(payload),
  });
  const text = await resp.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }
  return { status: resp.status, body };
}
