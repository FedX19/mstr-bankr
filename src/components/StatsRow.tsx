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
  const stats: Stat[] = [
    {
      label: "Token Market Cap",
      value: formatUsd(data.token.marketCapUsd, { compact: true }),
    },
    {
      label: "24h Volume",
      value: formatUsd(data.token.volume24hUsd, { compact: true }),
    },
    {
      label: "Holders",
      value: formatNumber(data.token.holders, { compact: true }),
    },
    {
      label: "Creator Fees Earned",
      value: formatUsd(data.fees.totalCreatorFeesUsd, { compact: true }),
      sub: `${data.fees.recycledPct}% allocation to MSTR`,
    },
    {
      label: "Tokenized MSTR Accumulated",
      value: formatUsd(data.accumulation.totalMstrUsd, { compact: true }),
      sub: `${formatNumber(data.accumulation.totalMstrUnits, { digits: 2 })} units`,
      highlight: true,
    },
    {
      label: "MSTR Purchases",
      value: formatNumber(data.accumulation.purchaseCount),
      sub: "All public & verifiable",
      highlight: true,
    },
  ];

  return (
    <section id="stats" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-white">
              Live Stats
            </h2>
            <p className="mt-1 text-xs text-[var(--text-dim)]">
              High-signal metrics. Numbers update when feeds are connected.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
