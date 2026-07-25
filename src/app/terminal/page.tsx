import type { Metadata } from "next";
import Image from "next/image";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { StatusBar } from "../../components/StatusBar";
import { TerminalDashboard } from "../../components/TerminalDashboard";
import { siteConfig } from "../../lib/config";
import { getDashboardData } from "../../lib/data";

export const metadata: Metadata = {
  title: `Terminal — ${siteConfig.projectName}`,
  description: `$${siteConfig.ticker} market terminal: pool balances, fees, and contract verification.`,
};

export const revalidate = 60;

export default async function TerminalPage() {
  const data = await getDashboardData();

  return (
    <>
      <StatusBar />
      <Header />
      <main className="flex-1">
        {/* Blended command-center header */}
        <section className="relative isolate overflow-hidden border-b border-[var(--border)]">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <Image
              src={siteConfig.brand.commandCenter}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[center_40%] opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/85 to-[var(--bg)]/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/40 to-[var(--bg)]/70" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_80%_50%,rgba(247,147,26,0.12),transparent_65%)]" />
          </div>
          <span className="sr-only">{siteConfig.brand.commandCenterAlt}</span>

          <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <p className="card-label mb-2">Market terminal</p>
            <h1 className="max-w-xl text-2xl font-semibold tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)] sm:text-3xl">
              ${siteConfig.ticker} Command Center
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-200/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)]">
              Live pool and market data. Verify the official contract before you
              trade. Buying ${siteConfig.ticker} through the MSTR pair adds
              tokenized MSTR exposure to the pool — not ownership of Strategy,
              Bitcoin, or pool assets.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <TerminalDashboard data={data} />
        </div>
      </main>
      <Footer />
    </>
  );
}
