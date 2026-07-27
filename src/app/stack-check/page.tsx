import type { Metadata } from "next";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { SundayStackCheck } from "../../components/SundayStackCheck";
import { siteConfig } from "../../lib/config";
import { getPublishedStackCheckSnapshot } from "../../lib/stack-check";

export const metadata: Metadata = {
  title: `Sunday Stack Check — ${siteConfig.projectName}`,
  description:
    "Daily Strategy BTC reserve + STACKR/MSTR pool scoreboard. Watch the reserve. Watch the wheel.",
};

/**
 * Published daily snapshot is held by unstable_cache and refreshed by
 * /api/cron/stack-check at 21:00 UTC. Page revalidate is a safety net only.
 */
export const revalidate = 3600;

export default async function StackCheckPage() {
  const data = await getPublishedStackCheckSnapshot();

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_70%_40%_at_50%_-10%,rgba(247,147,26,0.07),transparent_55%)]" />
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          <SundayStackCheck data={data} />
        </div>
      </main>
      <Footer />
    </>
  );
}
