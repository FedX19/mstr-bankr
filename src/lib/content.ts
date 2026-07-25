/**
 * Consumer-facing product and thesis copy.
 * Internal launch ops stay out of the public app.
 */

import { siteConfig } from "./config";

export const productIs = [
  "An independent Bitcoin-native cultural meme",
  "A proposed onchain market paired with tokenized MSTR exposure",
  "A public site for the MSTR–Bitcoin capital-engine thesis",
  "A community surface for The Stackers",
  "Transparent about what is live, what is proposed, and what is not guaranteed",
] as const;

export const productIsNot = [
  "Strategy stock or Bitcoin",
  "A share in the project company",
  "Redeemable for MSTR",
  "Backed by a holder-owned MSTR reserve",
  "A claim on pool assets, dividends, income, or voting rights",
  "Affiliated with Strategy, Michael Saylor, Keith Gill, Robinhood, or Bankr",
] as const;

export const publicTimeline = [
  {
    id: "now",
    label: "Now",
    status: "current" as const,
    title: "Prelaunch",
    body: `The site, thesis, and product design are live. There is no official token yet. Do not buy contracts that claim to be ${siteConfig.projectName}.`,
  },
  {
    id: "launch",
    label: "Next",
    status: "next" as const,
    title: "Proposed fair launch",
    body: "If platform, legal, liquidity, and eligibility gates clear, the intended primary market pairs Roaring Stacker with tokenized MSTR. No presale and no creator allocation are planned.",
  },
  {
    id: "live",
    label: "Then",
    status: "later" as const,
    title: "Live market (if approved)",
    body: "A public dashboard for price, pool composition, and verified contracts — so you can check everything onchain. Nothing is live until published here.",
  },
] as const;

export const feePolicyPublic = {
  summary:
    "If trading goes live, creator fees would come from the pool’s swap fee under the standard launch structure. Fees would belong to the project and would not belong to tokenholders. There are no promised buybacks, dividends, price floors, or permanent stock purchases for holders.",
  highlights: [
    "No presale planned",
    "No creator token allocation planned",
    "No creator vesting planned",
    "Public contracts only after launch",
  ],
} as const;

export const whatToExpect = [
  {
    title: "Official contract only",
    body: `Until launch, any token claiming to be ${siteConfig.projectName} is unofficial. After launch, verify the address on this site and official social accounts before you trade.`,
  },
  {
    title: "Proposed stock-paired market",
    body: "Buying would add tokenized MSTR exposure to the pool. Selling would remove it. Pool balances would change with trading — they are not a permanent treasury you own.",
  },
  {
    title: "Eligibility matters",
    body: "Robinhood Stock Tokens are restricted in the United States and other jurisdictions. You are responsible for knowing whether you can participate.",
  },
] as const;

/** Potential MSTR → Bitcoin flywheel (thesis, not a guarantee). */
export const flywheelSteps = [
  {
    id: "mstr",
    title: "MSTR Strength",
    body: "MSTR may strengthen relative to the market’s current discount of the capital engine.",
  },
  {
    id: "access",
    title: "Access to Capital",
    body: "Strategy may gain better access to equity and credit markets if the stock recovers.",
  },
  {
    id: "btc-buy",
    title: "Potential BTC Purchases",
    body: "Management may raise capital and deploy some of it into Bitcoin.",
  },
  {
    id: "demand",
    title: "Bitcoin Demand",
    body: "Bitcoin may receive incremental demand and attention from those purchases.",
  },
  {
    id: "btc-up",
    title: "BTC Appreciation",
    body: "Bitcoin appreciation may increase the value of Strategy’s holdings.",
  },
  {
    id: "asset",
    title: "MSTR Asset Value",
    body: "Higher treasury value may support MSTR’s equity narrative and attract demand.",
  },
] as const;

export const flywheelDisclaimer =
  "A higher MSTR price does not automatically cause Strategy to raise capital or purchase Bitcoin. The potential flywheel depends on financing conditions, management decisions, Bitcoin prices, investor demand, and Strategy’s obligations.";

