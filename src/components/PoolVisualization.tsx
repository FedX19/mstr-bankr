import { getQuoteAsset, siteConfig } from "../lib/config";
import type { DashboardData } from "../lib/data";
import { formatNumber, formatPct, formatUsd } from "../lib/format";
import { BrandMark } from "./BrandMark";
import { StockTokenMark } from "./StockTokenMark";

type Props = {
  data: DashboardData;
};

export function PoolVisualization({ data }: Props) {
  const quote = getQuoteAsset();
  const { pool } = data;

  return (
    <section id="pool" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8">
          <p className="card-label mb-2">Primary liquidity pool</p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            The meme is denominated in {quote.symbol}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
            Trading Roaring Stacker changes the amount of tokenized {quote.symbol}{" "}
            exposure held by the primary liquidity pool. Pool assets belong to
            the liquidity position — not to individual tokenholders.
          </p>
        </div>

        {/* Pair diagram — matching circular token marks */}
        <div className="mb-6 flex items-center justify-center gap-3 sm:mb-8 sm:gap-10">
          <div className="flex min-w-0 flex-1 flex-col items-center gap-2 sm:flex-none sm:gap-3">
            <span className="sm:hidden">
              <BrandMark size="md" glow />
            </span>
            <span className="hidden sm:inline-flex">
              <BrandMark size="lg" glow />
            </span>
            <p className="max-w-[7.5rem] text-center text-[11px] font-medium leading-snug text-white sm:max-w-none sm:text-xs">
              {siteConfig.projectName}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-1 px-0.5 sm:px-2">
            <div className="h-px w-6 bg-gradient-to-r from-[var(--accent)] to-[var(--border-strong)] sm:w-16" />
            <span className="stat-value text-[9px] uppercase tracking-widest text-[var(--text-dim)] sm:text-[10px]">
              pair
            </span>
            <div className="h-px w-6 bg-gradient-to-l from-[var(--accent)] to-[var(--border-strong)] sm:w-16" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-center gap-2 sm:flex-none sm:gap-3">
            <span className="sm:hidden">
              <StockTokenMark size="md" glow />
            </span>
            <span className="hidden sm:inline-flex">
              <StockTokenMark size="lg" glow />
            </span>
            <p className="max-w-[7.5rem] text-center text-[11px] font-medium leading-snug text-white sm:max-w-none sm:text-xs">
              Tokenized {quote.symbol}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="card border-[var(--accent-border)] bg-[var(--accent-soft)] p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-3">
              <BrandMark size="xs" />
              <p className="card-label text-[var(--accent)]">
                {siteConfig.projectName}
              </p>
            </div>
            <p className="stat-value text-3xl font-medium text-white">
              {formatNumber(pool.meme.units, { compact: true, digits: 2 })}
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Pool units</p>
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[var(--accent-border)] pt-4">
              <div>
                <p className="card-label mb-1">USD value</p>
                <p className="stat-value text-sm text-white">
                  {formatUsd(pool.meme.usdValue, { compact: true })}
                </p>
              </div>
              <div>
                <p className="card-label mb-1">Pool share</p>
                <p className="stat-value text-sm text-white">
                  {pool.meme.poolSharePct != null
                    ? `${pool.meme.poolSharePct.toFixed(1)}%`
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-3">
              <StockTokenMark size="xs" />
              <p className="card-label">Tokenized {quote.symbol}</p>
            </div>
            <p className="stat-value text-3xl font-medium text-[var(--accent)]">
              {formatNumber(pool.stock.units, { digits: 4 })}
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {quote.symbol} exposure units
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-4">
              <div>
                <p className="card-label mb-1">USD value</p>
                <p className="stat-value text-sm text-white">
                  {formatUsd(pool.stock.usdValue, { compact: true })}
                </p>
              </div>
              <div>
                <p className="card-label mb-1">Pool share</p>
                <p className="stat-value text-sm text-white">
                  {pool.stock.poolSharePct != null
                    ? `${pool.stock.poolSharePct.toFixed(1)}%`
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            {
              label: "Ratio",
              value: pool.ratio != null ? pool.ratio.toPrecision(4) : "—",
            },
            { label: "24h change", value: formatPct(pool.change24hPct) },
            { label: "7d change", value: formatPct(pool.change7dPct) },
            {
              label: `Net ${quote.symbol} in (24h)`,
              value: formatNumber(pool.netStockInflow24h, { digits: 4 }),
            },
            {
              label: `Net ${quote.symbol} out (24h)`,
              value: formatNumber(pool.netStockOutflow24h, { digits: 4 }),
            },
            {
              label: "Data status",
              value: data.meta.isLive ? data.meta.status : "Not live",
            },
          ].map((item) => (
            <div key={item.label} className="card p-3">
              <p className="card-label mb-1 leading-snug">{item.label}</p>
              <p className="stat-value text-sm text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
