import { useState } from "react";
import CopyField from "./CopyField";

const DISCLOSURE = "I earn 10% if you buy through my link.";

type Success = { code: string; link: string };

export default function SignupForm({ referredByInitial }: { referredByInitial: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cashtag, setCashtag] = useState("");
  const [discord, setDiscord] = useState("");
  const [referredBy, setReferredBy] = useState(referredByInitial);
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<Success | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!agreed) {
      setError("Please read the rules and check the box to agree.");
      return;
    }
    setBusy(true);
    try {
      const resp = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          cashtag: cashtag.trim(),
          discord: discord.trim(),
          referredBy: referredBy.trim(),
          agreed,
        }),
      });
      const data = await resp.json().catch(() => null);
      if (!resp.ok || !data || !data.code || !data.link) {
        setError((data && data.error) || "Sign-up did not go through. Please try again in a moment.");
        return;
      }
      setSuccess({ code: data.code, link: data.link });
    } catch {
      setError("Sign-up did not go through. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border-2 border-red bg-card p-5">
        <h3 className="text-xl font-bold">You are in. Here is your link and code.</h3>
        <p className="mt-2 text-sm text-muted">
          Save these. They are yours for as long as the program runs, and they are also on their way to your email.
        </p>
        <div className="mt-4 space-y-4">
          <CopyField label="Your link" value={success.link} big />
          <CopyField label="Your code" value={success.code} big />
          <CopyField label="Say this line when you share" value={DISCLOSURE} />
        </div>
        <p className="mt-4 text-sm text-muted">
          Your dashboard shows your clicks, sales, and earnings. Use the email form on the{" "}
          <a className="font-semibold text-ink underline hover:text-red" href="/dashboard">
            dashboard page
          </a>{" "}
          any time to get a fresh link to it.
        </p>
      </div>
    );
  }

  const inputCls =
    "mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 text-base focus:border-red focus:outline-none";
  const labelCls = "block text-sm font-semibold";

  return (
    <form onSubmit={submit} className="rounded-xl border border-line bg-card p-5">
      <div className="space-y-4">
        <div>
          <label className={labelCls} htmlFor="ptr-name">Name</label>
          <input id="ptr-name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
        </div>
        <div>
          <label className={labelCls} htmlFor="ptr-email">Email</label>
          <input id="ptr-email" className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </div>
        <div>
          <label className={labelCls} htmlFor="ptr-cashtag">Cash App $cashtag</label>
          <input id="ptr-cashtag" className={inputCls} value={cashtag} onChange={(e) => setCashtag(e.target.value)} required placeholder="$yourtag" />
          <p className="mt-1 text-sm text-muted">
            A $cashtag is a public handle, like a username. It is the only payout detail the program ever asks for. Nobody is ever asked for bank numbers.
          </p>
        </div>
        <div>
          <label className={labelCls} htmlFor="ptr-discord">Discord handle (optional)</label>
          <input id="ptr-discord" className={inputCls} value={discord} onChange={(e) => setDiscord(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="ptr-ref">
            Who sent you? (optional, just so we can say thanks; it changes nothing about what anyone earns)
          </label>
          <input id="ptr-ref" className={inputCls} value={referredBy} onChange={(e) => setReferredBy(e.target.value)} placeholder="Their code, if you have it" />
        </div>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-1 h-4 w-4 shrink-0" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <span>I have read and agree to the rules above.</span>
        </label>
        {error && (
          <p className="rounded-lg bg-tint px-3 py-2 text-sm font-medium text-red" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-red px-4 py-3 text-base font-bold text-white hover:bg-redbright disabled:opacity-60"
        >
          {busy ? "Signing you up..." : "Get my link and code"}
        </button>
        <p className="text-center text-sm text-muted">Joining is free. No fee, no card, nothing to buy.</p>
      </div>
    </form>
  );
}
