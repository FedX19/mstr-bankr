/**
 * Sunday Stack Check — composed daily snapshot for Strategy BTC + STACKR/MSTR.
 * Published snapshot is cached per UTC day and refreshed by cron (~21:00 UTC).
 */

import { unstable_cache } from "next/cache";
import { fetchBtcHistory, type BtcHistoryPoint } from "./adapters/btc-history";
import {
  fetchPoolInventory,
  fetchTokenInfo,
} from "./adapters/blockscout";
import { fetchDexScreenerMarket } from "./adapters/dexscreener";
import {
  fetchRhjMstrSnapshot,
  type RhjMstrSnapshot,
} from "./adapters/robinhood-rhj";
import {
  fetchStrategyLedger,
  type LedgerEvent,
  type StrategyLedgerSnapshot,
} from "./adapters/strategy-ledger";
import { getQuoteAsset, siteConfig } from "./config";
import { formatNumber, formatUsd } from "./format";

/** Marker for future repost rewards detection */
export const STACK_CHECK_TWEET_MARKER = "#SundayStackCheck";

export type DataSourceMeta = {
  id: string;
  label: string;
  ok: boolean;
  fetchedAt: string | null;
  error: string | null;
  detail?: string;
};

export type PoolStrip = {
  stackrAddress: string | null;
  poolId: string | null;
  poolAddress: string | null;
  mstrInPool: number | null;
  stackrInPool: number | null;
  poolValueUsd: number | null;
  volume24hUsd: number | null;
  volumeWeeklyUsd: number | null;
  uniqueTraders24h: number | null;
  holders: number | null;
  creatorFeesUsd: number | null;
};

export type StackCheckSnapshot = {
  /** Stable id for this published card day (UTC YYYY-MM-DD) — use for rewards */
  snapshotId: string;
  weekEnding: string; // Sunday date YYYY-MM-DD
  generatedAt: string;
  strategy: StrategyLedgerSnapshot | null;
  rhj: RhjMstrSnapshot | null;
  btcHistory: BtcHistoryPoint[];
  chartEvents: LedgerEvent[];
  pool: PoolStrip;
  sources: DataSourceMeta[];
  errors: string[];
  tagline: string;
  disclaimer: string;
  pairLine: string;
  /** Stable marker for repost detection */
  tweetMarker: string;
};

