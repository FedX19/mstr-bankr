import Link from "next/link";
import { siteConfig } from "../lib/config";

const bullets = [
  "Strategy (MSTR) is the purest large-scale Bitcoin treasury company in public markets — a BTC accumulation vehicle with operating leverage to the price of Bitcoin.",
  "The market has spent years treating it like a risky levered bet or a software company that happens to own BTC. That framing is wrong.",
  "Short interest remains elevated even after a brutal drawdown — most recently ~13% of the float, and at points the most shorted large-cap by short interest as % of market cap.",
  "This is not primarily a short-squeeze trade. It is conviction that the market misprices long-term value, with structural short interest that can amplify any positive shift.",
  "Our edge: creator fees recycle into tokenized MSTR — public, trackable, compounding demand.",
];

export function ThesisPanel() {
  const { strategy } = siteConfig;

  return (
    <section id="thesis" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <p className="card-label mb-2">Thesis</p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              The market has it wrong
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
              Calm conviction. Limited downside relative to upside when the asset
              is understood correctly. Skin in the game through transparent fee →
              MSTR buying.
            </p>

            <ul className="mt-8 space-y-4">
              {bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-[var(--text-muted)]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/thesis"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-[var(--accent-border)] hover:bg-[var(--bg-card-hover)]"
              >
                Read full thesis
                <span className="text-[var(--text-dim)]">→</span>
              </Link>
              <p className="text-sm font-medium text-[var(--accent)]">
                We like the stock.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="card border-[var(--accent-border)] bg-[var(--accent-soft)] p-5">
              <p className="card-label mb-2 text-[var(--accent)]">
                Short Interest Callout
              </p>
              <p className="stat-value text-4xl font-medium text-white">
                {strategy.shortInterestFloatPct}%+
              </p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                of float · {strategy.shortSharesNote}
              </p>
              <p className="mt-4 text-xs leading-relaxed text-[var(--text-dim)]">
                {strategy.shortInterestCallout}
              </p>
            </div>

            <div className="card p-5">
              <p className="card-label mb-2">Asymmetric Setup</p>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                Elevated short interest + Bitcoin cycle positioning + public fee
                recycling into the underlying. Not hype — structure.
              </p>
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-[var(--text-dim)]">
                Secondary phrase
              </p>
              <p className="mt-1 text-sm text-white">
                Recycling volume into the treasury.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
