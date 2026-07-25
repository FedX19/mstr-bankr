import type { Metadata } from "next";
import { BeginnerBuy } from "../../components/BeginnerBuy";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { StatusBar } from "../../components/StatusBar";
import { siteConfig } from "../../lib/config";
import { getDashboardData } from "../../lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: `Buy $${siteConfig.ticker} — ${siteConfig.projectName}`,
  description: `Beginner-friendly guide to buy $${siteConfig.ticker}. Verify the official contract, set up your wallet, then complete the swap on Bankr.`,
};

export default async function BuyPage() {
  const data = await getDashboardData();

  return (
    <>
      <StatusBar />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <BeginnerBuy
            priceUsd={data.token.priceUsd}
            priceChange24hPct={data.token.priceChange24hPct}
            liquidityUsd={data.pool.totalLiquidityUsd}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
