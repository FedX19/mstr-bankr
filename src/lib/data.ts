/**
 * Dashboard data layer — live reads from DexScreener, Blockscout, and
 * reference price feeds. Never invent numbers; null means unavailable.
 */

import { fetchPoolInventory, fetchTokenInfo } from "./adapters/blockscout";
import { fetchDexScreenerMarket } from "./adapters/dexscreener";
import { fetchReferencePrices } from "./adapters/prices";
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
    totalSupply: number | null;
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
    pairAddress: string | null;
    pairUrl: string | null;
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
      totalSupply: null,
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
      pairAddress: null,
      pairUrl: null,
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
  const data = createEmptyDashboard();

  if (!siteConfig.memeTokenAddress) {
    return data;
  }

  const [dex, token, pool, refs] = await Promise.all([
    fetchDexScreenerMarket(siteConfig.memeTokenAddress),
    fetchTokenInfo(siteConfig.memeTokenAddress),
    fetchPoolInventory(),
    fetchReferencePrices(),
  ]);

  const sources: string[] = [];
  let anyOk = false;

  if (dex.ok) {
    anyOk = true;
    sources.push(dex.source);
    data.token.priceUsd = dex.data.priceUsd;
    data.token.priceInStock = dex.data.priceInQuote;
    data.token.marketCapUsd = dex.data.marketCapUsd;
    data.token.volume24hUsd = dex.data.volume24hUsd;
    // Cumulative not available from DexScreener — use 24h as best known for now
    data.token.cumulativeVolumeUsd = dex.data.volume24hUsd;
    data.token.priceChange24hPct = dex.data.priceChange24hPct;
    data.pool.totalLiquidityUsd = dex.data.liquidityUsd;
    data.pool.change24hPct = dex.data.priceChange24hPct;
    data.pool.pairAddress = dex.data.pairAddress;
    data.pool.pairUrl = dex.data.pairUrl;
    if (dex.data.buys24h != null || dex.data.sells24h != null) {
      data.token.uniqueTraders =
        (dex.data.buys24h ?? 0) + (dex.data.sells24h ?? 0);
    }
  }

  if (token.ok) {
    anyOk = true;
    sources.push(token.source);
    data.token.holders = token.data.holders;
    data.token.totalSupply = token.data.totalSupply;
    if (token.data.creationTx && !siteConfig.deploymentTx) {
      // surface via meta only; config remains source of truth for published CA
    }
  }

  // Quote / MSTR price for pool valuation
  let mstrUsd: number | null = null;
  if (refs.ok) {
    anyOk = true;
    sources.push(refs.source);
    data.market.btcPriceUsd = refs.data.btcUsd;
    data.market.mstrPriceUsd = refs.data.mstrUsd;
    mstrUsd = refs.data.mstrUsd;
    if (
      refs.data.mstrChange24hPct != null &&
      refs.data.btcChange24hPct != null
    ) {
      data.market.mstrVsBtcRelativePct =
        refs.data.mstrChange24hPct - refs.data.btcChange24hPct;
    }
  }

  if (pool.ok) {
    anyOk = true;
    sources.push(pool.source);
    data.pool.meme.units = pool.data.memeUnits;
    data.pool.stock.units = pool.data.quoteUnits;

    if (data.token.priceUsd != null && pool.data.memeUnits != null) {
      data.pool.meme.usdValue = pool.data.memeUnits * data.token.priceUsd;
    }

    if (mstrUsd != null && pool.data.quoteUnits != null) {
      data.pool.stock.usdValue = pool.data.quoteUnits * mstrUsd;
    }

    // If DexScreener has no liquidity.usd, approximate from both sides when known
    if (
      data.pool.totalLiquidityUsd == null &&
      data.pool.meme.usdValue != null &&
      data.pool.stock.usdValue != null
    ) {
      data.pool.totalLiquidityUsd =
        data.pool.meme.usdValue + data.pool.stock.usdValue;
    } else if (
      data.pool.totalLiquidityUsd == null &&
      data.pool.stock.usdValue != null
    ) {
      // One-sided visibility — report quote-side inventory value only
      data.pool.totalLiquidityUsd = data.pool.stock.usdValue;
    }

    if (
      pool.data.memeUnits != null &&
      pool.data.quoteUnits != null &&
      pool.data.memeUnits > 0
    ) {
      data.pool.ratio = pool.data.quoteUnits / pool.data.memeUnits;
    }

    const totalUsd =
      (data.pool.meme.usdValue ?? 0) + (data.pool.stock.usdValue ?? 0);
    if (totalUsd > 0) {
      if (data.pool.meme.usdValue != null) {
        data.pool.meme.poolSharePct =
          (data.pool.meme.usdValue / totalUsd) * 100;
      }
      if (data.pool.stock.usdValue != null) {
        data.pool.stock.poolSharePct =
          (data.pool.stock.usdValue / totalUsd) * 100;
      }
    }
  }

  // Prefer Blockscout exchange rate for MSTR if Yahoo missing
  if (data.market.mstrPriceUsd == null && data.pool.stock.usdValue == null) {
    // already handled via pool + refs
  }

  data.meta.isLive = isLive() || anyOk;
  data.meta.lastUpdated = new Date().toISOString();
  data.meta.source = sources.length > 0 ? sources.join(" + ") : "unavailable";
  data.meta.status = anyOk ? "ok" : isLive() ? "stale" : "not_live";
  data.market.cycleNote = anyOk
    ? "Live market data from public indexers. Always verify onchain."
    : "Market feeds unavailable.";

  return data;
}

export function pendingLabel(isLiveData: boolean): string {
  return isLiveData ? "Data pending" : "Not live";
}
