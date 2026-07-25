/**
 * Dashboard data layer.
 * Prelaunch: null placeholders — never fabricate live values.
 * Post-launch: wire RPC / Bankr / oracles here.
 */

import { getQuoteAsset, isLive, siteConfig } from "./config";

export type DataSourceStatus = "ok" | "stale" | "error" | "not_live";

export type PoolSide = {
  symbol: string;
  units: number | null;
  usdValue: number | null;
  poolSharePct: number | null;
};

export type DashboardData = {
  token: {
    priceUsd: number | null;
    priceInStock: number | null;
    marketCapUsd: number | null;
    volume24hUsd: number | null;
    cumulativeVolumeUsd: number | null;
    holders: number | null;
    uniqueTraders: number | null;
    priceChange24hPct: number | null;
  };
  pool: {
    totalLiquidityUsd: number | null;
    meme: PoolSide;
    stock: PoolSide;
    ratio: number | null;
    change24hPct: number | null;
    change7dPct: number | null;
    netStockInflow24h: number | null;
    netStockOutflow24h: number | null;
  };
  fees: {
    totalCreatorFeesUsd: number | null;
    claimedUsd: number | null;
    unclaimedUsd: number | null;
    creatorSharePct: number;
    protocolSharePct: number;
    tradingFeeBps: number;
  };
  market: {
    btcHoldings: number | null;
    shortInterestFloatPct: number | null;
    cycleNote: string;
    stockSymbol: string;
    mstrPriceUsd: number | null;
    btcPriceUsd: number | null;
    mstrVsBtcRelativePct: number | null;
  };
  meta: {
    lastUpdated: string | null;
    source: string;
    status: DataSourceStatus;
    isLive: boolean;
  };
};

export function createEmptyDashboard(): DashboardData {
  const quote = getQuoteAsset();
  return {
    token: {
      priceUsd: null,
      priceInStock: null,
      marketCapUsd: null,
      volume24hUsd: null,
      cumulativeVolumeUsd: null,
      holders: null,
      uniqueTraders: null,
      priceChange24hPct: null,
    },
    pool: {
      totalLiquidityUsd: null,
      meme: {
        symbol: `$${siteConfig.ticker}`,
        units: null,
        usdValue: null,
        poolSharePct: null,
      },
      stock: {
        symbol: quote.symbol,
        units: null,
        usdValue: null,
        poolSharePct: null,
      },
      ratio: null,
      change24hPct: null,
      change7dPct: null,
      netStockInflow24h: null,
      netStockOutflow24h: null,
    },
    fees: {
      totalCreatorFeesUsd: null,
      claimedUsd: null,
      unclaimedUsd: null,
      creatorSharePct: siteConfig.creatorFeeSharePct,
      protocolSharePct: siteConfig.protocolFeeSharePct,
      tradingFeeBps: siteConfig.tradingFeeBps,
    },
    market: {
      btcHoldings: siteConfig.strategy.btcHoldings,
      shortInterestFloatPct: siteConfig.strategy.shortInterestFloatPct,
      cycleNote: "Data source pending.",
      stockSymbol: quote.symbol,
      mstrPriceUsd: null,
      btcPriceUsd: null,
      mstrVsBtcRelativePct: null,
    },
    meta: {
      lastUpdated: null,
      source: "prelaunch",
      status: "not_live",
      isLive: false,
    },
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  // Live adapters reserved — do not invent values.
  if (!isLive()) {
    return createEmptyDashboard();
  }
  return createEmptyDashboard();
}

/** Display helper for null metrics. */
export function pendingLabel(isLiveData: boolean): string {
  return isLiveData ? "Data pending" : "Not live";
}
