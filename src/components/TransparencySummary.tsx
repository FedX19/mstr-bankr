import Link from "next/link";
import {
  getMemeContractDisplay,
  getPairLabel,
  siteConfig,
} from "../lib/config";

export function TransparencySummary() {
  const rows: { label: string; value: string; mono?: boolean }[] = [
    { label: "Status", value: "Prelaunch" },
    { label: "Official token", value: "Not deployed" },
    {
      label: "Official contract",
      value: getMemeContractDisplay(),
      mono: true,
    },
    {
      label: "Proposed pair",
      value: getPairLabel(),
    },
    { label: "Presale", value: "None planned" },
    { label: "Creator allocation", value: "None planned" },
    {
      label: "Platform",
      value: `${siteConfig.platformName}, ${siteConfig.platformStatus}`,
    },
    {
      label: "Chain",
      value: `${siteConfig.chainName} (${siteConfig.chainId})`,
    },
  ];

  return (
    <section id="transparency" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="card-label mb-2">Transparency</p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Status of the launch
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[var(--text-muted)]">
              No official token is live. When — and if — it launches, every
              address you need will be listed here and on official socials.
            </p>
          </div>
          <Link
            href="/transparency"
            className="text-sm font-medium text-[var(--accent)] hover:opacity-85"
          >
            Full details →
          </Link>
        </div>

        <div className="card overflow-hidden">
          <div className="divide-y divide-[var(--border)]">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5"
              >
                <p className="card-label shrink-0">{row.label}</p>
                <p
                  className={`text-sm text-white sm:text-right ${
                    row.mono ? "stat-value break-all text-xs sm:text-sm" : ""
                  }`}
                >
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="card mt-4 border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.06)] p-4 sm:p-5">
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            <strong className="text-[var(--negative)]">Warning:</strong> Do not
            trust any contract, ticker, or pool unless it is published on this
            official site and the official social account. Impersonators appear
            around every meme launch.
          </p>
        </div>
      </div>
    </section>
  );
}
