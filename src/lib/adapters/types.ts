/**
 * Shared types for onchain and API adapters.
 * Adapters are stubs until launch gates clear and endpoints are confirmed.
 */

export type AdapterResult<T> =
  | { ok: true; data: T; fetchedAt: string; source: string }
  | { ok: false; error: string; fetchedAt: string; source: string };

export type PoolBalances = {
  memeUnits: bigint | null;
  stockUnits: bigint | null;
  poolAddress: string | null;
};

export type CreatorFeeSnapshot = {
  totalUsd: number | null;
  claimedUsd: number | null;
  unclaimedUsd: number | null;
  beneficiary: string | null;
};

export type StockOraclePrice = {
  symbol: string;
  priceUsd: number | null;
  updatedAt: string | null;
  feedAddress: string | null;
};
