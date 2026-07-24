import { getQuoteAsset, siteConfig } from "../lib/config";
import type { DashboardData } from "../lib/data";
import { formatBtc, formatNumber } from "../lib/format";

type Props = {
  data: DashboardData;
};

export function MarketContext({ data }: Props) {
  const quote = getQuoteAsset();
  const holdings = data.market.btcHoldings;

  return (
    <section id="market-context" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8">
          <p className="card-label mb-2">Market context</p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Bitcoin, {quote.symbol} & research framing
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
            Performance charts for the meme token will appear only when live
            market data exists. Do not treat research figures as live trading
            signals.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="card p-5">
            <p className="card-label mb-3">Research note</p>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              {data.market.cycleNote}
            </p>
            <p className="mt-4 text-xs leading-relaxed text-[var(--text-dim)]">
              Holdings, short interest and cycle narratives change. Source
              filings and market data providers before publishing updates.
            </p>
          </div>

          <div className="card p-5">
            <p className="card-label mb-3">
              {siteConfig.strategy.name} holdings (research)
            </p>
            <p className="stat-value text-3xl font-medium text-white">
              {formatNumber(holdings)}
            </p>
            <p className="mt-1 text-sm text-[var(--accent)]">
              BTC on balance sheet
            </p>
            <p className="mt-4 text-xs leading-relaxed text-[var(--text-dim)]">
              {siteConfig.strategy.name} ({siteConfig.strategy.ticker}) holds{" "}
              {formatBtc(holdings)} per research snapshot as of{" "}
              {siteConfig.strategy.dataAsOf}. Not a real-time feed.
            </p>
          </div>

          <div className="card p-5">
            <p className="card-label mb-3">
              {quote.symbol} vs pure BTC
            </p>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              Strategy stock can exhibit{" "}
              <span className="text-white">amplified beta</span> to Bitcoin —
              both downside and upside — through capital structure and market
              positioning. That is a risk factor, not a guarantee of outperformance.
            </p>
            <div className="mt-5 space-y-2 border-t border-[var(--border)] pt-4">
              <div className="flex justify-between text-xs">
                <span className="dim">Pure BTC</span>
                <span className="text-[var(--text-muted)]">Spot exposure</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="dim">{quote.symbol} / Strategy</span>
                <span className="text-[var(--accent)]">
                  Treasury + capital structure
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
