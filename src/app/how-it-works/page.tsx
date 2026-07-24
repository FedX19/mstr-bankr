import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../../components/PageShell";
import { getQuoteAsset, siteConfig } from "../../lib/config";

export const metadata: Metadata = {
  title: `How It Works — ${siteConfig.projectName}`,
  description:
    "How the stock-paired Roaring Saylor market works: buy and sell mechanics, dynamic pool composition, and fees.",
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
        Roaring Saylor is a cultural meme token whose primary market is paired
        against tokenized {quote.symbol} exposure on {siteConfig.chain.chainName}.
      </p>

      <hr className="section-rule my-10" />

      <section className="prose-section">
        <h2>The primary pair</h2>
        <p>
          The market is{" "}
          <strong>
            {siteConfig.projectName} / tokenized {quote.symbol}
          </strong>
          . You trade the meme against tokenized {quote.symbol} — not against a
          holder-owned stock reserve.
        </p>
      </section>

      <section className="prose-section">
        <h2>When someone buys</h2>
        <ol>
          <li>Buyer supplies tokenized {quote.symbol}.</li>
          <li>The liquidity pool receives {quote.symbol}.</li>
          <li>The pool releases Roaring Saylor tokens.</li>
        </ol>
        <p>
          Result: tokenized {quote.symbol} enters the pool; meme tokens leave the
          pool.
        </p>
      </section>

      <section className="prose-section">
        <h2>When someone sells</h2>
        <ol>
          <li>Seller supplies Roaring Saylor tokens.</li>
          <li>The liquidity pool receives the meme tokens.</li>
          <li>The pool releases tokenized {quote.symbol}.</li>
        </ol>
        <p>
          Result: meme tokens enter the pool; tokenized {quote.symbol} leaves the
          pool.
        </p>
      </section>

      <section className="prose-section">
        <h2>Dynamic pool — not a treasury you own</h2>
        <p>
          {quote.symbol} exposure in the pool is <strong>dynamic</strong>. Buys
          can increase it; sells can decrease it. It is not a permanent
          holder-owned treasury.
        </p>
        <p>
          Tokenholders have <strong>no ownership claim</strong> over pool
          assets, no redemption rights, and no claim on creator fees.
        </p>
      </section>

      <section className="prose-section">
        <h2>Fees</h2>
        <p>
          Trading uses a {siteConfig.tradingFeeBps / 100}% swap fee under the
          standard launch structure. Creator fees belong to the project company
          and do not belong to tokenholders. There is no promise of buybacks,
          price support, or stock purchases for holders.
        </p>
      </section>

      <section className="prose-section">
        <h2>About Stock Tokens</h2>
        <p>
          Robinhood Stock Tokens provide economic exposure to a referenced
          security. They do not grant legal or beneficial ownership of the
          company. They are unavailable in the United States and other
          restricted jurisdictions.
        </p>
      </section>

      <section className="prose-section">
        <h2>Fair launch</h2>
        <ul>
          <li>No presale</li>
          <li>No creator allocation</li>
          <li>No creator vesting</li>
          <li>
            Network: {siteConfig.chain.chainName}
          </li>
        </ul>
      </section>

      <div className="card mt-8 border-[var(--accent-border)] bg-[var(--accent-soft)] p-6">
        <p className="text-sm text-[var(--text-muted)]">
          Prelaunch: no official token is live yet. When it launches, verify the
          contract on the{" "}
          <Link href="/transparency" className="link-accent">
            Transparency
          </Link>{" "}
          page before trading.
        </p>
      </div>
    </PageShell>
  );
}
