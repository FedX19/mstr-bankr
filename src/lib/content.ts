/**
 * Consumer-facing product copy only.
 * Internal launch ops stay out of the public app.
 */

export const productIs = [
  "A cultural meme token",
  "An onchain market paired with tokenized MSTR exposure",
  "A public dashboard for pool mechanics and market data",
  "A research surface covering MSTR and Bitcoin",
  "An independent project with transparent creator fees",
] as const;

export const productIsNot = [
  "Strategy stock or Bitcoin",
  "A share in the project company",
  "Redeemable for MSTR",
  "Backed by a holder-owned MSTR reserve",
  "A claim on pool assets, dividends, income, or voting rights",
  "Affiliated with Strategy, Michael Saylor, Keith Gill, Robinhood, or Bankr",
] as const;

/** Simple public timeline — what visitors should expect, not internal ops. */
export const publicTimeline = [
  {
    id: "now",
    label: "Now",
    status: "current" as const,
    title: "Prelaunch",
    body: "The site, thesis, and product design are live. There is no official token yet. Do not buy contracts that claim to be Roaring Saylor.",
  },
  {
    id: "launch",
    label: "Next",
    status: "next" as const,
    title: "Fair launch",
    body: "When the official token goes live, it will be a fair launch: no presale, no creator allocation, no vesting. The primary market pairs the meme with tokenized MSTR.",
  },
  {
    id: "live",
    label: "Then",
    status: "later" as const,
    title: "Live market",
    body: "A public dashboard for price, pool composition, fees, and verified contracts — so you can check everything onchain.",
  },
] as const;

export const feePolicyPublic = {
  summary:
    "When trading is live, creator fees come from the pool’s swap fee. Fees belong to the project and do not belong to tokenholders. There are no promised buybacks, dividends, or permanent stock purchases for holders.",
  highlights: [
    "No presale",
    "No creator token allocation",
    "No creator vesting",
    "Public contracts after launch",
  ],
} as const;

export const whatToExpect = [
  {
    title: "Official contract only",
    body: "Until launch, any token claiming to be Roaring Saylor is unofficial. After launch, verify the address on this site before you trade.",
  },
  {
    title: "Stock-paired market",
    body: "Buying adds tokenized MSTR exposure to the pool. Selling removes it. Pool balances change with trading — they are not a permanent treasury you own.",
  },
  {
    title: "Eligibility matters",
    body: "Robinhood Stock Tokens are restricted in the United States and other jurisdictions. You are responsible for knowing whether you can participate.",
  },
] as const;
