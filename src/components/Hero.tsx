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
      <div className="bg-radial-glow absolute inset-0 opacity-70" aria-hidden />

      <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 py-12 sm:gap-8 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-6 lg:py-16">
        {/* Copy */}
        <div className="order-1 z-10 max-w-xl">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <BrandMark size="sm" priority glow />
            <span className="badge badge-accent">${siteConfig.ticker}</span>
            <span className="badge">{live ? "Live" : "Prelaunch"}</span>
          </div>

          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--accent)] sm:text-xs sm:tracking-[0.22em]">
            ROARING STACKER
          </p>

          <h1 className="text-[2.25rem] font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[3.35rem]">
            {siteConfig.mainHeadline}
          </h1>

          <p className="mt-4 text-base font-medium tracking-wide text-[var(--accent)] sm:text-lg">
            {siteConfig.thesisLine}
          </p>

          <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-[var(--text-muted)] sm:text-lg">
            Bitcoin trades 24/7. ${siteConfig.ticker} is a cultural market
            paired with {quote.displayName.toLowerCase()}. Buying $
            {siteConfig.ticker} through the MSTR pair adds tokenized MSTR
            exposure to the pool.
          </p>

          <p className="mt-2 text-[11px] text-[var(--text-dim)] sm:text-xs">
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

        {/* Mascot — large, clear, lightly feathered into bg (not boxed) */}
        <div className="order-2 relative w-full justify-self-center lg:justify-self-end">
          <div className="mascot-hero-plate relative mx-auto w-full max-w-2xl lg:max-w-none">
            <Image
              src={siteConfig.brand.mascotHero}
              alt={siteConfig.brand.heroAlt}
              width={1672}
              height={941}
              priority
              sizes="(max-width: 1024px) 100vw, 56vw"
              className="h-auto w-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
