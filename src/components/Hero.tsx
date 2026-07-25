import Image from "next/image";
import Link from "next/link";
import {
  getBankrUrl,
  getQuoteAsset,
  isLive,
  isPrelaunch,
  siteConfig,
} from "../lib/config";
import { BrandMark } from "./BrandMark";

export function Hero() {
  const live = isLive();
  const prelaunch = isPrelaunch();
  const quote = getQuoteAsset();

  return (
    <section className="border-b border-[var(--border)]">
      <div className="relative isolate min-h-[min(78svh,640px)] overflow-hidden sm:min-h-[min(72vh,680px)]">
        <div className="absolute inset-0">
          <Image
            src={siteConfig.brand.heroMobile}
            alt={siteConfig.brand.heroMobileAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_18%] opacity-90 md:hidden"
          />
          <Image
            src={siteConfig.brand.hero}
            alt={siteConfig.brand.heroAlt}
            fill
            priority
            sizes="100vw"
            className="hidden object-cover object-[70%_center] md:block"
          />
          {/* Keep text dominant — heavy scrim on left / bottom */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#050506] via-[#050506]/80 to-black/30 md:hidden"
            aria-hidden
          />
          <div
            className="absolute inset-0 hidden bg-gradient-to-r from-[#050506] via-[#050506]/88 to-[#050506]/25 md:block"
            aria-hidden
          />
          <div
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--bg)] to-transparent"
            aria-hidden
          />
        </div>

        <div className="relative mx-auto flex min-h-[min(78svh,640px)] max-w-6xl flex-col justify-end px-4 pb-10 pt-16 sm:min-h-[min(72vh,680px)] sm:px-6 sm:pb-14 sm:pt-24 md:justify-center">
          <div className="max-w-xl lg:max-w-2xl">
            <div className="mb-4 flex flex-wrap items-center gap-2.5">
              <BrandMark size="sm" priority glow />
              <span className="badge badge-accent">${siteConfig.ticker}</span>
              <span className="badge">{live ? "Live" : "Prelaunch"}</span>
            </div>

            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--accent)] sm:text-xs sm:tracking-[0.22em]">
              ROARING STACKER
            </p>

            <h1 className="text-[2.25rem] font-semibold leading-[1.05] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] sm:text-5xl md:text-6xl lg:text-[3.5rem]">
              {siteConfig.mainHeadline}
            </h1>

            <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-zinc-100/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)] sm:text-lg">
              Bitcoin trades 24/7. Roaring Stacker is being built around a
              primary market paired with {quote.displayName.toLowerCase()}.
            </p>

            <p className="mt-3 text-sm font-medium tracking-wide text-[var(--accent)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] sm:text-base">
              {siteConfig.thesisLine}
            </p>

            <p className="mt-2 text-[11px] text-zinc-500 sm:text-xs">
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
                  <Link
                    href="/buy"
                    className="btn-primary inline-flex w-full items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold sm:w-auto sm:py-2.5"
                  >
                    Buy ${siteConfig.ticker}
                  </Link>
                  <Link
                    href="/terminal"
                    className="btn-ghost inline-flex w-full items-center justify-center rounded-lg px-5 py-3 text-sm font-medium sm:w-auto sm:py-2.5"
                  >
                    Market terminal
                  </Link>
                  <a
                    href={getBankrUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center py-2 text-sm font-medium text-zinc-300 underline-offset-4 hover:text-white hover:underline sm:w-auto"
                  >
                    Open Bankr
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
