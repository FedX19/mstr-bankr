/**
 * Site configuration — update these after token launch.
 * All external links and on-chain addresses live here.
 */
export const siteConfig = {
  name: "Roaring Saylor",
  tagline: "We like the stock.",
  thesisOneLiner:
    "Strategy is a Bitcoin accumulation vehicle with operating leverage to BTC — and the market still prices it like a levered meme.",
  feeAllocationPct: 60,

  // Update when live
  contractAddress: "TBA",
  bankrUrl: "https://bankr.bot",
  xUrl: "https://x.com",
  githubUrl: "https://github.com/FedX19/mstr-bankr",
  // Optional: basescan / explorer base for tx links
  explorerTxBase: "https://basescan.org/tx/",

  // Strategy (MSTR) facts — update as holdings / short interest change
  strategy: {
    ticker: "MSTR",
    name: "Strategy",
    btcHoldings: 843_775,
    shortInterestFloatPct: 13,
    shortSharesNote: "over 42 million shares",
    shortInterestCallout:
      "Most recently ~13% of the float (over 42 million shares). At points it ranked as the most shorted large-cap stock in America by short interest as % of market cap.",
  },
} as const;

export type SiteConfig = typeof siteConfig;
