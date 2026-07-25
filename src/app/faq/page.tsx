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
  description: `Frequently asked questions about ${siteConfig.projectName}: thesis, proposed stock-paired mechanics, ownership, and contract verification.`,
};

export default function FaqPage() {
  const quote = getQuoteAsset();
  const name = siteConfig.projectName;

  const faqs: { q: string; a: string }[] = [
    {
      q: `Is ${name} actual MSTR?`,
      a: `No. ${name} is an independent cultural meme token. It is not Strategy stock and not a claim on Strategy shares.`,
    },
    {
      q: "Do holders own MSTR?",
      a: `No. Holders do not own Strategy shares, Robinhood ${quote.symbol} Stock Tokens, Bitcoin, liquidity-pool assets, or any portion of the project company.`,
    },
    {
      q: "Is the token backed by MSTR?",
      a: `No. A proposed primary market denominated in tokenized ${quote.symbol} is not the same as being “backed by” MSTR. The project token is not backed by MSTR. Pool composition would be dynamic and belong to the liquidity position, not to holders.`,
    },
    {
      q: "What happens when someone buys (if live)?",
      a: `Through the proposed pool, tokenized MSTR would enter the pool and ${name} would leave it.`,
    },
    {
      q: "What happens when someone sells (if live)?",
      a: `${name} would enter the pool and tokenized MSTR would leave it.`,
    },
    {
      q: "Can the MSTR balance in the pool go down?",
      a: `Yes. Sales would remove tokenized ${quote.symbol} from the pool. The balance is dynamic, not a permanent treasury.`,
    },
    {
      q: "Who owns the liquidity-pool assets?",
      a: `Economically, pool assets would belong to the liquidity position and pool mechanics. Individual ${name} holders have no ownership claim over pool assets.`,
    },
    {
      q: "Does every trade buy an actual share of Strategy?",
      a: "No. Ordinary users would trade existing secondary-market inventory of Stock Tokens. Primary issuance and redemption are limited to authorized participants. Nothing forces Robinhood to buy shares on each retail trade.",
    },
    {
      q: "Does a higher MSTR price force Strategy to buy Bitcoin?",
      a: "No. That is not automatic. Our flywheel is a thesis that depends on financing conditions, management decisions, Bitcoin prices, investor demand, and Strategy’s obligations.",
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
      a: "None planned. The intended launch is a fair launch with no presale, no creator allocation, and no creator vesting — subject to platform and legal confirmation.",
    },
    {
      q: "How do creator fees work?",
      a: `If trading goes live under a standard structure, a swap fee applies. Creator fees would belong to the project company, not to tokenholders. There are no promised buybacks, price floors, or permanent MSTR purchases for holders.`,
    },
    {
      q: `Is ${name} affiliated with Strategy or Michael Saylor?`,
      a: siteConfig.nonAffiliation,
    },
    {
      q: "Where do I verify the official contract?",
      a: `On the Transparency page and official channels only. Current status: ${getMemeContractDisplay()}. Do not trust any contract unless published on this official site and the official social account.`,
    },
    {
      q: "Is the token live?",
      a: "Not yet. The project is in prelaunch. There is no official token contract to trade.",
    },
    {
      q: "Can I lose money?",
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
        Straight answers. If something is proposed rather than live, we say so.
      </p>

      <hr className="section-rule my-10" />

      <div className="space-y-6">
        {faqs.map((item) => (
          <section key={item.q} className="prose-section !mb-6">
            <h2 className="!text-base">{item.q}</h2>
            <p>{item.a}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4 text-sm">
        <Link href="/thesis" className="text-[var(--accent)] hover:opacity-85">
          Full thesis →
        </Link>
        <Link href="/risks" className="text-[var(--text-muted)] hover:text-white">
          Risks
        </Link>
        <Link
          href="/transparency"
          className="text-[var(--text-muted)] hover:text-white"
        >
          Transparency
        </Link>
      </div>
    </PageShell>
  );
}
