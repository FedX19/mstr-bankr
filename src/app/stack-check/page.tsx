import type { Metadata } from "next";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { SundayStackCheck } from "../../components/SundayStackCheck";
import { siteConfig } from "../../lib/config";
import { getStackCheckSnapshot } from "../../lib/stack-check";

export const metadata: Metadata = {
  title: `Sunday Stack Check — ${siteConfig.projectName}`,
  description:
    "Weekly Strategy BTC reserve + STACKR/MSTR pool scoreboard. Watch the reserve. Watch the wheel.",
};

/** Refresh ~hourly; Sunday label is computed at request time. */
export const revalidate = 3600;

/**
 * Clean editorial page — single site header, no duplicate status chrome.
 * Hero export card is the visual centerpiece.
 */
export default async function StackCheckPage() {
  const data = await getStackCheckSnapshot();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Subtle page atmosphere */}
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_70%_40%_at_50%_-10%,rgba(247,147,26,0.07),transparent_55%)]" />
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          <SundayStackCheck data={data} />
        </div>
      </main>
      <Footer />
    </>
  );
}
