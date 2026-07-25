/**
 * Central project configuration.
 * Single source of truth for brand, launch status, pair/chain, and contracts.
 *
 * To switch quote asset if Bankr blocks MSTR:
 *   1. Set quoteAssetKey to "WETH" or "USDG"
 *   2. Optionally update pairStatus / hero copy via fields below
 * Do not evade platform eligibility, KYC, or geo rules.
 */

export type LaunchStatus =
  | "research"
  | "prelaunch"
  | "cleared"
  | "live"
  | "paused";

export type PairStatus =
  | "pending-bankr-approval"
  | "approved"
  | "fallback"
  | "live";

export type FallbackPair = "WETH" | "USDG";

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
 * Quote-asset registry. Primary pair uses quoteAssetKey.
 * Intended: MSTR. Fallbacks: WETH / USDG if Bankr blocks stock-pair path.
 */
export const quoteAssets = {
  MSTR: {
    symbol: "MSTR",
    name: "Strategy",
    displayName: "Tokenized MSTR",
    address: "0xec262a75e413fAfD0dF80480274532C79D42da09" as string | null,
    kind: "stock-token" as const,
    description:
      "Robinhood tokenized MSTR — economic exposure, not share ownership.",
  },
  WETH: {
    symbol: "WETH",
    name: "Wrapped Ether",
    displayName: "WETH",
    address: robinhoodChain.weth as string | null,
    kind: "crypto" as const,
    description: "Fallback quote if stock-paired launch is blocked.",
  },
  USDG: {
    symbol: "USDG",
    name: "USDG",
    displayName: "USDG",
    address: robinhoodChain.usdg as string | null,
    kind: "stable" as const,
    description: "Fallback quote if stock-paired launch is blocked.",
  },
  COIN: {
    symbol: "COIN",
    name: "Coinbase",
    displayName: "Tokenized COIN",
    address: null as string | null,
    kind: "stock-token" as const,
    description: "Secondary stock-token fallback.",
  },
} as const;

export type QuoteAssetKey = keyof typeof quoteAssets;

/** @deprecated use quoteAssets — kept for older imports */
export const stockTokens = quoteAssets;
export type StockTokenKey = QuoteAssetKey;

