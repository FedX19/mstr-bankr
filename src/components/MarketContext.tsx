import { siteConfig } from "../lib/config";
import type { DashboardData } from "../lib/data";
import { formatBtc, formatNumber } from "../lib/format";

type Props = {
  data: DashboardData;
};

export function MarketContext({ data }: Props) {
  const holdings = data.market.btcHoldings;

  return (
    <section id="market" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8">
          <p className="card-label mb-2">Market Context</p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Bitcoin cycle & Strategy
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="card p-5 md:col-span-1">
            <p className="card-label mb-3">Cycle Note</p>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              {data.market.cycleNote}
            </p>
            <p className="mt-4 text-xs leading-relaxed text-[var(--text-dim)]">
              Capitulation volume, forced selling, and narrative exhaustion have
              largely played out. Classic bear-market conditions are exhausted.
            </p>
          </div>

          <div className="card p-5 md:col-span-1">
            <p className="card-label mb-3">Strategy Holdings</p>
            <p className="stat-value text-3xl font-medium text-white">
              {formatNumber(holdings)}
            </p>
            <p className="mt-1 text-sm text-[var(--accent)]">BTC on balance sheet</p>
            <p className="mt-4 text-xs leading-relaxed text-[var(--text-dim)]">
              {siteConfig.strategy.name} ({siteConfig.strategy.ticker}) holds{" "}
              {formatBtc(holdings)}. The purest large-scale Bitcoin treasury
              company in the public markets.
            </p>
          </div>

          <div className="card p-5 md:col-span-1">
            <p className="card-label mb-3">MSTR vs Pure BTC</p>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              During the drawdown, Strategy has traded with{" "}
              <span className="text-white">amplified beta</span> to Bitcoin —
              both to the downside historically and, structurally, to the upside
              when BTC recovers.
            </p>
            <div className="mt-5 space-y-2 border-t border-[var(--border)] pt-4">
              <div className="flex justify-between text-xs">
                <span className="dim">Pure BTC</span>
                <span className="text-[var(--text-muted)]">Spot exposure</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="dim">MSTR / Strategy</span>
                <span className="text-[var(--accent)]">Treasury + leverage</span>
              </div>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-[var(--text-dim)]">
              Comparison is qualitative for the dashboard; pair with your own
              performance charts when publishing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
