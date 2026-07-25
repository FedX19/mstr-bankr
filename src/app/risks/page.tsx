import type { Metadata } from "next";
import { PageShell } from "../../components/PageShell";
import { getPairLabel, getQuoteAsset, siteConfig } from "../../lib/config";

export const metadata: Metadata = {
  title: `Risks — ${siteConfig.projectName}`,
  description: `Risk disclosures for ${siteConfig.projectName}: meme-token risk, MSTR and Bitcoin risk, Stock Token issuer risk, liquidity, oracle, smart-contract, regulatory and jurisdictional risk.`,
};

const riskCategories: { title: string; body: string }[] = [
  {
    title: "Meme-token risk",
    body: `${siteConfig.projectName} is a highly speculative cultural meme. It may lose some or all of its value. It provides no equity, debt, ownership, income, dividends, voting, redemption or liquidation rights.`,
  },
  {
    title: "Thesis risk",
    body: "The MSTR–Bitcoin capital-engine thesis may be wrong. A higher MSTR price does not automatically cause Strategy to raise capital or purchase Bitcoin. Financing, management decisions, Bitcoin prices, demand, and obligations all matter.",
  },
  {
    title: "MSTR market risk",
    body: "Tokenized MSTR tracks economic exposure to Strategy common stock. Equity prices can move sharply on Bitcoin price, capital markets activity, dilution, earnings, short interest and narrative shifts.",
  },
  {
    title: "Bitcoin risk",
    body: "Strategy's business and equity valuation are highly sensitive to Bitcoin. BTC volatility, regulatory changes and market structure risks transmit into MSTR and into any market denominated in tokenized MSTR.",
  },
  {
    title: "Stock Token issuer risk",
    body: "Robinhood Stock Tokens are tokenized debt securities issued by Robinhood Assets (Jersey) Limited. They do not grant legal or beneficial ownership in the referenced company. Issuer, custody, operational and legal risks apply.",
  },
  {
    title: "Liquidity risk",
    body: "Tokenized MSTR markets may be thin. Spreads, price impact and failed quotes can be severe. Illiquid pairs may prevent a healthy stock-paired launch or force a quote-asset fallback.",
  },
  {
    title: "Oracle risk",
    body: "Onchain pricing for Stock Tokens may rely on Chainlink and other feeds. Stale, delayed or disputed oracles can produce mispricing relative to the referenced equity.",
  },
  {
    title: "Smart-contract risk",
    body: "Pool, token and fee contracts can contain bugs or be exploited. Bridge, router and wallet software can fail. Users can lose funds permanently.",
  },
  {
    title: "Market-hours divergence",
    body: "Tokenized equities may trade while traditional markets are closed. Prices can diverge from the referenced security and reconverge when traditional markets open.",
  },
  {
    title: "Regulatory risk",
    body: "Securities, commodities, consumer-protection and tax regimes may change. Platform or issuer actions can restrict trading, transfers or access without notice. The proposed launch remains subject to legal review.",
  },
  {
    title: "Jurisdictional restrictions",
    body: "Robinhood Stock Tokens are not registered under U.S. securities laws and may not be offered, sold or delivered in the United States or to U.S. persons. Other jurisdictions may also restrict access. Users must determine their own eligibility.",
  },
  {
    title: "Counterparty risk",
    body: "Bankr, Doppler, Robinhood entities, market makers, RPC providers and data vendors are external counterparties. Failures or policy changes can affect the product. Platform support for a stock-paired launch is not confirmed.",
  },
  {
    title: "Creator-fee conflicts",
    body: "If live, creator fees would belong to the project company, not tokenholders. Fee beneficiaries may have incentives that differ from holders. There are no promised buybacks, price floors, or permanent MSTR purchases for holders.",
  },
  {
    title: "Website and data-source risk",
    body: "Dashboards can show stale, incomplete or incorrect data. Always verify contracts and balances onchain. Phishing sites and fake contracts are common. Research figures without a source and date are shown as data source pending.",
  },
  {
    title: "No permanent treasury / no MSTR backing",
    body: "Pool MSTR exposure would be dynamic. Sells reduce pool exposure. Holders do not own pool assets. The project token is not backed by MSTR. There is no promise of permanent MSTR accumulation for holders.",
  },
];

export default function RisksPage() {
  const quote = getQuoteAsset();

  return (
    <PageShell>
      <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
        Disclosures
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Risks
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--text-muted)]">
        Read carefully. {siteConfig.projectName} is not suitable for anyone who
        cannot afford total loss of capital.
      </p>

      <hr className="section-rule my-10" />

      <div className="card mb-10 border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.06)] p-5">
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">
          {siteConfig.riskStatement}
        </p>
      </div>

      {riskCategories.map((r) => (
        <section key={r.title} className="prose-section">
          <h2>{r.title}</h2>
          <p>{r.body}</p>
        </section>
      ))}

      <section className="prose-section">
        <h2>Non-affiliation</h2>
        <p>{siteConfig.nonAffiliation}</p>
      </section>

      <section className="prose-section">
        <h2>Primary market context</h2>
        <p>
          The proposed pair is {getPairLabel()}. Pair status:{" "}
          {siteConfig.pairStatus}. Fallback if Bankr blocks the stock-token
          path: {siteConfig.fallbackPair}. Any change flows through central
          configuration and public disclosure. Tokenized {quote.symbol} remains
          subject to issuer rules, Bankr eligibility, and jurisdictional limits.
          This site does not bypass platform checks.
        </p>
      </section>
    </PageShell>
  );
}
