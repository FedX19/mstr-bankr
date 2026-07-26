/**
 * BTC USD daily history via CoinGecko public API (no key, rate-limited).
 */

import type { AdapterResult } from "./types";

export type BtcHistoryPoint = {
  date: string; // YYYY-MM-DD
  priceUsd: number;
};

export async function fetchBtcHistory(
  days = 365,
): Promise<AdapterResult<BtcHistoryPoint[]>> {
  const source = "coingecko-btc-market_chart";
  const fetchedAt = new Date().toISOString();
  try {
    const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`;
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
    const json = (await res.json()) as {
      prices?: [number, number][];
    };
    const prices = json.prices ?? [];
    // Deduplicate by UTC day (keep last)
    const byDay = new Map<string, number>();
    for (const [ts, price] of prices) {
      const date = new Date(ts).toISOString().slice(0, 10);
      byDay.set(date, price);
    }
    const points = [...byDay.entries()]
      .map(([date, priceUsd]) => ({ date, priceUsd }))
      .sort((a, b) => a.date.localeCompare(b.date));

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
