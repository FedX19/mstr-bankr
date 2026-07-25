import { getPairLabel, siteConfig } from "../lib/config";
import { BrandMark } from "./BrandMark";
import { StockTokenMark } from "./StockTokenMark";

export function OnePool() {
  return (
    <section id="pool" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="mb-8 text-center sm:mb-10">
          <p className="card-label mb-2">{getPairLabel()}</p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            ONE POOL. ONE THESIS.
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          <div className="card flex flex-col items-center p-5 text-center sm:p-6">
            <BrandMark size="md" glow />
            <p className="card-label mt-4">The Meme</p>
            <p className="mt-1 text-xl font-semibold text-white">
              ${siteConfig.ticker}
            </p>
          </div>

          <div className="card flex flex-col items-center p-5 text-center sm:p-6">
            <StockTokenMark size="md" glow />
            <p className="card-label mt-4">The Stock</p>
            <p className="mt-1 text-xl font-semibold text-white">
              Tokenized MSTR
            </p>
          </div>

          <div className="card flex flex-col items-center border-[var(--accent-border)] bg-[var(--accent-soft)] p-5 text-center sm:p-6">
            <p className="stat-value text-2xl text-[var(--accent)]">↻</p>
            <p className="card-label mt-4">The Engine</p>
            <p className="mt-1 text-sm font-semibold leading-snug text-white sm:text-base">
              MSTR → Capital → Bitcoin
            </p>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-[var(--text-muted)]">
          Buying ${siteConfig.ticker} through the MSTR pair adds tokenized MSTR
          exposure to the pool. Selling removes it. Pool composition changes
          continuously and is publicly visible.
        </p>

        <div className="card mx-auto mt-5 max-w-2xl border-[var(--border-strong)] p-4 sm:p-5">
          <p className="text-xs leading-relaxed text-[var(--text-dim)] sm:text-sm">
            {siteConfig.memeDisclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
