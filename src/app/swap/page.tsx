import type { Metadata } from "next";
import { BankrSwapHost } from "../../components/BankrSwapHost";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { StatusBar } from "../../components/StatusBar";
import { siteConfig } from "../../lib/config";
import { getDashboardData } from "../../lib/data";
import { formatUsd } from "../../lib/format";

export const revalidate = 60;

export const metadata: Metadata = {
  title: `Swap $${siteConfig.ticker} — ${siteConfig.projectName}`,
  description: `Trade $${siteConfig.ticker} via Bankr, hosted in the ${siteConfig.projectName} app. Verify the official contract before swapping.`,
};

export default async function SwapPage() {
  const data = await getDashboardData();
  const priceLabel =
    data.token.priceUsd != null
      ? formatUsd(data.token.priceUsd, {
          digits: data.token.priceUsd < 0.01 ? 6 : 4,
        })
      : undefined;

  return (
    <>
      <StatusBar />
      <Header />
      <main className="flex-1">
        <BankrSwapHost priceLabel={priceLabel} />
      </main>
      <Footer />
    </>
  );
}
