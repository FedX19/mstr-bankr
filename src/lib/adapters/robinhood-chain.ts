/**
 * Robinhood Chain data adapter (read-only).
 *
 * Uses RPC for balances, transfers and verification after launch.
 * Do not invent pool addresses or accept non-canonical stock tokens.
 */

import { siteConfig } from "../config";
import type { AdapterResult, PoolBalances } from "./types";

export function getChainConfig() {
  return {
    chainId: siteConfig.chain.chainId,
    rpcUrl: siteConfig.chain.rpcUrl,
    explorerUrl: siteConfig.chain.explorerUrl,
  };
}

/**
 * Fetch primary pool balances.
 * Prelaunch / missing config → not available.
 */
export async function fetchPoolBalances(): Promise<
  AdapterResult<PoolBalances>
> {
  const source = "robinhood-chain-rpc";
  const fetchedAt = new Date().toISOString();

  if (!siteConfig.poolAddress || !siteConfig.memeTokenAddress) {
    return {
      ok: false,
      error: "Pool and meme contracts not configured (prelaunch).",
      fetchedAt,
      source,
    };
  }

  // TODO: eth_call balanceOf / Uniswap V4 pool state via read-only RPC.
  // Reject mismatched chain IDs. Verify stock token against Robinhood registry.
  return {
    ok: false,
    error: "Live pool reads not wired yet.",
    fetchedAt,
    source,
  };
}

export function isCanonicalStockAddress(
  address: string,
  expected: string | null,
): boolean {
  if (!expected) return false;
  return address.toLowerCase() === expected.toLowerCase();
}
