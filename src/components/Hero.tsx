import Link from "next/link";
import Image from "next/image";
import {
  getQuoteAsset,
  isLive,
  isPrelaunch,
  siteConfig,
} from "../lib/config";
import { BrandMark } from "./BrandMark";
import { BuyNowButton } from "./BuyNowButton";

export function Hero() {
  const live = isLive();
  const prelaunch = isPrelaunch();
  const quote = getQuoteAsset();

  return (
    <section className="relative isolate overflow-hidden border-b border-[var(--border)]">
      {/* Full-bleed blended mascot atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[var(--bg)]" />
        {/* Mobile: image sits lower / centered, faded for copy */}
        <div className="absolute inset-x-0 bottom-0 top-[28%] md:hidden">
          <Image
            src={siteConfig.brand.mascotHero}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_30%] opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/55 to-[var(--bg)]/90" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
        </div>
        {/* Desktop: strong presence on the right, soft left fade into copy */}
        <div className="absolute inset-y-0 right-0 hidden w-[58%] md:block lg:w-[54%]">
          <Image
            src={siteConfig.brand.mascotHero}
            alt=""
            fill
            priority
            sizes="54vw"
            className="object-cover object-[center_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-[var(--bg)]/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg)]/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_45%,rgba(247,147,26,0.12),transparent_65%)]" />
        </div>
        <div className="bg-radial-glow absolute inset-0 opacity-80" />
      </div>

      {/* Accessible alt for the decorative background art */}
      <span className="sr-only">{siteConfig.brand.heroAlt}</span>

      <div className="relative mx-auto flex min-h-[min(78svh,680px)] max-w-6xl flex-col justify-end px-4 pb-12 pt-20 sm:min-h-[min(72vh,700px)] sm:px-6 sm:pb-16 sm:pt-24 md:justify-center lg:py-24">
        <div className="max-w-xl lg:max-w-2xl">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <BrandMark size="sm" priority glow />
            <span className="badge badge-accent">${siteConfig.ticker}</span>
            <span className="badge">{live ? "Live" : "Prelaunch"}</span>
          </div>

          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--accent)] sm:text-xs sm:tracking-[0.22em]">
            ROARING STACKER
          </p>

          <h1 className="text-[2.25rem] font-semibold leading-[1.05] tracking-tight text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)] sm:text-5xl md:text-6xl lg:text-[3.5rem]">
            {siteConfig.mainHeadline}
          </h1>

          <p className="mt-4 text-base font-medium tracking-wide text-[var(--accent)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] sm:text-lg">
            {siteConfig.thesisLine}
          </p>

          <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-zinc-100/90 drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)] sm:text-lg">
            Bitcoin trades 24/7. ${siteConfig.ticker} is a cultural market
            paired with {quote.displayName.toLowerCase()}. Buying $
            {siteConfig.ticker} through the MSTR pair adds tokenized MSTR
            exposure to the pool.
          </p>

          <p className="mt-2 text-[11px] text-zinc-400 sm:text-xs">
            {siteConfig.primarySlogan}
            {" · "}
            {siteConfig.creed}
            {" · "}
            {siteConfig.communityName}
          </p>

          <div className="mt-6 flex w-full flex-col gap-2.5 sm:mt-7 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-3">
            {prelaunch || !live ? (
              <>
                <Link
                  href="/thesis"
                  className="btn-primary inline-flex w-full items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold sm:w-auto sm:py-2.5"
                >
                  Read the Thesis
                </Link>
                <Link
                  href="/how-it-works"
                  className="btn-ghost inline-flex w-full items-center justify-center rounded-lg px-5 py-3 text-sm font-medium sm:w-auto sm:py-2.5"
                >
                  See How It Works
                </Link>
              </>
            ) : (
              <>
                <BuyNowButton className="btn-primary inline-flex w-full items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold sm:w-auto sm:py-2.5" />
                <Link
                  href="/tokenomics"
                  className="btn-ghost inline-flex w-full items-center justify-center rounded-lg px-5 py-3 text-sm font-medium sm:w-auto sm:py-2.5"
                >
                  Tokenomics
                </Link>
                <Link
                  href="/terminal"
                  className="inline-flex w-full items-center justify-center py-2 text-sm font-medium text-zinc-300 underline-offset-4 hover:text-white hover:underline sm:w-auto"
                >
                  Terminal
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
