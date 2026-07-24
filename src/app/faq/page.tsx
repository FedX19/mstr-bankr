import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../../components/PageShell";
import {
  getMemeContractDisplay,
  getQuoteAsset,
  siteConfig,
} from "../../lib/config";

export const metadata: Metadata = {
  title: `FAQ — ${siteConfig.projectName}`,
  description:
    "Frequently asked questions about Roaring Saylor: stock-paired mechanics, ownership, U.S. availability, creator fees and contract verification.",
};

export default function FaqPage() {
  const quote = getQuoteAsset();

  const faqs: { q: string; a: string }[] = [
    {
      q: "Is Roaring Saylor actual MSTR?",
      a: `No. Roaring Saylor is an independent cultural meme token. It is not Strategy stock and not a claim on Strategy shares.`,
    },
    {
      q: "Do holders own MSTR?",
      a: `No. Holders do not own Strategy shares, Robinhood ${quote.symbol} Stock Tokens, Bitcoin, liquidity-pool assets or any portion of the project company.`,
    },
    {
      q: "Is the token backed by MSTR?",
      a: `No. The primary market is denominated in tokenized ${quote.symbol} exposure via a liquidity pool. That is not the same as being "backed by" MSTR. Pool composition is dynamic and belongs to the liquidity position, not to holders.`,
    },
    {
      q: "What happens when someone buys?",
      a: `The buyer supplies tokenized ${quote.symbol}; the pool receives it and releases Roaring Saylor tokens. Tokenized ${quote.symbol} exposure in the pool increases.`,
    },
    {
      q: "What happens when someone sells?",
      a: `The seller supplies Roaring Saylor tokens; the pool receives them and releases tokenized ${quote.symbol}. Tokenized ${quote.symbol} exposure in the pool decreases.`,
    },
    {
      q: "Can the MSTR balance decline?",
      a: `Yes. Sales remove tokenized ${quote.symbol} from the pool. The balance is dynamic, not a permanent treasury.`,
    },
    {
      q: "Who owns the liquidity-pool assets?",
      a: `Economically, pool assets belong to the liquidity position and governing pool mechanics. Individual Roaring Saylor holders have no ownership claim over pool assets.`,
    },
    {
      q: "Does every trade cause Robinhood to purchase an actual share?",
      a: `No. Ordinary users interact with existing secondary-market inventory of Stock Tokens. Primary issuance and redemption are limited to authorized participants.`,
    },
    {
      q: "What are Robinhood Stock Tokens?",
      a: `ERC-20 tokenized debt securities issued by Robinhood Assets (Jersey) Limited. They provide economic exposure to a referenced security but do not grant legal or beneficial ownership in the referenced company.`,
    },
    {
      q: "Can U.S. users trade the MSTR pair?",
      a: `Robinhood Stock Tokens are not registered under U.S. securities laws and may not be offered, sold or delivered in the United States or to U.S. persons. Stock-paired trading will not be enabled for restricted jurisdictions. Users must determine their own eligibility.`,
    },
    {
      q: "Does the creator hold an allocation?",
      a: `No. The intended launch disables creator allocation and creator vesting. Fair launch: no presale, no founder unlock overhang.`,
    },
    {
      q: "How are creator fees calculated?",
      a: `Bankr's standard structure uses a ${siteConfig.tradingFeeBps / 100}% swap fee, with ${siteConfig.creatorFeeSharePct}% of the creator-fee portion to the beneficiary and ${siteConfig.protocolFeeSharePct}% to Doppler. Exact fee denomination for stock-paired pools requires Bankr written confirmation. Fees belong to the project company, not tokenholders.`,
    },
    {
      q: "Is Roaring Saylor affiliated with Strategy or Michael Saylor?",
      a: siteConfig.nonAffiliation,
    },
    {
      q: "Where can users verify the official contract?",
      a: `On the Transparency page and official social channels after launch. Current status: ${getMemeContractDisplay()}. Do not purchase any contract claiming to represent this project during prelaunch.`,
    },
    {
      q: "Can the token go to zero?",
      a: `Yes. It is highly speculative. Prices may fall to zero. There is no price floor, no guaranteed liquidity addition and no holder claim on pool assets.`,
    },
  ];

  return (
    <PageShell>
      <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
        FAQ
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Frequently asked questions
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--text-muted)]">
        Straight answers. No hype. No affiliation claims.
      </p>

      <hr className="section-rule my-10" />

      <div>
        {faqs.map((item) => (
          <div key={item.q} className="faq-item">
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
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
        <Link
          href="/transparency"
          className="text-sm font-medium text-[var(--accent)] hover:opacity-85"
        >
          Transparency →
        </Link>
      </div>
    </PageShell>
  );
}
