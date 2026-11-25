import { useState } from "react";

export default function CopyField({ label, value, big }: { label: string; value: string; big?: boolean }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }
  return (
    <div>
      <div className="text-sm font-medium text-muted">{label}</div>
      <div className="mt-1 flex items-stretch gap-2">
        <code
          className={`flex-1 break-all rounded-lg border border-line bg-card px-3 py-2 ${
            big ? "text-lg font-bold sm:text-xl" : "text-sm"
          }`}
        >
          {value}
        </code>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