export const thesisSummaryBullets = [
  "Our thesis: the market may be underestimating the relationship between MSTR, Strategy’s access to capital, and future Bitcoin demand.",
  "MSTR is the stock. Bitcoin is the stack. The stock may be capable of restarting the stack.",
  "This is a thesis, not a guaranteed causal chain. Use careful words: may, could, if.",
  "The proposed product is a cultural market around that debate — not equity in Strategy and not a claim on Bitcoin.",
] as const;

export const marketMissingPoints = [
  {
    title: "Capital engine, not only a beta proxy",
    body: "MSTR is often treated as a pure levered Bitcoin bet. Our thesis is that Strategy’s ability to raise capital in public markets may matter as much as spot beta — if financing conditions allow.",
  },
  {
    title: "Attention and narrative still move capital",
    body: "Bitcoin demand is not only mechanical. Corporate treasury narratives, equity flows, and cultural attention can reinforce one another when confidence returns.",
  },
  {
    title: "Both legs may be underpriced together",
    body: "Bitcoin has been written off by parts of the market. MSTR’s capital engine has been written off by others. Our thesis is that the market may have both wrong at the same time.",
  },
] as const;

export const bullCase = [
  "MSTR strengthens and Strategy regains flexible access to equity and credit.",
  "Management raises capital on terms it finds acceptable and deploys a portion into Bitcoin.",
  "Incremental corporate demand and attention support Bitcoin’s bid.",
  "Bitcoin appreciation increases the value of Strategy’s holdings and may attract further equity demand.",
  "The cultural market around the thesis finds durable community participation among The Stackers.",
] as const;

export const bearCase = [
  "Bitcoin makes sustained new lows and treasury narratives lose credibility.",
  "MSTR underperforms Bitcoin even if BTC stabilizes.",
  "Financing remains expensive or unavailable; preferred dividends and interest reduce flexibility.",
  "Strategy issues equity on unattractive terms or sells meaningful Bitcoin.",
  "MSTR’s valuation premium compresses; tokenized MSTR liquidity remains insufficient for a healthy pair.",
] as const;

export const invalidationConditions = [
  "Bitcoin makes sustained new lows that break the treasury model’s credibility.",
  "MSTR underperforms Bitcoin in a way that severs the capital-engine narrative.",
  "Financing remains expensive or unavailable for a prolonged period.",
  "Strategy issues equity on persistently unattractive terms.",
  "Preferred dividends and interest obligations reduce flexibility enough to dominate the story.",
  "Strategy sells meaningful Bitcoin without a clear capital-stack rationale the market accepts.",
  "MSTR’s valuation premium compresses and stays compressed.",
  "Tokenized MSTR liquidity remains insufficient for the proposed stock-paired market.",
] as const;

export const homepageFaq = [
  {
    q: "Is Roaring Stacker actual MSTR?",
    a: "No. Roaring Stacker is an independent cultural meme. It is not Strategy stock and not a claim on Strategy shares.",
  },
  {
    q: "Do holders own the MSTR in the pool?",
    a: "No. Holders would not own Strategy shares, tokenized MSTR in a pool, Bitcoin, or any project claim. Pool balances would be dynamic and belong to the liquidity position.",
  },
  {
    q: "Is the token backed by MSTR?",
    a: "No. A stock-paired market is not the same as a backed or reserved token. The project token is not backed by MSTR.",
  },
  {
    q: "Is a token live?",
    a: `Yes. Official contract: ${siteConfig.memeTokenAddress ?? "see Terminal"}. Verify only on this site and the official X account. Do not trust copycats.`,
  },
  {
    q: "Does a higher MSTR price force Bitcoin buys?",
    a: "No. That is not automatic. Our flywheel is a thesis that depends on financing, management decisions, Bitcoin prices, demand, and obligations.",
  },
] as const;
