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
    <section className="border-b border-[var(--border)]">
      {/* Cinematic stage — portrait mobile / landscape desktop */}
      <div className="relative isolate min-h-[min(88svh,720px)] overflow-hidden sm:min-h-[min(82vh,780px)]">
        <div className="absolute inset-0">
          {/* Mobile portrait crop — lion face first */}
          <Image
            src={siteConfig.brand.heroMobile}
            alt={siteConfig.brand.heroMobileAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_20%] md:hidden"
          />
          {/* Desktop landscape command center */}
          <Image
            src={siteConfig.brand.hero}
            alt={siteConfig.brand.heroAlt}
            fill
            priority
            sizes="100vw"
            className="hidden object-cover object-[62%_center] md:block"
          />

          {/* Mobile: heavy bottom scrim so type sits clean under the face */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#050506] via-[#050506]/75 to-black/25 md:hidden"
            aria-hidden
          />
          {/* Desktop: left-only scrim */}
          <div
            className="absolute inset-0 hidden bg-gradient-to-r from-[#050506]/95 via-[#050506]/45 to-transparent md:block lg:w-[55%]"
            aria-hidden
          />
          <div
            className="absolute inset-x-0 bottom-0 hidden h-28 bg-gradient-to-t from-[var(--bg)] to-transparent md:block sm:h-36"
            aria-hidden
          />
          <div
            className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent"
            aria-hidden
          />
        </div>

        <div className="relative mx-auto flex min-h-[min(88svh,720px)] max-w-6xl flex-col justify-end px-4 pb-8 pt-20 sm:min-h-[min(82vh,780px)] sm:px-6 sm:pb-14 sm:pt-28 md:justify-center lg:pb-20">
          <div className="max-w-md lg:max-w-lg">
            <div className="mb-4 flex flex-wrap items-center gap-2.5 sm:mb-5 sm:gap-3">
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
              </div>
            </div>

            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--accent)] sm:mb-3 sm:text-xs sm:tracking-[0.22em]">
              {siteConfig.category}
            </p>

            <h1 className="text-[2.35rem] font-semibold leading-[1.08] tracking-tight text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.75)] sm:text-5xl md:text-6xl lg:text-[3.75rem] lg:leading-[1.05]">
              {siteConfig.tagline}
            </h1>

            <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-zinc-100/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:mt-4 sm:text-lg">
              {prelaunch
                ? `An independent cultural meme being designed around a primary market denominated in tokenized ${quote.symbol} exposure.`
                : siteConfig.positioning}
            </p>

            <p className="mt-2 text-sm font-medium tracking-wide text-[var(--accent)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] sm:mt-3">
              {siteConfig.supportingPhrase}
            </p>

            <p className="mt-2 text-[11px] text-zinc-500 sm:mt-3 sm:text-xs">
              Fair launch · no presale · no creator allocation · pair: meme /{" "}
              {quote.symbol}
            </p>

            <div className="mt-6 flex w-full flex-col gap-2.5 sm:mt-7 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              {prelaunch || !live ? (
                <>
                  <Link
                    href="/how-it-works"
                    className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold sm:w-auto sm:py-2.5"
                  >
                    See how it works
                  </Link>
                  <Link
                    href="/thesis"
                    className="btn-ghost inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium sm:w-auto sm:py-2.5"
                  >
                    Read the thesis
                  </Link>
                  <Link
                    href="/faq"
                    className="inline-flex w-full items-center justify-center py-2 text-sm font-medium text-zinc-300 underline-offset-4 hover:text-white hover:underline sm:w-auto"
                  >
                    FAQ
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/transparency"
                    className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold sm:w-auto sm:py-2.5"
                  >
                    Verify contract
                  </Link>
                  <Link
                    href="/#pool"
                    className="btn-ghost inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium sm:w-auto sm:py-2.5"
                  >
                    View pool
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Market strip — stacks cleanly on phones */}
      <div className="relative border-t border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="flex min-w-0 items-center gap-3">
              <BrandMark size="sm" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-white">
                    Primary market
                  </p>
                  <span className="badge">{live ? "Live" : "Not live"}</span>
                </div>
                <p className="mt-0.5 text-xs leading-snug text-[var(--text-dim)]">
                  Meme / Tokenized {quote.symbol}
                  {prelaunch ? " · Coming soon" : ""}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4 sm:gap-6">
              <div className="min-w-0">
                <p className="card-label mb-1">Price</p>
                <p className="stat-value text-base font-medium text-white sm:text-lg">
                  {formatUsd(token.priceUsd, {
                    digits:
                      token.priceUsd && token.priceUsd < 0.01 ? 6 : 4,
                  })}
                </p>
                <p className={`mt-0.5 text-xs font-medium ${changeClass}`}>
                  {formatPct(change)} 24h
                </p>
              </div>
              <div className="min-w-0">
                <p className="card-label mb-1">In {quote.symbol}</p>
                <p className="stat-value text-base font-medium text-white sm:text-lg">
                  {token.priceInStock != null
                    ? token.priceInStock.toPrecision(4)
                    : "—"}
                </p>
              </div>
              <div className="col-span-2 min-w-0 sm:col-span-1">
                <p className="card-label mb-1">Meme contract</p>
                <p className="stat-value break-all text-xs text-[var(--text-muted)] sm:truncate sm:text-sm">
                  {getMemeContractDisplay()}
                </p>
              </div>
              <div className="col-span-2 min-w-0 sm:col-span-1">
                <p className="card-label mb-1">Canonical {quote.symbol}</p>
                <p className="stat-value break-all text-xs text-[var(--text-muted)] sm:truncate sm:text-sm">
                  {quote.address
                    ? `${quote.address.slice(0, 6)}…${quote.address.slice(-4)}`
                    : "Pending"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
