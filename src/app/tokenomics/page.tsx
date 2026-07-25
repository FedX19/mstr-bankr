import type { Metadata } from "next";
import Link from "next/link";
import { BuyNowButton } from "../../components/BuyNowButton";
import { PageShell } from "../../components/PageShell";
import {
  explorerAddressUrl,
  getMemeContractDisplay,
  getPairLabel,
  getQuoteAsset,
  siteConfig,
} from "../../lib/config";

export const metadata: Metadata = {
  title: `Tokenomics — ${siteConfig.projectName}`,
  description: `How $${siteConfig.ticker} is set up: supply, fees, pair, and what holders do and do not get.`,
};

export default function TokenomicsPage() {
  const quote = getQuoteAsset();
  const feePct = siteConfig.tradingFeeBps / 100;

  const rows: { label: string; value: string; mono?: boolean }[] = [
    { label: "Token", value: `$${siteConfig.ticker}` },
    { label: "Name", value: siteConfig.projectName },
    { label: "Network", value: siteConfig.chainName },
    { label: "Primary pair", value: getPairLabel() },
    {
      label: "Contract",
      value: getMemeContractDisplay(),
      mono: true,
    },
    {
      label: "Presale",
      value: siteConfig.presale === "none" ? "None" : String(siteConfig.presale),
    },
    {
      label: "Creator allocation",
      value:
        siteConfig.creatorAllocation === "none"
          ? "None"
          : String(siteConfig.creatorAllocation),
    },
    {
      label: "Creator vesting",
      value: siteConfig.vesting === "none" ? "None" : String(siteConfig.vesting),
    },
    {
      label: "Swap fee",
      value: `${feePct}% (pool fee)`,
    },
    {
      label: "Creator fee share",
      value: `${siteConfig.creatorFeeSharePct}% of the creator portion`,
    },
    {
      label: "Protocol fee share",
      value: `${siteConfig.protocolFeeSharePct}% (protocol)`,
    },
    {
      label: "Fee beneficiary",
      value: siteConfig.feeBeneficiary ?? "See Bankr / transparency",
      mono: true,
    },
  ];

  return (
    <PageShell>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
        Tokenomics
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        How ${siteConfig.ticker} is set up
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--text-muted)]">
        Simple facts — not investment advice. ${siteConfig.ticker} is a cultural
        meme, not equity in Strategy or a claim on pool assets.
      </p>

      <hr className="section-rule my-10" />

      <section className="prose-section">
        <h2>At a glance</h2>
        <div className="card overflow-hidden not-prose">
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
        {siteConfig.memeTokenAddress ? (
          <p className="mt-3 text-sm">
            <a
              href={explorerAddressUrl(siteConfig.memeTokenAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent"
            >
              View contract on explorer →
            </a>
          </p>
        ) : null}
      </section>

      <section className="prose-section">
        <h2>Supply & launch</h2>
        <p>
          ${siteConfig.ticker} launched as a fair launch on{" "}
          {siteConfig.platformName} / {siteConfig.chainName}. There was{" "}
          <strong>no presale</strong>, <strong>no creator allocation</strong>, and{" "}
          <strong>no creator vesting</strong> in the intended setup. Supply is
          fixed by the launch contract — check the explorer for total supply and
          holders.
        </p>
      </section>

      <section className="prose-section">
        <h2>The pair</h2>
        <p>
          The primary market is <strong>{getPairLabel()}</strong>. When people
          buy ${siteConfig.ticker}, {quote.displayName.toLowerCase()} enters the
          pool. When they sell, it can leave. That balance is{" "}
          <strong>dynamic</strong> — not a permanent treasury you own.
        </p>
        <p>
          Holders do <strong>not</strong> own Strategy stock, Bitcoin, or the
          assets sitting in the liquidity pool.
        </p>
      </section>

      <section className="prose-section">
        <h2>Fees</h2>
        <p>
          Trades pay a <strong>{feePct}%</strong> swap fee through the pool. Under
          the standard structure, most of the creator share goes to the project
          fee beneficiary and a smaller share to the protocol. Fees fund the
          project — they are <strong>not</strong> dividends, buybacks, or
          guaranteed value for holders.
        </p>
      </section>

      <section className="prose-section">
        <h2>What you do not get</h2>
        <ul>
          <li>Equity, debt, or ownership in Strategy or any company</li>
          <li>Redemption for MSTR, BTC, or pool assets</li>
          <li>Dividends, revenue share, or voting rights</li>
          <li>A price floor or promised appreciation</li>
        </ul>
      </section>

      <section className="prose-section">
        <h2>Where to trade</h2>
        <p>
          Buy and sell on the official {siteConfig.platformName} page. Always
          match the contract address to this site before you approve a
          transaction.
        </p>
        <div className="not-prose mt-4 flex flex-wrap gap-3">
          <BuyNowButton />
          <Link
            href="/terminal"
            className="btn-ghost inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-medium"
          >
            Market terminal
          </Link>
          <Link
            href="/risks"
            className="inline-flex items-center justify-center px-2 py-3 text-sm font-medium text-[var(--accent)]"
          >
            Risks →
          </Link>
        </div>
      </section>

      <div className="card mt-10 border-[var(--border-strong)] p-5">
        <p className="text-xs leading-relaxed text-[var(--text-dim)]">
          {siteConfig.nonAffiliation}
        </p>
      </div>
    </PageShell>
  );
}
