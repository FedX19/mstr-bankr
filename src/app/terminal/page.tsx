import type { Metadata } from "next";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { MascotFrame } from "../../components/MascotFrame";
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
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="mb-8 grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] sm:gap-8">
            <div>
              <p className="card-label mb-2">Market terminal</p>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                ${siteConfig.ticker} Command Center
              </h1>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--text-muted)]">
                Live pool and market data. Verify the official contract before
                you trade. Buying ${siteConfig.ticker} through the MSTR pair
                adds tokenized MSTR exposure to the pool — not ownership of
                Strategy, Bitcoin, or pool assets.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm sm:max-w-none">
              <MascotFrame
                src={siteConfig.brand.commandCenter}
                alt={siteConfig.brand.commandCenterAlt}
                sizes="(max-width: 640px) 100vw, 420px"
              />
            </div>
          </div>

          <TerminalDashboard data={data} />
        </div>
      </main>
      <Footer />
    </>
  );
}
