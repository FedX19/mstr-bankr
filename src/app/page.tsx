import { BuyStrip } from "../components/BuyStrip";
import { Flywheel } from "../components/Flywheel";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { MissionScoreboard } from "../components/MissionScoreboard";
import { OnePool } from "../components/OnePool";
import { RiskStrip } from "../components/RiskStrip";
import { StatusBar } from "../components/StatusBar";
import { getDashboardData } from "../lib/data";

/** Refresh market data about once a minute. */
export const revalidate = 60;

export default async function Home() {
  const data = await getDashboardData();

  return (
    <>
      <StatusBar />
      <Header />
      <main className="flex-1">
        <Hero />
        <BuyStrip />
        <OnePool />
        <Flywheel />
        <MissionScoreboard data={data} />
        <RiskStrip />
      </main>
      <Footer />
    </>
  );
}
