import { useEffect, useState } from "react";
import SignupForm from "./SignupForm";

const HONESTY =
  "This is not an investment. Nobody is paid for joining, and nobody is paid for recruiting. You earn only when someone buys a real PowerTies product through your link or code, and only after that sale is final.";

const CATALOG: Array<[string, string, string]> = [
  ["Course: Not Broken", "$49", "$4.90"],
  ["Course: Peaceful Trust", "$49", "$4.90"],
  ["Course: More Leads", "$49", "$4.90"],
  ["Course: iGAFS", "$49", "$4.90"],
  ["Course: Too Many Hats", "$49", "$4.90"],
  ["Course: Building Good People", "$49", "$4.90"],
  ["One-hour AI session", "$99", "$9.90"],
  ["Stage 2 program", "$650", "$65.00"],
  ["VetsAndMore membership", "$3/month", "$0.30 per month"],
];

const RULES: string[] = [
  "One tier only. You earn on your own referrals. You never earn on people you sign up, and signing people up earns nothing. There is no second level, and there never will be.",
  "Commission is paid only on completed sales that are not refunded, after the 30-day vesting window. Vested commissions are sent on the 1st of the following month, by Cash App, to the $cashtag you gave at sign-up, and Cash App payments normally arrive the same day they are sent. There is nothing to claim and no withdrawal to request: payouts are pushed, never pulled.",
  "You must have a Cash App $cashtag on record to be paid. If a payout comes due and we have no $cashtag for you, we will notify you, and you have until the next monthly payout run to provide it. If it is still not provided by then, the amount is forfeited.",
  "Joining is free, and it always will be. There is nothing to buy, no kit, no fee, no inventory.",
  "No earnings claims. PowerTies shows the math and never promises an amount. What you earn depends on what people you send actually buy.",
  'When you share your link, say the disclosure line: "I earn 10% if you buy through my link."',
  "No self-referrals. Buying through your own link or code earns nothing.",
  "PowerTies can end or change the program with 30 days notice. Money already vested is always paid, no matter what changes.",
  "US referrers who earn $600 or more in a year receive a 1099-NEC, and provide a W-9 before the payout that crosses that line.",
];

