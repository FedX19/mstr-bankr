/**
 * BTC USD daily history.
 * Primary: CoinGecko. Fallback: Blockchain.com charts (full history, no key).
 */

import type { AdapterResult } from "./types";

export type BtcHistoryPoint = {
  date: string; // YYYY-MM-DD
  priceUsd: number;
};

function dedupeByDay(
  entries: Array<{ date: string; priceUsd: number }>,
): BtcHistoryPoint[] {
  const byDay = new Map<string, number>();
  for (const e of entries) {
    if (!Number.isFinite(e.priceUsd) || e.priceUsd <= 0) continue;
    byDay.set(e.date, e.priceUsd);
  }
  return [...byDay.entries()]
    .map(([date, priceUsd]) => ({ date, priceUsd }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

async function fetchFromCoinGecko(
  days: number,
): Promise<AdapterResult<BtcHistoryPoint[]>> {
  const source = "coingecko-btc-market_chart";
  const fetchedAt = new Date().toISOString();
  try {
    // CoinGecko free tier is unreliable for `days=max`; prefer 365 / numeric.
    const d = days >= 2000 ? 365 : Math.min(Math.max(days, 30), 365);
    const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${d}`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "RoaringStackerStackCheck/1.0",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return {
        ok: false,
        error: `CoinGecko HTTP ${res.status}`,
        fetchedAt,
        source,
      };
    }
    const json = (await res.json()) as { prices?: [number, number][] };
    const prices = json.prices ?? [];
    const points = dedupeByDay(
      prices.map(([ts, price]) => ({
        date: new Date(ts).toISOString().slice(0, 10),
        priceUsd: price,
      })),
    );
    if (points.length === 0) {
      return {
        ok: false,
        error: "No BTC price points returned",
        fetchedAt,
        source,
      };
    }
    return { ok: true, data: points, fetchedAt, source };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "BTC history failed",
      fetchedAt,
      source,
    };
  }
}

/** Full multi-year daily series — free, no key. */
async function fetchFromBlockchainInfo(): Promise<
  AdapterResult<BtcHistoryPoint[]>
> {
  const source = "blockchain-info-market-price";
  const fetchedAt = new Date().toISOString();
  try {
    const url =
      "https://api.blockchain.info/charts/market-price?timespan=all&format=json";
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "RoaringStackerStackCheck/1.0",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return {
        ok: false,
        error: `Blockchain.com HTTP ${res.status}`,
        fetchedAt,
        source,
      };
    }
    const json = (await res.json()) as {
      values?: Array<{ x: number; y: number }>;
    };
    const values = json.values ?? [];
    // Keep from 2020 onward (Strategy era) for chart clarity, include buffer
    const start = Date.UTC(2019, 0, 1) / 1000;
    const points = dedupeByDay(
      values
        .filter((v) => v.x >= start && v.y > 0)
        .map((v) => ({
          date: new Date(v.x * 1000).toISOString().slice(0, 10),
          priceUsd: v.y,
        })),
    );
    if (points.length < 2) {
      return {
        ok: false,
        error: "Blockchain.com returned insufficient points",
        fetchedAt,
        source,
      };
    }
    return { ok: true, data: points, fetchedAt, source };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Blockchain.com failed",
      fetchedAt,
      source,
    };
  }
}

/**
 * Fetch BTC USD history. Tries CoinGecko first, then Blockchain.com.
 * Prefer multi-year series when Blockchain.com is used so purchase markers align.
 */
export async function fetchBtcHistory(
  days = 365,
): Promise<AdapterResult<BtcHistoryPoint[]>> {
  // Prefer Blockchain.com for long multi-year charts (Strategy ledger span)
  if (days > 400) {
    const chain = await fetchFromBlockchainInfo();
    if (chain.ok) return chain;
    const cg = await fetchFromCoinGecko(365);
    if (cg.ok) return cg;
    return chain.ok === false ? chain : cg;
  }

  const cg = await fetchFromCoinGecko(days);
  if (cg.ok) return cg;
  const chain = await fetchFromBlockchainInfo();
  if (chain.ok) {
    // Trim to requested window when possible
    const cutoff = new Date();
    cutoff.setUTCDate(cutoff.getUTCDate() - days);
    const cut = cutoff.toISOString().slice(0, 10);
    const trimmed = chain.data.filter((p) => p.date >= cut);
    if (trimmed.length >= 2) {
      return { ...chain, data: trimmed };
    }
    return chain;
  }
  return cg;
}
