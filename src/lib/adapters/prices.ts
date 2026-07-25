/**
 * Reference market prices (BTC, optional equity).
 * Prefer public free endpoints; never invent values.
 */

import type { AdapterResult } from "./types";

export type ReferencePrices = {
  btcUsd: number | null;
  btcChange24hPct: number | null;
  mstrUsd: number | null;
  mstrChange24hPct: number | null;
};

export async function fetchReferencePrices(): Promise<
  AdapterResult<ReferencePrices>
> {
  const source = "coingecko+yahoo";
  const fetchedAt = new Date().toISOString();

  let btcUsd: number | null = null;
  let btcChange24hPct: number | null = null;
  let mstrUsd: number | null = null;
  let mstrChange24hPct: number | null = null;

  try {
    const cg = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true",
      { next: { revalidate: 60 }, headers: { Accept: "application/json" } },
    );
    if (cg.ok) {
      const json = (await cg.json()) as {
        bitcoin?: { usd?: number; usd_24h_change?: number };
      };
      btcUsd = json.bitcoin?.usd ?? null;
      btcChange24hPct = json.bitcoin?.usd_24h_change ?? null;
    }
  } catch {
    // leave null
  }

  try {
    const yh = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/MSTR?interval=1d&range=5d",
      {
        next: { revalidate: 60 },
        headers: {
          Accept: "application/json",
          "User-Agent": "RoaringStackerDashboard/1.0",
        },
      },
    );
    if (yh.ok) {
      const json = (await yh.json()) as {
        chart?: {
          result?: Array<{
            meta?: {
              regularMarketPrice?: number;
              chartPreviousClose?: number;
              previousClose?: number;
            };
          }>;
        };
      };
      const meta = json.chart?.result?.[0]?.meta;
      mstrUsd = meta?.regularMarketPrice ?? null;
      const prev = meta?.previousClose ?? meta?.chartPreviousClose;
      if (mstrUsd != null && prev != null && prev !== 0) {
        mstrChange24hPct = ((mstrUsd - prev) / prev) * 100;
      }
    }
  } catch {
    // leave null
  }

  if (btcUsd == null && mstrUsd == null) {
    return {
      ok: false,
      error: "Reference price feeds unavailable",
      fetchedAt,
      source,
    };
  }

  return {
    ok: true,
    data: { btcUsd, btcChange24hPct, mstrUsd, mstrChange24hPct },
    fetchedAt,
    source,
  };
}
