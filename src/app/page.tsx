import { AccumulationTracker } from "../components/AccumulationTracker";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { MarketContext } from "../components/MarketContext";
import { Roadmap } from "../components/Roadmap";
import { StatsRow } from "../components/StatsRow";
import { ThesisPanel } from "../components/ThesisPanel";
import { getDashboardData } from "../lib/data";

export default async function Home() {
  const data = await getDashboardData();

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero data={data} />
        <StatsRow data={data} />
        <AccumulationTracker data={data} />
        <ThesisPanel />
        <MarketContext data={data} />
        <Roadmap />
      </main>
      <Footer />
    </>
  );
}
