import { useEffect, useState } from "react";
import CopyField from "./CopyField";

type Member = {
  name: string;
  code: string;
  link: string;
  cashtag: string | null;
  discord?: string;
  clicks: number;
  salesCount: number;
  earnings: number;
  vestedAmount: number;
  pendingAmount: number;
  disclosure: string;
};

function money(n: number): string {
  const v = typeof n === "number" && Number.isFinite(n) ? n : 0;
  return `$${v.toFixed(2)}`;
}

function MagicLinkForm({ note }: { note?: string }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch("/api/magiclink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
    } catch {
      // The answer shown is the same either way, on purpose.
    } finally {
      setBusy(false);
      setSent(true);
    }
  }

  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <h2 className="text-xl font-bold">Email me my dashboard link</h2>
      {note && <p className="mt-2 text-sm font-medium text-muted">{note}</p>}
      {sent ? (
        <p className="mt-3 rounded-lg bg-paper px-3 py-2 font-medium">
          If that email is in the program, your link is on its way.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-3">
          <label className="block text-sm font-semibold" htmlFor="ptr-dash-email">
            Email
          </label>
          <input
            id="ptr-dash-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 text-base focus:border-red focus:outline-none"
            autoComplete="email"
          />
          <button
            type="submit"
            disabled={busy}
            className="mt-3 w-full rounded-lg bg-red px-4 py-3 text-base font-bold text-white hover:bg-redbright disabled:opacity-60"
          >
            {busy ? "Sending..." : "Email me my dashboard link"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [member, setMember] = useState<Member | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("t");
    if (!token) return;
    setHasToken(true);
    setLoading(true);
    fetch("/api/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (resp) => {
        const data = await resp.json().catch(() => null);
        if (!resp.ok || !data || !data.code) {
          setError((data && data.error) || "That dashboard link is not valid or has expired. Request a fresh one below.");
          return;
        }
        setMember(data as Member);
      })
      .catch(() => setError("Your dashboard did not load. Request a fresh link below."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16">
      <header className="pt-10">
        <div className="text-sm font-bold uppercase tracking-wide text-red">PowerTies Consulting Group</div>
        <h1 className="mt-1 text-3xl font-black">Your PowerTiesRefer dashboard</h1>
        <p className="mt-2">
          <a className="text-sm font-semibold text-ink underline hover:text-red" href="/">
            Back to the program page
          </a>
        </p>
      </header>

      <div className="mt-6">
        {loading && <p className="text-muted">Loading your dashboard...</p>}

        {!loading && member && (
          <div className="space-y-6">
            <p className="text-lg">
              Welcome, <span className="font-bold">{member.name}</span>.
            </p>
            <div className="space-y-4 rounded-xl border border-line bg-card p-5">
              <CopyField label="Your link" value={member.link} big />
              <CopyField label="Your code" value={member.code} big />
              <CopyField
                label="Say this line when you share"
                value={member.disclosure || "I earn 10% if you buy through my link."}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                ["Link clicks", String(member.clicks ?? 0)],
                ["Sales", String(member.salesCount ?? 0)],
                ["Earnings so far", money(member.earnings)],
                ["Vested, ready to pay", money(member.vestedAmount)],
                ["Still vesting", money(member.pendingAmount)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-line bg-card p-4">
                  <div className="text-sm font-medium text-muted">{label}</div>
                  <div className="mt-1 text-2xl font-black">{value}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-line bg-card p-5">
              <div className="font-bold">Getting paid</div>
              {member.cashtag ? (
                <p className="mt-1 text-muted">Cash App: ${member.cashtag} on file</p>
              ) : (
                <>
                  <p className="mt-1 text-muted">Cash App: none on file</p>
                  <p className="mt-2 text-muted">
                    A $cashtag on record is required to be paid. If a payout comes due and we have no $cashtag for
                    you, we will notify you, and you have until the next monthly payout run to provide it. If it is
                    still not provided by then, the amount is forfeited. To add your $cashtag, reply to any
                    PowerTiesRefer email and we will put it on record.
                  </p>
                </>
              )}
              <p className="mt-2 text-muted">
                Payouts are sent on the 1st of the month, for vested amounts of $10 or more. There is nothing to
                claim and no withdrawal to request: payouts are pushed to the Cash App on record, never pulled.
              </p>
            </div>
          </div>
        )}

        {!loading && !member && <MagicLinkForm note={hasToken ? error || undefined : undefined} />}
        {!loading && !member && !hasToken && !error && null}
      </div>
    </main>
  );
}
