import { getQuoteAsset } from "../lib/config";
import type { DashboardData } from "../lib/data";
import { formatNumber, formatUsd } from "../lib/format";

type Props = {
  data: DashboardData;
};

type Stat = {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
};

export function StatsRow({ data }: Props) {
  const quote = getQuoteAsset();

  const stats: Stat[] = [
    {
      label: "Token price (USD)",
      value: formatUsd(data.token.priceUsd, {
        digits:
          data.token.priceUsd != null && data.token.priceUsd < 0.01 ? 6 : 4,
      }),
    },
    {
      label: `Price in ${quote.symbol}`,
      value:
        data.token.priceInStock != null
          ? data.token.priceInStock.toPrecision(4)
          : "—",
    },
    {
      label: "Fully diluted cap",
      value: formatUsd(data.token.marketCapUsd, { compact: true }),
    },
    {
      label: "24h volume",
      value: formatUsd(data.token.volume24hUsd, { compact: true }),
    },
    {
      label: "Pool liquidity",
      value: formatUsd(data.pool.totalLiquidityUsd, { compact: true }),
      highlight: true,
    },
    {
      label: `${quote.symbol} in pool`,
      value:
        data.pool.stock.units != null
          ? formatNumber(data.pool.stock.units, { digits: 4 })
          : "—",
      sub: data.pool.stock.usdValue != null
        ? formatUsd(data.pool.stock.usdValue, { compact: true })
        : "Not live",
      highlight: true,
    },
    {
      label: "Holders",
      value: formatNumber(data.token.holders, { compact: true }),
    },
    {
      label: "Creator fees",
      value: formatUsd(data.fees.totalCreatorFeesUsd, { compact: true }),
      sub: `${data.fees.tradingFeeBps / 100}% swap · ${data.fees.creatorSharePct}% creator share`,
    },
  ];

  return (
    <section id="market" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-white">
              Live market
            </h2>
            <p className="mt-1 text-xs text-[var(--text-dim)]">
              {data.meta.isLive
                ? `Last update: ${data.meta.lastUpdated ?? "—"} · Source: ${data.meta.source}`
                : "Not live. Placeholders only — no fabricated sample values."}
            </p>
          </div>
          {data.meta.status === "stale" ? (
            <span className="badge text-[var(--negative)]">
              Stale data
            </span>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`card p-4 ${
                stat.highlight
                  ? "border-[var(--accent-border)] bg-[var(--accent-soft)]"
                  : ""
              }`}
            >
              <p className="card-label mb-2 leading-snug">{stat.label}</p>
              <p
                className={`stat-value text-xl font-medium sm:text-2xl ${
                  stat.highlight ? "text-[var(--accent)]" : "text-white"
                }`}
              >
                {stat.value}
              </p>
              {stat.sub ? (
                <p className="mt-1.5 text-[11px] leading-snug text-[var(--text-dim)]">
                  {stat.sub}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
