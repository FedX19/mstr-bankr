import Link from "next/link";
import {
  getMemeContractDisplay,
  getQuoteAsset,
  isLive,
  isPrelaunch,
  siteConfig,
} from "../lib/config";
import type { DashboardData } from "../lib/data";
import { formatPct, formatUsd } from "../lib/format";

type Props = {
  data: DashboardData;
};

export function Hero({ data }: Props) {
  const quote = getQuoteAsset();
  const live = isLive();
  const prelaunch = isPrelaunch();
  const { token } = data;
  const change = token.priceChange24hPct;
  const changeClass =
    change == null ? "dim" : change >= 0 ? "positive-text" : "negative-text";

  return (
    <section className="relative overflow-hidden border-b border-[var(--border)]">
      <div className="bg-radial-glow bg-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="badge">Stock-paired meme</span>
              {live ? (
                <span className="badge badge-live">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--positive)]" />
                  Live
                </span>
              ) : (
                <span className="badge badge-accent">Prelaunch</span>
              )}
              <span className="badge">
                {siteConfig.chain.chainName}
              </span>
            </div>

            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              {siteConfig.category}
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
              {siteConfig.tagline}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
              {prelaunch
                ? `Roaring Saylor is an independent cultural meme being designed around a primary market denominated in tokenized ${quote.symbol} exposure.`
                : siteConfig.positioning}
            </p>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--text-dim)]">
              {prelaunch
                ? `Buyers would add tokenized ${quote.symbol} to the pool. Sellers would remove it. Every movement would be visible onchain.`
                : `Buyers add ${quote.symbol} exposure to the primary liquidity pool. Sellers remove it. The entire market is visible onchain.`}
            </p>

            {prelaunch ? (
              <p className="mt-4 max-w-xl text-xs leading-relaxed text-[var(--text-dim)]">
                The proposed launch remains subject to Bankr support, liquidity
                testing, jurisdictional eligibility and legal review. No launch
                date or official contract has been announced.
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {prelaunch || !live ? (
                <>
                  <Link
                    href="/thesis"
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-medium text-[var(--accent)] transition-opacity hover:opacity-90"
                  >
                    Read the thesis
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-[var(--accent-border)] hover:bg-[var(--bg-card-hover)]"
                  >
                    See how it works
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/transparency"
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-medium text-[var(--accent)] transition-opacity hover:opacity-90"
                  >
                    Verify contract
                  </Link>
                  <Link
                    href="/#pool"
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-[var(--accent-border)]"
                  >
                    View pool
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="card w-full max-w-sm shrink-0 p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="card-label">Primary market</p>
              <span className="badge">
                {live ? "Live" : "Not live"}
              </span>
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-dim)]">
              Meme / Tokenized {quote.symbol}
            </p>
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <div>
                <p className="stat-value text-3xl font-medium text-white sm:text-4xl">
                  {formatUsd(token.priceUsd, {
                    digits:
                      token.priceUsd && token.priceUsd < 0.01 ? 6 : 4,
                  })}
                </p>
                <p className={`mt-1 text-sm font-medium ${changeClass}`}>
                  {formatPct(change)}{" "}
                  <span className="dim font-normal">24h</span>
                </p>
              </div>
              <div className="text-right">
                <p className="card-label mb-1">In {quote.symbol}</p>
                <p className="stat-value text-lg font-medium text-white">
                  {token.priceInStock != null
                    ? token.priceInStock.toPrecision(4)
                    : "—"}
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3 border-t border-[var(--border)] pt-4">
              <div>
                <p className="card-label mb-1">Meme contract</p>
                <p className="stat-value truncate text-xs text-[var(--text-muted)]">
                  {getMemeContractDisplay()}
                </p>
              </div>
              <div>
                <p className="card-label mb-1">
                  Canonical {quote.symbol}
                </p>
                <p className="stat-value truncate text-xs text-[var(--text-muted)]">
                  {quote.address ?? "Pending registry verification"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
