import Link from "next/link";
import { getQuoteAsset, siteConfig } from "../lib/config";

export function HowTradingWorks() {
  const quote = getQuoteAsset();

  return (
    <section id="how-trading" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="card-label mb-2">Mechanics</p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              How trading works
            </h2>
          </div>
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-[var(--accent)] hover:opacity-85"
          >
            Full explanation →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-5 sm:p-6">
            <p className="card-label mb-3 text-[var(--positive)]">
              When someone buys
            </p>
            <ol className="space-y-3 text-sm text-[var(--text-muted)]">
              <li className="flex gap-3">
                <span className="stat-value shrink-0 text-[var(--text-dim)]">
                  1
                </span>
                <span>Buyer supplies tokenized {quote.symbol}</span>
              </li>
              <li className="flex gap-3">
                <span className="stat-value shrink-0 text-[var(--text-dim)]">
                  2
                </span>
                <span>Liquidity pool receives {quote.symbol}</span>
              </li>
              <li className="flex gap-3">
                <span className="stat-value shrink-0 text-[var(--text-dim)]">
                  3
                </span>
                <span>
                  Pool releases {siteConfig.projectName} tokens
                </span>
              </li>
            </ol>
            <p className="mt-5 border-t border-[var(--border)] pt-4 text-sm font-medium text-white">
              Tokenized {quote.symbol} enters the pool.{" "}
              {siteConfig.projectName} leaves the pool.
            </p>
          </div>

          <div className="card p-5 sm:p-6">
            <p className="card-label mb-3 text-[var(--negative)]">
              When someone sells
            </p>
            <ol className="space-y-3 text-sm text-[var(--text-muted)]">
              <li className="flex gap-3">
                <span className="stat-value shrink-0 text-[var(--text-dim)]">
                  1
                </span>
                <span>
                  Seller supplies {siteConfig.projectName} tokens
                </span>
              </li>
              <li className="flex gap-3">
                <span className="stat-value shrink-0 text-[var(--text-dim)]">
                  2
                </span>
                <span>Liquidity pool receives the meme tokens</span>
              </li>
              <li className="flex gap-3">
                <span className="stat-value shrink-0 text-[var(--text-dim)]">
                  3
                </span>
                <span>Pool releases tokenized {quote.symbol}</span>
              </li>
            </ol>
            <p className="mt-5 border-t border-[var(--border)] pt-4 text-sm font-medium text-white">
              {siteConfig.projectName} enters the pool. Tokenized{" "}
              {quote.symbol} leaves the pool.
            </p>
          </div>
        </div>

        <div className="card mt-4 border-[var(--border-strong)] p-5">
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            The pool&apos;s {quote.symbol} balance is{" "}
            <strong className="text-white">dynamic</strong>. It is not a
            permanent treasury, and tokenholders have{" "}
            <strong className="text-white">no ownership claim</strong> over pool
            assets. Exposure can increase on buys and decrease on sells.
          </p>
        </div>
      </div>
    </section>
  );
}
