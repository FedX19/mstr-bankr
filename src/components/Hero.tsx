import Image from "next/image";
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
import { BrandMark } from "./BrandMark";

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
    <section className="relative isolate min-h-[min(92vh,880px)] overflow-hidden border-b border-[var(--border)]">
      {/* Cinematic plate — lion sits right; left is dark for type */}
      <div className="absolute inset-0">
        <Image
          src={siteConfig.brand.hero}
          alt={siteConfig.brand.heroAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[78%_center] sm:object-[72%_center] lg:object-right"
        />
        {/* Readability stacks */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#050506] via-[#050506]/92 to-[#050506]/25 sm:via-[#050506]/88 sm:to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-black/35"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"
          aria-hidden
        />
        <div className="hero-vignette absolute inset-0" aria-hidden />
      </div>

      <div className="relative mx-auto flex min-h-[min(92vh,880px)] max-w-6xl flex-col justify-end px-4 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-24 lg:justify-center lg:py-24">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-center lg:gap-12">
          {/* Copy column */}
          <div className="max-w-xl">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <BrandMark size="md" priority glow />
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge badge-accent">Stock-paired meme</span>
                {live ? (
                  <span className="badge badge-live">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--positive)]" />
                    Live
                  </span>
                ) : (
                  <span className="badge">Prelaunch</span>
                )}
                <span className="badge hidden sm:inline-flex">
                  {siteConfig.chain.chainName}
                </span>
              </div>
            </div>

            <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[var(--accent)]">
              {siteConfig.category}
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.65)] sm:text-5xl md:text-6xl lg:text-[3.75rem] lg:leading-[1.05]">
              {siteConfig.tagline}
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-zinc-200/90 sm:text-lg">
              {prelaunch
                ? `An independent cultural meme being designed around a primary market denominated in tokenized ${quote.symbol} exposure.`
                : siteConfig.positioning}
            </p>

            <p className="mt-4 max-w-lg text-sm leading-relaxed text-zinc-400">
              {prelaunch
                ? `Buyers would add tokenized ${quote.symbol} to the pool. Sellers would remove it. Every movement would be visible onchain.`
                : `Buyers add ${quote.symbol} exposure to the primary liquidity pool. Sellers remove it. The entire market is visible onchain.`}
            </p>

            <p className="mt-3 text-sm font-medium tracking-wide text-[var(--accent)]">
              {siteConfig.supportingPhrase}
            </p>

            {prelaunch ? (
              <p className="mt-4 max-w-lg text-xs leading-relaxed text-zinc-500">
                Launch remains subject to Bankr support, liquidity testing,
                jurisdictional eligibility and legal review. No official contract
                has been announced.
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {prelaunch || !live ? (
                <>
                  <Link
                    href="/thesis"
                    className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
                  >
                    Read the thesis
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="btn-ghost inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium"
                  >
                    See how it works
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/transparency"
                    className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
                  >
                    Verify contract
                  </Link>
                  <Link
                    href="/#pool"
                    className="btn-ghost inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium"
                  >
                    View pool
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Floating market glass card */}
          <div className="glass-card w-full max-w-md justify-self-start lg:justify-self-end lg:max-w-none">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <BrandMark size="sm" />
                <div>
                  <p className="card-label">Primary market</p>
                  <p className="text-xs font-medium text-white">
                    Meme / Tokenized {quote.symbol}
                  </p>
                </div>
              </div>
              <span className="badge">{live ? "Live" : "Not live"}</span>
            </div>

            <div className="flex items-baseline justify-between gap-4">
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

            <div className="mt-5 space-y-3 border-t border-white/10 pt-4">
              <div>
                <p className="card-label mb-1">Meme contract</p>
                <p className="stat-value truncate text-xs text-zinc-300">
                  {getMemeContractDisplay()}
                </p>
              </div>
              <div>
                <p className="card-label mb-1">Canonical {quote.symbol}</p>
                <p className="stat-value truncate text-xs text-zinc-300">
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
