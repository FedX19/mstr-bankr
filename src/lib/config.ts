/**
 * Central project configuration.
 * Single source of truth for launch status, chain, contracts, and brand copy.
 * Change the quote stock here — the rest of the site reads from this file.
 */

export type LaunchStatus =
  | "research"
  | "prelaunch"
  | "cleared"
  | "live"
  | "paused";

export type TickerCandidate = "ROAR" | "SAYLOR" | "BID" | "STACK";

/** Canonical Robinhood Chain assets — verify against live registry before deploy. */
export const robinhoodChain = {
  chainId: 4663,
  chainName: "Robinhood Chain",
  currency: "ETH",
  rpcUrl: "https://rpc.mainnet.chain.robinhood.com/",
  explorerUrl: "https://robinhoodchain.blockscout.com/",
  explorerTxBase: "https://robinhoodchain.blockscout.com/tx/",
  explorerAddressBase: "https://robinhoodchain.blockscout.com/address/",
  testnetChainId: 46630,
  weth: "0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73",
  usdg: "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168",
} as const;

/**
 * Quote-asset registry. Primary pair uses the selected key.
 * Fallback hierarchy: MSTR → COIN → PLTR → TSLA.
 */
export const stockTokens = {
  MSTR: {
    symbol: "MSTR",
    name: "Strategy",
    displayName: "MSTR Stock Token",
    address: "0xec262a75e413fAfD0dF80480274532C79D42da09",
    description: "Robinhood tokenized MSTR — economic exposure, not share ownership.",
  },
  COIN: {
    symbol: "COIN",
    name: "Coinbase",
    displayName: "COIN Stock Token",
    address: null as string | null,
    description: "Fallback quote asset if MSTR fails liquidity gates.",
  },
  PLTR: {
    symbol: "PLTR",
    name: "Palantir",
    displayName: "PLTR Stock Token",
    address: null as string | null,
    description: "Secondary fallback quote asset.",
  },
  TSLA: {
    symbol: "TSLA",
    name: "Tesla",
    displayName: "TSLA Stock Token",
    address: null as string | null,
    description: "Tertiary fallback quote asset.",
  },
} as const;

export type StockTokenKey = keyof typeof stockTokens;

