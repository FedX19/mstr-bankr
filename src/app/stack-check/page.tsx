import type { Metadata } from "next";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { StatusBar } from "../../components/StatusBar";
import { SundayStackCheck } from "../../components/SundayStackCheck";
import { siteConfig } from "../../lib/config";
import { getStackCheckSnapshot } from "../../lib/stack-check";

export const metadata: Metadata = {
  title: `Sunday Stack Check — ${siteConfig.projectName}`,
  description:
    "Weekly Strategy BTC reserve + STACKR/MSTR pool card. Watch the reserve. Watch the wheel.",
};

/** Refresh ~hourly; Sunday label is computed at request time. */
export const revalidate = 3600;

export default async function StackCheckPage() {
  const data = await getStackCheckSnapshot();

  return (
    <>
      <StatusBar />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <SundayStackCheck data={data} />
        </div>
      </main>
      <Footer />
    </>
  );
}
