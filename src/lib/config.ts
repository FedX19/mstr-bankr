/**
 * Central project configuration.
 * Single source of truth for brand, launch status, chain, contracts, and copy.
 */

export type LaunchStatus =
  | "research"
  | "prelaunch"
  | "cleared"
  | "live"
  | "paused";

export type TickerCandidate = "STACKR" | "STACK" | "ROAR";

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
    description:
      "Robinhood tokenized MSTR — economic exposure, not share ownership.",
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
  /** Required brand fields */
  projectName: "Roaring Stacker",
  ticker: "STACKR" as TickerCandidate,
  tickerCandidates: ["STACKR", "STACK", "ROAR"] as const,
  communityName: "The Stackers",
  primarySlogan: "WE LIKE THE STOCK.",
  /** Display form for headings that need sentence case */
  tagline: "We like the stock.",
  thesisLine: "MSTR is the stock. Bitcoin is the stack.",
  catalystLine: "The stock can restart the stack.",
  creed: "Conviction before confirmation.",

  launchStatus: "prelaunch" as LaunchStatus,
  tradingEnabled: false,
  jurisdictionNoticeEnabled: true,

  category: "Bitcoin-native cultural meme",
  secondarySlogan: "MSTR is the stock. Bitcoin is the stack.",
  supportingPhrase: "The stock can restart the stack.",
  positioning:
    "Roaring Stacker is an independent Bitcoin-native cultural meme built around the thesis that a recovery in MSTR could help reactivate Strategy’s capital engine and contribute to Bitcoin’s next major move.",
  metaDescription:
    "Roaring Stacker is an independent Bitcoin-native cultural meme built around the thesis that a recovery in MSTR could help reactivate Strategy’s capital engine and contribute to Bitcoin’s next major move.",
  metaTitle: "Roaring Stacker — MSTR Is the Stock. Bitcoin Is the Stack.",

  /** Brand assets in /public/brand — Treasury Lion mascot preserved */
  brand: {
    hero: "/brand/hero.png",
    heroMobile: "/brand/hero-mobile.png",
    tokenIcon: "/brand/token-icon.png",
    tokenIconTransparent: "/brand/token-icon-transparent.png",
    mstrLogo: "/brand/mstr-logo.png",
    ogShare: "/brand/og-share.png",
    favicon: "/brand/favicon.png",
    faviconIco: "/favicon.ico",
    appleTouchIcon: "/icons/apple-touch-icon.png",
    androidChrome192: "/icons/android-chrome-192.png",
    androidChrome512: "/icons/android-chrome-512.png",
    vaultAbstract: "/brand/vault-abstract.png",
    heroAlt:
      "Roaring Stacker mascot — Treasury Lion with red headband and orange eyes in a Bitcoin command center",
    heroMobileAlt:
      "Roaring Stacker mascot — Treasury Lion portrait with red headband",
    tokenIconAlt:
      "Roaring Stacker token mark — Treasury Lion guardian with orange ring",
    mstrLogoAlt: "Tokenized MSTR mark",
    ogShareAlt:
      "Roaring Stacker — We like the stock. MSTR is the stock. Bitcoin is the stack.",
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
  platformName: "Bankr",
  platformStatus: "subject to confirmation",

  officialWebsite: "https://mstr-bankr.vercel.app",
  officialX: "https://x.com",
  officialTelegram: null as string | null,
  officialDiscord: null as string | null,
  officialGitHub: "https://github.com/FedX19/mstr-bankr",
  contactEmail: null as string | null,

  /** Bankr standard fee structure (confirm for stock-paired before launch). */
  tradingFeeBps: 70,
  creatorFeeSharePct: 95,
  protocolFeeSharePct: 5,
  creatorAllocation: "none" as const,
  vesting: "none" as const,
  presale: "none" as const,

  /**
   * Research context — only publish figures with a source + date.
   * Otherwise UI shows “Data source pending.”
   */
  strategy: {
    ticker: "MSTR",
    name: "Strategy",
    btcHoldings: null as number | null,
    shortInterestFloatPct: null as number | null,
    shortSharesNote: null as string | null,
    shortInterestCallout: null as string | null,
    dataAsOf: null as string | null,
    dataSource: null as string | null,
    dataNote: "Data source pending.",
  },

  proposedPair: "Roaring Stacker / tokenized MSTR",
  chainStatus: "Robinhood Chain, subject to final approval",

  nonAffiliation:
    "Roaring Stacker is an independent cultural project. It is not affiliated with, sponsored by, endorsed by or connected to Strategy Inc., Michael Saylor, Keith Gill, Robinhood Markets, Robinhood Assets (Jersey) Limited, Bankr, Doppler or their respective affiliates. All company names, ticker symbols and trademarks belong to their respective owners.",

  riskStatement:
    "Roaring Stacker is a highly speculative cultural meme that may lose some or all of its value. It does not represent equity, debt, ownership, income, dividends, voting rights, redemption rights or claims against any company, security, liquidity pool or project asset. Robinhood Stock Tokens are tokenized debt securities that provide economic exposure to referenced securities but do not provide legal or beneficial ownership in the referenced companies. Stock Tokens are unavailable in the United States and other restricted jurisdictions. Users are responsible for determining their eligibility and complying with applicable laws.",

  statusMessages: {
    prelaunch:
      "PRELAUNCH — No official token is live. The proposed stock-paired launch remains subject to platform support, liquidity testing, jurisdictional eligibility, and legal review.",
    research:
      "PRELAUNCH — No official token is live. The proposed stock-paired launch remains subject to platform support, liquidity testing, jurisdictional eligibility, and legal review.",
    cleared:
      "Launching soon — Official contract will be published on this site and official social accounts first.",
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
  return siteConfig.memeTokenAddress ?? "Not available";
}

export function explorerAddressUrl(address: string): string {
  return `${siteConfig.chain.explorerAddressBase}${address}`;
}

export function explorerTxUrl(txHash: string): string {
  return `${siteConfig.chain.explorerTxBase}${txHash}`;
}

/** Research figures only when source + date exist. */
export function strategyDataLabel(): string {
  const { strategy } = siteConfig;
  if (strategy.dataSource && strategy.dataAsOf) {
    return `Source: ${strategy.dataSource} · as of ${strategy.dataAsOf}`;
  }
  return strategy.dataNote;
}
