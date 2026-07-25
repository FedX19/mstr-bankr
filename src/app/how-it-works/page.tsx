import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../../components/PageShell";
import { getQuoteAsset, siteConfig } from "../../lib/config";

export const metadata: Metadata = {
  title: `How It Works — ${siteConfig.projectName}`,
  description: `How the proposed ${siteConfig.proposedPair} market would work: buy and sell mechanics, dynamic pool composition, and clear limits on what holders own.`,
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
        {siteConfig.projectName} is an independent cultural meme. The{" "}
        <strong>proposed</strong> primary market pairs it with tokenized{" "}
        {quote.symbol} exposure on {siteConfig.chain.chainName}. The pair is not
        yet confirmed. Launch remains subject to platform and legal approval.
      </p>

      <hr className="section-rule my-10" />

      <section className="prose-section">
        <h2>The proposed primary pair</h2>
        <p>
          <strong>{siteConfig.proposedPair}</strong>. You would trade the meme
          against tokenized {quote.symbol} — not against a holder-owned stock
          reserve.
        </p>
      </section>

      <section className="prose-section">
        <h2>When users buy</h2>
        <p>
          When users buy through the proposed pool, tokenized MSTR enters the
          pool and Roaring Stacker leaves it.
        </p>
      </section>

      <section className="prose-section">
        <h2>When users sell</h2>
        <p>
          When users sell, Roaring Stacker enters the pool and tokenized MSTR
          leaves it.
        </p>
      </section>

      <section className="prose-section">
        <h2>What this means</h2>
        <ul>
          <li>
            The MSTR balance is <strong>dynamic</strong>
          </li>
          <li>
            It is <strong>not a permanent treasury</strong>
          </li>
          <li>
            Holders <strong>do not own</strong> the MSTR in the pool
          </li>
          <li>
            The project token is <strong>not backed by MSTR</strong>
          </li>
          <li>
            The pair is <strong>not yet confirmed</strong>
          </li>
          <li>
            Launch remains subject to <strong>platform and legal approval</strong>
          </li>
        </ul>
      </section>

      <section className="prose-section">
        <h2>Fees (if live)</h2>
        <p>
          Under a standard launch structure, trading would use a swap fee.
          Creator fees would belong to the project company, not to
          tokenholders. There are no promised buybacks, dividends, price floors,
          or permanent MSTR purchases for holders.
        </p>
      </section>

      <section className="prose-section">
        <h2>Eligibility</h2>
        <p>
          Robinhood Stock Tokens are restricted in the United States and other
          jurisdictions. You are responsible for determining whether you can
          participate.
        </p>
      </section>

      <div className="card mt-10 border-[var(--accent-border)] bg-[var(--accent-soft)] p-5">
        <p className="text-sm text-[var(--text-muted)]">
          Prelaunch: no official token. Do not trust any contract unless
          published on this site and the official social account.
        </p>
        <Link
          href="/transparency"
          className="mt-3 inline-flex text-sm font-medium text-[var(--accent)] hover:opacity-85"
        >
          Transparency →
        </Link>
      </div>
    </PageShell>
  );
}
