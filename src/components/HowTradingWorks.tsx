import Link from "next/link";
import { getQuoteAsset, siteConfig } from "../lib/config";
import { BrandMark } from "./BrandMark";

export function HowTradingWorks() {
  const quote = getQuoteAsset();

  return (
    <section id="mechanics" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="card-label mb-2">Proposed mechanics</p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Stock-paired market (proposed)
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
              Intended primary market:{" "}
              <strong className="text-white">{siteConfig.proposedPair}</strong>.
              The pair is not yet confirmed. Launch remains subject to platform
              support, liquidity testing, jurisdictional eligibility, and legal
              review.
            </p>
          </div>
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-[var(--accent)] hover:opacity-85"
          >
            Full explanation →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="card relative overflow-hidden p-5 sm:p-6">
            <div className="pointer-events-none absolute -right-6 -top-6 hidden opacity-20 sm:block">
              <BrandMark size="lg" variant="transparent" />
            </div>
            <p className="card-label mb-3 text-[var(--positive)]">
              When users buy (proposed)
            </p>
            <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-[var(--text-dim)]">
              <span className="rounded-full border border-[var(--border)] px-2 py-1">
                {quote.symbol} in
              </span>
              <span aria-hidden>→</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-2 py-1 text-[var(--accent)]">
                <BrandMark size="xs" />
                out
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              When users buy through the proposed pool, tokenized MSTR enters
              the pool and Roaring Stacker leaves it.
            </p>
          </div>

          <div className="card relative overflow-hidden p-5 sm:p-6">
            <div className="pointer-events-none absolute -right-6 -top-6 hidden opacity-20 sm:block">
              <BrandMark size="lg" variant="transparent" />
            </div>
            <p className="card-label mb-3 text-[var(--negative)]">
              When users sell (proposed)
            </p>
            <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-[var(--text-dim)]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-2 py-1 text-[var(--accent)]">
                <BrandMark size="xs" />
                in
              </span>
              <span aria-hidden>→</span>
              <span className="rounded-full border border-[var(--border)] px-2 py-1">
                {quote.symbol} out
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              When users sell, Roaring Stacker enters the pool and tokenized
              MSTR leaves it.
            </p>
          </div>
        </div>

        <div className="card mt-4 border-[var(--border-strong)] p-5">
          <ul className="space-y-2 text-sm leading-relaxed text-[var(--text-muted)]">
            <li>
              • The MSTR balance is <strong className="text-white">dynamic</strong>
            </li>
            <li>
              • It is{" "}
              <strong className="text-white">not a permanent treasury</strong>
            </li>
            <li>
              • Holders{" "}
              <strong className="text-white">do not own</strong> the MSTR in
              the pool
            </li>
            <li>
              • The project token is{" "}
              <strong className="text-white">not backed by MSTR</strong>
            </li>
            <li>
              • The pair is{" "}
              <strong className="text-white">not yet confirmed</strong>
            </li>
            <li>
              • Launch remains subject to{" "}
              <strong className="text-white">platform and legal approval</strong>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
