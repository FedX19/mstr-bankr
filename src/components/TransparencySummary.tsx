import Link from "next/link";
import {
  getMemeContractDisplay,
  getQuoteAsset,
  siteConfig,
} from "../lib/config";

export function TransparencySummary() {
  const quote = getQuoteAsset();

  const rows: { label: string; value: string; mono?: boolean }[] = [
    {
      label: "Official meme contract",
      value: getMemeContractDisplay(),
      mono: true,
    },
    {
      label: `Canonical ${quote.symbol} Stock Token`,
      value: quote.address ?? "—",
      mono: true,
    },
    {
      label: "Pool",
      value: siteConfig.poolAddress ?? siteConfig.poolId ?? "Not live yet",
      mono: true,
    },
    {
      label: "Fee beneficiary",
      value: siteConfig.feeBeneficiary ?? "Announced at launch",
      mono: true,
    },
    { label: "Creator allocation", value: "None" },
    { label: "Presale", value: "None" },
    {
      label: "Network",
      value: siteConfig.chain.chainName,
    },
  ];

  return (
    <section id="transparency" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="card-label mb-2">Transparency</p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Verify before you trade
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[var(--text-muted)]">
              No official token is live yet. When it launches, every address you
              need will be listed here.
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
      </div>
    </section>
  );
}
