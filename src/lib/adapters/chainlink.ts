/**
 * Chainlink valuation support for Robinhood Stock Tokens.
 * Use onchain feeds on Robinhood Chain when available; never fabricate prices.
 */

import type { AdapterResult, StockOraclePrice } from "./types";
import { getQuoteAsset } from "../config";

export async function fetchStockOraclePrice(): Promise<
  AdapterResult<StockOraclePrice>
> {
  const source = "chainlink-onchain";
  const fetchedAt = new Date().toISOString();

  // TODO: read Robinhood Chain per-asset Chainlink feed for the quote stock.
  return {
    ok: false,
    error: "Oracle feed not configured (prelaunch).",
    fetchedAt,
    source,
  };
}

/** Typed empty placeholder for UI when oracle is offline. */
export function emptyOraclePrice(): StockOraclePrice {
  const quote = getQuoteAsset();
  return {
    symbol: quote.symbol,
    priceUsd: null,
    updatedAt: null,
    feedAddress: null,
  };
}
