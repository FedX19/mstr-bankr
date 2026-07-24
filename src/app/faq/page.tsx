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
    "Frequently asked questions about Roaring Saylor: stock-paired mechanics, ownership, availability, fees, and contract verification.",
};

export default function FaqPage() {
  const quote = getQuoteAsset();

  const faqs: { q: string; a: string }[] = [
    {
      q: "Is Roaring Saylor actual MSTR?",
      a: "No. Roaring Saylor is an independent cultural meme token. It is not Strategy stock and not a claim on Strategy shares.",
    },
    {
      q: "Do holders own MSTR?",
      a: `No. Holders do not own Strategy shares, Robinhood ${quote.symbol} Stock Tokens, Bitcoin, liquidity-pool assets, or any portion of the project company.`,
    },
    {
      q: "Is the token backed by MSTR?",
      a: `No. The primary market is denominated in tokenized ${quote.symbol} through a liquidity pool. That is not the same as being “backed by” MSTR. Pool composition is dynamic and belongs to the liquidity position, not to holders.`,
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
      q: "Can the MSTR balance in the pool go down?",
      a: `Yes. Sales remove tokenized ${quote.symbol} from the pool. The balance is dynamic, not a permanent treasury.`,
    },
    {
      q: "Who owns the liquidity-pool assets?",
      a: "Economically, pool assets belong to the liquidity position and pool mechanics. Individual Roaring Saylor holders have no ownership claim over pool assets.",
    },
    {
      q: "Does every trade buy an actual share of Strategy?",
      a: "No. Ordinary users trade existing secondary-market inventory of Stock Tokens. Primary issuance and redemption are limited to authorized participants.",
    },
    {
      q: "What are Robinhood Stock Tokens?",
      a: "They are tokenized products that provide economic exposure to a referenced stock. They do not grant legal or beneficial ownership of the company itself.",
    },
    {
      q: "Can U.S. users trade the MSTR pair?",
      a: "Robinhood Stock Tokens are not available in the United States or to U.S. persons. Other jurisdictions may also be restricted. You must determine your own eligibility.",
    },
    {
      q: "Is there a presale or creator allocation?",
      a: "No. The intended launch is a fair launch with no presale, no creator allocation, and no creator vesting.",
    },
    {
      q: "How do creator fees work?",
      a: `Trading uses a ${siteConfig.tradingFeeBps / 100}% swap fee under the standard launch structure. Creator fees belong to the project company, not to tokenholders. There are no promised buybacks or dividends.`,
    },
    {
      q: "Is Roaring Saylor affiliated with Strategy or Michael Saylor?",
      a: siteConfig.nonAffiliation,
    },
    {
      q: "Where do I verify the official contract?",
      a: `On the Transparency page and official channels only. Current status: ${getMemeContractDisplay()}. During prelaunch, do not purchase any token claiming to represent this project.`,
    },
    {
      q: "Is the token live?",
      a: "Not yet. The project is in prelaunch. There is no official token contract to trade. Follow this site for the official launch announcement.",
    },
    {
      q: "Can the token go to zero?",
      a: "Yes. It is highly speculative. Prices may fall to zero. There is no price floor and no holder claim on pool assets.",
    },
  ];

  return (
    <PageShell>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
        FAQ
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Frequently asked questions
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--text-muted)]">
        Straight answers. No hype.
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
