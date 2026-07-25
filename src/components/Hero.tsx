import Image from "next/image";
import Link from "next/link";
import { isLive, isPrelaunch, siteConfig } from "../lib/config";
import { BrandMark } from "./BrandMark";

export function Hero() {
  const live = isLive();
  const prelaunch = isPrelaunch();

  return (
    <section className="border-b border-[var(--border)]">
      <div className="relative isolate min-h-[min(88svh,720px)] overflow-hidden sm:min-h-[min(82vh,780px)]">
        <div className="absolute inset-0">
          <Image
            src={siteConfig.brand.heroMobile}
            alt={siteConfig.brand.heroMobileAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_20%] md:hidden"
          />
          <Image
            src={siteConfig.brand.hero}
            alt={siteConfig.brand.heroAlt}
            fill
            priority
            sizes="100vw"
            className="hidden object-cover object-[62%_center] md:block"
          />

          <div
            className="absolute inset-0 bg-gradient-to-t from-[#050506] via-[#050506]/75 to-black/25 md:hidden"
            aria-hidden
          />
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

        <div className="relative mx-auto flex min-h-[min(88svh,720px)] max-w-6xl flex-col justify-end px-4 pb-10 pt-20 sm:min-h-[min(82vh,780px)] sm:px-6 sm:pb-16 sm:pt-28 md:justify-center lg:pb-20">
          <div className="max-w-md lg:max-w-lg">
            <div className="mb-4 flex flex-wrap items-center gap-2.5 sm:mb-5 sm:gap-3">
              <BrandMark size="md" priority glow />
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge badge-accent">
                  ${siteConfig.ticker}
                </span>
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
              ROARING STACKER
            </p>

            <h1 className="text-[2.35rem] font-semibold leading-[1.08] tracking-tight text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.75)] sm:text-5xl md:text-6xl lg:text-[3.75rem] lg:leading-[1.05]">
              {siteConfig.primarySlogan}
            </h1>

            <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-zinc-100/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:mt-4 sm:text-lg">
              Bitcoin has been written off. MSTR&apos;s capital engine has been
              written off. The Roaring Stacker thesis is that the market may
              have both wrong.
            </p>

            <p className="mt-3 text-sm font-medium tracking-wide text-[var(--accent)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] sm:mt-4">
              {siteConfig.thesisLine}
            </p>
            <p className="mt-1 text-sm font-medium tracking-wide text-zinc-200/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
              {siteConfig.catalystLine}
            </p>

            <p className="mt-3 text-[11px] text-zinc-500 sm:text-xs">
              {siteConfig.communityName}
              {" · "}
              {siteConfig.creed}
              {prelaunch ? " · No official token" : ""}
            </p>

            <div className="mt-6 flex w-full flex-col gap-2.5 sm:mt-7 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <Link
                href="/thesis"
                className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold sm:w-auto sm:py-2.5"
              >
                Read the Thesis
              </Link>
              <Link
                href="/how-it-works"
                className="btn-ghost inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium sm:w-auto sm:py-2.5"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
