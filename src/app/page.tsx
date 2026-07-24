import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { HowTradingWorks } from "../components/HowTradingWorks";
import { JurisdictionNotice } from "../components/JurisdictionNotice";
import { MarketContext } from "../components/MarketContext";
import { PoolVisualization } from "../components/PoolVisualization";
import { RiskSummary } from "../components/RiskSummary";
import { StatsRow } from "../components/StatsRow";
import { StatusBar } from "../components/StatusBar";
import { ThesisPanel } from "../components/ThesisPanel";
import { TransparencySummary } from "../components/TransparencySummary";
import { getDashboardData } from "../lib/data";

export default async function Home() {
  const data = await getDashboardData();

  return (
    <>
      <StatusBar />
      <Header />
      <main className="flex-1">
        <Hero data={data} />
        <JurisdictionNotice />
        <StatsRow data={data} />
        <PoolVisualization data={data} />
        <HowTradingWorks />
        <ThesisPanel />
        <MarketContext data={data} />
        <TransparencySummary />
        <RiskSummary />
      </main>
      <Footer />
    </>
  );
}
