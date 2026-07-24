import type { Metadata } from "next";
import { PageShell } from "../../components/PageShell";
import { getQuoteAsset, siteConfig } from "../../lib/config";

export const metadata: Metadata = {
  title: `How It Works — ${siteConfig.projectName}`,
  description:
    "How the stock-paired Roaring Saylor market works: buy and sell mechanics, dynamic pool composition, creator fees, and why holders have no claim on pool assets.",
};

export default function HowItWorksPage() {
  const quote = getQuoteAsset();

  return (
    <PageShell>
      <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
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
          The intended primary market is{" "}
          <strong>
            {siteConfig.projectName} / Robinhood {quote.symbol} Stock Token
          </strong>
          . Buyers and sellers trade the meme against tokenized {quote.symbol},
          not against a fictional holder-owned reserve.
        </p>
      </section>

      <section className="prose-section">
        <h2>Buy mechanics</h2>
        <ol>
          <li>Buyer supplies tokenized {quote.symbol}.</li>
          <li>The liquidity pool receives {quote.symbol}.</li>
          <li>The pool releases Roaring Saylor tokens to the buyer.</li>
        </ol>
        <p>
          Result: tokenized {quote.symbol} enters the pool; meme tokens leave the
          pool.
        </p>
      </section>

      <section className="prose-section">
        <h2>Sell mechanics</h2>
        <ol>
          <li>Seller supplies Roaring Saylor tokens.</li>
          <li>The liquidity pool receives the meme tokens.</li>
          <li>The pool releases tokenized {quote.symbol} to the seller.</li>
        </ol>
        <p>
          Result: meme tokens enter the pool; tokenized {quote.symbol} leaves the
          pool.
        </p>
      </section>

      <section className="prose-section">
        <h2>Dynamic pool composition</h2>
        <p>
          {quote.symbol} exposure inside the pool is{" "}
          <strong>dynamic</strong>. It can increase when users purchase the meme
          and decrease when users sell. It is not a permanent treasury and not a
          reserve owned by tokenholders.
        </p>
        <p>
          Accurate description: trading Roaring Saylor changes the amount of
          tokenized {quote.symbol} exposure held by the primary liquidity pool.
        </p>
        <p>
          Prohibited description: every buy permanently purchases {quote.symbol}{" "}
          for holders.
        </p>
      </section>

      <section className="prose-section">
        <h2>Who owns pool assets?</h2>
        <p>
          The {quote.displayName}s in the pool belong economically to the
          liquidity position and its governing pool mechanics. Individual Roaring
          Saylor holders have <strong>no ownership claim</strong> over pool
          assets, no redemption rights, and no claim on creator fees.
        </p>
      </section>

      <section className="prose-section">
        <h2>Creator fees</h2>
        <p>
          Bankr&apos;s standard Uniswap V4 launch currently applies a{" "}
          {siteConfig.tradingFeeBps / 100}% swap fee. Of the creator-fee portion,{" "}
          {siteConfig.creatorFeeSharePct}% goes to the designated beneficiary and{" "}
          {siteConfig.protocolFeeSharePct}% to the Doppler protocol. Creator fees
          belong to the project company and do not belong to tokenholders.
        </p>
        <p>
          Fee denomination for stock-paired pools is not assumed; written Bankr
          confirmation is required before launch. There is no promise that fees
          buy {quote.symbol}, support price, or distribute revenue to holders.
        </p>
      </section>

      <section className="prose-section">
        <h2>Stock-paired vs treasury-backed</h2>
        <p>
          A stock-paired meme embeds the relationship with {quote.symbol} in the
          liquidity pool itself. It does not claim a permanent, holder-owned
          treasury of stock. It does not recycle a discretionary percentage of
          fees into stock purchases. Pool composition is visible onchain and
          changes with trading flow.
        </p>
      </section>

      <section className="prose-section">
        <h2>Stock Token issuer risk</h2>
        <p>
          Robinhood Stock Tokens are ERC-20 tokenized debt securities issued by
          Robinhood Assets (Jersey) Limited. They provide economic exposure to a
          referenced security but do not grant legal or beneficial ownership
          rights in the referenced company. Ordinary users interact with
          secondary-market inventory; authorized participants handle primary
          issuance and redemption.
        </p>
        <p>
          Stock Tokens are unavailable in the United States and other restricted
          jurisdictions.
        </p>
      </section>

      <section className="prose-section">
        <h2>Fair-launch configuration</h2>
        <ul>
          <li>
            <strong>Chain:</strong> {siteConfig.chain.chainName} (ID{" "}
            {siteConfig.chain.chainId})
          </li>
          <li>
            <strong>Primary quote:</strong> Canonical {quote.symbol} Stock Token
          </li>
          <li>
            <strong>Presale:</strong> None
          </li>
          <li>
            <strong>Creator allocation:</strong> None
          </li>
          <li>
            <strong>Creator vesting:</strong> Disabled
          </li>
          <li>
            <strong>Fee beneficiary:</strong> Project multisig (subject to Bankr
            approval)
          </li>
        </ul>
        <p>
          See the{" "}
          <a href="/roadmap" className="link-accent">
            roadmap
          </a>{" "}
          for gates that must clear before any deployment.
        </p>
      </section>

      <div className="card mt-8 border-[var(--accent-border)] bg-[var(--accent-soft)] p-6">
        <p className="text-sm text-[var(--text-muted)]">
          Fair launch intended: no presale, no creator allocation, no creator
          vesting. Status remains prelaunch until Bankr, liquidity and legal
          gates clear. No official contract is live.
        </p>
      </div>
    </PageShell>
  );
}
