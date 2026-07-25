/**
 * DexScreener public API for STACKR / MSTR pair on Robinhood Chain.
 * https://api.dexscreener.com/latest/dex/tokens/{address}
 */

import { siteConfig } from "../config";
import type { AdapterResult } from "./types";

export type DexScreenerPair = {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: { address: string; name: string; symbol: string };
  quoteToken: { address: string; name: string; symbol: string };
  priceNative: string | null;
  priceUsd: string | null;
  txns?: {
    h24?: { buys: number; sells: number };
    h1?: { buys: number; sells: number };
  };
  volume?: { h24?: number; h6?: number; h1?: number };
  priceChange?: { h24?: number; h1?: number; h6?: number };
  liquidity?: { usd?: number; base?: number; quote?: number };
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
};

export type MarketSnapshot = {
  priceUsd: number | null;
  priceInQuote: number | null;
  marketCapUsd: number | null;
  fdvUsd: number | null;
  volume24hUsd: number | null;
  priceChange24hPct: number | null;
  buys24h: number | null;
  sells24h: number | null;
  liquidityUsd: number | null;
  pairAddress: string | null;
  pairUrl: string | null;
  quoteSymbol: string | null;
};

const DEX_BASE = "https://api.dexscreener.com/latest/dex/tokens";

export async function fetchDexScreenerMarket(
  tokenAddress: string = siteConfig.memeTokenAddress ?? "",
): Promise<AdapterResult<MarketSnapshot>> {
  const source = "dexscreener";
  const fetchedAt = new Date().toISOString();

  if (!tokenAddress) {
    return {
      ok: false,
      error: "No meme token address configured.",
      fetchedAt,
      source,
    };
  }

  try {
    const res = await fetch(`${DEX_BASE}/${tokenAddress}`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return {
        ok: false,
        error: `DexScreener HTTP ${res.status}`,
        fetchedAt,
        source,
      };
    }

    const json = (await res.json()) as { pairs?: DexScreenerPair[] | null };
    const pairs = json.pairs ?? [];
    if (pairs.length === 0) {
      return {
        ok: false,
        error: "No pairs returned for token.",
        fetchedAt,
        source,
      };
    }

    // Prefer STACKR / MSTR (or configured quote) on robinhood
    const quoteSym = siteConfig.quoteAssetSymbol.toUpperCase();
    const preferred =
      pairs.find(
        (p) =>
          p.chainId === "robinhood" &&
          p.quoteToken.symbol.toUpperCase() === quoteSym &&
          p.baseToken.address.toLowerCase() === tokenAddress.toLowerCase(),
      ) ??
      pairs.find(
        (p) =>
          p.baseToken.address.toLowerCase() === tokenAddress.toLowerCase(),
      ) ??
      pairs[0];

    const tx = preferred.txns?.h24;
    const data: MarketSnapshot = {
      priceUsd: parseNum(preferred.priceUsd),
      priceInQuote: parseNum(preferred.priceNative),
      marketCapUsd: preferred.marketCap ?? preferred.fdv ?? null,
      fdvUsd: preferred.fdv ?? preferred.marketCap ?? null,
      volume24hUsd: preferred.volume?.h24 ?? null,
      priceChange24hPct: preferred.priceChange?.h24 ?? null,
      buys24h: tx?.buys ?? null,
      sells24h: tx?.sells ?? null,
      liquidityUsd: preferred.liquidity?.usd ?? null,
      pairAddress: preferred.pairAddress ?? null,
      pairUrl: preferred.url ?? null,
      quoteSymbol: preferred.quoteToken?.symbol ?? null,
    };

    return { ok: true, data, fetchedAt, source };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "DexScreener fetch failed",
      fetchedAt,
      source,
    };
  }
}

function parseNum(v: string | number | null | undefined): number | null {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}
