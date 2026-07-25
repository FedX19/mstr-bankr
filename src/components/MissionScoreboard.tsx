import { getQuoteAsset, isLive, siteConfig } from "../lib/config";
import type { DashboardData } from "../lib/data";
import { pendingLabel } from "../lib/data";
import { formatNumber, formatUsd } from "../lib/format";

type Props = {
  data: DashboardData;
};

export function MissionScoreboard({ data }: Props) {
  // Show live metrics whenever feeds return data (or config is live).
  const live =
    data.meta.isLive ||
    data.meta.status === "ok" ||
    (isLive() && data.token.priceUsd != null);
  const quote = getQuoteAsset();
  const empty = pendingLabel(Boolean(live));

  const liveMetrics: { label: string; value: string }[] = [
    {
      label: `Tokenized ${quote.symbol} in pool`,
      value:
        data.pool.stock.units != null
          ? formatNumber(data.pool.stock.units, { digits: 4 })
          : empty,
    },
    {
      label: "Pool liquidity",
      value: formatUsd(data.pool.totalLiquidityUsd, { compact: true }),
    },
    {
      label: "24-hour volume",
      value: formatUsd(data.token.volume24hUsd, { compact: true }),
    },
    {
      label: "Cumulative volume",
      value: formatUsd(data.token.cumulativeVolumeUsd, { compact: true }),
    },
    {
      label: "24h trades",
      value:
        data.token.uniqueTraders != null
          ? formatNumber(data.token.uniqueTraders)
          : empty,
    },
    {
      label: "Creator fees",
      value: formatUsd(data.fees.totalCreatorFeesUsd, { compact: true }),
    },
  ];

  return (
    <section id="mission" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="card-label mb-2">Mission</p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              BUILD THE DEEPEST MSTR MARKET ONCHAIN.
            </h2>
          </div>
          <p className="text-xs text-[var(--text-dim)]">
            {live
              ? `Last updated: ${data.meta.lastUpdated ?? "Data pending"}`
              : "Prelaunch · metrics unlock after launch"}
          </p>
        </div>

        {!live ? (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {siteConfig.missionMilestones.map((item, i) => (
              <li
                key={item}
                className="card flex items-start gap-3 p-4"
              >
                <span className="stat-value shrink-0 text-xs text-[var(--accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-snug text-[var(--text-muted)]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            {liveMetrics.map((m) => (
              <div key={m.label} className="card p-4">
                <p className="card-label mb-1.5">{m.label}</p>
                <p className="stat-value text-lg font-medium text-white sm:text-xl">
                  {m.value === "—" ? empty : m.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
