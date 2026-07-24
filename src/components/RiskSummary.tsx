import Link from "next/link";
import { getQuoteAsset, siteConfig } from "../lib/config";

export function RiskSummary() {
  const quote = getQuoteAsset();

  return (
    <section id="risks-summary" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="card border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.06)] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl">
              <p className="card-label mb-2 text-[var(--negative)]">
                Risk disclosure
              </p>
              <p className="text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
                Roaring Saylor is a highly speculative cultural token. It provides
                no ownership in Strategy, {quote.displayName}s, Bitcoin, the
                liquidity pool or the project company. Prices may fall to zero.
                Robinhood Stock Tokens are restricted in the United States and
                other jurisdictions.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-[var(--text-dim)]">
                {siteConfig.nonAffiliation}
              </p>
            </div>
            <Link
              href="/risks"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[rgba(239,68,68,0.35)] px-4 py-2.5 text-sm font-medium text-[var(--negative)] transition-opacity hover:opacity-85"
            >
              Full risks
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