export const siteConfig = {
  projectName: "Roaring Saylor",
  /** Temporary until brand/ticker availability is verified. */
  ticker: "ROAR" as TickerCandidate,
  tickerCandidates: ["ROAR", "SAYLOR", "BID", "STACK"] as const,

  launchStatus: "prelaunch" as LaunchStatus,
  tradingEnabled: false,
  jurisdictionNoticeEnabled: true,

  category: "Stock-paired Bitcoin treasury meme",
  tagline: "We like the stock.",
  secondarySlogan: "A Bitcoin treasury meme, denominated in MSTR.",
  supportingPhrase: "The bid never sleeps.",
  positioning:
    "Roaring Saylor is an independent cultural meme whose primary market is denominated in tokenized MSTR exposure.",

  /** Brand assets in /public/brand */
  brand: {
    hero: "/brand/hero.png",
    heroMobile: "/brand/hero-mobile.png",
    tokenIcon: "/brand/token-icon.png",
    tokenIconTransparent: "/brand/token-icon-transparent.png",
    mstrLogo: "/brand/mstr-logo.png",
    ogShare: "/brand/og-share.png",
    /** Master mark; generated sizes live under /icons and app/ */
    favicon: "/brand/favicon.png",
    faviconIco: "/favicon.ico",
    appleTouchIcon: "/icons/apple-touch-icon.png",
    androidChrome192: "/icons/android-chrome-192.png",
    androidChrome512: "/icons/android-chrome-512.png",
    vaultAbstract: "/brand/vault-abstract.png",
    heroAlt:
      "Roaring Saylor mascot — lion trader in a Bitcoin treasury command center",
    heroMobileAlt:
      "Roaring Saylor mascot — lion portrait in a Bitcoin treasury command center",
    tokenIconAlt: "Roaring Saylor token mark — lion guardian with orange ring",
    mstrLogoAlt: "Tokenized MSTR mark",
    ogShareAlt:
      "Roaring Saylor — We like the stock. A Bitcoin treasury meme denominated in MSTR.",
    vaultAlt: "Abstract Bitcoin treasury vault atmosphere",
  },

  /** Selected quote asset — change this key to re-point the entire site. */
  quoteAssetKey: "MSTR" as StockTokenKey,

  chain: robinhoodChain,

  /** Official meme token — null until launch. Never invent an address. */
  memeTokenAddress: null as string | null,
  poolId: null as string | null,
  poolAddress: null as string | null,
  feeBeneficiary: null as string | null,
  deploymentTx: null as string | null,

  bankrLaunchUrl: null as string | null,
  bankrBaseUrl: "https://bankr.bot",

  /** Production deployment until a custom domain is reserved. */
  officialWebsite: "https://mstr-bankr.vercel.app",
  /** Update when the project-owned handle is reserved and verified. */
  officialX: "https://x.com",
  officialTelegram: null as string | null,
  officialDiscord: null as string | null,
  officialGitHub: "https://github.com/FedX19/mstr-bankr",
  contactEmail: null as string | null,

  /** Bankr standard fee structure (confirm for stock-paired before launch). */
  tradingFeeBps: 70, // 0.7%
  creatorFeeSharePct: 95,
  protocolFeeSharePct: 5,
  creatorAllocation: "none" as const,
  vesting: "none" as const,
  presale: "none" as const,

  strategy: {
    ticker: "MSTR",
    name: "Strategy",
    /** Research context only — refresh from filings before publishing claims. */
    btcHoldings: 843_775,
    shortInterestFloatPct: 13,
    shortSharesNote: "over 42 million shares",
    shortInterestCallout:
      "Most recently ~13% of the float (over 42 million shares). At points it ranked as the most shorted large-cap stock in America by short interest as % of market cap.",
    dataAsOf: "2026-07-24",
  },

  nonAffiliation:
    "Roaring Saylor is an independent cultural project. It is not affiliated with, sponsored by, endorsed by or connected to Strategy Inc., Michael Saylor, Keith Gill, Robinhood Markets, Robinhood Assets (Jersey) Limited, Bankr, Doppler or their respective affiliates. All company names, ticker symbols and trademarks belong to their respective owners.",

  riskStatement:
    "Roaring Saylor is a highly speculative cultural token that may lose some or all of its value. It does not represent equity, debt, ownership, income, dividends, voting rights, redemption rights or claims against any company, security, liquidity pool or project asset. Robinhood Stock Tokens are tokenized debt securities that provide economic exposure to referenced securities but do not provide legal or beneficial ownership in the referenced companies. Stock Tokens are unavailable in the United States and other restricted jurisdictions. Users are responsible for determining their eligibility and complying with applicable laws.",

  statusMessages: {
    prelaunch:
      "PRELAUNCH — No official token is live. Do not purchase contracts claiming to represent this project.",
    research:
      "PRELAUNCH — No official token is live. Do not purchase contracts claiming to represent this project.",
    cleared:
      "Launching soon — Official contract will be published on this site first.",
    live: "LIVE ON ROBINHOOD CHAIN — Verify the contract on this site before trading.",
    paused: "PAUSED — Trading is temporarily unavailable.",
  },
} as const;

export type SiteConfig = typeof siteConfig;

export function getQuoteAsset() {
  return stockTokens[siteConfig.quoteAssetKey];
}

export function isLive(): boolean {
  return siteConfig.launchStatus === "live" && siteConfig.tradingEnabled;
}

export function isPrelaunch(): boolean {
  return (
    siteConfig.launchStatus === "prelaunch" ||
    siteConfig.launchStatus === "research"
  );
}

export function getMemeContractDisplay(): string {
  return siteConfig.memeTokenAddress ?? "Not live";
}

export function explorerAddressUrl(address: string): string {
  return `${siteConfig.chain.explorerAddressBase}${address}`;
}

export function explorerTxUrl(txHash: string): string {
  return `${siteConfig.chain.explorerTxBase}${txHash}`;
}