/** UTC calendar date YYYY-MM-DD — daily snapshot identity */
export function dailySnapshotId(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/** Most recent Sunday (UTC) on or before today. */
export function weekEndingSunday(d = new Date()): string {
  const x = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
  const day = x.getUTCDay(); // 0 = Sunday
  x.setUTCDate(x.getUTCDate() - day);
  return x.toISOString().slice(0, 10);
}

/**
 * Canonical tweet body for share + future rewards.
 * Keep this template stable; detection can match snapshotId + marker + link.
 */
export function buildStackCheckTweet(data: StackCheckSnapshot): string {
  const s = data.strategy;
  const reserve =
    s?.reserveValueUsd != null
      ? formatUsd(s.reserveValueUsd, { compact: true })
      : s?.reserveValueUsdM != null
        ? `$${formatNumber(s.reserveValueUsdM, { digits: 1 })}M`
        : "—";
  const btc =
    s?.totalBtc != null
      ? formatNumber(s.totalBtc, { digits: s.totalBtc >= 100 ? 0 : 2 })
      : "—";
  const avg =
    s?.averageCostUsd != null
      ? formatUsd(s.averageCostUsd, { digits: 0 })
      : "—";

  const base =
    (siteConfig.officialWebsite ?? "https://roaring-stackr.com").replace(
      /\/$/,
      "",
    );
  const pageUrl = `${base}/stack-check`;

  return [
    `Stack Check — ${data.snapshotId}`,
    `Week ending ${data.weekEnding}`,
    ``,
    `Strategy BTC reserve: ${reserve}`,
    `Total BTC: ${btc}`,
    `Avg cost: ${avg}`,
    ``,
    data.tagline,
    siteConfig.thesisLine,
    ``,
    data.tweetMarker,
    `$${siteConfig.ticker} × Strategy`,
    pageUrl,
  ].join("\n");
}

/** Live fetch — used by cron to refresh the published daily snapshot. */
export async function fetchStackCheckSnapshot(): Promise<StackCheckSnapshot> {
  const generatedAt = new Date().toISOString();
  const snapshotId = dailySnapshotId();
  const weekEnding = weekEndingSunday();
  const sources: DataSourceMeta[] = [];
  const errors: string[] = [];
  const quote = getQuoteAsset();

  const [ledgerRes, rhjRes, btcRes, dexRes, tokenRes, poolRes] =
    await Promise.all([
      fetchStrategyLedger(),
      fetchRhjMstrSnapshot(quote.address),
      // Multi-year series so purchase markers align to real dates
      fetchBtcHistory(2000),
      fetchDexScreenerMarket(siteConfig.memeTokenAddress ?? ""),
      fetchTokenInfo(siteConfig.memeTokenAddress ?? ""),
      fetchPoolInventory(),
    ]);

  sources.push({
    id: "strategy-ledger",
    label: "Strategy Bitcoin Ledger",
    ok: ledgerRes.ok,
    fetchedAt: ledgerRes.fetchedAt,
    error: ledgerRes.ok ? null : ledgerRes.error,
    detail: ledgerRes.ok
      ? `${ledgerRes.data.events.length} events · ${ledgerRes.data.ledgerUrl}`
      : undefined,
  });
  sources.push({
    id: "rhj",
    label: "Robinhood RHJ assets + MSTR price",
    ok: rhjRes.ok,
    fetchedAt: rhjRes.fetchedAt,
    error: rhjRes.ok ? null : rhjRes.error,
    detail: rhjRes.ok
      ? `canonical ${rhjRes.data.canonicalContract ?? "—"} · verified=${rhjRes.data.registryVerified}`
      : undefined,
  });
  sources.push({
    id: "btc-history",
    label: "BTC USD price history",
    ok: btcRes.ok,
    fetchedAt: btcRes.fetchedAt,
    error: btcRes.ok ? null : btcRes.error,
    detail: btcRes.ok
      ? `${btcRes.data.length} daily points · ${btcRes.source}`
      : undefined,
  });
  sources.push({
    id: "dexscreener",
    label: "DexScreener STACKR market",
    ok: dexRes.ok,
    fetchedAt: dexRes.fetchedAt,
    error: dexRes.ok ? null : dexRes.error,
  });
  sources.push({
    id: "blockscout",
    label: "Robinhood Chain Blockscout",
    ok: tokenRes.ok || poolRes.ok,
    fetchedAt: tokenRes.fetchedAt,
    error:
      !tokenRes.ok && !poolRes.ok
        ? [tokenRes.ok ? null : tokenRes.error, poolRes.ok ? null : poolRes.error]
            .filter(Boolean)
            .join("; ")
        : null,
  });

  if (!ledgerRes.ok) errors.push(`Strategy ledger: ${ledgerRes.error}`);
  if (!rhjRes.ok) errors.push(`Robinhood RHJ: ${rhjRes.error}`);
  if (!btcRes.ok) errors.push(`BTC history: ${btcRes.error}`);

  // Enrich reserve value if nav missing but we have BTC + spot
  let strategy = ledgerRes.ok ? ledgerRes.data : null;
  if (strategy && strategy.reserveValueUsd == null && strategy.totalBtc != null) {
    const lastBtc = btcRes.ok
      ? btcRes.data[btcRes.data.length - 1]?.priceUsd
      : null;
    if (lastBtc != null) {
      strategy = {
        ...strategy,
        reserveValueUsd: strategy.totalBtc * lastBtc,
      };
    }
  }

  const pool: PoolStrip = {
    stackrAddress: siteConfig.memeTokenAddress,
    poolId: siteConfig.poolId,
    poolAddress: siteConfig.poolAddress,
    mstrInPool: poolRes.ok ? poolRes.data.quoteUnits : null,
    stackrInPool: poolRes.ok ? poolRes.data.memeUnits : null,
    poolValueUsd: dexRes.ok ? dexRes.data.liquidityUsd : null,
    volume24hUsd: dexRes.ok ? dexRes.data.volume24hUsd : null,
    // DexScreener does not expose weekly — leave null rather than invent
    volumeWeeklyUsd: null,
    uniqueTraders24h: dexRes.ok
      ? (dexRes.data.buys24h ?? 0) + (dexRes.data.sells24h ?? 0) || null
      : null,
    holders: tokenRes.ok ? tokenRes.data.holders : null,
    creatorFeesUsd: null,
  };

  // Prefer liquidity from pool sides when possible
  if (
    pool.poolValueUsd == null &&
    pool.mstrInPool != null &&
    rhjRes.ok &&
    rhjRes.data.quote?.mid != null
  ) {
    const mstrSide = pool.mstrInPool * rhjRes.data.quote.mid;
    const stackrSide =
      pool.stackrInPool != null && dexRes.ok && dexRes.data.priceUsd != null
        ? pool.stackrInPool * dexRes.data.priceUsd
        : 0;
    pool.poolValueUsd = mstrSide + stackrSide;
  }

  return {
    snapshotId,
    weekEnding,
    generatedAt,
    strategy,
    rhj: rhjRes.ok ? rhjRes.data : null,
    btcHistory: btcRes.ok ? btcRes.data : [],
    chartEvents: strategy?.events ?? [],
    pool,
    sources,
    errors,
    tagline: "Watch the reserve. Watch the wheel.",
    disclaimer:
      "$STACKR is a meme token. Holders do not own MSTR, BTC, pool assets, or creator fees.",
    pairLine:
      "Buying $STACKR through the MSTR pair adds tokenized MSTR exposure to the pool.",
    tweetMarker: STACK_CHECK_TWEET_MARKER,
  };
}

/**
 * Published daily snapshot (stable for share + rewards until cron refreshes).
 * Cached per UTC day; invalidated by /api/cron/stack-check.
 */
export async function getPublishedStackCheckSnapshot(): Promise<StackCheckSnapshot> {
  const id = dailySnapshotId();
  return unstable_cache(
    async () => fetchStackCheckSnapshot(),
    ["stack-check-daily", id],
    {
      // Hold until cron revalidates; still expires after 26h as safety net
      revalidate: 60 * 60 * 26,
      tags: ["stack-check", `stack-check-${id}`],
    },
  )();
}

/** @deprecated use getPublishedStackCheckSnapshot */
export async function getStackCheckSnapshot(): Promise<StackCheckSnapshot> {
  return getPublishedStackCheckSnapshot();
}
