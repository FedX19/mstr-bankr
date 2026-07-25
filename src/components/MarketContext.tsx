import { getQuoteAsset, siteConfig, strategyDataLabel } from "../lib/config";
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
            Bitcoin, {quote.symbol} & the thesis
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
            Research context only. Live financial figures require a source and
            date; otherwise we show “Data source pending.”
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="card p-5">
            <p className="card-label mb-3">Why it may matter</p>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              Our thesis is that the market may understate the link between MSTR,
              Strategy&apos;s access to capital, and Bitcoin demand. That is a
              thesis — not a guarantee.
            </p>
          </div>

          <div className="card p-5">
            <p className="card-label mb-3">
              {siteConfig.strategy.name} BTC holdings
            </p>
            <p className="stat-value text-3xl font-medium text-white">
              {holdings != null ? formatNumber(holdings) : "—"}
            </p>
            <p className="mt-1 text-sm text-[var(--accent)]">
              {holdings != null
                ? "BTC (research snapshot)"
                : siteConfig.strategy.dataNote}
            </p>
            <p className="mt-4 text-xs leading-relaxed text-[var(--text-dim)]">
              {holdings != null
                ? `About ${formatBtc(holdings)}. ${strategyDataLabel()}`
                : strategyDataLabel()}
            </p>
          </div>

          <div className="card p-5">
            <p className="card-label mb-3">{quote.symbol} vs pure BTC</p>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              Strategy stock can move with{" "}
              <span className="text-white">amplified sensitivity</span> to
              Bitcoin — both up and down. That is a risk, not a promise of
              outperformance.
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
