import Link from "next/link";
import { getQuoteAsset, siteConfig } from "../lib/config";
import { BrandMark } from "./BrandMark";

export function ThesisPanel() {
  const quote = getQuoteAsset();
  const { strategy } = siteConfig;

  const bullets = [
    "Bitcoin-native audience and cultural overlap with treasury narratives.",
    "Public-market volatility that maps cleanly to meme-market energy.",
    "Strong bullish and bearish camps — a genuine debate, not a one-sided cheer.",
    "Recognizable Bitcoin treasury story in public equities.",
    `Direct fit with ${siteConfig.chain.chainName}'s tokenized-equity market structure.`,
  ];

  return (
    <section id="thesis" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <p className="card-label mb-2">Thesis summary</p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Why {quote.symbol}?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
              Strategy is the largest publicly traded Bitcoin treasury company.
              Its common stock provides amplified exposure to Bitcoin through an
              actively managed capital structure. The market remains divided over
              whether that structure represents an advantage or a liability.
              Roaring Saylor turns that debate into an onchain cultural market.
            </p>

            <ul className="mt-8 space-y-4">
              {bullets.map((b) => (
                <li
                  key={b}
                  className="flex gap-3 text-sm leading-relaxed text-[var(--text-muted)]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/thesis"
                className="btn-ghost inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium"
              >
                Read full thesis
                <span className="text-[var(--text-dim)]">→</span>
              </Link>
              <p className="text-sm font-medium text-[var(--accent)]">
                {siteConfig.tagline}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="card relative overflow-hidden border-[var(--accent-border)] bg-[var(--accent-soft)] p-5">
              <div className="pointer-events-none absolute -right-4 -top-4 opacity-30">
                <BrandMark size="lg" />
              </div>
              <p className="card-label mb-2 text-[var(--accent)]">
                Research context
              </p>
              <p className="stat-value text-4xl font-medium text-white">
                {strategy.shortInterestFloatPct}%+
              </p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                short interest of float · {strategy.shortSharesNote}
              </p>
              <p className="mt-4 text-xs leading-relaxed text-[var(--text-dim)]">
                {strategy.shortInterestCallout} Snapshot as of{" "}
                {strategy.dataAsOf} — figures change over time.
              </p>
            </div>

            <div className="card p-5">
              <div className="mb-3 flex items-center gap-3">
                <BrandMark size="xs" />
                <p className="card-label mb-0">What this is not</p>
              </div>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                Not a claim that {quote.symbol} has limited downside. Not a
                short-squeeze product. Not affiliation with Strategy or any
                public figure. A cultural market denominated in tokenized{" "}
                {quote.symbol} exposure.
              </p>
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-[var(--text-dim)]">
                Supporting phrase
              </p>
              <p className="mt-1 text-sm text-white">
                {siteConfig.supportingPhrase}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
