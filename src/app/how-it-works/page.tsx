import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../../components/PageShell";
import { getPairLabel, getQuoteAsset, siteConfig } from "../../lib/config";

export const metadata: Metadata = {
  title: `How It Works — ${siteConfig.projectName}`,
  description: `How the proposed ${getPairLabel()} market works on ${siteConfig.chainName}.`,
};

export default function HowItWorksPage() {
  const quote = getQuoteAsset();

  return (
    <PageShell>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
        Mechanics
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        How it works
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--text-muted)]">
        Proposed primary market: <strong>{getPairLabel()}</strong> on{" "}
        {siteConfig.chainName} via Bankr. Pair status:{" "}
        {siteConfig.pairStatus}. Subject to platform rules and eligibility.
      </p>

      <hr className="section-rule my-10" />

      <section className="prose-section">
        <h2>When users buy</h2>
        <p>
          Tokenized {quote.symbol} enters the pool. ${siteConfig.ticker} leaves
          the pool.
        </p>
      </section>

      <section className="prose-section">
        <h2>When users sell</h2>
        <p>
          ${siteConfig.ticker} enters the pool. Tokenized {quote.symbol} leaves
          the pool.
        </p>
      </section>

      <section className="prose-section">
        <h2>What holders do not get</h2>
        <ul>
          <li>Ownership of tokenized {quote.symbol} in the pool</li>
          <li>MSTR “backing” or redemption rights</li>
          <li>Dividends, income, or voting rights</li>
          <li>A permanent treasury claim</li>
        </ul>
      </section>

      <section className="prose-section">
        <h2>Platform rules</h2>
        <p>
          Bankr location checks, KYC, wallet restrictions, and eligibility rules
          apply. This project does not bypass them. If the MSTR stock-token path
          is blocked, configuration can switch the quote asset to{" "}
          {siteConfig.fallbackPair} without redesigning the site.
        </p>
      </section>

      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href="/thesis" className="text-[var(--accent)] hover:opacity-85">
          Thesis →
        </Link>
        <Link
          href="/terminal"
          className="text-[var(--text-muted)] hover:text-white"
        >
          Terminal
        </Link>
        <Link
          href="/risks"
          className="text-[var(--text-muted)] hover:text-white"
        >
          Risks
        </Link>
      </div>
    </PageShell>
  );
}
