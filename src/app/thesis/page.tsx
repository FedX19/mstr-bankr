import Link from "next/link";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { siteConfig } from "../../lib/config";

export const metadata = {
  title: "Full Thesis — Roaring Saylor",
  description:
    "The Roaring Saylor thesis: Strategy (MSTR) as the purest large-scale Bitcoin treasury company, elevated short interest, and transparent fee recycling into tokenized MSTR.",
};

export default function ThesisPage() {
  const { strategy, feeAllocationPct } = siteConfig;

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <Link
            href="/"
            className="text-xs font-medium uppercase tracking-wider text-[var(--text-dim)] transition-colors hover:text-[var(--text)]"
          >
            ← Dashboard
          </Link>

          <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
            Roaring Saylor Thesis
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            We like the stock.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[var(--text-muted)]">
            Conviction that the market is wrong about Strategy — combined with a
            structural imbalance that can amplify any positive shift in sentiment
            or Bitcoin price.
          </p>

          <hr className="section-rule my-10" />

          <section className="prose-section">
            <h2>The Asset</h2>
            <p>
              Strategy ({strategy.ticker}) is the purest large-scale Bitcoin
              treasury company in the public markets. It holds{" "}
              <strong>{strategy.btcHoldings.toLocaleString()} BTC</strong>. The
              stock has been heavily shorted for an extended period — most
              recently ~{strategy.shortInterestFloatPct}% of the float (
              {strategy.shortSharesNote}), and at points it ranked as the most
              shorted large-cap stock in America when measured by short interest
              as a percentage of market cap.
            </p>
          </section>

          <section className="prose-section">
            <h2>The Asymmetric Setup</h2>
            <p>This creates a classic asymmetric setup:</p>
            <ul>
              <li>
                The market has spent years treating Strategy like a risky levered
                bet or a software company that happens to own Bitcoin.
              </li>
              <li>
                In reality it is a{" "}
                <strong>
                  Bitcoin accumulation vehicle with operating leverage to the
                  price of BTC
                </strong>
                .
              </li>
              <li>
                Short interest remains elevated even after a brutal drawdown.
              </li>
              <li>
                Bitcoin itself has been through a deep and painful bear market.
                Many of the classic bear-market conditions (capitulation volume,
                forced selling, narrative exhaustion) have already played out.
                The probability that the cycle low is in — or very close — is
                rising.
              </li>
            </ul>
          </section>

          <section className="prose-section">
            <h2>Not Primarily a Squeeze</h2>
            <p>
              Just like the original Roaring Kitty thesis on GameStop, this is
              not primarily a “short squeeze trade.” It is a conviction that the
              market is wrong about the long-term value of the asset, combined
              with a structural imbalance (elevated short interest) that can
              amplify any positive shift in sentiment or Bitcoin price.
            </p>
            <p className="accent-line">We like the stock.</p>
          </section>

          <section className="prose-section">
            <h2>Our Edge</h2>
            <p>
              We are turning meme trading volume into direct, visible demand for
              tokenized MSTR. Every meaningful amount of creator fees gets
              recycled into buying the tokenized stock. This is{" "}
              <strong>public, trackable, and compounds over time</strong>.
            </p>
            <p>
              Allocation: <strong>{feeAllocationPct}%</strong> of creator fees →
              tokenized MSTR. Secondary phrase:{" "}
              <em>Recycling volume into the treasury.</em>
            </p>
          </section>

          <section className="prose-section">
            <h2>Business Plan</h2>
            <ol>
              <li>Launch the token (non-paired initially).</li>
              <li>Collect creator fees.</li>
              <li>
                Allocate a fixed percentage ({feeAllocationPct}%) to buying
                tokenized MSTR.
              </li>
              <li>Publish every purchase.</li>
              <li>
                Keep the door open for a true stock-paired version later (when
                Bankr liquidity allows).
              </li>
              <li>Build narrative ownership of “Roaring Saylor” early.</li>
            </ol>
          </section>

          <section className="prose-section">
            <h2>Tone</h2>
            <p>
              Calm, repeated conviction instead of constant hype. Emphasis on
              “the market has it wrong” and limited downside relative to upside.
              Skin in the game through transparent fee → MSTR buying. The written
              thesis stays serious and data-driven.
            </p>
          </section>

          <div className="card mt-12 border-[var(--accent-border)] bg-[var(--accent-soft)] p-6">
            <p className="text-sm text-[var(--text-muted)]">
              Short interest remains a live variable. Holdings and float metrics
              should be refreshed as new filings and data arrive. This document
              is for narrative and research framing — not investment advice.
            </p>
            <Link
              href="/#accumulation"
              className="mt-4 inline-flex text-sm font-medium text-[var(--accent)] hover:opacity-85"
            >
              View accumulation tracker →
            </Link>
          </div>
        </article>
      </main>
      <Footer />
      <style>{`
        .prose-section {
          margin-bottom: 2.5rem;
        }
        .prose-section h2 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 0.75rem;
          letter-spacing: -0.01em;
        }
        .prose-section p {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }
        .prose-section strong {
          color: #e4e4e7;
          font-weight: 600;
        }
        .prose-section em {
          color: var(--text);
          font-style: italic;
        }
        .prose-section ul,
        .prose-section ol {
          margin: 0.75rem 0 1rem;
          padding-left: 1.25rem;
          color: var(--text-muted);
          font-size: 0.9375rem;
          line-height: 1.7;
        }
        .prose-section li {
          margin-bottom: 0.5rem;
        }
        .prose-section li::marker {
          color: var(--accent);
        }
        .accent-line {
          font-size: 1.125rem !important;
          font-weight: 600;
          color: var(--accent) !important;
          margin-top: 1.5rem !important;
        }
      `}</style>
    </>
  );
}
