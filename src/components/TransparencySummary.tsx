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
      value: quote.address ?? "Pending registry verification",
      mono: true,
    },
    {
      label: "Pool contract / ID",
      value: siteConfig.poolAddress ?? siteConfig.poolId ?? "Not live",
      mono: true,
    },
    {
      label: "Fee beneficiary",
      value: siteConfig.feeBeneficiary ?? "Not assigned",
      mono: true,
    },
    { label: "Creator allocation", value: "None" },
    { label: "Vesting", value: "None (disabled)" },
    { label: "Presale", value: "None" },
    {
      label: "Trading fee",
      value: `${siteConfig.tradingFeeBps / 100}% (Bankr standard — confirm for stock pairs)`,
    },
    {
      label: "Creator fee share",
      value: `${siteConfig.creatorFeeSharePct}% of creator-fee portion`,
    },
    {
      label: "Protocol fee share",
      value: `${siteConfig.protocolFeeSharePct}% (Doppler)`,
    },
    {
      label: "Chain",
      value: `${siteConfig.chain.chainName} (ID ${siteConfig.chain.chainId})`,
    },
  ];

  return (
    <section id="transparency" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="card-label mb-2">Transparency</p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Contracts & configuration
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[var(--text-muted)]">
              No presale. No creator allocation. Public contracts and public fees
              after launch. Verify addresses before any transfer or trade.
            </p>
          </div>
          <Link
            href="/transparency"
            className="text-sm font-medium text-[var(--accent)] hover:opacity-85"
          >
            Full transparency →
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

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <a
            href={siteConfig.chain.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-accent"
          >
            Blockscout →
          </a>
          <a
            href={siteConfig.bankrLaunchUrl ?? siteConfig.bankrBaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-accent"
          >
            Bankr →
          </a>
        </div>
      </div>
    </section>
  );
}
