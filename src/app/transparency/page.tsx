import type { Metadata } from "next";
import { PageShell } from "../../components/PageShell";
import {
  getMemeContractDisplay,
  getQuoteAsset,
  siteConfig,
} from "../../lib/config";

export const metadata: Metadata = {
  title: `Transparency — ${siteConfig.projectName}`,
  description:
    "Official contracts, pool configuration, fee structure, creator allocation and verification links for Roaring Saylor.",
};

export default function TransparencyPage() {
  const quote = getQuoteAsset();

  const rows: { label: string; value: string; mono?: boolean }[] = [
    {
      label: "Launch status",
      value: siteConfig.launchStatus.toUpperCase(),
    },
    {
      label: "Trading enabled",
      value: siteConfig.tradingEnabled ? "Yes" : "No",
    },
    {
      label: "Official meme contract",
      value: getMemeContractDisplay(),
      mono: true,
    },
    {
      label: `Canonical ${quote.symbol} Stock Token`,
      value: quote.address ?? "Pending live registry verification",
      mono: true,
    },
    {
      label: "Pool address",
      value: siteConfig.poolAddress ?? "Not live",
      mono: true,
    },
    {
      label: "Pool ID",
      value: siteConfig.poolId ?? "Not live",
      mono: true,
    },
    {
      label: "Fee beneficiary",
      value: siteConfig.feeBeneficiary ?? "Not assigned",
      mono: true,
    },
    {
      label: "Deployment transaction",
      value: siteConfig.deploymentTx ?? "Not live",
      mono: true,
    },
    { label: "Token supply", value: "Bankr standard fixed supply (post-launch)" },
    { label: "Creator allocation", value: "None" },
    { label: "Vesting", value: "None — creator vesting disabled" },
    { label: "Presale", value: "None" },
    {
      label: "Trading fee",
      value: `${siteConfig.tradingFeeBps / 100}% (confirm stock-pair fee routing with Bankr)`,
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
      label: "Claimed fees",
      value: "Not live",
    },
    {
      label: "Unclaimed fees",
      value: "Not live",
    },
    {
      label: "Chain",
      value: `${siteConfig.chain.chainName} · Chain ID ${siteConfig.chain.chainId}`,
    },
    {
      label: "RPC",
      value: siteConfig.chain.rpcUrl,
      mono: true,
    },
    {
      label: "WETH (canonical)",
      value: siteConfig.chain.weth,
      mono: true,
    },
    {
      label: "USDG (canonical)",
      value: siteConfig.chain.usdg,
      mono: true,
    },
  ];

  return (
    <PageShell>
      <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
        Transparency
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Public configuration
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--text-muted)]">
        Verify every address against this page and the chain explorer. Never
        trust ticker symbols or search results alone. No official contract is
        live during prelaunch.
      </p>

      <hr className="section-rule my-10" />

      <div className="card overflow-hidden">
        <div className="divide-y divide-[var(--border)]">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:px-5"
            >
              <p className="card-label shrink-0 sm:max-w-[40%]">{row.label}</p>
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

      <section className="prose-section mt-10">
        <h2>Verification checklist</h2>
        <ul>
          <li>Confirm chain ID is {siteConfig.chain.chainId}.</li>
          <li>
            Confirm the {quote.symbol} address matches Robinhood&apos;s live
            canonical asset registry before any deployment or trade.
          </li>
          <li>
            Reject any similarly named token at a different address.
          </li>
          <li>
            After launch, confirm meme contract, pool and fee beneficiary match
            this page and the Bankr launch page.
          </li>
        </ul>
      </section>

      <section className="prose-section">
        <h2>Creator-fee policy</h2>
        <p>
          Creator fees are generated automatically by trading through the Bankr
          liquidity pool. They belong to the project company and do not belong to
          tokenholders. Fees may fund infrastructure, data, development,
          security, legal, accounting, community, content, marketing and
          contingency reserves. There is no promise of buybacks, price support,
          permanent {quote.symbol} purchases, revenue distributions or holder
          dividends.
        </p>
      </section>

      <section className="prose-section">
        <h2>Links</h2>
        <ul>
          <li>
            <a
              href={siteConfig.chain.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent"
            >
              Blockscout explorer
            </a>
          </li>
          <li>
            <a
              href={siteConfig.bankrLaunchUrl ?? siteConfig.bankrBaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent"
            >
              Bankr
            </a>
          </li>
          <li>
            <a
              href={siteConfig.officialGitHub}
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href={siteConfig.officialX}
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent"
            >
              Official X
            </a>
          </li>
        </ul>
      </section>

      <div className="card mt-8 border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.06)] p-5">
        <p className="text-sm text-[var(--text-muted)]">
          Do not purchase contracts claiming to represent this project until an
          official contract is published here. Prelaunch means no official token
          is live.
        </p>
      </div>
    </PageShell>
  );
}