export const siteConfig = {
  projectName: "Roaring Stacker",
  ticker: "STACKR",
  communityName: "The Stackers",

  /** Main hero headline */
  mainHeadline: "THE STACK NEVER STOPS.",
  /** Primary brand phrase */
  primarySlogan: "WE LIKE THE STOCK.",
  tagline: "We like the stock.",
  thesisLine: "MSTR is the stock. Bitcoin is the stack.",
  creed: "Conviction before confirmation.",

  launchStatus: "live" as LaunchStatus,
  tradingEnabled: true,

  /** Pair / chain — switch without redesign */
  chainName: "Robinhood Chain",
  chainId: 4663,
  quoteAssetKey: "MSTR" as QuoteAssetKey,
  quoteAssetSymbol: "MSTR",
  pairStatus: "live" as PairStatus,
  fallbackPair: "WETH" as FallbackPair,

  metaTitle: "Roaring Stacker — The Stack Never Stops",
  metaDescription:
    "A Bitcoin-native meme built around the MSTR–Bitcoin capital flywheel. MSTR is the stock. Bitcoin is the stack.",

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
      "Roaring Stacker mascot — Treasury Lion with red headband and orange eyes in a Bitcoin trading command center",
    heroMobileAlt:
      "Roaring Stacker mascot — Treasury Lion portrait with red headband",
    tokenIconAlt:
      "Roaring Stacker token mark — Treasury Lion guardian with orange ring",
    mstrLogoAlt: "Tokenized MSTR mark",
    ogShareAlt: "Roaring Stacker — The Stack Never Stops. We like the stock.",
    vaultAlt: "Abstract Bitcoin treasury vault atmosphere",
  },

  chain: robinhoodChain,

  memeTokenAddress:
    "0x35B97a24b18B8b4e09cB43F7805740792Af43ba3" as string | null,
  /** Uniswap V4 pair id (DexScreener / pool identity) */
  poolId:
    "0xfc1fe65f39e60ae8da0f7444d4e2143b652a4f88bc91e4306fc45143ee2d64b6" as
      | string
      | null,
  /** Uniswap V4 PoolManager on Robinhood Chain */
  poolAddress: "0x8366a39CC670B4001A1121B8F6A443A643e40951" as string | null,
  feeBeneficiary:
    "0x1B37D3a72082029c44B35B604Ea473617580b69a" as string | null,
  deploymentTx:
    "0xa6271720ecec42b19edd31de2d4aacbef7178a8f4d3f9913c84014fbfaabf8c1" as
      | string
      | null,

  bankrUrl: "https://bankr.bot",
  /** Official buy / swap deep link (Bankr trade terminal) */
  bankrLaunchUrl:
    "https://bankr.bot/terminal/trade?out=0x35B97a24b18B8b4e09cB43F7805740792Af43ba3&chain=robinhood" as
      | string
      | null,
  dexscreenerUrl:
    "https://dexscreener.com/robinhood/0xfc1fe65f39e60ae8da0f7444d4e2143b652a4f88bc91e4306fc45143ee2d64b6" as
      | string
      | null,
  bankrBaseUrl: "https://bankr.bot",
  explorerUrl: robinhoodChain.explorerUrl,

  platformName: "Bankr",
  /** Optional flags / labels used by secondary pages */
  platformStatus: "live",
  jurisdictionNoticeEnabled: true,

  officialWebsite: "https://mstr-bankr.vercel.app",
  officialX: "https://x.com",
  officialTelegram: null as string | null,
  officialDiscord: null as string | null,
  officialGitHub: "https://github.com/FedX19/mstr-bankr",
  contactEmail: null as string | null,

  tradingFeeBps: 70,
  creatorFeeSharePct: 95,
  protocolFeeSharePct: 5,
  creatorAllocation: "none" as const,
  vesting: "none" as const,
  presale: "none" as const,

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

  nonAffiliation:
    "Roaring Stacker is an independent cultural project. It is not affiliated with, sponsored by, endorsed by or connected to Strategy Inc., Michael Saylor, Keith Gill, Robinhood Markets, Robinhood Assets (Jersey) Limited, Bankr, Doppler or their respective affiliates. All company names, ticker symbols and trademarks belong to their respective owners.",

  /** Short homepage risk blurb */
  riskStatementShort:
    "Roaring Stacker is a highly speculative cultural token. It does not represent MSTR, Bitcoin, Strategy equity, project revenue, or liquidity-pool ownership. The token and all related assets may lose all value. Tokenized-stock availability depends on jurisdiction and platform eligibility.",

  riskStatement:
    "Roaring Stacker is a highly speculative cultural token. It does not represent MSTR, Bitcoin, Strategy equity, project revenue, or liquidity-pool ownership. The token and all related assets may lose all value. Tokenized-stock availability depends on jurisdiction and platform eligibility. Robinhood Stock Tokens are tokenized debt securities that provide economic exposure to referenced securities but do not provide legal or beneficial ownership in the referenced companies. Users are responsible for determining their eligibility and complying with applicable laws.",

  statusMessages: {
    prelaunch:
      "PRELAUNCH — No official token is live. Verify all future contract information through this website and the official X account.",
    research:
      "PRELAUNCH — No official token is live. Verify all future contract information through this website and the official X account.",
    cleared:
      "Launching soon — Official contract will be published on this site and the official X account first.",
    live: "LIVE ON ROBINHOOD CHAIN — Verify the official contract before trading.",
    paused: "PAUSED — Trading is temporarily unavailable.",
  },

  /** Prelaunch mission milestones */
  missionMilestones: [
    "Launch $STACKR",
    "Establish the STACKR/MSTR pool",
    "Reach 10 tokenized MSTR in liquidity",
    "Reach $1M cumulative volume",
    "Reach $1M pool liquidity",
    "Become the leading MSTR market on Robinhood Chain",
  ] as const,
} as const;

export type SiteConfig = typeof siteConfig;

export function getQuoteAsset() {
  return quoteAssets[siteConfig.quoteAssetKey];
}

/** Effective quote symbol (follows key; override via quoteAssetSymbol when needed). */
export function getQuoteSymbol(): string {
  return getQuoteAsset().symbol;
}

export function getQuoteAssetAddress(): string | null {
  return getQuoteAsset().address;
}

export function getPairLabel(): string {
  return `$${siteConfig.ticker} / ${getQuoteAsset().displayName}`;
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

export function getBankrUrl(): string {
  return siteConfig.bankrLaunchUrl ?? siteConfig.bankrUrl;
}

export function explorerAddressUrl(address: string): string {
  return `${siteConfig.chain.explorerAddressBase}${address}`;
}

export function explorerTxUrl(txHash: string): string {
  return `${siteConfig.chain.explorerTxBase}${txHash}`;
}

export function strategyDataLabel(): string {
  const { strategy } = siteConfig;
  if (strategy.dataSource && strategy.dataAsOf) {
    return `Source: ${strategy.dataSource} · as of ${strategy.dataAsOf}`;
  }
  return strategy.dataNote;
}
