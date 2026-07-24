import { siteConfig } from "../lib/config";
import type { DashboardData } from "../lib/data";
import { formatPct, formatUsd } from "../lib/format";

type Props = {
  data: DashboardData;
};

export function Hero({ data }: Props) {
  const { token } = data;
  const change = token.priceChange24hPct;
  const changeClass =
    change == null
      ? "dim"
      : change >= 0
        ? "positive-text"
        : "negative-text";

  return (
    <section className="relative overflow-hidden border-b border-[var(--border)]">
      <div className="bg-radial-glow bg-grid absolute inset-0 pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="badge">Public Dashboard</span>
              {data.isLive ? (
                <span className="badge badge-live">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--positive)] animate-pulse" />
                  Live
                </span>
              ) : (
                <span className="badge">Pre-launch · Feeds pending</span>
              )}
            </div>

            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Roaring Saylor Thesis
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
              {siteConfig.tagline}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
              {siteConfig.thesisOneLiner}
            </p>

            <p className="mt-4 text-sm text-[var(--text-dim)]">
              Recycling volume into the treasury.{" "}
              <span className="text-[var(--text-muted)]">
                {siteConfig.feeAllocationPct}% of creator fees → tokenized MSTR.
              </span>
            </p>
          </div>

          <div className="card w-full max-w-sm shrink-0 p-5 sm:p-6">
            <p className="card-label mb-4">Token</p>
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="stat-value text-3xl font-medium text-white sm:text-4xl">
                  {formatUsd(token.priceUsd, { digits: token.priceUsd && token.priceUsd < 0.01 ? 6 : 4 })}
                </p>
                <p className={`mt-1 text-sm font-medium ${changeClass}`}>
                  {formatPct(change)}{" "}
                  <span className="dim font-normal">24h</span>
                </p>
              </div>
              <div className="text-right">
                <p className="card-label mb-1">Market Cap</p>
                <p className="stat-value text-lg font-medium text-white">
                  {formatUsd(token.marketCapUsd, { compact: true })}
                </p>
              </div>
            </div>
            <div className="mt-5 border-t border-[var(--border)] pt-4">
              <p className="card-label mb-1">Contract</p>
              <p className="stat-value truncate text-xs text-[var(--text-muted)]">
                {siteConfig.contractAddress}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
