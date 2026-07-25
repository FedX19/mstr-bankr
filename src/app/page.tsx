import { BullVsBear } from "../components/BullVsBear";
import { FaqSummary } from "../components/FaqSummary";
import { Flywheel } from "../components/Flywheel";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { HowTradingWorks } from "../components/HowTradingWorks";
import { Invalidation } from "../components/Invalidation";
import { MarketMissing } from "../components/MarketMissing";
import { RiskSummary } from "../components/RiskSummary";
import { StatusBar } from "../components/StatusBar";
import { ThesisPanel } from "../components/ThesisPanel";
import { TransparencySummary } from "../components/TransparencySummary";

export default function Home() {
  return (
    <>
      <StatusBar />
      <Header />
      <main className="flex-1">
        {/* 1 Prelaunch status · 2 Hero · 3 Thesis · 4 Flywheel · 5 Missing · 6 Mechanics · 7 Bull/Bear · 8 Invalidation · 9 Transparency · 10 Risks · 11 FAQ · 12 Footer */}
        <Hero />
        <ThesisPanel />
        <Flywheel />
        <MarketMissing />
        <HowTradingWorks />
        <BullVsBear />
        <Invalidation />
        <TransparencySummary />
        <RiskSummary />
        <FaqSummary />
      </main>
      <Footer />
    </>
  );
}
