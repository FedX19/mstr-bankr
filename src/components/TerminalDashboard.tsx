import Link from "next/link";
import {
  getMemeContractDisplay,
  getPairLabel,
  getQuoteAsset,
  getQuoteAssetAddress,
  isLive,
  siteConfig,
} from "../lib/config";
import type { DashboardData } from "../lib/data";
import { pendingLabel } from "../lib/data";
import { formatNumber, formatPct, formatUsd } from "../lib/format";

type Props = {
  data: DashboardData;
};

function Metric({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="card p-4">
      <p className="card-label mb-1.5">{label}</p>
      <p className="stat-value text-lg font-medium text-white sm:text-xl">
        {value}
      </p>
      {sub ? (
        <p className="mt-1 text-[11px] text-[var(--text-dim)]">{sub}</p>
      ) : null}
    </div>
  );
}

export function TerminalDashboard({ data }: Props) {
  const live = isLive() && data.meta.isLive;
  const empty = pendingLabel(live);
  const quote = getQuoteAsset();
  const quoteAddr = getQuoteAssetAddress();

  const display = (v: string) => (v === "—" ? empty : v);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="card-label mb-1">Market terminal</p>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            ${siteConfig.ticker} Terminal
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            {getPairLabel()} · {siteConfig.chainName}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <span className={live ? "badge badge-live" : "badge"}>
            {live ? "Live" : "Prelaunch"}
          </span>
          <p className="mt-2 text-xs text-[var(--text-dim)]">
            Source: {data.meta.source}
            {data.meta.lastUpdated
              ? ` · Updated ${data.meta.lastUpdated}`
              : live
                ? " · Feeds pending"
                : " · Not live"}
          </p>
        </div>
      </div>

      {siteConfig.memeTokenAddress ? (
        <div className="card border-[var(--accent-border)] bg-[var(--accent-soft)] p-4 sm:p-5">
          <p className="card-label mb-1 text-[var(--accent)]">
            Official meme contract
          </p>
          <p className="stat-value break-all text-sm text-white sm:text-base">
            {siteConfig.memeTokenAddress}
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            <a
              href={`${siteConfig.chain.explorerAddressBase}${siteConfig.memeTokenAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--accent)] hover:opacity-85"
            >
              View on explorer →
            </a>
            <a
              href={siteConfig.bankrLaunchUrl ?? siteConfig.bankrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--text-muted)] hover:text-white"
            >
              View on Bankr →
            </a>
          </div>
          {live && data.meta.status === "stale" ? (
            <p className="mt-3 text-xs text-[var(--text-dim)]">
              Contract is live. Market metrics show “Data pending” until on-chain
              feeds are wired — we do not invent prices or balances.
            </p>
          ) : null}
        </div>
      ) : (
        <div className="card border-[var(--accent-border)] bg-[var(--accent-soft)] p-4">
          <p className="text-sm text-[var(--text-muted)]">
            No official market is live. Metrics stay empty until launch. Never
            trust a contract unless published here and on the official X account.
          </p>
        </div>
      )}

      <section>
        <h2 className="card-label mb-3">$STACKR market</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          <Metric
            label="Price (USD)"
            value={display(
              formatUsd(data.token.priceUsd, {
                digits:
                  data.token.priceUsd != null && data.token.priceUsd < 0.01
                    ? 6
                    : 4,
              }),
            )}
            sub={
              data.token.priceChange24hPct != null
                ? `${formatPct(data.token.priceChange24hPct)} 24h`
                : undefined
            }
          />
          <Metric
            label={`Price in ${quote.symbol}`}
            value={
              data.token.priceInStock != null
                ? data.token.priceInStock.toPrecision(4)
                : empty
            }
          />
          <Metric
            label="Market cap"
            value={display(
              formatUsd(data.token.marketCapUsd, { compact: true }),
            )}
          />
          <Metric
            label="Holders"
            value={
              data.token.holders != null
                ? formatNumber(data.token.holders)
                : empty
            }
          />
        </div>
      </section>

      <section>
        <h2 className="card-label mb-3">Pool · {getPairLabel()}</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          <Metric
            label={`Tokenized ${quote.symbol} in pool`}
            value={
              data.pool.stock.units != null
                ? formatNumber(data.pool.stock.units, { digits: 4 })
                : empty
            }
            sub={
              data.pool.stock.usdValue != null
                ? formatUsd(data.pool.stock.usdValue, { compact: true })
                : undefined
            }
          />
          <Metric
            label="Pool liquidity"
            value={display(
              formatUsd(data.pool.totalLiquidityUsd, { compact: true }),
            )}
          />
          <Metric
            label="24h volume"
            value={display(
              formatUsd(data.token.volume24hUsd, { compact: true }),
            )}
          />
          <Metric
            label="Cumulative volume"
            value={display(
              formatUsd(data.token.cumulativeVolumeUsd, { compact: true }),
            )}
          />
          <Metric
            label="Net MSTR in (24h)"
            value={
              data.pool.netStockInflow24h != null
                ? formatNumber(data.pool.netStockInflow24h, { digits: 4 })
                : empty
            }
          />
          <Metric
            label="Net MSTR out (24h)"
            value={
              data.pool.netStockOutflow24h != null
                ? formatNumber(data.pool.netStockOutflow24h, { digits: 4 })
                : empty
            }
          />
          <Metric
            label="Unique traders"
            value={
              data.token.uniqueTraders != null
                ? formatNumber(data.token.uniqueTraders)
                : empty
            }
          />
          <Metric
            label="Creator fees"
            value={display(
              formatUsd(data.fees.totalCreatorFeesUsd, { compact: true }),
            )}
          />
        </div>
      </section>

      <section>
        <h2 className="card-label mb-3">Reference markets</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Metric
            label="MSTR price"
            value={display(
              formatUsd(data.market.mstrPriceUsd, { compact: true }),
            )}
          />
          <Metric
            label="Bitcoin price"
            value={display(
              formatUsd(data.market.btcPriceUsd, { compact: true }),
            )}
          />
          <Metric
            label="MSTR vs BTC (rel.)"
            value={
              data.market.mstrVsBtcRelativePct != null
                ? formatPct(data.market.mstrVsBtcRelativePct)
                : empty
            }
          />
        </div>
        <p className="mt-3 text-xs text-[var(--text-dim)]">
          Reference prices require a dated data source. {siteConfig.strategy.dataNote}
        </p>
      </section>

      <section>
        <h2 className="card-label mb-3">Contract verification</h2>
        <div className="card overflow-hidden">
          <div className="divide-y divide-[var(--border)]">
            {[
              { label: "Status", value: live ? "Live" : "Prelaunch" },
              {
                label: "Meme contract",
                value: getMemeContractDisplay(),
                mono: true,
              },
              {
                label: `${quote.displayName} address`,
                value: quoteAddr ?? "—",
                mono: true,
              },
              {
                label: "Pool",
                value: siteConfig.poolAddress ?? "Not live",
                mono: true,
              },
              {
                label: "Pair status",
                value: siteConfig.pairStatus,
              },
              {
                label: "Fallback pair",
                value: siteConfig.fallbackPair,
              },
              {
                label: "Chain",
                value: `${siteConfig.chainName} (${siteConfig.chainId})`,
              },
              {
                label: "Explorer",
                value: siteConfig.explorerUrl,
              },
              {
                label: "Bankr",
                value: siteConfig.bankrUrl,
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
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
        <p className="mt-4 text-xs leading-relaxed text-[var(--text-dim)]">
          Do not trust any contract unless published on this site and the
          official X account. Platform eligibility and geo rules are enforced by
          Bankr — this site does not bypass them.{" "}
          <Link href="/risks" className="text-[var(--accent)] hover:opacity-85">
            Risks
          </Link>
        </p>
      </section>
    </div>
  );
}
