import type { Metadata } from "next";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { StatusBar } from "../../components/StatusBar";
import { TerminalDashboard } from "../../components/TerminalDashboard";
import { siteConfig } from "../../lib/config";
import { getDashboardData } from "../../lib/data";

export const metadata: Metadata = {
  title: `Terminal — ${siteConfig.projectName}`,
  description: `$${siteConfig.ticker} market terminal: pool balances, fees, and contract verification. No fake data before launch.`,
};

export default async function TerminalPage() {
  const data = await getDashboardData();

  return (
    <>
      <StatusBar />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <TerminalDashboard data={data} />
        </div>
      </main>
      <Footer />
    </>
  );
}
