import { Flywheel } from "../components/Flywheel";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { MissionScoreboard } from "../components/MissionScoreboard";
import { OnePool } from "../components/OnePool";
import { RiskStrip } from "../components/RiskStrip";
import { StatusBar } from "../components/StatusBar";
import { getDashboardData } from "../lib/data";

export default async function Home() {
  const data = await getDashboardData();

  return (
    <>
      <StatusBar />
      <Header />
      <main className="flex-1">
        <Hero />
        <OnePool />
        <Flywheel />
        <MissionScoreboard data={data} />
        <RiskStrip />
      </main>
      <Footer />
    </>
  );
}