const FAQ: Array<[string, string]> = [
  [
    "When do I get paid?",
    "Payouts are sent on the 1st of the month, for vested amounts of $10 or more, and Cash App payments normally arrive the same day they are sent. A sale vests 30 days after it happens, so a sale this month is usually paid on the 1st of the month after next.",
  ],
  [
    "How do I collect my money?",
    "You don't. There is no claim and no withdrawal to request. It arrives in your Cash App on the 1st, sent to the $cashtag on record.",
  ],
  [
    "What if someone refunds?",
    "That commission comes off your next payout. Nobody is ever chased for cash, and nobody is ever asked to send money back.",
  ],
  ["Can I buy through my own link?", "No. Self-referrals earn nothing."],
  ["Is this an investment?", "No. See the top of this page."],
  ["Do I have to recruit anyone?", "No. Recruiting earns nothing, ever. You earn only when someone buys a real product."],
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="border-b-4 border-red pb-2 text-2xl font-bold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function Home() {
  const [refCode, setRefCode] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      try {
        window.localStorage.setItem("ptr_ref", ref);
      } catch {
        // Storage can be unavailable; the code still shows for this visit.
      }
      setRefCode(ref);
      return;
    }
    try {
      const saved = window.localStorage.getItem("ptr_ref");
      if (saved) setRefCode(saved);
    } catch {
      // Ignore.
    }
  }, []);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16">
      <header className="pt-10">
        <div className="text-sm font-bold uppercase tracking-wide text-red">PowerTies Consulting Group</div>
        <h1 className="mt-1 text-4xl font-black">PowerTiesRefer</h1>
        <p className="mt-3 text-lg text-muted">
          The PowerTies referral program. Recommend a PowerTies course, session, program, or membership to someone it
          would genuinely help, and earn 10% of what they actually buy.
        </p>
        {refCode && (
          <p className="mt-4 rounded-lg border border-red/35 bg-tint px-3 py-2 text-sm font-medium">
            You were sent by a PowerTiesRefer member (code {refCode}).
          </p>
        )}
        <div className="mt-5 rounded-xl bg-crimson p-5 text-white">
          <p className="text-base font-semibold leading-relaxed">{HONESTY}</p>
        </div>
        <p className="mt-4 text-muted">
          Where does the money come from? Money for the commission is set aside after every sale is complete. If no
          sale happens, no money exists, and nothing is owed. What you earn on each item is listed on this page, in
          the open.
        </p>
      </header>

      <Section title="How it works">
        <ol className="space-y-4">
          <li className="rounded-xl border border-line bg-card p-4">
            <div className="font-bold">1. Get your link and code</div>
            <p className="mt-1 text-muted">Sign up free below. Your link and code are yours for as long as the program runs.</p>
          </li>
          <li className="rounded-xl border border-line bg-card p-4">
            <div className="font-bold">2. Share it with someone it would genuinely help</div>
            <p className="mt-1 text-muted">
              Not a blast, not a list. One person you actually believe a course, a session, or the membership would help.
            </p>
          </li>
          <li className="rounded-xl border border-line bg-card p-4">
            <div className="font-bold">3. Earn 10% of what they buy</div>
            <p className="mt-1 text-muted">
              Payouts are sent by Cash App on the 1st of the month, once your balance reaches $10 and the 30-day
              vesting window has passed. Cash App payments normally arrive the same day they are sent. Your dashboard
              always shows where you stand.
            </p>
          </li>
        </ol>
      </Section>

      <Section title="What you can share, and what you earn">
        <div className="overflow-x-auto rounded-xl border border-line bg-card">
          <table className="w-full text-left text-sm sm:text-base">
            <thead>
              <tr className="border-b border-line bg-paper">
                <th className="px-3 py-2 font-bold">Item</th>
                <th className="px-3 py-2 font-bold">Price</th>
                <th className="px-3 py-2 font-bold">You earn</th>
              </tr>
            </thead>
            <tbody>
              {CATALOG.map(([item, price, earn]) => (
                <tr key={item} className="border-b border-line last:border-0">
                  <td className="px-3 py-2">{item}</td>
                  <td className="px-3 py-2">{price}</td>
                  <td className="px-3 py-2 font-semibold">{earn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-muted">
          Recurring items pay on every payment while the membership stays active. A VetsAndMore membership referred
          once pays 30 cents for each month the member stays active.
        </p>
      </Section>

      <Section title="The money, explained">
        <p className="text-muted">
          Money for the commission is set aside after every sale is complete. If no sale happens, no money exists,
          and nothing is owed.
        </p>
        <p className="mt-3 text-muted">
          The honest math on the $10 minimum: one referred course sale earns $4.90, so two course sales clear the bar.
          A membership referral pays 30 cents a month, so memberships alone take a long while to reach $10. Smaller
          balances roll forward, month to month, until they reach $10.
        </p>
      </Section>

      <Section title="The rules, in plain words">
        <ul className="list-disc space-y-3 pl-5 text-ink">
          {RULES.map((rule) => (
            <li key={rule.slice(0, 32)}>{rule}</li>
          ))}
        </ul>
        <p className="mt-4">
          <a className="font-semibold text-ink underline hover:text-red" href="/PowerTiesRefer-Rules.pdf" download>
            Download the full rules (PDF)
          </a>
        </p>
      </Section>

      <Section title="Sign up free">
        <SignupForm referredByInitial={refCode} />
      </Section>

      <Section title="Questions people ask">
        <div className="space-y-4">
          {FAQ.map(([q, a]) => (
            <div key={q} className="rounded-xl border border-line bg-card p-4">
              <div className="font-bold">{q}</div>
              <p className="mt-1 text-muted">{a}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Already a member?">
        <p className="text-muted">
          Your dashboard shows your link, your code, your clicks, your sales, and exactly where your money stands.{" "}
          <a className="font-semibold text-ink underline hover:text-red" href="/dashboard">
            Go to your dashboard
          </a>{" "}
          and we will email you a fresh link to it.
        </p>
      </Section>

      <footer className="mt-12 border-t border-line pt-4 text-sm text-muted">
        PowerTiesRefer is the referral program of PowerTies Consulting Group. One tier only. Recruiting earns nothing.
      </footer>
    </main>
  );
}
