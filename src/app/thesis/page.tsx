import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../../components/PageShell";
import { getQuoteAsset, siteConfig } from "../../lib/config";

export const metadata: Metadata = {
  title: `MSTR Thesis — ${siteConfig.projectName}`,
  description:
    "Balanced thesis on Strategy (MSTR) as a Bitcoin treasury company: bull case, bear case, capital structure risks, and why Roaring Saylor is a cultural market denominated in tokenized MSTR — not equity in Strategy.",
};

export default function ThesisPage() {
  const quote = getQuoteAsset();
  const { strategy } = siteConfig;

  return (
    <PageShell>
      <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
        {quote.symbol} Thesis
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Why {quote.symbol}?
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--text-muted)]">
        Strategy is the largest publicly traded Bitcoin treasury company. Roaring
        Saylor turns the debate around that structure into an onchain cultural
        market denominated in tokenized {quote.symbol} exposure.
      </p>
      <p className="mt-3 text-sm text-[var(--text-dim)]">
        Research snapshot as of {strategy.dataAsOf}. Market facts must be
        refreshed from primary sources before publication.
      </p>

      <hr className="section-rule my-10" />

      <section className="prose-section">
        <h2>What Roaring Saylor is (and is not)</h2>
        <p>
          Roaring Saylor is an independent cultural meme. It is not Strategy
          stock, not Bitcoin, not a share in the project company, and not
          redeemable for {quote.symbol}. Holders have no rights to pool assets
          and no affiliation with Strategy, Michael Saylor, Keith Gill, Robinhood
          or Bankr.
        </p>
        <p className="accent-line">{siteConfig.tagline}</p>
      </section>

      <section className="prose-section">
        <h2>Bull case (balanced)</h2>
        <ul>
          <li>
            Strategy holds a large, publicly disclosed Bitcoin treasury (
            <strong>{strategy.btcHoldings.toLocaleString()} BTC</strong> in the
            research snapshot) — a pure-play vehicle for BTC exposure in equity
            markets.
          </li>
          <li>
            Capital structure can amplify upside when Bitcoin rises and when the
            market assigns a premium to the treasury narrative.
          </li>
          <li>
            Cultural recognition and crypto-native attention create durable meme
            energy around the ticker.
          </li>
          <li>
            Tokenized {quote.symbol} on {siteConfig.chain.chainName} enables an
            onchain market that mirrors that debate without claiming ownership of
            the underlying equity.
          </li>
        </ul>
      </section>

      <section className="prose-section">
        <h2>Bear case (balanced)</h2>
        <ul>
          <li>
            Capital structure works both ways: leverage, preferred stock and debt
            can amplify drawdowns when Bitcoin falls or when refinancing becomes
            difficult.
          </li>
          <li>
            Dilution risk from equity or convertible issuance can pressure the
            common stock.
          </li>
          <li>
            Valuation premiums to net Bitcoin holdings can compress or reverse.
          </li>
          <li>
            Bitcoin-sale risk: treasury policy could change; sales would alter the
            narrative and asset base.
          </li>
          <li>
            Short interest remains elevated (research: ~{strategy.shortInterestFloatPct}%
            of float, {strategy.shortSharesNote}) — a double-edged factor, not a
            free option on a squeeze.
          </li>
        </ul>
        <p>
          Do not describe {quote.symbol} as low-risk or as having limited
          downside.
        </p>
      </section>

      <section className="prose-section">
        <h2>Bitcoin sensitivity</h2>
        <p>
          Strategy equity typically exhibits amplified beta to Bitcoin. That
          makes it interesting as a cultural and financial narrative — and more
          volatile than holding spot BTC alone. The stock-paired meme inherits
          secondary market dynamics of tokenized {quote.symbol}, which may
          diverge from the referenced equity and from Bitcoin.
        </p>
      </section>

      <section className="prose-section">
        <h2>Capital-structure complexity</h2>
        <p>
          Debt, preferred stock, convertibles and active capital markets activity
          make Strategy harder to model than a simple BTC wrapper. Complexity is
          both the thesis for some bulls and the core objection for bears.
        </p>
      </section>

      <section className="prose-section">
        <h2>Invalidation conditions</h2>
        <p>Thesis-level invalidation (for the cultural market framing) includes:</p>
        <ul>
          <li>
            Material, sustained abandonment of the Bitcoin treasury strategy.
          </li>
          <li>
            Structural liquidity failure of the tokenized {quote.symbol} market
            such that a responsible stock-paired pool cannot be seeded.
          </li>
          <li>
            Legal or platform constraints that prevent a compliant stock-paired
            launch (fallback hierarchy applies: COIN → PLTR → TSLA).
          </li>
          <li>
            Discovery that product claims cannot be made accurately without
            misrepresenting pool ownership or Stock Token rights.
          </li>
        </ul>
      </section>

      <section className="prose-section">
        <h2>How the product uses this thesis</h2>
        <p>
          The primary market is denominated in tokenized {quote.symbol}. Buyers
          add {quote.symbol} exposure to the pool; sellers remove it. There is no
          discretionary fee-to-stock purchase program and no permanent
          holder-owned treasury. Creator fees are project revenue, not holder
          income.
        </p>
      </section>

      <div className="card mt-12 border-[var(--accent-border)] bg-[var(--accent-soft)] p-6">
        <p className="text-sm text-[var(--text-muted)]">
          This page is research and product framing — not investment advice.{" "}
          {siteConfig.nonAffiliation}
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-[var(--accent)] hover:opacity-85"
          >
            How it works →
          </Link>
          <Link
            href="/risks"
            className="text-sm font-medium text-[var(--accent)] hover:opacity-85"
          >
            Risks →
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
