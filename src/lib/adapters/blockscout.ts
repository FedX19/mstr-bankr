/**
 * Robinhood Chain Blockscout API (read-only).
 * https://robinhoodchain.blockscout.com/api/v2/
 */

import { getQuoteAsset, siteConfig } from "../config";
import type { AdapterResult } from "./types";

const EXPLORER = siteConfig.chain.explorerUrl.replace(/\/$/, "");
const API = `${EXPLORER}/api/v2`;
const RPC = siteConfig.chain.rpcUrl;

/** Uniswap V4 PoolManager on Robinhood Chain — holds ERC-20 balances for pools. */
export const POOL_MANAGER =
  "0x8366a39CC670B4001A1121B8F6A443A643e40951" as const;

export type TokenInfo = {
  address: string;
  name: string | null;
  symbol: string | null;
  decimals: number;
  totalSupply: number | null;
  holders: number | null;
  exchangeRateUsd: number | null;
  volume24h: number | null;
  creationTx: string | null;
};

export type PoolInventory = {
  memeUnits: number | null;
  quoteUnits: number | null;
  poolManager: string;
};

export async function fetchTokenInfo(
  address: string = siteConfig.memeTokenAddress ?? "",
): Promise<AdapterResult<TokenInfo>> {
  const source = "blockscout-token";
  const fetchedAt = new Date().toISOString();
  if (!address) {
    return { ok: false, error: "No token address", fetchedAt, source };
  }

  try {
    const [tokenRes, addrRes] = await Promise.all([
      fetch(`${API}/tokens/${address}`, {
        next: { revalidate: 60 },
        headers: { Accept: "application/json" },
      }),
      fetch(`${API}/addresses/${address}`, {
        next: { revalidate: 120 },
        headers: { Accept: "application/json" },
      }),
    ]);

    if (!tokenRes.ok) {
      return {
        ok: false,
        error: `Token API HTTP ${tokenRes.status}`,
        fetchedAt,
        source,
      };
    }

    const token = (await tokenRes.json()) as {
      address_hash?: string;
      name?: string;
      symbol?: string;
      decimals?: string;
      total_supply?: string;
      holders_count?: string;
      exchange_rate?: string | null;
      volume_24h?: string | null;
    };

    let creationTx: string | null = null;
    if (addrRes.ok) {
      const addr = (await addrRes.json()) as {
        creation_transaction_hash?: string;
      };
      creationTx = addr.creation_transaction_hash ?? null;
    }

    const decimals = Number(token.decimals ?? 18);
    const data: TokenInfo = {
      address: token.address_hash ?? address,
      name: token.name ?? null,
      symbol: token.symbol ?? null,
      decimals,
      totalSupply: fromUnits(token.total_supply, decimals),
      holders: token.holders_count != null ? Number(token.holders_count) : null,
      exchangeRateUsd:
        token.exchange_rate != null ? Number(token.exchange_rate) : null,
      volume24h: token.volume_24h != null ? Number(token.volume_24h) : null,
      creationTx,
    };

    return { ok: true, data, fetchedAt, source };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Blockscout token fetch failed",
      fetchedAt,
      source,
    };
  }
}

export async function fetchPoolInventory(): Promise<
  AdapterResult<PoolInventory>
> {
  const source = "blockscout+rpc-pool";
  const fetchedAt = new Date().toISOString();
  const meme = siteConfig.memeTokenAddress;
  const quote = getQuoteAsset().address;

  if (!meme || !quote) {
    return {
      ok: false,
      error: "Meme or quote token address missing",
      fetchedAt,
      source,
    };
  }

  try {
    const [memeBal, quoteBal] = await Promise.all([
      balanceOf(meme, POOL_MANAGER),
      balanceOf(quote, POOL_MANAGER),
    ]);

    return {
      ok: true,
      data: {
        memeUnits: memeBal,
        quoteUnits: quoteBal,
        poolManager: POOL_MANAGER,
      },
      fetchedAt,
      source,
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Pool inventory fetch failed",
      fetchedAt,
      source,
    };
  }
}

/** Quote asset (MSTR) USD price from Blockscout token exchange_rate when present. */
export async function fetchQuoteTokenUsd(): Promise<
  AdapterResult<{ priceUsd: number | null; symbol: string }>
> {
  const quote = getQuoteAsset();
  const source = "blockscout-quote";
  const fetchedAt = new Date().toISOString();

  if (!quote.address) {
    return {
      ok: false,
      error: "Quote address missing",
      fetchedAt,
      source,
    };
  }

  try {
    const res = await fetch(`${API}/tokens/${quote.address}`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      return {
        ok: false,
        error: `Quote token HTTP ${res.status}`,
        fetchedAt,
        source,
      };
    }
    const json = (await res.json()) as { exchange_rate?: string | null };
    const priceUsd =
      json.exchange_rate != null ? Number(json.exchange_rate) : null;
    return {
      ok: true,
      data: {
        priceUsd: Number.isFinite(priceUsd as number) ? priceUsd : null,
        symbol: quote.symbol,
      },
      fetchedAt,
      source,
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Quote price fetch failed",
      fetchedAt,
      source,
    };
  }
}

async function balanceOf(
  token: string,
  holder: string,
): Promise<number | null> {
  // ERC-20 balanceOf(address)
  const data =
    "0x70a08231" + holder.replace(/^0x/i, "").toLowerCase().padStart(64, "0");
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [{ to: token, data }, "latest"],
    }),
    next: { revalidate: 30 },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { result?: string };
  if (!json.result || json.result === "0x") return null;
  return fromUnits(BigInt(json.result).toString(), 18);
}

function fromUnits(
  raw: string | null | undefined,
  decimals: number,
): number | null {
  if (raw == null || raw === "") return null;
  try {
    const bi = BigInt(raw);
    const base = BigInt(10) ** BigInt(decimals);
    const whole = bi / base;
    const frac = bi % base;
    const fracStr = frac.toString().padStart(decimals, "0").slice(0, 8);
    return Number(`${whole}.${fracStr}`);
  } catch {
    return null;
  }
}
