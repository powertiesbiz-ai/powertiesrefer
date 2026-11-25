# PowerTiesRefer

The PowerTies Consulting Group referral program web app. One tier only:
members earn 10% of what people they send actually buy, paid by Cash App
on the 1st of the month once vested and at $10 or more.

Stack: Vite + React + TypeScript + Tailwind, with Vercel serverless
routes under `api/` that forward to n8n webhooks server-side.

Environment variables (set in the Vercel dashboard, never committed):

- `PTR_WEBHOOK_SECRET` - shared secret sent to n8n as `x-ptr-secret`
- `PTR_TOKEN_SECRET` - HMAC key for dashboard magic-link tokens
- `N8N_WEBHOOK_BASE` - optional, defaults to `https://n8n.powerties.us/webhook`

Local development: copy `.env.example` to `.env.local`, fill in the
values, then `npm install` and `npm run dev`.
