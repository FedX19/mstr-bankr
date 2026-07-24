/**
 * Dashboard data layer for the stock-paired market.
 *
 * Prelaunch: null / zero placeholders — never fabricate live values in production.
 * Post-launch: wire Robinhood Chain RPC, Bankr fee API, Blockscout, Chainlink.
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
    holders: number | null;
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
    btcHoldings: number;
    shortInterestFloatPct: number;
    cycleNote: string;
    stockSymbol: string;
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
      holders: null,
      priceChange24hPct: null,
    },
    pool: {
      totalLiquidityUsd: null,
      meme: {
        symbol: siteConfig.projectName,
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
      cycleNote:
        "Strategy is a high-profile Bitcoin treasury stock. Narratives and numbers change — treat research figures as snapshots, not live signals.",
      stockSymbol: quote.symbol,
    },
    meta: {
      lastUpdated: null,
      source: "prelaunch",
      status: "not_live",
      isLive: false,
    },
  };
}

/**
 * Fetch dashboard data.
 * Prelaunch returns empty placeholders. Live adapters go here later.
 */
export async function getDashboardData(): Promise<DashboardData> {
  // TODO: Robinhood Chain pool balances, Bankr fees, Chainlink valuation, Blockscout holders.
  if (!isLive()) {
    return createEmptyDashboard();
  }

  // Live path reserved — do not invent values.
  return createEmptyDashboard();
}
